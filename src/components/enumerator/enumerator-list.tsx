// in src/users.tsx
import { useCallback } from "react";
import { List, Datagrid, TextField, DateField } from "react-admin";

import { useRedirect } from 'react-admin';
const rowClick = (_id, _resource, record) => {
   
    // if (record.commentable) {
    //     return 'edit';
    // }

    // return 'show';
};

// const PostPanel = ({ record }) => {
//     console.log({record});
//     return (
//         <div dangerouslySetInnerHTML={{ __html: record.body }} />
//     )
// };


export const EnumeratorList = () => {
const redirect=useRedirect();

const onRowClick =useCallback((_id, _resource, record)=>{
    console.log({_resource,record})
    redirect('list', 'posts');
},[redirect])
    return (
    
        <List>
            <Datagrid 
            rowClick={onRowClick}
          //  expand={PostPanel}
            >
                <TextField source="id" />
                <TextField source="submitterId" />
                <TextField source="submissionData.claimantName" label="Claimant Name"/>
                <DateField source="updatedAt" />
                <TextField source="spdpVillageId" />
                <TextField source="status" />
{/*                
                <SubmissionDataField source="submissionData" label="Submission Data" /> */}
           
                
            </Datagrid>
        </List>
    )
};