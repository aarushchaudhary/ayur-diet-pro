// Mock data for Ayurvedic food items with nutritional and Ayurvedic properties
export const foodDatabase = [
  // Grains
  {
    id: 1,
    name: 'Basmati Rice',
    category: 'Grains',
    carbs: 28,
    protein: 2.7,
    fat: 0.3,
    kcal: 130,
    virya: 'Cold',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Light', 'Soft'],
    description: 'Easy to digest, cooling in nature'
  },
  {
    id: 2,
    name: 'Wheat Chapati',
    category: 'Grains',
    carbs: 15,
    protein: 3,
    fat: 0.7,
    kcal: 80,
    virya: 'Hot',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Dry'],
    description: 'Nourishing, builds strength'
  },
  {
    id: 3,
    name: 'Jowar Roti',
    category: 'Grains',
    carbs: 22,
    protein: 3.5,
    fat: 1.2,
    kcal: 110,
    virya: 'Hot',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Light', 'Dry'],
    description: 'Gluten-free, good for diabetics'
  },
  
  // Legumes/Pulses
  {
    id: 4,
    name: 'Mung Dal',
    category: 'Legumes',
    carbs: 12,
    protein: 24,
    fat: 1.2,
    kcal: 150,
    virya: 'Cold',
    rasa: ['Sweet', 'Astringent'],
    vipaka: 'Sweet',
    guna: ['Light', 'Dry'],
    description: 'Easiest to digest among all legumes'
  },
  {
    id: 5,
    name: 'Masoor Dal',
    category: 'Legumes',
    carbs: 20,
    protein: 25,
    fat: 1.1,
    kcal: 180,
    virya: 'Hot',
    rasa: ['Sweet', 'Astringent'],
    vipaka: 'Pungent',
    guna: ['Heavy', 'Oily'],
    description: 'High in protein, warming'
  },
  {
    id: 6,
    name: 'Chana Dal',
    category: 'Legumes',
    carbs: 15,
    protein: 20,
    fat: 6,
    kcal: 180,
    virya: 'Hot',
    rasa: ['Sweet', 'Astringent'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Dry'],
    description: 'Rich in fiber and protein'
  },

  // Vegetables
  {
    id: 7,
    name: 'Spinach',
    category: 'Vegetables',
    carbs: 1.4,
    protein: 2.9,
    fat: 0.4,
    kcal: 23,
    virya: 'Hot',
    rasa: ['Bitter', 'Astringent'],
    vipaka: 'Pungent',
    guna: ['Light', 'Dry'],
    description: 'Iron rich, blood purifying'
  },
  {
    id: 8,
    name: 'Bottle Gourd',
    category: 'Vegetables',
    carbs: 3.4,
    protein: 0.6,
    fat: 0.1,
    kcal: 15,
    virya: 'Cold',
    rasa: ['Sweet', 'Bitter'],
    vipaka: 'Sweet',
    guna: ['Light', 'Soft'],
    description: 'Cooling, easy to digest'
  },
  {
    id: 9,
    name: 'Okra',
    category: 'Vegetables',
    carbs: 7,
    protein: 2,
    fat: 0.1,
    kcal: 33,
    virya: 'Hot',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Slimy'],
    description: 'Good for diabetes, high in fiber'
  },
  {
    id: 10,
    name: 'Carrot',
    category: 'Vegetables',
    carbs: 6,
    protein: 0.9,
    fat: 0.2,
    kcal: 25,
    virya: 'Hot',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Oily'],
    description: 'Rich in beta-carotene, good for eyes'
  },

  // Spices and Herbs
  {
    id: 11,
    name: 'Turmeric Powder',
    category: 'Spices',
    carbs: 3,
    protein: 0.9,
    fat: 0.3,
    kcal: 15,
    virya: 'Hot',
    rasa: ['Bitter', 'Pungent'],
    vipaka: 'Pungent',
    guna: ['Light', 'Dry'],
    description: 'Anti-inflammatory, blood purifier'
  },
  {
    id: 12,
    name: 'Cumin Seeds',
    category: 'Spices',
    carbs: 2.6,
    protein: 1.3,
    fat: 1.3,
    kcal: 22,
    virya: 'Hot',
    rasa: ['Pungent', 'Bitter'],
    vipaka: 'Pungent',
    guna: ['Light', 'Dry'],
    description: 'Digestive, carminative'
  },
  {
    id: 13,
    name: 'Coriander Seeds',
    category: 'Spices',
    carbs: 3.7,
    protein: 1.2,
    fat: 0.9,
    kcal: 23,
    virya: 'Cold',
    rasa: ['Sweet', 'Pungent'],
    vipaka: 'Sweet',
    guna: ['Light', 'Oily'],
    description: 'Cooling, digestive, anti-inflammatory'
  },

  // Dairy
  {
    id: 14,
    name: 'Ghee (1 tsp)',
    category: 'Dairy',
    carbs: 0,
    protein: 0,
    fat: 5,
    kcal: 45,
    virya: 'Hot',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Oily'],
    description: 'Rejuvenating, improves digestion'
  },
  {
    id: 15,
    name: 'Buttermilk',
    category: 'Dairy',
    carbs: 5,
    protein: 3.5,
    fat: 0.9,
    kcal: 40,
    virya: 'Hot',
    rasa: ['Sour', 'Astringent'],
    vipaka: 'Sweet',
    guna: ['Light', 'Hot'],
    description: 'Digestive, good for gut health'
  },

  // Prepared Foods
  {
    id: 16,
    name: 'Kitchari (Mung Dal Rice)',
    category: 'Prepared',
    carbs: 45,
    protein: 15,
    fat: 8,
    kcal: 320,
    virya: 'Neutral',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Light', 'Soft'],
    description: 'Complete meal, tridoshic, easy to digest'
  },
  {
    id: 17,
    name: 'Vegetable Soup',
    category: 'Prepared',
    carbs: 8,
    protein: 2,
    fat: 1,
    kcal: 45,
    virya: 'Hot',
    rasa: ['Sweet', 'Salty'],
    vipaka: 'Sweet',
    guna: ['Light', 'Hot'],
    description: 'Nourishing, easy to digest'
  },

  // Fruits
  {
    id: 18,
    name: 'Apple',
    category: 'Fruits',
    carbs: 14,
    protein: 0.3,
    fat: 0.2,
    kcal: 52,
    virya: 'Cold',
    rasa: ['Sweet', 'Astringent'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Rough'],
    description: 'Cooling, good fiber content'
  },
  {
    id: 19,
    name: 'Banana',
    category: 'Fruits',
    carbs: 23,
    protein: 1.1,
    fat: 0.3,
    kcal: 89,
    virya: 'Cold',
    rasa: ['Sweet', 'Astringent'],
    vipaka: 'Sour',
    guna: ['Heavy', 'Oily'],
    description: 'High potassium, quick energy'
  },
  {
    id: 20,
    name: 'Pomegranate',
    category: 'Fruits',
    carbs: 19,
    protein: 1.7,
    fat: 1.2,
    kcal: 83,
    virya: 'Cold',
    rasa: ['Sweet', 'Sour', 'Astringent'],
    vipaka: 'Sweet',
    guna: ['Light', 'Dry'],
    description: 'Antioxidant rich, blood purifier'
  },

  // Beverages/Drinks
  {
    id: 21,
    name: 'Warm Water with Lemon',
    category: 'Beverages',
    carbs: 1,
    protein: 0,
    fat: 0,
    kcal: 4,
    virya: 'Hot',
    rasa: ['Sour'],
    vipaka: 'Sweet',
    guna: ['Light', 'Sharp'],
    description: 'Detoxifying, digestive'
  },
  {
    id: 22,
    name: 'Ginger Tea',
    category: 'Beverages',
    carbs: 2,
    protein: 0.1,
    fat: 0,
    kcal: 8,
    virya: 'Hot',
    rasa: ['Pungent'],
    vipaka: 'Sweet',
    guna: ['Light', 'Sharp'],
    description: 'Digestive, warming, anti-nausea'
  },
  {
    id: 23,
    name: 'CCF Tea (Cumin-Coriander-Fennel)',
    category: 'Beverages',
    carbs: 1.5,
    protein: 0.2,
    fat: 0.1,
    kcal: 6,
    virya: 'Neutral',
    rasa: ['Sweet', 'Pungent'],
    vipaka: 'Sweet',
    guna: ['Light', 'Dry'],
    description: 'Digestive, detoxifying, tridoshic'
  },

  // Nuts and Seeds
  {
    id: 24,
    name: 'Almonds (soaked)',
    category: 'Nuts',
    carbs: 2.5,
    protein: 2.6,
    fat: 5.4,
    kcal: 69,
    virya: 'Hot',
    rasa: ['Sweet'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Oily'],
    description: 'Brain tonic, nourishing, best when soaked'
  },
  {
    id: 25,
    name: 'Sesame Seeds',
    category: 'Seeds',
    carbs: 2.1,
    protein: 1.8,
    fat: 4.9,
    kcal: 57,
    virya: 'Hot',
    rasa: ['Sweet', 'Bitter'],
    vipaka: 'Sweet',
    guna: ['Heavy', 'Oily'],
    description: 'High calcium, warming, good for bones'
  }
];

// Helper function to filter foods by category
export const getFoodsByCategory = (category) => {
  return foodDatabase.filter(food => food.category === category);
};

// Helper function to get foods by virya
export const getFoodsByVirya = (virya) => {
  return foodDatabase.filter(food => food.virya === virya);
};

// Helper function to get foods by rasa
export const getFoodsByRasa = (rasa) => {
  return foodDatabase.filter(food => food.rasa.includes(rasa));
};