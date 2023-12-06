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

const RecordsListMobile = () => (
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
        <ExportButton />
    </TopToolbar>
);

const PostListActionToolbar = ({ children }) => (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);



const tagSort = { field: 'name.en', order: 'ASC' };

const RecordsListDesktop = () => {
    const location = useLocation();
    const params: any = new URLSearchParams(location.search);
    for (const [key, value] of params) {
        console.log(key, value)
    }

    // const Filters = [
    //     <TextInput label="GP Code" source="gpCode" alwaysOn />
    // ]



    return <><List
        // filters={Filters}
        exporter={exporter}
        actions={<PostListActions />}
        filterDefaultValues={{
            gpCode: '5433'
        }}
    >
        <DatagridConfigurable
            bulkActionButtons={false}
        >
            <TextField source="id" label="ID" />
            <TextField source="aadhaar_number" label="Aadhaar Number" />
            <TextField source="aadhaar_reference_number" label="Aadhaar Reference Number" />
            <TextField source="unique_beneficiary_id" label="Unique Beneficiary ID" />
            <TextField source="financial_year" label="Financial Year" />
            <TextField source="in_kind_benefit_detail" label="Benefit Detail In Kind" />
            <TextField source="scheme_code" label="Scheme Code" />
            <TextField source="transaction_amount" label="Transaction Amount" />
            <TextField source="transaction_date" label="Transaction Date" />
            <TextField source="transaction_type" label="Transaction Type" />
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

const RecordsList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('sm'),
        { noSsr: true }
    );
    return isSmall ? <RecordsListMobile /> : <RecordsListDesktop />;
};

export default RecordsList;