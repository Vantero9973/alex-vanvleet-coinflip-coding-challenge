import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.coincap.io/v2",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export type Asset = {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  vwap24Hr: string;
};

export type AssetsResponse = {
  data: Asset[];
  timestamp: number;
};

export type AssetResponse = {
  data: Asset;
  timestamp: number;
};

export type HistoryEntry = {
  priceUsd: string;
  time: number;
};

export type AssetHistoryResponse = {
  data: HistoryEntry[];
  timestamp: number;
};

export const getAssets = async (): Promise<AssetsResponse> => {
  try {
    const response = await axiosInstance.get<AssetsResponse>("/assets");
    return response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw new Error("Failed to fetch assets");
  }
};

export const getAsset = async (id: string): Promise<AssetResponse> => {
  try {
    const response = await axiosInstance.get<AssetResponse>(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    throw new Error("Failed to fetch asset details");
  }
};

export const getAssetHistory = async (
  id: string,
  interval: string = "d1"
): Promise<AssetHistoryResponse> => {
  try {
    const response = await axiosInstance.get<AssetHistoryResponse>(
      `/assets/${id}/history`,
      {
        params: { interval },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for asset ${id}:`, error);
    throw new Error("Failed to fetch asset history");
  }
};
