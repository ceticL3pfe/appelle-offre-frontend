import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "validation de retrait de cdc",
  "analyse de la commission",
  "analyse de contolleur de gestion",
  "validation de directeur",
];

export default function StepperProgress({ status, isValide, tender }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    switch (status) {
      case "validation de retrait de cdc":
        setCurrentStep(0);
        break;
      case "analyse de la commission":
        setCurrentStep(1);
        break;
      case "analyse de contolleur de gestion":
        setCurrentStep(2);
        break;
      case "validation de directeur":
        setCurrentStep(3);
        break;
      case "Terminer" || "Annuler":
        setCurrentStep(4);
    }
  }, [status]);

  const getResponseForStep = (step) => {
    switch (step) {
      case 0:
        return tender.directeurReponse;
      case 1:
        return tender.commissionResponse;
      case 2:
        return tender.controlleurDeGestionResponse;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              error={
                currentStep === index && getResponseForStep(index) === "refused"
              }
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
