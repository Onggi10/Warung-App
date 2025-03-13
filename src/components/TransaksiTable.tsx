"use client";

import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";

type Transaksi = {
  id: string;
  barang_id: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  barang_nama: string;
};

export default function TransaksiTable() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);

  useEffect(() => {
    async function fetchTransaksi() {
      const { data, error } = await supabase
        .from("transaksi")
        .select(
          `
          id, 
          barang_id, 
          jumlah, 
          harga_satuan, 
          subtotal, 
          barang:transaksi_barang_id_fkey (barang_nama)
        `
        )
        .order("id", { ascending: false });

      if (error) {
        console.error("❌ Error fetching transaksi:", error.message);
        return;
      }

      console.log("✅ Data transaksi dari Supabase:", data);

      // FIX: Ambil `barang_nama` sebagai string, bukan array
      const transaksiData = data.map((t) => ({
        id: t.id,
        barang_id: t.barang_id,
        jumlah: t.jumlah,
        harga_satuan: t.harga_satuan,
        subtotal: t.subtotal,
        barang_nama:
          (t.barang as { barang_nama?: string } | null)?.barang_nama ||
          "Tidak ditemukan",
      }));

      setTransaksi(transaksiData);
    }

    fetchTransaksi();
  }, []);

  return (
    <div className="mt-6 max-w-7xl mx-auto px-4">
      {/* Versi Desktop */}
      <div className="hidden md:block">
        <table className="w-full table-auto border-collapse border rounded-lg shadow-md bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-4 text-left">Barang</th>
              <th className="border p-4 text-left">Jumlah</th>
              <th className="border p-4 text-left">Harga Satuan</th>
              <th className="border p-4 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {transaksi.length > 0 ? (
              transaksi.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="border p-4">{item.barang_nama}</td>
                  <td className="border p-4">{item.jumlah}</td>
                  <td className="border p-4">
                    Rp {item.harga_satuan.toLocaleString()}
                  </td>
                  <td className="border p-4">
                    Rp {item.subtotal.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="border p-4 text-center text-gray-500"
                >
                  Tidak ada transaksi ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Versi Mobile */}
      <div className="md:hidden space-y-4">
        {transaksi.length > 0 ? (
          transaksi.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{item.barang_nama}</h3>
                <span className="text-sm text-gray-500">{item.jumlah} pcs</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Harga Satuan</p>
                  <p className="font-semibold">
                    Rp {item.harga_satuan.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-semibold text-green-600">
                    Rp {item.subtotal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Tidak ada transaksi ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
