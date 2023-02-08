import { emit, listen } from "@tauri-apps/api/event";
import { z } from "zod";

import { Store } from "tauri-plugin-store-api";
import { proxy } from "valtio";
import { NestedKeyOf, Subset, wait } from "@/lib/utils";
import { ReactNode } from "react";

import { Position } from "tauri-plugin-positioner-api";

export const Themes: Readonly<[string, ...string[]]> = [
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "night",
  "pastel",
  "retro",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
];

const _Positions = Object.entries(Position);

export const Positions = _Positions.slice(0, 9);

const HexColorSchema = z
  .string()
  .min(4)
  .max(9)
  .startsWith("#")
  .nullable()
  .default(null);

export const SettingsSchema = z.object({
  url: z.string().default(""),
  token: z.string().default(""),
  fetchInterval: z.coerce.number().default(2000),
  appearance: z
    .object({
      theme: z.enum(Themes).default("forest"),

      backgroundTransparency: z.coerce.number().min(0).max(100).default(100),
      background: HexColorSchema.default("#000000"),
      themeBackground: z.coerce.boolean().default(true),
      nonInteractive: z.coerce.boolean().default(true),
      position: z.coerce.number().default(0),
      width: z.coerce.number().default(200),
      height: z.coerce.number().default(200),
      showDelta: z.coerce.boolean().default(true),
      showLastUpdated: z.coerce.boolean().default(true),
      showDirection: z.coerce.boolean().default(true),
    })
    .default({}),

  fetchThresholds: z.coerce.boolean().default(true),
  thresholds: z
    .object({
      high: z.coerce.number().default(260),
      low: z.coerce.number().default(55),
      targetBottom: z.coerce.number().default(80),
      targetTop: z.coerce.number().default(180),
    })
    .default({}),
  quitOnClose: z.coerce.boolean().default(false),
});

export type ISettingsSchema = z.infer<typeof SettingsSchema>;
export interface ISettingsGroup {
  name: string;
  children: ISettingOption[];
}

export interface ISettingOption {
  name: NestedKeyOf<ISettingsSchema>;
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  width?: string;
  opts?: any;
  children?: ReactNode;
  customProps?: Record<string, any>;
}

const store = new Store(".settings.dat");

const load = async (full = false) => {
  if (full) {
    try {
      await store.load();
    } catch (error) {}
  }

  const entries = await store.entries();

  const s = SettingsSchema.parse(Object.fromEntries(entries));

  return s;
};

export const state = proxy({ settings: load(true) }); // maybe need to change

export const updateSettings = async (settings: Subset<ISettingsSchema>) => {
  const p = Object.entries(settings).map((s) => store.set(s[0], s[1]));
  await Promise.all(p);

  await store.save();

  // await wait(2000);
  emit("settings-updated");
};

(async () => {
  const unlisten = await listen("settings-updated", () => {
    state.settings = load();
  });
})();
