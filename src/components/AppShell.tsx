import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map, 
  Compass, 
  MessageSquare, 
  User, 
  Plus, 
  Trash2, 
  Activity as ActivityIcon, 
  Coins, 
  Battery, 
  BatteryCharging, 
  Users, 
  ChevronRight, 
  Search, 
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  LogOut,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Check,
  Send
} from 'lucide-react';
import { Traveler, Activity, BudgetItem, TabType } from '../types';
import { 
  INITIAL_TRAVELERS, 
  INITIAL_ACTIVITIES, 
  INITIAL_BUDGET_ITEMS,
  getAgeCategory,
  getMaxEnergyForCategory
} from '../data';
import { DESTINATIONS, Destination } from '../data/destinations';

export interface PlannedActivity {
  id: string;
  title: string;
  slot: 'Morning' | 'Afternoon' | 'Evening';
  energyCost: number; // 1-5
  intensityLevel: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface DayPlan {
  day: number;
  activities: PlannedActivity[];
  runningFatigue: number;
  fatigueCeiling: number;
  swappedNote?: string;
}

export const getAISuggestedDestination = (travelStyle: string, intensityCeiling: string) => {
  let bestDest = DESTINATIONS[0];
  let maxScore = -999;
  
  const intensityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const userCeilingNum = intensityOrder[intensityCeiling as 'Low' | 'Medium' | 'High'] || 2;

  for (const dest of DESTINATIONS) {
    let score = 0;
    const styleLower = travelStyle.toLowerCase();
    
    if (styleLower === 'adventure') {
      if (dest.category === 'Mountain') score += 5;
      if (dest.vibeTags.some(tag => ['Adventure', 'Trekking', 'Active', 'Alpine'].includes(tag))) score += 5;
    } else if (styleLower === 'relaxation') {
      if (dest.category === 'Beach') score += 5;
      if (dest.vibeTags.some(tag => ['Laidback', 'Serene', 'Tropical'].includes(tag))) score += 5;
    } else if (styleLower === 'cultural') {
      if (dest.category === 'Cultural') score += 5;
      if (dest.vibeTags.some(tag => ['Historic', 'Ancient', 'Spiritual', 'Royal'].includes(tag))) score += 5;
    } else if (styleLower === 'foodie') {
      if (dest.vibeTags.some(tag => ['Seafood', 'Street Food', 'Culinary'].includes(tag))) score += 5;
    } else if (styleLower === 'backpacker') {
      if (dest.avgDailyBudgetUSD < 60) score += 5;
    } else if (styleLower === 'luxury') {
      if (dest.avgDailyBudgetUSD > 100) score += 5;
      if (dest.vibeTags.some(tag => ['Luxurious', 'Futuristic', 'Chic'].includes(tag))) score += 5;
    }
    
    const destIntensityNum = intensityOrder[dest.ageSuitability.intensityLevel] || 2;
    if (destIntensityNum > userCeilingNum) {
      score -= 20; // Exceeds limits
    } else if (destIntensityNum === userCeilingNum) {
      score += 3;
    } else {
      score += 1;
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestDest = dest;
    }
  }
  return bestDest;
};

export const generateTripPlan = (destination: Destination, intensityCeiling: string, hasChildren: boolean, hasSeniors: boolean): DayPlan[] => {
  const fatigueCeiling = (hasChildren || hasSeniors) ? 10 : 16;
  const attractions = destination.topAttractions;
  
  const intensityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const userCeilingNum = intensityOrder[intensityCeiling as 'Low' | 'Medium' | 'High'] || 2;
  
  const getIntensityForIndex = (idx: number): 'Low' | 'Medium' | 'High' => {
    if (idx === 1 || idx === 2) return 'High';
    if (idx === 0 || idx === 3) return 'Medium';
    return 'Low';
  };
  
  const getEnergyCostForIndex = (idx: number): number => {
    if (idx === 1) return 5;
    if (idx === 2) return 4;
    if (idx === 0) return 3;
    if (idx === 3) return 2;
    return 1;
  };

  const getCleanDescriptionForIndex = (idx: number): string => {
    if (idx === 0) return "Explore the core sights, capturing grand scenic vistas and historic photo points.";
    if (idx === 1) return "An active expedition trail featuring magnificent outlooks and moderate physical engagement.";
    if (idx === 2) return "A detailed walkthrough of iconic architecture, involving light steps and rich histories.";
    if (idx === 3) return "A peaceful promenade around cultural centers with convenient access to indoor galleries.";
    return "Relaxed exploration of native spots, designed for comforting transit and abundant sitting breaks.";
  };

  const lowEnergyPool = [
    { title: "Shaded Rest & Botanical Tea Break", energyCost: 1, intensityLevel: 'Low' as const, description: "Unwind under shaded pavillions, sipping fresh local infusions with minimal physical strain." },
    { title: "Quiet Dinner & Story Hour at Local Bistro", energyCost: 1, intensityLevel: 'Low' as const, description: "Delight in local recipes in an easy, temperature-controlled quiet restaurant setup." },
    { title: "Serene Sunset Waterfront Stroll", energyCost: 1, intensityLevel: 'Low' as const, description: "Admire panoramic golden-hour views from paved, flat, fully accessible seaside platforms." },
    { title: "Artisan Handicraft Showcase", energyCost: 2, intensityLevel: 'Low' as const, description: "Observe a quiet, sitting masterclass of native wood carving, weaving, or painting." }
  ];

  const days: DayPlan[] = [];

  for (let d = 1; d <= 3; d++) {
    const dayActivities: PlannedActivity[] = [];
    let candidateIndices: number[] = [];
    
    if (d === 1) {
      candidateIndices = [0, 1, 4];
    } else if (d === 2) {
      candidateIndices = [3, 2, 4];
    } else {
      candidateIndices = [0, 3, 4];
    }

    const slots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening'];
    let swappedNote: string | undefined = undefined;

    for (let s = 0; s < 3; s++) {
      const slot = slots[s];
      const attrIdx = candidateIndices[s];
      
      let title = attractions[attrIdx] || attractions[0];
      let intensity = getIntensityForIndex(attrIdx);
      let cost = getEnergyCostForIndex(attrIdx);
      let description = getCleanDescriptionForIndex(attrIdx);

      if (intensityOrder[intensity] > userCeilingNum) {
        const replacement = lowEnergyPool[s % lowEnergyPool.length];
        title = replacement.title;
        intensity = 'Low';
        cost = replacement.energyCost;
        description = replacement.description;
      }

      dayActivities.push({
        id: `day_${d}_slot_${s}`,
        title,
        slot,
        energyCost: cost,
        intensityLevel: intensity,
        description
      });
    }

    let runningFatigue = dayActivities.reduce((acc, act) => acc + act.energyCost, 0);

    if (runningFatigue > fatigueCeiling) {
      const originalActivityName = dayActivities[2].title;
      const lighter = lowEnergyPool[d % lowEnergyPool.length];
      
      dayActivities[2] = {
        id: `day_${d}_slot_2`,
        title: lighter.title,
        slot: 'Evening',
        energyCost: lighter.energyCost,
        intensityLevel: 'Low',
        description: lighter.description
      };

      runningFatigue = dayActivities.reduce((acc, act) => acc + act.energyCost, 0);
      swappedNote = `Swapped "${originalActivityName}" for "${lighter.title}" — today was already at the group's energy limit.`;
    }

    days.push({
      day: d,
      activities: dayActivities,
      runningFatigue,
      fatigueCeiling,
      swappedNote
    });
  }

  return days;
};

export const getCompromiseOptions = (destination: Destination) => {
  const highEnergy = destination.topAttractions[1] || destination.topAttractions[0];
  const lowEnergy = destination.topAttractions[3] || destination.topAttractions[4];
  const sharedSpot = destination.topAttractions[4] || "a cozy local café";

  const optionA = `Split the morning — youth to "${highEnergy}", seniors and adults to "${lowEnergy}" — meet for lunch at "${sharedSpot}"`;
  const optionB = `Everyone together at "${lowEnergy}", shorter visit with plenty of seated resting points, and a light stroll afterward`;

  return { optionA, optionB };
};

interface AppShellProps {
  onLogOut: () => void;
  userEmail?: string;
}

// A reusable elegant wrapper that renders a styled editorial bento-style card
const EditorialCard: React.FC<{
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, className = "", children }) => {
  return (
    <div className={`relative border border-charcoal/10 rounded-none bg-warm-parchment p-6 transition-all duration-300 hover:border-clay/40 shadow-sm ${className}`}>
      {/* Editorial label indicator */}
      <div className="absolute -top-3 left-4 bg-sage text-warm-parchment text-[9px] font-mono font-bold px-3 py-1 uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-2 h-full">
        {children}
      </div>
    </div>
  );
};

export default function AppShell({ onLogOut, userEmail = "traveler@kinfolk.com" }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // App states
  const [travelers, setTravelers] = useState<Traveler[]>(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        if (profile.ageProfile && profile.ageProfile.travelers) {
          return profile.ageProfile.travelers;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRAVELERS;
  });

  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');

  // Destination states
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(() => {
    const stored = localStorage.getItem('currentTripPlan');
    if (stored) {
      try {
        const plan = JSON.parse(stored);
        if (plan && plan.destinationId) {
          const dest = DESTINATIONS.find(d => d.id === plan.destinationId);
          return dest || null;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [currentTripPlan, setCurrentTripPlan] = useState<DayPlan[] | null>(() => {
    const stored = localStorage.getItem('currentTripPlan');
    if (stored) {
      try {
        const plan = JSON.parse(stored);
        if (plan && plan.days) {
          return plan.days;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [appliedNegotiationOption, setAppliedNegotiationOption] = useState<'A' | 'B' | null>(() => {
    const stored = localStorage.getItem('currentTripPlan');
    if (stored) {
      try {
        const plan = JSON.parse(stored);
        if (plan && plan.appliedNegotiationOption) {
          return plan.appliedNegotiationOption;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Filter and search states for destination library
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | 'Beach' | 'Mountain' | 'City' | 'Cultural'>('All');
  const [destSearchQuery, setDestSearchQuery] = useState('');

  // Sync back to localStorage profile on traveler edits
  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        if (profile.ageProfile) {
          const ages = travelers.map(t => t.age);
          const hasChildren = travelers.some(t => t.age < 13);
          const hasTeens = travelers.some(t => t.age >= 13 && t.age <= 17);
          const hasSeniors = travelers.some(t => t.age > 60);

          let groupType = 'Group';
          if (travelers.length === 1) {
            groupType = 'Solo';
          } else if (travelers.length === 2) {
            const ageDiff = Math.abs(travelers[0].age - travelers[1].age);
            if (ageDiff <= 15 && travelers[0].age >= 18 && travelers[1].age >= 18) {
              groupType = 'Couple';
            } else if (hasChildren) {
              groupType = 'Family';
            }
          } else {
            if (hasChildren && hasSeniors) {
              groupType = 'Multigen';
            } else if (hasChildren) {
              groupType = 'Family';
            }
          }

          const isAll18to40 = travelers.length > 0 && travelers.every(t => t.age >= 18 && t.age <= 40);
          let derivedIntensity: 'Low' | 'Medium' | 'High' = 'Medium';
          if (hasSeniors || hasChildren) {
            derivedIntensity = 'Low';
          } else if (isAll18to40) {
            derivedIntensity = 'High';
          }

          profile.ageProfile.travelers = travelers;
          profile.ageProfile.hasChildren = hasChildren;
          profile.ageProfile.hasTeens = hasTeens;
          profile.ageProfile.hasSeniors = hasSeniors;
          profile.ageProfile.groupType = groupType;
          profile.ageProfile.intensityCeiling = derivedIntensity;
          
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [travelers]);
  
  // New traveler form state
  const [newTravelerName, setNewTravelerName] = useState('');
  const [newTravelerAge, setNewTravelerAge] = useState(30);
  const [isAddingTraveler, setIsAddingTraveler] = useState(false);

  // New budget item form state
  const [newBudgetItemTitle, setNewBudgetItemTitle] = useState('');
  const [newBudgetItemAmount, setNewBudgetItemAmount] = useState('');
  const [newBudgetItemCategory, setNewBudgetItemCategory] = useState<'Lodging' | 'Activities' | 'Food' | 'Transport' | 'Other'>('Activities');

  // Globi Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'globi'; text: string; time: string }>>([
    { 
      sender: 'globi', 
      text: "Welcome to Kinfolk Assistant. I monitor your group's fatigue rates and suggest optimal times for quiet rest slots. What can I help you coordinate today?", 
      time: "10:00 AM" 
    }
  ]);

  // Computed states
  const totalBudgetSpent = useMemo(() => {
    return budgetItems.reduce((acc, item) => acc + item.amount, 0);
  }, [budgetItems]);

  const budgetLimit = 1500;

  const ageSpread = useMemo(() => {
    if (travelers.length === 0) return { min: 0, max: 0 };
    const ages = travelers.map(t => t.age);
    return {
      min: Math.min(...ages),
      max: Math.max(...ages)
    };
  }, [travelers]);

  // Group summary categorization
  const groupCategoryCount = useMemo(() => {
    const counts = { kid: 0, teen: 0, adult: 0, senior: 0 };
    travelers.forEach(t => {
      counts[t.category]++;
    });
    return counts;
  }, [travelers]);

  // Average group fatigue
  const groupAverageEnergy = useMemo(() => {
    if (travelers.length === 0) return 100;
    const total = travelers.reduce((acc, t) => acc + t.energy, 0);
    return Math.round(total / travelers.length);
  }, [travelers]);

  const dynamicAgeProfile = useMemo(() => {
    const ages = travelers.map(t => t.age);
    const minAge = ages.length > 0 ? Math.min(...ages) : 0;
    const maxAge = ages.length > 0 ? Math.max(...ages) : 0;
    const hasChildren = travelers.some(t => t.age < 13);
    const hasTeens = travelers.some(t => t.age >= 13 && t.age <= 17);
    const hasSeniors = travelers.some(t => t.age > 60);

    let groupType = 'Group';
    if (travelers.length === 1) {
      groupType = 'Solo';
    } else if (travelers.length === 2) {
      const ageDiff = Math.abs(travelers[0].age - travelers[1].age);
      if (ageDiff <= 15 && travelers[0].age >= 18 && travelers[1].age >= 18) {
        groupType = 'Couple';
      } else if (hasChildren) {
        groupType = 'Family';
      }
    } else {
      if (hasChildren && hasSeniors) {
        groupType = 'Multigen';
      } else if (hasChildren) {
        groupType = 'Family';
      }
    }

    let intensityCeiling = 'Medium';
    let travelStyle = 'Cultural';
    let budgetTier = 'Mid-range';
    let currencySymbol = '$';
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const p = JSON.parse(stored);
        if (p.ageProfile && p.ageProfile.intensityCeiling) {
          intensityCeiling = p.ageProfile.intensityCeiling;
        }
        if (p.travelStyle) {
          travelStyle = p.travelStyle;
        }
        if (p.budgetTier) {
          budgetTier = p.budgetTier;
        }
        if (p.currency) {
          const map: Record<string, string> = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
          currencySymbol = map[p.currency] || '$';
        }
      } catch (e) {
        console.error(e);
      }
    }

    return {
      minAge,
      maxAge,
      hasChildren,
      hasTeens,
      hasSeniors,
      groupType,
      intensityCeiling,
      travelStyle,
      budgetTier,
      currencySymbol
    };
  }, [travelers]);

  // Handler: Select a destination and generate a 3-day itinerary
  const handleSelectAndPlanDestination = (dest: Destination) => {
    const intensityCeiling = dynamicAgeProfile.intensityCeiling || 'Medium';
    const hasChildren = dynamicAgeProfile.hasChildren || false;
    const hasSeniors = dynamicAgeProfile.hasSeniors || false;

    const planDays = generateTripPlan(dest, intensityCeiling, hasChildren, hasSeniors);
    setSelectedDestination(dest);
    setCurrentTripPlan(planDays);
    setAppliedNegotiationOption(null);

    // Save plan to localStorage
    const planObj = {
      destinationId: dest.id,
      days: planDays,
      appliedNegotiationOption: null
    };
    localStorage.setItem('currentTripPlan', JSON.stringify(planObj));
  };

  // Handler: Apply negotiation compromise to Day 1
  const handleApplyNegotiation = (option: 'A' | 'B') => {
    if (!selectedDestination || !currentTripPlan) return;

    const { optionA, optionB } = getCompromiseOptions(selectedDestination);
    const selectedCompromiseText = option === 'A' ? optionA : optionB;

    const updatedDays = currentTripPlan.map(d => {
      if (d.day === 1) {
        const updatedActivities = d.activities.map(act => {
          if (act.slot === 'Morning') {
            return {
              ...act,
              title: option === 'A' ? "Morning Split Compromise" : "Morning Unified Compromise",
              description: selectedCompromiseText,
              energyCost: option === 'A' ? 2 : 1,
              intensityLevel: 'Low' as const
            };
          }
          return act;
        });

        const newFatigue = updatedActivities.reduce((acc, act) => acc + act.energyCost, 0);

        return {
          ...d,
          activities: updatedActivities,
          runningFatigue: newFatigue,
          swappedNote: `Applied Negotiation Mode: ${option === 'A' ? 'Option A (Split Morning)' : 'Option B (Unified Slower-Pace)'}`
        };
      }
      return d;
    });

    setCurrentTripPlan(updatedDays);
    setAppliedNegotiationOption(option);

    const planObj = {
      destinationId: selectedDestination.id,
      days: updatedDays,
      appliedNegotiationOption: option
    };
    localStorage.setItem('currentTripPlan', JSON.stringify(planObj));
  };

  // Handler: Clear current trip plan and return to destination library
  const handleClearTripPlan = () => {
    setSelectedDestination(null);
    setCurrentTripPlan(null);
    setAppliedNegotiationOption(null);
    localStorage.removeItem('currentTripPlan');
  };

  // Handler: Add Traveler
  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerName.trim()) return;

    const category = getAgeCategory(newTravelerAge);
    const maxEnergy = getMaxEnergyForCategory(category);

    const newTraveler: Traveler = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTravelerName,
      age: newTravelerAge,
      category,
      energy: maxEnergy,
      maxEnergy,
      avatar: newTravelerName.charAt(0).toUpperCase()
    };

    setTravelers([...travelers, newTraveler]);
    setNewTravelerName('');
    setNewTravelerAge(30);
    setIsAddingTraveler(false);

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'globi',
        text: `Added ${newTravelerName} (${newTravelerAge}y/o). I have configured their individual fatigue parameters.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Handler: Delete Traveler
  const handleDeleteTraveler = (id: string) => {
    const travelerToDelete = travelers.find(t => t.id === id);
    setTravelers(travelers.filter(t => t.id !== id));
    
    if (travelerToDelete) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'globi',
          text: `Removed ${travelerToDelete.name} from the active roster. Compromise calculations updated.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Handler: Toggle activity vote
  const handleToggleVote = (activityId: string, travelerId: string, currentVote: 'up' | 'down' | 'neutral') => {
    setActivities(activities.map(act => {
      if (act.id === activityId) {
        const nextVote: 'up' | 'down' | 'neutral' = 
          currentVote === 'neutral' ? 'up' : 
          currentVote === 'up' ? 'down' : 'neutral';
        return {
          ...act,
          votes: {
            ...act.votes,
            [travelerId]: nextVote
          }
        };
      }
      return act;
    }));
  };

  // Handler: Rest Traveler (increase energy)
  const handleRestTraveler = (id: string) => {
    setTravelers(travelers.map(t => {
      if (t.id === id) {
        return { ...t, energy: Math.min(t.maxEnergy, t.energy + 20) };
      }
      return t;
    }));
  };

  // Handler: Rest Group (restore everyone to max energy)
  const handleRestGroup = () => {
    setTravelers(travelers.map(t => ({
      ...t,
      energy: t.maxEnergy
    })));
  };

  // Handler: Simulate active energy expenditure
  const handleSimulateActivity = (fatigueCost: number) => {
    setTravelers(travelers.map(t => {
      const rate = t.category === 'senior' ? fatigueCost * 1.5 : fatigueCost;
      const drain = Math.round(rate * 12);
      return {
        ...t,
        energy: Math.max(5, t.energy - drain)
      };
    }));
  };

  // Handler: Add budget item
  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newBudgetItemAmount);
    if (!newBudgetItemTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newBudgetItemTitle,
      amount: parsedAmount,
      category: newBudgetItemCategory,
      date: new Date().toISOString().split('T')[0]
    };

    setBudgetItems([newItem, ...budgetItems]);
    setNewBudgetItemTitle('');
    setNewBudgetItemAmount('');
  };

  // Handler: Delete budget item
  const handleDeleteBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  // Helper: Calculate custom compromise score
  const calculateCompromiseScore = (act: Activity) => {
    if (travelers.length === 0) return 0;
    
    let totalScore = 0;
    let countedTravelers = 0;

    travelers.forEach(t => {
      const vote = act.votes[t.id] || 'neutral';
      let voterWeight = 10;
      
      if (t.category === 'kid' || t.category === 'senior') {
        voterWeight = 14;
      }

      let votePoints = 0;
      if (vote === 'up') votePoints = 100;
      if (vote === 'neutral') votePoints = 50;
      if (vote === 'down') votePoints = 0;

      const isAgeCompatible = t.age >= act.minAge && t.age <= act.maxAge;
      if (!isAgeCompatible) {
        votePoints = Math.max(0, votePoints - 40);
      }

      if (t.energy < 40 && act.fatigueCost >= 3) {
        votePoints = Math.max(0, votePoints - 30);
      }

      totalScore += (votePoints * voterWeight);
      countedTravelers += voterWeight;
    });

    return Math.round(totalScore / countedTravelers);
  };

  // Handler: Send Message to Globi
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setTimeout(() => {
      let globiResponse = '';
      const inputLower = userMsg.toLowerCase();

      const lowEnergyTravelers = travelers.filter(t => t.energy < 50);

      if (inputLower.includes('fatigue') || inputLower.includes('energy') || inputLower.includes('tired')) {
        if (lowEnergyTravelers.length > 0) {
          const names = lowEnergyTravelers.map(t => t.name).join(' and ');
          globiResponse = `I see that ${names} have lower stamina profiles right now. I advise rescheduling highly draining items like the Adventure Park, and instead booking a quiet afternoon rest slot or the Botanical Tour.`;
        } else {
          globiResponse = `The group's average stamina stands at a healthy ${groupAverageEnergy}%. To maintain this pace, insert a slow-dining window during mid-afternoon.`;
        }
      } else if (inputLower.includes('kid') || inputLower.includes('grandma') || inputLower.includes('maya') || inputLower.includes('senior')) {
        const youngest = travelers.reduce((prev, curr) => prev.age < curr.age ? prev : curr, travelers[0]);
        const oldest = travelers.reduce((prev, curr) => prev.age > curr.age ? prev : curr, travelers[0]);
        globiResponse = `With ages spanning from ${youngest?.name} (${youngest?.age}) to ${oldest?.name} (${oldest?.age}), our filters are dynamically set to warn you of steep trails or high-stamina excursions.`;
      } else if (inputLower.includes('compromise') || inputLower.includes('vote') || inputLower.includes('disagree')) {
        globiResponse = "We analyzed current ballots. The 'Science Discovery Center' and the 'Sunset Cruise' achieve the highest score because they support comfortable rest areas and low physical burdens.";
      } else if (inputLower.includes('budget') || inputLower.includes('price') || inputLower.includes('cost')) {
        globiResponse = `You have utilized $${totalBudgetSpent} of your $${budgetLimit} pool. Leverage child & senior discount passes for activities to preserve funds.`;
      } else {
        globiResponse = `I have evaluated your multigenerational group of ${travelers.length}. I suggest focusing on low-fatigue shared activities today to avoid evening burnout.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'globi',
          text: globiResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(act => 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  return (
    <div className="min-h-screen bg-warm-parchment text-charcoal font-sans flex flex-col md:flex-row relative selection:bg-clay/20">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-ink-navy text-warm-parchment p-6 justify-between shrink-0 border-r border-charcoal/10 relative">
        <div className="space-y-8">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div>
              <span className="text-2xl font-serif font-black tracking-tight text-warm-parchment">Kinfolk</span>
              <p className="text-[9px] text-sage font-bold tracking-widest uppercase mt-0.5">Travel Platform</p>
            </div>
          </div>

          {/* Group Stamina Indicator */}
          <div className="bg-warm-parchment/5 p-4 border border-warm-parchment/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-warm-parchment/80">Group Stamina</span>
              <span className="font-bold text-clay">
                {groupAverageEnergy}%
              </span>
            </div>
            <div className="h-1 bg-warm-parchment/10 w-full">
              <div 
                className="h-full bg-clay transition-all duration-500"
                style={{ width: `${groupAverageEnergy}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-warm-parchment/50 leading-relaxed font-light">
              {groupAverageEnergy < 50 
                ? "Warning: Group energy is dipping. Swap in quiet slots." 
                : "Group stamina is healthy. Ready for activities."}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button 
              id="sidebar-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-clay text-warm-parchment' 
                  : 'text-warm-parchment/60 hover:bg-warm-parchment/5 hover:text-warm-parchment'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button 
              id="sidebar-tab-trips"
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeTab === 'trips' 
                  ? 'bg-clay text-warm-parchment' 
                  : 'text-warm-parchment/60 hover:bg-warm-parchment/5 hover:text-warm-parchment'
              }`}
            >
              <Map className="w-4 h-4" />
              Planner
            </button>

            <button 
              id="sidebar-tab-explore"
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeTab === 'explore' 
                  ? 'bg-clay text-warm-parchment' 
                  : 'text-warm-parchment/60 hover:bg-warm-parchment/5 hover:text-warm-parchment'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explorer
            </button>

            <button 
              id="sidebar-tab-concierge"
              onClick={() => setActiveTab('concierge')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeTab === 'concierge' 
                  ? 'bg-clay text-warm-parchment' 
                  : 'text-warm-parchment/60 hover:bg-warm-parchment/5 hover:text-warm-parchment'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Concierge
            </button>

            <button 
              id="sidebar-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-clay text-warm-parchment' 
                  : 'text-warm-parchment/60 hover:bg-warm-parchment/5 hover:text-warm-parchment'
              }`}
            >
              <User className="w-4 h-4" />
              Ledger
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-warm-parchment/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center font-bold text-sage text-xs">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-warm-parchment truncate">{userEmail}</span>
              <span className="block text-[10px] text-warm-parchment/40">Trip Host</span>
            </div>
          </div>
          <button 
            id="sidebar-logout"
            onClick={onLogOut}
            className="w-full border border-warm-parchment/20 hover:border-clay hover:text-clay text-warm-parchment/60 text-xs font-bold py-2.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-ink-navy text-warm-parchment px-5 py-4 flex items-center justify-between border-b border-charcoal/10">
        <span className="text-xl font-serif font-black tracking-tight text-warm-parchment">Kinfolk</span>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono bg-clay text-warm-parchment px-2.5 py-1">
            🔋 {groupAverageEnergy}%
          </span>
          <button onClick={onLogOut} className="p-1 text-warm-parchment/60 hover:text-clay">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 pb-24 md:pb-12 bg-warm-parchment">
        
        {/* Editorial Subheader */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-charcoal/10">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-sage font-bold uppercase tracking-widest mb-2">
              <span>Kinfolk Space</span>
              <ChevronRight className="w-3 h-3 text-charcoal/30" />
              <span className="text-clay">{activeTab}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-ink-navy capitalize tracking-tight">
              {activeTab === 'dashboard' && 'Group Dashboard'}
              {activeTab === 'trips' && 'Consensus Planner'}
              {activeTab === 'explore' && 'Excursion Explorer'}
              {activeTab === 'concierge' && 'Concierge Helper'}
              {activeTab === 'profile' && 'Stamina & Budget Ledger'}
            </h1>
          </div>

          {/* Quick Info Grid */}
          <div className="flex gap-6 text-xs bg-warm-parchment border border-charcoal/10 p-3">
            <div>
              <span className="block text-[9px] text-sage font-bold uppercase tracking-wider">Ages Spanned</span>
              <span className="font-serif font-bold text-ink-navy text-sm">
                {ageSpread.min} – {ageSpread.max} yrs <span className="text-[10px] text-charcoal/60 font-sans font-light">({travelers.length} guests)</span>
              </span>
            </div>
            <div className="w-px bg-charcoal/15"></div>
            <div>
              <span className="block text-[9px] text-sage font-bold uppercase tracking-wider">Budget Spent</span>
              <span className="font-serif font-bold text-ink-navy text-sm">
                ${totalBudgetSpent} <span className="text-[10px] text-charcoal/60 font-sans font-light">/ ${budgetLimit}</span>
              </span>
            </div>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="relative">
          <AnimatePresence mode="wait">
            
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Side: Snapshots */}
                <div className="lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Trip Summary */}
                    <EditorialCard label="Active Excursion">
                      <div className="flex flex-col justify-between h-full min-h-[180px]">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-clay font-bold block mb-2">Multigenerational Getaway</span>
                          <h4 className="text-2xl font-serif font-bold text-ink-navy mb-2">Orlando Magical Excursion</h4>
                          <p className="text-xs text-charcoal/60 font-mono mb-4">July 10 – July 14, 2026 • 4 Nights</p>
                          <p className="text-xs text-charcoal/80 font-light leading-relaxed">
                            A custom pace split safely between interactive science discovery, shaded gardens, and catamaran cruises.
                          </p>
                        </div>
                        <div className="pt-4 border-t border-charcoal/10 flex justify-between items-center text-xs">
                          <span className="text-charcoal/50">Host: <span className="font-semibold text-charcoal">You</span></span>
                          <button onClick={() => setActiveTab('trips')} className="text-clay font-bold uppercase tracking-wider text-[10px] hover:underline flex items-center gap-1">
                            Excursion List <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </EditorialCard>

                    {/* Budget Overview */}
                    <EditorialCard label="Excursion Pool">
                      <div className="flex flex-col justify-between h-full min-h-[180px]">
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-xs font-bold text-charcoal/70 uppercase tracking-widest">Shared Funds Ledger</h4>
                            <span className="text-[10px] text-charcoal/40 font-mono">Pooled Limit</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mb-4">
                            <span className="text-3xl font-serif font-black text-ink-navy">${totalBudgetSpent}</span>
                            <span className="text-xs text-charcoal/50">spent of ${budgetLimit}</span>
                          </div>
                          
                          <div className="h-1 bg-charcoal/10 w-full mb-2">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                (totalBudgetSpent / budgetLimit) > 0.9 ? 'bg-clay' : 'bg-sage'
                              }`}
                              style={{ width: `${Math.min(100, (totalBudgetSpent / budgetLimit) * 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-charcoal/10 space-y-1.5 text-xs text-charcoal/70 font-light">
                          <div className="flex justify-between">
                            <span>Lodging Segment:</span>
                            <span className="font-bold text-ink-navy">$650.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activities Segment:</span>
                            <span className="font-bold text-ink-navy">
                              ${budgetItems.filter(b => b.category === 'Activities').reduce((s, i) => s + i.amount, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </EditorialCard>
                  </div>

                  {/* Fatigue Budget Details */}
                  <EditorialCard label="Stamina Analysis">
                    <div className="p-2">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex justify-center">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle className="text-charcoal/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="38" cx="50" cy="50" />
                              <circle 
                                className="text-clay transition-all duration-500" 
                                strokeWidth="6" 
                                strokeDasharray={2 * Math.PI * 38}
                                strokeDashoffset={2 * Math.PI * 38 * (1 - groupAverageEnergy / 100)}
                                strokeLinecap="square" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="38" 
                                cx="50" 
                                cy="50" 
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-serif font-black text-ink-navy">{groupAverageEnergy}%</span>
                              <span className="text-[8px] text-sage font-bold uppercase tracking-wider">stamina</span>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-8 space-y-3">
                          <h4 className="text-xl font-serif font-bold text-ink-navy flex items-center gap-2">
                            <BatteryCharging className="text-clay w-5 h-5" />
                            Stamina Guard Index
                          </h4>
                          <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                            Unlike generic plans, we compute stamina consumption curves to protect seniors & toddlers. Active hiking excursions expend stamina quickly. Keep a healthy budget above 40%.
                          </p>
                          <div className="flex flex-wrap gap-3 pt-2">
                            <button 
                              onClick={handleRestGroup}
                              className="bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-wider px-4 py-2 transition-colors cursor-pointer"
                            >
                              Nap Time (Refills Stamina)
                            </button>
                            <button 
                              onClick={() => handleSimulateActivity(3)}
                              className="border border-charcoal/20 hover:border-clay hover:text-clay text-charcoal/80 text-xs font-bold uppercase tracking-wider px-4 py-2 transition-colors cursor-pointer"
                            >
                              Simulate Trek Drains
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </EditorialCard>
                </div>

                {/* Right Side: Travelers & Persona */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Travel Persona */}
                  <EditorialCard label="Group Persona">
                    <div className="text-center py-4">
                      <div className="w-12 h-12 border border-clay/30 bg-clay/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-5 h-5 text-clay" />
                      </div>
                      <h4 className="text-xl font-serif font-black text-ink-navy mb-1">"The Harmony Seekers"</h4>
                      <p className="text-xs text-charcoal/70 mb-5 leading-relaxed font-light max-w-xs mx-auto">
                        Your group spans ages {ageSpread.min} to {ageSpread.max} (a {ageSpread.max - ageSpread.min}-year difference). We prioritize low-fatigue itineraries and shared meal windows to maintain group unity.
                      </p>
                      <span className="inline-block border border-sage/40 bg-sage/5 text-sage text-[9px] font-mono font-bold px-3 py-1 uppercase tracking-widest">
                        Compromise Rating: High (92%)
                      </span>
                    </div>
                  </EditorialCard>

                  {/* Group Roster */}
                  <EditorialCard label="Travelers Roster">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-charcoal/10">
                        <span className="text-[10px] font-bold text-sage uppercase tracking-wider">Active Group</span>
                        <button 
                          onClick={() => setIsAddingTraveler(!isAddingTraveler)} 
                          className="text-[9px] bg-clay hover:bg-ink-navy text-warm-parchment font-bold uppercase tracking-wider px-2.5 py-1"
                        >
                          Add Traveler
                        </button>
                      </div>

                      {/* Add Traveler Form */}
                      {isAddingTraveler && (
                        <motion.form 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="border border-charcoal/10 p-3 space-y-3"
                          onSubmit={handleAddTraveler}
                        >
                          <div>
                            <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1">Name</label>
                            <input 
                              type="text" 
                              value={newTravelerName}
                              onChange={e => setNewTravelerName(e.target.value)}
                              placeholder="e.g. Maya"
                              className="w-full text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/20 focus:outline-none focus:border-clay"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1">Age ({newTravelerAge} yrs)</label>
                            <input 
                              type="range" 
                              min="1" 
                              max="95"
                              value={newTravelerAge}
                              onChange={e => setNewTravelerAge(parseInt(e.target.value))}
                              className="w-full accent-clay cursor-pointer"
                            />
                            <div className="flex justify-between text-[8px] font-mono text-charcoal/50">
                              <span>Child (1)</span>
                              <span>Senior (95)</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              type="submit"
                              className="w-full bg-clay text-warm-parchment text-[9px] font-bold uppercase tracking-wider py-1.5 transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button 
                              type="button"
                              onClick={() => setIsAddingTraveler(false)}
                              className="w-full border border-charcoal/20 text-charcoal text-[9px] font-bold uppercase tracking-wider py-1.5 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.form>
                      )}

                      {/* Traveler List */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {travelers.map(t => (
                          <div key={t.id} className="flex items-center justify-between py-2 border-b border-charcoal/5 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-sage/20 text-ink-navy font-mono font-bold flex items-center justify-center text-xs shrink-0">
                                {t.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-ink-navy">{t.name}</h5>
                                <span className="block text-[9px] text-charcoal/50 uppercase tracking-wide">Age {t.age} • {t.category}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className={`text-[10px] font-mono font-bold block ${t.energy < 40 ? 'text-clay' : 'text-sage'}`}>
                                  {t.energy}%
                                </span>
                                <span className="text-[8px] text-charcoal/40 uppercase tracking-widest block">Stamina</span>
                              </div>

                              <button 
                                onClick={() => handleRestTraveler(t.id)}
                                className="p-1 hover:bg-sage/10 text-sage" 
                                title="Rest traveler"
                              >
                                <BatteryCharging className="w-3.5 h-3.5" />
                              </button>

                              {travelers.length > 1 && (
                                <button 
                                  onClick={() => handleDeleteTraveler(t.id)}
                                  className="p-1 hover:bg-clay/10 text-clay"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </EditorialCard>

                </div>
              </motion.div>
            )}

            {/* 2. TRIPS / NEGOTIATIONS */}
            {activeTab === 'trips' && (
              <motion.div 
                key="trips"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {!selectedDestination ? (
                  // --- DESTINATION LIBRARY SCREEN ---
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-serif font-black text-ink-navy leading-none tracking-tight">Destination Library</h2>
                      <p className="text-xs text-charcoal/60 mt-2 font-mono uppercase tracking-widest">Select a base to calculate intergenerational strain and fatigue limits</p>
                    </div>

                    {/* AI Suggested Destination Banner */}
                    {(() => {
                      const suggestedDest = getAISuggestedDestination(dynamicAgeProfile.travelStyle, dynamicAgeProfile.intensityCeiling);
                      const destIntensityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                      const ceilingOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                      const destLevel = destIntensityOrder[suggestedDest.ageSuitability.intensityLevel] || 2;
                      const ceilingLevel = ceilingOrder[dynamicAgeProfile.intensityCeiling as 'Low'|'Medium'|'High'] || 2;
                      const isSuggestedGoodFit = destLevel <= ceilingLevel;

                      return (
                        <div className="border border-clay/30 bg-clay/5 p-6 md:p-8 relative">
                          <div className="absolute -top-3 left-6 bg-clay text-warm-parchment text-[9px] font-mono font-bold px-3 py-1 uppercase tracking-widest">
                            AI Suggested Trip
                          </div>
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-3 max-w-3xl">
                              <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-serif font-bold text-ink-navy">{suggestedDest.name}, {suggestedDest.country}</h3>
                                <span className="text-[10px] font-mono border border-clay/30 text-clay px-2 py-0.5 uppercase tracking-wider font-bold">
                                  {suggestedDest.category}
                                </span>
                              </div>
                              <p className="text-sm text-charcoal/80 font-serif italic leading-relaxed">
                                "Based on your group's travel style ({dynamicAgeProfile.travelStyle}) and individual stamina limits ({dynamicAgeProfile.intensityCeiling} intensity ceiling), we recommend {suggestedDest.name} as the optimal layout for everyone."
                              </p>
                              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                                {suggestedDest.description}
                              </p>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {suggestedDest.vibeTags.map(tag => (
                                  <span key={tag} className="text-[10px] font-mono bg-charcoal/5 text-charcoal/70 px-2.5 py-0.5">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono pt-2 text-charcoal/60">
                                <div>Avg Daily Budget: <span className="text-ink-navy font-bold">{dynamicAgeProfile.currencySymbol}{Math.round(suggestedDest.avgDailyBudgetUSD * (dynamicAgeProfile.currencySymbol === '₹' ? 83 : 1))}</span></div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full ${isSuggestedGoodFit ? 'bg-sage' : 'bg-clay'}`} />
                                  <span>Age-Fit: {isSuggestedGoodFit ? 'Optimal' : 'Check physical strain'}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleSelectAndPlanDestination(suggestedDest)}
                              className="self-start lg:self-center border border-clay text-clay hover:bg-clay hover:text-warm-parchment text-xs font-bold uppercase tracking-widest px-6 py-3 transition-all duration-300 cursor-pointer shrink-0"
                            >
                              Generate My Trip Plan
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-charcoal/10 mb-6">
                      <div>
                        <h3 className="text-lg font-serif font-black text-ink-navy">All Destinations</h3>
                        <p className="text-xs text-charcoal/50 font-light">Explore 20 curated destinations mapped to intergenerational safety parameters</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal/40" />
                          <input 
                            type="text" 
                            placeholder="Search destinations..."
                            value={destSearchQuery}
                            onChange={(e) => setDestSearchQuery(e.target.value)}
                            className="w-full bg-warm-parchment/50 border border-charcoal/20 pl-9 pr-4 py-2 text-xs outline-none focus:border-clay/60 font-mono transition-all placeholder:text-charcoal/30"
                          />
                        </div>
                        {/* Category Filter Buttons */}
                        <div className="flex border border-charcoal/20">
                          {(['All', 'Beach', 'Mountain', 'City', 'Cultural'] as const).map(cat => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategoryFilter(cat)}
                              className={`px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                selectedCategoryFilter === cat 
                                  ? 'bg-ink-navy text-warm-parchment' 
                                  : 'text-charcoal/60 bg-warm-parchment/20 hover:text-ink-navy'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Destination Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {DESTINATIONS.filter(dest => {
                        const matchesSearch = dest.name.toLowerCase().includes(destSearchQuery.toLowerCase()) || 
                                              dest.country.toLowerCase().includes(destSearchQuery.toLowerCase()) || 
                                              dest.description.toLowerCase().includes(destSearchQuery.toLowerCase());
                        const matchesCategory = selectedCategoryFilter === 'All' || dest.category === selectedCategoryFilter;
                        return matchesSearch && matchesCategory;
                      }).map(dest => {
                        const destIntensityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                        const ceilingOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
                        const destLevel = destIntensityOrder[dest.ageSuitability.intensityLevel] || 2;
                        const ceilingLevel = ceilingOrder[dynamicAgeProfile.intensityCeiling as 'Low'|'Medium'|'High'] || 2;
                        const isGoodFit = destLevel <= ceilingLevel;

                        return (
                          <div key={dest.id} className="border border-charcoal/10 bg-warm-parchment/40 p-5 flex flex-col justify-between hover:border-clay/30 transition-all duration-300">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-lg font-serif font-bold text-ink-navy">{dest.name}</h4>
                                  <p className="text-[10px] font-mono text-charcoal/50 uppercase tracking-widest">{dest.country}</p>
                                </div>
                                <span className="text-[9px] font-mono border border-charcoal/20 px-2 py-0.5 text-charcoal/60 uppercase">
                                  {dest.category}
                                </span>
                              </div>

                              <p className="text-xs text-charcoal/70 leading-relaxed font-light line-clamp-3">
                                {dest.description}
                              </p>

                              <div className="space-y-1.5 pt-1">
                                <span className="block text-[9px] font-mono uppercase tracking-wider text-charcoal/40">Top Attractions:</span>
                                <ul className="text-[11px] text-charcoal/80 font-light list-disc list-inside space-y-0.5">
                                  {dest.topAttractions.slice(0, 3).map((attr, idx) => (
                                    <li key={idx} className="truncate">{attr}</li>
                                  ))}
                                  {dest.topAttractions.length > 3 && <li className="italic text-charcoal/50">+{dest.topAttractions.length - 3} more</li>}
                                </ul>
                              </div>

                              <div className="pt-2 border-t border-charcoal/5 flex justify-between items-center text-[10px] font-mono text-charcoal/60">
                                <div>Daily Budget: <span className="text-ink-navy font-bold">{dynamicAgeProfile.currencySymbol}{Math.round(dest.avgDailyBudgetUSD * (dynamicAgeProfile.currencySymbol === '₹' ? 83 : 1))}</span></div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${isGoodFit ? 'bg-sage' : 'bg-clay'}`} />
                                  <span>{isGoodFit ? 'Good Fit' : 'Heavy strain'}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleSelectAndPlanDestination(dest)}
                              className="mt-4 w-full border border-clay text-clay hover:bg-clay hover:text-warm-parchment text-[10px] font-bold uppercase tracking-wider py-2 transition-all cursor-pointer"
                            >
                              Plan Trip Here
                            </button>
                          </div>
                        );
                      })}

                      {DESTINATIONS.filter(dest => {
                        const matchesSearch = dest.name.toLowerCase().includes(destSearchQuery.toLowerCase()) || 
                                              dest.country.toLowerCase().includes(destSearchQuery.toLowerCase()) || 
                                              dest.description.toLowerCase().includes(destSearchQuery.toLowerCase());
                        const matchesCategory = selectedCategoryFilter === 'All' || dest.category === selectedCategoryFilter;
                        return matchesSearch && matchesCategory;
                      }).length === 0 && (
                        <div className="col-span-full border border-charcoal/10 border-dashed p-12 text-center">
                          <p className="text-sm text-charcoal/50 font-serif">No destinations match your filters. Try search keywords or different category filters.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // --- ACTIVE TRIP PLANNER & ITINERARY SCREEN ---
                  <div className="space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal/10">
                      <div className="space-y-1">
                        <button 
                          onClick={handleClearTripPlan}
                          className="flex items-center gap-1 text-[10px] font-mono text-clay hover:text-clay/80 uppercase tracking-wider font-bold mb-2 cursor-pointer"
                        >
                          ← Browse Destinations
                        </button>
                        <h2 className="text-3xl font-serif font-black text-ink-navy">{selectedDestination.name} Itinerary</h2>
                        <p className="text-xs text-charcoal/50 font-mono uppercase tracking-widest">{selectedDestination.country} • Calculated for {dynamicAgeProfile.groupType} ({dynamicAgeProfile.minAge}-{dynamicAgeProfile.maxAge} yrs)</p>
                      </div>
                      <div className="flex gap-4 items-center font-mono text-xs">
                        <div className="text-right">
                          <span className="block text-[9px] text-charcoal/40 uppercase tracking-wider">Estimated Budget</span>
                          <span className="text-base font-serif font-bold text-ink-navy">{dynamicAgeProfile.currencySymbol}{Math.round(selectedDestination.avgDailyBudgetUSD * 3 * (dynamicAgeProfile.currencySymbol === '₹' ? 83 : 1))} / pp</span>
                        </div>
                        <div className="text-right border-l border-charcoal/10 pl-4">
                          <span className="block text-[9px] text-charcoal/40 uppercase tracking-wider">Base Intensity</span>
                          <span className="text-sm font-bold text-sage">{selectedDestination.ageSuitability.intensityLevel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Negotiation Mode Section (Only for Families & Multigenerational groups) */}
                    {['Family', 'Multigen'].includes(dynamicAgeProfile.groupType) && (() => {
                      const { optionA, optionB } = getCompromiseOptions(selectedDestination);
                      return (
                        <div className="border border-charcoal/20 p-6 bg-warm-parchment relative">
                          <div className="absolute -top-3 left-6 bg-sage text-warm-parchment text-[9px] font-mono font-bold px-3 py-1 uppercase tracking-widest">
                            Finding the middle ground
                          </div>
                          <h3 className="text-lg font-serif font-bold text-ink-navy mb-1">Intergenerational Compromise Engine</h3>
                          <p className="text-xs text-charcoal/60 leading-relaxed mb-4">
                            Because your group spans ages {dynamicAgeProfile.minAge} to {dynamicAgeProfile.maxAge}, we suggest active compromises to resolve fatigue issues before they impact physical comfort limits.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Option A */}
                            <div className="p-4 border border-charcoal/10 bg-warm-parchment/20 space-y-3 flex flex-col justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-clay uppercase tracking-wider font-bold">Option A: Split Morning Excursions</span>
                                <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                                  {optionA}
                                </p>
                              </div>
                              <button
                                onClick={() => handleApplyNegotiation('A')}
                                className={`w-full py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                  appliedNegotiationOption === 'A'
                                    ? 'bg-clay text-warm-parchment border-clay'
                                    : 'border-clay text-clay hover:bg-clay/5'
                                }`}
                              >
                                {appliedNegotiationOption === 'A' ? '✓ Compromise Active' : 'Use this plan'}
                              </button>
                            </div>

                            {/* Option B */}
                            <div className="p-4 border border-charcoal/10 bg-warm-parchment/20 space-y-3 flex flex-col justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-clay uppercase tracking-wider font-bold">Option B: Unified Slower Pace</span>
                                <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                                  {optionB}
                                </p>
                              </div>
                              <button
                                onClick={() => handleApplyNegotiation('B')}
                                className={`w-full py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                  appliedNegotiationOption === 'B'
                                    ? 'bg-clay text-warm-parchment border-clay'
                                    : 'border-clay text-clay hover:bg-clay/5'
                                }`}
                              >
                                {appliedNegotiationOption === 'B' ? '✓ Compromise Active' : 'Use this plan'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Itinerary & Fatigue Bar Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {currentTripPlan?.map(dayPlan => {
                        const isPast80Percent = dayPlan.runningFatigue >= 0.8 * dayPlan.fatigueCeiling;
                        const progressPercent = Math.min(100, (dayPlan.runningFatigue / dayPlan.fatigueCeiling) * 100);

                        return (
                          <div key={dayPlan.day} className="border border-charcoal/10 bg-warm-parchment p-5 flex flex-col justify-between space-y-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-charcoal/10">
                                <h3 className="text-xl font-serif font-black text-ink-navy">Day {dayPlan.day}</h3>
                                <span className="text-[10px] font-mono text-charcoal/50 uppercase">Plan Schedule</span>
                              </div>

                              {/* Fatigue Progress Bar */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-charcoal/60 uppercase">Day Fatigue Budget</span>
                                  <span className={`font-bold ${isPast80Percent ? 'text-clay' : 'text-sage'}`}>
                                    {dayPlan.runningFatigue} / {dayPlan.fatigueCeiling} Units
                                  </span>
                                </div>
                                <div className="w-full bg-charcoal/10 h-2 rounded-none overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-500 ${isPast80Percent ? 'bg-clay' : 'bg-sage'}`}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                                {isPast80Percent && (
                                  <p className="text-[9px] text-clay font-mono uppercase tracking-wider leading-none">
                                    Stamina Limit Approaching
                                  </p>
                                )}
                              </div>

                              {/* Swapped Notice */}
                              {dayPlan.swappedNote && (
                                <div className="border border-clay/20 bg-clay/5 p-2.5 text-[10px] text-clay leading-relaxed font-mono">
                                  {dayPlan.swappedNote}
                                </div>
                              )}

                              {/* Slots List */}
                              <div className="space-y-4 pt-2">
                                {dayPlan.activities.map(act => {
                                  let costColor = 'text-sage';
                                  if (act.energyCost >= 4) costColor = 'text-clay font-bold';
                                  else if (act.energyCost >= 3) costColor = 'text-charcoal font-bold';

                                  return (
                                    <div key={act.id} className="p-3 border border-charcoal/10 bg-warm-parchment/20 space-y-1">
                                      <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-charcoal/40">
                                        <span>{act.slot} Slot</span>
                                        <span className={costColor}>Energy Cost: {act.energyCost}/5</span>
                                      </div>
                                      <h4 className="text-xs font-serif font-black text-ink-navy">{act.title}</h4>
                                      <p className="text-[11px] text-charcoal/70 leading-relaxed font-light mt-1">
                                        {act.description}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. EXPLORE */}
            {activeTab === 'explore' && (
              <motion.div 
                key="explore"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Search bar */}
                  <div className="border border-charcoal/10 bg-warm-parchment p-4 flex items-center gap-3">
                    <Search className="w-5 h-5 text-charcoal/40" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Filter by interest keywords (e.g. Science, Botanical, Cruise, Adventure)..."
                      className="w-full text-xs bg-transparent focus:outline-none text-charcoal placeholder-charcoal/30 font-mono"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-xs text-clay font-bold font-mono">
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Day scheduler list */}
                  <EditorialCard label="Excursion Planner catalog">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-charcoal/10">
                        <div>
                          <h4 className="text-lg font-serif font-bold text-ink-navy">Select & Commit Activities</h4>
                          <p className="text-xs text-charcoal/60 leading-relaxed font-light">Click to simulate allocating these activities to today's stamina balance.</p>
                        </div>
                        <button 
                          onClick={handleRestGroup}
                          className="bg-sage/15 text-sage hover:bg-sage/20 border border-sage/20 text-xs font-bold uppercase tracking-wider px-3 py-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          Sleep Interval (Reset Stamina)
                        </button>
                      </div>

                      {filteredActivities.length === 0 ? (
                        <div className="text-center py-8 text-charcoal/40 text-sm font-light italic">
                          No slots match your search. Try searching for 'botanical' or 'cruise'.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredActivities.map(act => (
                            <div key={act.id} className="border border-charcoal/10 p-4 bg-warm-parchment/40 flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-base font-serif font-bold text-ink-navy">{act.title}</h5>
                                  <span className="text-[9px] font-mono border border-sage/40 text-sage px-1.5 py-0.5">
                                    ${act.cost}/pp
                                  </span>
                                </div>
                                <p className="text-xs text-charcoal/70 font-light leading-relaxed">{act.description}</p>
                                <div className="flex items-center gap-3 text-[10px] font-mono text-charcoal/50 pt-1">
                                  <span className="flex items-center gap-1">
                                    <ActivityIcon className="w-3.5 h-3.5 text-clay" /> 
                                    Stamina Cost: {act.fatigueCost}/5
                                  </span>
                                  <span>•</span>
                                  <span>Compatible Ages: {act.minAge}-{act.maxAge} yrs</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleSimulateActivity(act.fatigueCost)}
                                className="bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors cursor-pointer shrink-0"
                              >
                                Commit Excursion
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </EditorialCard>

                  {/* Micro suggestions around hotel */}
                  <EditorialCard label="Stroller & Rest-Stop Overlay">
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-sage uppercase tracking-wider pb-1 border-b border-charcoal/10">Nearby Micro-Excursions (Under 2 miles)</h4>
                      <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                        Verified stroller-accessible coffee houses & air-conditioned seating zones.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-charcoal/10 p-3 flex gap-3">
                          <span className="font-serif italic font-bold text-clay">1.</span>
                          <div>
                            <h5 className="text-xs font-bold text-ink-navy">Shaded Conservatory Cafe</h5>
                            <p className="text-[10px] text-charcoal/60 font-light leading-snug mt-0.5">Paved ramp, zero staircase entry, soft couches, noise controlled environment.</p>
                          </div>
                        </div>

                        <div className="border border-charcoal/10 p-3 flex gap-3">
                          <span className="font-serif italic font-bold text-clay">2.</span>
                          <div>
                            <h5 className="text-xs font-bold text-ink-navy">Central Library Garden Terrace</h5>
                            <p className="text-[10px] text-charcoal/60 font-light leading-snug mt-0.5">High shade canopy, wide clean pathways, accessible restrooms every 100 yards.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </EditorialCard>

                </div>

                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Ledger Progress ring representation */}
                  <EditorialCard label="Funds Reserve">
                    <div className="text-center py-4">
                      <div className="relative w-28 h-28 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle className="text-charcoal/10" strokeWidth="6" stroke="currentColor" fill="transparent" r="38" cx="50" cy="50" />
                          <circle 
                            className="text-clay transition-all duration-500" 
                            strokeWidth="6" 
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={2 * Math.PI * 38 * (1 - totalBudgetSpent / budgetLimit)}
                            strokeLinecap="square" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="38" 
                            cx="50" 
                            cy="50" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-serif font-black text-ink-navy">${totalBudgetSpent}</span>
                          <span className="text-[8px] text-sage font-bold uppercase tracking-wider">committed</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-ink-navy">Shared Pool Spent</h4>
                      <p className="text-[10px] text-charcoal/50 leading-relaxed font-light mt-1">
                        Utilized {Math.round((totalBudgetSpent / budgetLimit) * 100)}% of pooled assets.
                      </p>
                    </div>
                  </EditorialCard>

                  {/* Stamina bars */}
                  <EditorialCard label="Stamina LEDGER">
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono font-bold text-sage uppercase tracking-wider pb-1 border-b border-charcoal/10">Stamina Meter by Guest</h4>
                      
                      <div className="space-y-3.5">
                        {travelers.map(t => (
                          <div key={t.id} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-wide">
                              <span className="font-bold text-ink-navy">{t.name} (Age {t.age})</span>
                              <span className={t.energy < 40 ? 'text-clay font-bold' : 'text-sage font-bold'}>{t.energy}%</span>
                            </div>
                            <div className="h-1 w-full bg-charcoal/10">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  t.energy < 40 ? 'bg-clay' : 'bg-sage'
                                }`}
                                style={{ width: `${t.energy}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </EditorialCard>

                  {/* Age alerts */}
                  <EditorialCard label="Conflict Warnings">
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold text-clay uppercase tracking-wider pb-1 border-b border-charcoal/10 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-clay" />
                        Age compatibility alerts
                      </h4>

                      <div className="border border-clay/20 bg-clay/5 p-3.5 space-y-3 text-xs leading-relaxed font-light text-charcoal/90">
                        {travelers.some(t => t.age <= 8) && (
                          <div className="space-y-0.5">
                            <span className="font-bold font-mono text-[9px] uppercase tracking-wider text-clay block">Junior Alert (Ages Under 8)</span>
                            <p>Rollercoasters have a 54-inch height threshold. Ensure child Maya stays in the shaded pavilion during those blocks.</p>
                          </div>
                        )}
                        
                        {travelers.some(t => t.category === 'senior') && (
                          <div className="space-y-0.5 border-t border-clay/10 pt-2.5">
                            <span className="font-bold font-mono text-[9px] uppercase tracking-wider text-clay block">Senior Alert (Ages Over 65)</span>
                            <p>Adventure Park blocks demand heavy standing intervals. Wheelchair ramps are missing in active forest trail zones.</p>
                          </div>
                        )}

                        {travelers.length === 0 && (
                          <p className="text-charcoal/40 italic text-center">Add group members to generate compatibility warning indexes.</p>
                        )}
                      </div>
                    </div>
                  </EditorialCard>

                </div>
              </motion.div>
            )}

            {/* 4. AI CONCIERGE */}
            {activeTab === 'concierge' && (
              <motion.div 
                key="concierge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <EditorialCard label="Family Travel Concierge">
                  <div className="border border-charcoal/10 bg-warm-parchment/30 overflow-hidden flex flex-col h-[520px]">
                    
                    {/* Header bar */}
                    <div className="bg-ink-navy text-warm-parchment px-5 py-4 flex items-center justify-between border-b border-charcoal/10">
                      <div>
                        <span className="font-serif font-bold text-sm block text-warm-parchment">Globi Multi-Generational Companion</span>
                        <span className="text-[9px] text-sage font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                          Group safety bounds actively integrated
                        </span>
                      </div>
                      <span className="text-[8px] border border-warm-parchment/20 text-warm-parchment/60 font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                        Compromise Mode
                      </span>
                    </div>

                    {/* Messages log */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex gap-3 max-w-lg ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-serif font-black text-xs shrink-0 ${
                            msg.sender === 'user' ? 'border-clay text-clay bg-clay/5' : 'border-charcoal/20 bg-warm-parchment/50 text-ink-navy'
                          }`}>
                            {msg.sender === 'user' ? 'U' : 'K'}
                          </div>
                          <div className={`p-4 leading-relaxed relative ${
                            msg.sender === 'user' 
                              ? 'bg-clay text-warm-parchment rounded-none' 
                              : 'border border-charcoal/10 bg-warm-parchment text-charcoal rounded-none'
                          }`}>
                            <p className="font-light">{msg.text}</p>
                            <span className="block text-[8px] font-mono text-charcoal/40 mt-2 text-right">
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat input form */}
                    <form onSubmit={handleSendMessage} className="bg-warm-parchment/50 p-4 border-t border-charcoal/10 flex gap-3">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Ask about age compatibility, rest-stops, or compromise score..."
                        className="flex-1 border border-charcoal/20 rounded-none px-4 py-3 text-xs bg-warm-parchment text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-clay font-mono"
                      />
                      <button 
                        type="submit"
                        className="bg-clay hover:bg-ink-navy text-warm-parchment px-5 py-3 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </EditorialCard>
              </motion.div>
            )}

            {/* 5. LEDGER (Profile settings & ledger list) */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <EditorialCard label="Excursion Coordinator Profile">
                  <div className="space-y-6">
                    
                    {/* Coordinator Profile Block */}
                    <div className="border border-charcoal/10 bg-ink-navy text-warm-parchment p-6">
                      <h4 className="text-2xl font-serif font-black text-warm-parchment truncate">{userEmail}</h4>
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        <span className="border border-sage/40 text-sage text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                          Primary Organizer
                        </span>
                        <span className="border border-clay/40 text-clay text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                          Group size: {travelers.length} guests
                        </span>
                      </div>
                    </div>

                    {/* Group Composition Badge */}
                    <div className="border border-clay/35 bg-clay/5 p-5 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-clay/10">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-clay font-bold block">
                          Group Composition Badge
                        </span>
                        <span className="text-[9px] font-mono border border-clay/40 text-clay px-2 py-0.5 uppercase tracking-widest font-bold">
                          {dynamicAgeProfile.groupType} Group
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed font-light text-charcoal/90">
                        Traveling as: <strong className="font-bold">{dynamicAgeProfile.groupType} group</strong>, ages {dynamicAgeProfile.minAge}–{dynamicAgeProfile.maxAge}. Intensity ceiling: <strong className="font-bold">{dynamicAgeProfile.intensityCeiling}</strong>.
                      </p>

                      {/* Plotted Age-Spectrum */}
                      <div className="relative py-7 px-2 bg-warm-parchment border border-charcoal/10">
                        <div className="h-[1px] bg-charcoal/20 w-full relative">
                          {travelers.map((t, idx) => {
                            const percentage = Math.min(100, Math.max(0, (t.age / 90) * 100));
                            const isEven = idx % 2 === 0;
                            return (
                              <div 
                                key={t.id} 
                                className="absolute flex flex-col items-center"
                                style={{ 
                                  left: `${percentage}%`,
                                  transform: 'translateX(-50%)',
                                  top: '-4px' 
                                }}
                              >
                                <div className="w-2 h-2 rounded-full bg-clay" />
                                <span className={`absolute whitespace-nowrap text-[8px] font-mono text-charcoal/60 ${
                                  isEven ? 'bottom-3' : 'top-3'
                                }`}>
                                  {t.name} ({t.age})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        <span className="border border-sage/40 text-sage text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                          Style: {dynamicAgeProfile.travelStyle}
                        </span>
                        <span className="border border-clay/40 text-clay text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                          Budget: {dynamicAgeProfile.budgetTier}
                        </span>
                        <span className="border border-charcoal/30 text-charcoal/50 text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest">
                          Ceiling: {dynamicAgeProfile.intensityCeiling}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown counts */}
                    <div className="space-y-2 text-xs">
                      <h5 className="font-bold text-ink-navy uppercase tracking-wider text-[10px]">Demographic breakdown</h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                        <div className="border border-charcoal/10 p-3 bg-warm-parchment/40">
                          <span className="block text-[8px] text-sage font-bold uppercase">Children</span>
                          <span className="text-xl font-bold text-ink-navy">{groupCategoryCount.kid}</span>
                        </div>
                        <div className="border border-charcoal/10 p-3 bg-warm-parchment/40">
                          <span className="block text-[8px] text-sage font-bold uppercase">Teens</span>
                          <span className="text-xl font-bold text-ink-navy">{groupCategoryCount.teen}</span>
                        </div>
                        <div className="border border-charcoal/10 p-3 bg-warm-parchment/40">
                          <span className="block text-[8px] text-sage font-bold uppercase">Adults</span>
                          <span className="text-xl font-bold text-ink-navy">{groupCategoryCount.adult}</span>
                        </div>
                        <div className="border border-charcoal/10 p-3 bg-warm-parchment/40">
                          <span className="block text-[8px] text-sage font-bold uppercase">Seniors</span>
                          <span className="text-xl font-bold text-ink-navy">{groupCategoryCount.senior}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live budget ledger additions */}
                    <div className="border border-charcoal/10 p-4 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-charcoal/10">
                        <h4 className="text-xs font-bold text-sage uppercase tracking-wider">Live Budget Ledger</h4>
                        <span className="text-xs font-bold text-clay font-mono">${totalBudgetSpent} COMMITTED</span>
                      </div>

                      {/* Add ledger form */}
                      <form onSubmit={handleAddBudgetItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input 
                          type="text"
                          value={newBudgetItemTitle}
                          onChange={e => setNewBudgetItemTitle(e.target.value)}
                          placeholder="Item (e.g. Snack box)"
                          className="sm:col-span-5 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/20 focus:outline-none text-charcoal font-mono"
                          required
                        />
                        <input 
                          type="number"
                          value={newBudgetItemAmount}
                          onChange={e => setNewBudgetItemAmount(e.target.value)}
                          placeholder="Cost ($)"
                          className="sm:col-span-3 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/20 focus:outline-none text-charcoal font-mono"
                          required
                        />
                        <select
                          value={newBudgetItemCategory}
                          onChange={e => setNewBudgetItemCategory(e.target.value as any)}
                          className="sm:col-span-3 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/20 focus:outline-none text-charcoal font-mono"
                        >
                          <option value="Activities">Activities</option>
                          <option value="Food">Food</option>
                          <option value="Lodging">Lodging</option>
                          <option value="Transport">Transport</option>
                          <option value="Other">Other</option>
                        </select>
                        <button 
                          type="submit"
                          className="sm:col-span-1 bg-clay text-warm-parchment hover:bg-ink-navy flex items-center justify-center py-2 cursor-pointer transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>

                      {/* Budget list */}
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {budgetItems.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-xs py-2 border-b border-charcoal/5 last:border-0">
                            <div>
                              <span className="font-bold text-ink-navy block">{item.title}</span>
                              <span className="text-[10px] text-charcoal/40 font-mono capitalize">{item.category} • {item.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold font-mono text-ink-navy">${item.amount}</span>
                              <button 
                                onClick={() => handleDeleteBudgetItem(item.id)}
                                className="text-clay hover:bg-clay/5 p-1 transition-all"
                                title="Remove ledger log"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exit Buttons */}
                    <div className="pt-4 border-t border-charcoal/10 flex justify-end">
                      <button 
                        id="profile-logout-btn"
                        onClick={onLogOut}
                        className="bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors cursor-pointer"
                      >
                        Exit Planner
                      </button>
                    </div>
                  </div>
                </EditorialCard>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink-navy text-warm-parchment/60 border-t border-warm-parchment/10 py-2 px-4 flex items-center justify-between shadow-2xl bg-ink-navy/95 backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-bold uppercase tracking-wider ${activeTab === 'dashboard' ? 'text-clay' : 'hover:text-warm-parchment'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dash</span>
        </button>

        <button 
          onClick={() => setActiveTab('trips')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-bold uppercase tracking-wider ${activeTab === 'trips' ? 'text-clay' : 'hover:text-warm-parchment'}`}
        >
          <Map className="w-4 h-4" />
          <span>Planner</span>
        </button>

        <button 
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-bold uppercase tracking-wider ${activeTab === 'explore' ? 'text-clay' : 'hover:text-warm-parchment'}`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>

        <button 
          onClick={() => setActiveTab('concierge')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-bold uppercase tracking-wider ${activeTab === 'concierge' ? 'text-clay' : 'hover:text-warm-parchment'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Concierge</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[9px] font-bold uppercase tracking-wider ${activeTab === 'profile' ? 'text-clay' : 'hover:text-warm-parchment'}`}
        >
          <User className="w-4 h-4" />
          <span>Ledger</span>
        </button>
      </nav>

    </div>
  );
}
