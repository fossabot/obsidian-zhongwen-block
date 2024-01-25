export interface Settings {
    alwaysDisplayPinyin: boolean;
    font: string | null;
}

export const defaultSettings: Settings = {
    alwaysDisplayPinyin: false,
    font: null,
};
