"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getAssets, AssetsResponse } from "@/lib/api";
import { createWebSocket } from "@/lib/websocket";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import Loader from "@/components/Loader";

export default function RatesPage() {
  const { data, error, isLoading } = useQuery<AssetsResponse>({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data?.data) return;

    const assetIds = data.data.map((asset) => asset.id);
    const cleanup = createWebSocket(assetIds, (newPrices) => {
      setPrices((prevPrices) => ({ ...prevPrices, ...newPrices }));
    });

    return () => {
      cleanup();
    };
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (error instanceof Error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {data?.data.map((asset) => {
          const currentPrice = parseFloat(
            prices[asset.id] || asset.priceUsd
          ).toFixed(2);
          const changePercent = parseFloat(asset.changePercent24Hr);
          const isPositive = changePercent > 0;

          return (
            <Link
              href={`/rates/${asset.id}`}
              key={asset.id}
              className={`overflow-hidden rounded-xl border border-zinc-200 shadow-sm hover:shadow-md ${
                isPositive ? "hover:bg-green-50" : "hover:bg-red-50"
              }`}
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-x-4">
                  <img
                    alt={asset.name}
                    src={`/icons/${asset.symbol.toLowerCase()}.svg`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/icons/generic.svg";
                    }}
                    className="size-12 p-0.5 flex-none object-cover"
                  />
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col justify-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        {asset.name}
                      </p>
                      <p className="text-xs text-zinc-600">{asset.symbol}</p>
                    </div>
                    <p className="text-sm text-zinc-600 bg-white font-semibold px-3 py-0.5 rounded-full ring-1 ring-inset ring-zinc-300">
                      #{asset.rank}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <p
                    className={`text-xl font-bold ${
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
                    <ArrowUpIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="w-5 h-5 text-red-600" />
                  )}
                  <p
                    className={`text-sm ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {changePercent.toFixed(2)}% (24h)
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
