import React, { useEffect, useState } from "react";
import { Divider, IconCheckmarkCircle16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import styles from "./modal.module.css";
import Title from "../text/Title";
import { Collapse, LinearProgress } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import SummaryCards from "./SummaryCards";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { usePostEvent } from "../../hooks";
import { BulkImportResponseStats, BulkImportResponseStatsState, ProcessingRecords, ProcessingRecordsState, ProcessingStage } from "../../schema/bulkImportSchema";
import { ApiResponse } from "../../types/bulkImport/Interfaces";
import { ButtonActionProps } from "../../types/Buttons/ButtonActions";

interface ModalContentProps {
    setOpen: (value: boolean) => void;
    summaryData: any;
    summaryDetails?: React.ReactElement;
}

const ModalSummaryContent = (props: ModalContentProps): React.ReactElement => {
    const { setOpen, summaryData, summaryDetails } = props;
    const [showDetails, setShowDetails] = useState(false);
    
    // Recoil states
    const processedRecords: ProcessingRecords = useRecoilValue(ProcessingRecordsState);
    const [processingStage, setProcessingStage] = useRecoilState<string>(ProcessingStage);
    const [bulkImportResponseStatsState, setBulkImportResponseStatsState] = useRecoilState<BulkImportResponseStats>(BulkImportResponseStatsState);
    const resetBulkImportResponseStatsState = useResetRecoilState(BulkImportResponseStatsState);

    // Event posting hooks
    const { loadUpdateEvent: loading, updateEvent, data, error } = usePostEvent();

    useEffect(() => {
        if (data !== undefined) {
            console.log("Posting Data....", data);
            const { validationReport } = data;
            if (processingStage === "dry-run") {
                setBulkImportResponseStatsState({
                    ...bulkImportResponseStatsState,
                    validationReport,
                    stats: data.stats,
                    status: data.status,
                    bundleReport: data.bundleReport,
                });
            } else if (processingStage === "update") {
                setBulkImportResponseStatsState({
                    ...bulkImportResponseStatsState,
                    validationReport,
                    stats: data.stats,
                    status: data.status,
                    bundleReport: data.bundleReport,
                });
                setProcessingStage("completed");
            }
        }
    }, [data]);

    useEffect(() => {
        if (error !== undefined) {
            const importResponse: ApiResponse = error.details as unknown as ApiResponse;
            setBulkImportResponseStatsState({
                ...bulkImportResponseStatsState,
                validationReport: importResponse.validationReport,
                stats: importResponse.stats,
                status: importResponse.status,
            });
        }
    }, [error]);

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    };

    const summaryTitle = processingStage === "template-processing" ? "Template Processing" : processingStage === "dry-run" ? "Dry Run" : "Update";

    const updateMarks = async (importMode: "VALIDATE" | "COMMIT") => {
        resetBulkImportResponseStatsState();
        setProcessingStage(importMode === "VALIDATE" ? "dry-run" : "update");

        console.log("Update Events: ", processedRecords?.updateEvents, importMode, processingStage);
        const params = {
            async: false,
            importMode,
            importStrategy: "CREATE_AND_UPDATE",
        };

        try {
            const EventsPayload: any = {
                events: processedRecords?.updateEvents,
            };
            await updateEvent({
                data: EventsPayload,
                params,
            });
        } catch (error: any) {
            console.error("Error updating marks: ", error);
        }
    };

    // Disable button if no update events or already completed
    const updatesDisabled = processedRecords.updateEvents?.length === 0 || processingStage === "completed" || loading;

    const modalActions: ButtonActionProps[] = [
        {
            label: "Dry Run",
            loading: false,
            disabled: updatesDisabled,
            onClick: () => {
                updateMarks("VALIDATE");
            },
        },
        {
            label: "Update Final Decisions",
            primary: true,
            loading: false,
            disabled: updatesDisabled,
            onClick: () => {
                updateMarks("COMMIT");
            },
        },
        {
            label: "Close",
            disabled: loading,
            loading: false,
            onClick: () => {
                setOpen(false);
            },
        },
    ];

    return (
        <div>
            <Tag positive icon={<IconCheckmarkCircle16 />} className={styles.tagContainer}>
                Students import preview
            </Tag>

            <WithPadding />
            <Title label={`${summaryTitle} Summary`} />
            <WithPadding />

            <SummaryCards {...summaryData} />

            <WithPadding />
            <WithPadding />
            <ButtonStrip>
                <Button small icon={<InfoOutlined className={styles.infoIcon} />} onClick={handleShowDetails}>
                    More details
                </Button>
            </ButtonStrip>

            <WithPadding />
            <Collapse in={showDetails}>
                <div className={styles.detailsContainer}>
                    {summaryDetails ? summaryDetails : <p>No additional details available</p>}
                </div>
            </Collapse>

            {loading && <LinearProgress />}
            <Divider />
            <ModalActions>
                <ButtonStrip end>
                    {modalActions.map((action, i) => (
                        <Button key={i} {...action}>
                            {action.label}
                        </Button>
                    ))}
                </ButtonStrip>
            </ModalActions>
        </div>
    );
};

export default ModalSummaryContent;
