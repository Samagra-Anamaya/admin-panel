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


const GpsListDesktop = () => {

    const redirect = useRedirect();

    const rowClick = (_id, _resource, record) => {
        console.log("Click", record)
        redirect("list", `villages?displayedFilters={}&filter={"gpCode":"${record.gpCode}"}`)
    };

    const Filters = [
        <TextInput label="GP Code" source="gpCode" />,
        <TextInput label="GP Name" source="gpName" />
    ]

    return <><List
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={<PostListActions />}
        filters={Filters}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
            rowClick={rowClick}
        >
            <TextField source="gpCode" label="Gp Code" />
            <TextField source="gpName" label="Gp Name" />
            <TextField source="id" label="ID" />
            <TextField source="villagesUnderGp" label="Villages Under GP" />
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

const GpsList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('sm'),
        { noSsr: true }
    );
    return isSmall ? <GpsListMobile /> : <GpsListDesktop />;
};

export default GpsList;
