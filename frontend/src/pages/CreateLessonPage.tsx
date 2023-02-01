import React, { useState, useRef, useMemo, createContext, useContext } from 'react';
import { useNavigate as navigate } from 'react-router-dom';

import '../styles/pages/_create-lesson-page.scss';

import { Button, Card, CardActions } from '@mui/material';

import StepOne from '../components/create-lesson-steps/StepOne';
import StepTwo from '../components/create-lesson-steps/StepTwo';
import StepThree from '../components/create-lesson-steps/StepThree';
import StepFour from '../components/create-lesson-steps/StepFour';
import StepFive from '../components/create-lesson-steps/StepFive';
import StepSix from '../components/create-lesson-steps/StepSix';

import CreateLessonModel from '../viewmodels/CreateLessonModel';

import { CheckListType, CurriculumType, PamphletType, CreateLessonRequest } from '../types/CreateLessonType';

const CreateLessonPage = () => {
  // component 전환의 기준이 되는 selectedComponent를 useState로 생성(기본값 1)
  const [selectedComponent, setSelectedComponent] = useState(1);

  // Step1의 강의명, 카테고리 선택값을 담기 위한 lessonName, categorySelect 각각 생성
  const [lessonNameState, setLessonNameState] = useState<string>('');
  const [categorySelectState, setCategorySelectState] = useState<string>('');
  // Step2의 강의 사진을 담기 위한 lessonImgListState 생성
  const [lessonImgListState, setLessonImgListState] = useState<string[]>([]);
  // Step3의 강의 상세 설명을 담기 위한 lessonDescState 생성
  const [lessonDescState, setlessonDescState] = useState<string>('');
  // Step4의 준비물 사진, 묘사를 담기 위한 materialImgListState, materialDescState 생성
  const [materialImgListState, setMaterialImgListState] = useState<string[]>([]);
  const [materialDescState, setMaterialDescState] = useState<string>('');
  // Step5의 커리큘럼 목록, 최대 참여 인원 수, 예상 최대 강의 시간을 담기 위한 curriListState, maximumState, runningtimeState 생성
  const [curriListState, setCurriListState] = useState<string[]>([]);
  const [maximumState, setMaximumState] = useState<number>(0);
  const [runningtimeState, setRunningtimeState] = useState<number>(0);
  // Step6의 기본 요금, 옵션 추가 시 설명과 요금을 담기 위한 basicPriceState, kitDescState, kitPriceState 생성
  const [basicPriceState, setBasicPriceState] = useState<number>(0);
  const [kitDescState, setKitDescState] = useState<string>('');
  const [kitPriceState, setKitPriceState] = useState<number>(0);

  const { createLesson } = CreateLessonModel();

  const handleCreateLessonSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (kitPriceState === 0) {
      setKitDescState('');
    }
    if (
      lessonNameState !== '' &&
      categorySelectState !== '' &&
      // lessonImgListState.length !== 0 &&
      // lessonDescState !== '' &&
      // materialImgListState.length !== 0 &&
      // materialDescState !== '' &&
      curriListState.length !== 0 &&
      maximumState !== 0 &&
      // runningtimeState !== 0 &&
      basicPriceState !== 0
      // kitPriceState !== 0
    ) {
      const checkList: CheckListType[] = lessonImgListState.map((lessonImg: string) => {
        return {
          img: lessonImg,
        };
      });
      const curriculumList: CurriculumType[] = curriListState.map((curriculum: string, id: number) => {
        return {
          stage: id,
          description: curriculum,
        };
      });
      const pamphletList: PamphletType[] = materialImgListState.map((materialImg: string) => {
        return {
          img: materialImg as string,
        };
      });

      const createLessonRequestBody: CreateLessonRequest = {
        category: categorySelectState,
        checkList: checkList as CheckListType[],
        cklsDescription: materialDescState,
        curriculumList: curriculumList as CurriculumType[],
        description: lessonDescState,
        email: 'test1234@gmail.com',
        kitDescription: kitDescState,
        kitPrice: kitPriceState,
        maximum: maximumState,
        name: lessonNameState,
        pamphletList: pamphletList as PamphletType[],
        price: basicPriceState,
        runningtime: runningtimeState,
      };

      const res = await createLesson(createLessonRequestBody);
      console.log(res);
      // if (res === 'Success') {
      //   alert('강의가 등록되었습니다.');
      //   // navigate('/');
      // }
    } else {
      alert('필수 입력값을 모두 입력해주십시오');
    }
  };

  return (
    <div className="container">
      {/* 페이지 제목 지정 */}
      <h1>강의 간편 개설하기</h1>
      {/* 카드로 form이 들어갈 영역 지정 */}
      {/* selectedComponent 값이 변환될 시, 해당하는 컴포넌트를 리렌더링함 */}
      {/* 해당하는 component에 필요한 props를 상속시켜줌 */}
      <Card sx={{ minWidth: 275 }}>
        {selectedComponent === 1 && (
          <StepOne
            lessonNameState={lessonNameState}
            setLessonNameState={setLessonNameState}
            categorySelectState={categorySelectState}
            setCategorySelectState={setCategorySelectState}
          />
        )}
        {selectedComponent === 2 && (
          <StepTwo limitNumber={5} imgSrcListState={lessonImgListState} setImgSrcListState={setLessonImgListState} />
        )}
        {selectedComponent === 3 && (
          <StepThree lessonDescState={lessonDescState} setLessonDescState={setlessonDescState} />
        )}
        {selectedComponent === 4 && (
          <StepFour
            limitNumber={10}
            imgSrcListState={materialImgListState}
            setImgSrcListState={setMaterialImgListState}
            materialDescState={materialDescState}
            setMaterialDescState={setMaterialDescState}
          />
        )}
        {selectedComponent === 5 && (
          <StepFive
            curriListState={curriListState}
            setCurriListState={setCurriListState}
            maximumState={maximumState}
            setMaximumState={setMaximumState}
            runningtimeState={runningtimeState}
            setRunningtimeState={setRunningtimeState}
          />
        )}
        {selectedComponent === 6 && (
          <StepSix
            basicPriceState={basicPriceState}
            setBasicPriceState={setBasicPriceState}
            kitDescState={kitDescState}
            setKitDescState={setKitDescState}
            kitPriceState={kitPriceState}
            setKitPriceState={setKitPriceState}
          />
        )}
        {/* 렌더링되는 컴포넌트가 무엇인지에 따라 버튼의 모습도 변화함 */}
        {/* 만약 selectedComponent의 값이 0이라면, 이전 단계를 볼 필요가 없으므로 해당 버튼을 숨김 */}
        {/* 이전 단계 버튼의 경우, 클릭할 때마다 onClick event로 selectedComponent 값을 1 감소시킴 */}
        {/* 이를 통해 현재 렌더링되는 컴포넌트를 리렌더링을 통해 변화시킴 */}
        <CardActions>
          {selectedComponent === 1 ? null : (
            <Button type="button" variant="contained" onClick={() => setSelectedComponent(selectedComponent - 1)}>
              이전 단계
            </Button>
          )}
          {/* 반대로 다음 단계 버튼의 경우, selectedComponent의 값이 6이라면 다음 단계 대신 강의 생성 버튼을 보이도록 함 */}
          {/* 마찬가지로 다음 단계 버튼의 경우 누를 때마다 selectedComponent 값을 1씩 증가시켜 재렌더링을 유도함 */}
          {selectedComponent === 6 ? (
            <Button type="button" variant="contained" onClick={handleCreateLessonSubmit}>
              강의 생성
            </Button>
          ) : (
            <Button type="button" variant="contained" onClick={() => setSelectedComponent(selectedComponent + 1)}>
              다음 단계
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
};
export default CreateLessonPage;
