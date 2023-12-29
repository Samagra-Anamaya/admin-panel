// in src/posts.js
import * as React from 'react';
import { Create, SelectInput, SimpleForm, TextInput, useGetList } from 'react-admin';

const DepartmentsCreate = () => {
    const { data } = useGetList(
        'departments',
        {
            pagination: { page: 0, perPage: 10000 },
            sort: { field: 'id', order: 'ASC' },
            filter: {}
        }
    );

    return (
        <Create redirect="list">
            <SimpleForm>
                <TextInput source="username" label="Username" required />
                <TextInput source="password" label="Password" required />
                <SelectInput source="deptId" label="Department" required choices={data?.map(el => ({ id: el.name.toLowerCase().trim().split(' ').join(""), name: el.name })) || []} />
            </SimpleForm>
        </Create >
    );
};

export default DepartmentsCreate;