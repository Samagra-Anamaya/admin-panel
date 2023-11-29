import * as React from 'react';
import { Fragment, memo } from 'react';
import BookIcon from '@mui/icons-material/Book';
import { Box, Chip, Typography, useMediaQuery } from '@mui/material';
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
    useRecordContext,
    FunctionField,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import { useLocation } from 'react-router-dom';
import CommonModal from '../../components/Modal';
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
        <ExportButton />
    </TopToolbar>
);

const PostListActionToolbar = ({ children }) => (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);



const tagSort = { field: 'name.en', order: 'ASC' };

const GpsListDesktop = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [currentSubmission, setCurrentSubmission] = React.useState<any>(null);
    const location = useLocation();
    const params: any = new URLSearchParams(location.search);
    for (const [key, value] of params) {
        console.log(key, value)
    }

    const Filters = [
        <TextInput label="villageId" source="spdpVillageId" alwaysOn />
    ]

    return <><List
        filters={Filters}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={<PostListActions />}
    >
        <StyledDatagrid
            bulkActionButtons={<PostListBulkActions />}
        >
            <TextField source="submitterId" label="Submitter ID" />
            <TextField source="status" label="Status" />
            <TextField source="spdpVillageId" label="SPDP Village ID" />
            <TextField source="citizenId" label="Citizen ID" />
            <DateField source="createdAt" label="Created At" />
            <DateField source="capturedAt" label="Captured At" />
            <DateField source="updatedAt" label="Updated At" />
            <ShowButton />
            <EditButton label='Start Feedback' icon={null} />
        </StyledDatagrid>
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