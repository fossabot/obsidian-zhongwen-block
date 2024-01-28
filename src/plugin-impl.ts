import * as Obsidian from 'obsidian';

import { codeBlockProcessor, type LayoutMemo } from './code-block-processor';
import type { Plugin } from './plugin';
import { type Settings, defaultSettings } from './settings';
import { SettingTabImpl } from './setting-tab-impl';

const domReady = (): Promise<void> =>
    new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                resolve();
            });
        } else {
            resolve();
        }
    });

export class PluginImpl extends Obsidian.Plugin implements Plugin {
    settings!: Settings;

    async onload() {
        this.settings = Object.assign(
            {},
            defaultSettings,
            (await this.loadData()) as Settings,
        );

        this.addSettingTab(new SettingTabImpl(this.app, this));

        const layoutMemo: LayoutMemo = new Map();

        this.registerMarkdownCodeBlockProcessor(
            'zh-cn',
            async (source, element) => {
                await domReady();

                await codeBlockProcessor(
                    source,
                    element,
                    this.settings,
                    layoutMemo,
                );
            },
        );

        const fontFamilyName = 'Noto Sans Simplified Chinese';
        const googleFontsUrl =
            'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400';
        const cssFontFaces = await Obsidian.request(googleFontsUrl);
        const matchedUrls = cssFontFaces.match(/url\(.*?\)/g);
        if (matchedUrls !== null) {
            Promise.all(
                matchedUrls.map(async (url) => {
                    const font = new FontFace(fontFamilyName, url);
                    await font.load();
                    document.fonts.add(font);
                }),
            ).then(() => {
                console.log('Fonts loaded');
            });
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
