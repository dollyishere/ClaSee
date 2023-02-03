import axios from 'axios';
import useApi from '../apis/LessonsApi';
import { LessonsResponse } from '../types/LessonsType';

const MainPageViewModel = () => {
  const {
    MyCreatedLessonsMainpageApi,
    MyAppliedLessonsMainpageApi,
    deleteMyAppliedLessonsMainpageApi,
  } = useApi();

  const getMyCreatedLessonsMainpage = async (userId: string) => {
    const res = await MyCreatedLessonsMainpageApi(userId);

    return res;
  };
  const getMyAppliedLessonsMainpage = async (userId: string) => {
    const res = await MyAppliedLessonsMainpageApi(userId);

    return res;
  };
  const deleteMyAppliedLessonsMainpage = async (
    userId: string,
    lessonId: number,
  ) => {
    const res = await deleteMyAppliedLessonsMainpageApi(userId, lessonId);

    return res;
  };
  return {
    getMyCreatedLessonsMainpage,
    getMyAppliedLessonsMainpage,
    deleteMyAppliedLessonsMainpage,
  };
};

export default MainPageViewModel;
