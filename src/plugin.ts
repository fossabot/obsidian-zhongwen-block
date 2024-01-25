import * as Obsidian from 'obsidian';

import type { Settings } from './settings';

export interface Plugin extends Obsidian.Plugin {
    fonts: Map<string, FontData> | null;
    settings: Settings;

    clearLayoutMemo(): void;

    saveSettings(): Promise<void>;
}
