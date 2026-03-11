export const parseCurrency = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

export const sumFields = (values, fields) =>
  fields.reduce((total, field) => total + parseCurrency(values[field.key]), 0);

export const calculateSalary = ({ earnings, deductions }) => {
  const monthlyGross = sumFields(earnings, Object.keys(earnings).map((key) => ({ key })));
  const monthlyDeductions = sumFields(deductions, Object.keys(deductions).map((key) => ({ key })));
  const monthlyInHand = Math.max(monthlyGross - monthlyDeductions, 0);

  return {
    monthlyGross,
    monthlyDeductions,
    monthlyInHand,
    annualGross: monthlyGross * 12,
    annualDeductions: monthlyDeductions * 12,
    annualInHand: monthlyInHand * 12
  };
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
