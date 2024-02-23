import React from "react";
import styles from './header.module.css'
import { useRecoilState } from "recoil";
import { useHeader } from "../../../../hooks";
import { TableColumnState } from "../../../../schema/columnSchema";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";

function HeaderFilters() {
  const { columns } = useHeader();
  const [updatedCols, setTableColumns] = useRecoilState(TableColumnState)
  const setTableHeaders = (tableHeaders: any) => setTableColumns(tableHeaders)

  return (
    <div className={styles.headerFilterContainer}>
      <EnrollmentFilters />

      <ConfigTableColumns filteredHeaders={updatedCols} headers={columns} updateVariables={setTableHeaders} />
    </div>
  );
}

export default HeaderFilters;
