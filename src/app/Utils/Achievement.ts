interface Achievement {
  id: string;
  name: string;
  description: string;
  showIcons: boolean;
  requiredCards?: Array<{
    cardKey: string;
    cardKeyBase?: string;
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
    id: 'starters',
    name: 'First Picks',
    description: 'Collect all First Parter Pokémon.',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Bulbasaur-1' },
      { cardKey: 'Charmander-4' },
      { cardKey: 'Squirtle-7' },
      { cardKey: 'Chikorita-152' },      
      { cardKey: 'Cyndaquil-155' },      
      { cardKey: 'Totodile-158' },      
      { cardKey: 'Treecko-252' },      
      { cardKey: 'Torchic-255' },      
      { cardKey: 'Mudkip-258' },      
      { cardKey: 'Turtwig-387' },      
      { cardKey: 'Chimchar-390' },      
      { cardKey: 'Piplup-393' },      
      { cardKey: 'Snivy-495' },      
      { cardKey: 'Tepig-498' },      
      { cardKey: 'Oshawott-501' },      
      { cardKey: 'Chespin-650' },      
      { cardKey: 'Fennekin-653' },      
      { cardKey: 'Froakie-656' },      
      { cardKey: 'Rowlet-722' },      
      { cardKey: 'Litten-725' },      
      { cardKey: 'Popplio-728' },      
      { cardKey: 'Grookey-810' },      
      { cardKey: 'Scorbunny-813' },      
      { cardKey: 'Sobble-816' },      
      { cardKey: 'Sprigatito-906' },      
      { cardKey: 'Fuecoco-909' },      
      { cardKey: 'Quaxly-912' },      
    ],
  },
    {
    id: 'eevee',
    name: 'Veevee Volley',
    description: 'Collect Eevee and all of its Evolutions',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Eevee-133' },
      { cardKey: 'Vaporeon-134' },
      { cardKey: 'Jolteon-135' },
      { cardKey: 'Flareon-136' },
      { cardKey: 'Espeon-196' },
      { cardKey: 'Umbreon-197' },
      { cardKey: 'Leafeon-470' },
      { cardKey: 'Glaceon-471' },
      { cardKey: 'Sylveon-700' },
      { cardKey: 'GMax Eevee-133', variant: 'GMax'}
    ],
  },
//   {
//   id: 'gholdengo',
//   name: 'Good as Gold',
//   description: 'Collect 99 Gimmighoul (any form) and a Gholdengo.',
//   showIcons: false,
//   requiredCards: [
//     {
//       cardKey: 'Gimmighoul-999',
//       cardKeyBase: 'Gimmighoul-999',
//       minCount: 99,
//     },
//     {
//       cardKey: 'Gimmighoul-999-Roaming',
//       cardKeyBase: 'Gimmighoul-999',
//       minCount: 0,
//       variant: 'Roaming',
//     },
//     { cardKey: 'Gholdengo-1000' },
//   ],
  
// },
  {
    id: 'regi',
    name: 'ÜN ÜN ÜN',
    description: 'Collect Regigigas and the Legendary Titans',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Regigigas-486' },
      { cardKey: 'Regirock-377' },
      { cardKey: 'Regice-378' },
      { cardKey: 'Registeel-379' },
      { cardKey: 'Regieleki-894' },
      { cardKey: 'Regidrago-895' },
    ],
  },
  {
    id: 'tao',
    name: 'Truth/Ideals',
    description: 'Collect Reshiram, Zekrom, and Kyurem',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Reshiram-643' },
      { cardKey: 'Kyurem (White)-646', variant: 'White' },
      { cardKey: 'Kyurem-646' },
      { cardKey: 'Kyurem (Black)-646', variant: 'Black' },
      { cardKey: 'Zekrom-644' },
    ],
  },
    {
    id: 'apple',
    name: 'An Applin a Day',
    description: 'Collect Applin and all of its Evolutions and Forms',
    showIcons: true,
    requiredCards: [
      { cardKey: 'Applin-840' },
      { cardKey: 'Flapple-841' },
      { cardKey: 'GMax Flapple-841', variant: 'GMax' },
      { cardKey: 'Appletun-842' },  
      { cardKey: 'GMax Appletun-842', variant: 'GMax' },  
      { cardKey: 'Dipplin-1011' },  
      { cardKey: 'Hydrapple-1019' },  
    ],
  },

//   {
//     id: 'terastal-master',
//     name: 'Terastal Master',
//     description: 'Collect all forms of Terapagos.',
//     showIcons: true,
//     requiredCards: [
//       { cardKey: 'Terapagos-1024' },
//       { cardKey: 'Terapagos (Terastal)-1024', variant: 'Terastal' },
//       { cardKey: 'Terapagos (Stellar)-1024', variant: 'Stellar' },
//     ],
//   },
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
//   {
//     id: 'kanto-collector',
//     name: 'Kanto Completionist',
//     description: 'Collect all Pokémon cards from the Kanto region.',
//     showIcons: false,
//     collectionGoal: {
//       property: 'region',
//       value: 'Kanto',
//       targetCount: 151
//     },
//   },
];