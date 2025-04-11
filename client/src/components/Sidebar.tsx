import { useState } from 'react';
import { motion } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import SidebarItem from './SidebarItem';
import { useAudio } from '../lib/stores/useAudio';

interface SidebarProps {
  addElementToWorkspace?: (element: { id: string, name: string, icon: string }) => void;
}

const Sidebar = ({ addElementToWorkspace }: SidebarProps) => {
  const { elements } = useElementsStore();
  const { playHit } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<number | null>(null);
  
  // Filter elements by unlock status, search term, and tier
  const unlockedElements = Object.values(elements)
    .filter(element => element.unlocked)
    .filter(element => 
      searchTerm === '' || 
      element.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(element => 
      filterTier === null || element.tier === filterTier
    )
    .sort((a, b) => {
      // Show basic elements first, then by tier, then alphabetically
      if (a.isBasic && !b.isBasic) return -1;
      if (!a.isBasic && b.isBasic) return 1;
      if (a.tier !== b.tier) return (a.tier || 0) - (b.tier || 0);
      return a.name.localeCompare(b.name);
    });

  // Handle adding an element to the workspace
  const handleAddToWorkspace = (element: { id: string, name: string, icon: string }) => {
    if (addElementToWorkspace) {
      addElementToWorkspace(element);
    }
  };
  
  // Get available tiers from unlocked elements
  const availableTiers = Array.from(
    new Set(
      Object.values(elements)
        .filter(element => element.unlocked && element.tier !== undefined)
        .map(element => element.tier as number)
    )
  ).sort();

  return (
    <div className="w-64 bg-sidebar flex flex-col h-full border-r border-yellow-500/30">
      <div className="p-3 border-b border-yellow-500/30">
        <div className="mb-2 text-accent font-semibold">
          <span className="mr-2">
            <i className="fas fa-book"></i>
          </span>
          Elements ({unlockedElements.length})
        </div>
        
        <input
          type="text"
          placeholder="Search elements..."
          className="w-full bg-workspace border border-yellow-500/30 rounded px-3 py-1 text-yellow-100 placeholder-yellow-100/50 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Tier filters */}
        <div className="flex flex-wrap gap-1 mt-2">
          <button
            onClick={() => setFilterTier(null)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              filterTier === null 
                ? 'bg-yellow-500 text-[#3a003e]' 
                : 'bg-workspace text-yellow-300 hover:bg-[#520059]'
            }`}
          >
            All
          </button>
          
          {availableTiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier === filterTier ? null : tier as React.SetStateAction<number | null>)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                tier === filterTier 
                  ? 'bg-yellow-500 text-[#3a003e]' 
                  : 'bg-workspace text-yellow-300 hover:bg-[#520059]'
              }`}
            >
              Tier {tier}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {unlockedElements.length === 0 && (
          <div className="text-center text-yellow-200/50 italic py-8">
            No elements discovered yet
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          {unlockedElements.map((element) => (
            <motion.div
              key={element.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarItem
                id={element.id}
                name={element.name}
                icon={element.icon}
                description={element.description}
                onAddToWorkspace={handleAddToWorkspace}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
