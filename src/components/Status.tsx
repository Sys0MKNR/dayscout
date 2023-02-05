import { useRef } from "react";
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
  fullScreen?: boolean;
  url: string;
  token: string;
  thresholds: ISettingsSchema["thresholds"];
  fetchThresholds?: boolean;
  fetchInterval?: number;
}

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

  console.log("thresholds", thresholds);

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

  const status = statusQuery.data;

  const statusTextRef = useRef<HTMLHeadingElement>(null);

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

  const textSizes = props.fullScreen ? textSizesFullScreen : textSizesDefault;

  const DirectionIcon = (props: { direction: string; size: number }) => {
    const Icon = directionMap[props.direction];

    if (!Icon) {
      return null;
    }

    return <Icon size={props.size}> </Icon>;
  };

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

  return (
    <div
      className={`text-center select-none h-[calc(100%-2rem)] ${statusColor()}`}
    >
      <div className="flex w-full">
        <div className="w-8/12">
          <h1
            ref={statusTextRef}
            className={`${textSizes.main} font-extrabold`}
          >
            {status.value}
          </h1>
        </div>
        <div className="w-4/12 flex justify-center items-center">
          {status.direction && (
            <DirectionIcon size={96} direction={status.direction} />
          )}
        </div>
      </div>

      {status.delta && (
        <div className={`${textSizes.delta} card-normal font-bold`}>
          <span>{status.deltaText}</span>
        </div>
      )}

      <div className={`${textSizes.lastUpdated} card-normal`}>
        <span>{status.lastUpdatedText}</span>
      </div>
    </div>
  );
}

export default Status;
