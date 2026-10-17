/**
 * Illustrative SAMPLE content for the NEXTCARE landing page.
 * Nothing here is live data. Every place it is shown is labelled "Sample data".
 */

export const PROBLEMS = [
  {
    id: 'policy',
    title: 'Policy confusion',
    text: 'Exclusions, waiting periods, room-rent caps and co-pay rules are buried deep in long policy wording.'
  },
  {
    id: 'hospital',
    title: 'Hospital uncertainty',
    text: 'A nearby hospital is not automatically in-network for your particular insurer or plan.'
  },
  {
    id: 'expense',
    title: 'Unexpected expenses',
    text: 'What you actually pay depends on limits, deductions and co-pay that differ at every hospital.'
  },
  {
    id: 'claim',
    title: 'Claim-related uncertainty',
    text: 'Missing documents and unnoticed policy conditions can complicate the claim later.'
  }
];

export const STAGES = [
  {
    id: 'policy',
    title: 'Understand your policy',
    text: 'Upload the PDF. Sum insured, room rent, co-pay, deductible, sub-limits and exclusions become clear rules you can check and edit.',
    preview: [
      ['Sum insured', '₹5,00,000'],
      ['Room rent', '₹5,000 / day'],
      ['Co-pay', '10%'],
      ['Excluded', 'Cosmetic, dental']
    ]
  },
  {
    id: 'hospitals',
    title: 'Discover suitable hospitals',
    text: 'Hospitals in your city are ranked by how well they fit your policy, with a filter for your insurer’s listed network.',
    preview: [
      ['Matched in city', '275 hospitals'],
      ['Network filter', 'Insurer listed'],
      ['Ranked by', 'Policy Fit Score'],
      ['Specialty', 'Orthopedics']
    ]
  },
  {
    id: 'costs',
    title: 'Estimate possible expenses',
    text: 'An itemised estimate of the bill and your likely share, after room-rent limits, deductions and co-pay.',
    preview: [
      ['Estimated bill', '₹3,44,000'],
      ['Insurer share', '₹2,01,600'],
      ['You may pay', '₹1,42,400'],
      ['Shown as', 'Low – high range']
    ]
  },
  {
    id: 'risks',
    title: 'Identify potential claim risks',
    text: 'Care-journey alerts flag room changes, pre-auth issues and deductions as they happen, with the policy rule behind each one.',
    preview: [
      ['Room upgrade', 'Deduction risk'],
      ['Pre-auth', 'Due 48h before'],
      ['Documents', '2 to keep'],
      ['Status', 'Preview']
    ]
  },
  {
    id: 'support',
    title: 'Find additional financial support',
    text: 'PM-JAY and ESI cover are understood alongside private insurance. A wider scheme finder is in development.',
    preview: [
      ['PM-JAY', 'Supported'],
      ['ESI', 'Supported'],
      ['State schemes', 'In development'],
      ['Status', 'Preview']
    ]
  }
];

export const DEMO_POLICY = {
  insurer: 'Demo Health Insurance Co.',
  product: 'Secure Family Health Plan',
  rows: [
    { label: 'Sum insured', value: '₹5,00,000', clause: 'Schedule, p.1' },
    { label: 'Room eligibility', value: 'Up to ₹5,000 / day', clause: 'Section 1, p.1' },
    { label: 'Co-payment', value: '10% network · 20% non-network', clause: 'Section 3, p.2' },
    { label: 'Deductible', value: '₹0', clause: 'Section 4, p.2' },
    { label: 'Waiting period', value: 'Pre-existing: 24 months', clause: 'Section 7, p.2' },
    { label: 'Knee replacement limit', value: '₹1,50,000 per knee', clause: 'Section 5, p.2' }
  ],
  clauseText:
    '“If the insured person stays in a room whose rent exceeds Rs. 5,000 per day, all associated medical expenses shall be reduced in the same proportion as the eligible room rent bears to the actual room rent.”',
  clauseRef: 'Section 2 · Proportionate Deduction · Page 2'
};

export const DEMO_HOSPITALS = [
  {
    name: 'Sample Multispeciality Hospital',
    area: 'Jayanagar, Bengaluru',
    specialty: 'Orthopedics',
    status: 'verified',
    statusLabel: 'Verified against available records',
    why: 'Insurer listed in hospital dataset · room rate within your limit'
  },
  {
    name: 'Sample City Care Hospital',
    area: 'Hebbal, Bengaluru',
    specialty: 'Orthopedics, General Surgery',
    status: 'listed',
    statusLabel: 'Listed in source',
    why: 'Matches specialty · private room exceeds limit, deduction likely'
  },
  {
    name: 'Sample Community Hospital',
    area: 'Rajajinagar, Bengaluru',
    specialty: 'General Surgery',
    status: 'confirm',
    statusLabel: 'Needs confirmation',
    why: 'Insurer not found in listing · confirm network before admission'
  }
];

export const DEMO_COST = {
  lines: [
    ['Procedure (knee replacement)', 270000],
    ['Doctor & specialist fees', 44500],
    ['Medicines & diagnostics', 19500],
    ['Room · general ward × 4 days', 10000]
  ],
  total: 344000,
  limitCut: 120000,
  copay: 22400,
  insurer: 201600,
  patient: 142400,
  unresolved: 'Implant cost may be billed separately; confirm with hospital.',
  explain: [
    'Procedure cost: benchmark for city tier, specialty and procedure.',
    'Doctor fees: 15% of procedure + ₹1,000/day × room multiplier.',
    'Medicines & diagnostics: 5% of procedure + ₹1,500/day.',
    'Knee replacement sub-limit ₹1,50,000 caps the procedure claim.',
    'Co-pay 10% applied to the admissible amount.',
    'Assumption: 4-day stay in general ward; no ICU.'
  ]
};

export const DEMO_RISKS = [
  {
    id: 'waiting',
    tone: 'amber',
    title: 'Potential waiting-period issue',
    text: 'Condition may be pre-existing; the policy has a 24-month waiting period.',
    evidence: 'Section 7, p.2: “Pre-existing diseases: 24 months.”',
    missing: 'Date of first diagnosis.',
    next: 'Keep earlier medical records ready; ask the insurer before admission.'
  },
  {
    id: 'docs',
    tone: 'amber',
    title: 'Missing document',
    text: 'Pre-authorisation is required 48 hours before a planned admission.',
    evidence: 'Section 8, p.2: “Pre-authorisation must be requested 48 hours before a planned admission.”',
    missing: 'Pre-auth request form and doctor’s note.',
    next: 'Ask the hospital insurance desk to file pre-auth early.'
  },
  {
    id: 'deduction',
    tone: 'amber',
    title: 'Potential financial deduction',
    text: 'A single private room above ₹5,000/day can reduce other admissible charges proportionately.',
    evidence: 'Section 2, p.2: Proportionate Deduction clause.',
    missing: 'Exact room tariff at chosen hospital.',
    next: 'Choose a room within the limit, or budget for the difference.'
  },
  {
    id: 'ok',
    tone: 'green',
    title: 'No major issue in other checks',
    text: 'Treatment is not in the exclusion list and the sum insured covers the estimate.',
    evidence: 'Section 6, p.2: Exclusions list.',
    missing: 'None identified.',
    next: 'Insurer makes the final decision; keep all bills and reports.'
  }
];

export const DEMO_SCHEMES = [
  {
    name: 'Ayushman Bharat PM-JAY',
    what: 'Central government health cover for eligible families.',
    why: 'May apply if the household is in the eligible list.',
    needs: 'Eligibility per official beneficiary list.',
    missing: 'Ration card / family ID',
    link: 'https://pmjay.gov.in',
    status: 'Check on official portal'
  },
  {
    name: 'State health scheme',
    what: 'Many states run their own hospital-cover schemes.',
    why: 'Depends on your state, income and treatment.',
    needs: 'State-specific criteria.',
    missing: 'State, income details',
    link: null,
    status: 'In development'
  }
];

export const STEPS = [
  { n: '01', title: 'Upload', text: 'Upload your health insurance policy and let NEXTCARE identify the important coverage terms.' },
  { n: '02', title: 'Understand', text: 'Review coverage, exclusions, waiting periods, the clauses behind them and anything still unclear.' },
  { n: '03', title: 'Explore', text: 'Compare hospitals, see network evidence, understand likely expenses and possible deductions.' },
  { n: '04', title: 'Take action', text: 'Follow the care journey from pre-auth to discharge, with a checklist of what to keep and when.' }
];

export const PRINCIPLES = [
  { title: 'Evidence where available', text: 'Extracted policy terms keep the source text they came from.' },
  { title: 'Uncertainty made visible', text: 'Every value is tagged as policy-derived, dataset, estimate or assumption.' },
  { title: 'Your data, your account', text: 'Policies are linked to your login; you can delete them from your profile.' },
  { title: 'Guidance, not guarantees', text: 'Rankings, estimates and alerts support decisions. They are not approvals.' }
];

export const FAQS = [
  {
    q: 'What does NEXTCARE do?',
    a: 'It reads your health insurance policy, ranks hospitals by how well they fit it, estimates the bill and your likely share, and guides you through the care journey. PM-JAY and ESI are supported.'
  },
  {
    q: 'Does NEXTCARE guarantee that a hospital will accept my insurance?',
    a: 'No. Network status comes from the insurer list in our hospital dataset, which may be out of date and depends on your exact plan and hospital branch. A listing does not guarantee cashless approval for a treatment. Always confirm with the insurer or hospital desk.'
  },
  {
    q: 'Can NEXTCARE tell me whether a claim will be approved?',
    a: 'No. It points out policy conditions, documents and deductions to watch for. The insurer makes the actual claim decision.'
  },
  {
    q: 'Does NEXTCARE confirm that I am eligible for a government scheme?',
    a: 'No. It can read PM-JAY and ESI cover you already have. Eligibility must be checked on the official scheme portal.'
  },
  {
    q: 'How is my policy analysed?',
    a: 'The PDF text is extracted and an AI model turns it into structured fields, keeping the source text for each. You review and confirm the fields. All costs and rankings are then calculated by fixed rules, not by the AI.'
  },
  {
    q: 'Can I use it before treatment?',
    a: 'Yes. That is the main purpose: understand your cover, compare hospitals and know your likely expense before you are admitted.'
  }
];
