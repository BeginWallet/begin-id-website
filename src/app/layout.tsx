import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "BeginID | Begin Wallet",
//   description: "Universal wallet domain by Begin Wallet",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
    // <html lang="en">
    //   <body className={inter.className}>{children}</body>
    // </html>
  );
}
