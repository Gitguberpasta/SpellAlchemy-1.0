import { useState } from 'react';
import { motion } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
  const { elements } = useElementsStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter elements by unlock status and search term
  const unlockedElements = Object.values(elements)
    .filter(element => element.unlocked)
    .filter(element => 
      searchTerm === '' || 
      element.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Show basic elements first, then alphabetically
      if (a.isBasic && !b.isBasic) return -1;
      if (!a.isBasic && b.isBasic) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="w-64 bg-[#5a005e] flex flex-col h-full border-r border-yellow-500/30">
      <div className="p-3 border-b border-yellow-500/30">
        <div className="mb-2 text-yellow-300 font-semibold">
          <span className="mr-2">
            <i className="fas fa-book"></i>
          </span>
          Elements ({unlockedElements.length})
        </div>
        
        <input
          type="text"
          placeholder="Search elements..."
          className="w-full bg-[#430045] border border-yellow-500/30 rounded px-3 py-1 text-yellow-100 placeholder-yellow-100/50 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
