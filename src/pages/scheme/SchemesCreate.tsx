// in src/posts.js
import * as React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const SchemesCreate = () => {
    const [schemeJson, setSchemeJson] = React.useState<any>(null);

    const transform = (data: any) => ({
        ...data,
        schemeJson: schemeJson
    });

    return (
        <Create transform={transform} redirect="list">
            <SimpleForm>
                <TextInput source="schemeName" label="Scheme Name" required />
                <TextInput source="schemeCode" label="Scheme Code" required />
                <h6 style={{ opacity: 0.7, marginTop: 10 }}>Scheme Json</h6>
                <AceEditor
                    mode="javascript"
                    theme="solarized dark"
                    onChange={(data) => setSchemeJson(data)}
                    name="ace_edito_OP"
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: '100%' }}
                />
            </SimpleForm>
        </Create >
    );
};

export default SchemesCreate;