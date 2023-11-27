import { Step, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import styles from './index.module.scss';
import RecordsPreview from './RecordsPreview';

const steps = [
    'Individual Feedback',
    'Collective Feedback',
    'Review & Submit'
];

const FeedbackFlow = (props: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { currentSubmission } = props
    console.log(currentSubmission)
    return (
        <div className={styles.feedbackContainer + " animate__animated animate__slideInUp animate__fast"}>
            <Stepper activeStep={currentStep} alternativeLabel sx={{ paddingTop: '3rem' }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {currentStep == 0 &&
                <div className={styles.screenOne}>
                    <FeedbackForm {...{ currentSubmission }} />
                    <div className={styles.divider}></div>
                    <RecordsPreview {...{ currentSubmission }} />
                </div>
            }

        </div >
    );
}

export default FeedbackFlow