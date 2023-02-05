import { ISettingsSchema } from "@/hooks/useSettings";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { fetch } from "@tauri-apps/api/http";

const URL_STATUS = "/api/v2/properties";
const URL_SETTINGS = "/api/v1/status";

interface IGetStatusArgs {
  url: string;
  token: string;
  thresholds: ISettingsSchema["thresholds"];
}

export interface IStatus {
  value: number;
  direction: string;
  timestamp: number;
  lastUpdatedText: string;
  delta?: number;
  deltaText?: string;
  state: "urgent" | "warn" | "ok";
}

export const getStatus = async (args: IGetStatusArgs) => {
  console.log("status fetch");

  const { url, thresholds, token } = args;

  const statusURL = new URL(URL_STATUS, url);
  statusURL.searchParams.append("token", token);

  const res = await fetch(statusURL.toString());

  const data: any = res.data;

  const values = data.bgnow.sgvs[0];
  const delta = data.delta;

  const value = values.scaled;

  let state: IStatus["state"] = "urgent";

  if (value < thresholds.low) {
    state = "urgent";
  } else if (value < thresholds.targetBottom) {
    state = "warn";
  } else if (value < thresholds.targetTop) {
    state = "ok";
  } else if (value < thresholds.high) {
    state = "warn";
  } else {
    state = "urgent";
  }

  const s: IStatus = {
    value,
    direction: values.direction,
    timestamp: values.mills,
    lastUpdatedText: dayjs(values.mills).from(dayjs()),
    state,
  };

  if (delta) {
    s.delta = delta.absolute;
    s.deltaText = delta.display;
  }

  return s;
};

interface IGetSettingsArgs {
  url: string;
  token: string;
}

export interface INSSettings {
  thresholds: ISettingsSchema["thresholds"];
}

export const getSettings = async (args: IGetSettingsArgs) => {
  const { url, token } = args;

  const statusURL = new URL(URL_SETTINGS, url);
  statusURL.searchParams.append("token", token);

  const res = await fetch(statusURL.toString(), {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  const data: any = res.data;

  const thresholds = data.settings.thresholds;

  const settings: INSSettings = {
    thresholds: {
      high: thresholds.bgHigh,
      low: thresholds.bgLow,
      targetBottom: thresholds.bgTargetBottom,
      targetTop: thresholds.bgTargetTop,
    },
  };

  return settings;
};
