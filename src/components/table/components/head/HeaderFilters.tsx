import React from "react";
import styles from './Header.module.css'
import { useHeader } from "../../../../hooks/tableHeader/useHeader";
import EnrollmentFilters from "../filters/enrollment/EnrollmentFilters";
import ConfigTableColumns from "../configTableColumns/ConfigTableColumns";

function HeaderFilters() {
  const { columns } = useHeader();
  return (
    <div className={styles.headerFilterContainer}>
      <EnrollmentFilters />

      <ConfigTableColumns headers={columns} updateVariables={() => {}} />
    </div>
  );
}

export default HeaderFilters;
