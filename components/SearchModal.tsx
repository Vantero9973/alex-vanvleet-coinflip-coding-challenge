"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { getAssets, Asset } from "@/lib/api";

interface SearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SearchModal({
  open,
  setOpen,
}: SearchModalProps): JSX.Element {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  const filteredAssets =
    query === ""
      ? []
      : data?.data.filter((asset: Asset) =>
          asset.name.toLowerCase().includes(query.toLowerCase())
        ) || [];

  useEffect(() => {
    if (open) {
      setQuery("");
    }
  }, [open]);

  return (
    <Dialog
      className="relative z-10"
      open={open}
      onClose={() => {
        setOpen(false);
        setQuery("");
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-500/25 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-3xl transform divide-y divide-zinc-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <Combobox
            as="div"
            onChange={(asset: Asset) => {
              if (asset) {
                router.push(`/rates/${asset.id}`);
                setOpen(false);
              }
            }}
          >
            {(bag) => {
              const activeOption = bag.activeOption as Asset | null;
              return (
                <>
                  <div className="grid grid-cols-1">
                    <ComboboxInput
                      autoFocus
                      className="col-start-1 row-start-1 h-12 w-full pl-11 pr-4 text-base text-zinc-900 outline-none placeholder:text-zinc-400 sm:text-sm"
                      placeholder="Search cryptocurrencies..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <MagnifyingGlassIcon
                      className="pointer-events-none col-start-1 row-start-1 ml-4 h-5 w-5 self-center text-zinc-400"
                      aria-hidden="true"
                    />
                  </div>

                  {isLoading ? (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <p>Loading...</p>
                    </div>
                  ) : isError ? (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <p>Error fetching data. Please try again.</p>
                    </div>
                  ) : query === "" || filteredAssets.length > 0 ? (
                    <ComboboxOptions
                      static
                      hold
                      className="flex transform-gpu divide-x divide-zinc-100"
                    >
                      <div
                        className={`max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4 ${
                          activeOption ? "sm:h-96" : ""
                        }`}
                      >
                        <div className="-mx-2 text-sm text-zinc-700">
                          {(query === ""
                            ? data?.data || []
                            : filteredAssets
                          ).map((asset: Asset) => (
                            <ComboboxOption
                              key={asset.id}
                              value={asset}
                              className="group flex cursor-default select-none items-center rounded-md p-2 hover:bg-zinc-100 hover:text-zinc-900"
                            >
                              <img
                                alt={asset.name}
                                src={`/icons/${asset.symbol.toLowerCase()}.svg`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/icons/generic.svg";
                                }}
                                className="h-6 w-6 flex-none rounded-full"
                              />
                              <span className="ml-3 flex-auto truncate">
                                {asset.name}
                              </span>
                              <span className="ml-3 text-zinc-500">
                                $
                                {parseFloat(asset.priceUsd).toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </span>
                              <ChevronRightIcon
                                className="ml-3 hidden h-5 w-5 flex-none text-zinc-400 group-hover:block"
                                aria-hidden="true"
                              />
                            </ComboboxOption>
                          ))}
                        </div>
                      </div>

                      {activeOption && (
                        <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-zinc-100 overflow-y-auto sm:flex">
                          <div className="flex-none p-6 text-center space-y-1">
                            <h2 className="flex items-center justify-center gap-3 mt-3 font-semibold text-zinc-900">
                              {activeOption.name}
                              <span className="text-xs font-normal text-zinc-500">
                                {activeOption.symbol}
                              </span>
                              <span className="w-fit text-sm text-zinc-600 bg-white font-semibold px-3 py-0.5 rounded-full ring-1 ring-inset ring-zinc-300">
                                #{activeOption.rank}
                              </span>
                            </h2>
                            <div
                              className={`text-2xl font-semibold flex items-center justify-center gap-x-2 ${
                                parseFloat(activeOption.changePercent24Hr) > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              $
                              {parseFloat(activeOption.priceUsd).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                              {parseFloat(activeOption.changePercent24Hr) >
                              0 ? (
                                <ArrowUpIcon className="h-5 w-5" />
                              ) : (
                                <ArrowDownIcon className="h-5 w-5" />
                              )}
                              <p className="text-base font-semibold">
                                {parseFloat(
                                  activeOption.changePercent24Hr
                                ).toFixed(2)}
                                % (24h)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </ComboboxOptions>
                  ) : (
                    <div className="px-6 py-14 text-center text-sm sm:px-14">
                      <p className="mt-4 font-semibold text-zinc-900">
                        No cryptocurrencies found
                      </p>
                      <p className="mt-2 text-zinc-500">
                        Try refining your search term.
                      </p>
                    </div>
                  )}
                </>
              );
            }}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
