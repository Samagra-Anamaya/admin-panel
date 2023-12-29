import { Show, SimpleShowLayout, TextField, FunctionField } from 'react-admin';

import ReactJson from 'react-json-view'

const UsersView = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="username" label="Username" />
            <TextField source="data.deptId" label="Department ID" />
        </SimpleShowLayout>
    </Show>
);

export default UsersView;