import { type HiddenZhChar, HiddenZhCharImpl } from '../hidden-zh-char';
import type { PinyinLine } from './pinyin-line';
import { type PinyinSpan, PinyinSpanImpl } from '../pinyin-span';

import * as styles from './style.css';

export class PinyinLineImpl implements PinyinLine {
    #el: HTMLDivElement;

    constructor(container: HTMLDivElement) {
        this.#el = container.createDiv({
            cls: styles.pinyinLine,
            attr: { 'aria-hidden': true },
        });
    }

    appendZhCharBlock({
        zhChar,
        pinyin,
        pinyinSpanClass,
        font,
    }: {
        zhChar: string;
        pinyin: string;
        pinyinSpanClass: string;
        font: string | null;
    }): {
        hiddenZhChar: HiddenZhChar;
        pinyinSpan: PinyinSpan;
    } {
        const hiddenZhBlock = this.#el.createDiv({ cls: styles.hiddenZhBlock });

        const hiddenZhChar = new HiddenZhCharImpl(hiddenZhBlock, {
            zhChar,
            font,
        });

        const pinyinSpan = new PinyinSpanImpl(hiddenZhBlock, {
            pinyin,
            pinyinSpanClass,
        });

        return { hiddenZhChar, pinyinSpan };
    }

    createNonZh({
        nonZhChars,
        font,
    }: {
        nonZhChars: string;
        font: string | null;
    }): void {
        const nonZhSpan = this.#el.createSpan({
            cls: styles.hiddenNonZh,
            text: nonZhChars,
        });

        if (font !== null) nonZhSpan.style.fontFamily = font;
    }
}
