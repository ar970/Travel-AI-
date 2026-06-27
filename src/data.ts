import { Traveler, Activity, BudgetItem } from './types';

export const INITIAL_TRAVELERS: Traveler[] = [
  { id: '1', name: 'Maya', age: 7, category: 'kid', energy: 85, maxEnergy: 80, avatar: '👧' },
  { id: '2', name: 'Leo', age: 15, category: 'teen', energy: 95, maxEnergy: 100, avatar: '👦' },
  { id: '3', name: 'Dad (Robert)', age: 42, category: 'adult', energy: 75, maxEnergy: 90, avatar: '👨' },
  { id: '4', name: 'Grandma (Elena)', age: 72, category: 'senior', energy: 60, maxEnergy: 65, avatar: '👵' },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: 'High-Speed Rollercoaster World',
    category: 'adventure',
    minAge: 10,
    maxAge: 55,
    fatigueCost: 5,
    cost: 75,
    description: 'Adrenaline-pumping thrill rides and steel rollercoasters.',
    votes: { '1': 'down', '2': 'up', '3': 'up', '4': 'down' }
  },
  {
    id: 'a2',
    title: 'Modern Art Museum & Sculpture Garden',
    category: 'culture',
    minAge: 5,
    maxAge: 95,
    fatigueCost: 2,
    cost: 20,
    description: 'A slow-paced walk through historical and contemporary art galleries.',
    votes: { '1': 'down', '2': 'down', '3': 'up', '4': 'up' }
  },
  {
    id: 'a3',
    title: 'Inter-generational Botanical Glasshouse Tour',
    category: 'relaxation',
    minAge: 0,
    maxAge: 100,
    fatigueCost: 1,
    cost: 15,
    description: 'Beautiful, fully accessible gardens with sitting areas every 50 meters.',
    votes: { '1': 'up', '2': 'neutral', '3': 'up', '4': 'up' }
  },
  {
    id: 'a4',
    title: 'Interactive Hands-On Science Discovery Center',
    category: 'entertainment',
    minAge: 4,
    maxAge: 75,
    fatigueCost: 3,
    cost: 25,
    description: 'Fun science exhibits that engage both kids and curious adults.',
    votes: { '1': 'up', '2': 'up', '3': 'up', '4': 'neutral' }
  },
  {
    id: 'a5',
    title: 'Sunset Coastal Cruise & Dinner',
    category: 'dining',
    minAge: 3,
    maxAge: 100,
    fatigueCost: 1,
    cost: 60,
    description: 'A smooth catamaran cruise with high-quality dinner buffet and stunning views.',
    votes: { '1': 'neutral', '2': 'up', '3': 'up', '4': 'up' }
  }
];

export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'b1', title: 'Vacation Rental (4 nights)', amount: 650, category: 'Lodging', date: '2026-07-10' },
  { id: 'b2', title: 'Science Center Tickets', amount: 90, category: 'Activities', date: '2026-07-11' },
  { id: 'b3', title: 'Local Seafood Dinner', amount: 180, category: 'Food', date: '2026-07-11' },
  { id: 'b4', title: 'Train Passes (Group discount)', amount: 120, category: 'Transport', date: '2026-07-10' },
];

export const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for standard family weekend getaways.',
    features: [
      'Up to 4 group members',
      'Basic Energy Tracking',
      'Static Age recommendations',
      'Manual budget tracker'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Explorer',
    price: '$8',
    period: 'per month',
    description: 'Designed for larger multi-generation groups traveling together.',
    features: [
      'Up to 12 group members',
      'AI-Powered Conflict Negotiation',
      'Age-Smart safety alerts',
      'Dynamic Fatigue Optimizer',
      'Shared group voting'
    ],
    cta: 'Try Explorer Free',
    popular: true
  },
  {
    name: 'Wanderer',
    price: '$15',
    period: 'per month',
    description: 'Ultimate compromise tool for family reunions and travel clubs.',
    features: [
      'Unlimited travelers',
      '24/7 Globi AI Concierge integration',
      'Real-time fatigue alert triggers',
      'Multi-currency budget ledger',
      'Exportable custom itineraries'
    ],
    cta: 'Get Wanderer',
    popular: false
  }
];

export const TESTIMONIALS = [
  {
    quote: "Traveling with my 74-year-old mother and my hyperactive 6-year-old was a constant debate. Kinfolk's Fatigue Budget was a lifesaver. We scheduled sitting down during Maya's nap times and everyone stayed happy!",
    author: "Sarah M.",
    role: "Traveling with mom & child",
    avatar: "👩‍👧‍👦",
    trip: "Orlando Getaway"
  },
  {
    quote: "Usually, the teenagers rebel or my grandfather gets exhausted. Kinfolk showed us that a Sunset Boat Cruise fit both their energy profiles perfectly. The compromise score saved us from hours of bickering.",
    author: "Daniel K.",
    role: "Family reunion organizer",
    avatar: "👨‍👩‍👧‍👦",
    trip: "Amalfi Coast"
  },
  {
    quote: "The Age-Smart filter automatically warned us that the mountain bike trail was too steep for our 8-year-old and too jarring for grandmother's back, proposing a scenic rail ride instead. Unbelievable!",
    author: "Elena R.",
    role: "Mother of 3, traveling with seniors",
    avatar: "👩‍👩‍👦‍👦",
    trip: "Pacific Northwest"
  }
];

// Helper functions for our logic
export function getAgeCategory(age: number): 'kid' | 'teen' | 'adult' | 'senior' {
  if (age <= 12) return 'kid';
  if (age <= 19) return 'teen';
  if (age <= 64) return 'adult';
  return 'senior';
}

export function getMaxEnergyForCategory(category: 'kid' | 'teen' | 'adult' | 'senior'): number {
  switch (category) {
    case 'kid': return 80; // easily hyper but crash early
    case 'teen': return 100; // max endurance but sleep in
    case 'adult': return 90; // high planning endurance
    case 'senior': return 65; // lower peak, requires rest
  }
}

export function getEmojiForCategory(category: 'kid' | 'teen' | 'adult' | 'senior'): string {
  switch (category) {
    case 'kid': return '👧';
    case 'teen': return '👦';
    case 'adult': return '👨';
    case 'senior': return '👵';
  }
}
