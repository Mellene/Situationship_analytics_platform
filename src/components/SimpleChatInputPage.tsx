import React, { useState } from 'react';
import styles from './SimpleChatInputPage.module.css';

interface SimpleChatInputPageProps {
  onAnalyze: (chatData: string, meetCount: number, sumPeriod: string, replyInterval: string, imageData?: string) => void;
  onBack: () => void;
}

const TEMPLATES = {
  slowReply: `나: 뭐해?
상대: (5시간 후) 방금 일어났어
나: 아 그럼 더 자지 그랬어 ㅋㅋㅋ
상대: 응 그러려고 했는데 니 생각나서 일어났어`,
  goodContact: `나: 주말 잘 보냈어?
상대: 응 너는? 난 너랑 있었던 일 생각나서 혼자 웃었어 ㅋㅋ
나: ㅋㅋㅋ 뭐야 뭔데
상대: 비밀이야 다음에 만나면 말해줄게!`,
  ambiguous: `나: 요즘 뭐 바빠?
상대: 응 좀 바빴어. 그래도 너 연락은 항상 기다려!
나: 아 그래? 언제쯤 한가해져?
상대: 글쎄, 조만간 밥 한 번 먹자!`,
};

const SimpleChatInputPage: React.FC<SimpleChatInputPageProps> = ({ onAnalyze, onBack }) => {
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [meetCount, setMeetCount] = useState<string>('');
  const [sumPeriod, setSumPeriod] = useState<string>('');
  const [replyInterval, setReplyInterval] = useState<string>('');
  
  const [chatInputTouched, setChatInputTouched] = useState(false);
  const [imageTouched, setImageTouched] = useState(false);
  const [meetCountTouched, setMeetCountTouched] = useState(false);
  const [sumPeriodTouched, setSumPeriodTouched] = useState(false);
  const [replyIntervalTouched, setReplyIntervalTouched] = useState(false);

  const minLines = 10;
  const currentLines = chatInput.split('\n').filter(line => line.trim() !== '').length;

  const isChatInputValid = currentLines >= minLines;
  const isImageValid = selectedImage === null || (selectedImage !== null && ['image/png', 'image/jpeg', 'image/jpg'].includes(selectedImage.type)); // Image is optional OR valid if selected
  const isMeetCountValid = meetCount !== '';
  const isSumPeriodValid = sumPeriod !== '';
  const isReplyIntervalValid = replyInterval !== '';

  // Form is valid if chat input is valid AND other mandatory fields are valid
  const isFormValid = isChatInputValid && isMeetCountValid && isSumPeriodValid && isReplyIntervalValid;

  const handleTemplateClick = (template: keyof typeof TEMPLATES) => {
    setChatInput(TEMPLATES[template]);
    setChatInputTouched(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setImageTouched(true);
      } else {
        alert('PNG, JPG, JPEG 형식의 이미지만 업로드 가능합니다.');
        setSelectedImage(null);
        setImagePreview(null);
        setImageTouched(true);
      }
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };


  const handleSubmit = () => {
    setChatInputTouched(true);
    setImageTouched(true); // Still track if they tried to upload an invalid image
    setMeetCountTouched(true);
    setSumPeriodTouched(true);
    setReplyIntervalTouched(true);

    if (isFormValid) {
      onAnalyze(chatInput, parseInt(meetCount), sumPeriod, replyInterval, imagePreview || undefined);
    } else {
      let errorMessage = '모든 필수 항목을 입력해주세요:\n';
      if (!isChatInputValid) errorMessage += `- 대화 내용 (${minLines}줄 이상)\n`;
      // Image is optional, so no error if not provided, but error if invalid type provided
      if (selectedImage && !['image/png', 'image/jpeg', 'image/jpg'].includes(selectedImage.type)) errorMessage += `- 대화 이미지 (유효하지 않은 형식)\n`;
      if (!isMeetCountValid) errorMessage += `- 만난 횟수\n`;
      if (!isSumPeriodValid) errorMessage += `- 썸 기간\n`;
      if (!isReplyIntervalValid) errorMessage += `- 평균 답장 텀\n`;
      alert(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>← 뒤로</button>
      <h2 className={styles.title}>간이 대화 분석</h2>
      <p className={styles.description}>정확한 분석을 위해 모든 필수 항목을 입력해주세요.</p>

      <div className={styles.directInput}>
        <h3>① 대화 내용 직접 입력 (필수)</h3>
        <div className={styles.templateButtons}>
          <button onClick={() => handleTemplateClick('slowReply')}>답장 느린 썸</button>
          <button onClick={() => handleTemplateClick('goodContact')}>연락 잘되는 썸</button>
          <button onClick={() => handleTemplateClick('ambiguous')}>애매한 썸</button>
        </div>
        <textarea
          className={`${styles.chatTextarea} ${chatInputTouched && !isChatInputValid ? styles.invalidField : ''}`}
          placeholder={`대화 ${minLines}줄 이상 입력해주세요.\n(예시)\n나: 뭐해?\n상대: (5시간 후) 방금 일어났어`}
          value={chatInput}
          onChange={(e) => {
            setChatInput(e.target.value);
            setChatInputTouched(true);
          }}
        ></textarea>
        <p className={`${styles.progressMessage} ${isChatInputValid ? styles.valid : styles.invalid}`}>
          {isChatInputValid ? '👍 대화 내용 입력 완료!' : `대화 내용 ${minLines}줄 이상 필요합니다. (현재 ${currentLines}줄)`}
        </p>
      </div>

      <div className={styles.imageInputSection}>
        <h3>② 대화 이미지 첨부 (선택)</h3>
        <label htmlFor="imageUpload" className={`${styles.imageUploadLabel} ${imageTouched && !isImageValid ? styles.invalidField : ''}`}>
          {imagePreview ? '이미지 변경' : '이미지 선택'}
          <input
            id="imageUpload"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </label>
        {imagePreview && (
          <div className={styles.imagePreviewContainer}>
            <img src={imagePreview} alt="Conversation Preview" className={styles.imagePreview} />
          </div>
        )}
        <p className={`${styles.progressMessage} ${selectedImage === null ? '' : (isImageValid ? styles.valid : styles.invalid)}`}>
          {selectedImage === null ? '선택 사항입니다.' : (isImageValid ? '👍 이미지 첨부 완료!' : 'PNG, JPG, JPEG 형식의 이미지만 업부로드 가능합니다.')}
        </p>
      </div>

      <div className={styles.additionalQuestions}>
        <h3>③ 추가 정보 입력 (필수)</h3>
        <div className={styles.questionGroup}>
          <label htmlFor="meetCount">만난 횟수:</label>
          <select 
            id="meetCount" 
            value={meetCount} 
            onChange={(e) => {
              setMeetCount(e.target.value);
              setMeetCountTouched(true);
            }}
            className={meetCountTouched && !isMeetCountValid ? styles.invalidField : ''}
            required
          >
            <option value="">선택</option>
            <option value="0">0회</option>
            <option value="1">1-2회</option>
            <option value="2">3-5회</option>
            <option value="3">5회 이상</option>
          </select>
        </div>
        <div className={styles.questionGroup}>
          <label htmlFor="sumPeriod">썸 기간:</label>
          <select 
            id="sumPeriod" 
            value={sumPeriod} 
            onChange={(e) => {
              setSumPeriod(e.target.value);
              setSumPeriodTouched(true);
            }}
            className={sumPeriodTouched && !isSumPeriodValid ? styles.invalidField : ''}
            required
          >
            <option value="">선택</option>
            <option value="1w">1주 미만</option>
            <option value="1m">1주-1개월</option>
            <option value="3m">1-3개월</option>
            <option value="3m+">3개월 이상</option>
          </select>
        </div>
        <div className={styles.questionGroup}>
          <label htmlFor="replyInterval">평균 답장 텀:</label>
          <select 
            id="replyInterval" 
            value={replyInterval} 
            onChange={(e) => {
              setReplyInterval(e.target.value);
              setReplyIntervalTouched(true);
            }}
            className={replyIntervalTouched && !isReplyIntervalValid ? styles.invalidField : ''}
            required
          >
            <option value="">선택</option>
            <option value="5m">5분 이내</option>
            <option value="30m">30분 이내</option>
            <option value="1h">1시간 이내</option>
            <option value="3h">3시간 이내</option>
            <option value="6h">6시간 이내</option>
            <option value="12h">12시간 이내</option>
            <option value="1d">1일 이상</option>
          </select>
        </div>
      </div>

      <button className={styles.analyzeButton} onClick={handleSubmit} disabled={!isFormValid}>분석하기</button>
    </div>
  );
};

export default SimpleChatInputPage;
