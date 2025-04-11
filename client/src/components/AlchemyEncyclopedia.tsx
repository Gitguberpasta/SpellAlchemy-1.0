import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElementsState, Element } from '../lib/elements';
import { useElementsStore } from '../lib/stores/useElementsStore';

interface AlchemyEncyclopediaProps {
  onClose: () => void;
}

const AlchemyEncyclopedia: React.FC<AlchemyEncyclopediaProps> = ({ onClose }) => {
  const { elements } = useElementsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  
  // Get all unlocked elements
  const unlockedElements = useMemo(() => {
    return Object.values(elements)
      .filter(el => el.unlocked)
      .filter(el => 
        selectedTier === null || 
        el.tier === selectedTier
      )
      .filter(el => 
        searchTerm === '' || 
        el.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // First by tier
        if ((a.tier || 0) !== (b.tier || 0)) {
          return (a.tier || 0) - (b.tier || 0);
        }
        // Then alphabetically
        return a.name.localeCompare(b.name);
      });
  }, [elements, selectedTier, searchTerm]);
  
  // Calculate discovered stats
  const totalElements = Object.values(elements).length;
  const discoveredElements = Object.values(elements).filter(el => el.unlocked).length;
  const discoveryPercentage = Math.round((discoveredElements / totalElements) * 100);
  
  // Get unique tiers from discovered elements
  const availableTiers = useMemo(() => {
    const tiers = new Set<number>();
    Object.values(elements)
      .filter(el => el.unlocked && el.tier !== undefined)
      .forEach(el => {
        if (el.tier !== undefined) tiers.add(el.tier);
      });
    return Array.from(tiers).sort();
  }, [elements]);
  
  // Element descriptions for the encyclopedia
  const encyclopediaDescriptions: Record<string, string> = {
    // Basic elements
    water: "A transparent, odorless liquid that forms the basis of all life. In alchemy, it represents fluidity and adaptability.",
    fire: "The elemental force of heat and light. Fire transforms other elements and represents change and energy.",
    earth: "The solid foundation of all matter. Earth symbolizes stability, fertility, and growth.",
    air: "The invisible element that surrounds us. Air represents intellect, communication, and freedom.",
    
    // First tier elements
    steam: "When water meets fire, it transforms into this gaseous state. Steam powers many mechanical processes.",
    mud: "A mixture of earth and water, forming a malleable substance. The basis for clay and many building materials.",
    energy: "Pure force created when fire and air combine. The foundation of all action and transformation.",
    dust: "Fine particles of earth carried by air. Dust can be both a nuisance and a medium for magical workings.",
    lava: "Molten rock formed when fire meets earth. Lava eventually cools to form new land.",
    
    // Additional elements
    plant: "Life that grows from earth and water. Plants convert sunlight to energy and form the basis of most food chains.",
    bread: "A staple food made from flour, water, and heat. One of humanity's oldest prepared foods.",
    clay: "Refined mud that can be molded and fired to create pottery and tools.",
    metal: "Refined from certain stones, metals are durable materials essential for tools and machinery.",
    stone: "Compressed earth formed over time. The foundation of mountains and buildings.",
    
    // Cooking-related elements
    dough: "A mixture of flour and water that can be baked into various breads and pastries.",
    flour: "Powder made from grinding grains. The basis for most baked goods.",
    soup: "A liquid food combining water with various ingredients, cooked over fire.",
    cake: "A sweet baked food made from flour, sugar, and other ingredients. Often served at celebrations.",
    wine: "Fermented fruit juice, typically from grapes. One of the oldest and most celebrated alcoholic beverages.",
    
    // Complex elements
    life: "The mysterious force that animates matter. The greatest achievement of alchemical work.",
    time: "The forward flow of events. Neither element nor creation, but the medium in which all things exist.",
    knowledge: "Information gained through study and experience. The goal of all alchemical pursuits.",
    philosophy: "The love of wisdom. The theoretical framework that guides alchemical experimentation.",
    void: "The absence of all elements. The state from which all things emerge and to which they return."
  };
  
  // Get extended description for the selected element
  const getElementDescription = (element: Element): string => {
    if (element.id in encyclopediaDescriptions) {
      return encyclopediaDescriptions[element.id];
    }
    return element.description || `No additional information available about ${element.name}.`;
  };
  
  // Element usage information
  const getElementUsage = (element: Element): string => {
    const usedInCombinations: string[] = [];
    
    // Search through all unlocked elements to find those that use this element
    Object.values(elements)
      .filter(el => el.unlocked)
      .forEach(el => {
        if (el.id !== element.id && el.recipe) {
          if (el.recipe.includes(element.id)) {
            usedInCombinations.push(el.name);
          }
        }
      });
    
    if (usedInCombinations.length > 0) {
      return `Used to create: ${usedInCombinations.join(', ')}`;
    }
    
    return element.tier === 5 ? 
      "Final creation - not used in other combinations." :
      "No known combinations yet. Experiment to discover more!";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div 
        className="bg-[#2a0033] text-white rounded-lg shadow-xl w-full max-w-5xl h-4/5 border border-yellow-500/30 flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/30">
          <h2 className="text-xl font-bold text-yellow-300 flex items-center">
            <span className="mr-2 text-2xl">📚</span>
            Alchemy Encyclopedia
            <span className="ml-4 text-sm font-normal text-yellow-200">
              Discovered: {discoveredElements}/{totalElements} ({discoveryPercentage}%)
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Element list sidebar */}
          <div className="w-1/3 border-r border-yellow-500/30 flex flex-col">
            {/* Search and filters */}
            <div className="p-3 border-b border-yellow-500/30">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search elements..."
                className="w-full bg-[#3f0047] border border-yellow-500/30 rounded px-3 py-2 text-white placeholder-yellow-100/50"
              />
              
              <div className="flex flex-wrap gap-1 mt-2">
                <button
                  onClick={() => setSelectedTier(null)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedTier === null 
                      ? 'bg-yellow-500 text-[#3a003e]' 
                      : 'bg-[#3f0047] text-yellow-300 hover:bg-[#520059]'
                  }`}
                >
                  All Tiers
                </button>
                
                {availableTiers.map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier === selectedTier ? null : tier)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      tier === selectedTier 
                        ? 'bg-yellow-500 text-[#3a003e]' 
                        : 'bg-[#3f0047] text-yellow-300 hover:bg-[#520059]'
                    }`}
                  >
                    Tier {tier}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Element list */}
            <div className="flex-1 overflow-y-auto">
              {unlockedElements.length === 0 ? (
                <div className="p-4 text-center text-yellow-200/50 italic">
                  No elements match your search
                </div>
              ) : (
                <div className="divide-y divide-yellow-500/20">
                  {unlockedElements.map(element => (
                    <button
                      key={element.id}
                      className={`w-full text-left p-3 flex items-center hover:bg-[#3f0047] transition-colors ${
                        selectedElement?.id === element.id ? 'bg-[#4a0052]' : ''
                      }`}
                      onClick={() => setSelectedElement(element)}
                    >
                      <div className="text-2xl text-yellow-400 mr-3">
                        <i className={`fas fa-${element.icon}`}></i>
                      </div>
                      <div>
                        <div className="font-medium">{element.name}</div>
                        <div className="text-xs text-yellow-200/70">Tier {element.tier || 0}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Element details panel */}
          <div className="w-2/3 p-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedElement ? (
                <motion.div
                  key={selectedElement.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-5xl text-yellow-400 mr-4">
                      <i className={`fas fa-${selectedElement.icon}`}></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-300">{selectedElement.name}</h3>
                      <div className="text-sm text-yellow-200/70">
                        {selectedElement.isBasic ? 'Basic Element' : `Tier ${selectedElement.tier || 0} Element`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#3f0047]/50 rounded-lg p-4 mb-4">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Description</h4>
                    <p className="text-yellow-100 leading-relaxed">
                      {getElementDescription(selectedElement)}
                    </p>
                  </div>
                  
                  {!selectedElement.isBasic && (
                    <div className="bg-[#3f0047]/50 rounded-lg p-4 mb-4">
                      <h4 className="text-lg font-semibold text-yellow-300 mb-2">Creation</h4>
                      {selectedElement.recipe ? (
                        <p className="text-yellow-100">
                          Created by combining: {selectedElement.recipe.map(id => 
                            elements[id]?.name || id
                          ).join(' + ')}
                        </p>
                      ) : (
                        <p className="text-yellow-100/50 italic">
                          Creation method unknown
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="bg-[#3f0047]/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Usage</h4>
                    <p className="text-yellow-100">
                      {getElementUsage(selectedElement)}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <div className="text-xs text-yellow-200/50 italic">
                      Discovered elements can be dragged from your sidebar to the workspace for combinations.
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="text-6xl text-yellow-400/30 mb-4">
                    <i className="fas fa-book-open"></i>
                  </div>
                  <h3 className="text-xl font-medium text-yellow-300 mb-2">Encyclopedia of Elements</h3>
                  <p className="text-yellow-200/70 max-w-md">
                    Select an element from the list on the left to view detailed information about it.
                  </p>
                  <div className="mt-6 p-4 bg-[#3f0047]/50 rounded-lg max-w-md">
                    <h4 className="font-semibold text-yellow-300 mb-2">Did you know?</h4>
                    <p className="text-yellow-100 text-sm">
                      The word "alchemy" comes from the Arabic "al-kimiya," referring to the ancient practice 
                      of transmutation of base metals into gold, finding the universal elixir, and creating 
                      the philosopher's stone.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlchemyEncyclopedia;