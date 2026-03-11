import { describe, expect, it } from 'vitest';
import { calculateNewRegimeIncomeTax, calculateSalary } from './salary';

describe('calculateSalary', () => {
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

  it('includes auto-calculated income tax in monthly and annual in-hand salary totals', () => {
    const result = calculateSalary({
      earnings: {
        basic: 90000,
        hra: 35000,
        bonus: 25000
      },
      deductions: {
        employeePf: 1800,
        professionalTax: 200,
        nps: 3000
      }
    });

    expect(result.monthlyGross).toBe(150000);
    expect(result.monthlyIncomeTax).toBeCloseTo(12566.67, 2);
    expect(result.monthlyDeductions).toBeCloseTo(17566.67, 2);
    expect(result.monthlyInHand).toBeCloseTo(132433.33, 2);
    expect(result.annualIncomeTax).toBe(150800);
  });

  it('does not return negative in-hand salary', () => {
    const result = calculateSalary({
      earnings: {
        basic: 10000
      },
      deductions: {
        otherDeductions: 12000
      }
    });

    expect(result.monthlyInHand).toBe(0);
  });
});
