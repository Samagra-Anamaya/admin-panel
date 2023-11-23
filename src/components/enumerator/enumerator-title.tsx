
import { useRecordContext } from 'react-admin';

export const SubmissionTitle = () => {

    const record = useRecordContext();
    console.log({record});
    return (
        <>
           {`${record?.submissionData.claimantName} - ${record?.id}`}
        </>
    );
};
