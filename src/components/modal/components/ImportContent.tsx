import React from "react";
import { WithPadding, Subtitle }  from "../../../components";
import { ModalActions, Button, ButtonStrip, Divider } from "@dhis2/ui";
import { ContentProps } from "../../../types/modal/ModalContentTypes";

function ImportContent(props: ContentProps): React.ReactElement {
  const { setOpen } = props;
  const modalActions = [
    { label: "Cancel", disabled: false, loading: false, onClick: () => { setOpen(false) } },
    { label: "Import", primary: true, disabled: false, loading: false, onClick: () => { setOpen(false) } }
  ];

  return (
    <div>
      <WithPadding>
        <Subtitle label={"Import modal content component"} />
        <Divider />
      </WithPadding>

      <ModalActions>
        <ButtonStrip end>
          {modalActions.map((action, i) => (
            <Button
              key={i}
              {...action}
            >
              {action.loading ? "Loading..." : action.label}
            </Button>
          ))}
        </ButtonStrip>
      </ModalActions>
    </div>
  );
}

export default ImportContent;
