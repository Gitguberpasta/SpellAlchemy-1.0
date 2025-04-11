import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import Workspace from './Workspace';
import Sidebar from './Sidebar';
import GameHeader from './GameHeader';
import { useAudio } from '../lib/stores/useAudio';
import { getLocalStorage, setLocalStorage } from '../lib/utils';

// Theme definitions
const themes = {
  default: {
    headerBg: '#5a005e',
    mainBg: '#3a003e',
    sidebarBg: '#480050',
    workspaceBg: '#290030',
    accentColor: '#ffcc00',
    textColor: '#ffffff',
  },
  forest: {
    headerBg: '#1e3a1e',
    mainBg: '#1a331a',
    sidebarBg: '#2c4a2c',
    workspaceBg: '#152a15',
    accentColor: '#a0d857',
    textColor: '#ffffff', 
  },
  ocean: {
    headerBg: '#0a3155', 
    mainBg: '#0a2a45',
    sidebarBg: '#103959',
    workspaceBg: '#072035',
    accentColor: '#5df7ff',
    textColor: '#ffffff',
  },
  fire: {
    headerBg: '#5c1e02',
    mainBg: '#4a1802',
    sidebarBg: '#6a2002',
    workspaceBg: '#2d0f01',
    accentColor: '#ff7b24',
    textColor: '#ffffff',
  },
  night: {
    headerBg: '#0f172a',
    mainBg: '#0d1425',
    sidebarBg: '#141e32',
    workspaceBg: '#080d16',
    accentColor: '#a1a1aa',
    textColor: '#ffffff',
  },
};

const Game = () => {
  const [loading, setLoading] = useState(true);
  const { elements, unlockElement } = useElementsStore();
  const { toggleMute, isMuted, initializeAudio } = useAudio();
  const [theme, setTheme] = useState('default');
  
  // State for workspace items
  const [workspaceItems, setWorkspaceItems] = useState<{id: string, uniqueId: string}[]>([]);

  // Load saved progress and settings on mount
  useEffect(() => {
    const loadSavedElements = () => {
      try {
        // Load saved elements
        const savedElements = getLocalStorage('alchemyKitchen_elements');
        if (savedElements) {
          // Unlock each saved element
          savedElements.forEach((elementId: string) => {
            unlockElement(elementId);
          });
        }
        
        // Load saved theme
        const savedTheme = getLocalStorage('alchemyKitchen_theme');
        if (savedTheme && themes[savedTheme as keyof typeof themes]) {
          setTheme(savedTheme);
        }
        
        // Initialize audio system
        initializeAudio();
        
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading for smoother transition
    setTimeout(() => {
      loadSavedElements();
    }, 1000);
  }, [unlockElement, initializeAudio]);

  // Save progress when elements change
  useEffect(() => {
    if (!loading) {
      const unlockedIds = Object.keys(elements).filter(id => elements[id].unlocked);
      setLocalStorage('alchemyKitchen_elements', unlockedIds);
    }
  }, [elements, loading]);
  
  // Save theme when it changes
  useEffect(() => {
    setLocalStorage('alchemyKitchen_theme', theme);
    
    // Apply theme colors to document root
    const currentTheme = themes[theme as keyof typeof themes];
    document.documentElement.style.setProperty('--header-bg', currentTheme.headerBg);
    document.documentElement.style.setProperty('--main-bg', currentTheme.mainBg);
    document.documentElement.style.setProperty('--sidebar-bg', currentTheme.sidebarBg);
    document.documentElement.style.setProperty('--workspace-bg', currentTheme.workspaceBg);
    document.documentElement.style.setProperty('--accent-color', currentTheme.accentColor);
    document.documentElement.style.setProperty('--text-color', currentTheme.textColor);
    
  }, [theme]);
  
  const changeTheme = (newTheme: string) => {
    if (themes[newTheme as keyof typeof themes]) {
      setTheme(newTheme);
    }
  };

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

  const currentTheme = themes[theme as keyof typeof themes];

  return (
    <div 
      className="flex flex-col h-screen max-h-screen overflow-hidden"
      style={{ backgroundColor: currentTheme.mainBg, color: currentTheme.textColor }}
    >
      <GameHeader 
        toggleMute={toggleMute} 
        isMuted={isMuted} 
        changeTheme={changeTheme}
        currentTheme={theme}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar addElementToWorkspace={(element) => {
          // Direct access to workspace's add element functionality
          const workspaceItem = { 
            id: element.id, 
            uniqueId: `${element.id}-${Date.now()}` 
          };
          setWorkspaceItems(prev => [...prev, workspaceItem]);
        }} />
        <Workspace workspaceItems={workspaceItems} setWorkspaceItems={setWorkspaceItems} />
      </div>
      
      {/* Apply theme styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --header-bg: ${currentTheme.headerBg};
          --main-bg: ${currentTheme.mainBg};
          --sidebar-bg: ${currentTheme.sidebarBg};
          --workspace-bg: ${currentTheme.workspaceBg};
          --accent-color: ${currentTheme.accentColor};
          --text-color: ${currentTheme.textColor};
        }
        
        .bg-header {
          background-color: var(--header-bg);
        }
        
        .bg-sidebar {
          background-color: var(--sidebar-bg);
        }
        
        .bg-workspace {
          background-color: var(--workspace-bg);
        }
        
        .text-accent {
          color: var(--accent-color);
        }
      `}} />
    </div>
  );
};

export default Game;
