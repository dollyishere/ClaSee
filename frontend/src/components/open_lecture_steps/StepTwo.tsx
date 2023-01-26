import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const StepTwo = () => {
  const fileRef = useRef<HTMLInputElement>(null);

  // 이미지 파일 src를 저장할 imgSrcList 변수를 useState(속성 array(string))으로 선언
  const [imgSrcList, setImgSrcList] = useState<string[]>([]);

  // 만약 사용자가 이미지를 input을 통해 추가했을 시, 이하 함수 실행
  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 사용자가 올린 파일 정보를 변수 img에 저장
    const img = e.target.files?.[0];

    // imageCompression을 통해 압축될 이미지 규격을 정함
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
    };

    // 만약 img 값이 null이 아니라면, 이하 과정을 거침
    if (img) {
      // compressedFile에 imageCompression에 요청을 보내 압축된 파일 정보를 받아옴
      const compressedFile = await imageCompression(img, options);
      // FormData를 통해, 파일 내용을 인코딩함
      // FormData를 사용하는 이유는, 페이지 전환 없이 폼 데이터를 제출하기 위함임
      const formData = new FormData();
      formData.append('image', compressedFile);

      // FileReader()를 이용해 파일 정보를 비동기적으로 읽어옴
      const fileReader = new FileReader();
      // compressedfile을 fileReader를 통해 로컬 내 주소를 불러옴
      // 해당 주소를 통해 미리보기 기능을 지원 가능함
      fileReader.readAsDataURL(compressedFile);

      // 파일을 성공적으로 읽었을 시(on_load가 이를 관장함), 해당 이벤트가 시작됨
      fileReader.onload = (event: ProgressEvent<FileReader>) => {
        // 파일을 읽은 결과물을 result에 할당함
        const result = event?.target?.result as string;
        // result를 setImgSrcList를 이용해 imgSrcList에 추가함
        setImgSrcList([...imgSrcList, result]);
      };
    }
  };

  // 마이너스 버튼 클릭 시, 해당하는 이미지는 imgSrcList 내에서 삭제됨
  const handleDeleteImage = (id: number) => {
    setImgSrcList(imgSrcList.filter((_, index) => index !== id));
  };

  return (
    <div>
      <h2>Step 2. 소개 사진 등록</h2>
      <div className="img__container">
        {/* 저장해둔 이미지들을 map을 통해 순회하면서 화면에 이미지 출력 */}
        {imgSrcList.map((image: string, id: number) => (
          <div>
            <img className="img__item" src={image} alt={`${image}-${id}`} />
            <RemoveCircleOutlineIcon className="img__delete" onClick={() => handleDeleteImage(id)} />
          </div>
        ))}
        {/* 만약 imgSrcList의 길이가 5 이상이라면, 더 이상 이미지를 추가할 수 없도록 버튼을 숨김 */}
        {imgSrcList.length < 5 ? (
          <label htmlFor="input-file" className="img-upload__label">
            <input hidden type="file" id="input-file" ref={fileRef} multiple onChange={handleAddImages} />
            <AddCircleOutlineIcon fill="#646F7C" className="img-upload__btn" />
          </label>
        ) : null}
      </div>
      <CardActions>
        <Link to="/open_lecture/1">
          <Button type="submit" variant="contained">
            이전 단계
          </Button>
        </Link>
        <Link to="/open_lecture/3">
          <Button type="submit" variant="contained">
            다음 단계
          </Button>
        </Link>
      </CardActions>
    </div>
  );
};

export default StepTwo;
