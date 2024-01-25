export interface HiddenZhChar {
    waitAndMeasureCorrectWidth(): Promise<number>;

    setPadding(padding: number): void;
}
