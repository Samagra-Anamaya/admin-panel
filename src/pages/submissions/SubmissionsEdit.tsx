import * as React from "react";
import { useEffect, useState, useRef } from 'react';
import { Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, required, FunctionField, BooleanInput, useRecordContext, Button, useStore, useTheme, Toolbar, SaveButton } from 'react-admin';
import styles from './SubmissionsEdit.module.scss';
import CancelIcon from '@mui/icons-material/Cancel';
import { getImageFromMinio } from "../../utils/getImageFromMinio";
import ImageViewer from 'react-simple-image-viewer';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Icon from '@mui/material/Icon';
import { ThemeName, themes } from "../../themes/themes";
import { TITLE_STATUS } from "../../enums/Status";

const disabled = (record: any) => {
    if (record?.status == TITLE_STATUS.FLAGGED || record?.status == TITLE_STATUS.APPROVED) return true;
    return false;
}

const EditToolbar: React.FC = props => {
    const record = useRecordContext();
    return <Toolbar {...props} sx={{ paddingBottom: 2 }}>
        <SaveButton disabled={disabled(record)} type="button" label="Approve" icon={null} sx={{ marginLeft: 5, padding: '0.5rem 2rem' }} transform={(data) => ({ ...data, status: 'VERIFIED' })} />
        <SaveButton disabled={disabled(record)} type="button" color="warning" icon={null} label="Flag" sx={{ marginLeft: 5, padding: '0.5rem 2rem' }} transform={(data) => ({ ...data, status: TITLE_STATUS.FLAGGED })} />
    </Toolbar>
};

const SubmissionsEdit = () => {
    const [subData, setSubData] = React.useState<any>(null);
    const [flag, setFlag] = useState(null);
    const [feedbackState, setFeedbackState] = React.useState<any>({});
    const [landImages, setLandImages] = useState<any>([]);
    const [rorImages, setRorImages] = useState<any>([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [landViewer, setLandViewer] = useState(false);
    const [rorViewer, setRoRViewer] = useState(false);
    const [theme, setTheme] = useTheme();
    console.log({ theme })
    let fetchingLandImages = React.useRef(false);
    let fetchingRorImages = useRef(false);

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

    const openImageViewer = React.useCallback((index: string | number, setter: Function) => {
        setCurrentImage(index);
        setter(true);
    }, []);

    const closeImageViewer = (setter: Function) => {
        setCurrentImage(0);
        setter(false);
    };

    const PlotInputs = () => {
        if (subData?.fraPlotsClaimed)
            //@ts-ignore
            return [...Array(Number(subData?.fraPlotsClaimed)).keys()].map(el => <>
                <div className={styles.inputContainer}>
                    <TextInput disabled label={`Plot Number ${el + 1}`} source={`submissionData.plotNumber${el + 1}`} fullWidth />
                    {flag == 'SUBMITTED' ? feedbackState?.[`plotNumber${el + 1}`] ?
                        <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick(`plotNumber${el + 1}`)} />
                        : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick(`plotNumber${el + 1}`)} fontSize="large" />
                        : null}
                </div>
                {feedbackState?.[`plotNumber${el + 1}`] || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label={`Feedback for Plot Number ${el + 1}`} source={`feedbackData.plotNumber${el + 1}`} /> : <></>}

            </>)
        return <></>
    }

    const handleFeedbackClick = (source: string) => {
        setFeedbackState((prevState: any) => ({ ...prevState, [source]: prevState?.[source] ? false : true }))
    }

    return <Edit mutationMode="pessimistic">
        <SimpleForm
            toolbar={<EditToolbar />}
        >
            <div className={styles.mainContainer}>
                <div className={styles.formContainer}>
                    <h2>Form Details</h2>

                    {/*Aadhar Input*/}
                    <div className={styles.inputContainer}>
                        <BooleanInput disabled label="Aadhaar Available?" source="submissionData.isAadhaarAvailable" />
                        {flag == 'SUBMITTED' ? feedbackState?.isAadhaarAvailable ?
                            <CancelIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("isAadhaarAvailable")} />
                            : <AddCommentIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("isAadhaarAvailable")} fontSize="large" />
                            : null}

                    </div>
                    {feedbackState?.isAadhaarAvailable || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Aadhaar Available" source="feedbackData.isAadhaarAvailable" /> : <></>}

                    {/*Aadhar Number Input*/}
                    <FunctionField render={(record: any) => {
                        if (!subData) setSubData(record.submissionData);
                        if (!flag) setFlag(record.status);
                        if (record?.submissionData?.landRecords?.length && !landImages?.length) {
                            setLandImages(record?.submissionData?.landRecords)
                        }
                        if (record?.submissionData?.rorRecords?.length && !rorImages?.length) {
                            setRorImages(record?.submissionData?.rorRecords)
                        }
                        if (record?.submissionData?.isAadhaarAvailable) {
                            return <>
                                <div className={styles.inputContainer}>
                                    <TextInput disabled label="Aadhaar Number" source="submissionData.aadharNumber" fullWidth />
                                    {flag == 'SUBMITTED' ? feedbackState?.aadharNumber ?
                                        <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("aadharNumber")} />
                                        : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("aadharNumber")} fontSize="large" />
                                        : null}
                                </div>
                                {feedbackState?.aadharNumber || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Aadhaar Number" source="feedbackData.aadharNumber" fullWidth /> : <></>}
                            </>
                        }
                    }} />

                    {/*Land Title Serial Number*/}
                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Land Title Serial Number" source="submissionData.landTitleSerialNumber" fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.landTitleSerialNumber ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("landTitleSerialNumber")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("landTitleSerialNumber")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.landTitleSerialNumber || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Land Title Serial Number" source="feedbackData.landTitleSerialNumber" /> : <></>}


                    {/*Claimant Name*/}
                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Claimant Name" source={"submissionData.claimantName"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.claimantName ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("claimantName")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("claimantName")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.claimantName || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Claimant Name" source="feedbackData.claimantName" /> : <></>}


                    {/*Co Claimant Available */}
                    <div className={styles.inputContainer}>
                        <BooleanInput disabled label="Co Claimant Available?" source={"submissionData.coClaimantAvailable"} />
                        {flag == 'SUBMITTED' ? feedbackState?.coClaimantAvailable ?
                            <CancelIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("coClaimantAvailable")} />
                            : <AddCommentIcon sx={{ marginTop: '0.25rem !important' }} className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("coClaimantAvailable")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.coClaimantAvailable || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Co Claimant Available" source="feedbackData.coClaimantAvailable" /> : <></>}

                    <FunctionField render={(record: any) => {
                        if (record?.submissionData?.coClaimantAvailable) {
                            return <>
                                <div className={styles.inputContainer}>
                                    <TextInput disabled label="Co Claimant Name" source="submissionData.coClaimantName" fullWidth />
                                    {flag == 'SUBMITTED' ? feedbackState?.coClaimantName ?
                                        <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("coClaimantName")} />
                                        : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("coClaimantName")} fontSize="large" />
                                        : null}
                                </div>
                                {feedbackState?.coClaimantName || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Co Claimant Name" source="feedbackData.coClaimantName" fullWidth /> : <></>}
                            </>
                        }
                    }} />


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Parent Name" source={"submissionData.parentName"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.parentName ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("parentName")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("parentName")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.parentName || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Parent Name" source="feedbackData.parentName" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Full Address" source={"submissionData.address"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.address ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("address")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("address")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.address || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Address" source="feedbackData.address" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Social Category" source={"submissionData.socialCategory"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.socialCategory ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("socialCategory")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("socialCategory")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.socialCategory || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Social Category" source="feedbackData.socialCategory" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Tribe Name" source={"submissionData.tribeName"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.tribeName ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("tribeName")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("tribeName")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.tribeName || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Tribe Name" source="feedbackData.tribeName" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Area in Hectares (xx.xx)" source={"submissionData.area"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.area ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("area")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("area")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.area || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Area" source="feedbackData.area" /> : <></>}


                    <div className={styles.inputContainer}>
                        <TextInput disabled label="No. of Plots Claimed Under FRA" source={"submissionData.fraPlotsClaimed"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.fraPlotsClaimed ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("fraPlotsClaimed")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("fraPlotsClaimed")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.fraPlotsClaimed || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Plots Claimed" source="feedbackData.fraPlotsClaimed" /> : <></>}



                    {PlotInputs()}

                    <div className={styles.inputContainer}>
                        <TextInput disabled label="Has ROR been updated?" source={"submissionData.rorUpdated"} fullWidth />
                        {flag == 'SUBMITTED' ? feedbackState?.rorUpdated ?
                            <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("rorUpdated")} />
                            : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("rorUpdated")} fontSize="large" />
                            : null}
                    </div>
                    {feedbackState?.rorUpdated || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for ROR Updated" source="feedbackData.rorUpdated" /> : <></>}


                    <FunctionField render={(record: any) => {
                        if (record?.submissionData?.rorUpdated) {
                            return <>
                                <div className={styles.inputContainer}>
                                    <TextInput disabled label="Khata Number" source="submissionData.khataNumber" fullWidth />
                                    {flag == 'SUBMITTED' ? feedbackState?.khataNumber ?
                                        <CancelIcon className={styles.iconStyle} fontSize="large" color="error" onClick={() => handleFeedbackClick("khataNumber")} />
                                        : <AddCommentIcon className={styles.iconStyle} color="error" onClick={() => handleFeedbackClick("khataNumber")} fontSize="large" />
                                        : null}
                                </div>
                                {feedbackState?.khataNumber || flag != 'SUBMITTED' ? <TextInput disabled={flag != 'SUBMITTED'} required label="Feedback for Khata Number" source="feedbackData.khataNumber" fullWidth /> : <></>}
                            </>
                        }
                    }} />

                    <TextInput disabled={flag != 'SUBMITTED'} label="Overall Feedback" source={"feedbackData.feedback"} />


                </div>
                <div className={styles.recordsContainer} style={theme == 'dark' ? { background: 'none' } : {}}>
                    <h2>Image Records</h2>
                    <h3 style={{ opacity: 0.8, margin: '1rem 0rem' }}>Land Records</h3>
                    <div className={styles.imagePreviewContainer}>
                        {landImages.map((image: string, index: number) => (
                            <div className={styles.imageContainer}>
                                <img src={image} alt="" width="150" onClick={() => openImageViewer(index, setLandViewer)} style={{ borderRadius: '0.5rem' }} />
                            </div>
                        ))}
                        {landViewer && (
                            <ImageViewer
                                src={landImages}
                                currentIndex={currentImage}
                                disableScroll={false}
                                closeOnClickOutside={true}
                                onClose={() => closeImageViewer(setLandViewer)}
                                backgroundStyle={{ position: 'fixed', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(2px)' }}
                                closeComponent={<p style={{ fontSize: '3rem', color: '#fff', paddingRight: '3rem', paddingTop: '3rem' }}>X</p>}
                            />
                        )}
                    </div>
                    <h3 style={{ opacity: 0.8, margin: '1rem 0rem' }}>ROR Records</h3>
                    <div>
                        <div className={styles.imagePreviewContainer}>
                            {rorImages.map((image: string, index: number) => (
                                <img src={image} alt="" width="150" onClick={() => openImageViewer(index, setRoRViewer)} style={{ borderRadius: '0.5rem' }} />
                            ))}
                            {rorViewer && (
                                <ImageViewer
                                    src={rorImages}
                                    currentIndex={currentImage}
                                    disableScroll={false}
                                    closeOnClickOutside={true}
                                    onClose={() => closeImageViewer(setRoRViewer)}
                                    backgroundStyle={{ position: 'fixed', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(2px)' }}
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