import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import ElementItem from './ElementItem';
import ResetButton from './ResetButton';
import { useState, useEffect } from 'react';
import { useElementCombiner } from '../lib/useElementCombiner';
import { useAudio } from '../lib/stores/useAudio';
import { toast } from 'sonner';

const Workspace = () => {
  const [items, setItems] = useState<{id: string, uniqueId: string}[]>([]);
  const { elements, unlockElement } = useElementsStore();
  const { checkCombination } = useElementCombiner();
  const { playHit, playSuccess } = useAudio();

  // Check for combinations whenever workspace items change
  useEffect(() => {
    if (items.length >= 2) {
      // Get the actual element data for the items
      const itemElements = items.map(item => ({
        ...elements[item.id],
        uniqueId: item.uniqueId
      }));
      
      // Check if any two elements combine
      for (let i = 0; i < itemElements.length; i++) {
        for (let j = i + 1; j < itemElements.length; j++) {
          const result = checkCombination(itemElements[i].id, itemElements[j].id);
          
          if (result) {
            // Remove the two combined elements
            const newItems = items.filter(item => 
              item.uniqueId !== itemElements[i].uniqueId && 
              item.uniqueId !== itemElements[j].uniqueId
            );
            
            // Add the resulting element if it's not already there
            const resultAlreadyInWorkspace = newItems.some(item => item.id === result.id);
            
            if (!resultAlreadyInWorkspace) {
              newItems.push({
                id: result.id,
                uniqueId: `${result.id}-${Date.now()}`
              });
            }
            
            setItems(newItems);
            
            // Unlock the new element
            const isNewDiscovery = !elements[result.id].unlocked;
            unlockElement(result.id);
            
            // Play sound and show toast for new discoveries
            if (isNewDiscovery) {
              playSuccess();
              toast.success(`Discovered: ${result.name}!`, {
                description: result.description || `You combined elements to create ${result.name}`,
                duration: 3000,
              });
            } else {
              playHit();
            }
            
            return;
          }
        }
      }
    }
  }, [items, elements, unlockElement, checkCombination, playHit, playSuccess]);

  // Set up drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item: { id: string }) => {
      // Play sound when dropping items
      playHit();
      
      // Add the dropped element
      setItems(prev => [
        ...prev, 
        { 
          id: item.id, 
          uniqueId: `${item.id}-${Date.now()}` 
        }
      ]);
      
      return { name: 'Workspace' };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Handle clearing the workspace
  const handleClear = () => {
    setItems([]);
  };

  // Remove a single item from the workspace
  const removeItem = (uniqueId: string) => {
    setItems(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  return (
    <div 
      ref={drop}
      className={`flex-1 p-4 overflow-hidden relative ${isOver ? 'bg-[#580a5b]/30' : 'bg-[#430045]'}`}
    >
      <div className="h-full w-full border-4 border-dashed border-yellow-500/30 rounded-lg overflow-auto p-4 relative">
        <div className="absolute top-4 right-4 z-10">
          <ResetButton onReset={handleClear} />
        </div>
        
        {items.length === 0 && (
          <div className="flex items-center justify-center h-full text-yellow-500/50 text-xl">
            <p>Drag elements here to combine them</p>
          </div>
        )}
        
        <AnimatePresence>
          <div className="flex flex-wrap gap-4 p-2">
            {items.map((item) => {
              const element = elements[item.id];
              if (!element) return null;
              
              return (
                <motion.div
                  key={item.uniqueId}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <ElementItem
                    id={element.id}
                    name={element.name}
                    icon={element.icon} 
                    isInWorkspace={true}
                    onRemove={() => removeItem(item.uniqueId)}
                  />
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Workspace;
