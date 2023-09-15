import { NextResponse } from "next/server";
import { getSingleNetwork } from "~/lib/network";
import {
  getZbcPrice,
  getGasPrice,
  getBlockMetrics,
  getRealTimeMetrics,
  getLatestBlocks,
  getLatestTransactions,
  getTransactionHistoryData,
} from "~/lib/server-utils";

export async function GET(_: Request, ctx: { params: { network: string } }) {
  const network = await getSingleNetwork(ctx.params.network);

  if (!network || !network.config.rpcUrls.evm) {
    return NextResponse.json(
      {
        error: "a network with this slug could not be found",
      },
      {
        status: 404,
      },
    );
  }

  if (network.config.widgetLayout === "EvmWithPrice") {
    const [
      zbcPrice,
      gasPrice,
      blockMetrics,
      realTimeMetrics,
      transactionHistory,
      latestBlocks,
      latestTransactions,
    ] = await Promise.all([
      getZbcPrice(),
      getGasPrice(network.config.rpcUrls.evm!),
      getBlockMetrics(network.config.rpcUrls.evm!),
      getRealTimeMetrics(),
      getTransactionHistoryData(),
      getLatestBlocks(network.slug, network.config.rpcUrls.evm!),
      getLatestTransactions(network.slug, network.config.rpcUrls.evm!),
    ]);

    return NextResponse.json({
      data: {
        zbcPrice,
        gasPrice,
        blockMetrics,
        realTimeMetrics,
        transactionHistory,
        latestBlocks,
        latestTransactions,
      },
    });
  } else {
    return NextResponse.json(
      {
        error: "this network layout is not supported yet",
      },
      {
        status: 422,
      },
    );
  }
}

export const runtime = "edge";
export const fetchCache = "default-no-store";
