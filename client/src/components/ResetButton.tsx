import { motion } from 'framer-motion';
import { useState } from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton = ({ onReset }: ResetButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <motion.button
      onClick={onReset}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-[#5a005e] hover:bg-[#7e0084] text-yellow-300 px-4 py-2 rounded-md transition-colors flex items-center shadow-md"
    >
      <i className="fas fa-broom mr-2"></i>
      <span>Clear</span>
      
      {isHovering && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-0 right-0 mx-auto text-xs text-yellow-200 whitespace-nowrap bg-[#430045] p-1 rounded"
        >
          Clear workspace
        </motion.div>
      )}
    </motion.button>
  );
};

export default ResetButton;
