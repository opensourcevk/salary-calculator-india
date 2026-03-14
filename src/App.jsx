import { useState } from 'react';
import { deductionFields, earningFields, presets } from './data/salaryComponents';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  Switch,
  FormControlLabel,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
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
  <Grid item xs={12} md={6}>
    <Stack spacing={1}>
      <Tooltip title={helper} placement="top" arrow>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ display: 'inline-block', cursor: 'pointer' }}
          tabIndex={0}
          aria-label={`${label} info`}
        >
          {label}
        </Typography>
      </Tooltip>
      <TextField
        fullWidth
        type="number"
        variant="outlined"
        value={value}
        onChange={onChange}
        inputProps={{ min: 0, step: 100 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">INR</InputAdornment>,
        }}
      />
    </Stack>
  </Grid>
);

const PercentField = ({ label, helper, value, onChange }) => (
  <Grid item xs={12} md={6}>
    <Stack spacing={1}>
      <Tooltip title={helper} placement="top" arrow>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ display: 'inline-block', cursor: 'pointer' }}
          tabIndex={0}
          aria-label={`${label} info`}
        >
          {label}
        </Typography>
      </Tooltip>
      <TextField
        fullWidth
        type="number"
        variant="outlined"
        value={value}
        onChange={onChange}
        inputProps={{ min: 0, max: 100, step: 0.5 }}
        InputProps={{
          endAdornment: <InputAdornment position="end">% of basic</InputAdornment>,
        }}
      />
    </Stack>
  </Grid>
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
  <ListItem
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      gap: 1,
      px: 2,
      py: 1.5,
      ...(emphasize && {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 1,
        mb: 0.5,
      }),
      borderBottom: emphasize ? 'none' : '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography variant="body1">{label}</Typography>
    <Typography variant="body1" fontWeight="bold">
      {value}
    </Typography>
  </ListItem>
);

function App() {
  const [salaryState, setSalaryState] = useState(() => createPresetState(DEFAULT_PRESET_KEY));

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4} mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            Salary Calculator
          </Typography>
        </Stack>
        <Grid container spacing={4} component="section" mb={4}>
          <Grid item xs={12} lg={7}>
            <Stack spacing={4}>
              <Card elevation={0} sx={{ p: { xs: 2, lg: 4 } }}>
                <CardContent>
                  <Typography variant="h5" component="h2" mb={3} fontWeight="bold">
                    Salary Configuration
                  </Typography>
                  <Grid container spacing={3}>
                    <CurrencyField
                      label="Annual CTC"
                      helper="Enter the yearly salary package to model. This calculator treats it as annual gross payable salary."
                      value={salaryState.annualCtc}
                      onChange={(event) => updateTopLevelValue('annualCtc', event.target.value)}
                    />

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Tooltip title="Percentage of annual CTC allocated to monthly basic salary." placement="top" arrow>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ display: 'inline-block', cursor: 'pointer' }}
                            tabIndex={0}
                            aria-label="Basic salary percentage info"
                          >
                            Basic Salary %
                          </Typography>
                        </Tooltip>
                        <TextField
                          fullWidth
                          type="number"
                          variant="outlined"
                          value={salaryState.basicPercent}
                          onChange={(event) => updateTopLevelValue('basicPercent', event.target.value)}
                          inputProps={{ min: 0, max: 100, step: 0.5 }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>

                  <Box mt={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={salaryState.pfCapped}
                          onChange={(event) => updateTopLevelValue('pfCapped', event.target.checked)}
                          color="primary"
                        />
                      }
                      label={`Apply EPF wage ceiling of ${formatCurrency(EPF_MONTHLY_WAGE_CEILING)} per month`}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ p: { xs: 2, lg: 4 } }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', lg: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { lg: 'center' },
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Tooltip
                        title="Basic salary, special allowance and EPF are calculated from annual CTC and basic percentage."
                        placement="top"
                      >
                        <Typography
                          variant="h5"
                          component="h3"
                          fontWeight="bold"
                          sx={{ display: 'inline-block', cursor: 'pointer', m: 0 }}
                          tabIndex={0}
                          aria-label="Auto-derived salary components info"
                        >
                          Auto-derived components
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Chip
                      label={`EPF rate: ${EPF_RATE * 100}% of basic`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {ctcOverAllocated && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Your manual earning components exceed the annual CTC target by{' '}
                      <strong>{formatCurrency(Math.abs(summary.ctcMismatchAnnual))}</strong>.
                    </Alert>
                  )}

                  <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table aria-label="auto derived salary components table">
                      <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                          <TableCell><strong>Component</strong></TableCell>
                          <TableCell><strong>Value</strong></TableCell>
                          <TableCell><strong>How it is derived</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow hover>
                          <TableCell component="th" scope="row">Monthly Basic Salary</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(summary.earnings.basic)}</TableCell>
                          <TableCell>{salaryState.basicPercent}% of annual CTC converted to monthly basic salary.</TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell component="th" scope="row">Monthly Special Allowance</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(summary.earnings.specialAllowance)}</TableCell>
                          <TableCell>
                            Auto-balanced against the remaining CTC after accounting for basic salary
                            and other monthly earnings.
                          </TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell component="th" scope="row">Monthly Employee PF</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'error.main' }}>{formatCurrency(summary.deductions.employeePf)}</TableCell>
                          <TableCell>
                            {salaryState.pfCapped
                              ? `12% of monthly basic salary with the ${formatCurrency(EPF_MONTHLY_WAGE_CEILING)} EPF wage cap applied.`
                              : '12% of monthly basic salary without applying the EPF wage cap.'}
                          </TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell component="th" scope="row">Monthly Employer PF</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{formatCurrency(summary.employerContributions.employerPf)}</TableCell>
                          <TableCell>
                            {salaryState.pfCapped
                              ? `Employer-side EPF at 12% of monthly basic salary with the ${formatCurrency(EPF_MONTHLY_WAGE_CEILING)} EPF wage cap applied.`
                              : 'Employer-side EPF at 12% of monthly basic salary without applying the EPF wage cap.'}
                          </TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell component="th" scope="row">Target Annual CTC</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formatCurrency(summary.targetAnnualGross)}</TableCell>
                          <TableCell>This is the top-level annual CTC input used to derive monthly salary values.</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                bgcolor: 'primary.light',
                color: 'primary.dark',
                p: { xs: 2, lg: 4 }
              }}
            >
              <CardContent>
                <Typography variant="overline" display="block" mb={1} sx={{ opacity: 0.8 }}>
                  Monthly In-Hand Salary
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ color: 'primary.dark' }}>
                  {formatCurrency(summary.monthlyInHand)}
                </Typography>

                <Paper elevation={0} sx={{ mt: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
                  <List disablePadding>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <ListItemText primary="Target Monthly CTC" />
                      <Typography fontWeight="bold">{formatCurrency(summary.targetMonthlyGross)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <ListItemText primary="Auto Basic Salary" />
                      <Typography fontWeight="bold">{formatCurrency(summary.earnings.basic)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <ListItemText primary="Employer PF Contribution" />
                      <Typography fontWeight="bold">{formatCurrency(summary.employerContributions.employerPf)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <ListItemText primary="Employer NPS Contribution" />
                      <Typography fontWeight="bold">{formatCurrency(summary.employerContributions.employerNps)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider', color: 'error.main' }}>
                      <ListItemText primary="Professional Tax" />
                      <Typography fontWeight="bold">{formatCurrency(summary.deductions.professionalTax)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider', color: 'error.main' }}>
                      <ListItemText primary="Auto Employee PF" />
                      <Typography fontWeight="bold">{formatCurrency(summary.deductions.employeePf)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider', color: 'error.main' }}>
                      <ListItemText primary="Auto Monthly Income Tax" />
                      <Typography fontWeight="bold">{formatCurrency(summary.monthlyIncomeTax)}</Typography>
                    </ListItem>
                    <ListItem sx={{ py: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '0 0 12px 12px' }}>
                      <ListItemText primary={<Typography fontWeight="bold">Annual Take-Home</Typography>} />
                      <Typography variant="h6" fontWeight="bold">{formatCurrency(summary.annualInHand)}</Typography>
                    </ListItem>
                  </List>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} component="section" mb={4}>
          <Grid item xs={6} lg={3}>
            <Card elevation={0} sx={{ height: '100%', boxShadow: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" display="block">
                  Monthly Gross
                </Typography>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {formatCurrency(summary.monthlyGross)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Card elevation={0} sx={{ height: '100%', boxShadow: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" display="block">
                  Monthly Deductions
                </Typography>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {formatCurrency(summary.monthlyDeductions)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Card elevation={0} sx={{ height: '100%', boxShadow: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" display="block">
                  Taxable Income
                </Typography>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {formatCurrency(taxBreakdown.taxableIncome)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Card elevation={0} sx={{ height: '100%', boxShadow: 1 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" display="block">
                  Annual Income Tax
                </Typography>
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {formatCurrency(summary.annualIncomeTax)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} component="section">
          <Grid item xs={12} xl={7}>
            <Card elevation={0} sx={{ mb: 4, boxShadow: 1 }}>
              <CardContent sx={{ p: { xs: 2, lg: 4 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    justifyContent: 'space-between',
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Box>
                    <Typography variant="h5" component="h3" mb={1}>
                      Monthly earnings you can adjust
                    </Typography>
                    <Typography color="text.secondary">
                      Add recurring salary components. The remaining amount is pushed into special
                      allowance automatically.
                    </Typography>
                  </Box>
                  <Chip
                    label={`Manual earnings: ${formatCurrency(summary.manualEarningTotal)}`}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                </Box>
                <Grid container spacing={3}>
                  {earningFields.map((field) => (
                    <NumberField
                      key={field.key}
                      field={field}
                      value={salaryState.earnings[field.key]}
                      onChange={updateGroupValue('earnings')}
                    />
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ boxShadow: 1 }}>
              <CardContent sx={{ p: { xs: 2, lg: 4 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    justifyContent: 'space-between',
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <Box>
                    <Typography variant="h5" component="h3" mb={1}>
                      Monthly deductions
                    </Typography>
                    <Typography color="text.secondary">
                      Enter payroll deductions. Employee PF and income tax are calculated
                      automatically. Employer NPS is entered as a percentage of basic for tax
                      deduction under section 80CCD(2).
                    </Typography>
                  </Box>
                  <Chip
                    label={`Other deductions: ${formatCurrency(otherDeductions)}`}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                </Box>
                <Alert severity="info" sx={{ mb: 3 }} role="note">
                  Employee PF is auto-derived from basic salary. Employer NPS is treated as an
                  employer-side contribution and reduces taxable income under the new regime in this
                  calculator, capped at {(EMPLOYER_NPS_DEDUCTION_RATE_CAP * 100).toFixed(0)}% of
                  basic.
                </Alert>
                <Grid container spacing={3}>
                  {deductionFields.map((field) => (
                    <NumberField
                      key={field.key}
                      field={field}
                      value={salaryState.deductions[field.key]}
                      onChange={updateGroupValue('deductions')}
                    />
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} xl={5}>
            <Card elevation={0} sx={{ mb: 4, boxShadow: 1 }}>
              <CardContent sx={{ p: { xs: 2, lg: 4 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 3,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Tooltip
                      title="New regime for salaried employees with standard deduction and 4% cess."
                      placement="top"
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ display: 'inline-block', cursor: 'pointer', m: 0 }}
                        tabIndex={0}
                        aria-label="Auto income tax breakdown info"
                      >
                        Auto income tax breakdown
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Chip label="Auto" />
                </Box>

                <List disablePadding sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
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
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
