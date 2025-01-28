"use client";

import { useEffect, useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAsset,
  getAssetHistory,
  AssetResponse,
  AssetHistoryResponse,
} from "@/lib/api";
import Chart from "@/components/Chart";
import { createWebSocket } from "@/lib/websocket";
import Loader from "@/components/Loader";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

export default function AssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [livePrice, setLivePrice] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<AssetResponse>({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id),
  });

  const {
    data: historyData,
    error: historyError,
    isLoading: isHistoryLoading,
  } = useQuery<AssetHistoryResponse>({
    queryKey: ["assetHistory", id],
    queryFn: () => getAssetHistory(id, "d1"),
  });

  useEffect(() => {
    const cleanup = createWebSocket([id], (newPrices) => {
      if (newPrices[id]) {
        setLivePrice(newPrices[id]);
      }
    });

    return () => {
      cleanup();
    };
  }, [id]);

  if (isLoading || isHistoryLoading) {
    return <Loader />;
  }

  if (error instanceof Error || historyError instanceof Error) {
    return (
      <p>
        Error: {(error as Error)?.message || (historyError as Error)?.message}
      </p>
    );
  }

  const asset = data?.data;
  const history = historyData?.data;

  if (!asset || !history) {
    return <p>Asset or history data is unavailable.</p>;
  }

  const currentPrice = parseFloat(livePrice || asset.priceUsd).toFixed(2);
  const changePercent = parseFloat(asset.changePercent24Hr);
  const isPositive = changePercent > 0;

  return (
    <main>
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-3">
          <h1 className="text-xl md:text-2xl font-bold">{asset.name}</h1>
          <p className="text-sm text-zinc-600">{asset.symbol}</p>
          <p className="text-sm text-zinc-600 bg-white font-semibold px-3 py-0.5 rounded-full ring-1 ring-inset ring-zinc-300">
            #{asset.rank}
          </p>
        </div>
        <div className="flex items-center gap-x-3">
          <p
            className={`text-3xl md:text-5xl font-bold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            $
            {parseFloat(currentPrice).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          {isPositive ? (
            <ArrowUpIcon className="w-6 h-6 text-green-600" />
          ) : (
            <ArrowDownIcon className="w-6 h-6 text-red-600" />
          )}
          <p
            className={`text-lg font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {changePercent.toFixed(2)}% (24h)
          </p>
        </div>
        <div className="flex max-sm:flex-col sm:flex-wrap gap-3 text-sm md:text-base">
          <p>
            <strong>Supply:</strong> {parseFloat(asset.supply).toLocaleString()}
          </p>
          <p>
            <strong>Max Supply:</strong>{" "}
            {asset.maxSupply
              ? parseFloat(asset.maxSupply).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Market Cap:</strong> $
            {parseFloat(asset.marketCapUsd).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            <strong>Volume (24h):</strong> $
            {parseFloat(asset.volumeUsd24Hr).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            <strong>VWAP (24h):</strong> $
            {parseFloat(asset.vwap24Hr).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
      <div className="py-10">
        <Chart history={history} />
      </div>
    </main>
  );
}
