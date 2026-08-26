import React, { useState } from 'react';
import { 
  Calculator, 
  Droplets, 
  Moon, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Info, 
  ArrowRight,
  Sun,
  ShieldCheck
} from 'lucide-react';

interface HealthVitalityHubProps {
  onNavigateToCategory: (category: any) => void;
}

export const HealthVitalityHub: React.FC<HealthVitalityHubProps> = ({
  onNavigateToCategory,
}) => {
  // Active Tool Tab
  const [activeTool, setActiveTool] = useState<'hydration' | 'sleep' | 'checklist'>('hydration');

  // Hydration Calculator State
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(70);
  const [activityMinutes, setActivityMinutes] = useState<number>(45);
  const [climate, setClimate] = useState<'temperate' | 'warm' | 'hot'>('temperate');

  // Sleep Cycle Estimator State
  const [wakeHour, setWakeHour] = useState<number>(7);
  const [wakeMinute, setWakeMinute] = useState<string>('00');
  const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');

  // Checklist State
  const [checkedItems, setCheckedItems] = useState<string[]>([
    'item-sunlight',
    'item-hydration'
  ]);

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculations
  // Base water: 35ml per kg + 12ml per min of workout + climate modifier
  const climateFactor = climate === 'hot' ? 600 : climate === 'warm' ? 300 : 0;
  const totalWaterMl = Math.round(bodyWeightKg * 35 + activityMinutes * 12 + climateFactor);
  const waterLiters = (totalWaterMl / 1000).toFixed(1);
  const sodiumMg = Math.round(totalWaterMl * 0.5);
  const potassiumMg = Math.round(totalWaterMl * 0.35);

  // Sleep calculation: Calculate 5 cycles (7.5h) and 6 cycles (9h) bedtime + 15 min sleep onset latency
  const getBedtime = (cycles: number) => {
    let totalMinutes = (wakePeriod === 'PM' && wakeHour !== 12 ? (wakeHour + 12) * 60 : (wakePeriod === 'AM' && wakeHour === 12 ? 0 : wakeHour * 60)) + parseInt(wakeMinute);
    let bedtimeMinutes = totalMinutes - (cycles * 90 + 15);
    if (bedtimeMinutes < 0) bedtimeMinutes += 24 * 60;
    
    const h = Math.floor(bedtimeMinutes / 60);
    const m = bedtimeMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMinute = m < 10 ? `0${m}` : m;
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const dailyChecklist = [
    {
      id: 'item-sunlight',
      title: 'Morning Photon Ingestion',
      desc: '10–15 mins natural outdoor sunlight within 45 mins of waking to entrain cortisol rhythm.',
      tag: 'Circadian'
    },
    {
      id: 'item-hydration',
      title: 'Electrolyte Morning Jumpstart',
      desc: '500ml water with pinch of unrefined sea salt and fresh lemon for cellular osmolarity.',
      tag: 'Hydration'
    },
    {
      id: 'item-movement',
      title: '30–45 Mins Zone 2 Aerobic Base',
      desc: 'Steady conversation-pace movement to stimulate mitochondrial biogenesis.',
      tag: 'Endurance'
    },
    {
      id: 'item-fasting',
      title: '14–16 Hour Overnight Fast',
      desc: 'Lower mTOR and encourage lysosomal autophagy recycling.',
      tag: 'Longevity'
    },
    {
      id: 'item-microbiome',
      title: 'Prebiotic & Polyphenol Intake',
      desc: 'Fermented food (sauerkraut/kefir) + colorful plant diversity for gut microbiome.',
      tag: 'Nutrition'
    },
    {
      id: 'item-caffeine-curfew',
      title: 'Early Caffeine Cutoff',
      desc: 'No caffeine after 1:00 PM to protect slow-wave delta deep sleep architecture.',
      tag: 'Sleep'
    }
  ];

  return (
    <section id="health-tools" className="py-16 sm:py-20 bg-neutral-950/80 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Longevity &amp; Vitality Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Personalized Daily Health Calculators
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2">
            Calculate your cellular hydration requirements, optimal sleep windows based on 90-minute ultradian cycles, and track your daily longevity habits.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTool('hydration')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'hydration'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-400/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>Hydration &amp; Electrolytes</span>
            </button>

            <button
              onClick={() => setActiveTool('sleep')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'sleep'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-400/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Circadian Sleep Cycles</span>
            </button>

            <button
              onClick={() => setActiveTool('checklist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTool === 'checklist'
                  ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-400/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Vitality Habit Tracker</span>
            </button>
          </div>
        </div>

        {/* Active Tool Content */}
        <div className="max-w-4xl mx-auto">
          
          {/* Tool 1: Hydration Calculator */}
          {activeTool === 'hydration' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-emerald-950/80 shadow-2xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Inputs */}
                <div className="md:col-span-6 space-y-5">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-emerald-400" />
                    <span>Cellular Hydration Estimator</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Based on bodyweight osmolarity, sweat loss rate, and climate heat factor.
                  </p>

                  {/* Bodyweight Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-1.5">
                      <span>Body Weight</span>
                      <span className="font-bold text-emerald-400">{bodyWeightKg} kg ({Math.round(bodyWeightKg * 2.204)} lbs)</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={140}
                      value={bodyWeightKg}
                      onChange={(e) => setBodyWeightKg(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-neutral-950 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Exercise Minutes Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-1.5">
                      <span>Daily Exercise / Sweat Time</span>
                      <span className="font-bold text-emerald-400">{activityMinutes} minutes</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={180}
                      step={5}
                      value={activityMinutes}
                      onChange={(e) => setActivityMinutes(Number(e.target.value))}
                      className="w-full accent-emerald-400 bg-neutral-950 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Climate Selector */}
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1.5">Ambient Climate</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['temperate', 'warm', 'hot'] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setClimate(c)}
                          className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                            climate === c
                              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                              : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Result Card */}
                <div className="md:col-span-6 p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-neutral-950 to-neutral-950 border border-emerald-800/40 text-center space-y-4">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                    Recommended Daily Intake
                  </span>

                  <div className="text-4xl sm:text-5xl font-display font-extrabold text-white">
                    {waterLiters} <span className="text-2xl text-emerald-400 font-sans">Liters</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    ≈ {Math.round(totalWaterMl / 240)} standard 8oz glasses
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800/80 text-left">
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Sodium (Na+)</span>
                      <span className="text-sm font-bold text-white">~{sodiumMg} mg</span>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Potassium (K+)</span>
                      <span className="text-sm font-bold text-white">~{potassiumMg} mg</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-300/90 text-left bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/30">
                    💡 <strong>Longevity Tip:</strong> Sip evenly throughout the day. Avoid chugging &gt;750ml at once to allow optimal renal and intracellular uptake.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tool 2: Sleep Cycle Window Estimator */}
          {activeTool === 'sleep' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-indigo-950/80 shadow-2xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Inputs */}
                <div className="md:col-span-6 space-y-5">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span>Ultradian Sleep Architecture Calculator</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Waking up in the middle of a 90-minute sleep cycle causes severe sleep inertia. Input your target waking time to calculate optimal sleep onset windows.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      Target Wake Up Time
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={wakeHour}
                        onChange={(e) => setWakeHour(Number(e.target.value))}
                        className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>

                      <span className="text-neutral-400 font-bold">:</span>

                      <select
                        value={wakeMinute}
                        onChange={(e) => setWakeMinute(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        {['00', '15', '30', '45'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>

                      <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 ml-2">
                        {(['AM', 'PM'] as const).map((p) => (
                          <button
                            key={p}
                            onClick={() => setWakePeriod(p)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              wakePeriod === p
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                    <span className="text-indigo-300 font-semibold block">Glymphatic Detox Benefit</span>
                    <p className="text-[11px] text-neutral-400">
                      Completing 5 full cycles (7.5h) allows 2 full waves of deep slow-wave Delta sleep to clear beta-amyloid proteins.
                    </p>
                  </div>
                </div>

                {/* Output Bedtime Targets */}
                <div className="md:col-span-6 space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-neutral-900 border border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Optimal Target (5 Cycles • 7.5 hrs)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-900/60 text-indigo-200 border border-indigo-700">
                        RECOMMENDED
                      </span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-white mt-1">
                      {getBedtime(5)}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Includes 15 mins average sleep latency.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                      Extended Recovery (6 Cycles • 9 hrs)
                    </span>
                    <div className="text-2xl font-display font-bold text-white mt-1">
                      {getBedtime(6)}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Ideal for heavy athletic training or neurological fatigue.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 text-[11px] text-neutral-400">
                    Minimum threshold (4 cycles • 6 hrs): <strong className="text-neutral-200">{getBedtime(4)}</strong>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tool 3: Longevity & Vitality Habit Checklist */}
          {activeTool === 'checklist' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-emerald-950/80 shadow-2xl animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Daily Longevity Habit Tracker</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Click items as you execute your daily evidence-based wellness anchors.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700/60 text-xs font-mono text-emerald-300">
                  {checkedItems.length} / {dailyChecklist.length} COMPLETED
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden mb-6 border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
                  style={{ width: `${(checkedItems.length / dailyChecklist.length) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dailyChecklist.map((item) => {
                  const isChecked = checkedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-neutral-200'
                          : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        isChecked ? 'bg-emerald-400 border-emerald-400 text-neutral-950' : 'border-neutral-700 bg-neutral-900'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-emerald-400 uppercase">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
