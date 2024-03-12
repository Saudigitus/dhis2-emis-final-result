import React from 'react'
import style from "../sideBar.module.css"
import { type SideBarItemTitleProps } from '../../../../types/sideBar/SideBarTypes'
import classNames from 'classnames';

export default function SideBarItemTitle(props: SideBarItemTitleProps): React.ReactElement {
  const { title } = props
  return (<span className={style.SideBarItemTitle}>{title}</span>)
}
