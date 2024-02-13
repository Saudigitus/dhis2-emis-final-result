interface MenuItemTypes {
    label: string
    value: string
}

interface MenuItemProps {
    onToggle: () => void 
    dataElementId: string
    menuItems: MenuItemTypes[]
}

interface MenuItemContainerProps {
    onToggle: () => void 
    dataElementId: string
}

type ComponentMapping = Record<string, React.ComponentType<any>>;

type ParamsMapping = Record<string, string>;

export type { MenuItemTypes, ComponentMapping, ParamsMapping, MenuItemProps, MenuItemContainerProps }
