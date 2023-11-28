import * as React from "react";
import { useEffect, useState, useRef } from 'react';
import { Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FunctionField, BooleanInput, useRecordContext, Button } from 'react-admin';
import styles from './SubmissionsEdit.module.scss';
import CancelIcon from '@mui/icons-material/Cancel';
import { getImageFromMinio } from "../../utils/getImageFromMinio";
import ImageViewer from 'react-simple-image-viewer';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Icon from '@mui/material/Icon';

const SubmissionsEdit = () => {
    const [subData, setSubData] = React.useState<any>(null);
    const [feedbackState, setFeedbackState] = React.useState<any>({});

    let fetchingLandImages = React.useRef(false);
    let fetchingRorImages = useRef(false);
    const [landImages, setLandImages] = useState<any>([]);
    const [rorImages, setRorImages] = useState<any>([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

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

    React.useEffect(() => {
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

    const openImageViewer = React.useCallback((index: string | number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const PlotInputs = () => {
        if (subData?.fraPlotsClaimed)
            //@ts-ignore
            return [...Array(Number(subData?.fraPlotsClaimed)).keys()].map(el => <>
                <div className={styles.inputContainer}>
                    <TextInput disabled label={`Plot Number ${el + 1}`} source={`submissionData.plotNumber${el + 1}`} fullWidth />
                    {feedbackState?.[`plotNumber${el + 1}`] ?
                        <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick(`plotNumber${el + 1}`)} />
                        : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick(`plotNumber${el + 1}`)} fontSize="large" />
                    }
                </div>
                {feedbackState?.[`plotNumber${el + 1}`] ? <TextInput required label={`Feedback for Plot Number ${el + 1}`} source={`feedbackData.plotNumber${el + 1}`} /> : <></>}

            </>)
        return <></>
    }

    const handleFeedbackClick = (source: string) => {
        setFeedbackState((prevState: any) => ({ ...prevState, [source]: prevState?.[source] ? false : true }))
    }

    console.log({ feedbackState })
    return <Edit>
        <SimpleForm>
            <div className={styles.mainContainer}>
                <div className={styles.formContainer}>
                    <h2>Form Details</h2>

                    {/*Aadhar Input*/}
                    <div className={styles.inputContainer}>
                        <BooleanInput disabled label="Aadhaar Available?" source="submissionData.isAadhaarAvailable" />
                        {feedbackState?.isAadhaarAvailable ?
                            <CancelIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("isAadhaarAvailable")} />
                            : <AddCommentIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("isAadhaarAvailable")} fontSize="large" />}

                    </div>
                    {feedbackState?.isAadhaarAvailable ? <TextInput required label="Feedback for Aadhaar Available" source="feedbackData.isAadhaarAvailable" /> : <></>}

                    {/*Aadhar Number Input*/}
                    <FunctionField render={(record: any) => {
                        if (!subData) setSubData(record.submissionData)
                        if (record?.submissionData?.landRecords?.length && !landImages?.length) {
                            setLandImages(record?.submissionData?.landRecords)
                        }
                        if (record?.submissionData?.rorRecords?.length && !rorImages?.length) {
                            setRorImages(record?.submissionData?.rorRecords)
                        }
                        if (record?.submissionData?.isAadhaarAvailable) {
                            return <TextInput disabled label="Aadhaar Number" source="submissionData.aadharNumber" />
                        }
                    }} />

                    {/*Land Title Serial Number*/}
                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Land Title Serial Number" source="submissionData.landTitleSerialNumber" fullWidth />
                        {feedbackState?.landTitleSerialNumber ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("landTitleSerialNumber")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("landTitleSerialNumber")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.landTitleSerialNumber ? <TextInput required label="Feedback for Land Title Serial Number" source="feedbackData.landTitleSerialNumber" /> : <></>}


                    {/*Claimant Name*/}
                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Claimant Name" source={"submissionData.claimantName"} fullWidth />
                        {feedbackState?.claimantName ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("claimantName")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("claimantName")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.claimantName ? <TextInput required label="Feedback for Claimant Name" source="feedbackData.claimantName" /> : <></>}


                    {/*Co Claimant Available */}
                    <div className={styles.inputContainer}>
                        <BooleanInput disabled label="Co Claimant Available?" source={"submissionData.coClaimantAvailable"} />
                        {feedbackState?.coClaimantAvailable ?
                            <CancelIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("coClaimantAvailable")} />
                            : <AddCommentIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("coClaimantAvailable")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.coClaimantAvailable ? <TextInput required label="Feedback for Co Claimant Available" source="feedbackData.coClaimantAvailable" /> : <></>}

                    <FunctionField render={(record: any) => {
                        if (record?.submissionData?.coClaimantAvailable) {
                            return <>
                                <div className={styles.inputContainer}>
                                    <TextInput disabled label="Co Claimant Name" source="submissionData.coClaimantName" fullWidth />
                                    {feedbackState?.coClaimantName ?
                                        <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("coClaimantName")} />
                                        : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("coClaimantName")} fontSize="large" />
                                    }
                                </div>
                                {feedbackState?.coClaimantName ? <TextInput required label="Feedback for Co Claimant Name" source="feedbackData.coClaimantName" fullWidth /> : <></>}
                            </>
                        }
                    }} />


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Parent Name" source={"submissionData.parentName"} fullWidth />
                        {feedbackState?.landTitleSerialNumber ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("parentName")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("parentName")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.parentName ? <TextInput required label="Feedback for Parent Name" source="feedbackData.parentName" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Full Address" source={"submissionData.address"} fullWidth />
                        {feedbackState?.address ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("address")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("address")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.address ? <TextInput required label="Feedback for Address" source="feedbackData.address" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Social Category" source={"submissionData.socialCategory"} fullWidth />
                        {feedbackState?.socialCategory ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("socialCategory")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("socialCategory")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.socialCategory ? <TextInput required label="Feedback for Social Category" source="feedbackData.socialCategory" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Tribe Name" source={"submissionData.tribeName"} fullWidth />
                        {feedbackState?.tribeName ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("tribeName")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("tribeName")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.tribeName ? <TextInput required label="Feedback for Tribe Name" source="feedbackData.tribeName" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Area in Hectares (xx.xx)" source={"submissionData.area"} fullWidth />
                        {feedbackState?.area ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("area")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("area")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.area ? <TextInput required label="Feedback for Area" source="feedbackData.area" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="No. of Plots Claimed Under FRA" source={"submissionData.fraPlotsClaimed"} fullWidth />
                        {feedbackState?.fraPlotsClaimed ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("fraPlotsClaimed")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("fraPlotsClaimed")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.fraPlotsClaimed ? <TextInput required label="Feedback for Plots Claimed" source="feedbackData.fraPlotsClaimed" /> : <></>}



                    {PlotInputs()}

                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Has ROR been updated?" source={"submissionData.rorUpdated"} fullWidth />
                        {feedbackState?.rorUpdated ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("rorUpdated")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("rorUpdated")} fontSize="large" />
                        }
                    </div>
                    {feedbackState?.rorUpdated ? <TextInput required label="Feedback for ROR Updated" source="feedbackData.rorUpdated" /> : <></>}


                    <FunctionField render={(record: any) => {
                        if (record?.submissionData?.rorUpdated) {
                            return <TextInput disabled label="Khata Number" source="submissionData.khataNumber" />
                        }
                    }} />
                    <TextInput required label="Overall Feedback" source={"feedbackData.feedback"} />
                </div>
                <div className={styles.recordsContainer}>
                    <h2>Image Records</h2>
                    <h3 style={{ opacity: 0.8, margin: '1rem 0rem' }}>Land Records</h3>
                    <div className={styles.imagePreviewContainer}>
                        {landImages.map((image: string, index: number) => (
                            <div className={styles.imageContainer}>
                                <img src={image} alt="" width="150" onClick={() => openImageViewer(index)} style={{ borderRadius: '0.5rem' }} />
                            </div>
                        ))}
                        {isViewerOpen && (
                            <ImageViewer
                                src={landImages}
                                currentIndex={currentImage}
                                disableScroll={false}
                                closeOnClickOutside={true}
                                onClose={closeImageViewer}
                                backgroundStyle={{ position: 'fixed', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(2px)' }}
                                closeComponent={<p style={{ fontSize: '3rem', color: '#fff', paddingRight: '3rem', paddingTop: '3rem' }}>X</p>}
                            />
                        )}
                    </div>
                    <h3 style={{ opacity: 0.8, margin: '1rem 0rem' }}>ROR Records</h3>
                    <div>
                        <div className={styles.imagePreviewContainer}>
                            {rorImages.map((image: string, index: number) => (
                                <img src={image} alt="" width="100" onClick={() => openImageViewer(index)} />
                            ))}
                            {isViewerOpen && (
                                <ImageViewer
                                    src={rorImages}
                                    currentIndex={currentImage}
                                    disableScroll={false}
                                    closeOnClickOutside={true}
                                    onClose={closeImageViewer}
                                    backgroundStyle={{ background: 'rgba(0,0,0,0.1)', }}
                                    closeComponent={<p style={{ fontSize: '3rem', color: '#fff', paddingRight: '3rem', paddingTop: '3rem' }}>X</p>}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SimpleForm>
    </Edit >
};



export default SubmissionsEdit;