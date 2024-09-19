import React, { useState, useEffect } from "react";
import { Divider, IconCheckmarkCircle16, IconInfo16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import styles from "./modal.module.css";
import SummaryCards from "./SummaryCards";
import { Collapse, LinearProgress } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { Title } from "../text";
import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import { usePostEvent, useShowAlerts } from "../../hooks";
import { usePromotionSummaryHeader } from "../../hooks/tableHeader/usePromotionSummaryHeader";
import { ProcessingRecordsState, ProcessingStage, BulkImportResponseStatsState } from "../../schema/bulkImportSchema";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatPromotionSummaryRows } from "../../utils/table/rows/formatPromotionSummaryRows";
import { TableComponent } from "../table/components";
import RenderHeader from "../table/render/RenderHeader";
import RenderRows from "../table/render/RenderRows";
import { WithPadding } from "../template";
import { ButtonActionProps } from "../../types/Buttons/ButtonActions";
import { usePostTrackedEntities } from "../../hooks/bulkImport/postTrackedEntities";
import { TrackedEntity } from "../../types/generated";

interface ModalContentProps {
    setOpen: (value: boolean) => void;
    summaryData: any;
    summaryDetails?: React.ReactElement
}

function ModalSummaryContent(props: ModalContentProps): React.ReactElement {
    const { setOpen, summaryData, summaryDetails } = props;
    const { columns } = usePromotionSummaryHeader();
    const [showDetails, setShowDetails] = useState(false);
    const programConfig = useRecoilValue(ProgramConfigState);
    const processedRecords = useRecoilValue(ProcessingRecordsState);
    const [processingStage, setProcessingStage] = useRecoilState(ProcessingStage);
    const [bulkImportResponseStats, setBulkImportResponseStats] = useRecoilState(BulkImportResponseStatsState);
    const resetBulkImportResponseStats = useResetRecoilState(BulkImportResponseStatsState);
    const resetBulkImportResponseStatsState = useResetRecoilState(BulkImportResponseStatsState)
    const {
        loading,
        postTrackedEntities,
    } = usePostTrackedEntities()
    const { show } = useShowAlerts(); 
    const [loaders, setLoaders] = useState({ dryRun: false, importation: false });
    const [disableButtons, setDisableButtons] = useState(false);

    const [notificationShown, setNotificationShown] = useState({ dryRun: false, importation: false });

    useEffect(() => {
        if (!notificationShown.dryRun && processingStage === "dry-run") {
            setLoaders({ dryRun: false, importation: false });
            setNotificationShown({ ...notificationShown, dryRun: true });
            show({ message: "Dry Run successful. No errors found.", type: { success: true } });
        }

        if (!notificationShown.importation && processingStage === "update") {
            setLoaders({ dryRun: false, importation: false });
            setNotificationShown({ ...notificationShown, importation: true });
            show({ message: "Final Decisions updated successfully.", type: { success: true } });
            setDisableButtons(true); 
        }
    }, [show, processingStage, notificationShown]);

    const handleShowDetails = () => setShowDetails(!showDetails);

    const summaryTitle = processingStage === "template-processing"
    ? "Template Processing"
    : processingStage === "dry-run"
        ? "Dry Run"
        : "Import"

    const updateFinalDecision = (importMode: "VALIDATE" | "COMMIT") => {
        resetBulkImportResponseStatsState()
        if (importMode === "VALIDATE") {
            setProcessingStage("dry-run")
        } else {
            setProcessingStage("import")
        }
        const params = {
            async: false,
            importMode,
            importStrategy: "CREATE_AND_UPDATE"
        }
        try {
            const eventsPayload: any = {
                events: processedRecords?.updateEvents
            }
            void postTrackedEntities({
                data: eventsPayload,
                params
            })
        } catch (error: any) {
            console.error("Error importing Tracked Entities: ", error)
        }
    }

    const updatesDisabled = !processedRecords.updateEvents?.length || loaders.importation || disableButtons;

    const modalActions: ButtonActionProps[] = [
        {
            label: "Dry Run",
            loading: false,
            disabled: updatesDisabled,
            onClick: () => {
                updateFinalDecision("VALIDATE")
            }
        },
        {
            label: processedRecords?.updateEvents ? "Update Final Decisions" : "Import new students",
            primary: true,
            loading: false,
            disabled: updatesDisabled ,
            onClick: () => {
                updateFinalDecision("COMMIT")
            }
        },
        {
            label: "Close",
            disabled: loading,
            loading: false,
            onClick: () => {
                setOpen(false)
            }
        }
    ];

    return (
        <div>
            <Tag positive icon={<IconCheckmarkCircle16/>} className={styles.tagContainer}> Final Decision Update
                preview </Tag>

            <WithPadding/>
            <Title label={`${summaryTitle} Summary`}/>
            <WithPadding/>

            <SummaryCards {...summaryData} />

            <WithPadding/>
            <WithPadding/>
            <ButtonStrip>
                <Button small icon={<InfoOutlined className={styles.infoIcon}/>} onClick={handleShowDetails}>More
                    details</Button>
            </ButtonStrip>

            <WithPadding/>
            <Collapse in={showDetails}>
                <div className={styles.detailsContainer}>
                    {summaryDetails}
                </div>
            </Collapse>

            {loading && <LinearProgress />}
            <Divider/>
            <ModalActions>
                <ButtonStrip end>
                    {modalActions.map((action, i) => (
                        <Button
                            key={i}
                            {...action}
                        >
                            {action.label}
                        </Button>
                    ))}
                </ButtonStrip>
            </ModalActions>
        </div>
    );
}

export default ModalSummaryContent;
