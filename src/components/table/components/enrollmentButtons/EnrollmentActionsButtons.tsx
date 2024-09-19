import React, { useState } from 'react'
import { useRecoilState } from 'recoil';
import Tooltip from '@material-ui/core/Tooltip';
import { useGetEnrollmentForm, useQueryParams } from '../../../../hooks';
import { IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import { RowSelectionState } from '../../../../schema/tableSelectedRowsSchema';
import { ModalComponent, ModalContentComponent, ModalContentPromotion, ImportContent } from '../../../../components';
import ModalSummaryContent from '../../../modal/components/SummaryModalContent';

function EnrollmentActionsButtons() {
  const [open, setOpen] = useState<boolean>(false);
  const [openPromotion, setOpenPromotion] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [openSummary, setOpenSummary] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>({});
  const { useQuery } = useQueryParams();
  const orgUnit = useQuery().get("school")
  const [selected] = useRecoilState(RowSelectionState);
  const { enrollmentsDetailsData } = useGetEnrollmentForm();

  return (
    <div>
      <ButtonStrip>
        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span>
            <Button onClick={() => { setOpenPromotion(true); }} disabled={selected.selectedRows.length === 0} icon={<IconAddCircle24 />}>Perform staff re-enroll</Button>
          </span>
        </Tooltip>
      </ButtonStrip>
      {openPromotion && <ModalComponent title="Bulk Staff Re-enroll" open={openPromotion} setOpen={setOpenPromotion}><ModalContentPromotion enrollmentsDetailsData={enrollmentsDetailsData} setSummaryData={setSummaryData} setOpenSummary={setOpenSummary} setOpen={setOpenPromotion} /></ModalComponent>}
      {openSummary && <ModalComponent title="Staffs Re-enroll Summary" open={openSummary} setOpen={setOpenSummary}><ModalSummaryContent setOpen={setOpenSummary} summaryData={summaryData} /></ModalComponent>}
      {open && <ModalComponent title="Bulk Student Final Result" open={open} setOpen={setOpen}><ModalContentComponent setOpen={setOpen} /></ModalComponent>}
      {openImport && <ModalComponent title="Import Students" open={openImport} setOpen={setOpenImport}><ImportContent setOpen={setOpen} /></ModalComponent>}
    </div >
  )
}

export default EnrollmentActionsButtons
