import { ZhCharLine } from './zh-char-line';

import * as styles from './style.css';

export class ZhCharLineImpl implements ZhCharLine {
    #el: HTMLDivElement;

    constructor(container: HTMLDivElement) {
        this.#el = container.createDiv({ cls: styles.zhCharLine });
    }

    appendZhBlock({
        zhChar,
        zhCharPadding,
        font,
    }: {
        zhChar: string;
        zhCharPadding: number;
        font: string | null;
    }): void {
        const zhBlock = this.#el.createDiv({
            cls: styles.visibleZhBlock,
            text: zhChar,
        });

        zhBlock.style.paddingLeft =
            zhBlock.style.paddingRight = `${zhCharPadding}px`;

        if (font !== null) zhBlock.style.fontFamily = font;
    }

    createNonZh({
        nonZhChars,
        font,
    }: {
        nonZhChars: string;
        font: string | null;
    }): void {
        if (font === null) {
            this.#el.appendText(nonZhChars);
            return;
        }

        const nonZhSpan = this.#el.createSpan({ text: nonZhChars });
        nonZhSpan.style.fontFamily = font;
    }
}
