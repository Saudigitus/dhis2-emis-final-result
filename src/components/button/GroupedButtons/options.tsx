import React from "react";
import {
  CheckCircleOutlineOutlined,
  HighlightOffOutlined,
  WatchLaterOutlined
} from "@material-ui/icons";
import { type GrooupedButtonsProps } from "../../../types/Buttons/GroupedButtons";
import "./segmented-control.css";

export const buttonOptionsIcons: GrooupedButtonsProps[] = [
  {
    label: <CheckCircleOutlineOutlined className="present-icon" />,
    value: "Present"
  },
  {
    label: <WatchLaterOutlined className="late-icon" />,
    value: "Late"
  },
  {
    label: <HighlightOffOutlined className="absent-icon" />,
    value: "Absent"
  }
];

export const buttonOptionsLabels: GrooupedButtonsProps[] = [
  {
    label: "Health",
    value: "Health"
  },
  {
    label: "Social",
    value: "Social"
  },
  {
    label: "Unknown",
    value: "Unknown"
  },
  {
    label: "Other",
    value: "Other"
  }
];
