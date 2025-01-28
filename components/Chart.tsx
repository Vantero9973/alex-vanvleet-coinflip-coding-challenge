"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ChartProps {
  history: {
    time: number;
    priceUsd: string;
  }[];
}

export default function Chart({ history }: ChartProps) {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isPriceIncreasing =
    history.length > 1 &&
    parseFloat(history[history.length - 1].priceUsd) >
      parseFloat(history[0].priceUsd);

  const borderColor = isPriceIncreasing ? "#4CAF50" : "#FF5722";
  const backgroundColor = isPriceIncreasing ? "#A5D6A7" : "#FFAB91";

  const chartData = {
    labels: history.map((entry) => new Date(entry.time).toLocaleDateString()),
    datasets: [
      {
        data: history.map((entry) => parseFloat(entry.priceUsd)),
        borderColor,
        backgroundColor,
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (tooltipItem: TooltipItem<"line">) {
            const value = tooltipItem.raw as number;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          display: !isMobile,
        },
        grid: {
          display: !isMobile,
        },
      },
      y: {
        ticks: {
          callback: function (value: string | number) {
            if (typeof value === "number") {
              return `$${value.toLocaleString()}`;
            }
            return value;
          },
          display: !isMobile,
        },
        grid: {
          display: !isMobile,
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}
