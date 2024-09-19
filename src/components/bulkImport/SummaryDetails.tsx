import React, { useState, useEffect } from "react";
import { TabBar, Tab } from "@dhis2/ui";
import { useRecoilValue } from "recoil";
import {
    BulkImportResponseStats,
    BulkImportResponseStatsState,
    type ProcessingRecords,
    ProcessingRecordsState,
    ProcessingStage
} from "../../schema/bulkImportSchema";
import { SummaryTable } from "./SummaryContent";
import { ImportSummaryTable } from "./DryRunAndImportSummary";
import Pagination from "../table/components/pagination/Pagination";
import { PaginationState } from "../../types/bulkImport/Interfaces";

const SummaryDetails = (): React.ReactElement => {
    const processedRecords: ProcessingRecords = useRecoilValue(ProcessingRecordsState);
    const processingStage: string = useRecoilValue(ProcessingStage);
    const bulkImportResponseStats: BulkImportResponseStats = useRecoilValue(BulkImportResponseStatsState);
    const [activeTab, setActiveTab] = useState("invalids");
    const [pagination, setPagination] = useState<PaginationState>({
        updates: { page: 1, pageSize: 10 },
        invalids: { page: 1, pageSize: 10 }
    });
    const [showErrorsOrConflicts, setShowErrorsOrConflicts] = useState<boolean>(true);

    useEffect(() => {
        if (activeTab === "updates") {
            setShowErrorsOrConflicts(false);
        } else {
            setShowErrorsOrConflicts(true);
        }
    }, [activeTab]);

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], page: newPage }
        }));
    };

    const getCurrentStudents = () => {
        switch (activeTab) {
            case "updates":
                return processedRecords?.recordsToUpdate ?? [];
            case "invalids":
                return processedRecords?.invalidRecords ?? [];
            default:
                return [];
        }
    };

    const students = getCurrentStudents();
    const total = students.length;
    const currentPage = pagination[activeTab].page;
    const tabPageSize = pagination[activeTab].pageSize;
    const displayData = students.slice((currentPage - 1) * tabPageSize, currentPage * tabPageSize).map((a) => {
        const search = processedRecords.validRecords?.find((r) => r.event === a.event);
        if (search) {
            return search
        }
        return a
    });

    console.log(processedRecords)

    const tabClick = (tab: string) => {
        if (["invalids"].includes(tab)) {
            setShowErrorsOrConflicts(true)
        } else {
            setShowErrorsOrConflicts(false)
        }
        setActiveTab(tab);
    };

    const onPageSizeChange = (pageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], pageSize, page: 1 }
        }));
    };

    return (
        <>
            {processingStage === "template-processing" && (
                <>
                    <TabBar>
                        <Tab
                            onClick={() => tabClick("updates")}
                            selected={activeTab === "updates"}
                        >
                            {processedRecords?.recordsToUpdate?.length ?? 0} <br />
                            Updates
                        </Tab>
                        <Tab
                            onClick={() => tabClick("invalids")}
                            selected={activeTab === "invalids"}
                        >
                            {processedRecords?.invalidRecords?.length ?? 0} <br />
                            Invalid Records
                        </Tab>
                    </TabBar>
                    <br />
                    <SummaryTable
                        displayData={displayData}
                        activeTab={activeTab}
                        showErrorsOrConflicts={showErrorsOrConflicts}
                    />
                    <br />
                    {total > 0 && (
                        <Pagination
                            page={currentPage}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={onPageSizeChange}
                            rowsPerPage={tabPageSize}
                            loading={false}
                            totalPerPage={displayData.length}
                        />
                    )}
                </>
            )}

            {["dry-run", "import", "completed"].includes(processingStage) && (
                <ImportSummaryTable
                    status={bulkImportResponseStats?.status}
                    validationReport={bulkImportResponseStats?.validationReport}
                    stats={bulkImportResponseStats?.stats}
                    bundleReport={bulkImportResponseStats?.bundleReport}
                />
            )}
        </>
    );
};

export default SummaryDetails;
