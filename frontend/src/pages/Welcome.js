import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  // After 2.5 seconds, trigger fade-out
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // Trigger exit animation if needed
      // After exit animation, wait a bit more and then navigate
      setTimeout(() => navigate('/dashboard'), 500);
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome">
      <AnimatePresence onExitComplete={() => navigate('/dashboard')}>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              backgroundColor: 'white',
            }}
          >
            <motion.h1
              style={{ fontSize: '3rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            >
              Welcome{' '}
              <motion.span
                className="user"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1 }}
              >
                Isaac
              </motion.span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Welcome;