import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import ElementItem from './ElementItem';
import ResetButton from './ResetButton';
import { useEffect } from 'react';
import { useElementCombiner } from '../lib/useElementCombiner';
import { useAudio } from '../lib/stores/useAudio';
import { toast } from 'sonner';

interface WorkspaceProps {
  workspaceItems: {id: string, uniqueId: string}[];
  setWorkspaceItems: React.Dispatch<React.SetStateAction<{id: string, uniqueId: string}[]>>;
}

const Workspace = ({ workspaceItems, setWorkspaceItems }: WorkspaceProps) => {
  const { elements, unlockElement } = useElementsStore();
  const { checkCombination } = useElementCombiner();
  const { playHit, playSuccess, playTierSound } = useAudio();

  // Check for combinations whenever workspace items change
  useEffect(() => {
    if (workspaceItems.length >= 2) {
      // Get the actual element data for the items
      const itemElements = workspaceItems.map(item => ({
        ...elements[item.id],
        uniqueId: item.uniqueId
      }));
      
      // Check if any two elements combine
      for (let i = 0; i < itemElements.length; i++) {
        for (let j = i + 1; j < itemElements.length; j++) {
          const result = checkCombination(itemElements[i].id, itemElements[j].id);
          
          if (result) {
            // Remove the two combined elements
            const newItems = workspaceItems.filter(item => 
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
            
            setWorkspaceItems(newItems);
            
            // Unlock the new element
            const isNewDiscovery = !elements[result.id].unlocked;
            unlockElement(result.id);
            
            // Play tier-specific sound for new discoveries
            if (isNewDiscovery) {
              const tier = elements[result.id].tier || 0;
              if (tier > 0) {
                playTierSound(tier);
              } else {
                playSuccess();
              }
              
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
  }, [workspaceItems, elements, unlockElement, checkCombination, playHit, playSuccess, playTierSound]);

  // Set up drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item: { id: string }) => {
      // Play sound when dropping items
      playHit();
      
      // Add the dropped element
      setWorkspaceItems(prev => [
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
    setWorkspaceItems([]);
  };

  // Remove a single item from the workspace
  const removeItem = (uniqueId: string) => {
    setWorkspaceItems(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  return (
    <div 
      ref={drop}
      className={`flex-1 p-4 overflow-hidden relative ${isOver ? 'bg-[#580a5b]/30' : 'bg-workspace'}`}
    >
      <div className="h-full w-full border-4 border-dashed border-yellow-500/30 rounded-lg overflow-auto p-4 relative">
        <div className="absolute top-4 right-4 z-10">
          <ResetButton onReset={handleClear} />
        </div>
        
        {workspaceItems.length === 0 && (
          <div className="flex items-center justify-center h-full text-yellow-500/50 text-xl">
            <p>Drag elements here to combine them</p>
          </div>
        )}
        
        <AnimatePresence>
          <div className="flex flex-wrap gap-4 p-2">
            {workspaceItems.map((item) => {
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
