import React, { useState } from "react";
import { Divider, IconCheckmarkCircle16, IconInfo16, Tag, ModalActions, Button, ButtonStrip } from "@dhis2/ui";
import styles from "./modal.module.css";
import SummaryCards from "./SummaryCards";
import { Collapse } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { WithPadding } from "../../template";
import { Title } from "../../text";
import { ButtonActionProps } from "../../../types/Buttons/ButtonActions";
import { TableComponent } from "../../table/components";
import RenderHeader from "../../table/render/RenderHeader";
import RenderRows from "../../table/render/RenderRows";
import { usePromotionSummaryHeader } from "../../../hooks/tableHeader/usePromotionSummaryHeader";
import { formatPromotionSummaryRows } from "../../../utils/table/rows/formatPromotionSummaryRows";
import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";

interface ModalContentProps {
  setOpen: (value: boolean) => void
  summaryData: any
}
function ModalSummaryContent(props: ModalContentProps): React.ReactElement {
  const { columns } = usePromotionSummaryHeader()
  const { setOpen, summaryData } = props;
  const [showDetails, setShowDetails] = useState(false)
  const programConfig = useRecoilValue(ProgramConfigState)
  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  }

  const modalActions: ButtonActionProps[] = [
    { label: "Confirm", primary: true, disabled: false, onClick: () => { setOpen(false) } }
  ];

  return (
    <div>
      <Tag positive icon={<IconCheckmarkCircle16 />} className={styles.tagContainer}> Students promotion preview </Tag>

      <WithPadding />
      <Title label="Summary" />
      <WithPadding />

      <SummaryCards {...summaryData} />

      <WithPadding />


      <WithPadding />
      {summaryData?.conflicts?.length > 0 ?
        <>
          <ButtonStrip>
            <Button small icon={<InfoOutlined className={styles.infoIcon} />} onClick={handleShowDetails}>More details</Button>
          </ButtonStrip>
          <br/>
          <span style={{color:"red"}}>The following students were not promoted. They already exist on the selected academic year</span>
        </>
        : null}
      <WithPadding />

      <Collapse in={showDetails}>
        <div className={styles.detailsContainer}>
          <TableComponent>
            <>
              <RenderHeader
                hideCheckBox={true}
                createSortHandler={() => { }}
                order='asc'
                orderBy='desc'
                rowsHeader={columns}
              />
              <RenderRows
                hideCheckBox={true}
                headerData={columns}
                rowsData={formatPromotionSummaryRows({ teiInstances: summaryData?.conflicts, programConfig })}
              />
            </>
          </TableComponent>
        </div>
      </Collapse>

      <Divider />
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
