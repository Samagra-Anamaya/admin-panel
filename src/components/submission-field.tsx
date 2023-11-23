
import { useRecordContext } from 'react-admin';

const SubmissionDataField = (props:any) => {
  const record = useRecordContext(props);
  console.log({record,props})
  if (!record) return null;

  const { submissionData } = record;

  return (
    <div>
      <strong>Area:</strong> {submissionData.area}<br />
      <strong>Address:</strong> {submissionData.address}<br />
      <strong>Tribe Name:</strong> {submissionData.tribeName}<br />
      {/* Add more fields as needed */}
    </div>
  );
};

SubmissionDataField.defaultProps = {
  addLabel: true,
};

export default SubmissionDataField;
