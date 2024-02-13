import React, { useState } from 'react'
import { useRecoilState } from 'recoil';
import Tooltip from '@material-ui/core/Tooltip';
import { useQueryParams } from '../../../../hooks';
import { IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import { RowSelectionState } from '../../../../schema/tableSelectedRowsSchema';
import { ModalComponent, ModalContentComponent, ModalContentPromotion, ImportContent } from '../../../../components';

function EnrollmentActionsButtons() {
  const [open, setOpen] = useState<boolean>(false);
  const [openPromotion, setOpenPromotion] = useState<boolean>(false);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const { useQuery } = useQueryParams();
  const orgUnit = useQuery().get("school")
  const [selected] = useRecoilState(RowSelectionState);

  return (
    <div>
      <ButtonStrip>
        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span>
            <Button disabled={orgUnit == null || selected.selectedRows.length === 0} onClick={() => { setOpen(true); }} icon={<IconAddCircle24 />}>Assign final result</Button>
          </span>
        </Tooltip>

        <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
          <span>
            <Button onClick={() => { setOpenPromotion(true); }} disabled={selected.selectedRows.length === 0} icon={<IconAddCircle24 />}>Perform promotion</Button>
          </span>
        </Tooltip>
      </ButtonStrip>

      {openPromotion && <ModalComponent title="Bulk Student Promotion" open={openPromotion} setOpen={setOpenPromotion}><ModalContentPromotion setOpen={setOpenPromotion} /></ModalComponent>}
      {open && <ModalComponent title="Bulk Student Final Result" open={open} setOpen={setOpen}><ModalContentComponent setOpen={setOpen} /></ModalComponent>}
      {openImport && <ModalComponent title="Import Students" open={openImport} setOpen={setOpenImport}><ImportContent setOpen={setOpen} /></ModalComponent>}
    </div >
  )
}

export default EnrollmentActionsButtons
