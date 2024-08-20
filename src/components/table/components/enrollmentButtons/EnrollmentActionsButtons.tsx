import React, { useState } from "react";
import { useRecoilState } from "recoil";
import Tooltip from "@material-ui/core/Tooltip";
import { useGetEnrollmentForm, useQueryParams } from "../../../../hooks";
import {
  IconAddCircle24,
  Button,
  ButtonStrip,
  IconUserGroup16
} from "@dhis2/ui";
import { RowSelectionState } from "../../../../schema/tableSelectedRowsSchema";
import {
  ModalComponent,
  ModalContentComponent,
  ModalContentPromotion,
  ImportContent
} from "../../../../components";
import ModalSummaryContent from "../../../modal/components/SummaryModalContent";
import type { FlyoutOptionsProps } from "../../../../types/Buttons/FlyoutOptionsProps";
import DropdownButtonComponent from "../../../button/DropdownButton";
import styles from "./enrollmentActionsButtons.module.css";

function EnrollmentActionsButtons() {
  const [open, setOpen] = useState<boolean>(false);
  const [openPromotion, setOpenPromotion] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [openSummary, setOpenSummary] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>({});
  const { useQuery } = useQueryParams();
  const orgUnit = useQuery().get("school");
  const [selected] = useRecoilState(RowSelectionState);
  const { enrollmentsDetailsData } = useGetEnrollmentForm();

  const noFinalResultStudentSelected = selected.selectedRows.filter(
    (selectedRow: any) => !selectedRow?.dataValues?.[0]?.value
  );

  const enrollmentOptions: FlyoutOptionsProps[] = [
    {
      label: "Download template",
      divider: false,
      onClick: () => {}
    }
  ];

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
                setOpenPromotion(true);
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
          name={
            (
              <span className={styles.work_buttons_text}>
                Bulk final decision
              </span>
            ) as unknown as string
          }
          disabled={false}
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
    </div>
  );
}

export default EnrollmentActionsButtons;
