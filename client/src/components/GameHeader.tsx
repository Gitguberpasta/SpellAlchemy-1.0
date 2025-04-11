import { motion } from 'framer-motion';
import { useState } from 'react';
import { useElementsStore } from '../lib/stores/useElementsStore';
import AlchemyAI from './AlchemyAI';

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
  const [aiOpen, setAiOpen] = useState(false);
  
  // Count unlocked elements
  const unlockedCount = Object.values(elements).filter(el => el.unlocked).length;
  const totalCount = Object.values(elements).length;
  
  // Calculate progress percentage
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <>
      <header className="bg-header border-b border-yellow-500/30 p-3 flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold text-accent"
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
            <div className="text-accent text-sm">
              {unlockedCount} / {totalCount} elements
            </div>
            <div className="w-36 h-2 bg-workspace rounded-full overflow-hidden mt-1">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <button 
            onClick={() => setAiOpen(true)}
            className="text-accent hover:text-accent transition-colors p-2 relative" 
            title="Alchemy Assistant"
          >
            <i className="fas fa-robot"></i>
          </button>
          
          <button 
            onClick={() => setGalleryOpen(true)}
            className="text-accent hover:text-accent transition-colors p-2" 
            title="Alchemy Gallery"
          >
            <i className="fas fa-book-open"></i>
          </button>
          
          <button 
            onClick={toggleMute}
            className="text-accent hover:text-accent transition-colors p-2"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
          </button>
          
          <button 
            onClick={() => setSettingsOpen(true)}
            className="text-accent hover:text-accent transition-colors p-2" 
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </header>
      
      {/* We'll implement these modal components as we continue */}
      {settingsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#2a0033] text-white rounded-lg shadow-xl w-96 p-5 border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-300">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <h3 className="text-yellow-200 font-semibold mb-2">Theme</h3>
              <div className="grid grid-cols-2 gap-2">
                {['default', 'forest', 'ocean', 'fire', 'night'].map(theme => (
                  <button 
                    key={theme}
                    onClick={() => changeTheme(theme)}
                    className={`p-2 border rounded transition-colors ${
                      currentTheme === theme 
                        ? 'border-yellow-400 bg-yellow-500/20' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-yellow-200 font-semibold mb-2">Sound</h3>
              <button 
                onClick={toggleMute}
                className="w-full flex justify-between items-center p-2 border border-gray-600 rounded"
              >
                <span>Sound {isMuted ? 'Off' : 'On'}</span>
                <span className={isMuted ? 'text-gray-400' : 'text-yellow-400'}>
                  <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {galleryOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-[#2a0033] text-white rounded-lg shadow-xl w-4/5 h-4/5 border border-yellow-500/30 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-yellow-500/30">
              <h2 className="text-xl font-bold text-yellow-300">Alchemy Gallery</h2>
              <button onClick={() => setGalleryOpen(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {Object.values(elements)
                  .filter(el => el.unlocked)
                  .sort((a, b) => (a.tier || 0) - (b.tier || 0))
                  .map(element => (
                    <div 
                      key={element.id} 
                      className="bg-[#3f0047] p-3 rounded-lg border border-yellow-500/20 flex flex-col items-center"
                    >
                      <div className="text-3xl text-yellow-400 mb-2">
                        <i className={`fas fa-${element.icon}`}></i>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold">{element.name}</h3>
                        <p className="text-xs text-gray-300 mt-1">Tier {element.tier || 0}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
      
      {aiOpen && (
        <AlchemyAI onClose={() => setAiOpen(false)} />
      )}
    </>
  );
};

export default GameHeader;
