interface OrgUnitTreeProps {
    onToggle: () => void
}

interface OrgUnitTreeComponentProps {
    roots: Array<any>,
    classes?: {
        orgunitTree: string,
    },
    onSelectClick: Function,
    treeKey: string,
    previousOrgUnitId?: Object
};

export type { OrgUnitTreeProps, OrgUnitTreeComponentProps }