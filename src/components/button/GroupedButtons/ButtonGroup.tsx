import React, { useState } from "react";
import { SegmentedControl } from "@dhis2/ui";
import { type GrooupedButtonsProps } from "../../../types/Buttons/GroupedButtons";
import "./segmented-control.css"

interface ButtonsGroupProps {
  options: GrooupedButtonsProps[]
  uppercase?: boolean
}
function ButtonsGroup({ options, uppercase }: ButtonsGroupProps): React.ReactElement {
  const [selectedElement, setSelectedElement] = useState<any>(options[0].value);

  return (
    <div className={(uppercase ?? false) ? "upper-case-labels" : ""}>
        <SegmentedControl
        onChange={(e: any) => {
          setSelectedElement(e.value);
        }}
        options={options}
        selected={selectedElement}
      />
    </div>
  );
}

export default ButtonsGroup;
