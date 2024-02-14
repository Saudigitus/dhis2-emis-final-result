import React from 'react'
import styles from "./MainHeader.module.css"
import close from "../../../assets/images/headbar/close.svg"

export default function HeaderResetItemValue({  }: any): React.ReactElement {
    const onReset = () => {  }

    return (
        <div 
            onClick={onReset}
            className={styles.HeaderResetItemValue}
        >
            <img src={close} />
        </div>
    )
}