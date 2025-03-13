// RootLayout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Konten Utama */}
        <main className="flex-1 p-6 bg-white overflow-auto flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
