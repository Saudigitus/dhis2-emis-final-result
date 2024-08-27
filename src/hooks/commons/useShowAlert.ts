import { useAlert } from "@dhis2/app-runtime"

export const useShowAlerts = () => {
  const { show, hide } = useAlert(
    ({ message }: { message: string }) => message,
    ({ type }: { type: Record<string, any> }) => ({
      ...type,
      duration: 3000
    })
  )

  return {
    show,
    hide
  }
}
