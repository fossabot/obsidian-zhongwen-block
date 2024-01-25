import * as Obsidian from 'obsidian';

import type { SettingTab } from './setting-tab';
import type { Plugin } from './plugin';

export class SettingTabImpl
    extends Obsidian.PluginSettingTab
    implements SettingTab
{
    plugin: Plugin;

    constructor(app: Obsidian.App, plugin: Plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;

        containerEl.empty();

        new Obsidian.Setting(containerEl)
            .setName('Always display pinyin')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.alwaysDisplayPinyin)
                    .onChange(async (value) => {
                        this.plugin.settings.alwaysDisplayPinyin = value;
                        await this.plugin.saveSettings();
                    }),
            );

        if (this.plugin.fonts === null) return;

        new Obsidian.Setting(containerEl)
            .setName('Font')
            .addDropdown((dropdown) => {
                dropdown.addOption('', '[Default font]');

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                for (const [postscriptName, fontData] of this.plugin.fonts!) {
                    dropdown.addOption(postscriptName, fontData.fullName);
                }

                if (this.plugin.settings.font !== null) {
                    dropdown.setValue(this.plugin.settings.font);
                }

                dropdown.onChange(async (selectedFont) => {
                    this.plugin.settings.font =
                        selectedFont !== '' ? selectedFont : null;

                    this.plugin.clearLayoutMemo();

                    await this.plugin.saveSettings();
                });
            });
    }
}
