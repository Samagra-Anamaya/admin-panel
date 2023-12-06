// in src/posts.jsx
import { Typography } from '@mui/material';
import { TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { Show, SimpleShowLayout, useRecordContext, FunctionField } from 'react-admin';
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


const TransactionsView = () => {

    return <Show >
        <SimpleShowLayout >
            <FunctionField
                render={(record: any) => {

                    return <div className={styles.formContainer}>
                        <div>
                            <h3>Transaction Details</h3>
                            <TextField variant='outlined' label="ID" value={record.id} />
                            <TextField variant='outlined' label="Total Records" value={record.total_records} />
                            <TextField variant='outlined' label="Valid Records" value={record.valid_records} />
                            <TextField variant='outlined' label="Invalid Records" value={record.invalid_records} />
                            <TextField variant='outlined' label="Valid Records Saved" value={record.valid_records_saved ? 'Yes' : 'No'} />
                            <TextField variant='outlined' label="Contains Errors" value={record.contain_errors ? 'Yes' : 'No'} />
                            <TextField variant='outlined' label="Transaction Start Time" value={formatDate(new Date(record.transaction_start_time))} />
                            <TextField variant='outlined' label="Transaction End Time" value={formatDate(new Date(record.transaction_end_time))} />
                            <TextField variant='outlined' label="Created At" value={formatDate(new Date(record.created_at))} />
                            <TextField variant='outlined' label="Updated At" value={formatDate(new Date(record.updated_at))} />
                        </div>
                        <div>
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


                        </div>

                    </div>
                }}
            />
        </SimpleShowLayout>
    </Show >
};

export default TransactionsView;


// {
//     "id": "214bcf1d-a0d6-4b5c-a269-94c13a7f9bb0",
//     "request_body": [
//         {
//             "remarks": "",
//             "schemeCode": "",
//             "aadhaarNumber": "a23412341234",
//             "financialYear": "2021-2022",
//             "departmentData": [
//                 {
//                     "value": "21-01-1999",
//                     "marker": "Date of Birth"
//                 },
//                 {
//                     "value": "ST",
//                     "marker": "Social Category"
//                 }
//             ],
//             "transactionDate": "12-13-2022",
//             "transactionType": "",
//             "transactionAmount": 5000,
//             "inKindBenefitDetail": "",
//             "uniqueBeneficiaryId": "",
//             "aadhaarReferenceNumber": "12341234123456"
//         },
//         {
//             "remarks": "",
//             "schemeCode": "VULC8",
//             "aadhaarNumber": "1234123412345",
//             "financialYear": "2021-22",
//             "departmentData": [
//                 {
//                     "value": "21-01-1999",
//                     "marker": "Date of Birth"
//                 },
//                 {
//                     "value": "ST",
//                     "marker": "Social Category"
//                 }
//             ],
//             "transactionDate": "12-08-2022",
//             "transactionType": "Cash",
//             "transactionAmount": 5000,
//             "inKindBenefitDetail": "Training",
//             "uniqueBeneficiaryId": "5812844",
//             "aadhaarReferenceNumber": "1234123412345"
//         },
//         {
//             "remarks": "",
//             "schemeCode": "VULC8",
//             "aadhaarNumber": "123412341234",
//             "financialYear": "2021-22",
//             "departmentData": [
//                 {
//                     "value": "21-01-1999",
//                     "marker": "Date of Birth"
//                 },
//                 {
//                     "value": "ST",
//                     "marker": "Social Category"
//                 }
//             ],
//             "transactionDate": "12-08-2022",
//             "transactionType": "Cash",
//             "transactionAmount": 5000,
//             "inKindBenefitDetail": "Training",
//             "uniqueBeneficiaryId": "5812844",
//             "aadhaarReferenceNumber": "1234123412345"
//         },
//         {
//             "remarks": "",
//             "schemeCode": "VULC8",
//             "aadhaarNumber": "123412341234",
//             "financialYear": "2021-22",
//             "departmentData": [
//                 {
//                     "value": "21-01-1999",
//                     "marker": "Date of Birth"
//                 },
//                 {
//                     "value": "ST",
//                     "marker": "Social Category"
//                 }
//             ],
//             "transactionDate": "12-08-2022",
//             "transactionType": "Cash",
//             "transactionAmount": "5000",
//             "inKindBenefitDetail": "Training",
//             "uniqueBeneficiaryId": "5812844",
//             "aadhaarReferenceNumber": "1234123412345"
//         },
//         {
//             "remarks": "",
//             "schemeCode": "VULC8",
//             "aadhaarNumber": "123412341234",
//             "financialYear": "2021-22",
//             "departmentData": [
//                 {
//                     "value": "21-01-1999",
//                     "marker": "Date of Birth"
//                 },
//                 {
//                     "value": "ST",
//                     "marker": "Social Category"
//                 }
//             ],
//             "transactionDate": "12-08-2022",
//             "transactionType": "Cash",
//             "transactionAmount": 5000,
//             "inKindBenefitDetail": "Training",
//             "uniqueBeneficiaryId": "5812844",
//             "aadhaarReferenceNumber": "1234123412345"
//         },
//         {
//             "remarks": "",
//             "schemeCode": "VULC8",
//             "aadhaarNumber": "123412341234",
//             "financialYear": "2021-22",
//             "departmentData": [
//                 {
//                     "value": "21-01-1999",
//                     "marker": "Date of Birth"
//                 },
//                 {
//                     "value": "ST",
//                     "marker": "Social Category"
//                 }
//             ],
//             "transactionDate": "12-08-2022",
//             "transactionType": "Cash",
//             "transactionAmount": 5000,
//             "inKindBenefitDetail": "Training",
//             "uniqueBeneficiaryId": "5812844",
//             "aadhaarReferenceNumber": "1234123412345"
//         }
//     ],
//     "total_records": 6,
//     "valid_records": 3,
//     "invalid_records": 3,
//     "contain_errors": true,
//     "valid_records_saved": true,
//     "errors": {
//         "0": {
//             "schemeCode": "EMPTY SCHEME CODE",
//             "aadhaarNumber": "AADHAAR NUMBER IS NOT A NUMBER",
//             "financialYear": "FINANCIAL NOT IN FORMAT OF YYYY-YY",
//             "transactionDate": "TRANSACTION DATE NOT IN FORMAT OF DD-MM-YYYY",
//             "transactionType": "EMPTY TRANSACTION TYPE",
//             "inKindBenefitDetail": "EMPTY IN KIND BENEFIT DETAIL",
//             "uniqueBeneficiaryId": "EMPTY UNIQUE BENEFICIARY ID",
//             "aadhaarReferenceNumber": "AADHAAR REFERENCE NUMBER SHOULD BE OF LENGTH 13"
//         },
//         "1": {
//             "aadhaarNumber": "AADHAAR NUMBER SHOULD BE OF LENGTH 12"
//         },
//         "3": {
//             "transactionAmount": "TRANSACTION AMOUNT SHOULD BE AN INTEGER"
//         }
//     },
//     "user_id": "c51e4e0c-b326-44aa-bdb0-3ba5850ac106",
//     "transaction_start_time": "2023-12-05T11:26:15.868Z",
//     "transaction_end_time": "2023-12-05T11:26:15.880Z",
//     "created_at": "2023-12-05T11:26:15.882Z",
//     "updated_at": "2023-12-05T11:26:15.882Z"
// }