import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styles from './ComparisonPage.module.css';

interface ComparisonPageProps {
  onBack: () => void;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ onBack }) => {
  const { session } = useAuth();
  const [counterparts, setCounterparts] = useState<any[]>([]);
  const [selectedCpId, setSelectedCpId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCpId) {
      fetchAnalysesForCp(selectedCpId);
    }
  }, [selectedCpId]);

  const fetchData = async () => {
    if (!session?.user) return;
    try {
      const { data: cpData } = await supabase
        .from('counterparts')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (cpData && cpData.length > 0) {
        setCounterparts(cpData);
        setSelectedCpId(cpData[0].id);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysesForCp = async (cpId: string) => {
    const { data } = await supabase
      .from('analyses')
      .select('*')
      .eq('counterpart_id', cpId)
      .order('created_at', { ascending: true });
    setAnalyses(data || []);
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>데이터를 분석하는 중...</div>;

  const current = analyses[analyses.length - 1];
  const previous = analyses[analyses.length - 2];

  const getAdvice = () => {
    if (!current || !previous) return "비교할 이전 데이터가 부족합니다. 한 번 더 분석을 진행해 보세요!";
    const delta = current.score_total - previous.score_total;
    
    if (delta > 10) return "관계가 급속도로 가까워지고 있어요! 상대방이 당신에게 마음을 열고 있다는 강력한 증거입니다. 지금의 텐션을 유지하세요.";
    if (delta < -10) return "주의가 필요합니다. 최근 연락 빈도나 답변의 온도가 식었을 가능성이 높아요. 잠시 거리를 두며 상대의 반응을 살피는 것을 추천합니다.";
    return "안정적인 흐름을 유지하고 있습니다. 큰 변화는 없지만, 관계가 고착화되지 않도록 새로운 이벤트나 데이트를 제안해 보세요.";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>←</button>
        <h1 style={{fontSize: '1.5em', fontWeight: 800}}>이전 분석 비교</h1>
      </header>

      {/* 4. 상대방 선택 (Dropdown) */}
      <div className={styles.selectorWrapper}>
        <label className={styles.selectorLabel}>비교할 상대방 선택</label>
        <select 
          className={styles.cpSelect}
          value={selectedCpId || ''}
          onChange={(e) => setSelectedCpId(e.target.value)}
        >
          {counterparts.map(cp => (
            <option key={cp.id} value={cp.id}>{cp.nickname}</option>
          ))}
        </select>
      </div>

      {analyses.length > 0 ? (
        <>
          {/* 1. 관계 온도 변화 그래프 (Score Trend) */}
          <section className={styles.sectionCard}>
            <h2 style={{fontSize: '1.1em', marginBottom: '20px'}}>📈 썸 점수 트렌드</h2>
            <div className={styles.chartWrapper}>
              <svg className={styles.svgChart} viewBox="0 0 500 150">
                {/* 배경 가이드 라인 */}
                {[0, 50, 100, 150].map(y => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                ))}

                {/* 점들을 잇는 선 (Polyline) */}
                <polyline
                  fill="none"
                  stroke="#ff69b4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={analyses.map((a, i) => {
                    const x = (i / (analyses.length - 1 || 1)) * 460 + 20;
                    const y = 150 - (a.score_total / 100) * 120 - 15;
                    return `${x},${y}`;
                  }).join(' ')}
                  className={styles.pathAnimation}
                />

                {/* 데이터 포인트 점 (Circles) */}
                {analyses.map((a, i) => {
                  const x = (i / (analyses.length - 1 || 1)) * 460 + 20;
                  const y = 150 - (a.score_total / 100) * 120 - 15;
                  return (
                    <g key={a.id}>
                      <circle 
                        cx={x} cy={y} r="5" 
                        fill={i === analyses.length - 1 ? '#ff69b4' : '#fff'} 
                        stroke="#ff69b4" strokeWidth="2" 
                      />
                      <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ff69b4">
                        {a.score_total}
                      </text>
                      <text x={x} y="145" textAnchor="middle" fontSize="9" fill="#999">
                        {new Date(a.created_at).getMonth() + 1}/{new Date(a.created_at).getDate()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p style={{marginTop: '25px', textAlign: 'center', fontSize: '0.9em', color: '#666'}}>
              {previous ? `이전 분석 대비 점수가 ${current.score_total - previous.score_total}점 변했습니다.` : '데이터가 더 쌓이면 정확한 추세 확인이 가능합니다.'}
            </p>
          </section>

          {/* 2 & 3. Then & Now 비교 및 신호등 (Delta Indicators) */}
          {previous && (
            <section className={styles.sectionCard}>
              <h2 style={{fontSize: '1.1em', marginBottom: '20px'}}>🆚 핵심 지표 비교 (이전 vs 현재)</h2>
              <div className={styles.comparisonGrid}>
                <div className={styles.compareItem}>
                  <div className={styles.itemLabel}>연락 텀</div>
                  <div className={styles.itemValue}>{current.contact_frequency}</div>
                  <div className={`${styles.delta} ${current.contact_frequency === previous.contact_frequency ? styles.stable : styles.up}`}>
                    {current.contact_frequency === previous.contact_frequency ? '● 유지' : '▲ 변화'}
                  </div>
                </div>
                <div className={styles.compareItem}>
                  <div className={styles.itemLabel}>선톡 비율</div>
                  <div className={styles.itemValue}>{current.initiative_ratio}</div>
                  <div className={`${styles.delta} ${current.initiative_ratio === previous.initiative_ratio ? styles.stable : styles.up}`}>
                    {current.initiative_ratio === previous.initiative_ratio ? '● 유지' : '▲ 변화'}
                  </div>
                </div>
                <div className={styles.compareItem}>
                  <div className={styles.itemLabel}>만남 형태</div>
                  <div className={styles.itemValue}>{current.meeting_type?.split(' ')[0]}</div>
                  <div className={styles.delta}>현 상태 유지</div>
                </div>
                <div className={styles.compareItem}>
                  <div className={styles.itemLabel}>행동 지표</div>
                  <div className={styles.itemValue}>{current.behavioral_signals?.length}개 감지</div>
                  <div className={`${styles.delta} ${current.behavioral_signals?.length >= previous.behavioral_signals?.length ? styles.up : styles.down}`}>
                    {current.behavioral_signals?.length >= previous.behavioral_signals?.length ? '▲ 상승' : '▼ 하락'}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. 변화에 따른 AI 가이드 (Dynamic Advice) */}
          <section className={styles.adviceCard}>
            <div className={styles.adviceTitle}>💡 관계 변화 분석 가이드</div>
            <p className={styles.adviceText}>{getAdvice()}</p>
          </section>
        </>
      ) : (
        <div style={{textAlign: 'center', padding: '100px 20px', color: '#999'}}>
          분석 데이터가 없습니다. 먼저 분석을 진행해 주세요.
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
