import { pipeline, env } from '@xenova/transformers';

// Set environment variables
env.allowLocalModels = false;  // Disable local models
env.useBrowserCache = true;    // Use browser caching

// Class to handle the transformer model
class TransformerModelSingleton {
  private static instance: TransformerModelSingleton;
  private modelPromise: Promise<any> | null = null;
  private pipe: any = null;
  private modelLoading: boolean = false;
  private modelReady: boolean = false;

  // Private constructor for singleton pattern
  private constructor() {}

  // Get singleton instance
  public static getInstance(): TransformerModelSingleton {
    if (!TransformerModelSingleton.instance) {
      TransformerModelSingleton.instance = new TransformerModelSingleton();
    }
    return TransformerModelSingleton.instance;
  }

  // Check if model is ready
  public isReady(): boolean {
    return this.modelReady;
  }

  // Check if model is currently loading
  public isLoading(): boolean {
    return this.modelLoading;
  }

  // Initialize the model
  public async initialize(): Promise<void> {
    if (this.modelPromise) return this.modelPromise;
    
    this.modelLoading = true;
    
    // Use the pipeline API for easier interfacing with the model
    this.modelPromise = pipeline('text-generation', 'Xenova/tiny-random-gpt2')
      .then((model: any) => {
        this.pipe = model;
        this.modelReady = true;
        this.modelLoading = false;
        return model;
      })
      .catch((error: Error) => {
        console.error('Error loading the model:', error);
        this.modelLoading = false;
        throw error;
      });
    
    return this.modelPromise;
  }

  // Generate text based on a prompt
  public async generateText(prompt: string, maxLength: number = 100): Promise<string> {
    if (!this.pipe) {
      try {
        await this.initialize();
      } catch (error) {
        return `I apologize, but I seem to be having difficulty accessing my ancient wisdom. ${error}`;
      }
    }

    try {
      // Generate text
      const result = await this.pipe(prompt, {
        max_new_tokens: maxLength,
        temperature: 0.7,   // Controls randomness: lower values make output more deterministic
        top_k: 50,          // Controls diversity
        top_p: 0.9,         // Controls diversity
        no_repeat_ngram_size: 3, // Avoid repeating the same n-grams
      });

      // Extract the generated text and clean it up
      let generatedText = result[0].generated_text;
      
      // Remove the prompt from the beginning
      if (generatedText.startsWith(prompt)) {
        generatedText = generatedText.slice(prompt.length);
      }
      
      // Try to find a natural stopping point
      const naturalEndPoints = ['.', '!', '?', '\n'];
      for (const endPoint of naturalEndPoints) {
        const lastIndex = generatedText.lastIndexOf(endPoint);
        if (lastIndex > generatedText.length / 2) { // Only truncate if we're past halfway
          generatedText = generatedText.slice(0, lastIndex + 1);
          break;
        }
      }
      
      return generatedText.trim();
    } catch (error) {
      console.error('Error generating text:', error);
      return "The ancient wisdom fails me at the moment. Please ask again.";
    }
  }
}

// Export the singleton instance
export const transformerModel = TransformerModelSingleton.getInstance();