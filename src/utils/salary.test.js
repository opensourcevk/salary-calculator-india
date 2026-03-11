import { describe, expect, it } from 'vitest';
import {
  calculateEmployeePf,
  calculateNewRegimeIncomeTax,
  calculateSalary
} from './salary';

describe('salary calculations', () => {
  it('returns zero new-regime tax when taxable income is within the rebate threshold', () => {
    const result = calculateNewRegimeIncomeTax(900000, 0);

    expect(result.taxableIncome).toBe(825000);
    expect(result.totalTax).toBe(0);
  });

  it('applies new-regime marginal relief and cess immediately above the rebate threshold', () => {
    const result = calculateNewRegimeIncomeTax(1276000, 0);

    expect(result.taxableIncome).toBe(1201000);
    expect(result.taxBeforeCess).toBe(1000);
    expect(result.cess).toBe(40);
    expect(result.totalTax).toBe(1040);
  });

  it('auto-calculates employee PF using the EPF wage ceiling by default', () => {
    expect(calculateEmployeePf(40000, true)).toBe(1800);
    expect(calculateEmployeePf(40000, false)).toBe(4800);
  });

  it('derives basic salary, special allowance and auto tax from annual ctc', () => {
    const result = calculateSalary({
      annualCtc: 1800000,
      basicPercent: 50,
      pfCapped: false,
      earnings: {
        hra: 20000,
        conveyance: 3000,
        medical: 2000,
        lta: 2000,
        bonus: 8000,
        otherEarnings: 4000
      },
      deductions: {
        professionalTax: 200,
        nps: 3000,
        esi: 0,
        insurance: 1000,
        gratuity: 0,
        loanOrAdvance: 0,
        otherDeductions: 500
      }
    });

    expect(result.earnings.basic).toBe(75000);
    expect(result.earnings.specialAllowance).toBe(36000);
    expect(result.deductions.employeePf).toBe(9000);
    expect(result.monthlyGross).toBe(150000);
    expect(result.monthlyIncomeTax).toBeCloseTo(12566.67, 2);
    expect(result.monthlyInHand).toBeCloseTo(123733.33, 2);
    expect(result.annualIncomeTax).toBe(150800);
  });
});
