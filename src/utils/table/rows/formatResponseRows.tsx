import type {FormatResponseRowsDataProps,RowsDataProps,attributesProps,dataValuesProps} from "../../../types/utils/table/FormatRowsDataTypes"

export function formatResponseRows({ eventsInstances, teiInstances }: FormatResponseRowsDataProps): RowsDataProps[] {

  const allRows: RowsDataProps[] = []
  for (const event of eventsInstances) {
    const teiDetails = teiInstances?.find((tei) => tei?.trackedEntity === event?.trackedEntity)

    allRows.push({
      ...dataValues(event.dataValues),
      ...attributes(teiDetails?.attributes ?? []),
      ...{
        trackedEntity: event?.trackedEntity,
        event: event?.event ?? "",
        enrollment: event?.enrollment,
        occurredAt: event?.occurredAt ?? new Date().toISOString()
      }
    })
  }
  return allRows
}

export function dataValues(data: dataValuesProps[]): RowsDataProps {
  const localData: RowsDataProps = {}
  for (const dataElement of data) {
    localData[dataElement.dataElement] = dataElement.value
  }
  return localData
}

export function attributes(data: attributesProps[]): RowsDataProps {
  const localData: RowsDataProps = {}
  for (const attribute of data) {
    localData[attribute.attribute] = attribute.value
  }
  return localData
}
