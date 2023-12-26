import * as React from 'react';
import { Fragment, memo } from 'react';
import BookIcon from '@mui/icons-material/Book';
import { Box, Chip, useMediaQuery } from '@mui/material';
import { Theme, styled } from '@mui/material/styles';
import lodashGet from 'lodash/get';
import jsonExport from 'jsonexport/dist';
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
    Datagrid,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import { useLocation } from 'react-router-dom';

export const PostIcon = BookIcon;



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

const StyledDatagrid = styled(DatagridConfigurable)(({ theme }) => ({
    '& .title': {
        maxWidth: '16em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    '& .hiddenOnSmallScreens': {
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        },
    },
    '& .column-tags': {
        minWidth: '9em',
    },
    '& .publishedAt': { fontStyle: 'italic' },
}));

const PostListBulkActions = memo(
    ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        children,
        ...props
    }) => (
        <Fragment>
            <BulkDeleteButton {...props} />
            <BulkExportButton {...props} />
        </Fragment>
    )
);

const PostListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <ExportButton />
    </TopToolbar>
);

const PostListActionToolbar = ({ children }) => (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);



const tagSort = { field: 'name.en', order: 'ASC' };

const GpsListDesktop = () => {
    const location = useLocation();
    const params: any = new URLSearchParams(location.search);
    for (const [key, value] of params) {
        console.log(key, value)
    }

    const Filters = [
        <TextInput label="GP Code" source="gpCode" />,
        <TextInput label="Village Name" source="villageName" />
    ]


    const redirect = useRedirect();

    const rowClick = (_id, _resource, record) => {
        console.log("Click", record)
        redirect("list", `submissions?displayedFilters={}&filter={"spdpVillageId":"${record.spdpVillageId}"}`)
    };


    return <><List
        filters={Filters}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={<PostListActions />}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick={rowClick}
        >
            <TextField source="id" label="ID" />
            <TextField source="stateCode" label="State Code" />
            <TextField source="stateName" label="State Name" />
            <TextField source="districtCode" label="District Code" />
            <TextField source="districtName" label="District Name" />
            <TextField source="itdaName" label="ITDA Name" />
            <TextField source="blockCode" label="Block Code" />
            <TextField source="blockName" label="Block Name" />
            <TextField source="isTspBlock" label="Is TSP Block" />
            <TextField source="gpCode" label="GP Code" />
            <TextField source="gpName" label="GP Name" />
            <TextField source="surveySubmitted" label="Survyes Submitted" />
            <TextField source="surveyToConduct" label="Survyes To Conduct" />
            <TextField source="flagsRaised" label="Flags Raised" />
            <TextField source="spdpVillageId" label="Village ID" />
            <TextField source="villageName" label="Village Name" />
            <TextField source="status" label="Status" />
        </DatagridConfigurable>
    </List>
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

const VillagesList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('sm'),
        { noSsr: true }
    );
    return isSmall ? <GpsListMobile /> : <GpsListDesktop />;
};

export default VillagesList;


// {
//     "id": 7540,
//     "stateCode": 21,
//     "stateName": "ODISHA",
//     "districtCode": 347,
//     "districtName": "BARGARH",
//     "itdaName": "",
//     "blockCode": 3320,
//     "blockName": "PAIKMAL",
//     "isTspBlock": "N",
//     "gpCode": 116545,
//     "gpName": "KECHHODADAR",
//     "surveySubmitted": 0,
//     "surveyToConduct": 0,
//     "flagsRaised": 0,
//     "spdpVillageId": 379727,
//     "villageName": "Chheliamal",
//     "meta": null,
//     "submissions": null,
//     "status": "UNASSIGNED"
// }