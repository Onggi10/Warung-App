"use client";

import TransaksiForm from "@/components/TransaksiForm";
import TransaksiTable from "@/components/TransaksiTable";
import { useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Warung</h1>
      <TransaksiForm onSuccess={() => setRefresh(!refresh)} />
      <TransaksiTable key={refresh.toString()} />
    </div>
  );
}
