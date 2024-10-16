import React from "react"
import WithPadding from "../../../../template/WithPadding"
import EnrollmentActionsButtons from "../../enrollmentButtons/EnrollmentActionsButtons"

function WorkingLits() {
  return (
    <WithPadding>
      <div className="d-flex justify-content-end">
        <EnrollmentActionsButtons />
      </div>
    </WithPadding>
  )
}

export default WorkingLits
