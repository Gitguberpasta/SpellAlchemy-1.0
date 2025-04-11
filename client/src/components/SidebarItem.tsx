import { useDrag } from 'react-dnd';
import { ElementIcon } from '../assets/icons';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAudio } from '../lib/stores/useAudio';

interface SidebarItemProps {
  id: string;
  name: string;
  icon: string;
  description?: string;
  onAddToWorkspace?: (element: { id: string, name: string, icon: string }) => void;
}

const SidebarItem = ({ id, name, icon, description, onAddToWorkspace }: SidebarItemProps) => {
  const { playHit } = useAudio();
  
  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { id, name, icon },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  // Handle clicking the element to add to workspace
  const handleClick = () => {
    playHit();
    if (onAddToWorkspace) {
      onAddToWorkspace({ id, name, icon });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={drag}
            onClick={handleClick}
            className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all bg-[#430045] hover:bg-[#7e0084] active:scale-95 ${
              isDragging ? 'opacity-50' : 'opacity-100'
            }`}
          >
            <div className="text-xl mb-1 text-yellow-300">
              <ElementIcon icon={icon} />
            </div>
            <div className="text-xs text-center font-medium text-yellow-100 truncate w-full">
              {name}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-[#430045] text-yellow-100 border border-yellow-500/50">
          <div className="font-semibold">{name}</div>
          {description && <div className="text-xs mt-1">{description}</div>}
          <div className="text-xs mt-1 opacity-80"><i className="fas fa-info-circle mr-1"></i> Click to add to workspace</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarItem;
