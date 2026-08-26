import { BlogPost, HealthFaqItem } from '../types';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'health-post-fasting-autophagy',
    title: 'The Cellular Biology of Intermittent Fasting: Autophagy, AMPK, and Insulin Sensitivity',
    slug: 'cellular-biology-intermittent-fasting-autophagy-ampk',
    excerpt: 'An evidence-based clinical deep-dive into how 16:8 and time-restricted feeding triggers chaperone-mediated autophagy, decreases systemic inflammation, and restores metabolic flexibility.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    imageAltText: 'Microscopic depiction of cellular organelles undergoing autophagic renewal and mitochondrial biogenesis',
    imageCaption: 'Cellular degradation and recycling pathways during nutrient depletion states.',
    imageSourceUrl: 'https://unsplash.com',
    category: 'longevity',
    categoryLabel: 'Longevity & Cellular',
    tags: ['Autophagy', 'InsulinSensitivity', 'Mitochondria', 'AMPK', 'Fasting'],
    targetAudience: 'Clinical Overview',
    author: {
      id: 'author-marcus-vance',
      name: 'Prof. Marcus Vance, PhD',
      role: 'Cellular Biologist & Gerontologist',
      credentials: 'PhD, Stanford Longevity Center',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      bio: 'Investigating molecular mechanisms of cellular senescence, mTOR signaling, and fasting mimetics.',
      handle: '@marcusvance_phd'
    },
    medicallyReviewedBy: {
      id: 'rev-dr-anita-sharma',
      name: 'Dr. Anita Sharma, MD, PhD',
      credentials: 'MD, PhD • Endocrinologist & Longevity Fellow',
      affiliation: 'Mayo Clinic Division of Endocrinology',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      verified: true,
      reviewDate: 'Reviewed: August 2026'
    },
    publishedAt: 'Yesterday',
    readTimeMinutes: 7,
    featured: true,
    trending: true,
    status: 'published',
    clapsCount: 248,
    viewsCount: 3120,
    bookmarksCount: 89,
    disclaimer: 'Always consult a qualified healthcare provider before initiating prolonged fasting protocols, particularly if you have diabetes, low body mass index, or a history of disordered eating.',
    keyTakeaways: [
      'Autophagic flux increases exponentially around the 14 to 18-hour postprandial window due to mTORC1 inhibition and AMPK upregulation.',
      'Time-restricted eating synchronizes peripheral circadian clocks in liver and muscle tissue, enhancing GLUT4 transporter translocation.',
      'Maintaining adequate electrolyte balance (sodium, magnesium, potassium) preserves cardiac output during initial fasting adaptations.'
    ],
    scientificReferences: [
      {
        title: 'Effects of Intermittent Fasting on Health, Aging, and Disease',
        journal: 'New England Journal of Medicine',
        year: '2019',
        link: 'https://www.nejm.org/doi/full/10.1056/NEJMra1905136',
        doi: '10.1056/NEJMra1905136'
      },
      {
        title: 'mTOR Signaling in Growth, Metabolism, and Disease',
        journal: 'Cell Research & Molecular Medicine',
        year: '2022',
        link: 'https://pubmed.ncbi.nlm.nih.gov',
        doi: '10.1016/j.cell.2022.01.011'
      }
    ],
    comments: [
      {
        id: 'c-101',
        authorName: 'Dr. Elena Vance, ND',
        authorAvatar: 'https://images.unsplash.com/photo-1594824813598-c16f21226c6d?auto=format&fit=crop&w=150&q=80',
        createdAt: '3 hours ago',
        content: 'Fascinating breakdown of the AMPK/mTOR switch. We see marked reductions in hs-CRP biomarkers across patients implementing clean 16:8 windows.',
        likes: 14
      }
    ],
    content: `## The Molecular Mechanics of Nutritional Depletion

When exogenous macronutrients are withheld, intracellular glucose concentrations decline rapidly, causing the adenosine triphosphate (ATP) to adenosine monophosphate (AMP) ratio to shift. This energetic signal is immediately sensed by **AMP-activated protein kinase (AMPK)**.

### The AMPK vs. mTORC1 Dynamic Balance

In nutrient-replete states:
1. **mTORC1 (mammalian target of rapamycin)** remains active, phosphorylating and inhibiting the ULK1 kinase complex.
2. In fasting states (12+ hours): AMPK directly phosphorylates **ULK1** at Ser317 and Ser777, initiating the formation of the phagophore membrane.

| Fasting Phase | Primary Metabolic Pathway | Biological Marker |
| :--- | :--- | :--- |
| **0–4 Hours** | Glycogen utilization | Postprandial glucose & insulin spike |
| **4–12 Hours** | Hepatic glycogenolysis | Basal insulin decline, glucagon rise |
| **12–18 Hours** | Lipolysis & Ketogenesis | Elevated Beta-hydroxybutyrate (0.5–1.5 mM) |
| **18–24 Hours** | High-efficiency Autophagy | ULK1 activation, damaged organelle clearance |

> *"Autophagy is not merely cellular starvation; it is the body's internal quality-control system removing dysfunctional mitochondria and misfolded proteins before they promote senescence."*

### Mitochondrial Quality Control (Mitophagy)

One of the most profound longevity outcomes of regular fasting intervals is **mitophagy**—the targeted degradation of damaged mitochondria. Old mitochondria leak reactive oxygen species (ROS) into the cytoplasm. By clearing these compromised energy factories and stimulating peroxisome proliferator-activated receptor gamma coactivator 1-alpha (**PGC-1α**), the cell produces brand new, high-efficiency mitochondria upon refeeding.

### Clinical Protocol Recommendations

- **16:8 Protocol**: 16 hours water/electrolyte fasting, 8-hour nutrient-dense feeding window.
- **Electrolyte Ingestion**: Ensure 500mg sodium and 200mg elemental magnesium glycinate during prolonged fasting periods.
- **Refeeding Integrity**: Break fasting periods with bioavailable proteins and polyphenol-rich vegetables rather than high-glycemic carbohydrates.`
  },
  {
    id: 'health-post-gut-microbiome',
    title: 'The Microbiome-Brain Axis: Short-Chain Fatty Acids, Serotonin, and Vagal Signaling',
    slug: 'microbiome-brain-axis-scfa-serotonin-vagal-signaling',
    excerpt: 'How symbiotic colon bacteria synthesize 90% of peripheral serotonin and produce butyrate, propionate, and acetate to regulate neuroinflammation and blood-brain barrier integrity.',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85',
    imageAltText: 'Fresh fermented foods, prebiotic fiber rich legumes, and cruciferous vegetables supporting healthy gut flora',
    imageCaption: 'Dietary prebiotic diversity directly correlates with gut microbial phyla resilience.',
    imageSourceUrl: 'https://unsplash.com',
    category: 'nutrition',
    categoryLabel: 'Nutrition & Dietetics',
    tags: ['Microbiome', 'GutBrain', 'Butyrate', 'Prebiotics', 'Neurotransmitters'],
    targetAudience: 'Patient Guide',
    author: {
      id: 'author-elena-rostova',
      name: 'Elena Rostova, MS, RD',
      role: 'Clinical Nutritionist & Gut Specialist',
      credentials: 'MS in Nutritional Biochemistry, RD',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
      bio: 'Specializing in functional gastroenterology, dysbiosis resolution, and prebiotic nutritional therapies.',
      handle: '@elenagut_rd'
    },
    medicallyReviewedBy: {
      id: 'rev-dr-james-thorne',
      name: 'Dr. James Thorne, MD, FACN',
      credentials: 'MD, FACN • Functional Medicine Physician',
      affiliation: 'Cleveland Clinic Center for Functional Medicine',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      verified: true,
      reviewDate: 'Reviewed: July 2026'
    },
    publishedAt: '3 days ago',
    readTimeMinutes: 6,
    featured: false,
    trending: true,
    status: 'published',
    clapsCount: 189,
    viewsCount: 2410,
    bookmarksCount: 65,
    disclaimer: 'Nutritional adjustments for gut dysbiosis should be personalized. Patients experiencing severe inflammatory bowel symptoms should consult a board-certified gastroenterologist before drastically escalating fiber intake.',
    keyTakeaways: [
      'Over 90% of the body’s serotonin is synthesized by enterochromaffin cells in the gastrointestinal tract under microbial modulation.',
      'Butyrate serves as the primary metabolic fuel for colonocytes and tightens the zonula occludens junctions in both the gut and blood-brain barriers.',
      'Consuming 30+ distinct plant varieties per week is the single strongest predictor of high microbial alpha-diversity.'
    ],
    scientificReferences: [
      {
        title: 'The Gut-Brain Axis: Interactions between Enteric Microbiota, Central and Enteric Nervous Systems',
        journal: 'Annals of Gastroenterology',
        year: '2021',
        link: 'https://pubmed.ncbi.nlm.nih.gov/25830558/'
      },
      {
        title: 'Microbial Metabolites in Neural Function and Disease',
        journal: 'Nature Neuroscience',
        year: '2023',
        doi: '10.1038/s41593-023-01314-x'
      }
    ],
    comments: [],
    content: `## The Enteric Nervous System & Microbial Cross-Talk

The human intestine contains over 500 million neurons—often designated as our "second brain." Through the bidirectional highway of the **vagus nerve (Cranial Nerve X)**, the microbiome directly sends chemical signals to the brainstem and limbic system.

### The Power of Short-Chain Fatty Acids (SCFAs)

When anaerobic commensal bacteria ferment non-digestible dietary fibers and resistant starches, they synthesize three vital SCFAs:
1. **Butyrate**: Primary energy source for colonocytes, epigenetic histone deacetylase (HDAC) inhibitor, and suppressor of microglial inflammatory activation.
2. **Propionate**: Regulates hepatic gluconeogenesis and satiety hormone peptide YY (PYY).
3. **Acetate**: Crosses the blood-brain barrier to regulate central appetite and hypothalamic neuropeptide expression.

| Prebiotic Fiber Source | Targeted Bacterial Phylum | Primary SCFA Produced |
| :--- | :--- | :--- |
| **Inulin / Chicory Root** | *Bifidobacterium longum* | Acetate & Lactate |
| **Resistant Starch Type 3** | *Faecalibacterium prausnitzii* | High Butyrate |
| **Beta-Glucans (Oats/Barley)** | *Akkermansia muciniphila* | Propionate & Butyrate |
| **Polyphenol Berries** | *Bacteroidetes* | Phenolic Metabolites |

> *"Your gut microbiome acts as an endocrine organ, transforming the fiber on your fork into neuroactive biochemicals that govern mood, focus, and resilience."*

### Practical 4-Week Microbiome Restoration Strategy

- **Aim for 30 Diverse Plants**: Track unique vegetables, seeds, nuts, spices, and grains weekly.
- **Incorporate Fermented Foods**: 2–3 daily servings of raw sauerkraut, kimchi, or unpasteurized kefir.
- **Minimize Emulsifiers & Artificial Sweeteners**: Polysorbate-80 and sucralose disrupt the protective intestinal mucosal gel layer.`
  },
  {
    id: 'health-post-zone2-cardio',
    title: 'Zone 2 Cardiovascular Base: Mitochondrial Density, Fat Oxidation, and VO2 Max',
    slug: 'zone2-cardiovascular-base-mitochondrial-density-fat-oxidation',
    excerpt: 'Why low-intensity, steady-state training below the first lactate threshold is the most potent lifestyle intervention for cellular energy efficiency and all-cause mortality reduction.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
    imageAltText: 'Athlete training in steady Zone 2 heart rate endurance on a scenic outdoor cycling track',
    imageCaption: 'Zone 2 exercise targets Type I slow-twitch muscle fibers rich in oxidative mitochondria.',
    imageSourceUrl: 'https://unsplash.com',
    category: 'fitness',
    categoryLabel: 'Fitness & Movement',
    tags: ['Zone2', 'VO2Max', 'Cardio', 'LactateThreshold', 'Longevity'],
    targetAudience: 'General Public',
    author: {
      id: 'author-david-chen',
      name: 'Dr. David Chen, MD, MPH',
      role: 'Preventive Cardiologist & Sports Physician',
      credentials: 'MD, MPH, FACC',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      bio: 'Cardiologist researching athletic longevity, cardiorespiratory fitness metrics, and lipidology.',
      handle: '@davidchen_md'
    },
    medicallyReviewedBy: {
      id: 'rev-dr-robert-sterling',
      name: 'Dr. Robert Sterling, MD, FACC',
      credentials: 'MD, FACC • Chief of Preventive Cardiology',
      affiliation: 'Johns Hopkins Medicine',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
      verified: true,
      reviewDate: 'Reviewed: August 2026'
    },
    publishedAt: '5 days ago',
    readTimeMinutes: 5,
    featured: false,
    trending: false,
    status: 'published',
    clapsCount: 312,
    viewsCount: 4200,
    bookmarksCount: 110,
    disclaimer: 'Individuals with preexisting cardiovascular conditions or elevated resting blood pressure should undergo an exercise stress test and obtain physician clearance before starting new aerobic training routines.',
    keyTakeaways: [
      'Zone 2 is characterized by blood lactate levels maintained strictly between 1.5 and 2.0 mmol/L.',
      'Training in Zone 2 stimulates mitochondrial biogenesis via PGC-1α and optimizes maximum fat oxidation rates (FatMax).',
      'Target 150 to 180 minutes of cumulative Zone 2 training weekly for optimal cardiovascular protection.'
    ],
    scientificReferences: [
      {
        title: 'Cardiorespiratory Fitness and Mortality Risk in US Adults',
        journal: 'JAMA Network Open',
        year: '2020',
        doi: '10.1001/jamanetworkopen.2020.29886'
      }
    ],
    comments: [],
    content: `## What Exactly is Zone 2 Training?

In exercise physiology, **Zone 2** is defined as the exercise intensity where the body relies predominantly on oxidative phosphorylation in Type I slow-twitch muscle fibers, burning fatty acids while maintaining blood lactate levels below **2.0 mmol/L**.

### The "Talk Test" Diagnostic

You do not need a clinical metabolic cart to identify Zone 2:
- You should be able to maintain a continuous, full sentence without gasping.
- Breathing rhythm is elevated, but nasal breathing remains possible for extended intervals.
- If you cannot speak without pausing for breath, you have crossed into Zone 3 (glycolytic dominance).

| Heart Rate Zone | Primary Energy Fuel | Blood Lactate | Training Objective |
| :--- | :--- | :--- | :--- |
| **Zone 1 (Recovery)** | Triglycerides | &lt; 1.0 mmol/L | Active recovery, tissue flushing |
| **Zone 2 (Base)** | Maximum Fat Oxidation | 1.5–2.0 mmol/L | Mitochondrial density & efficiency |
| **Zone 3 (Tempo)** | Mixed Fats & Glycogen | 2.0–3.5 mmol/L | Race pacing adaptation |
| **Zone 4 (Threshold)** | Pure Glycogen | 4.0+ mmol/L | Lactate clearance capacity |
| **Zone 5 (VO2 Max)** | Anaerobic Glycolysis | 8.0+ mmol/L | Peak aerobic cardiac stroke output |

> *"A wide cardiovascular base allows you to sustain higher intensities with less cardiac strain and faster inter-set metabolic recovery."*

### Suggested Weekly Protocol

1. **3 to 4 sessions** of 45–60 minutes steady cycling, rowing, incline treadmill walking, or light jogging.
2. Pair with **1 weekly session** of 4x4-minute Norwegian VO2 Max intervals to challenge maximum cardiac output.`
  }
];

export const HEALTH_CATEGORIES_METADATA = [
  {
    id: 'all',
    label: 'All Health Articles',
    description: 'Explore the complete archive of peer-reviewed health and wellness insights.',
    icon: 'Sparkles',
    color: 'emerald'
  },
  {
    id: 'longevity',
    label: 'Longevity & Cellular',
    description: 'Autophagy, telomeres, mitochondrial health, and geroprotective science.',
    icon: 'Dna',
    color: 'teal'
  },
  {
    id: 'nutrition',
    label: 'Nutrition & Dietetics',
    description: 'Gut microbiome, functional whole foods, metabolic flexibility, and micronutrients.',
    icon: 'Salad',
    color: 'green'
  },
  {
    id: 'sleep-science',
    label: 'Sleep & Recovery',
    description: 'Circadian entrainment, glymphatic brain wash, and restorative sleep hygiene.',
    icon: 'Moon',
    color: 'indigo'
  },
  {
    id: 'mental-health',
    label: 'Mental Health & Mind',
    description: 'Neuroplasticity, dopamine regulation, stress adaptation, and mindful living.',
    icon: 'Brain',
    color: 'purple'
  },
  {
    id: 'fitness',
    label: 'Fitness & Movement',
    description: 'Hypertrophy mechanics, Zone 2 endurance, sarcopenia prevention, and joint health.',
    icon: 'Activity',
    color: 'amber'
  },
  {
    id: 'preventive-care',
    label: 'Preventive Medicine',
    description: 'Early blood biomarkers, cardiovascular risk evaluation, and health screening.',
    icon: 'Stethoscope',
    color: 'cyan'
  },
  {
    id: 'holistic-wellness',
    label: 'Holistic Wellness',
    description: 'Hydration biology, sauna & cold therapy, breathwork, and daily rituals.',
    icon: 'Leaf',
    color: 'emerald'
  }
];

export const HEALTH_FAQ_DATA: HealthFaqItem[] = [
  {
    category: 'Editorial & Ethics',
    question: 'How are health articles on "Health is everything" researched and verified?',
    answer: 'Every article published on "Health is everything" undergoes strict editorial fact-checking. Our contributors include medical doctors (MD), registered dietitians (RD), exercise physiologists (CSCS), and neuroscientists. We cite peer-reviewed clinical studies from journals including Nature, The Lancet, Cell, and JAMA.'
  },
  {
    category: 'Nutrition & Diet',
    question: 'Is intermittent fasting suitable for everyone?',
    answer: 'While 14–16 hour fasting benefits metabolic flexibility and autophagy in healthy adults, it is not universally appropriate for pregnant or breastfeeding women, individuals with a history of disordered eating, or those with unmanaged Type 1 diabetes. Always consult your personal physician before making major dietary adjustments.'
  },
  {
    category: 'Longevity Science',
    question: 'What is the difference between lifespan and healthspan?',
    answer: 'Lifespan is the total number of years you live. Healthspan is the number of years you live free from chronic debilitating disease, cognitive decline, and physical frailty. Our primary editorial mission is maximizing healthspan so your later years remain energetic, clear-minded, and active.'
  },
  {
    category: 'Sleep & Recovery',
    question: 'Can you "catch up" on lost sleep over the weekend?',
    answer: 'Research demonstrates that while weekend sleep extensions can slightly alleviate acute subjective sleepiness, they do not reverse the metabolic insulin resistance or neuronal inflammation caused by chronic weekday sleep deprivation. Maintaining a consistent circadian sleep-wake schedule is far more protective.'
  },
  {
    category: 'Mental Well-being',
    question: 'Can readers submit their own health articles or personal wellness stories?',
    answer: 'Yes! You can use our built-in "Write Article" studio in the menu to draft and submit health stories, patient journeys, or evidence-backed fitness routines for review and publication.'
  }
];
