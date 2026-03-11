import { useState } from 'react';
import { deductionFields, earningFields, presets } from './data/salaryComponents';
import { calculateSalary, formatCurrency } from './utils/salary';

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
  <label className="field-card">
    <span className="field-header">
      <span>{field.label}</span>
      <small>{field.helper}</small>
    </span>
    <div className="input-shell">
      <span className="currency-mark">INR</span>
      <input
        type="number"
        min="0"
        step="100"
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
    </div>
  </label>
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

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">India Salary Planning</p>
          <h1>In-hand salary calculator for Indian employees</h1>
          <p className="hero-text">
            Estimate monthly take-home salary using realistic Indian payroll components including PF,
            professional tax, NPS, insurance, gratuity, bonus and custom deductions.
          </p>
          <div className="hero-actions">
            {presetOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={option.key === presetKey ? 'preset-button active' : 'preset-button'}
                onClick={() => handlePresetChange(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="summary-card" aria-label="Salary summary">
          <p className="summary-label">Monthly In-Hand Salary</p>
          <h2>{formatCurrency(summary.monthlyInHand)}</h2>
          <dl className="summary-list">
            <div>
              <dt>Monthly Gross</dt>
              <dd>{formatCurrency(summary.monthlyGross)}</dd>
            </div>
            <div>
              <dt>Total Deductions</dt>
              <dd>{formatCurrency(summary.monthlyDeductions)}</dd>
            </div>
            <div>
              <dt>Annual Take-Home</dt>
              <dd>{formatCurrency(summary.annualInHand)}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <h3>Earnings</h3>
            <p>Set the monthly earning components that make up the employee salary structure.</p>
          </div>
          <div className="field-grid">
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

        <article className="panel">
          <div className="panel-heading">
            <h3>Deductions</h3>
            <p>Add employer or employee-side deductions to reflect the actual take-home amount.</p>
          </div>
          <div className="field-grid">
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
      </section>

      <section className="insights-grid">
        <article className="insight-card">
          <h3>Annual salary snapshot</h3>
          <p>Annual Gross: {formatCurrency(summary.annualGross)}</p>
          <p>Annual Deductions: {formatCurrency(summary.annualDeductions)}</p>
          <p>Net Annual In-Hand: {formatCurrency(summary.annualInHand)}</p>
        </article>

        <article className="insight-card">
          <h3>What this calculator covers</h3>
          <ul>
            <li>CTC-like salary breakup with recurring monthly components</li>
            <li>NPS, PF, tax, gratuity, insurance and custom payroll deductions</li>
            <li>Preset salary structures for quick estimation and comparison</li>
          </ul>
        </article>

        <article className="insight-card">
          <h3>Search visibility foundation</h3>
          <ul>
            <li>Semantic heading structure and meaningful page copy</li>
            <li>Indexing metadata, canonical URL, robots.txt and sitemap.xml</li>
            <li>Static GitHub Pages deployment for fast crawlable delivery</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
