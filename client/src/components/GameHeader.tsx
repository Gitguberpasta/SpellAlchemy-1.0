import { motion } from 'framer-motion';
import { useState } from 'react';
import { useElementsStore } from '../lib/stores/useElementsStore';
import SettingsModal from './SettingsModal';
import AlchemyGallery from './AlchemyGallery';
import HintSystem from './HintSystem';

interface GameHeaderProps {
  toggleMute: () => void;
  isMuted: boolean;
  changeTheme?: (theme: string) => void;
  currentTheme?: string;
}

const GameHeader = ({ toggleMute, isMuted, changeTheme = () => {}, currentTheme = 'default' }: GameHeaderProps) => {
  const { elements } = useElementsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  
  // Count unlocked elements
  const unlockedCount = Object.values(elements).filter(el => el.unlocked).length;
  const totalCount = Object.values(elements).length;
  
  // Calculate progress percentage
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <>
      <header className="bg-[#5a005e] border-b border-yellow-500/30 p-3 flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold text-yellow-400"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <span className="mr-2">
            <i className="fas fa-mortar-pestle"></i>
          </span>
          Alchemy Kitchen
        </motion.div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-yellow-200 text-sm">
              {unlockedCount} / {totalCount} elements
            </div>
            <div className="w-36 h-2 bg-[#430045] rounded-full overflow-hidden mt-1">
              <motion.div 
                className="h-full bg-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <button 
            onClick={() => setHintsOpen(true)}
            className="text-yellow-300 hover:text-yellow-400 transition-colors p-2 relative" 
            title="Show Hints"
          >
            <i className="fas fa-lightbulb"></i>
          </button>
          
          <button 
            onClick={() => setGalleryOpen(true)}
            className="text-yellow-300 hover:text-yellow-400 transition-colors p-2" 
            title="Alchemy Gallery"
          >
            <i className="fas fa-book-open"></i>
          </button>
          
          <button 
            onClick={toggleMute}
            className="text-yellow-300 hover:text-yellow-400 transition-colors p-2"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
          </button>
          
          <button 
            onClick={() => setSettingsOpen(true)}
            className="text-yellow-300 hover:text-yellow-400 transition-colors p-2" 
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </header>
      
      {settingsOpen && (
        <SettingsModal 
          onClose={() => setSettingsOpen(false)}
          changeTheme={changeTheme}
          currentTheme={currentTheme}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}
      
      {galleryOpen && (
        <AlchemyGallery
          onClose={() => setGalleryOpen(false)}
          elements={elements}
        />
      )}
      
      {hintsOpen && (
        <HintSystem
          onClose={() => setHintsOpen(false)}
          unlockedElements={Object.values(elements).filter(el => el.unlocked)}
        />
      )}
    </>
  );
};

export default GameHeader;
