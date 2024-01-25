interface FontData {
    fullName: string;
    postscriptName: string;
    style: string;
}

declare function queryLocalFonts(): Promise<FontData[]>;
