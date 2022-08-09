import styled from '@emotion/styled';
import {AnimatePresence, motion} from 'framer-motion';
const variants = {
  hidden: {opacity: 0, x: 0, y: 220},
  enter: {opacity: 1, x: 0, y: 0},
  exit: {opacity: 0, x: 0, y: 220},
};

const Layout = ({children, isShow}) => {
  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{duration: 0.4, type: 'easeInOut'}}
          // style={{position: 'relative'}}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export {Layout};
