import { type CustomAttributeProps } from '../../AttributeColumns';

interface ContentFilterProps {
    headers: CustomAttributeProps[]
}

interface MenuFiltersProps {
    anchorEl: any
    setAnchorEl: (value: any) => void
    addSearchableHeaders: (value: any) => void
    options: CustomAttributeProps[]
}

export type { ContentFilterProps, MenuFiltersProps }