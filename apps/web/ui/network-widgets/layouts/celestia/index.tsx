"use client";
import * as React from "react";
import { BarChart, Disabled, Document, Folder } from "~/ui/icons";
import { IconCard } from "~/ui/network-widgets/widgets/icon-card";
import { LatestTransactions } from "~/ui/network-widgets/widgets/latest-transactions";
import { LatestBlocks } from "~/ui/network-widgets/widgets/latest-blocks";

import { cn } from "~/ui/shadcn/utils";
import {
  useLatestBlocks,
  useLatestTransactions,
  useWidgetData,
} from "./use-widget-data";

import type { SearchOption } from "~/lib/shared-utils";
interface Props {
  network: SearchOption;
}

// TODO : transform this into a client component
export function CelestiaWidgetLayout({ network }: Props) {
  // for some reason this is still necessary despite even https://github.com/modularcloud/explorer/pull/221/files#diff-c69978f5b3968360f90c0512cc7d7e2b73d184e4b4aa1b70dccaee69465000f2R33
  if (!network) return null;

  const { data: apiResult, isLoading, error } = useWidgetData(network.id);

  const latestBlocks = useLatestBlocks(network.id);

  const latestTransactions = useLatestTransactions(network.id);

  if (error) {
    return <SvmSkeleton error={"".toString()} />;
  }

  if (
    !apiResult ||
    isLoading ||
    latestBlocks.isLoading ||
    latestTransactions.isLoading
  ) {
    return <SvmSkeleton />;
  }

  return (
    <div
      style={{
        // @ts-expect-error this is a CSS variable
        "--color-primary": network.brandColor,
      }}
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 auto-rows-[minmax(145px,_1fr)] auto-cols-[145px]",
        "w-full gap-4 font-medium",
        "accent-primary place-items-stretch",
      )}
    >
      <IconCard
        className="lg:col-span-1 row-span-1 lg:row-start-3"
        label="NAMESPACES"
        icon={Folder}
        value={apiResult.metrics.NAMESPACE.toLocaleString("en-US")}
      />

      {/* <IconCard
        className="lg:row-start-3 lg:col-start-3"
        label="BANDWIDTH"
        icon={Folder}
        value={apiResult.metrics.AVG_BlOCK_BLOB_SIZE.toLocaleString("en-US")}
      /> */}

      <LatestTransactions
        networkSlug={network.id}
        className="col-span-2 row-span-2 row-start-1 col-start-1"
        data={
          latestTransactions?.data?.body?.type === "collection"
            ? latestTransactions?.data?.body?.entries.map((entry: any) => {
                return {
                  hash: entry.row.Transactions.payload.value,
                  success: entry.row.Status.payload,
                  // temporary!!
                  type: entry.row.Type.payload,
                };
              })
            : []
        }
      />

      <IconCard
        className="lg:row-start-2 lg:col-start-3 sm:col-start-1 sm:col-span-2 lg:col-span-1 sm:row-start-6"
        label="TOTAL BLOCKS"
        icon={Disabled}
        value={parseInt(apiResult.blockHeight).toLocaleString("en-US")}
      />

      <IconCard
        className="lg:row-start-3 lg:col-start-1 lg:col-span-2 sm:row-start-1 sm:col-start-3 row-start-3 col-start-1"
        label="TOTAL BLOBS"
        icon={Document}
        value={apiResult.metrics.BLOB.toLocaleString("en-US")}
      />

      <IconCard
        className="lg:row-start-1 lg:col-start-3 col-span-2 sm:col-span-1"
        label="GAS PRICE"
        icon={Document}
        value={apiResult.metrics.LAST_10_BLOCKS_AVG_GAS_PRICE.toLocaleString(
          "en-US",
        )}
      />

      <IconCard
        label="TOTAL TRANSACTIONS"
        className="lg:row-start-3 lg:col-start-4 lg:col-span-2 sm:col-start-4 sm:row-start-1 row-start-3 col-start-2"
        icon={BarChart}
        value={apiResult.metrics.TRANSACTION.toLocaleString("en-US")}
      />

      {/* <Treemap
        data={apiResult.metrics.LAST_10_BLOCKS_BLOB_SIZES}
        className="h-[20.5rem] col-span-2 row-span-2 order-first lg:row-start-1 lg:col-start-4"
      /> */}

      <LatestBlocks
        networkSlug={network.id}
        className="col-span-2 row-span-2 order-first lg:row-start-1 lg:col-start-4"
        data={
          latestBlocks?.data?.body?.type === "collection"
            ? latestBlocks?.data?.body?.entries.map((block) => {
                return {
                  number: Number(block.row.Height.payload),
                  noOfTransactions: Number(block.row.Txs.payload),
                  timestamp:
                    typeof block.sidebar.properties.Timestamp.payload === "string"
                      ? new Date(block.sidebar.properties.Timestamp.payload).getTime()
                      : new Date().getTime(),
                };
              })
            : []
        }
      />
    </div>
  );
}

function Placeholder(props: {
  className?: string;
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <div
      className={cn(props.className, "rounded-lg", {
        "animate-pulse": props.isLoading,
        "bg-muted-100": !props.isError,
        "bg-red-100": props.isError,
      })}
    />
  );
}

export function SvmSkeleton(props: { error?: string }) {
  return (
    <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 auto-rows-[145px] auto-cols-[145px] relative">
      {props.error && (
        <div className="absolute inset-0 backdrop-blur-md rounded-lg text-center p-24 border border-red-400">
          <p className="text-red-400 text-lg">
            ⚠️ An Error Occured while loading the widgets :&nbsp;
            <strong className="font-medium">{props.error}</strong>
          </p>
        </div>
      )}

      <Placeholder className="lg:row-start-1 lg:col-start-3" />

      <Placeholder className="col-span-2 row-span-2" />

      <Placeholder className="lg:row-start-2 lg:col-start-3" />

      <Placeholder className="lg:row-start-3 lg:col-start-1" />

      <Placeholder className="lg:row-start-3 lg:col-start-5 sm:col-start-4 sm:row-start-1 row-start-3 col-start-2" />

      <Placeholder className="lg:col-span-1 row-span-1 hidden lg:block lg:row-start-3" />
      <Placeholder className="lg:col-span-1 row-span-1 hidden lg:block lg:row-start-3" />
      <Placeholder className="lg:col-span-1 row-span-1 hidden lg:block lg:row-start-3" />

      <Placeholder className="col-span-2 row-span-2 order-first lg:row-start-1 lg:col-start-4" />
    </div>
  );
}