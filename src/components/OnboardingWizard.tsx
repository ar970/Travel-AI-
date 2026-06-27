import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface OnboardingWizardProps {
  currentUser: { name: string; email: string; isGuest?: boolean };
  onComplete: (profile: any) => void;
}

const CITY_SUGGESTIONS = [
  'Mumbai', 'Delhi', 'Bengaluru', 'New York', 'London', 'Paris', 
  'Tokyo', 'Singapore', 'Sydney', 'San Francisco', 'Rome', 'Dubai'
];

const TRAVEL_STYLES = [
  { id: 'Adventure', label: 'Adventure', desc: 'Active treks, wildlife exploration, and physical excursions.' },
  { id: 'Relaxation', label: 'Relaxation', desc: 'Slow pacing, sitting zones, and low-stamina scenic tours.' },
  { id: 'Cultural', label: 'Cultural', desc: 'Historical landmarks, museums, and local art galleries.' },
  { id: 'Foodie', label: 'Foodie', desc: 'Culinary tours, local markets, and fine dining stops.' },
  { id: 'Backpacker', label: 'Backpacker', desc: 'Budget excursions, local transits, and high-flexibility days.' },
  { id: 'Luxury', label: 'Luxury', desc: 'Private guided routes, top-tier comfort, and full accessibility.' }
];

const BUDGET_TIERS = [
  { id: 'Budget', label: 'Budget', desc: 'Understated options, savings-first' },
  { id: 'Mid-range', label: 'Mid-range', desc: 'Perfect balance of cost and comfort' },
  { id: 'Luxury', label: 'Luxury', desc: 'Uncompromised comfort and convenience' }
];

export default function OnboardingWizard({ currentUser, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Profile basics
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [homeCity, setHomeCity] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('USD');

  // Travelers
  const [travelers, setTravelers] = useState<Array<{ id: string; name: string; age: number }>>([
    { id: 'self', name: 'Self', age: 30 }
  ]);
  const [newTravelerName, setNewTravelerName] = useState('');
  const [newTravelerAge, setNewTravelerAge] = useState<number | ''>('');

  // Travel style & budget
  const [selectedStyle, setSelectedStyle] = useState('Cultural');
  const [selectedBudget, setSelectedBudget] = useState('Mid-range');

  // Computed / derived profile result
  const [derivedProfile, setDerivedProfile] = useState<any>(null);

  // Suggestions Filter
  const filteredCities = CITY_SUGGESTIONS.filter(city => 
    city.toLowerCase().startsWith(homeCity.toLowerCase()) && 
    homeCity.trim() !== '' && 
    city.toLowerCase() !== homeCity.toLowerCase()
  );

  // Traveler Handlers
  const handleAddTraveler = () => {
    if (!newTravelerName.trim() || newTravelerAge === '') return;
    const newId = Math.random().toString(36).substr(2, 9);
    setTravelers([
      ...travelers, 
      { id: newId, name: newTravelerName.trim(), age: Number(newTravelerAge) }
    ]);
    setNewTravelerName('');
    setNewTravelerAge('');
  };

  const handleRemoveTraveler = (id: string) => {
    if (travelers.length === 1) return; // Must have at least "Self"
    setTravelers(travelers.filter(t => t.id !== id));
  };

  const handleUpdateTravelerAge = (id: string, newAge: number) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, age: Math.max(1, Math.min(110, newAge)) } : t));
  };

  const handleUpdateTravelerName = (id: string, newName: string) => {
    setTravelers(travelers.map(t => t.id === id ? { ...t, name: newName } : t));
  };

  // Spend Hints per tier & currency
  const getSpendHint = (tier: string, curr: string) => {
    const hints: Record<string, Record<string, string>> = {
      INR: { Budget: '₹1,500/day', 'Mid-range': '₹5,000/day', Luxury: '₹15,000+/day' },
      USD: { Budget: '$50/day', 'Mid-range': '$150/day', Luxury: '$500+/day' },
      EUR: { Budget: '€45/day', 'Mid-range': '€135/day', Luxury: '€450+/day' },
      GBP: { Budget: '£40/day', 'Mid-range': '£120/day', Luxury: '£400+/day' }
    };
    return hints[curr]?.[tier] || '';
  };

  const getNumericBudget = (tier: string, curr: string) => {
    const values: Record<string, Record<string, number>> = {
      INR: { Budget: 1500, 'Mid-range': 5000, Luxury: 15000 },
      USD: { Budget: 50, 'Mid-range': 150, Luxury: 500 },
      EUR: { Budget: 45, 'Mid-range': 135, Luxury: 450 },
      GBP: { Budget: 40, 'Mid-range': 120, Luxury: 400 }
    };
    return values[curr]?.[tier] || 150;
  };

  // Handle Complete Wizard Calculation
  const handleWizardSubmit = () => {
    // 1. Determine group demographics
    const ages = travelers.map(t => t.age);
    const hasChildren = travelers.some(t => t.age < 13);
    const hasTeens = travelers.some(t => t.age >= 13 && t.age <= 17);
    const hasSeniors = travelers.some(t => t.age > 60);
    const isAll18to40 = travelers.length > 0 && travelers.every(t => t.age >= 18 && t.age <= 40);

    // Derived intensity ceiling
    let derivedIntensityCeiling: 'Low' | 'Medium' | 'High' = 'Medium';
    if (hasSeniors || hasChildren) {
      derivedIntensityCeiling = 'Low';
    } else if (isAll18to40) {
      derivedIntensityCeiling = 'High';
    }

    // Group Type logic
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

    // Combine travel persona
    const travelPersona = selectedStyle + " " + selectedBudget;
    const dailyBudget = getNumericBudget(selectedBudget, currency);

    // Standard budget split percentages
    const budgetSplit = {
      stay: 40,
      food: 25,
      transport: 15,
      activities: 15,
      shopping: 5
    };

    // Age profile object
    const ageProfile = {
      travelers: travelers.map(t => {
        let cat: 'kid' | 'teen' | 'adult' | 'senior' = 'adult';
        if (t.age < 13) cat = 'kid';
        else if (t.age <= 19) cat = 'teen';
        else if (t.age > 60) cat = 'senior';

        let maxEnergy = 90;
        if (cat === 'kid') maxEnergy = 80;
        else if (cat === 'teen') maxEnergy = 100;
        else if (cat === 'senior') maxEnergy = 65;

        return {
          id: t.id,
          name: t.name,
          age: t.age,
          category: cat,
          energy: maxEnergy,
          maxEnergy,
          avatar: t.name.charAt(0).toUpperCase()
        };
      }),
      hasChildren,
      hasTeens,
      hasSeniors,
      groupType,
      intensityCeiling: derivedIntensityCeiling
    };

    const finalProfile = {
      name: fullName,
      homeCity: homeCity || 'New York',
      currency,
      travelStyle: selectedStyle,
      tripDuration: '1 week',
      budgetTier: selectedBudget,
      foodPrefs: 'No Preference',
      interests: [],
      mobility: 'Moderate',
      travelPersona,
      dailyBudget,
      budgetSplit,
      ageProfile
    };

    setDerivedProfile(finalProfile);
    setStep(3); // Move to summary screen
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('userProfile', JSON.stringify(derivedProfile));
    onComplete(derivedProfile);
  };

  return (
    <div className="min-h-screen bg-warm-parchment text-charcoal font-sans flex flex-col items-center justify-center p-6 md:p-12 selection:bg-clay/20 selection:text-ink-navy">
      <div className="w-full max-w-4xl bg-warm-parchment border border-charcoal/15 p-8 md:p-12 relative shadow-sm">
        
        {/* Understated Editorial Borders */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-clay"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-clay"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-clay"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-clay"></div>

        {/* Header containing name and steps progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-xl font-serif font-black text-ink-navy tracking-tight">
              Kinfolk Setup
            </span>
            <span className="text-[10px] font-mono text-sage font-bold uppercase tracking-widest">
              {step === 3 ? 'Complete' : 'Step ' + step + ' of 2'}
            </span>
          </div>

          {/* Thin line progress indicator filling left-to-right */}
          <div className="h-[2px] bg-charcoal/10 w-full relative overflow-hidden">
            <motion.div 
              className="h-full bg-clay"
              initial={{ width: '0%' }}
              animate={{ width: (step === 3 ? 100 : (step / 2) * 100) + '%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <div className="min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WHO'S TRAVELING + PROFILE BASICS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif font-black text-ink-navy mb-1">Who's on this journey?</h3>
                  <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                    Add all travelers on the itinerary. Kinfolk computes lifespan stamina parameters dynamically to guard against fatigue.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Side: Adding Form, Roster list, and small profile inputs */}
                  <div className="md:col-span-7 space-y-4">
                    <span className="block text-[9px] font-bold text-sage uppercase tracking-wider">
                      Travelers Roster
                    </span>

                    {/* Traveler rows */}
                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                      {travelers.map((t) => (
                        <div key={t.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleUpdateTravelerName(t.id, e.target.value)}
                            placeholder="Label (e.g. Self, Mom)"
                            className="flex-1 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/20 focus:outline-none focus:border-clay font-mono"
                          />
                          <input
                            type="number"
                            value={t.age}
                            onChange={(e) => handleUpdateTravelerAge(t.id, Number(e.target.value))}
                            placeholder="Age"
                            className="w-16 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/20 focus:outline-none focus:border-clay font-mono"
                            min="1"
                            max="110"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTraveler(t.id)}
                            disabled={travelers.length === 1}
                            className={
                              "p-2 border transition-all " + (travelers.length === 1
                                ? 'border-charcoal/10 text-charcoal/20 cursor-not-allowed'
                                : 'border-clay/20 text-clay hover:border-clay hover:bg-clay/5')
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick Row Builder */}
                    <div className="border border-charcoal/10 p-3.5 bg-warm-parchment/30 space-y-2">
                      <span className="block text-[8px] font-mono font-bold text-sage uppercase tracking-wider">
                        Add New Member
                      </span>
                      <div className="flex gap-2">
                        <input
                          id="new-member-name"
                          type="text"
                          value={newTravelerName}
                          onChange={(e) => setNewTravelerName(e.target.value)}
                          placeholder="e.g. Grandma, Kid"
                          className="flex-1 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono"
                        />
                        <input
                          id="new-member-age"
                          type="number"
                          value={newTravelerAge}
                          onChange={(e) => setNewTravelerAge(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Age"
                          className="w-18 text-xs p-2 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono"
                          min="1"
                          max="110"
                        />
                        <button
                          id="btn-add-member"
                          type="button"
                          onClick={handleAddTraveler}
                          className="bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-wider px-3.5 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Small Fields below traveler roster: Full name, Home city and Preferred Currency */}
                    <div className="border-t border-charcoal/10 pt-4 mt-2 space-y-4">
                      <span className="block text-[9px] font-bold text-sage uppercase tracking-wider">
                        Personal & Trip Identity
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                          <label className="block text-[8px] font-mono font-bold text-charcoal/60 uppercase tracking-wider mb-1">
                            Your Name
                          </label>
                          <input
                            id="basics-fullname"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Robert Vance"
                            className="w-full text-xs p-2.5 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal"
                          />
                        </div>

                        {/* Home City */}
                        <div className="relative">
                          <label className="block text-[8px] font-mono font-bold text-charcoal/60 uppercase tracking-wider mb-1">
                            Home City
                          </label>
                          <input
                            id="basics-homecity"
                            type="text"
                            value={homeCity}
                            onChange={(e) => {
                              setHomeCity(e.target.value);
                              setShowCitySuggestions(true);
                            }}
                            onFocus={() => setShowCitySuggestions(true)}
                            onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                            placeholder="e.g. Mumbai, New York"
                            className="w-full text-xs p-2.5 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal"
                          />
                          
                          {/* Autocomplete Suggestions */}
                          {showCitySuggestions && filteredCities.length > 0 && (
                            <div className="absolute z-20 left-0 right-0 mt-1 bg-warm-parchment border border-charcoal/15 shadow-md max-h-32 overflow-y-auto">
                              {filteredCities.map((city) => (
                                <button
                                  key={city}
                                  type="button"
                                  onClick={() => {
                                    setHomeCity(city);
                                    setShowCitySuggestions(false);
                                  }}
                                  className="w-full text-left text-xs font-mono p-2 hover:bg-clay/5 hover:text-clay transition-colors"
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Currency selection */}
                      <div>
                        <label className="block text-[8px] font-mono font-bold text-charcoal/60 uppercase tracking-wider mb-1.5">
                          Preferred Currency
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['USD', 'INR', 'EUR', 'GBP'] as const).map((curr) => (
                            <button
                              key={curr}
                              id={`currency-${curr}`}
                              type="button"
                              onClick={() => setCurrency(curr)}
                              className={
                                "p-2.5 text-xs font-mono font-bold transition-all border " + (currency === curr 
                                  ? 'border-clay bg-clay/5 text-clay' 
                                  : 'border-charcoal/20 hover:border-charcoal/40 text-charcoal/60')
                              }
                            >
                              {curr}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Side: The Living Age-Spectrum Axis */}
                  <div className="md:col-span-5 bg-warm-parchment border border-charcoal/15 p-6 flex flex-col justify-between min-h-[300px]">
                    <div>
                      <span className="block text-[9px] font-bold text-sage uppercase tracking-widest mb-3">
                        Dynamic Age-Spectrum
                      </span>
                      <p className="text-[10px] text-charcoal/60 leading-normal font-light mb-6">
                        See your travel group mapped visually across their lifespans. Perfect balance is achieving compromises between all points.
                      </p>
                    </div>

                    {/* Spectrum Visual Line Container */}
                    <div className="relative py-12 px-2">
                      {/* Scale markings */}
                      <div className="absolute top-2 left-0 right-0 flex justify-between text-[8px] font-mono text-charcoal/40">
                        <span>Toddler (0)</span>
                        <span>Adult (45)</span>
                        <span>Senior (90+)</span>
                      </div>

                      {/* Continuous horizontal axis line */}
                      <div className="h-[2px] bg-charcoal/25 w-full relative">
                        {/* Live markers plotted */}
                        {travelers.map((t, idx) => {
                          const percentage = Math.min(100, Math.max(0, (t.age / 90) * 100));
                          const isEven = idx % 2 === 0;
                          return (
                            <div 
                              key={t.id} 
                              className="absolute transition-all duration-300 flex flex-col items-center"
                              style={{ 
                                left: percentage + '%',
                                transform: 'translateX(-50%)',
                                top: '-6px' 
                              }}
                            >
                              {/* Colored physical dot on axis line */}
                              <div className="w-3.5 h-3.5 rounded-full bg-clay border-2 border-warm-parchment ring-1 ring-clay/40 shadow-sm z-10" />
                              
                              {/* Floating staggered label block */}
                              <div className={
                                "absolute whitespace-nowrap bg-ink-navy text-warm-parchment font-mono text-[9px] px-1.5 py-0.5 rounded-none z-20 " + (isEven ? 'bottom-5' : 'top-5')
                              }>
                                {(t.name || 'guest') + " (" + t.age + ")"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-charcoal/10 text-[10px] text-sage font-bold uppercase tracking-wider text-center">
                      Span: {(Math.max(...travelers.map(t => t.age)) - Math.min(...travelers.map(t => t.age))) + ' years span'}
                    </div>
                  </div>

                </div>

                {/* Next CTA */}
                <div className="pt-6 border-t border-charcoal/10 flex justify-end">
                  <button
                    id="btn-step1-next"
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!fullName.trim()}
                    className={
                      "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors cursor-pointer " + (fullName.trim() 
                        ? 'bg-clay hover:bg-ink-navy text-warm-parchment' 
                        : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed')
                    }
                  >
                    Trip Basics <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TRIP BASICS (Travel style and Budget) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif font-black text-ink-navy mb-1">Style & Financial Cadence</h3>
                  <p className="text-xs text-charcoal/60 leading-relaxed font-light">
                    These metrics define your core visual experiences and budget allocations.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Style Cards Grid */}
                  <div>
                    <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-2.5">
                      Pick ONE Travel Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TRAVEL_STYLES.map((style) => (
                        <button
                          key={style.id}
                          id={"style-" + style.id}
                          type="button"
                          onClick={() => setSelectedStyle(style.id)}
                          className={
                            "p-4 text-left bg-warm-parchment border transition-all h-full flex flex-col justify-between " + (selectedStyle === style.id 
                              ? 'border-clay bg-clay/5 ring-1 ring-clay/10' 
                              : 'border-charcoal/15 hover:border-charcoal/30')
                          }
                        >
                          <span className="font-serif font-black text-sm block text-ink-navy mb-1">
                            {style.label}
                          </span>
                          <span className="text-[10px] text-charcoal/65 font-light leading-snug block">
                            {style.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget Tier Selector with Hints */}
                    <div>
                      <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-2.5">
                        Budget Tier
                      </label>
                      <div className="space-y-2">
                        {BUDGET_TIERS.map((tier) => (
                          <button
                            key={tier.id}
                            id={"budget-" + tier.id}
                            type="button"
                            onClick={() => setSelectedBudget(tier.id)}
                            className={
                              "w-full p-3.5 text-left bg-warm-parchment border transition-all flex items-center justify-between " + (selectedBudget === tier.id 
                                ? 'border-clay bg-clay/5' 
                                : 'border-charcoal/15 hover:border-charcoal/30')
                            }
                          >
                            <div>
                              <span className="text-xs font-bold text-ink-navy block">{tier.label}</span>
                              <span className="text-[9px] text-charcoal/50 font-light">{tier.desc}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-clay bg-clay/5 px-2 py-1 border border-clay/15">
                              {getSpendHint(tier.id, currency)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Intelligent Info Box replaces duration & advanced fields */}
                    <div className="bg-sage/5 border border-sage/20 p-5 flex flex-col justify-between">
                      <div>
                        <span className="block text-[9px] font-bold text-sage uppercase tracking-widest mb-3">
                          Kinfolk Intelligence
                        </span>
                        <h4 className="font-serif font-black text-ink-navy text-sm mb-2">Automated Compromise Profile</h4>
                        <p className="text-xs text-charcoal/70 leading-relaxed font-light mb-4">
                          Based on your traveling group's ages, Kinfolk will automatically derive the optimal <strong>intensity ceiling</strong> and schedule parameters.
                        </p>
                        <p className="text-[11px] text-charcoal/60 leading-relaxed font-light">
                          Sensible initial defaults (such as standard meal intervals, moderate mobility access, and a 1-week timeline) are preset so you can skip complex questions and start planning immediately.
                        </p>
                      </div>

                      <div className="border-t border-charcoal/10 pt-3.5 mt-4 text-[10px] text-sage/80 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-sage" />
                        Adjustable anytime within the application.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-6 border-t border-charcoal/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-clay flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>

                  <button
                    id="btn-onboarding-finish"
                    type="button"
                    onClick={handleWizardSubmit}
                    className="bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-widest px-8 py-3.5 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    Generate Plan <Check className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: FINAL SUMMARY SCREEN */}
            {step === 3 && derivedProfile && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-12 h-12 border border-clay/30 bg-clay/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Compass className="w-5 h-5 text-clay animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-ink-navy mb-2">Compromise Profile Built</h3>
                  <p className="text-xs text-charcoal/60 leading-relaxed font-light max-w-md mx-auto">
                    We have successfully synthesized individual stamina parameters and parsed constraints. Here is your custom travel alignment matrix.
                  </p>
                </div>

                {/* Custom Box containing Summary details */}
                <div className="border border-charcoal/15 bg-warm-parchment p-6 space-y-6">
                  
                  {/* Persona Header banner */}
                  <div className="bg-ink-navy text-warm-parchment p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-sage font-bold block">Travel Persona</span>
                      <h4 className="text-lg font-serif font-bold text-warm-parchment">{derivedProfile.travelPersona}</h4>
                    </div>
                    <span className="text-xs font-mono border border-clay/40 text-clay px-2.5 py-1 uppercase tracking-widest font-bold">
                      {derivedProfile.ageProfile.groupType + " Group"}
                    </span>
                  </div>

                  {/* Summary Details Roster Line */}
                  <div className="p-4 border border-clay/20 bg-clay/5 flex items-center gap-2 text-xs leading-relaxed font-light text-charcoal/90">
                    <AlertTriangle className="w-4 h-4 text-clay shrink-0" />
                    <span>
                      Traveling as: <strong className="font-bold">{derivedProfile.ageProfile.groupType}</strong> group, ages {Math.min(...travelers.map(t => t.age))}–{Math.max(...travelers.map(t => t.age))}. Intensity ceiling: <strong className="font-bold">{derivedProfile.ageProfile.intensityCeiling}</strong>.
                    </span>
                  </div>

                  {/* Plotted visual spectrum axis inside summary box */}
                  <div className="space-y-2">
                    <span className="block text-[8px] font-bold text-sage uppercase tracking-widest">
                      Roster Spectrum Alignment
                    </span>
                    <div className="relative py-8 px-2 bg-warm-parchment/40 border border-charcoal/5">
                      <div className="h-[1px] bg-charcoal/25 w-full relative">
                        {derivedProfile.ageProfile.travelers.map((t: any, idx: number) => {
                          const percentage = Math.min(100, Math.max(0, (t.age / 90) * 100));
                          const isEven = idx % 2 === 0;
                          return (
                            <div 
                              key={t.id} 
                              className="absolute flex flex-col items-center"
                              style={{ 
                                left: percentage + '%',
                                transform: 'translateX(-50%)',
                                top: '-4px' 
                              }}
                            >
                              <div className="w-2 h-2 rounded-full bg-clay" />
                              <span className={
                                "absolute whitespace-nowrap text-[8px] font-mono text-charcoal/60 " + (isEven ? 'bottom-3' : 'top-3')
                              }>
                                {t.name + " (" + t.age + ")"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Spend hints / stats */}
                  <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs border-t border-charcoal/10 pt-4">
                    <div>
                      <span className="block text-[8px] text-sage font-bold uppercase">Cadence</span>
                      <span className="font-bold text-ink-navy">{derivedProfile.tripDuration}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-sage font-bold uppercase">Daily Budget</span>
                      <span className="font-bold text-ink-navy">{derivedProfile.currency + " " + derivedProfile.dailyBudget}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-sage font-bold uppercase">Food Pref</span>
                      <span className="font-bold text-ink-navy truncate block px-1">{derivedProfile.foodPrefs}</span>
                    </div>
                  </div>

                </div>

                {/* Final planning trigger */}
                <div className="pt-4 flex justify-center">
                  <button
                    id="btn-onboarding-submit"
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-widest px-10 py-4 transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    Start Planning <Compass className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
