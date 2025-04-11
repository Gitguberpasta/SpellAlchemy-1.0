import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'sonner';
import Game from './components/Game';
import { useEffect } from 'react';
import { useAudio } from './lib/stores/useAudio';

function App() {
  // Set up audio elements
  useEffect(() => {
    const bgMusic = new Audio('/sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.2;
    
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    const audio = useAudio.getState();
    audio.setBackgroundMusic(bgMusic);
    audio.setHitSound(hitSound);
    audio.setSuccessSound(successSound);
    
    // Clean up on unmount
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-[#430045] text-foreground">
          <Game />
          <Toaster position="top-center" />
        </div>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
