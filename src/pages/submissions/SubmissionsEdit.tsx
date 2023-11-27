import * as React from "react";
import { Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FunctionField, BooleanInput } from 'react-admin';

const SubmissionsEdit = () => (
    <Edit>
        <SimpleForm>
            <h2>Form Details</h2>
            <BooleanInput disabled label="Aadhaar Available?" source="submissionData.isAadhaarAvailable" />
            <FunctionField render={(record: any) => {
                console.log({ record })
                if (record?.submissionData?.isAadhaarAvailable) {
                    return <TextInput disabled label="Aadhaar Number" source="submissionData.aadharNumber" />
                }
            }} />
            <TextInput disabled label="Land Title Serial Number" source="submissionData.landTitleSerialNumber" />
            <TextInput disabled label="Claimant Name" source={"submissionData.claimantName"} />
            <BooleanInput disabled label="Co Claimant Available?" source={"submissionData.coClaimantAvailable"} />
            <FunctionField render={(record: any) => {
                if (record?.submissionData?.coClaimantAvailable) {
                    return <TextInput disabled label="Co Claimant Name" source="submissionData.coClaimantName" />
                }
            }} />
            <TextInput disabled label="Parent Name" source={"submissionData.parentName"} />
            <TextInput disabled label="Full Address" source={"submissionData.address"} />
            <TextInput disabled label="Social Category" source={"submissionData.socialCategory"} />
            <TextInput disabled label="Tribe Name" source={"submissionData.tribeName"} />
            <TextInput disabled label="Area in Hectares (xx.xx)" source={"submissionData.area"} />
            <TextInput disabled label="No. of Plots Claimed Under FRA" source={"submissionData.fraPlotsClaimed"} />
            {
                //@ts-ignore
                // [...Array(Number(subData?.fraPlotsClaimed)).keys()].map(el => <TextField variant='outlined' label={`Plot Number ${el + 1}`} value={subData[`plotNumber${el + 1}`]} />)
            }
            <TextInput disabled label="Has ROR been updated?" source={"submissionData.rorUpdated"} />
            <FunctionField render={(record: any) => {
                if (record?.submissionData?.rorUpdated) {
                    return <TextInput disabled label="Khata Number" source="submissionData.khataNumber" />
                }
            }} />
        </SimpleForm>
    </Edit>
);

export default SubmissionsEdit;