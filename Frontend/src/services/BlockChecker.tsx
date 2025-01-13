
import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';


const BlockChecker = () => {
  const navigate = useNavigate()
  const isBlocked = useSelector((state: RootState) => state.user.userInfo?.isVerified);
  console.log("isblocked", isBlocked);
  

  useEffect(() => {
    if (isBlocked) {
      navigate('/login')
    }
  }, [isBlocked]);
};

export default BlockChecker;
