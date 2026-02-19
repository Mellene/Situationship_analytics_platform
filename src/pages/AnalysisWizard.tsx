import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styles from './AnalysisWizard.module.css';

interface AnalysisWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const AnalysisWizard: React.FC<AnalysisWizardProps> = ({ onComplete, onCancel }) => {
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 0: Counterpart Info
    counterpartName: '',

    // Step 1: Context
    hasPartner: '',
    relationshipContext: '',
    physicalDistance: '',

    // Step 2: Quantitative
    contactPeriod: '',
    contactFrequency: '',
    initiativeRatio: '',
    activeTime: '',

    // Step 3: Offline
    meetingCount: 0,
    meetingPeriod: '',
    meetingInitiative: '',
    meetingType: '',
    dateCourses: [] as string[],

    // Step 4: Qualitative
    behavioralSignals: [] as string[],

    // Step 5: Images (Simple file input placeholder)
    chatImages: [] as string[],
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (listKey: 'dateCourses' | 'behavioralSignals', value: string) => {
    setFormData(prev => {
      const currentList = prev[listKey];
      const newList = currentList.includes(value)
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      return { ...prev, [listKey]: newList };
    });
  };

  const calculateFinalScore = () => {
    let score = 50; // 기본 시작 점수

    // 1. MD (Meeting Density & Quality) - 30점 만점
    const mCount = formData.meetingCount || 0;
    const mTypeBonus = formData.meetingType === '항상 1:1로 만남' ? 5 : 0;
    const distanceAdjustment = formData.physicalDistance === '장거리' || formData.physicalDistance === '해외' ? 1.5 : 1.0;
    const mdScore = Math.min(30, (mCount * 5 * distanceAdjustment) + mTypeBonus);
    
    // 2. RV (Response & Reactivity) - 25점 만점
    const rvMap: Record<string, number> = {
      '칼답/실시간': 25,
      '1~2시간': 20,
      '반나절': 12,
      '하루 1~2회': 5,
      '며칠에 한 번': 0
    };
    let rvScore = rvMap[formData.contactFrequency] || 10;
    if (formData.activeTime === '밤~새벽') rvScore += 3; // 친밀 시간대 보너스

    // 3. IN (Initiative - 상대방의 주도성) - 20점 만점
    const initiativeMap: Record<string, number> = {
      '상대가 주로 함': 20,
      '비슷함': 15,
      '내가 주로 함': 5
    };
    const inScore = (initiativeMap[formData.initiativeRatio] || 10) + 
                    (formData.meetingInitiative === '주로 상대방' ? 5 : 0);

    // 4. PS (Progress Signals - 행동 지표) - 25점 만점
    const signalScore = formData.behavioralSignals.length * 4; // 개당 4점
    const courseBonus = formData.dateCourses.includes('저녁 식사와 술') ? 3 : 0;
    const psScore = Math.min(25, signalScore + courseBonus);

    // 총합 계산
    score = mdScore + rvScore + inScore + psScore;

    // 필터링 및 최종 가중치 (상대 연애 유무)
    if (formData.hasPartner === '연인 있음') score *= 0.1;
    else if (formData.hasPartner === '애매함') score *= 0.7;

    const finalScore = Math.round(Math.max(0, Math.min(100, score)));
    
    // 단계 결정
    let stage = '관심 낮음';
    if (finalScore >= 90) stage = '연애 직전';
    else if (finalScore >= 75) stage = '썸 확정';
    else if (finalScore >= 60) stage = '썸 가능';
    else if (finalScore >= 40) stage = '호감 단계';
    else if (formData.hasPartner === '연인 있음') stage = '불가능(차단 권장)';

    return { finalScore, stage };
  };

  const handleSubmit = async () => {
    if (!session?.user) return;
    setIsSubmitting(true);

    const { finalScore, stage } = calculateFinalScore();
    const summary = `${formData.counterpartName}님과의 관계는 현재 '${stage}' 단계입니다. ${
      finalScore > 70 ? '긍정적인 신호가 많이 포착되었습니다.' : '조금 더 지켜볼 필요가 있는 관계입니다.'
    }`;

    try {
      // 1. Create or get Counterpart
      const { data: cpData, error: cpError } = await supabase
        .from('counterparts')
        .insert([{ user_id: session.user.id, nickname: formData.counterpartName }])
        .select()
        .single();

      if (cpError) throw cpError;

      // 2. Create Analysis record
      const { error: analysisError } = await supabase
        .from('analyses')
        .insert([{
          user_id: session.user.id,
          counterpart_id: cpData.id,
          score_total: finalScore,
          stage: stage,
          summary_public: summary,
          relationship_context: formData.relationshipContext,
          physical_distance: formData.physicalDistance,
          has_partner: formData.hasPartner,
          contact_frequency: formData.contactFrequency,
          initiative_ratio: formData.initiativeRatio,
          active_time: formData.activeTime,
          meeting_initiative: formData.meetingInitiative,
          meeting_type: formData.meetingType,
          date_courses: formData.dateCourses,
          behavioral_signals: formData.behavioralSignals,
        }]);

      if (analysisError) throw analysisError;

      onComplete();
    } catch (err) {
      console.error('Submission failed:', err);
      alert('데이터 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className={styles.stepTitle}>[Step 1] 관계의 배경</h2>
            <p className={styles.stepDescription}>가장 먼저 두 사람이 어떤 상황인지 알려주세요.</p>
            
            <div className={styles.formGroup}>
              <label>분석할 상대방의 이름(닉네임)</label>
              <input 
                type="text" 
                placeholder="상대방을 지칭할 이름을 적어주세요"
                className={styles.optionBtn} style={{width: '100%', textAlign: 'left'}}
                value={formData.counterpartName}
                onChange={(e) => updateFormData('counterpartName', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>상대방의 현재 연애 유무</label>
              <div className={styles.optionGrid}>
                {['솔로', '애매함', '연인 있음'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.hasPartner === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('hasPartner', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>두 사람이 알게 된 경로</label>
              <div className={styles.optionGrid}>
                {['소개팅', '직장/학교 동료', '동호회/모임', '데이팅 앱', '오래된 친구'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.relationshipContext === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('relationshipContext', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>서로의 물리적 거리</label>
              <div className={styles.optionGrid}>
                {['같은 동네', '1시간 이내', '장거리', '해외'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.physicalDistance === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('physicalDistance', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className={styles.stepTitle}>[Step 2] 연락 데이터</h2>
            <p className={styles.stepDescription}>비대면 상호작용은 썸의 아주 중요한 지표입니다.</p>
            
            <div className={styles.formGroup}>
              <label>평균 연락 텀 (답장 시간)</label>
              <div className={styles.optionGrid}>
                {['칼답/실시간', '1~2시간', '반나절', '하루 1~2회', '며칠에 한 번'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.contactFrequency === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('contactFrequency', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>선톡(먼저 연락)의 비율</label>
              <div className={styles.optionGrid}>
                {['상대가 주로 함', '비슷함', '내가 주로 함'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.initiativeRatio === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('initiativeRatio', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>연락이 가장 활발한 시간대</label>
              <div className={styles.optionGrid}>
                {['일과 중(낮)', '퇴근 후 저녁', '밤~새벽'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.activeTime === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('activeTime', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className={styles.stepTitle}>[Step 3] 오프라인 만남</h2>
            <p className={styles.stepDescription}>직접 만났을 때의 텐션을 파악합니다.</p>
            
            <div className={styles.formGroup}>
              <label>약속의 주도권 (주로 누가 제안하는지)</label>
              <div className={styles.optionGrid}>
                {['주로 상대방', '비슷함', '주로 나'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.meetingInitiative === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('meetingInitiative', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>만남의 형태</label>
              <div className={styles.optionGrid}>
                {['항상 1:1로 만남', '주로 여럿이 모임', '처음엔 여럿, 지금은 1:1'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.meetingType === opt ? styles.selected : ''}`}
                    onClick={() => updateFormData('meetingType', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>주요 데이트(만남) 코스 (중복 선택)</label>
              <div className={styles.optionGrid}>
                {['가벼운 식사/카페', '저녁 식사와 술', '영화/전시회', '산책/스포츠'].map(opt => (
                  <button 
                    key={opt}
                    className={`${styles.optionBtn} ${formData.dateCourses.includes(opt) ? styles.selected : ''}`}
                    onClick={() => handleCheckboxChange('dateCourses', opt)}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className={styles.stepTitle}>[Step 4] 정성적 지표</h2>
            <p className={styles.stepDescription}>상대방의 사소한 행동들을 체크해 보세요.</p>
            
            <div className={styles.checkboxList}>
              {[
                '묻지 않아도 본인의 일상을 공유함 (사진 등)',
                '대화 중 "나중에 같이 가보자"는 말을 자주 함',
                '내가 지나가듯 말한 사소한 디테일을 기억함',
                '상대방도 나에 대해 질문을 많이 함 (역질문)',
                '누구랑 만나는지 은근히 궁금해하거나 확인하려 함',
                '답장이 늦어지면 미안하다는 사유를 말함'
              ].map(opt => (
                <div key={opt} className={styles.checkboxItem} onClick={() => handleCheckboxChange('behavioralSignals', opt)}>
                  <input 
                    type="checkbox" 
                    checked={formData.behavioralSignals.includes(opt)}
                    readOnly
                  />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.progressBar}>
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`${styles.progressStep} ${currentStep === step ? styles.active : ''} ${currentStep > step ? styles.completed : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      {renderStep()}

      <div className={styles.footer}>
        {currentStep === 1 ? (
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={onCancel}>취소</button>
        ) : (
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => setCurrentStep(prev => prev - 1)}>이전</button>
        )}

        {currentStep < 4 ? (
          <button 
            className={`${styles.navBtn} ${styles.nextBtn}`} 
            onClick={() => {
              if (currentStep === 1 && !formData.counterpartName) {
                alert('상대방 이름을 입력해주세요!');
                return;
              }
              setCurrentStep(prev => prev + 1);
            }}
          >
            다음 단계
          </button>
        ) : (
          <button 
            className={`${styles.navBtn} ${styles.submitBtn}`} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '분석 완료 및 저장'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalysisWizard;
