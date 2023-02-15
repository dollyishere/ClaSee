import React, { useEffect, useState } from 'react';
import { Card, CardContent, Modal, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import useViewModel from '../viewmodels/PhotoCardsViewModel';
import { PhotoCardType } from '../types/PhotoCardType';
import PrivateInfoState from '../models/PrivateInfoAtom';
import PhotoCard from '../components/PhotoCard';

const MyPhotoBookPage = () => {
  const userInfo = useRecoilValue(PrivateInfoState);
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [photoCards, setPhotoCards] = useState<Array<PhotoCardType>>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showBack, setShowBack] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<PhotoCardType>();

  const { getMyPhotoCards, deletePhotoCard } = useViewModel();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleIsFocusedTrue = (idx: number) => {
    setSelectedCard(photoCards[idx]);
    setIsFocused(true);
  };
  const handleIsFocusedFalse = () => {
    setShowBack(false);
    setIsFocused(false);
  };

  const handleDeletePhotoCard = async (photoCard: PhotoCardType) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const response = await deletePhotoCard(photoCard.id);
      if (response.statusCode === 200) {
        const newPhotoCards = photoCards;
        const index = newPhotoCards.indexOf(photoCard);
        if (index > -1) {
          newPhotoCards.splice(index, 1);
          setPhotoCards([...newPhotoCards]);
        }
        handleIsFocusedFalse();
      }
    }
  };

  useEffect(() => {
    if (userInfo === null) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    } else {
      const getData = async () => {
        const limit = 6;
        const offset = (page - 1) * limit;
        const response = await getMyPhotoCards(userInfo.email, limit, offset);
        console.log('adwwdw', response);
        setCount(Math.ceil(response.count / limit));
        setPhotoCards(response.page);
      };
      getData();
    }
  }, [page]);
  return (
    <div className="my-photo-book-page">
      <Card className="my-photo-book-page__card">
        <CardContent className="my-photo-book-page__card-content">
          <div className="my-photo-book-page__title">포토북</div>
          <div className="my-photo-book-page__list">
            {photoCards.map((photoCard: PhotoCardType, i: number) => (
              <div
                role="presentation"
                className="my-photo-book-page__card"
                key={photoCard.id}
                onClick={() => handleIsFocusedTrue(i)}
              >
                <PhotoCard
                  photoCard={photoCard}
                  back={false}
                  handleDeletePhotoCard={handleDeletePhotoCard}
                />
              </div>
            ))}
          </div>
          <div className="my-photo-book-page__pagination">
            <Pagination
              variant="outlined"
              count={count}
              page={page}
              shape="rounded"
              size="large"
              onChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      {isFocused && selectedCard !== undefined ? (
        <Modal open={isFocused} onClose={handleIsFocusedFalse}>
          <div
            role="presentation"
            className="my-photo-book-page__modal"
            onClick={() => setShowBack((prev: boolean) => !prev)}
          >
            <PhotoCard
              photoCard={selectedCard}
              back={showBack}
              handleDeletePhotoCard={handleDeletePhotoCard}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default MyPhotoBookPage;
