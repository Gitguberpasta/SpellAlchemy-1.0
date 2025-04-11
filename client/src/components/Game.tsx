import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import Workspace from './Workspace';
import Sidebar from './Sidebar';
import GameHeader from './GameHeader';
import { useAudio } from '../lib/stores/useAudio';
import { getLocalStorage, setLocalStorage } from '../lib/utils';

const Game = () => {
  const [loading, setLoading] = useState(true);
  const { elements, unlockElement } = useElementsStore();
  const { toggleMute, isMuted } = useAudio();

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedElements = () => {
      try {
        const savedElements = getLocalStorage('alchemyKitchen_elements');
        if (savedElements) {
          // Unlock each saved element
          savedElements.forEach((elementId: string) => {
            unlockElement(elementId);
          });
        }
      } catch (error) {
        console.error('Error loading saved elements:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading for smoother transition
    setTimeout(() => {
      loadSavedElements();
    }, 1000);
  }, [unlockElement]);

  // Save progress when elements change
  useEffect(() => {
    if (!loading) {
      const unlockedIds = Object.keys(elements).filter(id => elements[id].unlocked);
      setLocalStorage('alchemyKitchen_elements', unlockedIds);
    }
  }, [elements, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-yellow-400 mb-8"
        >
          Alchemy Kitchen
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-yellow-300 text-4xl"
        >
          <i className="fas fa-mortar-pestle"></i>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <GameHeader toggleMute={toggleMute} isMuted={isMuted} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Workspace />
      </div>
    </div>
  );
};

export default Game;
