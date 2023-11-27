import { Button, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useState } from 'react';
import styles from './index.module.scss';

const FeedbackForm = (props: any) => {
    const { currentSubmission } = props;
    const subData = currentSubmission.submissionData;

    return (
        <div className={styles.container}>
            <div className={styles.fieldContainer}>
                <div className={styles.inputsContainer}>
                    <TextField variant='filled' label="Aadhaar Available?" value={subData.isAadhaarAvailable ? 'Yes' : 'No'} />
                </div>
                <Button variant='outlined' color="success" sx={{ height: '3rem', marginTop: '10px' }}>Add Feedback</Button>
            </div>
            {subData?.isAadhaarAvailable ? <div className={styles.fieldContainer}>
                <div className={styles.inputsContainer}>
                    <TextField variant='filled' label="Aadhaar Number" value={subData.aadhaar ? 'Yes' : 'No'} />
                </div>
                <Button variant='outlined' color="success" sx={{ height: '3rem', marginTop: '10px' }}>Add Feedback</Button>
            </div> : <></>}
            <div className={styles.fieldContainer}>
                <div className={styles.inputsContainer}>
                    <TextField variant='filled' label="Aadhaar Available?" value={subData.isAadhaarAvailable ? 'Yes' : 'No'} />
                </div>
                <Button variant='outlined' color="success" sx={{ height: '3rem', marginTop: '10px' }}>Add Feedback</Button>
            </div>
            <TextField variant='filled' label="Land Title Serial Number" value={subData.landTitleSerialNumber} />
            <TextField variant='filled' label="Claimant Name" value={subData.claimantName} />
            <TextField variant='filled' label="Co Claimant Available?" value={subData.coClaimantAvailable ? 'Yes' : 'No'} />
            {subData?.coClaimantAvailable ? <TextField variant='filled' label="Co Claimant Name?" value={subData.coClaimantName} /> : <></>}
            <TextField variant='filled' label="Parent Name" value={subData.parentName} />
            <TextField variant='filled' label="Full Address" value={subData.address} />
            <TextField variant='filled' label="Social Category" value={subData.socialCategory} />
            <TextField variant='filled' label="Tribe Name" value={subData.tribeName} />
            <TextField variant='filled' label="Area in Hectares (xx.xx)" value={subData.area} />
            <TextField variant='filled' label="No. of Plots Claimed Under FRA" value={subData.fraPlotsClaimed} />
            <TextField variant='filled' label="Has ROR been updated?" value={subData.rorUpdated ? 'Yes' : 'No'} />
            {subData?.rorUpdated ? <TextField variant='filled' label="Khata Number" value={subData.khataNumber} /> : <></>}
        </div >
    );
}

export default FeedbackForm