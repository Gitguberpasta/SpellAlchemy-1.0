import { create } from 'zustand';
import { ElementsState, createInitialElements } from '../elements';

interface ElementsStore {
  elements: ElementsState;
  unlockElement: (id: string) => void;
  resetElements: () => void;
  unlockAllElements: () => void;
  unlockTierElements: (tier: number) => void;
}

export const useElementsStore = create<ElementsStore>((set) => ({
  elements: createInitialElements(),
  
  unlockElement: (id: string) => {
    set((state) => {
      // If the element doesn't exist or is already unlocked, do nothing
      if (!state.elements[id] || state.elements[id].unlocked) {
        return state;
      }

      // Import combinations to find the recipe
      const { combinations } = require('../combinations');
      
      // Find the combination that results in this element
      const combination = combinations.find(combo => combo.result === id);
      
      // Create a new elements object with the updated element
      return {
        elements: {
          ...state.elements,
          [id]: {
            ...state.elements[id],
            unlocked: true,
            // Add the recipe information if available
            recipe: combination ? combination.elements : undefined
          }
        }
      };
    });
  },
  
  resetElements: () => {
    set(() => {
      // Reset to initial state, but keep basic elements unlocked
      const initialElements = createInitialElements();
      
      // Set all non-basic elements to locked
      Object.keys(initialElements).forEach(key => {
        if (!initialElements[key].isBasic) {
          initialElements[key].unlocked = false;
        }
      });
      
      return { elements: initialElements };
    });
  },
  
  // Cheat code: Unlock all elements
  unlockAllElements: () => {
    set((state) => {
      const updatedElements = { ...state.elements };
      
      // Set all elements to unlocked
      Object.keys(updatedElements).forEach(key => {
        updatedElements[key] = {
          ...updatedElements[key],
          unlocked: true
        };
      });
      
      return { elements: updatedElements };
    });
  },
  
  // Cheat code: Unlock all elements of a specific tier
  unlockTierElements: (tier: number) => {
    set((state) => {
      const updatedElements = { ...state.elements };
      
      // Set all elements of the specified tier to unlocked
      Object.keys(updatedElements).forEach(key => {
        if (updatedElements[key].tier === tier) {
          updatedElements[key] = {
            ...updatedElements[key],
            unlocked: true
          };
        }
      });
      
      return { elements: updatedElements };
    });
  }
}));
