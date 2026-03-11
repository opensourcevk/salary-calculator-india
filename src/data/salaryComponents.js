export const earningFields = [
  { key: 'hra', label: 'House Rent Allowance', helper: 'Monthly HRA paid to the employee.' },
  { key: 'conveyance', label: 'Conveyance / Transport', helper: 'Travel or commute-related allowance.' },
  { key: 'medical', label: 'Medical Allowance', helper: 'Monthly medical support component.' },
  { key: 'lta', label: 'Leave Travel Allowance', helper: 'Average monthly value of LTA.' },
  { key: 'bonus', label: 'Performance Bonus', helper: 'Expected average monthly bonus or incentive.' },
  { key: 'otherEarnings', label: 'Other Earnings', helper: 'Any other recurring earning item.' }
];

export const deductionFields = [
  { key: 'professionalTax', label: 'Professional Tax', helper: 'Monthly state professional tax deducted from salary.' },
  { key: 'nps', label: 'Employee NPS', helper: 'Employee-side NPS contribution. This reduces take-home.' },
  { key: 'esi', label: 'ESI', helper: 'Employee State Insurance deduction when applicable.' },
  { key: 'insurance', label: 'Insurance Premium', helper: 'Mediclaim or employer-collected insurance premium.' },
  { key: 'gratuity', label: 'Gratuity', helper: 'Include only if it is actually deducted from the employee payout.' },
  { key: 'loanOrAdvance', label: 'Loan / Advance Recovery', helper: 'Salary advance or company loan recovery.' },
  { key: 'otherDeductions', label: 'Other Deductions', helper: 'Any custom deduction not listed above.' }
];

export const presets = {
  fresher: {
    annualCtc: 622200,
    basicPercent: 48,
    pfCapped: true,
    hra: 12500,
    conveyance: 1600,
    medical: 1250,
    lta: 0,
    bonus: 2500,
    otherEarnings: 0,
    professionalTax: 200,
    nps: 0,
    esi: 0,
    insurance: 500,
    gratuity: 0,
    loanOrAdvance: 0,
    otherDeductions: 0
  },
  midLevel: {
    annualCtc: 1416000,
    basicPercent: 42.5,
    pfCapped: true,
    hra: 25000,
    conveyance: 3000,
    medical: 2500,
    lta: 3500,
    bonus: 8000,
    otherEarnings: 4000,
    professionalTax: 200,
    nps: 4000,
    esi: 0,
    insurance: 1200,
    gratuity: 2500,
    loanOrAdvance: 0,
    otherDeductions: 0
  },
  senior: {
    annualCtc: 2640000,
    basicPercent: 41,
    pfCapped: true,
    hra: 45000,
    conveyance: 5000,
    medical: 5000,
    lta: 5000,
    bonus: 25000,
    otherEarnings: 15000,
    professionalTax: 200,
    nps: 10000,
    esi: 0,
    insurance: 2500,
    gratuity: 4500,
    loanOrAdvance: 0,
    otherDeductions: 0
  }
};
