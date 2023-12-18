import { Show, SimpleShowLayout, TextField, FunctionField } from 'react-admin';

import ReactJson from 'react-json-view'

const SchemesShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="scheme_name" label="Scheme Name" />
            <TextField source="scheme_code" label="Scheme Code" />
            <FunctionField label="Scheme Json" render={(record: any) =>
                <ReactJson src={record.schema} />
            } />
        </SimpleShowLayout>
    </Show>
);

export default SchemesShow;