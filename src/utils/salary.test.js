import { describe, expect, it } from 'vitest';
import { calculateSalary } from './salary';

describe('calculateSalary', () => {
  it('returns monthly and annual in-hand salary totals', () => {
    const result = calculateSalary({
      earnings: {
        basic: 50000,
        hra: 25000,
        bonus: 5000
      },
      deductions: {
        employeePf: 1800,
        incomeTax: 7000,
        nps: 3000
      }
    });

    expect(result.monthlyGross).toBe(80000);
    expect(result.monthlyDeductions).toBe(11800);
    expect(result.monthlyInHand).toBe(68200);
    expect(result.annualInHand).toBe(818400);
  });

  it('does not return negative in-hand salary', () => {
    const result = calculateSalary({
      earnings: {
        basic: 10000
      },
      deductions: {
        incomeTax: 12000
      }
    });

    expect(result.monthlyInHand).toBe(0);
  });
});
