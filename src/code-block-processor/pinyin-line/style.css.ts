import { style } from '@vanilla-extract/css';

export const pinyinLine = style({
    position: 'absolute',
    top: '0',
    left: '0',
    lineHeight: '2.7rem',
    zIndex: '0',
});

export const hiddenZhBlock = style({
    display: 'inline-block',
    position: 'relative',
});

export const hiddenNonZh = style({
    opacity: '0',
});
