import React from 'react'
import { Paper } from '@material-ui/core'
import styles from "./infoPage.module.css"

export default function InfoPage() {
    return (
        <div className={styles.containerInit}>
            <Paper elevation={1} className={styles.paperInit}>
                <h2>SEMIS-Staff Re-enroll</h2>
                <span>Follow the instructions to proceed:</span>
                <ul>
                    <li className={styles.paperOtherText}>Select the  Organization unit you want to view data</li>
                    <li className={styles.paperOtherText}>Use Academic Year to filter data</li>
                </ul>
                <span>How to perform operations:</span>
                <ul>
                    <li className={styles.paperOtherText}><strong>Bulk Promotion:</strong> select the staffs you want to re-enroll and click <strong>Perform staff re-enroll</strong> button</li>
                </ul>
            </Paper>
        </div>
    )
}
