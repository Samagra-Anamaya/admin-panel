import * as React from 'react';
import { Fragment, memo } from 'react';
import BookIcon from '@mui/icons-material/Book';
import { Box, Chip, Typography, useMediaQuery } from '@mui/material';
import { Theme, styled } from '@mui/material/styles';
import lodashGet from 'lodash/get';
import jsonExport from 'jsonexport/dist';
import { TITLE_STATUS } from '../../enums/Status';
import {
    BooleanField,
    BulkDeleteButton,
    BulkExportButton,
    ChipField,
    SelectColumnsButton,
    CreateButton,
    DatagridConfigurable,
    DateField,
    downloadCSV,
    EditButton,
    ExportButton,
    FilterButton,
    List,
    InfiniteList,
    NumberField,
    ReferenceArrayField,
    ReferenceManyCount,
    SearchInput,
    ShowButton,
    SimpleList,
    SingleFieldList,
    TextField,
    TextInput,
    TopToolbar,
    useTranslate,
    useRedirect,
    useRecordContext,
    FunctionField,
    Datagrid,
    SelectInput,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import { useLocation } from 'react-router-dom';
import CommonModal from '../../components/Modal';
export const PostIcon = BookIcon;


const colorMap = {
    VERIFIED: '#43f248',
    [TITLE_STATUS.APPROVED]: '#43f248',
    [TITLE_STATUS.FLAGGED]: '#ff7400',
    [TITLE_STATUS.REJECTED]: '#ff0000',
    [TITLE_STATUS.PFA]: '#90e0ee'
}

const exporter = posts => {
    const data = posts.map(post => ({
        ...post,
        backlinks: lodashGet(post, 'backlinks', []).map(
            backlink => backlink.url
        ),
    }));
    return jsonExport(data, (err, csv) => downloadCSV(csv, 'posts'));
};

const PostListMobileActions = () => (
    <TopToolbar>
        <ExportButton />
    </TopToolbar>
);

const GpsListMobile = () => (
    <InfiniteList
        // sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={<PostListMobileActions />}
    >
        <SimpleList
            primaryText={record => record.gpCode}
            secondaryText={record => record.gpName}
            tertiaryText={record => record.villagesUnderGp}
        />
    </InfiniteList>
);

const PostListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <ExportButton />
        <FilterButton />
    </TopToolbar>
);

const tagSort = { field: 'name.en', order: 'ASC' };

const GpsListDesktop = () => {
    const location = useLocation();

    const Filters = [
        <TextInput label="Village Id" source="spdpVillageId" />,
        <SelectInput label="Status" source="status" choices={[TITLE_STATUS.APPROVED, TITLE_STATUS.FLAGGED, TITLE_STATUS.PFA, TITLE_STATUS.REJECTED].map(el => ({ id: el, name: el }))} />,
        <TextInput label="Submitter Id" source="submitterId" />,
        <TextInput label="Created At" source="createdAt" />,
    ]

    return <><List
        filters={Filters}
        sort={{ field: 'updatedAt', order: 'DESC' }}
        exporter={exporter}
        actions={<PostListActions />}
    >

        <DatagridConfigurable
            bulkActionButtons={false}
        >
            <FunctionField render={(record: any) => {
                return <div style={{ background: colorMap[record.status] || '#90e0ee', width: '0.5rem', height: '30px' }}></div>
            }} />
            <TextField source="submitterId" label="Submitter ID" />
            <TextField source="status" label="Status" />
            <TextField source="spdpVillageId" label="SPDP Village ID" />
            <TextField source="citizenId" label="Citizen ID" />
            <DateField source="createdAt" label="Created At" />
            <DateField source="capturedAt" label="Captured At" />
            <DateField source="updatedAt" label="Updated At" />
            <ShowButton />
            <FunctionField render={(record: any) => {
                return <EditButton label={`${record?.status == TITLE_STATUS.PFA ? 'Start' : 'View'} Feedback`} icon={null} />
            }} />

        </DatagridConfigurable>
    </List >
        <style>
            {`
            .MuiTablePagination-selectLabel {
                margin-top: 1em;
            }
            .MuiTablePagination-displayedRows {
                margin-top: 1rem;
            }
        `}
        </style>
    </>
};

const SubmissionsList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('sm'),
        { noSsr: true }
    );
    return isSmall ? <GpsListMobile /> : <GpsListDesktop />;
};

export default SubmissionsList;