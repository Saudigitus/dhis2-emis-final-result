import React from "react";
import styles from "./modal.module.css";
import { Modal, ModalTitle, ModalContent } from "@dhis2/ui";
import { ModalProps } from "../../../types/modal/ModalTypes";

function ModalComponent({
  open,
  setOpen,
  title,
  children
}: ModalProps): React.ReactElement {
  return (
    <Modal
      className={styles.modalContainer}
      open={open}
      position={"middle"}
      onClose={() => {
        setOpen(false);
      }}
    >
      <ModalTitle>{title}</ModalTitle>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}

export default ModalComponent;
