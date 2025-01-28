type AssetData = { [key: string]: string };

export const createWebSocket = (
  assets: string[] = ["ALL"],
  onMessage: (data: AssetData) => void,
  onError?: (error: string) => void,
  onStatusChange?: (status: "connected" | "disconnected" | "error") => void
): (() => void) => {
  const assetQuery = assets.join(",");
  const ws = new WebSocket(`wss://ws.coincap.io/prices?assets=${assetQuery}`);
  let isClosed = false;

  ws.onopen = () => {
    if (!isClosed) {
      onStatusChange?.("connected");
    }
  };

  ws.onmessage = (event) => {
    if (!isClosed) {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        onError?.("Failed to parse WebSocket message");
      }
    }
  };

  ws.onerror = () => {
    if (!isClosed) {
      onError?.("WebSocket encountered an error");
      onStatusChange?.("error");
    }
  };

  ws.onclose = () => {
    if (!isClosed) {
      onStatusChange?.("disconnected");
    }
    isClosed = true;
  };

  return () => {
    if (
      !isClosed &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      ws.close();
    }
    isClosed = true;
  };
};
