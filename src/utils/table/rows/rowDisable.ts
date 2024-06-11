export function checkOwnershipOu(ownershipOu: string, selectedOu: string): boolean {
    if (!ownershipOu || !selectedOu) return false
    return ownershipOu === selectedOu
}
