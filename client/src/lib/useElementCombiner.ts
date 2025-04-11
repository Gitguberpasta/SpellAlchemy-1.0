import { useCallback } from 'react';
import { findCombination } from './combinations';
import { useElementsStore } from './stores/useElementsStore';

export function useElementCombiner() {
  const { elements } = useElementsStore();
  
  /**
   * Checks if two elements can be combined and returns the result
   */
  const checkCombination = useCallback((element1Id: string, element2Id: string) => {
    // Find if the combination exists
    const combo = findCombination(element1Id, element2Id);
    
    if (combo) {
      const resultElement = elements[combo.result];
      if (resultElement) {
        return resultElement;
      }
    }
    
    return null;
  }, [elements]);
  
  return { checkCombination };
}
