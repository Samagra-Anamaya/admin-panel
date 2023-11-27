// in src/posts.jsx
import { Typography } from '@mui/material';
import { TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { Show, SimpleShowLayout, useRecordContext, FunctionField } from 'react-admin';
import { getImageFromMinio } from '../../utils/getImageFromMinio';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import styles from './SubmissionsView.module.css';
const SubmissionsView = () => {
    let fetchingLandImages = useRef(false);
    let fetchingRorImages = useRef(false);
    const [landImages, setLandImages] = useState<any>([]);
    const [rorImages, setRorImages] = useState<any>([]);

    const getImages = async (arr: Array<string>, setterFunc: Function) => {
        if (arr[0].includes("https")) return;
        let t: Array<string> = []
        for (let el of arr) {
            let imageURI = await getImageFromMinio(el);
            if (!t.includes(imageURI))
                t.push(imageURI);
        }
        setterFunc(t);
    }

    useEffect(() => {
        if (landImages?.length && !fetchingLandImages.current) {
            fetchingLandImages.current = true;
            getImages(landImages, setLandImages)
        }
    }, [landImages])

    useEffect(() => {
        if (rorImages?.length && !fetchingRorImages.current) {
            fetchingRorImages.current = true;
            getImages(rorImages, setRorImages)
        }
    }, [rorImages])

    return <Show >
        <SimpleShowLayout >
            {/* <TextField source="submitterId" label="Submitter ID" />
            <TextField source="status" label="Status" />
            <TextField source="spdpVillageId" label="SPDP Village ID" />
            <TextField source="citizenId" label="Citizen ID" />
            <DateField source="createdAt" label="Created At" />
            <DateField source="capturedAt" label="Captured At" />
            <DateField source="updatedAt" label="Updated At" /> */}
            <FunctionField
                render={(record: any) => {
                    const subData = record.submissionData
                    if (subData?.landRecords?.length && !landImages?.length) {
                        setLandImages(subData?.landRecords)
                    }
                    if (subData?.rorRecords?.length && !rorImages?.length) {
                        setRorImages(subData?.rorRecords)
                    }
                    return <div className={styles.formContainer}>
                        <div className={styles.formData}>
                            <p>Form Details</p>
                            <TextField variant='outlined' label="Aadhaar Available?" value={subData.isAadhaarAvailable ? 'Yes' : 'No'} />
                            {subData?.isAadhaarAvailable ? <TextField variant='outlined' label="Aadhaar Number" value={subData.aadhaar ? 'Yes' : 'No'} /> : <></>}
                            <TextField variant='outlined' label="Land Title Serial Number" value={subData.landTitleSerialNumber} />
                            <Carousel>
                                {landImages?.map((el: string) => <img src={el} style={{ width: '20%' }} />)}
                            </Carousel>
                            <TextField variant='outlined' label="Claimant Name" value={subData.claimantName} />
                            <TextField variant='outlined' label="Co Claimant Available?" value={subData.coClaimantAvailable ? 'Yes' : 'No'} />
                            {subData?.coClaimantAvailable ? <TextField variant='outlined' label="Co Claimant Name?" value={subData.coClaimantName} /> : <></>}
                            <TextField variant='outlined' label="Parent Name" value={subData.parentName} />
                            <TextField variant='outlined' label="Full Address" value={subData.address} />
                            <TextField variant='outlined' label="Social Category" value={subData.socialCategory} />
                            <TextField variant='outlined' label="Tribe Name" value={subData.tribeName} />
                            <TextField variant='outlined' label="Area in Hectares (xx.xx)" value={subData.area} />
                            <TextField variant='outlined' label="No. of Plots Claimed Under FRA" value={subData.fraPlotsClaimed} />
                            {
                                //@ts-ignore
                                [...Array(Number(subData?.fraPlotsClaimed)).keys()].map(el => <TextField variant='outlined' label={`Plot Number ${el + 1}`} value={subData[`plotNumber${el + 1}`]} />)
                            }
                            <TextField variant='outlined' label="Has ROR been updated?" value={subData.rorUpdated ? 'Yes' : 'No'} />
                            {subData?.rorUpdated ? <TextField variant='outlined' label="Khata Number" value={subData.khataNumber} /> : <></>}
                        </div>
                        <div className={styles.subData}>
                            <p>Submission Details</p>
                            <TextField variant='outlined' label="Submitter ID" value={record.submitterId} />
                            <TextField variant='outlined' label="Status" value={record.status} />
                            <TextField variant='outlined' label="SPDP Village ID" value={record.spdpVillageId} />
                            <TextField variant='outlined' label="Citizen ID" value={record.citizenId} />
                            <TextField variant='outlined' label="createdAt" value={new Date(record.createdAt).toDateString()} />
                            <TextField variant='outlined' label="capturedAt" value={new Date(record.capturedAt).toDateString()} />
                            <TextField variant='outlined' label="updatedAt" value={new Date(record.updatedAt).toDateString()} />
                        </div>
                    </div>
                }}
            />
        </SimpleShowLayout>
    </Show >
};

export default SubmissionsView;

// {
//     "area": "9999",
//     "address": "H",
//     "tribeName": "Birhor",
//     "parentName": "G",
//     "rorUpdated": false,
//     "landRecords": [
//         "df65a31a-4735-4698-890a-0160897553df.webp",
//         "df65a31a-4735-4698-890a-0160897553df.webp"
//     ],
//     "plotNumber1": "7",
//     "plotNumber2": "6",
//     "claimantName": "T",
//     "imageUploaded": false,
//     "socialCategory": "FDST",
//     "fraPlotsClaimed": "2",
//     "isAadhaarAvailable": false,
//     "coClaimantAvailable": false,
//     "landTitleSerialNumber": "Y"
// }