"use client";

import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Barang {
  id: string;
  barang_nama: string;
  stok_awal: number;
  stok_akhir: number;
  harga: number;
}

export default function Dashboard() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchBarangWithStok();
  }, []);

  async function fetchBarangWithStok() {
    try {
      // Ambil data barang
      const { data: barangData, error: barangError } = await supabase
        .from("barang")
        .select("id, barang_nama, stok, harga");

      if (barangError) throw new Error(barangError.message);
      if (!barangData || barangData.length === 0) return;

      // Ambil data transaksi untuk menghitung stok_akhir
      const { data: transaksiData, error: transaksiError } = await supabase
        .from("transaksi")
        .select("barang_id, jumlah, tipe");

      if (transaksiError) throw new Error(transaksiError.message);

      // Hitung stok_akhir berdasarkan transaksi
      const stokMap: { [key: string]: number } = {};

      transaksiData?.forEach((transaksi) => {
        if (!stokMap[transaksi.barang_id]) stokMap[transaksi.barang_id] = 0;

        if (transaksi.tipe === "masuk") {
          stokMap[transaksi.barang_id] += transaksi.jumlah;
        } else if (transaksi.tipe === "keluar") {
          stokMap[transaksi.barang_id] -= transaksi.jumlah;
        }
      });

      // Gabungkan data barang dengan stok yang diperhitungkan
      const barangWithStok = barangData.map((b) => ({
        ...b,
        stok_awal: b.stok,
        stok_akhir: b.stok + (stokMap[b.id] || 0), // Update stok_akhir
      }));

      setBarang(barangWithStok);
    } catch (error) {
      console.error(
        "❌ Error fetching data:",
        error instanceof Error ? error.message : error
      );
    }
  }

  // Filter barang berdasarkan query pencarian
  const filteredBarang = barang.filter((item) =>
    item.barang_nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl text-center font-bold mb-6">Dashboard Stok</h1>

      {/* Form Pencarian */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari Barang..."
          className="w-full p-2 border rounded-md shadow-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Daftar Barang dalam Bentuk Kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarang.length > 0 ? (
          filteredBarang.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 border rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">{item.barang_nama}</h3>
              <p className="text-gray-600">Stok Awal: {item.stok_awal}</p>
              <p className="text-gray-600">
                Stok Akhir:{" "}
                <span
                  className={`font-bold ${
                    item.stok_akhir <= 5 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {item.stok_akhir}
                </span>
              </p>
              <p className="text-lg font-semibold text-blue-500 mt-2">
                Rp {item.harga.toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            Tidak ada barang yang sesuai dengan pencarian
          </p>
        )}
      </div>
    </div>
  );
}
