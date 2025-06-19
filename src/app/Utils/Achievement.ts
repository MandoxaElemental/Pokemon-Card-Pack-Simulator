interface Achievement {
  id: string;
  name: string;
  description: string;
  showIcons: boolean;
  requiredCards?: Array<{
    cardKey: string;
    variant?: string;
    isShiny?: boolean;
    minCount?: number;
  }>;
  collectionGoal?: {
    property: 'type' | 'rarity' | 'isShiny' | 'region';
    value?: string;
    targetCount: number;
  };
}

export const achievements: Achievement[] = [
  {
    id: 'kanto-starters',
    name: 'Kanto Starters',
    description: 'Collect the Kanto starter Pokémon.',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Bulbasaur-1' },
      { cardKey: 'Charmander-4' },
      { cardKey: 'Squirtle-7' },
    ],
  },
  {
    id: 'terastal-master',
    name: 'Terastal Master',
    description: 'Collect all forms of Terapagos.',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Terapagos-1024' },
      { cardKey: 'Terapagos (Terastal)-1024', variant: 'Terastal' },
      { cardKey: 'Terapagos (Stellar)-1024', variant: 'Stellar' },
    ],
  },
  {
    id: 'legendary-birds',
    name: 'Uno, Dos, Tres',
    description: 'Collect all forms of the Legendary Birds',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Articuno-144' },
      { cardKey: 'Zapdos-145' },
      { cardKey: 'Moltres-146' },
      { cardKey: 'Articuno (Galar)-144', variant: 'Galar' },
      { cardKey: 'Zapdos (Galar)-145', variant: 'Galar' },
      { cardKey: 'Moltres (Galar)-146', variant: 'Galar' },
    //   { cardKey: 'Terapagos (Stellar)-1024', variant: 'Stellar', },
    ],
  },
  {
    id: 'normal-collector',
    name: 'Schoolkid',
    description: 'Collect 100 Normal-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Normal',
      targetCount: 100,
    },
  },
  {
    id: 'fighting-collector',
    name: 'Black Belt',
    description: 'Collect 100 Fighting-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Fighting',
      targetCount: 100,
    },
  },
  {
    id: 'flying-collector',
    name: 'Bird Keeper',
    description: 'Collect 100 Flying-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Flying',
      targetCount: 100,
    },
  },
   {
    id: 'poison-collector',
    name: 'Punk',
    description: 'Collect 100 Poison-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Poison',
      targetCount: 100,
    },
  },
  {
    id: 'ground-collector',
    name: 'Ruin Maniac',
    description: 'Collect 100 Ground-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Ground',
      targetCount: 100,
    },
  },
  {
    id: 'rock-collector',
    name: 'Hiker',
    description: 'Collect 100 ROck-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Rock',
      targetCount: 100,
    },
  },
  {
    id: 'bug-collector',
    name: 'Bug Catcher',
    description: 'Collect 100 Bug-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Bug',
      targetCount: 100,
    },
  },
  {
    id: 'ghost-collector',
    name: 'Hex Maniac',
    description: 'Collect 100 Ghost-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Ghost',
      targetCount: 100,
    },
  },
  {
    id: 'steel-collector',
    name: 'Steel Worker',
    description: 'Collect 100 Steel-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Steel',
      targetCount: 100,
    },
  },
  {
    id: 'fire-collector',
    name: 'Kindler',
    description: 'Collect 100 Fire-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Fire',
      targetCount: 100,
    },
  },
  {
    id: 'water-collector',
    name: 'Swimmer',
    description: 'Collect 100 Water-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Water',
      targetCount: 100,
    },
  },
  {
    id: 'grass-collector',
    name: 'Aroma Lady',
    description: 'Collect 100 Grass-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Grass',
      targetCount: 100,
    },
  },
  {
    id: 'electric-collector',
    name: 'Rocker',
    description: 'Collect 100 Electric-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Electric',
      targetCount: 100,
    },
  },
  {
    id: 'psychic-collector',
    name: 'Psychic',
    description: 'Collect 100 Psychic-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Psychic',
      targetCount: 100,
    },
  },
  {
    id: 'ice-collector',
    name: 'Skier',
    description: 'Collect 100 Ice-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Ice',
      targetCount: 100,
    },
  },
  {
    id: 'dragon-collector',
    name: 'Dragon Tamer',
    description: 'Collect 100 Dragon-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Dragon',
      targetCount: 100,
    },
  },
  {
    id: 'dark-collector',
    name: 'Delinquent',
    description: 'Collect 100 Dark-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Dark',
      targetCount: 100,
    },
  },
  {
    id: 'fairy-collector',
    name: 'Fairy Tale Girl',
    description: 'Collect 100 Fairy-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Fairy',
      targetCount: 100,
    },
  },
   {
    id: 'stellar-collector',
    name: 'The 19th Type',
    description: 'Collect 5 Stellar-Type cards.',
    showIcons: false,
    collectionGoal: {
      property: 'type',
      value: 'Stellar',
      targetCount: 5,
    },
  },
  {
    id: 'shiny-hunter',
    name: 'Shiny Hunter',
    description: 'Collect 10 Shiny Pokémon cards.',
    showIcons: false,
    collectionGoal: {
      property: 'isShiny',
      targetCount: 10,
    },
  },
  {
    id: 'mythical-master',
    name: 'Mythical Master',
    description: 'Collect 10 Mythical Pokémon cards.',
    showIcons: false,
    collectionGoal: {
      property: 'rarity',
      value: 'Mythical',
      targetCount: 10,
    },
  },
  {
    id: 'kanto-collector',
    name: 'Kanto Completionist',
    description: 'Collect all Pokémon cards from the Kanto region.',
    showIcons: false,
    collectionGoal: {
      property: 'region',
      value: 'Kanto',
      targetCount: 151
    },
  },
];