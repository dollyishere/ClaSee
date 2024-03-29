import React, { useEffect, useState } from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import axios, { AxiosResponse } from 'axios';
import MyAppliedLessonCard from '../MyAppliedLessonCard';
import useViewModel from '../../viewmodels/MainPageViewModel';
import { LessonsResponse, Lesson } from '../../types/LessonsType';
import privateInfoState from '../../models/PrivateInfoAtom';
import Nolesson from './NoLesson';

// 로그인이 되었을 때만 이 컴포넌트가 보여짐
// 내가 신청한 강의를 get으로 api요청 보냄
// 강의가 있으면 강의카드를 보여주고
// 강의가 없다면(빈 배열이라면) 없음을 보여줌
const MyAppliedLessonsMainpage = () => {
  const message = '신청';
  const { getMyAppliedLessonsMainpage } = useViewModel();
  const [lessons, setLessons] = useState<Lesson[]>();
  const userInfo = useRecoilValue(privateInfoState);
  const limit = 2;
  const offset = 0;
  const status = 'TODO';
  const [flag, setFlag] = useState<boolean>(false);
  // 메인페이지 마운트 시 강의 정보들 요청

  useEffect(() => {
    if (userInfo) {
      getMyAppliedLessonsMainpage(userInfo.email, limit, offset, status).then(
        (response: LessonsResponse) => {
          if (response.lessonInfoList.length === 0) {
            setLessons(undefined);
          } else {
            setLessons(response.lessonInfoList);
          }
        },
      );
    }
  }, [flag]);
  return (
    <div className="applylessons">
      <h1 className="applylessons__title"> 신청한 클래스 </h1>
      <div className="applylessons__cards">
        {lessons ? (
          lessons.map((lesson: Lesson) => (
            <MyAppliedLessonCard
              lesson={lesson}
              flag={flag}
              setFlag={setFlag}
              key={lesson.lessonId}
            />
          ))
        ) : (
          <Nolesson message={message} />
        )}
      </div>
    </div>
  );
};

export default MyAppliedLessonsMainpage;
