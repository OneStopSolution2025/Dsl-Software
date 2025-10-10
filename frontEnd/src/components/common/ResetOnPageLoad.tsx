import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetState } from '@/store';

export const ResetOnPageLoad = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the state when component mounts (page loads)
    dispatch(resetState());

    // Cleanup function to reset state when component unmounts (optional)
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default ResetOnPageLoad;
