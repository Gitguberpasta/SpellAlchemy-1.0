import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Element } from '../lib/elements';
import { ElementIcon } from '../assets/icons';
import { combinations } from '../lib/combinations';

interface HintSystemProps {
  onClose: () => void;
  unlockedElements: Element[];
}

const HintSystem: React.FC<HintSystemProps> = ({ onClose, unlockedElements }) => {
  const [hint, setHint] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateHint = () => {
    setLoading(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const hint = getCleverHint();
      setHint(hint);
      setLoading(false);
    }, 1500);
  };
  
  const getCleverHint = (): string => {
    // Get all unlocked element IDs
    const unlockedIds = unlockedElements.map(el => el.id);
    
    // Find combinations that could be made with current elements
    const possibleCombinations = combinations.filter(combo => {
      // Both elements in the combination must be unlocked
      const hasElements = unlockedIds.includes(combo.elements[0]) && unlockedIds.includes(combo.elements[1]);
      // The result must not be unlocked
      const resultNotUnlocked = !unlockedIds.includes(combo.result);
      return hasElements && resultNotUnlocked;
    });
    
    if (possibleCombinations.length === 0) {
      // Try combinations where only one element is unlocked
      const partialCombinations = combinations.filter(combo => {
        const hasAtLeastOneElement = unlockedIds.includes(combo.elements[0]) || unlockedIds.includes(combo.elements[1]);
        const resultNotUnlocked = !unlockedIds.includes(combo.result);
        return hasAtLeastOneElement && resultNotUnlocked;
      });
      
      if (partialCombinations.length === 0) {
        return "Try combining your basic elements in different ways. The key to alchemy is experimentation!";
      }
      
      // Pick a random combination that uses at least one unlocked element
      const randomCombo = partialCombinations[Math.floor(Math.random() * partialCombinations.length)];
      const unlockedElement = unlockedIds.includes(randomCombo.elements[0]) 
        ? randomCombo.elements[0] 
        : randomCombo.elements[1];
        
      return `Try combining ${unlockedElements.find(el => el.id === unlockedElement)?.name} with something else. The kitchen has many mysteries!`;
    }
    
    // Pick a random possible combination and create a hint
    const randomCombo = possibleCombinations[Math.floor(Math.random() * possibleCombinations.length)];
    const element1 = unlockedElements.find(el => el.id === randomCombo.elements[0])?.name;
    const element2 = unlockedElements.find(el => el.id === randomCombo.elements[1])?.name;
    
    // Generate different types of hints
    const hintTypes = [
      `Have you tried combining ${element1} and ${element2}? They might react in an interesting way.`,
      `${element1} contains properties that could interact with ${element2}.`,
      `The secret combination of ${element1} and ${element2} might reveal a new discovery!`,
      `Ancient alchemists believed that ${element1} holds the key to transforming ${element2}.`,
      `I sense a powerful reaction between ${element1} and ${element2}. Give it a try!`
    ];
    
    return hintTypes[Math.floor(Math.random() * hintTypes.length)];
  };

  // Generate a hint when the component mounts
  useEffect(() => {
    generateHint();
  }, []);

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
            <i className="fas fa-lightbulb mr-2"></i> Alchemy Hints
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-6 bg-[#1a001f] p-4 rounded-lg border border-yellow-500/20 min-h-[120px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-bounce mb-3">
                <i className="fas fa-lightbulb text-yellow-300 text-2xl"></i>
              </div>
              <p className="text-gray-300">Thinking of a hint...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 text-[#2a0033] rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="fas fa-magic"></i>
                </div>
                <p className="text-gray-200 italic">Alchemy Assistant</p>
              </div>
              <p className="text-white">{hint}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="mr-1">{unlockedElements.length}</span> elements discovered
          </div>
          <button 
            onClick={generateHint}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-500 text-white'
            } transition-colors`}
          >
            {loading ? 'Thinking...' : 'Get New Hint'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HintSystem;