import type { ProgramConfig } from "../../../types/programConfig/ProgramConfig"
import type {
  FormatResponseRowsDataProps,
  FormatResponseRowsMarksProps,
  RowsDataProps,
  attributesProps,
  dataValuesProps
} from "../../../types/utils/table/FormatRowsDataTypes"
import React from "react"
import styles from "./formatResponseRows.module.css"
import classNames from "classnames"

export function formatResponseRows({
  eventsInstances,
  teiInstances,
  marksInstances,
  programConfig,
  programStageId
}: FormatResponseRowsDataProps): RowsDataProps[] {
  const allRows: RowsDataProps[] = []
  for (const event of eventsInstances) {
    const teiDetails = teiInstances?.find(
      (tei) => tei?.trackedEntity === event?.trackedEntity
    )
    const marksDetails = marksInstances?.find(
      (mark) =>
        mark?.trackedEntity === event?.trackedEntity &&
        mark?.enrollment === event?.enrollment
    )
    allRows.push({
      ...(marksDetails !== undefined
        ? {
            ...dataValues(
              marksDetails?.dataValues,
              programConfig,
              programStageId
            )
          }
        : {}),
      ...(event !== undefined
        ? { ...dataValues(event.dataValues, programConfig, programStageId) }
        : {}),
      ...attributes(teiDetails?.attributes ?? [], programConfig),
      ...{
        trackedEntity: event?.trackedEntity,
        event: marksDetails?.event ?? "",
        enrollment: event?.enrollment,
        occurredAt: marksDetails?.occurredAt ?? new Date().toISOString()
      }
    })
  }
  return allRows
}

export function formatResponseRowsMarks({
  marksInstance,
  programConfig,
  programStageId
}: FormatResponseRowsMarksProps): RowsDataProps {
  return dataValues(
    marksInstance?.dataValues ?? [],
    programConfig,
    programStageId
  )
}

function dataValues(
  data: dataValuesProps[],
  programConfig: ProgramConfig,
  programStageId: string | undefined
): RowsDataProps {
  const localData: RowsDataProps = {}
  const currentProgramStage =
    programConfig?.programStages?.find(
      (programStage) => programStage?.id === programStageId
    ) ?? ({} as ProgramConfig["programStages"][0])

  if (data) {
    for (const dataElement of data) {
      const dataElementOptSet =
        currentProgramStage?.programStageDataElements?.find(
          (option: any) => option?.dataElement?.id == dataElement?.dataElement
        )?.dataElement?.optionSet
      if (dataElementOptSet) {
        localData[`${dataElement.dataElement}-val`] = dataElement?.value
        localData[dataElement.dataElement] = (
          <span
            className={classNames(
              styles["final-result__status"],
              styles[dataElement?.value?.toLowerCase()]
            )}
          >
            {
              dataElementOptSet?.options?.find(
                (option: any) => option?.value === dataElement?.value
              )?.label as unknown as string
            }
          </span>
        )
      } else localData[dataElement?.dataElement] = dataElement?.value
    }
  }
  return localData
}

function attributes(
  data: attributesProps[],
  programConfig: ProgramConfig
): RowsDataProps {
  const localData: RowsDataProps = {}
  for (const attribute of data) {
    localData[attribute.attribute] = attribute.value
  }
  return localData
}
