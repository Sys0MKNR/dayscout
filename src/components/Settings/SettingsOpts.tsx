import { ISettingsGroup, Positions, Themes } from "@/hooks/useSettings";

export const SettingsOpts: ISettingsGroup[] = [
  {
    name: "General",
    children: [
      {
        name: "url",
        label: "Url",
        placeholder: "Enter nightscout url...",
        type: "text",
        width: "w-1/2",
      },
      {
        name: "token",
        label: "Token",
        placeholder: "Enter nightscout token...",
        type: "password",
        width: "w-1/2",
      },
      {
        name: "fetchInterval",
        label: "Fetch Interval",
        placeholder: "#",
        type: "number",
        width: "w-fit",
      },
      {
        name: "quitOnClose",
        label: "Quit on Close",
        placeholder: "",
        type: "checkbox",
        width: "w-fit",
      },
    ],
  },
  {
    name: "Display",
    children: [
      {
        name: "appearance.position",
        label: "Position",
        placeholder: "Select Position",
        type: "select",
        width: "w-1/3",
        children: Positions.map((p) => (
          <option value={p[0]} key={p[0]}>
            {p[1]}
          </option>
        )),
      },

      {
        name: "appearance.x",
        label: "X",
        placeholder: "#",
        type: "number",
        width: "w-1/3",
      },

      {
        name: "appearance.y",
        label: "Y",
        placeholder: "#",
        type: "number",
        width: "w-1/3",
      },

      {
        name: "appearance.width",
        label: "Width",
        placeholder: "#",
        type: "number",
        width: "w-1/3",
        customProps: {
          min: 0,
        },
      },

      {
        name: "appearance.height",
        label: "Height",
        placeholder: "#",
        type: "number",
        width: "w-1/3",
        customProps: {
          min: 0,
        },
      },

      {
        name: "appearance.nonInteractive",
        label: "Non Interactive",
        placeholder: "",
        type: "checkbox",
        width: "w-1/3",
      },

      {
        name: "appearance.showDelta",
        label: "Show Delta",
        placeholder: "",
        type: "checkbox",
        width: "w-1/3",
      },
      {
        name: "appearance.showLastUpdated",
        label: "Show Last Updated",
        placeholder: "",
        type: "checkbox",
        width: "w-1/3",
      },
      {
        name: "appearance.showDirection",
        label: "Show Direction",
        placeholder: "",
        type: "checkbox",
        width: "w-1/3",
      },
    ],
  },

  {
    name: "Appearance",
    children: [
      {
        name: "appearance.theme",
        label: "Theme",
        placeholder: "Select Theme",
        type: "select",
        width: "w-fit",
        children: Themes.map((t) => <option key={t}>{t}</option>),
      },

      {
        name: "appearance.backgroundTransparency",
        label: "Background Transparency",
        placeholder: "#",
        type: "range",
        width: "w-fit",
        customProps: {
          min: 0,
          max: 100,
        },
      },
    ],
  },

  {
    name: "Overwrites",
    children: [
      {
        name: "appearance.overwrites.background.active",
        label: "Background",
        placeholder: " ",
        type: "checkbox",
        width: "w-1/4",
        stacked: false,
        className: "justify-between",
      },
      {
        name: "appearance.overwrites.background.value",
        label: " ",
        placeholder: "",
        type: "color",
        width: "w-3/4",
        stacked: false,
      },

      {
        name: "appearance.overwrites.ok.active",
        label: "Ok",
        placeholder: " ",
        type: "checkbox",
        width: "w-1/4",
        stacked: false,
        className: "justify-between",
      },
      {
        name: "appearance.overwrites.ok.value",
        label: " ",
        placeholder: "",
        type: "color",
        width: "w-3/4",
        stacked: false,
      },
      {
        name: "appearance.overwrites.warn.active",
        label: "Warn",
        placeholder: " ",
        type: "checkbox",
        width: "w-1/4",
        stacked: false,
        className: "justify-between",
      },
      {
        name: "appearance.overwrites.warn.value",
        label: " ",
        placeholder: "",
        type: "color",
        width: "w-3/4",
        stacked: false,
      },
      {
        name: "appearance.overwrites.urgent.active",
        label: "Urgent",
        placeholder: " ",
        type: "checkbox",
        width: "w-1/4",
        stacked: false,
        className: "justify-between",
      },
      {
        name: "appearance.overwrites.urgent.value",
        label: " ",
        placeholder: "",
        type: "color",
        width: "w-3/4",
        stacked: false,
      },
    ],
  },

  {
    name: "Thresholds",
    children: [
      {
        name: "fetchThresholds",
        label: "Get thresholds from Nightscout",
        type: "checkbox",
      },

      {
        name: "thresholds.high",
        label: "High",
        placeholder: "Enter high...",
        type: "number",
        width: "w-1/4",
      },
      {
        name: "thresholds.targetTop",
        label: "Target Top",
        placeholder: "Enter target top...",
        type: "number",
        width: "w-1/4",
      },
      {
        name: "thresholds.targetBottom",
        label: "Target Bottom",
        placeholder: "Enter target bottom...",
        type: "number",
        width: "w-1/4",
      },
      {
        name: "thresholds.low",
        label: "Low",
        placeholder: "Enter low...",
        type: "number",
        width: "w-1/4",
      },
    ],
  },
];
