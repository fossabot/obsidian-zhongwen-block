export interface PinyinSpan {
    waitAndMeasureCorrectWidth(): Promise<number>;

    setPadding(padding: number): void;
}
