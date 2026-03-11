# In-Hand Salary Calculator India

React application for estimating monthly and annual in-hand salary for Indian employees.

## Features

- Configure salary earnings such as HRA, bonus, LTA and other monthly allowances
- Default basic salary is `40%` of annual CTC
- EPF wage ceiling toggle defaults to `off`
- Default professional tax is `200` per month
- Auto-calculate employee EPF and show employer EPF contribution separately
- Accept employer NPS as `% of basic` and apply it as a tax deduction in the new-regime model
- Auto-calculate income tax under the India new regime for FY 2025-26 / AY 2026-27
- Bootstrap-based UI with no custom stylesheet dependency
- SEO-ready metadata, sitemap and robots file for search engines
- GitHub Actions workflows for CI and GitHub Pages deployment

## Current calculator behavior

- `Annual CTC` is treated as annual gross salary for the calculator.
- `Special Allowance` is auto-balanced from the remaining monthly gross.
- `Employee PF` reduces take-home salary.
- `Employer PF` is shown separately and does not reduce take-home salary.
- `Employer NPS` is entered as a percentage of monthly basic salary.
- `Employer NPS` is treated as a tax deduction under section `80CCD(2)` in this app.
- Employer NPS deduction is capped at `14%` of basic in the current implementation.

## Local development

```bash
npm install
npm run dev
```

## Test and build

```bash
npm run test:run
npm run build
```

In PowerShell environments where `npm.ps1` is blocked by execution policy, use:

```bash
npm.cmd test -- --run
```

## GitHub Pages

The Vite base path is configured for the repository name `salary-calculator-india`.
After pushing to `main`, enable GitHub Pages in the repository settings with `GitHub Actions` as the source.

## Disclaimer

This codebase has been generated and iterated with OpenAI Codex. It may still contain gaps, bugs, incorrect assumptions, or edge cases that need manual review before production use, especially around payroll and tax rules.
