import type { HiddenZhChar } from '../hidden-zh-char';
import type { PinyinSpan } from '../pinyin-span';

export interface PinyinLine {
    appendZhCharBlock(args: {
        zhChar: string;
        pinyin: string;
        pinyinSpanClass: string;
        font: string | null;
    }): {
        hiddenZhChar: HiddenZhChar;
        pinyinSpan: PinyinSpan;
    };

    createNonZh(args: { nonZhChars: string; font: string | null }): void;
}
