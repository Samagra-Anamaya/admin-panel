// in src/posts.js
import * as React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const DepartmentsCreate = () => {
    const [deptData, setDeptData] = React.useState<any>("");
    // const [schemeJson, setSchemeJson] = React.useState<any>("");

    const transform = (data: any) => ({
        ...data,
        // schemeJson: schemeJson,
        deptData: deptData
    });

    return (
        <Create transform={transform} redirect="list">
            <SimpleForm>
                <TextInput source="name" label="Department Name" required />
                <h6 style={{ opacity: 0.7 }}>Department Data</h6>
                <AceEditor
                    mode="javascript"
                    theme="solarized dark"
                    onChange={(data) => setDeptData(data)}
                    name="deptData"
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: '100%', height: '25vh' }}
                />
                {/* <h6 style={{ opacity: 0.7, marginTop: 30 }}>Department Schemes</h6>
                <AceEditor
                    mode="javascript"
                    theme="solarized dark"
                    onChange={(data) => setSchemeJson(data)}
                    name="deptScheme"
                    style={{ width: '100%', height: '25vh' }}
                    editorProps={{ $blockScrolling: true }}
                /> */}
            </SimpleForm>
        </Create >
    );
};

export default DepartmentsCreate;