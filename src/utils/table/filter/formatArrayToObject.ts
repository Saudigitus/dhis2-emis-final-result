import { ConvertArrayToObjectProps } from "../../../types/utils/table/TableTypes";

export const convertArrayToObject = ({ array }: ConvertArrayToObjectProps) => {
    const obj: any = {};
    array.forEach((item) => {
        const currentItem = item.toString().split(':');
        obj[currentItem[0]] = currentItem[2].replaceAll(';', ',');
    });
    return obj;
}
