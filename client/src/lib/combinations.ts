// Type definition for an element combination
interface Combination {
  elements: [string, string]; // IDs of the two elements to combine
  result: string; // ID of the resulting element
}

// List of all possible element combinations
export const combinations: Combination[] = [
  // TIER 1: Primary combinations from basic elements
  { elements: ['water', 'fire'], result: 'steam' },
  { elements: ['earth', 'water'], result: 'mud' },
  { elements: ['earth', 'air'], result: 'dust' },
  { elements: ['fire', 'air'], result: 'energy' },
  { elements: ['earth', 'fire'], result: 'lava' },
  { elements: ['fire', 'fire'], result: 'smoke' },
  { elements: ['air', 'air'], result: 'pressure' },
  { elements: ['air', 'steam'], result: 'cloud' },
  { elements: ['air', 'water'], result: 'rain' },
  { elements: ['lava', 'air'], result: 'stone' },
  { elements: ['stone', 'water'], result: 'sand' },
  { elements: ['fire', 'earth'], result: 'ash' },
  { elements: ['mud', 'fire'], result: 'clay' },
  { elements: ['water', 'stone'], result: 'salt' },
  { elements: ['water', 'water'], result: 'algae' },
  { elements: ['earth', 'plant'], result: 'seed' },
  { elements: ['plant', 'pressure'], result: 'oil' },
  { elements: ['fire', 'energy'], result: 'light' },
  { elements: ['water', 'cold'], result: 'ice' },
  { elements: ['air', 'sand'], result: 'time' },
  { elements: ['fire', 'pressure'], result: 'heat' },
  
  // TIER 2: Secondary combinations
  { elements: ['stone', 'fire'], result: 'metal' },
  { elements: ['sand', 'fire'], result: 'glass' },
  { elements: ['clay', 'fire'], result: 'pottery' },
  { elements: ['stone', 'pressure'], result: 'coal' },
  { elements: ['earth', 'seed'], result: 'plant' },
  { elements: ['plant', 'time'], result: 'tree' },
  { elements: ['plant', 'light'], result: 'flower' },
  { elements: ['earth', 'rain'], result: 'grass' },
  { elements: ['tree', 'tool'], result: 'wood' },
  { elements: ['wood', 'water'], result: 'paper' },
  { elements: ['grass', 'seed'], result: 'wheat' },
  { elements: ['mud', 'seed'], result: 'rice' },
  { elements: ['egg', 'time'], result: 'chicken' },
  { elements: ['grass', 'animal'], result: 'cow' },
  { elements: ['metal', 'stone'], result: 'tool' },
  { elements: ['energy', 'metal'], result: 'electricity' },
  { elements: ['air', 'pressure'], result: 'wind' },
  { elements: ['ice', 'air'], result: 'cold' },
  { elements: ['plant', 'sun'], result: 'sugar' },
  { elements: ['algae', 'sugar'], result: 'yeast' },
  { elements: ['chicken', 'time'], result: 'egg' },
  { elements: ['cow', 'time'], result: 'milk' },
  { elements: ['cow', 'knife'], result: 'meat' },
  { elements: ['water', 'animal'], result: 'fish' },
  { elements: ['plant', 'earth'], result: 'spice' },
  { elements: ['plant', 'light'], result: 'herb' },
  { elements: ['plant', 'water'], result: 'vegetable' },
  { elements: ['tree', 'time'], result: 'fruit' },
  { elements: ['clay', 'heat'], result: 'ceramics' },
  
  // TIER 3: Complex combinations
  { elements: ['wheat', 'tool'], result: 'flour' },
  { elements: ['milk', 'energy'], result: 'butter' },
  { elements: ['milk', 'time'], result: 'cheese' },
  { elements: ['milk', 'tool'], result: 'cream' },
  { elements: ['flour', 'water'], result: 'dough' },
  { elements: ['flour', 'egg'], result: 'batter' },
  { elements: ['meat', 'water'], result: 'broth' },
  { elements: ['vegetable', 'oil'], result: 'sauce' },
  { elements: ['cocoa', 'sugar'], result: 'chocolate' },
  { elements: ['flower', 'time'], result: 'honey' },
  { elements: ['fruit', 'sugar'], result: 'jam' },
  { elements: ['wine', 'time'], result: 'vinegar' },
  { elements: ['dough', 'tool'], result: 'noodle' },
  { elements: ['rice', 'water'], result: 'cookedRice' },
  { elements: ['plant', 'pod'], result: 'bean' },
  { elements: ['earth', 'root'], result: 'potato' },
  { elements: ['soil', 'rain'], result: 'mushroom' },
  { elements: ['bean', 'water'], result: 'tofu' },
  { elements: ['bean', 'heat'], result: 'coffee' },
  { elements: ['herb', 'water'], result: 'tea' },
  { elements: ['fruit', 'yeast'], result: 'wine' },
  { elements: ['wheat', 'yeast'], result: 'beer' },
  { elements: ['metal', 'tool'], result: 'knife' },
  { elements: ['clay', 'fire'], result: 'pot' },
  { elements: ['metal', 'clay'], result: 'pan' },
  { elements: ['metal', 'fire'], result: 'oven' },
  { elements: ['metal', 'fire'], result: 'grill' },
  { elements: ['ice', 'cream'], result: 'frozenDessert' },
  { elements: ['oil', 'herb'], result: 'marinade' },
  
  // TIER 4: Advanced combinations
  { elements: ['dough', 'oven'], result: 'bread' },
  { elements: ['dough', 'butter'], result: 'pastry' },
  { elements: ['vegetable', 'broth'], result: 'soup' },
  { elements: ['meat', 'vegetable'], result: 'stew' },
  { elements: ['vegetable', 'sauce'], result: 'salad' },
  { elements: ['bread', 'meat'], result: 'sandwich' },
  { elements: ['meat', 'oven'], result: 'roast' },
  { elements: ['noodle', 'sauce'], result: 'pasta' },
  { elements: ['cookedRice', 'vegetable'], result: 'riceDish' },
  { elements: ['meat', 'spice'], result: 'curry' },
  { elements: ['meat', 'pan'], result: 'stirFry' },
  { elements: ['cream', 'cold'], result: 'iceCream' },
  { elements: ['fruit', 'pastry'], result: 'pie' },
  { elements: ['dough', 'sugar'], result: 'cookie' },
  { elements: ['dough', 'cheese'], result: 'pizza' },
  { elements: ['meat', 'grill'], result: 'bbq' },
  
  // TIER 5: Final creations
  { elements: ['pastry', 'cream'], result: 'cake' },
  { elements: ['meat', 'bread'], result: 'feastPlatter' },
  { elements: ['pasta', 'sauce'], result: 'gourmetMeal' },
  { elements: ['roast', 'vegetable'], result: 'holiday' },
  { elements: ['gourmetMeal', 'chocolate'], result: 'masterChefSpecial' },
  
  // Additional combinations for flexibility in recipes
  { elements: ['stone', 'stone'], result: 'rock' },
  { elements: ['sand', 'sand'], result: 'desert' },
  { elements: ['water', 'energy'], result: 'storm' },
  { elements: ['fire', 'clay'], result: 'pot' },
  { elements: ['earth', 'energy'], result: 'stone' },
  { elements: ['plant', 'knife'], result: 'vegetable' },
  { elements: ['fire', 'dough'], result: 'bread' },
  { elements: ['water', 'pot'], result: 'soup' },
  { elements: ['water', 'dust'], result: 'mud' },
  { elements: ['water', 'leaf'], result: 'tea' },
  { elements: ['water', 'bean'], result: 'coffee' }
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
