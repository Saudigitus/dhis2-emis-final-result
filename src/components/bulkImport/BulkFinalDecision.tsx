import React, { useState } from 'react';

import { createStyles, createTheme, makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { DropzoneDialog } from "material-ui-dropzone";
import { CloudUpload } from "@material-ui/icons";
import { read, utils } from "xlsx";
import { CenteredContent, CircularLoader, Modal, ModalContent, ModalTitle } from "@dhis2/ui";
import styles from "./modal.module.css";
import { type ProgramConfig } from "../../types/programConfig/ProgramConfig";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { ProgramConfigState } from "../../schema/programSchema";
import ModalSummaryContent from './ModalSummaryContent';
import { BulkImportStats, BulkImportStatsState, ProcessingRecords, ProcessingRecordsState, ProcessingStage } from '../../schema/bulkImportSchema';
import SummaryDetails from './SummaryDetails';
import { generateData, getFinalResultDataFromTemplate, createUpdatePayload } from '../../utils/bulkImport/processImportData';
import useGetUsedPProgramStages from "../../hooks/programStages/useGetUsedPProgramStages";


interface BulkFinalDecisionProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
    forUpdate: boolean
}

export const BulkFinalDecision = ({ setOpen, isOpen, forUpdate }: BulkFinalDecisionProps) => {
    const programConfig: ProgramConfig = useRecoilValue<ProgramConfig>(ProgramConfigState)
    const [isProcessing, setIsProcessing] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const resetProcessingStage = useResetRecoilState(ProcessingStage);
    const performanceStages = useGetUsedPProgramStages()
    const [uploadStats, setUploadStats] = useRecoilState<BulkImportStats>(BulkImportStatsState);
    const [_processedRecords, setProcessedRecords] = useRecoilState<ProcessingRecords>(ProcessingRecordsState);
    const finalResultStage = performanceStages.map((p: string) => {
        return p;
    })

    const useStyles = makeStyles(() => createStyles({
        previewChip: {
            minWidth: 160,
            maxWidth: 210
        }
    }));
    const theme = createTheme({
        overrides: {}
    });
    const classes = useStyles();
    const handleFileChange = (file: File) => {
        resetProcessingStage()
        setIsProcessing(true)
        setSummaryOpen(true)
        const reader: FileReader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            const data: Uint8Array = new Uint8Array(e.target?.result as any);
            const workbook = read(data, {
                type: 'array',
                cellDates: true,
                cellNF: false,
                dateNF: "YYYY-MM-DD",
                cellText: true
            });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rawData = utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: "" });

            if (!rawData[2]) {
                console.error("Headers row is missing in the uploaded file.");
                return;
            }
            const headers: string[] = rawData[2] as string[];
            const dataWithHeaders: Array<Record<string, any>> = generateData(headers, rawData.slice(3));
            const finalResultData = getFinalResultDataFromTemplate(dataWithHeaders, finalResultStage, programConfig);
            const events = createUpdatePayload(finalResultData);
            console.log("events", events);

            setUploadStats(stats => ({
                ...stats,
                events: {
                    ...stats.events,
                    updated: events.length,
                    conflicts: 0
                }
            }))
            setProcessedRecords((r) => ({
                ...r,
                recordsToUpdate: finalResultData,
                updateEvents: events,
                validRecords: dataWithHeaders,
            }))

            setIsProcessing(false)
        };
        reader.readAsArrayBuffer(file);
    }

    const onSave = (files: File[]) => {
        handleFileChange(files[0])
    }
    return (
        <>
            {(!isProcessing && !summaryOpen) &&
                <MuiThemeProvider theme={theme}>
                    <DropzoneDialog
                        dialogTitle={"Bulk Final Decision Upload"}
                        submitButtonText={"Start Import"}
                        dropzoneText={"Drag and drop a file here or Browse"}
                        Icon={CloudUpload as any}
                        filesLimit={1}
                        showPreviews={false}
                        showPreviewsInDropzone={true}
                        previewGridProps={{
                            container: {
                                spacing: 1,
                                direction: 'row'
                            }
                        }}
                        previewChipProps={{ classes: { root: classes.previewChip } }}
                        previewText="Selected file:"
                        showFileNames={true}
                        showFileNamesInPreview={true}
                        acceptedFiles={[".xlsx"]}
                        open={isOpen}
                        onClose={() => {
                            setOpen(false)
                        }}
                        onSave={onSave}
                        clearOnUnmount={true}
                    />
                </MuiThemeProvider>
            }
            {(summaryOpen) && (
                <Modal large position={"middle"} className={styles.modalContainer}>
                    <ModalTitle>{isProcessing ? "Processing Bulk Decision Upload" : "Bulk Decision Upload Summary"}</ModalTitle>
                    <ModalContent>
                        {isProcessing
                            ? <CenteredContent className="p-5"><CircularLoader /></CenteredContent>
                            : <ModalSummaryContent
                                setOpen={setSummaryOpen}
                                summaryData={
                                    {
                                        updated: uploadStats.events.updated,
                                        created: uploadStats.events.created,
                                        conflicts: uploadStats.events.conflicts,
                                        duplicates: uploadStats.events.updated,
                                        invalid: uploadStats.events.invalid
                                    }
                                }
                                summaryDetails={
                                    <>
                                        <SummaryDetails />
                                    </>
                                }
                            />
                        }
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}