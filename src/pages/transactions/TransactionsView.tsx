// in src/posts.jsx
import { Chip, Typography } from '@mui/material';
import { TextField as TextFieldMUI } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { Show, SimpleShowLayout, useRecordContext, FunctionField, List, TextField, DatagridConfigurable, BooleanField, DateField, useTranslate } from 'react-admin';
import { getImageFromMinio } from '../../utils/getImageFromMinio';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import styles from './TransactionsView.module.scss';
import { formatDate } from '../../utils/helper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#63b4b8',
        color: theme.palette.common.white,
        fontSize: 16,
        padding: '0.5rem'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '0.5rem'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const QuickFilter = (props: any) => {
    const translate = useTranslate();
    return <Chip label={translate(props.label)} />
};


const generateErrors: any = (errors: any, arr: Array<any>) => {
    Object?.keys(errors)?.map((t) => {
        if (typeof errors[t] == 'string') {
            arr.push({ field: t, value: errors[t] })
        } else generateErrors(errors[t], arr)
    })
    return arr;
}

const DataPanel = () => {
    const record = useRecordContext();
    return (
        <div className={styles.dataContainer}>
            {record.errors && Object?.keys(record?.errors)?.length && <div>
                <h5>Corrections Table</h5>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>Field</StyledTableCell>
                                <StyledTableCell align='left'>Correction</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object?.keys(record?.errors)?.length && generateErrors(record.errors, []).map((el) => {
                                return <StyledTableRow key={el.field}>
                                    <StyledTableCell align='left'>{el.field} </StyledTableCell>
                                    <StyledTableCell align="left"><span style={{ color: '#C60200' }}>{el.value || ""}</span></StyledTableCell>
                                </StyledTableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer> </div>
            }
            {record?.departmentData?.length && <div>
                <h5>Department Data</h5>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>Marker</StyledTableCell>
                                <StyledTableCell align='left'>Value</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {record?.departmentData?.map((t, j) => {
                                return <StyledTableRow key={j}>
                                    <StyledTableCell align='left'>{t?.marker} </StyledTableCell>
                                    <StyledTableCell align="left"><span style={{ color: '#C60200' }}>{t?.value}</span></StyledTableCell>
                                </StyledTableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
        </div>
    );
};

const TransactionsView = () => {

    const Filters = [
        <QuickFilter source="saved_records" label="Saved Records" defaultValue={true} />,
        <QuickFilter source="failed_records" label="Failed Records" defaultValue={true} />
    ]

    return <Show >
        <SimpleShowLayout >
            <FunctionField
                render={(record: any) => {

                    return <div className={styles.formContainer}>
                        <div>
                            <h3>Transaction Details</h3>
                            <div className={styles.infoRow}>
                                <TextFieldMUI variant='outlined' label="ID" value={record.id} />
                                <TextFieldMUI variant='outlined' label="Total Records" value={record.total_records} />
                                <TextFieldMUI variant='outlined' label="Valid Records" value={record.valid_records} />
                                <TextFieldMUI variant='outlined' label="Invalid Records" value={record.invalid_records} />
                                <TextFieldMUI variant='outlined' label="Valid Records Saved" value={record.valid_records_saved ? 'Yes' : 'No'} />
                                <TextFieldMUI variant='outlined' label="Contains Errors" value={record.contain_errors ? 'Yes' : 'No'} />
                                <TextFieldMUI variant='outlined' label="Transaction Start Time" value={formatDate(new Date(record.transaction_start_time))} />
                                <TextFieldMUI variant='outlined' label="Transaction End Time" value={formatDate(new Date(record.transaction_end_time))} />
                                <TextFieldMUI variant='outlined' label="Created At" value={formatDate(new Date(record.created_at))} />
                                <TextFieldMUI variant='outlined' label="Updated At" value={formatDate(new Date(record.updated_at))} />
                            </div>
                            <List
                                filters={Filters}
                            >
                                <DatagridConfigurable
                                    bulkActionButtons={false}
                                    expand={<DataPanel />}
                                >
                                    <FunctionField render={(rec: any) => {
                                        return <div style={{ background: rec.errors ? '#ff0000' : '#43f248', width: '0.5rem', height: '30px' }}></div>
                                    }} />
                                    <TextField source="aadhaarNumber" label="Aadhaar Number" />
                                    <TextField source="aadhaarReferenceNumber" label="Aadhaar Reference Number" />
                                    <TextField source="uniqueBeneficiaryId" label="Unique Beneficiary ID" />
                                    <TextField source="financialYear" label="Financial Year" />
                                    <DateField source="transactionDate" label="Transaction Date" />
                                    <TextField source="transactionType" label="Transaction Type" />
                                    <BooleanField source="transactionAmount" label="Transaction Amount" />
                                    <BooleanField source="inKindBenefitDetail" label="In Kind Benefit Detail" />
                                    <BooleanField source="schemeCode" label="Scheme Code" />
                                </DatagridConfigurable>
                            </List>


                        </div>
                        {/* <div>
                            <h3>Request Body Details</h3>
                            {record?.request_body?.map((el: any, i: number) => {
                                return <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography variant='h6'>Request {i + 1}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell align='left'>Field</StyledTableCell>
                                                        <StyledTableCell align='left'>Data</StyledTableCell>
                                                        <StyledTableCell align='left'>Corrections</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.keys(el)?.map((t, j) => {
                                                        if (typeof el[t] != 'object')
                                                            return <StyledTableRow key={i + el.aadhaarNumber}>
                                                                <StyledTableCell align='left'>{t} </StyledTableCell>
                                                                <StyledTableCell align="left">{el[t]}</StyledTableCell>
                                                                <StyledTableCell align="left"><span style={{ color: '#C60200' }}>{record?.errors?.[i]?.[t] || ""}</span></StyledTableCell>
                                                            </StyledTableRow>
                                                        else return <StyledTableRow key={i + el.aadhaarNumber}>
                                                            <StyledTableCell align='left'>{t} </StyledTableCell>
                                                            <StyledTableCell align="left">{el[t]?.map((x: any) => <p style={{ marginBottom: '0' }}>{x.marker}: {x.value}</p>)}</StyledTableCell>
                                                            <StyledTableCell align="left"><span style={{ color: '#C60200' }}>{record?.errors?.[i]?.[t] || ""}</span></StyledTableCell>
                                                        </StyledTableRow>

                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                            })}


                        </div> */}

                    </div>
                }}
            />
        </SimpleShowLayout>
    </Show >
};

export default TransactionsView;

// {
//     "remarks": "",
//     "schemeCode": "",
//     "aadhaarNumber": "a23412341234",
//     "financialYear": "2021-2022",
//     "departmentData": [
//         {
//             "value": "21-01-1999",
//             "marker": "Date of Birth"
//         },
//         {
//             "value": "ST",
//             "marker": "Social Category"
//         }
//     ],
//     "transactionDate": "12-13-2022",
//     "transactionType": "",
//     "transactionAmount": 5000,
//     "inKindBenefitDetail": "",
//     "uniqueBeneficiaryId": "",
//     "aadhaarReferenceNumber": "12341234123456"
// }