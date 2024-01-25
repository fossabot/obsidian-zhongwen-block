export interface ZhCharLine {
    appendZhBlock(args: {
        zhChar: string;
        zhCharPadding: number;
        font: string | null;
    }): void;

    createNonZh(args: { nonZhChars: string; font: string | null }): void;
}
