import { useState } from 'react';
import { deductionFields, earningFields, presets } from './data/salaryComponents';
import {
  calculateSalary,
  formatCurrency,
  NEW_REGIME_REBATE_THRESHOLD,
  NEW_REGIME_STANDARD_DEDUCTION
} from './utils/salary';

const presetOptions = [
  { key: 'fresher', label: 'Fresher Profile' },
  { key: 'midLevel', label: 'Mid-Level Employee' },
  { key: 'senior', label: 'Senior / Leadership' }
];

const createPresetState = (presetKey) => {
  const preset = presets[presetKey];

  return {
    earnings: Object.fromEntries(earningFields.map((field) => [field.key, preset[field.key] ?? 0])),
    deductions: Object.fromEntries(deductionFields.map((field) => [field.key, preset[field.key] ?? 0]))
  };
};

const NumberField = ({ field, value, onChange }) => (
  <div className="col-12 col-md-6">
    <label className="field-tile h-100">
      <span className="field-title">{field.label}</span>
      <span className="field-help">{field.helper}</span>
      <div className="input-group mt-3">
        <span className="input-group-text">INR</span>
        <input
          className="form-control"
          type="number"
          min="0"
          step="100"
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      </div>
    </label>
  </div>
);

function App() {
  const [presetKey, setPresetKey] = useState('midLevel');
  const [salaryState, setSalaryState] = useState(() => createPresetState('midLevel'));

  const handlePresetChange = (nextPreset) => {
    setPresetKey(nextPreset);
    setSalaryState(createPresetState(nextPreset));
  };

  const updateGroupValue = (group) => (key, value) => {
    setSalaryState((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: value
      }
    }));
  };

  const summary = calculateSalary(salaryState);
  const { taxBreakdown } = summary;

  return (
    <main className="salary-app py-3 py-lg-4">
      <div className="container-xl">
        <section className="hero-panel mb-4 mb-lg-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-7">
              <div className="hero-copy h-100">
                <span className="eyebrow-chip">FY 2025-26 | AY 2026-27</span>
                <h1 className="display-4 fw-bold text-navy mt-3">
                  In-hand salary calculator for Indian employees
                </h1>
                <p className="lead text-secondary mt-3">
                  Enter monthly salary components and deductions. The calculator automatically
                  computes income tax under India&apos;s new regime, then adds that TDS into the
                  final in-hand salary.
                </p>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {presetOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={
                        option.key === presetKey
                          ? 'btn btn-primary rounded-pill px-4 py-2'
                          : 'btn btn-outline-primary rounded-pill px-4 py-2'
                      }
                      onClick={() => handlePresetChange(option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <aside className="summary-card sticky-lg-top" aria-label="Salary summary">
                <p className="summary-kicker">Monthly In-Hand Salary</p>
                <h2>{formatCurrency(summary.monthlyInHand)}</h2>
                <div className="summary-stat-list">
                  <div className="summary-stat">
                    <span>Monthly Gross</span>
                    <strong>{formatCurrency(summary.monthlyGross)}</strong>
                  </div>
                  <div className="summary-stat">
                    <span>Other Deductions</span>
                    <strong>{formatCurrency(summary.monthlyManualDeductions)}</strong>
                  </div>
                  <div className="summary-stat">
                    <span>Auto Monthly Income Tax</span>
                    <strong>{formatCurrency(summary.monthlyIncomeTax)}</strong>
                  </div>
                  <div className="summary-stat">
                    <span>Annual Take-Home</span>
                    <strong>{formatCurrency(summary.annualInHand)}</strong>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="row g-3 g-lg-4 mb-4 mb-lg-5">
          <div className="col-6 col-lg-3">
            <div className="metric-card">
              <span className="metric-label">Monthly Gross</span>
              <strong>{formatCurrency(summary.monthlyGross)}</strong>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="metric-card">
              <span className="metric-label">Monthly Deductions</span>
              <strong>{formatCurrency(summary.monthlyDeductions)}</strong>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="metric-card">
              <span className="metric-label">Taxable Income</span>
              <strong>{formatCurrency(taxBreakdown.taxableIncome)}</strong>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="metric-card">
              <span className="metric-label">Annual Income Tax</span>
              <strong>{formatCurrency(summary.annualIncomeTax)}</strong>
            </div>
          </div>
        </section>

        <section className="row g-4">
          <div className="col-12 col-xl-7">
            <article className="panel-card mb-4">
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                <div>
                  <h3 className="h4 mb-2">Monthly earnings</h3>
                  <p className="text-secondary mb-0">
                    Add the recurring salary components paid to the employee every month.
                  </p>
                </div>
                <div className="badge-panel">
                  Gross annual salary: <strong>{formatCurrency(summary.annualGross)}</strong>
                </div>
              </div>
              <div className="row g-3">
                {earningFields.map((field) => (
                  <NumberField
                    key={field.key}
                    field={field}
                    value={salaryState.earnings[field.key]}
                    onChange={updateGroupValue('earnings')}
                  />
                ))}
              </div>
            </article>

            <article className="panel-card">
              <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                <div>
                  <h3 className="h4 mb-2">Monthly deductions</h3>
                  <p className="text-secondary mb-0">
                    Enter payroll deductions other than income tax. Income tax is calculated
                    automatically below.
                  </p>
                </div>
                <div className="badge-panel">
                  Non-tax deductions: <strong>{formatCurrency(summary.monthlyManualDeductions)}</strong>
                </div>
              </div>
              <div className="alert alert-info border-0 deduction-note" role="note">
                New-regime tax is auto-calculated. Update salary and deduction inputs, and the
                monthly TDS will refresh instantly.
              </div>
              <div className="row g-3">
                {deductionFields.map((field) => (
                  <NumberField
                    key={field.key}
                    field={field}
                    value={salaryState.deductions[field.key]}
                    onChange={updateGroupValue('deductions')}
                  />
                ))}
              </div>
            </article>
          </div>

          <div className="col-12 col-xl-5">
            <article className="panel-card tax-card mb-4">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h3 className="h4 mb-2">Auto income tax breakdown</h3>
                  <p className="text-secondary mb-0">
                    New regime for salaried employees with standard deduction and 4% cess.
                  </p>
                </div>
                <span className="badge rounded-pill text-bg-light">Auto</span>
              </div>

              <div className="tax-grid">
                <div>
                  <span>Annual Gross Salary</span>
                  <strong>{formatCurrency(summary.annualGross)}</strong>
                </div>
                <div>
                  <span>Standard Deduction</span>
                  <strong>{formatCurrency(NEW_REGIME_STANDARD_DEDUCTION)}</strong>
                </div>
                <div>
                  <span>Annual Professional Tax (cash deduction only)</span>
                  <strong>{formatCurrency(taxBreakdown.annualProfessionalTax)}</strong>
                </div>
                <div>
                  <span>Taxable Income</span>
                  <strong>{formatCurrency(taxBreakdown.taxableIncome)}</strong>
                </div>
                <div>
                  <span>Slab Tax</span>
                  <strong>{formatCurrency(taxBreakdown.slabTax)}</strong>
                </div>
                <div>
                  <span>Rebate / Relief</span>
                  <strong>{formatCurrency(taxBreakdown.rebate)}</strong>
                </div>
                <div>
                  <span>Surcharge</span>
                  <strong>{formatCurrency(taxBreakdown.surcharge)}</strong>
                </div>
                <div>
                  <span>Health &amp; Education Cess</span>
                  <strong>{formatCurrency(taxBreakdown.cess)}</strong>
                </div>
                <div className="tax-grid-accent">
                  <span>Annual Income Tax</span>
                  <strong>{formatCurrency(summary.annualIncomeTax)}</strong>
                </div>
                <div className="tax-grid-accent">
                  <span>Monthly TDS Impact</span>
                  <strong>{formatCurrency(summary.monthlyIncomeTax)}</strong>
                </div>
              </div>
            </article>

            <article className="panel-card">
              <h3 className="h4 mb-3">Assumptions used</h3>
              <ul className="friendly-list mb-0">
                <li>
                  Uses India&apos;s new regime slab structure with rebate threshold of{' '}
                  {formatCurrency(NEW_REGIME_REBATE_THRESHOLD)}.
                </li>
                <li>Includes salaried standard deduction and 4% health and education cess.</li>
                <li>Professional tax reduces take-home, but it is not deducted from taxable income in this new-regime model.</li>
                <li>Employee PF and employee NPS reduce take-home, but no extra tax benefit is applied to them here.</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
