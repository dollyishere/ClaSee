import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Menu, { MenuProps } from '@mui/material/Menu';

const StepThree = () => {
  const lessonIntroRef = useRef(null);

  return (
    <div>
      <h2>Step 3. 강의 소개 입력</h2>
      <textarea cols={30} rows={10} placeholder="강의 소개를 입력해주세요." ref={lessonIntroRef} />
    </div>
  );
};

export default StepThree;
