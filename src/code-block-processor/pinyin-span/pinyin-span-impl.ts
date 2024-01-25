import { waitAndMeasureCorrectWidth } from '../measure-width';
import type { PinyinSpan } from './pinyin-span';

export class PinyinSpanImpl implements PinyinSpan {
    #el: HTMLSpanElement;

    constructor(
        hiddenZhBlock: HTMLDivElement,
        {
            pinyin,
            pinyinSpanClass,
        }: { pinyin: string; pinyinSpanClass: string },
    ) {
        this.#el = hiddenZhBlock.createSpan({
            cls: pinyinSpanClass,
            text: pinyin,
        });
    }

    waitAndMeasureCorrectWidth(): Promise<number> {
        return waitAndMeasureCorrectWidth(this.#el);
    }

    setPadding(padding: number): void {
        this.#el.style.paddingLeft =
            this.#el.style.paddingRight = `${padding}px`;
    }
}
