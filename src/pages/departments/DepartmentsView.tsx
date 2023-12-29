import { Show, SimpleShowLayout, TextField, FunctionField } from 'react-admin';

import ReactJson from 'react-json-view'

const DepartmentsView = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="id" />
            <TextField source="name" label="Name" />
            <FunctionField label="Department Data" render={(record: any) =>
                <ReactJson src={record.data} />
            } />
            <FunctionField label="Department Schemes" render={(record: any) =>
                <ReactJson src={record.schemes} />
            } />
        </SimpleShowLayout>
    </Show>
);

export default DepartmentsView;