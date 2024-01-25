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
    fonts: Map<string, FontData> | null = null;
    settings!: Settings;

    layoutMemo: LayoutMemo = new Map();

    async onload() {
        this.settings = Object.assign(
            {},
            defaultSettings,
            (await this.loadData()) as Settings,
        );

        this.addSettingTab(new SettingTabImpl(this.app, this));

        this.registerMarkdownCodeBlockProcessor(
            'zh-cn',
            async (source, element) => {
                await domReady();

                await codeBlockProcessor(
                    source,
                    element,
                    this.settings,
                    this.layoutMemo,
                );
            },
        );

        if ('queryLocalFonts' in window) {
            const fonts = await queryLocalFonts();

            this.fonts = new Map<string, FontData>();

            for (const font of fonts) {
                this.fonts.set(font.postscriptName, font);
            }
        }
    }

    clearLayoutMemo() {
        this.layoutMemo.clear();
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
