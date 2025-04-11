import { useDrag } from 'react-dnd';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ElementIcon } from '../assets/icons';

export interface ElementProps {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isNew?: boolean;
  isInWorkspace?: boolean;
  onRemove?: () => void;
}

const ElementItem = ({ id, name, icon, description, isNew = false, isInWorkspace = false, onRemove }: ElementProps) => {
  const [showNew, setShowNew] = useState(isNew);
  
  // Reset the "new" animation after 5 seconds
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setShowNew(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { id, name, icon },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={isNew ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        "relative flex flex-col items-center justify-center p-2 rounded-lg cursor-grab transition-all duration-300 select-none",
        isInWorkspace ? "bg-[#5a005e]/50 w-20 h-20" : "bg-[#5a005e] w-16 h-16 hover:bg-[#7e0084]",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      {showNew && (
        <motion.div 
          className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-1 rounded-full z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          NEW!
        </motion.div>
      )}
      
      <div className="text-2xl mb-1 text-yellow-300">
        <ElementIcon icon={icon} />
      </div>
      
      <div className="text-xs text-center font-medium text-yellow-100 truncate w-full">
        {name}
      </div>
      
      {isInWorkspace && onRemove && (
        <button 
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

export default ElementItem;
