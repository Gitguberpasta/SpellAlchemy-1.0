import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ElementsState, Element } from '../lib/elements';
import { ElementIcon } from '../assets/icons';
import { findCombination } from '../lib/combinations';

interface AlchemyGalleryProps {
  onClose: () => void;
  elements: ElementsState;
}

const AlchemyGallery: React.FC<AlchemyGalleryProps> = ({ onClose, elements }) => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<number | null>(null);
  
  // Get only unlocked elements
  const unlockedElements = Object.values(elements).filter(element => element.unlocked);
  
  // Filter elements based on search and tier
  const filteredElements = unlockedElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filter === null || element.tier === filter;
    return matchesSearch && matchesTier;
  });
  
  // Group elements by tier for the sidebar
  const elementsByTier: Record<number, Element[]> = {};
  unlockedElements.forEach(element => {
    if (!elementsByTier[element.tier!]) {
      elementsByTier[element.tier!] = [];
    }
    elementsByTier[element.tier!].push(element);
  });
  
  // Get recipes that use this element
  const getRecipesWithElement = (elementId: string) => {
    const recipes = [];
    
    // Find combinations where this element is used
    for (const unlocked of unlockedElements) {
      const combination = findCombination(elementId, unlocked.id);
      if (combination && elements[combination.result]?.unlocked) {
        recipes.push({
          element1: elements[combination.elements[0]],
          element2: elements[combination.elements[1]],
          result: elements[combination.result],
        });
      }
    }
    
    return recipes;
  };
  
  // Get fictional chemistry facts
  const getChemistryFacts = (element: Element) => {
    const facts = {
      water: ["H₂O is a polar molecule with a bent structure", "Freezes at 0°C and boils at 100°C at standard pressure", "Universal solvent in kitchen chemistry"],
      fire: ["Exothermic oxidation reaction", "Requires fuel, heat, and oxygen", "Essential in cooking transformation processes"],
      earth: ["Rich in minerals and organic compounds", "Source of many cooking ingredients", "Contains various metal oxides that influence flavor"],
      air: ["Composed primarily of nitrogen (78%) and oxygen (21%)", "Vital for oxidation in cooking", "Carries aromas that enhance flavor perception"],
      flour: ["Complex carbohydrates formed from C₆H₁₀O₅ chains", "Gluten proteins create elastic networks when hydrated", "Contains starch that gelatinizes at 60-70°C"],
      salt: ["NaCl ionic crystal structure", "Enhances flavors through Na+ ion interaction with taste buds", "Lowers water freezing point and raises boiling point"],
      sugar: ["C₁₂H₂₂O₁₁ (sucrose) breaks down to glucose and fructose when heated", "Caramelizes at 160°C creating hundreds of new compounds", "Forms hydrogen bonds with water molecules"],
    };
    
    // Return facts or generic message
    return facts[element.id as keyof typeof facts] || [
      `${element.name} exhibits unique chemical properties in alchemy`,
      `Contains essential compounds that transform when combined`,
      `Discovered by ancient alchemists studying transformation`
    ];
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div 
        className="bg-[#2a0033] text-white rounded-lg shadow-xl w-11/12 max-w-4xl h-4/5 border border-yellow-500/30 flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/30">
          <h2 className="text-xl font-bold text-yellow-300">
            <i className="fas fa-book-open mr-2"></i> Alchemy Gallery
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex h-full">
          {/* Left Panel - Element List */}
          <div className="w-1/3 border-r border-yellow-500/30 p-4 overflow-y-auto">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search elements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 rounded bg-[#3f0047] border border-yellow-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            
            <div className="mb-4 flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter(null)}
                className={`px-2 py-1 rounded text-xs ${filter === null ? 'bg-yellow-500 text-[#2a0033]' : 'bg-[#3f0047] text-yellow-300'}`}
              >
                All
              </button>
              {Object.keys(elementsByTier).map((tier) => (
                <button 
                  key={tier}
                  onClick={() => setFilter(Number(tier))}
                  className={`px-2 py-1 rounded text-xs ${filter === Number(tier) ? 'bg-yellow-500 text-[#2a0033]' : 'bg-[#3f0047] text-yellow-300'}`}
                >
                  Tier {tier}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {filteredElements.map((element) => (
                <button
                  key={element.id}
                  onClick={() => setSelectedElement(element)}
                  className={`p-2 rounded flex items-center hover:bg-[#3f0047] transition-colors ${selectedElement?.id === element.id ? 'bg-[#3f0047] border border-yellow-500/50' : ''}`}
                >
                  <span className="mr-2 text-yellow-400 w-6 text-center flex-shrink-0">
                    <ElementIcon icon={element.icon} />
                  </span>
                  <span className="truncate">{element.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Panel - Element Details */}
          <div className="flex-grow p-4 overflow-y-auto">
            {selectedElement ? (
              <div>
                <div className="flex items-center mb-6">
                  <div className="text-4xl text-yellow-400 mr-4">
                    <ElementIcon icon={selectedElement.icon} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-300">{selectedElement.name}</h3>
                    <div className="text-sm text-yellow-100 opacity-80">Tier {selectedElement.tier} Element</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-yellow-200 text-lg mb-2">Description</h4>
                  <p className="text-gray-200">{selectedElement.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-yellow-200 text-lg mb-2">Chemical Properties</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-200">
                    {getChemistryFacts(selectedElement).map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-yellow-200 text-lg mb-2">Recipes</h4>
                  {getRecipesWithElement(selectedElement.id).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getRecipesWithElement(selectedElement.id).map((recipe, index) => (
                        <div key={index} className="border border-yellow-500/20 rounded p-2 flex items-center">
                          <span className="text-yellow-400 mx-1">
                            <ElementIcon icon={recipe.element1.icon} />
                          </span>
                          +
                          <span className="text-yellow-400 mx-1">
                            <ElementIcon icon={recipe.element2.icon} />
                          </span>
                          →
                          <span className="text-yellow-400 mx-1">
                            <ElementIcon icon={recipe.result.icon} />
                          </span>
                          <span className="ml-1">{recipe.result.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No recipes found using this element.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <i className="fas fa-flask text-5xl mb-4"></i>
                <p>Select an element to view its details</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlchemyGallery;