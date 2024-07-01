import React from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import FormNeedCliente from './FormNeedCliente';
import TabellaCandidati from './TabellaCandidati.jsx';
import { useUserTheme } from '../TorchyThemeProvider.jsx';
import Shortlist from './Shortlist.jsx';
import IntervistePage from './IntervistePage.jsx';

const steps = ['Job Description', 'Candidati', 'Rating e shortlist', 'Interviste e follow up', 'Hiring'];

const DialogNeed = ({idNeed}) => {
  const theme = useUserTheme();

  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        {activeStep === 0 && <FormNeedCliente idNeed={idNeed} />}
        {activeStep === 1 && <TabellaCandidati />}
        {activeStep === 2 && <Shortlist idNeed={idNeed} />}
        {activeStep === 3 && <IntervistePage />}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          sx={{
            
            bgcolor: theme.palette.button.main, 
            color: theme.palette.textButton.white,
            '&:hover': {
              bgcolor: theme.palette.button.mainHover, 
            },
          }}
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          AVANTI
        </Button>
      </Box>
    </Box>
  );
};

export default DialogNeed;
