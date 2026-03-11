export const earningFields = [
  { key: 'basic', label: 'Basic Salary', helper: 'Fixed pay used as the core of the salary structure.' },
  { key: 'hra', label: 'House Rent Allowance', helper: 'Monthly HRA paid to the employee.' },
  { key: 'specialAllowance', label: 'Special Allowance', helper: 'Flexible allowance added to monthly salary.' },
  { key: 'conveyance', label: 'Conveyance / Transport', helper: 'Travel or commute-related allowance.' },
  { key: 'medical', label: 'Medical Allowance', helper: 'Monthly medical support component.' },
  { key: 'lta', label: 'Leave Travel Allowance', helper: 'Average monthly value of LTA.' },
  { key: 'bonus', label: 'Performance Bonus', helper: 'Expected average monthly bonus or incentive.' },
  { key: 'otherEarnings', label: 'Other Earnings', helper: 'Any other recurring earning item.' }
];

export const deductionFields = [
  { key: 'employeePf', label: 'Employee PF', helper: 'Provident Fund contribution deducted from salary.' },
  { key: 'professionalTax', label: 'Professional Tax', helper: 'Monthly state professional tax deducted from salary. It reduces take-home but is not deducted from taxable income here.' },
  { key: 'nps', label: 'Employee NPS', helper: 'Employee-side NPS contribution. This reduces take-home but is not treated as a tax deduction here.' },
  { key: 'esi', label: 'ESI', helper: 'Employee State Insurance deduction when applicable.' },
  { key: 'insurance', label: 'Insurance Premium', helper: 'Mediclaim or employer-collected insurance premium.' },
  { key: 'gratuity', label: 'Gratuity', helper: 'Include only if it is actually deducted from the employee payout.' },
  { key: 'loanOrAdvance', label: 'Loan / Advance Recovery', helper: 'Salary advance or company loan recovery.' },
  { key: 'otherDeductions', label: 'Other Deductions', helper: 'Any custom deduction not listed above.' }
];

export const presets = {
  fresher: {
    basic: 25000,
    hra: 12500,
    specialAllowance: 9000,
    conveyance: 1600,
    medical: 1250,
    lta: 0,
    bonus: 2500,
    otherEarnings: 0,
    employeePf: 1800,
    professionalTax: 200,
    nps: 0,
    esi: 0,
    insurance: 500,
    gratuity: 0,
    loanOrAdvance: 0,
    otherDeductions: 0
  },
  midLevel: {
    basic: 50000,
    hra: 25000,
    specialAllowance: 22000,
    conveyance: 3000,
    medical: 2500,
    lta: 3500,
    bonus: 8000,
    otherEarnings: 4000,
    employeePf: 1800,
    professionalTax: 200,
    nps: 4000,
    esi: 0,
    insurance: 1200,
    gratuity: 2500,
    loanOrAdvance: 0,
    otherDeductions: 0
  },
  senior: {
    basic: 90000,
    hra: 45000,
    specialAllowance: 30000,
    conveyance: 5000,
    medical: 5000,
    lta: 5000,
    bonus: 25000,
    otherEarnings: 15000,
    employeePf: 1800,
    professionalTax: 200,
    nps: 10000,
    esi: 0,
    insurance: 2500,
    gratuity: 4500,
    loanOrAdvance: 0,
    otherDeductions: 0
  }
};
