import { useState } from 'react';
import { deductionFields, earningFields, presets } from './data/salaryComponents';
import {
  calculateSalary,
  EPF_MONTHLY_WAGE_CEILING,
  EPF_RATE,
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
    annualCtc: preset.annualCtc,
    basicPercent: preset.basicPercent,
    pfCapped: preset.pfCapped,
    earnings: Object.fromEntries(earningFields.map((field) => [field.key, preset[field.key] ?? 0])),
    deductions: Object.fromEntries(deductionFields.map((field) => [field.key, preset[field.key] ?? 0]))
  };
};

const CurrencyField = ({ label, helper, value, onChange }) => (
  <div className="col-12 col-md-6">
    <label className="field-tile h-100">
      <span className="field-title">{label}</span>
      <span className="field-help">{helper}</span>
      <div className="input-group mt-3">
        <span className="input-group-text">INR</span>
        <input
          className="form-control"
          type="number"
          min="0"
          step="100"
          value={value}
          onChange={onChange}
        />
      </div>
    </label>
  </div>
);

const NumberField = ({ field, value, onChange }) => (
  <CurrencyField
    label={field.label}
    helper={field.helper}
    value={value}
    onChange={(event) => onChange(field.key, event.target.value)}
  />
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

  const updateTopLevelValue = (key, value) => {
    setSalaryState((current) => ({
      ...current,
      [key]: value
    }));
  };

  const summary = calculateSalary(salaryState);
  const { taxBreakdown } = summary;
  const ctcOverAllocated = summary.ctcMismatchMonthly < 0;

  return (
    <main className="salary-app py-3 py-lg-4">
      <div className="container-xl">
        <section className="hero-panel mb-4 mb-lg-5">
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-7">
              <div className="hero-copy h-100">

                <p className="lead text-secondary mt-3">
                  Start with annual CTC, pick the basic percentage, and the calculator will derive
                  monthly basic pay, employee PF, new-regime income tax, and final in-hand salary.
                </p>


                <div className="row g-3 mt-1">
                  <CurrencyField
                    label="Annual CTC"
                    helper="Enter the full yearly salary package amount you want to model. This calculator treats it as annual gross payable salary."
                    value={salaryState.annualCtc}
                    onChange={(event) => updateTopLevelValue('annualCtc', event.target.value)}
                  />

                  <div className="col-12 col-md-6">
                    <label className="field-tile h-100">
                      <span className="field-title">Basic Salary %</span>
                      <span className="field-help">
                        Percentage of annual CTC allocated to monthly basic salary.
                      </span>
                      <div className="input-group mt-3">
                        <input
                          className="form-control"
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={salaryState.basicPercent}
                          onChange={(event) => updateTopLevelValue('basicPercent', event.target.value)}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-check form-switch mt-4 salary-switch">
                  <input
                    id="pf-cap-toggle"
                    className="form-check-input"
                    type="checkbox"
                    checked={salaryState.pfCapped}
                    onChange={(event) => updateTopLevelValue('pfCapped', event.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="pf-cap-toggle">
                    Apply EPF wage ceiling of {formatCurrency(EPF_MONTHLY_WAGE_CEILING)} per month
                  </label>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <aside className="summary-card sticky-lg-top" aria-label="Salary summary">
                <p className="summary-kicker">Monthly In-Hand Salary</p>
                <h2>{formatCurrency(summary.monthlyInHand)}</h2>
                <div className="summary-stat-list">
                  <div className="summary-stat">
                    <span>Target Monthly CTC</span>
                    <strong>{formatCurrency(summary.targetMonthlyGross)}</strong>
                  </div>
                  <div className="summary-stat">
                    <span>Auto Basic Salary</span>
                    <strong>{formatCurrency(summary.earnings.basic)}</strong>
                  </div>
                  <div className="summary-stat">
                    <span>Auto Employee PF</span>
                    <strong>{formatCurrency(summary.deductions.employeePf)}</strong>
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
                  <h3 className="h4 mb-2">Monthly earnings you can adjust</h3>
                  <p className="text-secondary mb-0">
                    Add recurring salary components. The remaining amount is pushed into special
                    allowance automatically.
                  </p>
                </div>
                <div className="badge-panel">
                  Manual earnings: <strong>{formatCurrency(summary.manualEarningTotal)}</strong>
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
                    Enter payroll deductions other than employee PF and income tax. Both are
                    calculated automatically.
                  </p>
                </div>
                <div className="badge-panel">
                  Other deductions: <strong>{formatCurrency(summary.monthlyManualDeductions - summary.deductions.employeePf)}</strong>
                </div>
              </div>
              <div className="alert alert-info border-0 deduction-note" role="note">
                Employee PF is auto-derived from basic salary. New-regime income tax is also
                calculated automatically and included in in-hand salary.
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


          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
