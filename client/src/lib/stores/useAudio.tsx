import { create } from "zustand";

interface TierSounds {
  [tier: number]: HTMLAudioElement | null;
}

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  tierSounds: TierSounds;
  isMuted: boolean;
  
  // Initialization
  initializeAudio: () => void;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setTierSound: (tier: number, sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playTierSound: (tier: number) => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  tierSounds: {},
  isMuted: true, // Start muted by default
  
  initializeAudio: () => {
    // Create audio elements for each sound
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    const backgroundMusic = new Audio('/sounds/background.mp3');
    
    // Create tier sounds
    const tier1Sound = new Audio('/sounds/tier1.mp3');
    const tier2Sound = new Audio('/sounds/tier2.mp3');
    const tier3Sound = new Audio('/sounds/tier3.mp3');
    const tier4Sound = new Audio('/sounds/tier4.mp3');
    const tier5Sound = new Audio('/sounds/tier5.mp3');
    
    // Configure background music
    if (backgroundMusic) {
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.2;
    }
    
    // Set the sounds in the store
    set({ 
      hitSound, 
      successSound, 
      backgroundMusic,
      tierSounds: {
        1: tier1Sound,
        2: tier2Sound,
        3: tier3Sound,
        4: tier4Sound,
        5: tier5Sound
      }
    });
    
    // Load saved mute state
    try {
      const savedMuteState = localStorage.getItem('alchemyKitchen_muted');
      if (savedMuteState !== null) {
        set({ isMuted: savedMuteState === 'true' });
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error);
    }
  },
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setTierSound: (tier, sound) => {
    const { tierSounds } = get();
    set({ 
      tierSounds: { ...tierSounds, [tier]: sound }
    });
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Save mute state
    try {
      localStorage.setItem('alchemyKitchen_muted', newMutedState.toString());
    } catch (error) {
      console.error('Failed to save audio settings:', error);
    }
    
    // Handle background music
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      }
    }
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playTierSound: (tier) => {
    const { tierSounds, isMuted } = get();
    const tierSound = tierSounds[tier];
    
    if (tierSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log(`Tier ${tier} sound skipped (muted)`);
        return;
      }
      
      tierSound.currentTime = 0;
      tierSound.volume = 0.5;
      tierSound.play().catch(error => {
        console.log(`Tier ${tier} sound play prevented:`, error);
      });
    }
  }
}));
