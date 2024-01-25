import { style } from '@vanilla-extract/css';

export const container = style({
    position: 'relative',
    selectors: {
        [`.cm-preview-code-block &`]: {
            marginTop: '0.5rem',
        },
    },
});

export const pinyin = {
    base: style({
        position: 'absolute',
        top: '-1.3rem',
        left: '0',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        fontSize: '0.8rem',
    }),

    displayOnHover: style({
        transition: 'opacity .3s ease',
        opacity: '0',
        selectors: {
            [`${container}:has(*:hover) &`]: {
                opacity: '1',
            },
        },
    }),
};
