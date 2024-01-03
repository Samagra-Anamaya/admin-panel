// in src/posts.jsx
import { Typography } from '@mui/material';
import { TextField } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react';
import { Show, SimpleShowLayout, useRecordContext, FunctionField } from 'react-admin';
import { getImageFromMinio } from '../../utils/getImageFromMinio';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import ImageViewer from 'react-simple-image-viewer';
import { Carousel } from 'react-responsive-carousel';

import styles from './SubmissionsView.module.css';
const SubmissionsView = () => {
    let fetchingLandImages = useRef(false);
    let fetchingRorImages = useRef(false);
    const [landImages, setLandImages] = useState<any>([]);
    const [rorImages, setRorImages] = useState<any>([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [imageViewer, setImageViewer] = useState(false);
    const [rorImageViewer, setRorImageViewer] = useState(false);

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

    const openImageViewer = useCallback((index: string | number, setter: Function) => {
        setCurrentImage(index);
        setter(true);
    }, []);

    const closeImageViewer = useCallback((setter: Function) => {
        setCurrentImage(0);
        setter(false);
    }, []);


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
                            {subData?.isAadhaarAvailable ? <TextField variant='outlined' label="Aadhaar Number" value={subData.aadharNumber} /> : <></>}
                            <TextField variant='outlined' label="Land Title Serial Number" value={subData.landTitleSerialNumber} />
                            <Carousel onClickItem={(index: any) => openImageViewer(index, setImageViewer)}>
                                {landImages?.map((el: string, index: number) => <img src={el} style={{ width: '30%' }} />)}
                            </Carousel>
                            <TextField variant='outlined' label="Claimant Name" value={subData.claimantName} />
                            <TextField variant='outlined' label="No. of Co Claimants Available" value={subData.noOfCoClaimants} />
                            {
                                //@ts-ignore
                                [...Array(Number(subData?.noOfCoClaimants)).keys()].map(el => <TextField variant='outlined' label={`Co Claimant ${el + 1} Name`} value={subData[`coClaimant${el + 1}`]} />)
                            }
                            <TextField variant='outlined' label="No. of Dependents Available" value={subData.noOfDependents} />
                            {
                                //@ts-ignore
                                [...Array(Number(subData?.noOfDependents)).keys()].map(el => <TextField variant='outlined' label={`Dependant ${el + 1} Name`} value={subData[`dependent${el + 1}`]} />)
                            }
                            <TextField variant='outlined' label="Parent Name" value={subData.parentName} />
                            <TextField variant='outlined' label="Full Address" value={subData.address} />
                            <TextField variant='outlined' label="Tribe Name" value={subData.tribeName} />
                            <TextField variant='outlined' label="Area Units" value={subData.areaUnits} />
                            <TextField variant='outlined' label="Area in Hectares (xx.xx)" value={subData.area} />
                            <TextField variant='outlined' label="No. of Plots Claimed Under FRA" value={subData.fraPlotsClaimed} />
                            {
                                //@ts-ignore
                                [...Array(Number(subData?.fraPlotsClaimed)).keys()].map(el => <TextField variant='outlined' label={`Plot Number ${el + 1}`} value={subData[`plotNumber${el + 1}`]} />)
                            }
                            <TextField variant='outlined' label="Has ROR been updated?" value={subData.rorUpdated ? 'Yes' : 'No'} />
                            <Carousel onClickItem={(index: any) => openImageViewer(index, setRorImageViewer)}>
                                {rorImages?.map((el: string) => <img src={el} style={{ width: '30%' }} />)}
                            </Carousel>
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
                        {imageViewer && <ImageViewer
                            src={landImages}
                            currentIndex={currentImage}
                            disableScroll={false}
                            closeOnClickOutside={true}
                            onClose={() => closeImageViewer(setImageViewer)}
                            backgroundStyle={{ position: 'fixed', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(2px)' }}
                            closeComponent={<p style={{ fontSize: '3rem', color: '#fff', paddingRight: '3rem', paddingTop: '3rem' }}>X</p>}
                        />}
                        {rorImageViewer && <ImageViewer
                            src={rorImages}
                            currentIndex={currentImage}
                            disableScroll={false}
                            closeOnClickOutside={true}
                            onClose={() => closeImageViewer(setRorImageViewer)}
                            backgroundStyle={{ position: 'fixed', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(2px)' }}
                            closeComponent={<p style={{ fontSize: '3rem', color: '#fff', paddingRight: '3rem', paddingTop: '3rem' }}>X</p>}
                        />}
                    </div>
                }}
            />
        </SimpleShowLayout>
    </Show >
};

export default SubmissionsView;