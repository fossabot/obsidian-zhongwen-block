import * as PinyinPro from 'pinyin-pro';

import type { LayoutMemo, ZhCharBlockLayout } from './memo';
import {
    NonZhSegment,
    ZhSegment,
    splitSentenceIntoSegments,
} from './split-sentence';
import type { Settings } from '../settings';
import { type PinyinLine, PinyinLineImpl } from './pinyin-line';
import { type ZhCharLine, ZhCharLineImpl } from './zh-char-line';

import * as styles from './style.css';

const gap = 2;

const computePadding = ({
    zhCharWidth,
    pinyinWidth,
}: {
    zhCharWidth: number;
    pinyinWidth: number;
}): { zhCharPadding: number; pinyinPadding: number } =>
    pinyinWidth >= zhCharWidth
        ? {
              pinyinPadding: gap,
              zhCharPadding: (pinyinWidth - zhCharWidth) / 2 + gap,
          }
        : {
              pinyinPadding: (zhCharWidth - pinyinWidth) / 2 + gap,
              zhCharPadding: gap,
          };

const renderNonZhSegment = ({
    segment,
    pinyinLine,
    zhCharLine,
    font,
}: {
    segment: NonZhSegment;
    pinyinLine: PinyinLine;
    zhCharLine: ZhCharLine;
    font: string | null;
}): void => {
    pinyinLine.createNonZh({
        nonZhChars: segment.nonZhChars,
        font,
    });

    zhCharLine.createNonZh({
        nonZhChars: segment.nonZhChars,
        font,
    });
};

const renderAndMemorizeZhSegment = async ({
    segment,
    pinyinLine,
    zhCharLine,
    pinyinSpanClass,
    layoutMemo,
    font,
}: {
    segment: ZhSegment;
    pinyinLine: PinyinLine;
    zhCharLine: ZhCharLine;
    pinyinSpanClass: string;
    layoutMemo: LayoutMemo;
    font: string | null;
}): Promise<void> => {
    const zhCharBlocks: ZhCharBlockLayout[] = [];

    const pinyinData = PinyinPro.pinyin(segment.zhChars, {
        type: 'all',
    });

    for (const { pinyin, origin: zhChar } of pinyinData) {
        const { hiddenZhChar, pinyinSpan } = pinyinLine.appendZhCharBlock({
            zhChar,
            pinyin,
            pinyinSpanClass,
            font,
        });

        const zhCharWidth = await hiddenZhChar.waitAndMeasureCorrectWidth();
        const pinyinWidth = await pinyinSpan.waitAndMeasureCorrectWidth();

        const { zhCharPadding, pinyinPadding } = computePadding({
            zhCharWidth,
            pinyinWidth,
        });

        hiddenZhChar.setPadding(zhCharPadding);
        pinyinSpan.setPadding(pinyinPadding);

        zhCharLine.appendZhBlock({ zhChar, zhCharPadding, font });

        zhCharBlocks.push({
            zhChar,
            zhCharWidth,
            pinyin,
            pinyinWidth,
        });
    }

    layoutMemo.set(segment.zhChars, zhCharBlocks);
};

const renderMemorizedZhSegment = ({
    zhCharBlocks,
    pinyinLine,
    zhCharLine,
    pinyinSpanClass,
    font,
}: {
    zhCharBlocks: ZhCharBlockLayout[];
    pinyinLine: PinyinLine;
    zhCharLine: ZhCharLine;
    pinyinSpanClass: string;
    font: string | null;
}): void => {
    for (const { zhChar, zhCharWidth, pinyin, pinyinWidth } of zhCharBlocks) {
        const { hiddenZhChar, pinyinSpan } = pinyinLine.appendZhCharBlock({
            zhChar,
            pinyin,
            pinyinSpanClass,
            font,
        });

        const { zhCharPadding, pinyinPadding } = computePadding({
            zhCharWidth,
            pinyinWidth,
        });

        hiddenZhChar.setPadding(zhCharPadding);
        pinyinSpan.setPadding(pinyinPadding);

        zhCharLine.appendZhBlock({ zhChar, zhCharPadding, font });
    }
};

export const codeBlockProcessor = async (
    source: string,
    element: HTMLElement,
    settings: Settings,
    layoutMemo: LayoutMemo,
): Promise<void> => {
    const pinyinSpanClass = settings.alwaysDisplayPinyin
        ? styles.pinyin.base
        : `${styles.pinyin.base} ${styles.pinyin.displayOnHover}`;

    const container = element.createDiv({
        cls: styles.container,
        attr: {
            lang: 'zh-CN',
        },
    });

    const pinyinLine = new PinyinLineImpl(container);

    const zhCharLine = new ZhCharLineImpl(container);

    const segments = splitSentenceIntoSegments(source.trim());

    for (const segment of segments) {
        if (segment.type === 'nonZh') {
            renderNonZhSegment({
                segment,
                pinyinLine,
                zhCharLine,
                font: settings.font,
            });
            continue;
        }

        const zhCharBlocks = layoutMemo.get(segment.zhChars);

        if (zhCharBlocks === undefined) {
            await renderAndMemorizeZhSegment({
                segment,
                pinyinLine,
                zhCharLine,
                pinyinSpanClass,
                layoutMemo,
                font: settings.font,
            });
            continue;
        }

        renderMemorizedZhSegment({
            zhCharBlocks,
            pinyinLine,
            zhCharLine,
            pinyinSpanClass,
            font: settings.font,
        });
    }
};
