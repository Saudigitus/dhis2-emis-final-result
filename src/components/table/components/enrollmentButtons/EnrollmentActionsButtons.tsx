import Tooltip from "@material-ui/core/Tooltip";
import { CloudUpload } from "@material-ui/icons";
import { DropzoneDialog } from "material-ui-dropzone";
import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useShowAlerts } from "../../../../hooks/commons/useShowAlert";
import SummaryCard from "../../../card/SummaryCard";
import { useDataEngine } from "@dhis2/app-runtime";
import {
  Button,
  ButtonStrip,
  IconAddCircle24,
  IconUserGroup16,
  ModalActions,
  TabBar,
  Tab,
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableCell,
  DataTableColumnHeader,
  DataTableRow,
  IconChevronDown16,
  IconChevronRight16,
  Divider,
  Tag,
  IconCheckmarkCircle16
} from "@dhis2/ui";
import Collapse from "@material-ui/core/Collapse";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import {
  ImportContent,
  ModalComponent,
  ModalContentComponent,
  ModalContentPromotion,
  WithPadding
} from "../../../../components";
import {
  useGetEnrollmentForm,
  useHeader,
  useQueryParams
} from "../../../../hooks";
import { RowSelectionState } from "../../../../schema/tableSelectedRowsSchema";
import type { ButtonActionProps } from "../../../../types/Buttons/ButtonActions";
import type { FlyoutOptionsProps } from "../../../../types/Buttons/FlyoutOptionsProps";
import { getSelectedKey } from "../../../../utils/commons/dataStore/getSelectedKey";
import DropdownButtonComponent from "../../../button/DropdownButton";
import ModalSummaryContent from "../../../modal/components/SummaryModalContent";
import ModalExportTemplateContent from "../../../modal/ModalExportTemplateContent";
import styles from "./enrollmentActionsButtons.module.css";
import { teiRefetch } from "../../../../schema/teiRefetchSchema";
// import { HeaderFieldsState } from "../../../../schema/headersSchema";
import IteractiveProgress from "../../../progress/interactiveProgress";
import { ProgressState } from "../../../../schema/linearProgress";
import DropZone from "../../../dropzone/DropZone"


function EnrollmentActionsButtons() {
  // const headerFieldsState = useRecoilValue(HeaderFieldsState);
  const [isUpdated, setIsUpdated] = useState(false);
  const [finalUpdatedCount, setFinalUpdatedCount] = useState(0);
  const [finalIgnoredCount, setFinalIgnoredCount] = useState(0);
  const [progress, updateProgress] = useRecoilState(ProgressState);
  const { columns } = useHeader();
  const engine = useDataEngine();
  const { getDataStoreData } = getSelectedKey();
  const [open, setOpen] = useState<boolean>(false);
  const [openPromotion, setOpenPromotion] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [openSummary, setOpenSummary] = useState<boolean>(false);
  const [openStudentUpdate, setOpenStudentUpdate] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>({});
  const [rowData, setRowData] = useState<any[]>([]);
  const [ignoredEvents, setIgnoredEvents] = useState<any[]>([]);
  const [foundEvents, setFoundEvents] = useState<any[]>([]); // Track events to be sent to the system
  const [, setRefresh] = useRecoilState(teiRefetch);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [validValues] = useState<string[]>([]);
  const { show } = useShowAlerts();
  const [loaders, setLoaders] = useState<{
    dryRun: boolean;
    importation: boolean;
  }>({ dryRun: false, importation: false });
  const { useQuery, urlParamiters } = useQueryParams();
  const { grade, class: currentClass } = urlParamiters();
  const orgUnit = useQuery().get("school");
  const [selected] = useRecoilState(RowSelectionState);
  const { enrollmentsDetailsData } = useGetEnrollmentForm();
  const [openExportEmptyTemplate, setOpenExportEmptyTemplate] =
    useState<boolean>(false);
  const [, setReport] = useState<{
    created: number;
    updated: number;
    deleted: number;
    ignored: number;
  }>({ deleted: 0, ignored: 0, created: 0, updated: 0 });
  const [, setTemplate] = useState<string>("validation");
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { registration, "final-result": finalResult } = getDataStoreData;
  const { programStage } = finalResult;

  const [activeTab, setActiveTab] = useState<string>("updates");

  const noFinalResultStudentSelected = selected.selectedRows.filter(
    (selectedRow: any) => !selectedRow?.dataValues?.[0]?.value
  );

  const handleShowDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleRowExpansion = (index: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  const validateData = (event: any) => {
    const errors: Array<{ field: string; value: string; error: string }> = [];

    if (!validValues.includes(event[`${programStage}.${finalResult.status}`])) {
      errors.push({
        field: "Final Decision",
        value: event[`${finalResult.programStage}.${finalResult.status}`],
        error: `Invalid value. Expected one of: ${validValues.join(", ")}.`
      });
    }

    return errors;
  };

  const getErrors = (event: any) => {
    return validateData(event);
  };

  const enrollmentOptions: FlyoutOptionsProps[] = [
    {
      label: "Bulk final decision",
      divider: false,
      onClick: () => {
        setIsOpen(() => true)
        setRowData(() => [])
        setIgnoredEvents(() => [])
        setFoundEvents(() => [])
      }
    },
    {
      label: "Export empty template",
      divider: false,
      onClick: () => {
        setOpenExportEmptyTemplate(() => true)
      }
    }
  ];

  useEffect(() => {
    if (progress?.progress >= 100) {
      const timeout = setTimeout(() => {
        updateProgress({ progress: null, buffer: null });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress?.progress]);

  const modalActions: ButtonActionProps[] = [
    {
      label: "Dry Run",
      disabled:
        rowData.length === 0 ||
        loaders.importation ||
        buttonsDisabled ||
        ignoredEvents.length > 0,
      loading: loaders.dryRun,
      onClick: () => {
        setLoaders(() => ({ dryRun: true, importation: false }));
        engine
          .mutate({
            resource: "/tracker",
            type: "create",
            data: { events: foundEvents }, // Use foundEvents instead of rowData
            params: {
              async: false,
              importMode: "VALIDATE"
            }
          })
          .then((response: any) => {
            setReport(() => response.stats);
            setTemplate(() => "report");
            setLoaders(() => ({ dryRun: false, importation: false }));
            show({
              message: "Dry Run Successful",
              type: { success: true }
            });
          })
          .catch(() => { });
      },
      className: progress?.progress != null && styles.remove
    },
    {
      label: "Update final decision",
      primary: true,
      disabled:
        rowData.length === 0 ||
        loaders.dryRun ||
        buttonsDisabled ||
        ignoredEvents.length > 0,
      loading: loaders.importation,
      onClick: () => {
        setLoaders(() => ({ dryRun: false, importation: true }));
        updateProgress({ progress: 36, buffer: 56 });
        engine
          .mutate({
            resource: "/tracker",
            type: "create",
            data: { events: foundEvents },
            params: {
              async: false
            }
          })
          .then((response: any) => {
            console.log(response.stats);
            setReport(() => response.stats);
            setTemplate(() => "report");
            setLoaders(() => ({ dryRun: false, importation: false }));
            show({
              message: "Final Decisions Updated Successfully",
              type: { success: true }
            });
            setButtonsDisabled(false);
            setRowData([]);
            setIgnoredEvents([]);
            setSummaryData({});
            setRefresh(true);
            setIsUpdated(true); // <-- Set isUpdated to true
            setFinalUpdatedCount(rowData.length); // <-- Save final updated count
            setFinalIgnoredCount(ignoredEvents.length);
            updateProgress({ progress: 100, buffer: 100 });
          })
          .catch(() => { })
          .finally(() => { setRefresh(prev => !prev) })
      },
      className: progress?.progress != null && styles.remove
    },
    {
      label: progress?.progress != null ? "Hide" : "Close",
      disabled: false,
      loading: false,
      onClick: () => {
        setOpenStudentUpdate(() => false);
      }
    }
  ];

  const onSave = async (files: File[]): Promise<void> => {
    const arrayBuffer = await files[0].arrayBuffer();
    const excelJS = (window as any).ExcelJS;
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet(1); // Read the first worksheet
    const jsonData: any[] = [];

    // Get column headers from the first row
    const headers: any[] = [];
    worksheet.getRow(3).eachCell((cell: any, colNumber: number) => {
      headers[colNumber] = cell.text;
    });

    // Loop through all rows and convert to JSON
    worksheet.eachRow((row: any, rowNumber: any) => {
      if (rowNumber === 1) return;
      if (rowNumber === 2) return;
      if (rowNumber === 3) return;

      const rowData: Record<string, any> = {};
      row.eachCell((cell: any, colNumber: number) => {
        rowData[headers[colNumber]] = cell.value;
      });

      jsonData.push(rowData);
    });

    const { status, programStage } = getDataStoreData["final-result"];
    const program = getDataStoreData.program;
    const dataElements: string[] = [status];

    jsonData.forEach((a) => {
      const { event, orgUnit, occurredAt, enrollment, trackedEntity, ...rest } =
        a;
      let currentEvent: Record<string, string> = {
        enrollment,
        trackedEntity,
        orgUnit,
        programStage,
        program,
        occurredAt
      };
      if (event) {
        currentEvent = { ...currentEvent, event };
      }
      const dataValues = dataElements.flatMap((de) => {
        const value: any = rest[`${programStage}.${de}`];
        if (value) {
          return { dataElement: de, value };
        }
        return [];
      });

      const finalDecision = rest[`${programStage}.${status}`];
      if (
        dataValues.length > 0 &&
        ["Promoted", "Dropout", "Failed"].includes(finalDecision)
      ) {
        setRowData((prev) => prev.concat({ ...currentEvent, ...rest }));
        setFoundEvents((prev) => prev.concat({ ...currentEvent, dataValues }));
      } else {
        setIgnoredEvents((prev) => prev.concat({ ...currentEvent, ...rest }));
      }
    });

    setIsOpen(() => false);
    setOpenStudentUpdate(() => true);
  };

  return (
    <div>
      <ButtonStrip>
        <Tooltip
          title={
            orgUnit === null ? "Please select an organisation unit before" : ""
          }
        >
          <span>
            <Button
              disabled={orgUnit == null || selected.selectedRows.length === 0}
              onClick={() => {
                setOpen(true);
              }}
              icon={<IconAddCircle24 />}
            >
              Assign final result
            </Button>
          </span>
        </Tooltip>
        <Tooltip
          title={
            orgUnit === null
              ? "Please select an organisation unit before"
              : noFinalResultStudentSelected.length > 0
                ? "From selected students, some of them don't have final result"
                : ""
          }
        >
          <span>
            <Button
              onClick={() => {
                setOpenPromotion(() => true);
              }}
              disabled={
                selected.selectedRows.length === 0 ||
                noFinalResultStudentSelected.length > 0
              }
              icon={<IconAddCircle24 />}
            >
              Perform promotion
            </Button>
          </span>
        </Tooltip>
        <DropdownButtonComponent
          name="Bulk final decision"
          disabled={!grade || !currentClass}
          icon={<IconUserGroup16 />}
          options={enrollmentOptions}
        />
      </ButtonStrip>
      {openPromotion && (
        <ModalComponent
          title="Bulk Student Promotion"
          open={openPromotion}
          setOpen={setOpenPromotion}
        >
          <ModalContentPromotion
            enrollmentsDetailsData={enrollmentsDetailsData}
            setSummaryData={setSummaryData}
            setOpenSummary={setOpenSummary}
            setOpen={setOpenPromotion}
          />
        </ModalComponent>
      )}
      {openSummary && (
        <ModalComponent
          title="Students Promotion Summary"
          open={openSummary}
          setOpen={setOpenSummary}
        >
          <ModalSummaryContent
            setOpen={setOpenSummary}
            summaryData={summaryData}
          />
        </ModalComponent>
      )}
      {open && (
        <ModalComponent
          title="Bulk Student Final Result"
          open={open}
          setOpen={setOpen}
        >
          <ModalContentComponent setOpen={setOpen} />
        </ModalComponent>
      )}
      {openImport && (
        <ModalComponent
          title="Import Students"
          open={openImport}
          setOpen={setOpenImport}
        >
          <ImportContent setOpen={setOpen} />
        </ModalComponent>
      )}

      {openExportEmptyTemplate && (
        <ModalComponent
          title={`Data Import Template Export`}
          open={openExportEmptyTemplate}
          setOpen={setOpenExportEmptyTemplate}
        >
          <ModalExportTemplateContent
            sectionName={""}
            setOpen={setOpenExportEmptyTemplate}
          />
        </ModalComponent>
      )}

      {/* <DropzoneDialog
        dialogTitle={"Bulk Final Decision"}
        submitButtonText={"Start Import"}
        dropzoneText={"Drag and drop a file here or Browse"}
        Icon={CloudUpload as any}
        filesLimit={1}
        showPreviews={false}
        showPreviewsInDropzone={true}
        previewGridProps={{
          container: {
            spacing: 1,
            direction: "row"
          }
        }}
        previewText="Selected file:"
        showFileNames={true}
        showFileNamesInPreview={true}
        acceptedFiles={[".xlsx"]}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSave={onSave as any}
        clearOnUnmount={true}
      /> */}

      {
        isOpen &&
        <ModalComponent
          title={`Bulk Final Decision`}
          open={isOpen}
          setOpen={setIsOpen}
        >
          <DropZone onSave={onSave} />
        </ModalComponent>
      }

      {openStudentUpdate && (
        <ModalComponent
          title={`Bulk final decision summary`}
          open={openStudentUpdate}
          setOpen={setOpenStudentUpdate}
        >
          {progress.progress != null ? (
            <IteractiveProgress />
          ) : (
            <>
              <Tag
                positive
                icon={<IconCheckmarkCircle16 />}
                className={styles.tagContainer}
              >
                Students Final Decision Updates preview
              </Tag>
              {/* <h3>Students List Template Processing Summary</h3> */}
              <WithPadding />
              <WithPadding />
              <ButtonStrip>
                <SummaryCard
                  color="primary"
                  label={
                    isUpdated
                      ? "Final Decisions Updated"
                      : "Final Decision Updates"
                  }
                  value={isUpdated ? finalUpdatedCount : rowData.length} // <-- Use finalUpdatedCount when isUpdated is true
                />
                <SummaryCard
                  color="error"
                  label={isUpdated ? "Records Ignored" : "Invalid Records"}
                  value={isUpdated ? finalIgnoredCount : ignoredEvents.length} // <-- Use finalIgnoredCount when isUpdated is true
                />
              </ButtonStrip>
              <WithPadding />
              <WithPadding />
              <ButtonStrip>
                <Button
                  small
                  icon={<InfoOutlined className={styles.infoIcon} />}
                  onClick={handleShowDetails}
                >
                  More details
                </Button>
              </ButtonStrip>
              <Collapse in={showDetails}>
                <div className={styles.detailsContainer}>
                  <TabBar>
                    <Tab
                      onClick={() => handleTabClick("updates")}
                      selected={activeTab === "updates"}
                    >
                      {rowData.length}
                      <br />
                      Final Decision Updates
                    </Tab>
                    <Tab
                      onClick={() => handleTabClick("ignored")}
                      selected={activeTab === "ignored"}
                    >
                      {ignoredEvents.length}
                      <br />
                      Ignored
                    </Tab>
                  </TabBar>

                  {activeTab === "updates" && (
                    <div>
                      {rowData.length > 0 ? (
                        <DataTable>
                          <DataTableHead>
                            <DataTableRow>
                              <DataTableColumnHeader>Ref</DataTableColumnHeader>
                              <DataTableColumnHeader>
                                School
                              </DataTableColumnHeader>
                              <DataTableColumnHeader>
                                Academic Year
                              </DataTableColumnHeader>
                              {columns
                                .filter((a) => a.visible)
                                .map((column, index) => (
                                  <DataTableColumnHeader key={column.key}>
                                    {column.labelName}
                                  </DataTableColumnHeader>
                                ))}
                            </DataTableRow>
                          </DataTableHead>
                          <DataTableBody>
                            {rowData.map((event, index) => (
                              <DataTableRow key={index}>
                                <DataTableCell>{event.ref}</DataTableCell>
                                <DataTableCell>
                                  {event.orgUnitName}
                                </DataTableCell>
                                <DataTableCell>
                                  {event.enrollmentDate}
                                </DataTableCell>
                                {columns
                                  .filter((a) => a.visible)
                                  .map((column) => {
                                    if (
                                      [
                                        registration.grade,
                                        registration.section
                                      ].includes(column.id)
                                    ) {
                                      return (
                                        <DataTableCell key={column.id}>
                                          {
                                            event[
                                            `${registration.programStage}.${column.key}`
                                            ]
                                          }
                                        </DataTableCell>
                                      );
                                    }
                                    if (column.id === finalResult.status) {
                                      return (
                                        <DataTableCell key={column.id}>
                                          {
                                            event[
                                            `${finalResult.programStage}.${column.key}`
                                            ]
                                          }
                                        </DataTableCell>
                                      );
                                    }
                                    return (
                                      <DataTableCell key={column.id}>
                                        {event[column.id]}
                                      </DataTableCell>
                                    );
                                  })}
                              </DataTableRow>
                            ))}
                          </DataTableBody>
                        </DataTable>
                      ) : (
                        <p>No final decision updates to display!</p>
                      )}
                    </div>
                  )}

                  {activeTab === "ignored" && (
                    <div>
                      {ignoredEvents.length > 0 ? (
                        <DataTable>
                          <DataTableHead>
                            <DataTableRow>
                              <DataTableColumnHeader>
                                Actions
                              </DataTableColumnHeader>
                              <DataTableColumnHeader>Ref</DataTableColumnHeader>
                              <DataTableColumnHeader>
                                School
                              </DataTableColumnHeader>
                              <DataTableColumnHeader>
                                Academic Year
                              </DataTableColumnHeader>
                              {columns
                                .filter((a) => a.visible)
                                .map((column, index) => (
                                  <DataTableColumnHeader key={column.key}>
                                    {column.labelName}
                                  </DataTableColumnHeader>
                                ))}
                            </DataTableRow>
                          </DataTableHead>
                          <DataTableBody>
                            {ignoredEvents.map((event, index) => (
                              <React.Fragment key={index}>
                                <DataTableRow>
                                  <DataTableCell>
                                    <Button
                                      small
                                      icon={
                                        expandedRows.has(index) ? (
                                          <IconChevronDown16 />
                                        ) : (
                                          <IconChevronRight16 />
                                        )
                                      }
                                      onClick={() => toggleRowExpansion(index)}
                                    />
                                  </DataTableCell>
                                  <DataTableCell>{event.ref}</DataTableCell>
                                  <DataTableCell>
                                    {event.orgUnitName}
                                  </DataTableCell>
                                  <DataTableCell>
                                    {event.enrollmentDate}
                                  </DataTableCell>
                                  {columns
                                    .filter((a) => a.visible)
                                    .map((column) => {
                                      if (
                                        [
                                          registration.grade,
                                          registration.section
                                        ].includes(column.id)
                                      ) {
                                        return (
                                          <DataTableCell key={column.id}>
                                            {
                                              event[
                                              `${registration.programStage}.${column.key}`
                                              ]
                                            }
                                          </DataTableCell>
                                        );
                                      }
                                      if (column.id === finalResult.status) {
                                        return (
                                          <DataTableCell key={column.id}>
                                            {
                                              event[
                                              `${finalResult.programStage}.${column.key}`
                                              ]
                                            }
                                          </DataTableCell>
                                        );
                                      }
                                      return (
                                        <DataTableCell key={column.id}>
                                          {event[column.id]}
                                        </DataTableCell>
                                      );
                                    })}
                                </DataTableRow>
                                {expandedRows.has(index) && (
                                  <DataTableRow>
                                    <DataTableCell colSpan={9}>
                                      <DataTable>
                                        <DataTableHead>
                                          <DataTableRow>
                                            <DataTableColumnHeader>
                                              Field
                                            </DataTableColumnHeader>
                                            <DataTableColumnHeader>
                                              Value
                                            </DataTableColumnHeader>
                                            <DataTableColumnHeader>
                                              Error
                                            </DataTableColumnHeader>
                                          </DataTableRow>
                                        </DataTableHead>
                                        <DataTableBody>
                                          {getErrors(event).map(
                                            (error, errIndex) => (
                                              <DataTableRow key={errIndex}>
                                                <DataTableCell>
                                                  {error.field}
                                                </DataTableCell>
                                                <DataTableCell>
                                                  {error.value}
                                                </DataTableCell>
                                                <DataTableCell>
                                                  {error.error}
                                                </DataTableCell>
                                              </DataTableRow>
                                            )
                                          )}
                                        </DataTableBody>
                                      </DataTable>
                                    </DataTableCell>
                                  </DataTableRow>
                                )}
                              </React.Fragment>
                            ))}
                          </DataTableBody>
                        </DataTable>
                      ) : (
                        <p>No ignored updates to display!</p>
                      )}
                    </div>
                  )}
                </div>
              </Collapse>
              <Divider className={styles.divider} />
            </>
          )}
          <ModalActions>
            <ButtonStrip end>
              {modalActions.map((action, i) => (
                <Button key={i} {...action}>
                  {action.label}
                </Button>
              ))}
            </ButtonStrip>
          </ModalActions>
        </ModalComponent>
      )}
    </div>
  );
}

export default EnrollmentActionsButtons;
