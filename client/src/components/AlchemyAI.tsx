import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useElementsStore } from '../lib/stores/useElementsStore';
import { ElementIcon } from '../assets/icons';
import { useGame } from '../lib/stores/useGame';

interface AlchemyAIProps {
  onClose: () => void;
}

// AI assistant personality types
const AI_PERSONALITIES = {
  SAGE: {
    name: "Master Alchemist",
    icon: "🧙‍♂️",
    greeting: "Greetings, young alchemist. What knowledge do you seek today?",
    style: "wise and mystical, uses ancient terminology"
  },
  MODERN: {
    name: "Dr. Elemental",
    icon: "🔬",
    greeting: "Hello! I'm Dr. Elemental. How can I assist with your elemental experiments today?",
    style: "scientific and precise, uses modern terminology"
  },
  FRIENDLY: {
    name: "Mixie",
    icon: "🧪",
    greeting: "Hey there! Mixie here! Ready to discover some amazing combinations?",
    style: "enthusiastic and casual, uses simple language"
  }
};

const ELEMENTS_FACTS = {
  // Basic elements
  water: ["Essential for most life forms", "Can dissolve many substances, earning it the title 'universal solvent'", "Exists in three states: liquid, solid (ice), and gas (steam)"],
  fire: ["Rapid oxidation process that releases heat and light", "One of the classical four elements in ancient philosophy", "Key to many cooking transformations"],
  earth: ["Rich source of minerals and nutrients", "Basis for plant growth and agriculture", "Contains various metal compounds and organic matter"],
  air: ["Mixture of gases including nitrogen, oxygen, and carbon dioxide", "Essential for respiration", "Medium for sound transmission"],
  
  // Created elements
  bread: ["One of humanity's oldest prepared foods", "Basic ingredients include flour, water, and yeast", "Baking transforms simple ingredients through chemical reactions"],
  metal: ["Good conductor of heat and electricity", "Atoms arrange in crystalline structures", "Can be shaped and molded when heated"],
  cake: ["Contains flour, sugar, eggs, and fat", "Leavening agents create air bubbles when heated", "The baking process caramelizes sugars for flavor"],
  soup: ["Cooking extracts flavors from ingredients into the liquid", "One of the oldest forms of cooking", "Allows nutrients to be easily absorbed"],
};

// Common questions and answers
const COMMON_QUESTIONS = [
  {
    question: "What are the basic elements?",
    answer: "The basic elements are Water, Fire, Earth, and Air. These are your starting elements that you'll use to create everything else. Experiment by combining them in different ways!"
  },
  {
    question: "How do I make bread?",
    answer: "To make bread, you need to combine dough with an oven. Dough can be made by mixing flour and water. Flour comes from wheat, which is created from combining grass and a seed."
  },
  {
    question: "What combinations give the best results?",
    answer: "Some of the most useful early combinations are: Water + Fire = Steam, Earth + Water = Mud, Fire + Air = Energy. These elements will help you create many other combinations."
  },
  {
    question: "How do I discover all elements?",
    answer: "Experimentation is key! Try combining elements you already have in different ways. Think about natural relationships - what might sand and fire create? What happens when you add water to flour?"
  },
];

const AlchemyAI: React.FC<AlchemyAIProps> = ({ onClose }) => {
  const { elements, unlockAllElements, unlockTierElements, resetElements } = useElementsStore();
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'ai', content: string, timestamp: number}[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState(AI_PERSONALITIES.SAGE);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(COMMON_QUESTIONS);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to the bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  
  // Add AI greeting message on first load
  useEffect(() => {
    handleAIResponse(selectedPersonality.greeting);
  }, []);
  
  // Generate questions based on unlocked elements
  useEffect(() => {
    const unlockedElements = Object.values(elements).filter(el => el.unlocked);
    const advancedElements = unlockedElements.filter(el => el.tier && el.tier >= 3);
    
    // If user has advanced elements, add specific questions
    if (advancedElements.length > 0) {
      const randomElement = advancedElements[Math.floor(Math.random() * advancedElements.length)];
      
      const newQuestions = [...COMMON_QUESTIONS];
      newQuestions.push({
        question: `How do I use ${randomElement.name}?`,
        answer: `${randomElement.name} is a versatile element! It can be combined with various other elements to create more complex items. Try experimenting with basic elements or other items in your collection.`
      });
      
      setSuggestedQuestions(newQuestions);
    }
  }, [elements]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    setConversation(prev => [...prev, {
      role: 'user',
      content: userInput,
      timestamp: Date.now()
    }]);
    
    // Generate AI response
    setIsTyping(true);
    setTimeout(() => {
      generateResponse(userInput);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    
    // Clear input
    setUserInput('');
  };
  
  const handleAIResponse = (message: string) => {
    setConversation(prev => [...prev, {
      role: 'ai',
      content: message,
      timestamp: Date.now()
    }]);
  };
  
  const handleQuestionClick = (question: string, answer: string) => {
    // Add the question to the conversation
    setConversation(prev => [...prev, {
      role: 'user',
      content: question,
      timestamp: Date.now()
    }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Add the answer after a delay
    setTimeout(() => {
      handleAIResponse(answer);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  // Handle cheat codes
  const processCheatCode = (input: string): string | null => {
    const lowercaseInput = input.toLowerCase().trim();
    
    // Cheat code for unlocking all elements
    if (lowercaseInput === "unlock all" || lowercaseInput === "/unlock_all" || lowercaseInput === "cheat:unlock_all") {
      unlockAllElements();
      return "🎉 Cheat code activated! All elements have been unlocked. Happy experimenting!";
    }
    
    // Cheat code for unlocking a specific tier
    const tierMatch = lowercaseInput.match(/unlock tier (\d+)|\/unlock_tier_(\d+)|cheat:unlock_tier_(\d+)/);
    if (tierMatch) {
      const tier = parseInt(tierMatch[1] || tierMatch[2] || tierMatch[3]);
      unlockTierElements(tier);
      return `🎉 Cheat code activated! All tier ${tier} elements have been unlocked.`;
    }
    
    // Cheat code for resetting progress
    if (lowercaseInput === "reset progress" || lowercaseInput === "/reset" || lowercaseInput === "cheat:reset") {
      resetElements();
      return "🔄 Progress reset! You now have only the basic elements. Start experimenting again!";
    }
    
    return null; // Not a cheat code
  };

  // Function to generate AI response based on user input
  const generateResponse = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    
    // First check if it's a cheat code
    const cheatResponse = processCheatCode(input);
    if (cheatResponse) {
      handleAIResponse(cheatResponse);
      return;
    }
    
    let response = "";
    
    // Check if input contains element names
    const elementNames = Object.values(elements)
      .filter(el => el.unlocked)
      .map(el => el.name.toLowerCase());
      
    const mentionedElements = elementNames.filter(name => 
      lowercaseInput.includes(name.toLowerCase())
    );
    
    // Element-specific responses
    if (mentionedElements.length > 0) {
      const elementName = mentionedElements[0];
      const elementId = Object.values(elements)
        .find(el => el.name.toLowerCase() === elementName)?.id;
      
      if (elementId && ELEMENTS_FACTS[elementId as keyof typeof ELEMENTS_FACTS]) {
        const facts = ELEMENTS_FACTS[elementId as keyof typeof ELEMENTS_FACTS];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        response = `Ah, ${elementName}! ${randomFact}. Would you like to know more about this element?`;
      }
    }
    // Check for recipe questions
    else if (lowercaseInput.includes("how") && (lowercaseInput.includes("make") || lowercaseInput.includes("create"))) {
      response = "To create new elements, you need to experiment with combining existing ones. Try dragging two elements together in the workspace! What specific element are you trying to create?";
    }
    // Check for cheat code instructions
    else if (lowercaseInput.includes("cheat") || lowercaseInput.includes("hack") || lowercaseInput.includes("unlock")) {
      response = "I know a few secrets... Try typing 'unlock all' to reveal all elements, or 'unlock tier X' to unlock a specific tier (where X is a number from 1-5). You can also type 'reset progress' to start over.";
    }
    // Check for help request
    else if (lowercaseInput.includes("help") || lowercaseInput.includes("hint")) {
      response = "I'd be happy to help! Try combining elements that might naturally go together. For example, Water and Earth create Mud. What elements do you currently have?";
    }
    // Generic responses
    else {
      const genericResponses = [
        "Interesting question! In alchemy, experimentation is key. Have you tried combining your basic elements in different ways?",
        "The path of an alchemist is one of discovery. Keep combining elements and see what new creations you can make!",
        "Hmm, I'm not quite sure about that. But have you discovered any rare elements yet? Try combining unlikely pairs!",
        "Ah, the mysteries of alchemy are endless. Continue your experiments and you'll uncover many secrets."
      ];
      
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    handleAIResponse(response);
  };
  
  const changePersonality = (personality: typeof AI_PERSONALITIES.SAGE) => {
    setSelectedPersonality(personality);
    handleAIResponse(`[Personality changed to ${personality.name}]`);
    handleAIResponse(personality.greeting);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div 
        className="bg-[#2a0033] text-white rounded-lg shadow-xl w-full max-w-3xl h-4/5 border border-yellow-500/30 flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/30">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{selectedPersonality.icon}</span>
            <h2 className="text-xl font-bold text-yellow-300">
              {selectedPersonality.name} - Alchemy Assistant
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Personality Selector */}
        <div className="flex justify-center gap-2 p-2 border-b border-yellow-500/20 bg-[#1a001f]">
          {Object.values(AI_PERSONALITIES).map((personality) => (
            <button 
              key={personality.name}
              onClick={() => changePersonality(personality)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedPersonality.name === personality.name 
                  ? 'bg-yellow-500 text-[#2a0033]' 
                  : 'bg-[#3f0047] text-yellow-300 hover:bg-[#4f0057]'
              }`}
            >
              <span className="mr-1">{personality.icon}</span>
              {personality.name}
            </button>
          ))}
        </div>
        
        {/* Chat area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {conversation.map((message, index) => (
              <motion.div
                key={`${message.role}-${message.timestamp}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-[#430045] text-white' 
                    : 'bg-yellow-500/20 text-yellow-100'
                }`}>
                  {message.role === 'ai' && (
                    <div className="flex items-center mb-1">
                      <span className="text-lg mr-2">{selectedPersonality.icon}</span>
                      <span className="font-semibold text-yellow-300">{selectedPersonality.name}</span>
                    </div>
                  )}
                  <p>{message.content}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-yellow-500/20 text-yellow-100 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{selectedPersonality.icon}</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                      <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}/>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={chatEndRef} />
          </AnimatePresence>
        </div>
        
        {/* Quick questions */}
        <div className="p-2 border-t border-yellow-500/20 bg-[#1a001f] overflow-x-auto">
          <div className="flex space-x-2">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(q.question, q.answer)}
                className="px-3 py-1 rounded-full bg-[#3f0047] text-yellow-300 hover:bg-[#4f0057] whitespace-nowrap text-sm transition-colors"
              >
                {q.question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-3 border-t border-yellow-500/30 flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about alchemy, elements, or combinations..."
            className="flex-grow bg-[#3f0047] border border-yellow-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim()}
            className={`p-2 rounded-lg ${
              userInput.trim() 
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AlchemyAI;