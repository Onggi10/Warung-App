"use client";

// ✅ Harus ada untuk menggunakan useState
import Link from "next/link";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaExchangeAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol untuk membuka sidebar di mobile */}
      <button
        className="md:hidden fixed top-4 left-4 p-3 bg-gray-800 text-white rounded z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 flex flex-col transition-transform duration-300 z-40 
          ${
            isOpen ? "translate-x-0" : "-translate-x-64"
          } md:relative md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Warung App</h2>
        <ul className="space-y-4">
          <li className="flex items-center hover:bg-gray-700 rounded-lg p-2 transition duration-200">
            <FaTachometerAlt className="mr-4 text-xl" />
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-300"
            >
              Dashboard
            </Link>
          </li>
          <li className="flex items-center hover:bg-gray-700 rounded-lg p-2 transition duration-200">
            <FaBox className="mr-4 text-xl" />
            <Link
              href="/barang"
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-300"
            >
              Data Barang
            </Link>
          </li>
          <li className="flex items-center hover:bg-gray-700 rounded-lg p-2 transition duration-200">
            <FaExchangeAlt className="mr-4 text-xl" />
            <Link
              href="/transaksi"
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-300"
            >
              Transaksi
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay untuk menutup sidebar jika diklik di luar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
