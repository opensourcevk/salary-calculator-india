# AGENTS.md

## Project

- App: Indian in-hand salary calculator built with React + Vite.
- UI: Bootstrap components only. Avoid adding custom CSS unless explicitly requested.
- Domain: New-regime salary estimation with EPF, professional tax, employer NPS tax deduction, and monthly in-hand output.

## Working Rules

- Prefer updating source files in `src/` only. Do not edit `dist/` manually.
- Keep calculations in `src/utils/salary.js`.
- Keep field metadata in `src/data/salaryComponents.js`.
- Keep tests aligned with salary logic in `src/utils/salary.test.js`.
- Use Bootstrap utility classes and components before introducing new styling patterns.

## Current Product Assumptions

- Default basic salary percentage is `40%`.
- EPF wage ceiling toggle defaults to `false`.
- Professional tax defaults to `200` per month.
- Employer NPS is entered as `% of basic`.
- Employer NPS is treated as a new-regime deduction under section `80CCD(2)` in this app.
- Employer NPS deduction is capped at `14%` of basic in the current model.

## Verification

- Run tests with `npm.cmd test -- --run` in PowerShell environments where `npm.ps1` may be blocked.
- For normal script execution, `npm run test:run` is the intended project command.
