import React from 'react';
import { motion } from 'framer-motion';

interface SettingsModalProps {
  onClose: () => void;
  changeTheme: (theme: string) => void;
  currentTheme: string;
  isMuted: boolean;
  toggleMute: () => void;
}

const themes = [
  { id: 'default', name: 'Default Theme', bgColor: '#5a005e', textColor: '#ffcc00' },
  { id: 'forest', name: 'Forest Theme', bgColor: '#1e3a1e', textColor: '#94c973' },
  { id: 'ocean', name: 'Ocean Theme', bgColor: '#0a3155', textColor: '#6bc6e8' },
  { id: 'fire', name: 'Fire Theme', bgColor: '#5c1e02', textColor: '#ff7b24' },
  { id: 'night', name: 'Night Theme', bgColor: '#0f172a', textColor: '#a1a1aa' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  changeTheme,
  currentTheme,
  isMuted,
  toggleMute
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div 
        className="bg-[#2a0033] text-white rounded-lg shadow-xl w-full max-w-md p-5 border border-yellow-500/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-300">
            <i className="fas fa-cog mr-2"></i> Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Game Theme */}
        <div className="mb-6">
          <h3 className="text-yellow-200 font-semibold mb-3">Game Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`p-3 rounded border transition-all ${
                  currentTheme === theme.id
                    ? 'border-yellow-400 bg-yellow-400/20'
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: theme.id === currentTheme ? `${theme.bgColor}80` : theme.bgColor,
                }}
              >
                <span 
                  className="font-medium block" 
                  style={{ color: theme.textColor }}
                >
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sound Settings */}
        <div className="mb-6">
          <h3 className="text-yellow-200 font-semibold mb-3">Sound Settings</h3>
          
          <div className="flex items-center justify-between p-3 border border-gray-600 rounded">
            <span>Game Sound</span>
            <button
              onClick={toggleMute}
              className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                !isMuted ? 'bg-yellow-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition rounded-full bg-white ${
                  !isMuted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Alchemy Kitchen v1.0</p>
          <p className="mt-1">Created with 💫 Alchemy</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;