"use client";

import React from "react";

export default function Loader(): JSX.Element {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="h-24 w-24 border-8 border-t-8 border-[#e7bb43]/25 rounded-full border-t-[#e7bb43] animate-spin" />
    </div>
  );
}
