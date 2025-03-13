"use client";

import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";

type Barang = {
  id: string;
  barang_nama: string;
  harga: number;
};

export default function TransaksiForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [barangId, setBarangId] = useState("");
  const [jumlah, setJumlah] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBarang() {
      const { data, error } = await supabase
        .from("barang")
        .select("id, barang_nama, harga");

      if (error) console.error("❌ Error fetching barang:", error.message);
      else setBarangList(data);
    }
    fetchBarang();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validasi input
    if (!barangId || !jumlah || jumlah <= 0) {
      setMessage("❌ Pilih barang dan jumlah harus lebih dari 0!");
      return;
    }

    const barang = barangList.find((b) => b.id === barangId);
    if (!barang) {
      setMessage("❌ Barang tidak ditemukan!");
      return;
    }

    setLoading(true); // Aktifkan loading state

    // Insert transaksi tanpa user_id
    const { error } = await supabase.from("transaksi").insert([
      {
        barang_id: barangId,
        jumlah: jumlah,
        harga_satuan: barang.harga,
        subtotal: jumlah * barang.harga,
        tipe: "keluar", // 🚀 Tambahkan tipe transaksi (masuk/keluar)
      },
    ]);

    if (error) {
      console.error("❌ Error inserting transaksi:", error.message);
      setMessage(`Gagal menyimpan transaksi! ${error.message}`);
    } else {
      setMessage("✅ Transaksi berhasil!");
      setBarangId("");
      setJumlah("");
      onSuccess();
    }

    setLoading(false); // Matikan loading state
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        Form Transaksi
      </h2>

      {/* Pilihan Barang */}
      <select
        value={barangId}
        onChange={(e) => setBarangId(e.target.value)}
        className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Pilih Barang</option>
        {barangList.map((b) => (
          <option key={b.id} value={b.id}>
            {b.barang_nama} - Rp {b.harga.toLocaleString()}
          </option>
        ))}
      </select>

      {/* Input Jumlah */}
      <input
        type="number"
        placeholder="Jumlah"
        value={jumlah}
        onChange={(e) => {
          const value = Number(e.target.value);
          setJumlah(value > 0 ? value : "");
        }}
        className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        min={1}
      />

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="bg-blue-600 text-white p-3 w-full rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan Transaksi"}
      </button>

      {/* Pesan Error / Sukses */}
      {message && <p className="mt-2 text-red-500 text-center">{message}</p>}
    </form>
  );
}
