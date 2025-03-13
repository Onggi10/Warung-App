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

export default function DataBarang() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [newBarang, setNewBarang] = useState({
    barang_nama: "",
    stok: 0,
    harga: 0,
  });
  const [editBarang, setEditBarang] = useState<Barang | null>(null);
  const [notif, setNotif] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchBarang();
  }, []);

  async function fetchBarang() {
    try {
      const { data: barangData, error } = await supabase
        .from("barang")
        .select("id, barang_nama, stok, harga");

      if (error) throw new Error(error.message);
      if (!barangData || barangData.length === 0) return;

      setBarang(
        barangData.map((b) => ({
          ...b,
          stok_awal: b.stok,
          stok_akhir: b.stok,
        }))
      );
    } catch (error) {
      console.error("❌ Error fetching barang:", error);
    }
  }

  function showNotification(message: string) {
    setNotif(message);
    setTimeout(() => setNotif(null), 3000);
  }

  async function handleAddBarang() {
    const { error } = await supabase.from("barang").insert([newBarang]);
    if (error) {
      console.error("❌ Error adding barang:", error.message);
    } else {
      setNewBarang({ barang_nama: "", stok: 0, harga: 0 });
      fetchBarang();
      showNotification("Barang berhasil ditambahkan!");
    }
  }

  async function handleDeleteBarang(id: string) {
    const { error } = await supabase.from("barang").delete().eq("id", id);
    if (error) {
      console.error("❌ Error deleting barang:", error.message);
    } else {
      fetchBarang();
      showNotification("Barang berhasil dihapus!");
    }
  }

  async function handleEditBarang() {
    if (!editBarang) return;

    const { error } = await supabase
      .from("barang")
      .update({
        barang_nama: editBarang.barang_nama,
        stok: editBarang.stok_akhir,
        harga: editBarang.harga,
      })
      .eq("id", editBarang.id);

    if (error) {
      console.error("❌ Error updating barang:", error.message);
    } else {
      setEditBarang(null);
      fetchBarang();
      showNotification("Barang berhasil diperbarui!");
    }
  }

  // Fungsi pencarian barang berdasarkan nama
  const filteredBarang = barang.filter((item) =>
    item.barang_nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-center mb-6">Data Barang</h1>

      {/* Notifikasi */}
      {notif && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-6 shadow-lg text-center">
          {notif}
        </div>
      )}

      {/* Form Tambah Barang */}
      <div className="mb-8 p-6 border bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tambah Barang
        </h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <input
            type="text"
            placeholder="Nama Barang"
            className="border p-3 mb-4 sm:mb-0 sm:w-1/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newBarang.barang_nama}
            onChange={(e) =>
              setNewBarang({ ...newBarang, barang_nama: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Stok Awal"
            className="border p-3 mb-4 sm:mb-0 sm:w-1/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newBarang.stok === 0 ? "" : newBarang.stok}
            onChange={(e) =>
              setNewBarang({ ...newBarang, stok: Number(e.target.value) || 0 })
            }
          />
          <input
            type="number"
            placeholder="Harga Barang"
            className="border p-3 sm:w-1/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newBarang.harga === 0 ? "" : newBarang.harga}
            onChange={(e) =>
              setNewBarang({ ...newBarang, harga: Number(e.target.value) || 0 })
            }
          />
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-2 mt-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleAddBarang}
        >
          Tambah Barang
        </button>
      </div>

      {/* Pencarian Barang */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari Barang..."
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Tabel Data Barang */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full min-w-[600px] table-auto text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Nama
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Stok Awal
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Stok Akhir
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Harga
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {filteredBarang.length > 0 ? (
              filteredBarang.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {editBarang?.id === item.id ? (
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-full"
                        value={editBarang.barang_nama}
                        onChange={(e) =>
                          setEditBarang({
                            ...editBarang,
                            barang_nama: e.target.value,
                          })
                        }
                      />
                    ) : (
                      item.barang_nama
                    )}
                  </td>
                  <td className="px-6 py-4">{item.stok_awal}</td>
                  <td className="px-6 py-4">
                    {editBarang?.id === item.id ? (
                      <input
                        type="number"
                        className="border p-2 rounded-lg w-full"
                        value={editBarang.stok_akhir}
                        onChange={(e) =>
                          setEditBarang({
                            ...editBarang,
                            stok_akhir: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      item.stok_akhir
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editBarang?.id === item.id ? (
                      <input
                        type="number"
                        className="border p-2 rounded-lg w-full"
                        value={editBarang.harga}
                        onChange={(e) =>
                          setEditBarang({
                            ...editBarang,
                            harga: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      item.harga
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editBarang?.id === item.id ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
                        onClick={handleEditBarang}
                      >
                        Simpan
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
                          onClick={() => setEditBarang(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                          onClick={() => handleDeleteBarang(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Tidak ada barang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
