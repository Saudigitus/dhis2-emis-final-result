import { DisableNextPageProps } from "../../../types/utils/table/TableTypes"

export const disableNextPage = ({ totalPerPage, rowsPerPage }: DisableNextPageProps): boolean => {
    if (totalPerPage < rowsPerPage) {
        return true
    }
    return false
}
