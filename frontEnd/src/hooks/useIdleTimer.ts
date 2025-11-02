import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { resetStepper } from "@/store/slices/stepperSlice";
import { clearFiles } from "@/store/slices/filesSlice";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const useIdleTimer = (timeout = 10 * 60 * 1000) => { // 10 minutes
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
     // Clear all app state before logging out
         dispatch(resetStepper());
         dispatch(clearFiles());
     
         dispatch(logout());
         navigate('/login');
    }, timeout);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => resetTimer();

    // Add event listeners
    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer(); // initialize

    return () => {
      // cleanup
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dispatch, timeout]);
};
