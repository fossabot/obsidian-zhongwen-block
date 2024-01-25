import type { HiddenZhChar } from './hidden-zh-char';
import { waitAndMeasureCorrectWidth } from '../measure-width';

import * as styles from './style.css';

export class HiddenZhCharImpl implements HiddenZhChar {
    #el: HTMLSpanElement;

    constructor(
        hiddenZhBlock: HTMLDivElement,
        { zhChar, font }: { zhChar: string; font: string | null },
    ) {
        this.#el = hiddenZhBlock.createSpan({
            cls: styles.hiddenZhChar,
            text: zhChar,
        });

        if (font !== null) this.#el.style.fontFamily = font;
    }

    waitAndMeasureCorrectWidth(): Promise<number> {
        return waitAndMeasureCorrectWidth(this.#el);
    }

    setPadding(padding: number): void {
        this.#el.style.paddingLeft =
            this.#el.style.paddingRight = `${padding}px`;
    }
}
