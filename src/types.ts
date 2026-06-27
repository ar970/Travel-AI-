export interface Traveler {
  id: string;
  name: string;
  age: number;
  category: 'kid' | 'teen' | 'adult' | 'senior';
  energy: number; // Current energy percentage (0-100)
  maxEnergy: number; // Base energy based on age category
  avatar: string;
}

export interface Activity {
  id: string;
  title: string;
  category: 'adventure' | 'culture' | 'relaxation' | 'dining' | 'entertainment';
  minAge: number;
  maxAge: number;
  fatigueCost: number; // 0 to 5, where 5 is high energy drain
  cost: number; // $ cost per person
  description: string;
  votes: Record<string, 'up' | 'down' | 'neutral'>; // travelerId -> vote
}

export interface BudgetItem {
  id: string;
  title: string;
  amount: number;
  category: 'Lodging' | 'Activities' | 'Food' | 'Transport' | 'Other';
  date: string;
}

export type ViewState = 'landing' | 'app_shell';

export type TabType = 'dashboard' | 'trips' | 'explore' | 'concierge' | 'profile';
