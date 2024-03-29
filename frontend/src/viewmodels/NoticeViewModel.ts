import useApi from '../apis/NoticeApi';
import { CreateNoticeRequest } from '../types/NoticeType';

const NoticeViewModel = () => {
  const {
    doCreateNotice,
    doGetNotices,
    doGetNotice,
    doUpdateNotice,
    doDeleteNotice,
  } = useApi();

  const deleteNotice = async (email: string, noticeId: string) => {
    const response = await doDeleteNotice(email, noticeId);
    return response;
  };

  const updateNotice = async (
    notice: CreateNoticeRequest,
    noticeId: string,
  ) => {
    const response = await doUpdateNotice(notice, noticeId);
    return response;
  };
  const createNotice = async (notice: CreateNoticeRequest) => {
    const response = await doCreateNotice(notice);
    return response;
  };

  const getNotices = async (limit: number, offset: number) => {
    const response = await doGetNotices(limit, offset);
    return response;
  };

  const getNotice = async (noticeId: string) => {
    const response = await doGetNotice(noticeId);
    return response;
  };

  return {
    createNotice,
    getNotices,
    getNotice,
    updateNotice,
    deleteNotice,
  };
};

export default NoticeViewModel;
