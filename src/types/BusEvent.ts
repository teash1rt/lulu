export enum BusEvent {
    SwitchFilePath = 'SwitchFilePath',
    SaveFile = 'SaveFile'
}

export type SwitchFilePath = {
    oldPath: string
    newPath: string
}
