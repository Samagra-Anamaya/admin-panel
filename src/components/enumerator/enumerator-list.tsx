// in src/users.tsx
import { useCallback } from "react";
import { List, Datagrid, TextField, DateField } from "react-admin";
import { useParams } from 'react-router-dom'

export const EnumeratorList = () => {
    const params = useParams();
    console.log(params)
    return (

        <List>
            <Datagrid
            >
                <TextField source="id" />
                <TextField source="submitterId" />
                <TextField source="submissionData.claimantName" label="Claimant Name" />
                <DateField source="updatedAt" />
                <TextField source="spdpVillageId" />
                <TextField source="status" />
                {/*                
                <SubmissionDataField source="submissionData" label="Submission Data" /> */}


            </Datagrid>
        </List>
    )
};