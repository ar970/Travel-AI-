import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Users, 
  Battery, 
  Calendar, 
  ShieldAlert, 
  MessageSquare, 
  DollarSign, 
  ArrowRight, 
  Check, 
  Minus
} from 'lucide-react';
import { PRICING_TIERS, TESTIMONIALS } from '../data';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="bg-warm-parchment text-charcoal font-sans min-h-screen selection:bg-clay/20 selection:text-ink-navy overflow-x-hidden">
      {/* Editorial Header / Navbar */}
      <nav id="navbar" className="border-b border-charcoal/10 py-6 px-6 md:px-16 flex items-center justify-between bg-warm-parchment">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-3xl font-serif font-black text-ink-navy tracking-tight">
            Kinfolk
          </span>
        </div>

        {/* Minimal Understated Nav Links */}
        <div className="hidden md:flex items-center gap-12 text-xs font-semibold uppercase tracking-widest text-charcoal/70">
          <a href="#philosophy" className="hover:text-clay transition-colors">Philosophy</a>
          <a href="#features" className="hover:text-clay transition-colors">Differentiators</a>
          <a href="#process" className="hover:text-clay transition-colors">The Process</a>
          <a href="#pricing" className="hover:text-clay transition-colors">Pricing</a>
        </div>

        {/* Understated CTA Button - No bright buttons, thin border in clay accent */}
        <div>
          <button 
            id="nav-cta"
            onClick={onGetStarted}
            className="border border-clay text-clay hover:bg-clay hover:text-warm-parchment text-xs font-semibold uppercase tracking-widest px-5 py-2.5 transition-all duration-300 cursor-pointer"
          >
            Plan a Trip
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-16 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Asymmetric Left: Large Headline & Description */}
          <div className="lg:col-span-6 flex flex-col items-start pt-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-sage mb-4 block">
              An Editorial Family Travel Planner
            </span>
            
            <h1 className="text-5xl md:text-7xl font-serif font-black text-ink-navy leading-[1.05] tracking-tight mb-8">
              Plan the trip everyone actually wants.
            </h1>
            
            <p className="text-lg md:text-xl text-charcoal/80 max-w-lg mb-10 font-sans font-light leading-relaxed">
              Built for journeys spanning a 6-year-old who wants the theme park, a 29-year-old who wants to sleep in, and a 64-year-old who wants the museum. Kinfolk balances energy budgets, not just cash.
            </p>

            <button 
              id="hero-primary-cta"
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-clay border-b-2 border-clay pb-1 hover:text-ink-navy hover:border-ink-navy transition-colors cursor-pointer"
            >
              Configure Your Group Trip
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Asymmetric Right: The Signature Moment (Age-Spectrum centerpiece) */}
          <div className="lg:col-span-6 bg-warm-parchment/40 border border-charcoal/10 p-8 md:p-10 relative">
            <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-widest text-sage/70">
              The Age-Spectrum Axis
            </div>

            {/* Horizontal axis line */}
            <div className="absolute top-[38%] left-10 right-10 h-[1px] bg-charcoal/20"></div>

            {/* Age Marker Points */}
            <div className="relative z-10 grid grid-cols-4 gap-2 pt-8 pb-4">
              
              {/* Age 6 */}
              <div className="flex flex-col items-center text-center relative">
                <span className="text-xs font-mono font-bold text-sage">Age 6</span>
                {/* Visual marker dot on line */}
                <div className="w-2.5 h-2.5 rounded-full bg-clay border-2 border-warm-parchment absolute top-[36px] z-20"></div>
                <p className="text-xs text-charcoal/75 mt-14 max-w-[100px] font-serif italic leading-snug">
                  "wants the theme park"
                </p>
              </div>

              {/* Age 14 */}
              <div className="flex flex-col items-center text-center relative">
                <span className="text-xs font-mono font-bold text-sage">Age 14</span>
                <div className="w-2.5 h-2.5 rounded-full bg-clay border-2 border-warm-parchment absolute top-[36px] z-20"></div>
                <p className="text-xs text-charcoal/75 mt-14 max-w-[100px] font-serif italic leading-snug">
                  "wants high-speed coasters"
                </p>
              </div>

              {/* Age 29 */}
              <div className="flex flex-col items-center text-center relative">
                <span className="text-xs font-mono font-bold text-sage">Age 29</span>
                <div className="w-2.5 h-2.5 rounded-full bg-clay border-2 border-warm-parchment absolute top-[36px] z-20"></div>
                <p className="text-xs text-charcoal/75 mt-14 max-w-[100px] font-serif italic leading-snug">
                  "wants to sleep in & find espresso"
                </p>
              </div>

              {/* Age 64 */}
              <div className="flex flex-col items-center text-center relative">
                <span className="text-xs font-mono font-bold text-sage">Age 64</span>
                <div className="w-2.5 h-2.5 rounded-full bg-clay border-2 border-warm-parchment absolute top-[36px] z-20"></div>
                <p className="text-xs text-charcoal/75 mt-14 max-w-[100px] font-serif italic leading-snug">
                  "wants to sit somewhere quiet"
                </p>
              </div>

            </div>

            {/* Dynamic visual path lines converging to "one trip" */}
            <div className="mt-12 flex flex-col items-center relative">
              <svg className="w-full h-24 max-w-md text-charcoal/20" viewBox="0 0 400 100" fill="none">
                <path d="M 50,0 Q 200,80 200,100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 150,0 Q 200,80 200,100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 250,0 Q 200,80 200,100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 350,0 Q 200,80 200,100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
              
              <div className="absolute bottom-0 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-ink-navy ring-4 ring-warm-parchment z-30"></div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-navy mt-3 font-bold block">
                  one trip
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 px-6 md:px-16 max-w-7xl mx-auto border-t border-charcoal/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-sage mb-2">Our Philosophy</h2>
            <h3 className="text-3xl font-serif font-black text-ink-navy">The Friction of Generations</h3>
          </div>
          <div className="md:col-span-8 space-y-6 text-charcoal/80 font-light leading-relaxed">
            <p>
              Standard travel planners assume travelers share the same physical limits, sleep schedules, and appetites. They squeeze everyone into the same itinerary, resulting in over-exhausted seniors, cranky children, and frustrated organizers.
            </p>
            <p>
              Kinfolk treats travel plan generation as an optimization problem where <strong>stamina</strong>, <strong>access</strong>, and <strong>preferences</strong> are weighted equally. We map out energy expenditures, offer a peaceful way to negotiate disputes, and make sure everybody gets to do what they came for.
            </p>
          </div>
        </div>
      </section>

      {/* Features Differentiator Section */}
      <section id="features" className="py-24 px-6 md:px-16 bg-ink-navy text-warm-parchment">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-20 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-sage mb-4 block">Product Differentiators</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-warm-parchment leading-tight">
              Designed for harmonious pacing.
            </h2>
          </div>

          {/* Asymmetric Two-Column Editorial Feature Layout */}
          <div className="space-y-32">
            
            {/* Feature 1: Group Negotiation Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Description Column (Large) */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-clay block">Differentiator 1</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-warm-parchment">
                  Group Negotiation Mode
                </h3>
                <p className="text-lg text-warm-parchment/80 font-light leading-relaxed">
                  When different age groups conflict, standard apps average the outcome—resulting in a plan nobody likes. Kinfolk introduces a structured voting system where preferences are weighted dynamically. Under the hood, we analyze group member profiles to surface the optimal overlap. Instead of debate, we deliver consensus.
                </p>
              </div>
              {/* Small Illustrative Diagram (Minimalist & Editorial) */}
              <div className="lg:col-span-5 border border-warm-parchment/20 p-6 bg-ink-navy/40 max-w-md w-full justify-self-center lg:justify-self-end">
                <div className="text-[10px] font-mono text-sage uppercase tracking-wider mb-4 pb-2 border-b border-warm-parchment/10">
                  Consensus Mapping
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-warm-parchment/70">
                    <span>Option A: Extreme Coasters</span>
                    <span className="text-clay">45% Satisfaction</span>
                  </div>
                  <div className="h-[2px] bg-warm-parchment/10 w-full">
                    <div className="h-full bg-clay w-[45%]"></div>
                  </div>

                  <div className="flex justify-between text-xs text-warm-parchment/70">
                    <span>Option B: Quiet Art Museum</span>
                    <span className="text-sage">60% Satisfaction</span>
                  </div>
                  <div className="h-[2px] bg-warm-parchment/10 w-full">
                    <div className="h-full bg-sage w-[60%]"></div>
                  </div>

                  <div className="p-3 bg-warm-parchment/5 border border-clay/30 text-[11px] text-warm-parchment/90 space-y-1">
                    <div className="font-bold text-clay uppercase tracking-widest text-[9px]">Kinfolk Ideal Compromise</div>
                    <div>"Interactive Hands-On Science Center" (92% overlap)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Fatigue Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Small Illustrative Diagram Column (Reversed order on desktop) */}
              <div className="lg:col-span-5 order-2 lg:order-1 border border-warm-parchment/20 p-6 bg-ink-navy/40 max-w-md w-full justify-self-center lg:justify-self-start">
                <div className="text-[10px] font-mono text-sage uppercase tracking-wider mb-4 pb-2 border-b border-warm-parchment/10">
                  Stamina Tracker
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Maya (Age 6)</span>
                      <span className="text-sage">75% stamina</span>
                    </div>
                    <div className="h-1.5 w-full bg-warm-parchment/10 rounded-sm overflow-hidden">
                      <div className="h-full bg-sage" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Elena (Age 72)</span>
                      <span className="text-clay">35% (Warning threshold)</span>
                    </div>
                    <div className="h-1.5 w-full bg-warm-parchment/10 rounded-sm overflow-hidden">
                      <div className="h-full bg-clay" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-clay/10 border border-clay/30 text-[11px] text-warm-parchment/90 leading-normal">
                    ⚠️ <strong>Recalibrating schedule:</strong> Swapping the standard walking tour for the River Catamaran cruise to allow Elena's budget to rest.
                  </div>
                </div>
              </div>

              {/* Description Column */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-clay block">Differentiator 2</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-warm-parchment">
                  The Fatigue Budget
                </h3>
                <p className="text-lg text-warm-parchment/80 font-light leading-relaxed">
                  We track physical energy just like you track expenses. By defining custom stamina profiles based on traveler ages, Kinfolk predicts when group batteries will dip. It automatically injects "quiet rest zones", slow food breaks, and alternative low-stamina plans so that seniors and children can recharge without splitting the group apart.
                </p>
              </div>
            </div>

          </div>

          {/* Supporting Features Grid - Described briefly below */}
          <div className="mt-32 pt-16 border-t border-warm-parchment/10 max-w-6xl">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sage mb-10">Supporting Excursion Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-warm-parchment/85">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-clay">
                  <span className="font-serif italic text-lg font-bold">A.</span>
                  <span className="text-xs font-semibold uppercase tracking-widest">Age-Smart Recommendation Engine</span>
                </div>
                <p className="text-sm font-light leading-relaxed text-warm-parchment/70">
                  Filters attractions and trails to exclude steep accents, high-altitude drops, or unshaded parks if they pose safety or access warnings for your travelers.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-clay">
                  <span className="font-serif italic text-lg font-bold">B.</span>
                  <span className="text-xs font-semibold uppercase tracking-widest">Globi AI Companion</span>
                </div>
                <p className="text-sm font-light leading-relaxed text-warm-parchment/70">
                  A persistent text helper that acts as your group concierge. Ask it to quickly discover stroller-friendly high-tea, family seating, or rest spots.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-clay">
                  <span className="font-serif italic text-lg font-bold">C.</span>
                  <span className="text-xs font-semibold uppercase tracking-widest">Equitable Budget Tracker</span>
                </div>
                <p className="text-sm font-light leading-relaxed text-warm-parchment/70">
                  Allocates pool budgets fairly. Accounts for senior discounts, kid rates, and split-attendance activities so there is never a financial dispute.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* How It Works Sequence Section */}
      <section id="process" className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-b border-charcoal/10">
        <div className="mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-sage mb-4 block">The Sequence</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-ink-navy">
            How Kinfolk Keeps Everyone Happy
          </h2>
        </div>

        {/* 4 sequential steps, numbered, set as a simple vertical or horizontal sequence, NOT cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
          
          <div className="space-y-4">
            <div className="text-5xl font-serif font-black text-clay">1</div>
            <h4 className="text-md font-bold uppercase tracking-wider text-ink-navy">Form Your Roster</h4>
            <p className="text-sm text-charcoal/80 font-light leading-relaxed">
              Add all group members with their ages and physical paces. Kinfolk maps an aggregate stamina curve for the entire journey.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-5xl font-serif font-black text-clay">2</div>
            <h4 className="text-md font-bold uppercase tracking-wider text-ink-navy">Map Interests</h4>
            <p className="text-sm text-charcoal/80 font-light leading-relaxed">
              Submit preference profiles. Our negotiation board automatically aggregates voting to suggest overlapping activity zones.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-5xl font-serif font-black text-clay">3</div>
            <h4 className="text-md font-bold uppercase tracking-wider text-ink-navy">Track Mid-Trip</h4>
            <p className="text-sm text-charcoal/80 font-light leading-relaxed">
              Log daily energy states. If fatigue spikes, the application dynamically re-routes the group to rest stops before a meltdown.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-5xl font-serif font-black text-clay">4</div>
            <h4 className="text-md font-bold uppercase tracking-wider text-ink-navy">Conclude & Settle</h4>
            <p className="text-sm text-charcoal/80 font-light leading-relaxed">
              Examine split expenses and review your compromise logs to see how harmoniously your group traveled together.
            </p>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="py-24 px-6 md:px-16 bg-warm-parchment max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-sage mb-4 block">Testimonial Stories</span>
            <h3 className="text-4xl font-serif font-black text-ink-navy leading-tight">
              Real mixed-age scenarios.
            </h3>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="border-l-2 border-clay pl-8 py-2 space-y-3">
                <blockquote className="text-lg md:text-xl font-serif italic text-charcoal leading-relaxed">
                  "{t.quote}"
                </blockquote>
                <div className="text-xs uppercase tracking-wider text-sage font-bold">
                  {t.author} — <span className="font-light text-charcoal/70">{t.role} ({t.trip})</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing Options */}
      <section id="pricing" className="py-24 px-6 md:px-16 bg-warm-parchment max-w-7xl mx-auto border-t border-charcoal/10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-sage mb-4 block">Pricing packages</span>
          <h2 className="text-4xl font-serif font-black text-ink-navy mb-4">
            A Plan for Every Family
          </h2>
          <p className="text-charcoal/70 font-light text-sm">
            Select the scale of fatigue-optimization and automated compromise features needed for your next multigenerational group trip.
          </p>
        </div>

        {/* 3 tiers, presented as a clean comparison, not gradient-bordered cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier, idx) => (
            <div 
              key={idx} 
              className={`p-8 bg-warm-parchment border ${
                tier.popular 
                  ? 'border-clay shadow-sm' 
                  : 'border-charcoal/10'
              } flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <h4 className="text-lg font-serif font-black text-ink-navy">{tier.name}</h4>
                  {tier.popular && (
                    <span className="text-[9px] font-mono uppercase tracking-widest text-clay border border-clay px-2 py-0.5">
                      Most Selected
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-charcoal/60 mb-8 font-light min-h-[32px]">{tier.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-serif font-black text-ink-navy">{tier.price}</span>
                  <span className="text-xs text-charcoal/50 font-mono lowercase"> / {tier.period}</span>
                </div>

                <div className="h-px bg-charcoal/10 w-full mb-8"></div>

                <ul className="space-y-4 mb-10 text-xs text-charcoal/80">
                  {tier.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-clay shrink-0 mt-0.5" />
                      <span className="font-light leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={onGetStarted}
                className={`w-full py-3.5 uppercase tracking-wider text-xs font-bold transition-all duration-300 cursor-pointer text-center ${
                  tier.popular 
                    ? 'bg-clay hover:bg-ink-navy text-warm-parchment' 
                    : 'border border-charcoal/30 hover:border-clay hover:text-clay text-charcoal'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="bg-ink-navy text-warm-parchment border-t border-warm-parchment/10 py-16 px-6 md:px-16 text-xs text-warm-parchment/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <span className="text-lg font-serif font-bold text-warm-parchment">Kinfolk</span>
            <p className="font-light leading-relaxed text-warm-parchment/50 max-w-xs">
              An offline-first, energy-balanced travel companion for multi-generation family plans. Helping families find comfort in compromise.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-warm-parchment mb-4 uppercase tracking-widest text-[10px]">Product</h5>
            <ul className="space-y-3 font-light text-warm-parchment/55">
              <li><button onClick={onGetStarted} className="hover:text-clay transition-colors cursor-pointer text-left">The Excursion Board</button></li>
              <li><button onClick={onGetStarted} className="hover:text-clay transition-colors cursor-pointer text-left">Stamina Ledger</button></li>
              <li><button onClick={onGetStarted} className="hover:text-clay transition-colors cursor-pointer text-left">Globi Assistant</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-warm-parchment mb-4 uppercase tracking-widest text-[10px]">Resources</h5>
            <ul className="space-y-3 font-light text-warm-parchment/55">
              <li><a href="#" className="hover:text-clay transition-colors">Stamina Index Guide</a></li>
              <li><a href="#" className="hover:text-clay transition-colors">Access Constraints Map</a></li>
              <li><a href="#" className="hover:text-clay transition-colors">Help Articles</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-warm-parchment mb-4 uppercase tracking-widest text-[10px]">Legal</h5>
            <ul className="space-y-3 font-light text-warm-parchment/55">
              <li><a href="#" className="hover:text-clay transition-colors">Privacy Statement</a></li>
              <li><a href="#" className="hover:text-clay transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-warm-parchment/10 flex flex-col md:flex-row justify-between items-center gap-4 text-warm-parchment/40">
          <span>&copy; {new Date().getFullYear()} Kinfolk Travel. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-clay transition-colors">Journal</a>
            <a href="#" className="hover:text-clay transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
