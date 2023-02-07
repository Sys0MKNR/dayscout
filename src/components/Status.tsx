import { useMemo, useRef } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowNarrowRight,
  ArrowsDown,
  ArrowsUp,
  ArrowUp,
  ArrowUpRight,
  ChevronsDown,
  ChevronsUp,
  Icon as IIcon,
  Minus,
  X,
} from "tabler-icons-react";
import { ISettingsSchema } from "@/hooks/useSettings";
import Loader from "./Loader";

import { useQuery } from "@tanstack/react-query";

import { getSettings, getStatus } from "@/lib/api";

const directionMap: Record<string, IIcon | null> = {
  NONE: null,
  TripleUp: ChevronsUp,
  DoubleUp: ArrowsUp,
  SingleUp: ArrowUp,
  FortyFiveUp: ArrowUpRight,
  Flat: ArrowNarrowRight,
  FortyFiveDown: ArrowDownRight,
  SingleDown: ArrowDown,
  DoubleDown: ArrowsDown,
  TripleDown: ChevronsDown,
  "NOT COMPUTABLE": Minus,
  "RATE OUT OF RANGE": X,
};

const textSizesDefault = {
  delta: "text-4xl",
  direction: "text-8xl",
  lastUpdated: "text-2xl",
  main: "text-8xl",
};

const textSizesFullScreen = {
  delta: "text-[12vmin]",
  direction: "text-[32vmin]",
  lastUpdated: "text-[10vmin]",
  main: "text-[32vmin]",
};

export interface StatusProps {
  appearance: ISettingsSchema["appearance"];
  url: string;
  token: string;
  thresholds: ISettingsSchema["thresholds"];
  fetchThresholds?: boolean;
  fetchInterval?: number;
}

const DirectionIcon = (props: { direction: string; size: number }) => {
  const Icon = directionMap[props.direction];

  if (!Icon) {
    return null;
  }

  return <Icon size={props.size}> </Icon>;
};

function Status(props: StatusProps) {
  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      console.log("settings fetch");
      return props.fetchThresholds
        ? await getSettings({ url: props.url, token: props.token })
        : { thresholds: props.thresholds };
    },
  });

  const thresholds = settingsQuery?.data?.thresholds;

  const { width, height, showDelta, showLastUpdated } = props.appearance;

  const statusQuery = useQuery({
    queryKey: ["status"],
    queryFn: () =>
      getStatus({
        url: props.url,
        token: props.token,
        thresholds: thresholds as any,
      }),
    enabled: !!thresholds,
    refetchInterval: props.fetchInterval || 2000,
    refetchOnMount: true,
    retry: 3,
  });

  const textSize = useMemo(() => {
    // status

    let main = height * 0.4;

    let scale = 1;

    if (main * 4 >= width) {
      main = width / 4;
      scale = main / (height * 0.4);
    }

    // delta
    const delta = height * 0.25 * scale;

    // last updated
    const lastUpdated = height * 0.15 * scale;

    return {
      main,
      delta,
      lastUpdated,
    };
  }, [props.appearance.width, props.appearance.height]);

  const status = statusQuery.data;

  const isLoading = settingsQuery.isLoading || statusQuery.isLoading;
  const isError = settingsQuery.isError || statusQuery.isError;

  if (isError || !status) {
    return (
      <div className="text-4xl text-center underline flex h-full justify-center items-center">
        <p className="h-fit pb-8">Can't Load Data</p>
      </div>
    );
  } else if (isLoading) {
    return <Loader />;
  }

  const statusColor = () => {
    switch (status?.state) {
      case "urgent":
        return "text-error";
      case "warn":
        return "text-warning";
      case "ok":
        return "text-gray-100";
      default:
        return "text-gray-100";
    }
  };

  //  h-[calc(100%-2rem)]

  return (
    <div
      className={`flex flex-col text-center select-none h-full overflow-hidden ${statusColor()}`}
    >
      <div className="flex w-full flex-grow">
        <div className="w-8/12 flex justify-center items-center">
          <h1 style={{ fontSize: textSize.main }} className="font-extrabold">
            {status.value}
          </h1>
        </div>
        <div className="w-4/12 flex justify-center items-center">
          {status.direction && (
            <DirectionIcon size={textSize.main} direction={status.direction} />
          )}
        </div>
      </div>

      {status.delta && showDelta && (
        <div className="font-bold">
          <span style={{ fontSize: textSize.delta }}>{status.deltaText}</span>
        </div>
      )}

      {showLastUpdated && (
        <div className="">
          <span
            style={{ fontSize: textSize.lastUpdated }}
            className="text-ellipsis"
          >
            {status.lastUpdatedText}
          </span>
        </div>
      )}
    </div>
  );
}

export default Status;
