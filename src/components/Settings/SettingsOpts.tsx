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
        name: "appearance.width",
        label: "Width",
        placeholder: "#",
        type: "number",
        width: "w-32",
        customProps: {
          min: 0,
        },
      },

      {
        name: "appearance.height",
        label: "Height",
        placeholder: "#",
        type: "number",
        width: "w-32",
        customProps: {
          min: 0,
        },
      },
      {
        name: "appearance.position",
        label: "Position",
        placeholder: "Select Position",
        type: "select",
        width: "w-fit",
        children: Positions.map((p) => (
          <option value={p[0]} key={p[0]}>
            {p[1]}
          </option>
        )),
      },
      {
        name: "appearance.nonInteractive",
        label: "Display Only",
        placeholder: "",
        type: "checkbox",
        width: "w-fit",
      },
      {
        name: "appearance.showDelta",
        label: "Show Delta",
        placeholder: "",
        type: "checkbox",
        width: "w-fit",
      },
      {
        name: "appearance.showLastUpdated",
        label: "Show Last Updated",
        placeholder: "",
        type: "checkbox",
        width: "w-fit",
      },
      {
        name: "appearance.showDirection",
        label: "Show Direction",
        placeholder: "",
        type: "checkbox",
        width: "w-fit",
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

      // {
      //   name: "appearance.themeBackground",
      //   label: "Use Theme Background",
      //   placeholder: "",
      //   type: "checkbox",
      //   width: "w-fit",
      // },

      // {
      //   name: "appearance.background",
      //   label: "Background",
      //   placeholder: "",
      //   type: "color",
      //   width: "w-fit",
      // },
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
        name: "appearance.overwrites.background",
        label: "Background",
        placeholder: " ",
        type: "hidable",
        width: "w-1/2",
        // childProps: {
        //   subType: "color",
        // },
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
