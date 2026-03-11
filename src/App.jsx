import { useEffect, useState } from 'react';
import { Tooltip } from 'bootstrap';
import { deductionFields, earningFields, presets } from './data/salaryComponents';
import {
  calculateSalary,
  EMPLOYER_NPS_DEDUCTION_RATE_CAP,
  EPF_MONTHLY_WAGE_CEILING,
  EPF_RATE,
  formatCurrency,
  NEW_REGIME_STANDARD_DEDUCTION
} from './utils/salary';

const DEFAULT_PRESET_KEY = 'senior';

const createPresetState = (presetKey) => {
  const preset = presets[presetKey];

  return {
    annualCtc: preset.annualCtc,
    basicPercent: 40,
    pfCapped: false,
    earnings: Object.fromEntries(earningFields.map((field) => [field.key, preset[field.key] ?? 0])),
    deductions: Object.fromEntries(deductionFields.map((field) => [field.key, preset[field.key] ?? 0]))
  };
};

const CurrencyField = ({ label, helper, value, onChange }) => (
  <div className="col-12 col-md-6">
    <label className="card h-100 border-0 shadow-sm">
      <div className="card-body">
        <span
          className="fw-semibold d-inline-block"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={helper}
          tabIndex="0"
          role="button"
          aria-label={`${label} info`}
        >
          {label}
        </span>
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
      </div>
    </label>
  </div>
);

const PercentField = ({ label, helper, value, onChange }) => (
  <div className="col-12 col-md-6">
    <label className="card h-100 border-0 shadow-sm">
      <div className="card-body">
        <span
          className="fw-semibold d-inline-block"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={helper}
          tabIndex="0"
          role="button"
          aria-label={`${label} info`}
        >
          {label}
        </span>
        <div className="input-group mt-3">
          <input
            className="form-control"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={value}
            onChange={onChange}
          />
          <span className="input-group-text">% of basic</span>
        </div>
      </div>
    </label>
  </div>
);

const NumberField = ({ field, value, onChange }) => {
  if (field.inputType === 'percent') {
    return (
      <PercentField
        label={field.label}
        helper={field.helper}
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
    );
  }

  return (
    <CurrencyField
      label={field.label}
      helper={field.helper}
      value={value}
      onChange={(event) => onChange(field.key, event.target.value)}
    />
  );
};

const BreakdownItem = ({ label, value, emphasize = false }) => (
  <li
    className={
      emphasize
        ? 'list-group-item d-flex flex-column flex-sm-row justify-content-between gap-1 active'
        : 'list-group-item d-flex flex-column flex-sm-row justify-content-between gap-1'
    }
  >
    <span>{label}</span>
    <strong>{value}</strong>
  </li>
);

function App() {
  const [salaryState, setSalaryState] = useState(() => createPresetState(DEFAULT_PRESET_KEY));

  useEffect(() => {
    const tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltips = tooltipElements.map((element) => new Tooltip(element));

    return () => {
      tooltips.forEach((tooltip) => tooltip.dispose());
    };
  }, []);

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
  const otherDeductions = summary.monthlyManualDeductions - summary.deductions.employeePf;

  return (
    <main className="bg-body-tertiary min-vh-100 py-4">
      <div className="container-xl">
        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-lg-5">
            <div className="row g-4">
              <div className="col-12 col-lg-7">
                <div className="row g-3">
                  <CurrencyField
                    label="Annual CTC"
                    helper="Enter the yearly salary package to model. This calculator treats it as annual gross payable salary."
                    value={salaryState.annualCtc}
                    onChange={(event) => updateTopLevelValue('annualCtc', event.target.value)}
                  />

                  <div className="col-12 col-md-6">
                    <label className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <span
                          className="fw-semibold d-inline-block"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Percentage of annual CTC allocated to monthly basic salary."
                          tabIndex="0"
                          role="button"
                          aria-label="Basic salary percentage info"
                        >
                          Basic Salary %
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
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-check form-switch mt-4">
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

                <article className="card border-0 shadow-sm mt-4">
                  <div className="card-body p-4">
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                      <div>
                        <h3
                          className="h4 mb-0 d-inline-block"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Basic salary, special allowance and EPF are calculated from annual CTC and basic percentage."
                          tabIndex="0"
                          role="button"
                          aria-label="Auto-derived salary components info"
                        >
                          Auto-derived salary components
                        </h3>
                      </div>
                      <span className="badge text-bg-light align-self-start">
                        EPF rate: {EPF_RATE * 100}% of basic
                      </span>
                    </div>

                    {ctcOverAllocated ? (
                      <div className="alert alert-warning" role="alert">
                        Your manual earning components exceed the annual CTC target by{' '}
                        <strong>{formatCurrency(Math.abs(summary.ctcMismatchAnnual))}</strong>.
                      </div>
                    ) : null}

                    <div className="table-responsive">
                      <table className="table table-striped table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Component</th>
                            <th scope="col">Value</th>
                            <th scope="col">How it is derived</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">Monthly Basic Salary</th>
                            <td className="fw-semibold">{formatCurrency(summary.earnings.basic)}</td>
                            <td>{salaryState.basicPercent}% of annual CTC converted to monthly basic salary.</td>
                          </tr>
                          <tr>
                            <th scope="row">Monthly Special Allowance</th>
                            <td className="fw-semibold">
                              {formatCurrency(summary.earnings.specialAllowance)}
                            </td>
                            <td>
                              Auto-balanced against the remaining CTC after accounting for basic salary
                              and other monthly earnings.
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Monthly Employee PF</th>
                            <td className="fw-semibold">
                              {formatCurrency(summary.deductions.employeePf)}
                            </td>
                            <td>
                              {salaryState.pfCapped
                                ? `12% of monthly basic salary with the ${formatCurrency(EPF_MONTHLY_WAGE_CEILING)} EPF wage cap applied.`
                                : '12% of monthly basic salary without applying the EPF wage cap.'}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Monthly Employer PF</th>
                            <td className="fw-semibold">
                              {formatCurrency(summary.employerContributions.employerPf)}
                            </td>
                            <td>
                              {salaryState.pfCapped
                                ? `Employer-side EPF at 12% of monthly basic salary with the ${formatCurrency(EPF_MONTHLY_WAGE_CEILING)} EPF wage cap applied.`
                                : 'Employer-side EPF at 12% of monthly basic salary without applying the EPF wage cap.'}
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Target Annual CTC</th>
                            <td className="fw-semibold">{formatCurrency(summary.targetAnnualGross)}</td>
                            <td>This is the top-level annual CTC input used to derive monthly salary values.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
              </div>

              <div className="col-12 col-lg-5">
                <div className="card border border-primary-subtle bg-light-subtle text-dark shadow-sm h-100">
                  <div className="card-body p-4">
                    <p className="text-uppercase small mb-2 text-body-secondary">Monthly In-Hand Salary</p>
                    <h2 className="display-5 fw-bold">{formatCurrency(summary.monthlyInHand)}</h2>
                    <ul className="list-group list-group-flush mt-4">
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-dark px-0">
                        <span>Target Monthly CTC</span>
                        <strong>{formatCurrency(summary.targetMonthlyGross)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-dark px-0">
                        <span>Auto Basic Salary</span>
                        <strong>{formatCurrency(summary.earnings.basic)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-dark px-0">
                        <span>Employer PF Contribution</span>
                        <strong>{formatCurrency(summary.employerContributions.employerPf)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-dark px-0">
                        <span>Employer NPS Contribution</span>
                        <strong>{formatCurrency(summary.employerContributions.employerNps)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-danger px-0">
                        <span>Professional Tax</span>
                        <strong>{formatCurrency(summary.deductions.professionalTax)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-danger px-0">
                        <span>Auto Employee PF</span>
                        <strong>{formatCurrency(summary.deductions.employeePf)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-danger px-0">
                        <span>Auto Monthly Income Tax</span>
                        <strong>{formatCurrency(summary.monthlyIncomeTax)}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent text-dark px-0">
                        <span>Annual Take-Home</span>
                        <strong>{formatCurrency(summary.annualInHand)}</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-uppercase text-body-secondary small">Monthly Gross</div>
                <div className="fs-4 fw-semibold mt-2">{formatCurrency(summary.monthlyGross)}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-uppercase text-body-secondary small">Monthly Deductions</div>
                <div className="fs-4 fw-semibold mt-2">{formatCurrency(summary.monthlyDeductions)}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-uppercase text-body-secondary small">Taxable Income</div>
                <div className="fs-4 fw-semibold mt-2">{formatCurrency(taxBreakdown.taxableIncome)}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-uppercase text-body-secondary small">Annual Income Tax</div>
                <div className="fs-4 fw-semibold mt-2">{formatCurrency(summary.annualIncomeTax)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-4">
          <div className="col-12 col-xl-7">
            <article className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                  <div>
                    <h3 className="h4 mb-2">Monthly earnings you can adjust</h3>
                    <p className="text-body-secondary mb-0">
                      Add recurring salary components. The remaining amount is pushed into special
                      allowance automatically.
                    </p>
                  </div>
                  <span className="badge text-bg-light align-self-start">
                    Manual earnings: {formatCurrency(summary.manualEarningTotal)}
                  </span>
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
              </div>
            </article>

            <article className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                  <div>
                    <h3 className="h4 mb-2">Monthly deductions</h3>
                    <p className="text-body-secondary mb-0">
                      Enter payroll deductions. Employee PF and income tax are calculated
                      automatically. Employer NPS is entered as a percentage of basic for tax
                      deduction under section 80CCD(2).
                    </p>
                  </div>
                  <span className="badge text-bg-light align-self-start">
                    Other deductions: {formatCurrency(otherDeductions)}
                  </span>
                </div>
                <div className="alert alert-info" role="note">
                  Employee PF is auto-derived from basic salary. Employer NPS is treated as an
                  employer-side contribution and reduces taxable income under the new regime in this
                  calculator, capped at {(EMPLOYER_NPS_DEDUCTION_RATE_CAP * 100).toFixed(0)}% of
                  basic.
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
              </div>
            </article>
          </div>

          <div className="col-12 col-xl-5">
            <article className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h3
                      className="h4 mb-0 d-inline-block"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="New regime for salaried employees with standard deduction and 4% cess."
                      tabIndex="0"
                      role="button"
                      aria-label="Auto income tax breakdown info"
                    >
                      Auto income tax breakdown
                    </h3>
                  </div>
                  <span className="badge text-bg-light">Auto</span>
                </div>

                <ul className="list-group">
                  <BreakdownItem label="Annual Gross Salary" value={formatCurrency(summary.annualGross)} />
                  <BreakdownItem
                    label="Standard Deduction"
                    value={formatCurrency(NEW_REGIME_STANDARD_DEDUCTION)}
                  />
                  <BreakdownItem
                    label="Annual Professional Tax (cash deduction only)"
                    value={formatCurrency(taxBreakdown.annualProfessionalTax)}
                  />
                  <BreakdownItem
                    label="Annual Employer NPS Deduction"
                    value={formatCurrency(taxBreakdown.annualEmployerNpsDeduction)}
                  />
                  <BreakdownItem label="Taxable Income" value={formatCurrency(taxBreakdown.taxableIncome)} />
                  <BreakdownItem label="Slab Tax" value={formatCurrency(taxBreakdown.slabTax)} />
                  <BreakdownItem label="Rebate / Relief" value={formatCurrency(taxBreakdown.rebate)} />
                  <BreakdownItem label="Surcharge" value={formatCurrency(taxBreakdown.surcharge)} />
                  <BreakdownItem
                    label="Health & Education Cess"
                    value={formatCurrency(taxBreakdown.cess)}
                  />
                  <BreakdownItem
                    label="Annual Income Tax"
                    value={formatCurrency(summary.annualIncomeTax)}
                    emphasize
                  />
                  <BreakdownItem
                    label="Monthly TDS Impact"
                    value={formatCurrency(summary.monthlyIncomeTax)}
                    emphasize
                  />
                </ul>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
