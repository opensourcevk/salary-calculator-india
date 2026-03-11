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
  {
    key: 'nps',
    label: 'Employer NPS',
    helper:
      'Employer NPS contribution entered as a percentage of monthly basic salary. In this calculator, it is used as a tax deduction under section 80CCD(2).',
    inputType: 'percent'
  },
  { key: 'esi', label: 'ESI', helper: 'Employee State Insurance deduction when applicable.' },
  { key: 'insurance', label: 'Insurance Premium', helper: 'Mediclaim or employer-collected insurance premium.' },
  { key: 'gratuity', label: 'Gratuity', helper: 'Include only if it is actually deducted from the employee payout.' },
  { key: 'loanOrAdvance', label: 'Loan / Advance Recovery', helper: 'Salary advance or company loan recovery.' },
  { key: 'otherDeductions', label: 'Other Deductions', helper: 'Any custom deduction not listed above.' }
];

export const presets = {
  fresher: {
    annualCtc: 0,
    basicPercent: 40,
    pfCapped: false,
    hra: 0,
    conveyance: 0,
    medical: 0,
    lta: 0,
    bonus: 0,
    otherEarnings: 0,
    professionalTax: 200,
    nps: 0,
    esi: 0,
    insurance: 0,
    gratuity: 0,
    loanOrAdvance: 0,
    otherDeductions: 0
  },
  midLevel: {
    annualCtc: 0,
    basicPercent: 40,
    pfCapped: false,
    hra: 0,
    conveyance: 0,
    medical: 0,
    lta: 0,
    bonus: 0,
    otherEarnings: 0,
    professionalTax: 200,
    nps: 0,
    esi: 0,
    insurance: 0,
    gratuity: 0,
    loanOrAdvance: 0,
    otherDeductions: 0
  },
  senior: {
    annualCtc: 0,
    basicPercent: 40,
    pfCapped: false,
    hra: 0,
    conveyance: 0,
    medical: 0,
    lta: 0,
    bonus: 0,
    otherEarnings: 0,
    professionalTax: 200,
    nps: 0,
    esi: 0,
    insurance: 0,
    gratuity: 0,
    loanOrAdvance: 0,
    otherDeductions: 0
  }
};
