import React from 'react';

interface ElementIconProps {
  icon: string;
}

export const ElementIcon: React.FC<ElementIconProps> = ({ icon }) => {
  // Map of element icons using font awesome or custom SVG
  const iconMap: { [key: string]: JSX.Element } = {
    // Basic elements
    air: <i className="fas fa-wind"></i>,
    earth: <i className="fas fa-mountain"></i>,
    fire: <i className="fas fa-fire"></i>,
    water: <i className="fas fa-water"></i>,
    
    // Tier 1 elements
    steam: <i className="fas fa-smog"></i>,
    mud: <i className="fas fa-water" style={{ color: '#8B4513' }}></i>,
    dust: <i className="fas fa-brush"></i>,
    energy: <i className="fas fa-bolt"></i>,
    lava: <i className="fas fa-fire-alt"></i>,
    
    // Tier 2 elements
    stone: <i className="fas fa-dice-d6"></i>,
    metal: <i className="fas fa-cube"></i>,
    clay: <i className="fas fa-mortar-pestle"></i>,
    glass: <i className="fas fa-glass-martini"></i>,
    salt: <i className="fas fa-cubes"></i>,
    
    // Weather
    rain: <i className="fas fa-cloud-rain"></i>,
    cloud: <i className="fas fa-cloud"></i>,
    storm: <i className="fas fa-bolt"></i>,
    
    // Nature
    plant: <i className="fas fa-seedling"></i>,
    tree: <i className="fas fa-tree"></i>,
    flower: <i className="fas fa-spa"></i>,
    grass: <i className="fas fa-cannabis"></i>,
    leaf: <i className="fas fa-leaf"></i>,
    
    // Animals
    bird: <i className="fas fa-dove"></i>,
    fish: <i className="fas fa-fish"></i>,
    
    // Tools
    tool: <i className="fas fa-tools"></i>,
    pot: <i className="fas fa-utensil-spoon"></i>,
    pan: <i className="fas fa-utensils"></i>,
    oven: <i className="fas fa-temperature-high"></i>,
    knife: <i className="fas fa-utensil-knife"></i>,
    
    // Ingredients
    dough: <i className="fas fa-cookie"></i>,
    flour: <i className="fas fa-skiing"></i>,
    sugar: <i className="fas fa-cubes"></i>,
    egg: <i className="fas fa-egg"></i>,
    milk: <i className="fas fa-tint"></i>,
    butter: <i className="fas fa-cheese"></i>,
    cheese: <i className="fas fa-cheese"></i>,
    meat: <i className="fas fa-drumstick-bite"></i>,
    vegetable: <i className="fas fa-carrot"></i>,
    fruit: <i className="fas fa-apple-alt"></i>,
    spice: <i className="fas fa-pepper-hot"></i>,
    
    // Foods
    bread: <i className="fas fa-bread-slice"></i>,
    cake: <i className="fas fa-birthday-cake"></i>,
    pie: <i className="fas fa-chart-pie"></i>,
    soup: <i className="fas fa-mug-hot"></i>,
    stew: <i className="fas fa-utensil-spoon"></i>,
    pizza: <i className="fas fa-pizza-slice"></i>,
    pasta: <i className="fas fa-bacon"></i>,
    salad: <i className="fas fa-leaf"></i>,
    iceCream: <i className="fas fa-ice-cream"></i>,
    chocolate: <i className="fas fa-cookie"></i>,
    
    // Drinks
    coffee: <i className="fas fa-coffee"></i>,
    tea: <i className="fas fa-mug-hot"></i>,
    wine: <i className="fas fa-wine-glass-alt"></i>,
    beer: <i className="fas fa-beer"></i>,
    
    // Miscellaneous - fallbacks for any missing icons
    sand: <i className="fas fa-hourglass"></i>,
    rock: <i className="fas fa-mountain"></i>,
    desert: <i className="fas fa-sun"></i>,
    sun: <i className="fas fa-sun"></i>,
    time: <i className="fas fa-hourglass-half"></i>,
    bean: <i className="fas fa-seedling"></i>,
    grain: <i className="fas fa-wheat"></i>,
    oil: <i className="fas fa-tint"></i>,
    ice: <i className="fas fa-snowflake"></i>,
    net: <i className="fas fa-network-wired"></i>,
    
    // New Elements for Tiers
    smoke: <i className="fas fa-smog"></i>,
    pressure: <i className="fas fa-compress-arrows-alt"></i>,
    ash: <i className="fas fa-feather"></i>,
    algae: <i className="fas fa-water" style={{ color: 'green' }}></i>,
    seed: <i className="fas fa-seedling"></i>,
    light: <i className="fas fa-lightbulb"></i>,
    heat: <i className="fas fa-thermometer-full"></i>,
    animal: <i className="fas fa-paw"></i>,
    pottery: <i className="fas fa-mortar-pestle"></i>,
    coal: <i className="fas fa-cube" style={{ color: 'black' }}></i>,
    wood: <i className="fas fa-tree"></i>,
    paper: <i className="fas fa-scroll"></i>,
    wheat: <i className="fas fa-wheat"></i>,
    chicken: <i className="fas fa-kiwi-bird"></i>,
    cow: <i className="fas fa-horse"></i>,
    electricity: <i className="fas fa-bolt"></i>,
    wind: <i className="fas fa-wind"></i>,
    cold: <i className="fas fa-icicles"></i>,
    yeast: <i className="fas fa-bacteria"></i>,
    herb: <i className="fas fa-leaf"></i>,
    ceramics: <i className="fas fa-wine-bottle"></i>,
    cocoa: <i className="fas fa-seedling" style={{ color: 'brown' }}></i>,
    soil: <i className="fas fa-layer-group"></i>,
    pod: <i className="fas fa-stroopwafel"></i>,
    root: <i className="fas fa-carrot"></i>,
    cream: <i className="fas fa-cloud"></i>,
    batter: <i className="fas fa-fill-drip"></i>,
    broth: <i className="fas fa-glass-whiskey"></i>,
    sauce: <i className="fas fa-prescription-bottle"></i>,
    honey: <i className="fas fa-fill" style={{ color: 'gold' }}></i>,
    jam: <i className="fas fa-cookie-bite"></i>,
    vinegar: <i className="fas fa-tint-slash"></i>,
    noodle: <i className="fas fa-thermometer"></i>,
    cookedRice: <i className="fas fa-bacon"></i>,
    mushroom: <i className="fas fa-rocket"></i>,
    tofu: <i className="fas fa-dice"></i>,
    grill: <i className="fas fa-fire-alt"></i>,
    frozenDessert: <i className="fas fa-ice-cream"></i>,
    marinade: <i className="fas fa-flask"></i>,
    pastry: <i className="fas fa-cookie-bite"></i>,
    sandwich: <i className="fas fa-hamburger"></i>,
    roast: <i className="fas fa-drumstick-bite"></i>,
    riceDish: <i className="fas fa-utensils"></i>,
    curry: <i className="fas fa-utensil-spoon"></i>,
    stirFry: <i className="fas fa-fire"></i>,
    cookie: <i className="fas fa-cookie"></i>,
    bbq: <i className="fas fa-hotdog"></i>,
    feastPlatter: <i className="fas fa-concierge-bell"></i>,
    gourmetMeal: <i className="fas fa-award"></i>,
    holiday: <i className="fas fa-gifts"></i>,
    masterChefSpecial: <i className="fas fa-crown"></i>,
  };

  // Default icon if the specific one isn't found
  const defaultIcon = <i className="fas fa-question-circle"></i>;
  
  return iconMap[icon] || defaultIcon;
};
