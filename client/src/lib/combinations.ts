// Type definition for an element combination
interface Combination {
  elements: [string, string]; // IDs of the two elements to combine
  result: string; // ID of the resulting element
}

// List of all possible element combinations
export const combinations: Combination[] = [
  // Basic element combinations
  { elements: ['water', 'fire'], result: 'steam' },
  { elements: ['earth', 'water'], result: 'mud' },
  { elements: ['earth', 'air'], result: 'dust' },
  { elements: ['fire', 'air'], result: 'energy' },
  { elements: ['earth', 'fire'], result: 'lava' },
  
  // Tier 2 combinations
  { elements: ['mud', 'fire'], result: 'clay' },
  { elements: ['lava', 'air'], result: 'stone' },
  { elements: ['stone', 'fire'], result: 'metal' },
  { elements: ['sand', 'fire'], result: 'glass' },
  { elements: ['water', 'sun'], result: 'salt' },
  
  // Earth combinations
  { elements: ['stone', 'stone'], result: 'rock' },
  { elements: ['earth', 'stone'], result: 'sand' },
  { elements: ['sand', 'sand'], result: 'desert' },
  { elements: ['earth', 'seed'], result: 'plant' },
  
  // Weather combinations
  { elements: ['air', 'water'], result: 'rain' },
  { elements: ['water', 'dust'], result: 'mud' },
  { elements: ['air', 'steam'], result: 'cloud' },
  { elements: ['water', 'energy'], result: 'storm' },
  
  // Tool combinations
  { elements: ['fire', 'metal'], result: 'tool' },
  { elements: ['metal', 'tool'], result: 'knife' },
  { elements: ['metal', 'fire'], result: 'oven' },
  { elements: ['clay', 'fire'], result: 'pot' },
  { elements: ['metal', 'clay'], result: 'pan' },
  
  // Ingredient combinations
  { elements: ['plant', 'tool'], result: 'flour' },
  { elements: ['flour', 'water'], result: 'dough' },
  { elements: ['plant', 'sun'], result: 'sugar' },
  { elements: ['bird', 'time'], result: 'egg' },
  { elements: ['animal', 'grass'], result: 'milk' },
  { elements: ['milk', 'tool'], result: 'butter' },
  { elements: ['milk', 'time'], result: 'cheese' },
  { elements: ['animal', 'knife'], result: 'meat' },
  { elements: ['water', 'net'], result: 'fish' },
  { elements: ['earth', 'rain'], result: 'vegetable' },
  { elements: ['tree', 'time'], result: 'fruit' },
  { elements: ['plant', 'desert'], result: 'spice' },
  
  // Food combinations
  { elements: ['dough', 'oven'], result: 'bread' },
  { elements: ['dough', 'sugar'], result: 'cake' },
  { elements: ['fruit', 'dough'], result: 'pie' },
  { elements: ['water', 'vegetable'], result: 'soup' },
  { elements: ['meat', 'vegetable'], result: 'stew' },
  { elements: ['dough', 'cheese'], result: 'pizza' },
  { elements: ['flour', 'egg'], result: 'pasta' },
  { elements: ['vegetable', 'oil'], result: 'salad' },
  { elements: ['milk', 'ice'], result: 'iceCream' },
  { elements: ['milk', 'sugar'], result: 'chocolate' },
  { elements: ['water', 'bean'], result: 'coffee' },
  { elements: ['water', 'leaf'], result: 'tea' },
  { elements: ['fruit', 'time'], result: 'wine' },
  { elements: ['grain', 'water'], result: 'beer' },
  
  // Fallback combinations (to ensure discovery of important elements)
  { elements: ['earth', 'energy'], result: 'stone' },
  { elements: ['water', 'stone'], result: 'sand' },
  { elements: ['fire', 'clay'], result: 'pot' },
  { elements: ['fire', 'stone'], result: 'metal' },
  { elements: ['earth', 'water'], result: 'plant' },
  { elements: ['plant', 'knife'], result: 'vegetable' },
  { elements: ['plant', 'water'], result: 'fruit' },
  { elements: ['fire', 'dough'], result: 'bread' },
  { elements: ['water', 'pot'], result: 'soup' }
];

/**
 * Checks if two elements can be combined, regardless of order.
 */
export function findCombination(element1Id: string, element2Id: string) {
  return combinations.find(
    ({ elements }) =>
      (elements[0] === element1Id && elements[1] === element2Id) ||
      (elements[0] === element2Id && elements[1] === element1Id)
  );
}
