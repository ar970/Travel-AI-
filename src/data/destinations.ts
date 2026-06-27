export interface AgeSuitability {
  minAge: number;
  familyFriendly: boolean;
  seniorFriendly: boolean;
  intensityLevel: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  category: 'Beach' | 'Mountain' | 'City' | 'Cultural';
  avgDailyBudgetUSD: number;
  vibeTags: string[];
  topAttractions: string[];
  description: string;
  ageSuitability: AgeSuitability;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'dest_goa',
    name: 'Goa',
    country: 'India',
    category: 'Beach',
    avgDailyBudgetUSD: 55,
    vibeTags: ['Laidback', 'Coastal', 'Historic', 'Seafood'],
    topAttractions: [
      'Relaxed sunbathing at Mandrem Beach',
      'Historical walk of Basilica of Bom Jesus',
      'Leisurely sunset catamaran cruise',
      'Scenic spice plantation sensory tour',
      'Anjuna flea market shopping'
    ],
    description: 'A coastal paradise blending Portuguese history with golden sand beaches and a relaxed, leisurely lifestyle.',
    ageSuitability: {
      minAge: 0,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Most beaches are easily accessible, but some water-sport areas have active wave impacts.'
    }
  },
  {
    id: 'dest_manali',
    name: 'Manali',
    country: 'India',
    category: 'Mountain',
    avgDailyBudgetUSD: 45,
    vibeTags: ['Chilly', 'Scenic', 'Alpine', 'Trekking'],
    topAttractions: [
      'High-altitude Solang Valley cable car',
      'Active trek to Jogini Waterfalls',
      'Rohtang Pass high alpine snow walk',
      'Hadimba Temple ancient forest stroll',
      'Vashisht hot sulphur spring dip'
    ],
    description: 'Nestled in the Beas River Valley, Manali offers scenic snow-capped peaks, pine forests, and cool mountain air.',
    ageSuitability: {
      minAge: 5,
      familyFriendly: true,
      seniorFriendly: false,
      intensityLevel: 'High',
      notes: 'High altitudes and steep nature trails can cause breathlessness for young kids or limited mobility.'
    }
  },
  {
    id: 'dest_jaipur',
    name: 'Jaipur',
    country: 'India',
    category: 'Cultural',
    avgDailyBudgetUSD: 40,
    vibeTags: ['Royal', 'Vibrant', 'Handicrafts', 'Ancient'],
    topAttractions: [
      'Amber Fort courtyard exploration',
      'Hawa Mahal architectural view',
      'City Palace royal museum walk',
      'Jantar Mantar historic observatory',
      'Bapu Bazaar handicraft shopping'
    ],
    description: 'The capital of Rajasthan, known as the Pink City, is famous for its majestic palaces, massive forts, and colorful markets.',
    ageSuitability: {
      minAge: 3,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Palaces have multiple stairs and cobblestone courtyards, but slow exploration is comfortable.'
    }
  },
  {
    id: 'dest_kerala',
    name: 'Kerala (Alleppey)',
    country: 'India',
    category: 'Beach',
    avgDailyBudgetUSD: 50,
    vibeTags: ['Serene', 'Lush', 'Tropical', 'Waterways'],
    topAttractions: [
      'Alleppey backwater overnight houseboat',
      'Fort Kochi Chinese fishing nets walk',
      'Munnar tea estate panoramic drive',
      'Athirappilly waterfalls view point',
      'Traditional Kathakali theater show'
    ],
    description: 'Often called "God\'s Own Country", Kerala features peaceful backwaters, lush hill stations, and tropical spice gardens.',
    ageSuitability: {
      minAge: 0,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Low',
      notes: 'ハウスボート (Houseboat) and scenic drives make this exceptionally restful and perfect for seniors.'
    }
  },
  {
    id: 'dest_bali',
    name: 'Bali',
    country: 'Indonesia',
    category: 'Beach',
    avgDailyBudgetUSD: 70,
    vibeTags: ['Tropical', 'Spiritual', 'Scenic', 'Artistic'],
    topAttractions: [
      'Ubud Monkey Forest shaded boardwalk',
      'Tegallalang steep rice terrace view',
      'Tanah Lot wave-swept seaside temple',
      'Leisurely beach day at Seminyak',
      'Uluwatu Temple clifftop fire dance'
    ],
    description: 'A lush volcanic island decorated with thousands of Hindu temples, coral reefs, and iconic terraced rice fields.',
    ageSuitability: {
      minAge: 2,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Most sites are easy, though clifftop temples require negotiating moderate staircases.'
    }
  },
  {
    id: 'dest_bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    category: 'City',
    avgDailyBudgetUSD: 60,
    vibeTags: ['Bustling', 'Street Food', 'Temples', 'Riverfront'],
    topAttractions: [
      'Grand Palace royal compound walk',
      'Wat Arun stunning riverside climb',
      'Damnoen Saduak floating market boat',
      'Chatuchak sprawling weekend market',
      'Chinatown sensory evening street food'
    ],
    description: 'An energetic metropolis blending ornate historical temples with hyper-modern skyscrapers and a legendary food scene.',
    ageSuitability: {
      minAge: 4,
      familyFriendly: true,
      seniorFriendly: false,
      intensityLevel: 'Medium',
      notes: 'Humid heat and intense walking crowds can cause rapid exhaustion. Frequent indoor breaks are advised.'
    }
  },
  {
    id: 'dest_switzerland',
    name: 'Switzerland (Interlaken)',
    country: 'Switzerland',
    category: 'Mountain',
    avgDailyBudgetUSD: 180,
    vibeTags: ['Alpine', 'Pristine', 'Scenic', 'Adventure'],
    topAttractions: [
      'Jungfraujoch cogwheel railway glacier tour',
      'Lauterbrunnen valley waterfall stroll',
      'Harder Kulm steep panoramic funicular',
      'Scenic cruise of pristine Lake Brienz',
      'Active alpine hiking on Grindelwald First'
    ],
    description: 'A spectacular valley surrounded by the towering Bernese Alps, turquoise lakes, and mountain train routes.',
    ageSuitability: {
      minAge: 5,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'High',
      notes: 'Leisurely cruises and trains are accessible, but high-altitude spots can trigger altitude sensitivity.'
    }
  },
  {
    id: 'dest_paris',
    name: 'Paris',
    country: 'France',
    category: 'Cultural',
    avgDailyBudgetUSD: 130,
    vibeTags: ['Chic', 'Artistic', 'Historic', 'Culinary'],
    topAttractions: [
      'Louvre Museum monumental art tour',
      'Seine River glass-canopied boat cruise',
      'Eiffel Tower lift-access upper deck',
      'Palace of Versailles royal gardens',
      'Montmartre artist quarter walk'
    ],
    description: 'The global center of art, fashion, and gastronomy, set along the historic banks of the Seine River.',
    ageSuitability: {
      minAge: 4,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Subway systems have multiple stairways and long corridors without elevator access.'
    }
  },
  {
    id: 'dest_tokyo',
    name: 'Tokyo',
    country: 'Japan',
    category: 'City',
    avgDailyBudgetUSD: 120,
    vibeTags: ['Futuristic', 'Neon', 'Culinary', 'Immersive'],
    topAttractions: [
      'Senso-ji ancient temple stroll',
      'Shibuya Crossing futuristic lights',
      'Shinjuku Gyoen serene botanical garden',
      'teamLab Planets digital sensory zone',
      'Tsukiji Outer Market street food hunt'
    ],
    description: 'The ultimate synthesis of hyper-modern neon skyscrapers and ancient shrines, known for its pristine public safety.',
    ageSuitability: {
      minAge: 2,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Extremely stroller-friendly city-wide, though train transfers require extensive underground walking.'
    }
  },
  {
    id: 'dest_london',
    name: 'London',
    country: 'United Kingdom',
    category: 'City',
    avgDailyBudgetUSD: 140,
    vibeTags: ['Stately', 'Cultural', 'Historic', 'Parks'],
    topAttractions: [
      'British Museum grand history vault',
      'Tower Bridge glass floor walkway',
      'London Eye slow rotation capsule',
      'Hyde Park flower garden stroll',
      'West End musical theater production'
    ],
    description: 'A historic global capital boasting deep history, royal palaces, massive parks, and rich theatrical arts.',
    ageSuitability: {
      minAge: 0,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Low',
      notes: 'Flat city structure and extensive step-free bus/train routes make transit exceptionally comfortable.'
    }
  },
  {
    id: 'dest_rome',
    name: 'Rome',
    country: 'Italy',
    category: 'Cultural',
    avgDailyBudgetUSD: 100,
    vibeTags: ['Ancient', 'Grand', 'Historic', 'Culinary'],
    topAttractions: [
      'Colosseum ancient ruins walking tour',
      'Vatican Museums extensive gallery march',
      'Trevi Fountain evening historic visit',
      'Roman Forum archaeological stroll',
      'Pantheon interior marble dome marvel'
    ],
    description: 'An open-air museum detailing 3,000 years of global history, monumental architecture, and vibrant square piazzas.',
    ageSuitability: {
      minAge: 6,
      familyFriendly: true,
      seniorFriendly: false,
      intensityLevel: 'High',
      notes: 'Ancient uneven cobblestones, long outdoor queue lines, and high summer heat can be highly fatiguing.'
    }
  },
  {
    id: 'dest_dubai',
    name: 'Dubai',
    country: 'UAE',
    category: 'City',
    avgDailyBudgetUSD: 150,
    vibeTags: ['Luxurious', 'Futuristic', 'Modern', 'Oasis'],
    topAttractions: [
      'Burj Khalifa observatory upper view',
      'Dubai Mall synchronized fountain display',
      'Desert Safari sunset dune ride',
      'Miracle Garden floral pattern walk',
      'Old Dubai Creek traditional boat crossing'
    ],
    description: 'A glittering desert oasis known for its high-fashion shopping, futuristic architecture, and indoor theme parks.',
    ageSuitability: {
      minAge: 0,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Low',
      notes: 'All malls, hotels, and transport links have full air-conditioning, escalators, and ramp access.'
    }
  },
  {
    id: 'dest_leh',
    name: 'Leh Ladakh',
    country: 'India',
    category: 'Mountain',
    avgDailyBudgetUSD: 60,
    vibeTags: ['Remote', 'High Altitude', 'Monasteries', 'Stunning'],
    topAttractions: [
      'Pangong Tso stunning deep blue lake',
      'Khardung La historic high mountain pass',
      'Nubra Valley desert camel safari',
      'Thiksey Monastery historic prayer halls',
      'Magnetic Hill unique gravity drive'
    ],
    description: 'A cold mountain desert in the Himalayas, featuring dramatic barren terrain, remote Buddhist monasteries, and high passes.',
    ageSuitability: {
      minAge: 10,
      familyFriendly: false,
      seniorFriendly: false,
      intensityLevel: 'High',
      notes: 'Extremely high altitudes (11,000+ ft). First 48 hours must be spent fully resting. Not recommended for weak lungs.'
    }
  },
  {
    id: 'dest_udaipur',
    name: 'Udaipur',
    country: 'India',
    category: 'Cultural',
    avgDailyBudgetUSD: 45,
    vibeTags: ['Serene', 'Lush', 'Royal', 'Lakes'],
    topAttractions: [
      'Lake Pichola sunset boat ride',
      'City Palace royal courtyard museum',
      'Jagmandir Island palace scenic walk',
      'Sajjangarh Monsoon Palace hilltop sunset',
      'Vintage & Classic Car collection tour'
    ],
    description: 'Known as the Venice of the East, Udaipur sits around azure lakes and is crowned by majestic royal palaces.',
    ageSuitability: {
      minAge: 0,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Low',
      notes: 'Serene lake cruises, slow palace galleries, and mild evening temperatures provide a deeply restful cadence.'
    }
  },
  {
    id: 'dest_rishikesh',
    name: 'Rishikesh',
    country: 'India',
    category: 'Mountain',
    avgDailyBudgetUSD: 35,
    vibeTags: ['Spiritual', 'Active', 'Riverfront', 'Yoga'],
    topAttractions: [
      'Ganges River active white-water rafting',
      'Beatles Ashram ruins nature walk',
      'Parmarth Niketan spiritual Ganga Aarti',
      'Laxman Jhula scenic suspension bridge',
      'Himalayan foothill forest nature trek'
    ],
    description: 'The yoga capital of the world, located where the holy Ganges river emerges from the rugged Himalayan foothills.',
    ageSuitability: {
      minAge: 8,
      familyFriendly: true,
      seniorFriendly: false,
      intensityLevel: 'High',
      notes: 'Rafting and steep suspension bridge walks require high stamina, strong footing, and core physical strength.'
    }
  },
  {
    id: 'dest_hampi',
    name: 'Hampi',
    country: 'India',
    category: 'Cultural',
    avgDailyBudgetUSD: 35,
    vibeTags: ['Ancient', 'Mystic', 'Boulders', 'Ruins'],
    topAttractions: [
      'Virupaksha Temple monumental ancient walk',
      'Stone Chariot archaeological complex',
      'Matanga Hill steep sunrise trek',
      'Traditional round coracle river ride',
      'Lotus Mahal pristine architectural ruins'
    ],
    description: 'A UNESCO World Heritage site showcasing the majestic ruins of the ancient Vijayanagara Empire amidst giant boulder hills.',
    ageSuitability: {
      minAge: 8,
      familyFriendly: true,
      seniorFriendly: false,
      intensityLevel: 'High',
      notes: 'Very sparse shade, intense solar radiation, and miles of boulder walking. Highly fatiguing.'
    }
  },
  {
    id: 'dest_sydney',
    name: 'Sydney',
    country: 'Australia',
    category: 'Beach',
    avgDailyBudgetUSD: 110,
    vibeTags: ['Sunny', 'Coastal', 'Scenic', 'Harbor'],
    topAttractions: [
      'Sydney Opera House guided harbor tour',
      'Bondi Beach clifftop coastal walk',
      'Taronga Zoo scenic ferry ride',
      'Darling Harbour sensory evening walk',
      'Blue Mountains panoramic cliff viewing'
    ],
    description: 'A vibrant harbor city combining beautiful surf beaches, historic quarters, and dramatic sandstone cliffs.',
    ageSuitability: {
      minAge: 2,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Coastal walks feature some steep paths and staircases, but ferries and urban streets are flat and paven.'
    }
  },
  {
    id: 'dest_singapore',
    name: 'Singapore',
    country: 'Singapore',
    category: 'City',
    avgDailyBudgetUSD: 115,
    vibeTags: ['Clean', 'Vibrant', 'Garden City', 'Modern'],
    topAttractions: [
      'Gardens by the Bay cooled dome tour',
      'Sentosa Island cable car beach cruise',
      'Universal Studios amusement theme park',
      'Night Safari open-air tram tour',
      'Marina Bay Sands skyline light show'
    ],
    description: 'A hyper-green global financial hub renowned for its futuristic park complexes and immaculate public infrastructure.',
    ageSuitability: {
      minAge: 0,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Low',
      notes: 'Unbeatable wheelchair/stroller paving, elevator transit networks, and abundant indoor resting locations.'
    }
  },
  {
    id: 'dest_andaman',
    name: 'Andaman Islands',
    country: 'India',
    category: 'Beach',
    avgDailyBudgetUSD: 65,
    vibeTags: ['Primal', 'Tropical', 'Marine', 'Reefs'],
    topAttractions: [
      'Radhanagar Beach majestic sunset walk',
      'Cellular Jail historic sound-light show',
      'Havelock Island marine scuba dive',
      'Baratang Island mangrove speed boat',
      'Elephant Beach glass-bottom boat tour'
    ],
    description: 'An emerald archipelago in the Bay of Bengal, famous for pristine crystal beaches, coral reefs, and dense rainforests.',
    ageSuitability: {
      minAge: 5,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Boat transfers can involve steep steps and slippery piers, but beach spots are extremely peaceful.'
    }
  },
  {
    id: 'dest_darjeeling',
    name: 'Darjeeling',
    country: 'India',
    category: 'Mountain',
    avgDailyBudgetUSD: 40,
    vibeTags: ['Misty', 'Nostalgic', 'Teas', 'Chilly'],
    topAttractions: [
      'Tiger Hill early morning cold sunrise',
      'Historic Himalayan Toy Train mountain ride',
      'Happy Valley Tea Estate stroll',
      'Ghoom Monastery ancient shrine walk',
      'Himalayan Mountaineering Institute museum'
    ],
    description: 'The historic hill town framed by Mount Kanchenjunga, famous for aromatic tea fields, dense mist, and heritage trains.',
    ageSuitability: {
      minAge: 4,
      familyFriendly: true,
      seniorFriendly: true,
      intensityLevel: 'Medium',
      notes: 'Hilly roads have steep slopes, but slow sightseeing with cars and the heritage train minimizes effort.'
    }
  }
];
