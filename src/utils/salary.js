export const NEW_REGIME_STANDARD_DEDUCTION = 75000;
export const NEW_REGIME_REBATE_THRESHOLD = 1200000;
export const HEALTH_AND_EDUCATION_CESS_RATE = 0.04;
export const EPF_RATE = 0.12;
export const EPF_MONTHLY_WAGE_CEILING = 15000;

export const NEW_REGIME_SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.1 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.2 },
  { upto: 2400000, rate: 0.25 },
  { upto: Number.POSITIVE_INFINITY, rate: 0.3 }
];

const SURCHARGE_BRACKETS = [
  { threshold: 5000000, rate: 0.1 },
  { threshold: 10000000, rate: 0.15 },
  { threshold: 20000000, rate: 0.25 },
  { threshold: 50000000, rate: 0.25 }
];

export const parseCurrency = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

export const parsePercent = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return amount > 100 ? 100 : amount;
};

export const roundCurrency = (value) => Math.round(value);

export const sumFields = (values, fields) =>
  fields.reduce((total, field) => total + parseCurrency(values[field.key]), 0);

export const calculateEmployeePf = (basicMonthly, pfCapped = true) => {
  const monthlyBasic = parseCurrency(basicMonthly);
  const pfWage = pfCapped ? Math.min(monthlyBasic, EPF_MONTHLY_WAGE_CEILING) : monthlyBasic;

  return roundCurrency(pfWage * EPF_RATE);
};

export const calculateSlabTax = (taxableIncome) => {
  let previousLimit = 0;

  return NEW_REGIME_SLABS.reduce((total, slab) => {
    if (taxableIncome <= previousLimit) {
      return total;
    }

    const taxableSlice = Math.min(taxableIncome, slab.upto) - previousLimit;
    previousLimit = slab.upto;

    return total + taxableSlice * slab.rate;
  }, 0);
};

const getSurchargeBracket = (taxableIncome) =>
  [...SURCHARGE_BRACKETS].reverse().find((bracket) => taxableIncome > bracket.threshold);

export const calculateTaxAfterRebate = (taxableIncome, slabTax) => {
  if (taxableIncome <= NEW_REGIME_REBATE_THRESHOLD) {
    return 0;
  }

  const incomeAboveThreshold = taxableIncome - NEW_REGIME_REBATE_THRESHOLD;
  return slabTax > incomeAboveThreshold ? incomeAboveThreshold : slabTax;
};

export const calculateTaxBeforeCess = (taxableIncome) => {
  const slabTax = calculateSlabTax(taxableIncome);
  const taxAfterRebate = calculateTaxAfterRebate(taxableIncome, slabTax);
  const surchargeBracket = getSurchargeBracket(taxableIncome);

  if (!surchargeBracket) {
    return taxAfterRebate;
  }

  const taxAtThreshold = calculateTaxBeforeCess(surchargeBracket.threshold);
  const surchargeAppliedTax = taxAfterRebate * (1 + surchargeBracket.rate);
  const marginalReliefCap = taxAtThreshold + (taxableIncome - surchargeBracket.threshold);

  return Math.min(surchargeAppliedTax, marginalReliefCap);
};

export const calculateNewRegimeIncomeTax = (annualGross, annualProfessionalTax = 0) => {
  const grossSalary = parseCurrency(annualGross);
  const professionalTax = parseCurrency(annualProfessionalTax);
  const taxableIncome = Math.max(grossSalary - NEW_REGIME_STANDARD_DEDUCTION, 0);
  const slabTax = calculateSlabTax(taxableIncome);
  const taxAfterRebate = calculateTaxAfterRebate(taxableIncome, slabTax);
  const taxBeforeCess = calculateTaxBeforeCess(taxableIncome);
  const surcharge = taxBeforeCess - taxAfterRebate;
  const cess = taxBeforeCess * HEALTH_AND_EDUCATION_CESS_RATE;
  const totalTax = roundCurrency(taxBeforeCess + cess);
  const rebate = slabTax - taxAfterRebate;

  return {
    annualGross: grossSalary,
    annualProfessionalTax: professionalTax,
    standardDeduction: NEW_REGIME_STANDARD_DEDUCTION,
    taxableIncome,
    slabTax: roundCurrency(slabTax),
    rebate: roundCurrency(rebate),
    surcharge: roundCurrency(surcharge),
    cess: roundCurrency(cess),
    taxBeforeCess: roundCurrency(taxBeforeCess),
    totalTax,
    monthlyTax: totalTax / 12
  };
};

export const calculateSalary = ({ annualCtc, basicPercent, pfCapped, earnings, deductions }) => {
  const targetAnnualGross = parseCurrency(annualCtc);
  const targetMonthlyGross = targetAnnualGross / 12;
  const resolvedBasicPercent = parsePercent(basicPercent);
  const basicMonthly = targetMonthlyGross * (resolvedBasicPercent / 100);
  const manualEarningTotal = sumFields(earnings, Object.keys(earnings).map((key) => ({ key })));
  const remainingForSpecial = targetMonthlyGross - basicMonthly - manualEarningTotal;
  const specialAllowance = remainingForSpecial > 0 ? remainingForSpecial : 0;
  const monthlyGross = basicMonthly + manualEarningTotal + specialAllowance;
  const ctcMismatchMonthly = targetMonthlyGross - monthlyGross;
  const monthlyEmployeePf = calculateEmployeePf(basicMonthly, pfCapped);
  const otherManualDeductions = sumFields(
    deductions,
    Object.keys(deductions).map((key) => ({ key }))
  );
  const monthlyManualDeductions = monthlyEmployeePf + otherManualDeductions;
  const annualProfessionalTax = parseCurrency(deductions.professionalTax) * 12;
  const taxBreakdown = calculateNewRegimeIncomeTax(monthlyGross * 12, annualProfessionalTax);
  const monthlyIncomeTax = taxBreakdown.monthlyTax;
  const monthlyDeductions = monthlyManualDeductions + monthlyIncomeTax;
  const monthlyInHand = Math.max(monthlyGross - monthlyDeductions, 0);

  return {
    targetAnnualGross,
    targetMonthlyGross,
    basicPercent: resolvedBasicPercent,
    pfCapped: Boolean(pfCapped),
    earnings: {
      ...earnings,
      basic: basicMonthly,
      specialAllowance
    },
    deductions: {
      ...deductions,
      employeePf: monthlyEmployeePf
    },
    manualEarningTotal,
    monthlyGross,
    monthlyManualDeductions,
    monthlyIncomeTax,
    monthlyDeductions,
    monthlyInHand,
    annualGross: monthlyGross * 12,
    annualManualDeductions: monthlyManualDeductions * 12,
    annualDeductions: monthlyDeductions * 12,
    annualIncomeTax: taxBreakdown.totalTax,
    annualInHand: monthlyInHand * 12,
    ctcMismatchMonthly,
    ctcMismatchAnnual: ctcMismatchMonthly * 12,
    taxBreakdown
  };
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
