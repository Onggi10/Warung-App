"use client";

import TransaksiForm from "@/components/TransaksiForm";
import TransaksiTable from "@/components/TransaksiTable";
import { useState } from "react";

export default function Transaksi() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <h1 className="text-3xl text-center font-bold mb-6">Transaksi</h1>
      <TransaksiForm onSuccess={() => setRefresh(!refresh)} />
      <TransaksiTable key={refresh ? "refresh" : "static"} />
    </div>
  );
}
