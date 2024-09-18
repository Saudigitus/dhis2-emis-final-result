import React from "react";
import styles from "./modal.module.css";
import { Modal, ModalTitle, ModalContent } from "@dhis2/ui";
import { ModalProps } from "../../../types/modal/ModalTypes";
import { ProgressState } from "../../../schema/linearProgress";
import { useRecoilValue } from "recoil";

function ModalComponent(props: ModalProps): React.ReactElement {
  const { open, setOpen, title, children } = props
  const progress = useRecoilValue(ProgressState)

  return (
    <Modal
      className={styles.modalContainer}
      open={open}
      position={"middle"}
      onClose={() => {
        setOpen(false);
      }}
    >
      {progress.progress == null && < ModalTitle > {title}</ModalTitle>}
      <ModalContent>{children}</ModalContent>
    </Modal >
  );
}

export default ModalComponent;
