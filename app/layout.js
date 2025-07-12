import "./globals.css";
import Head from "next/head";

import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = Roboto_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata = {
  title: "Medium‑like Blog",
  description: "Rich content blog with Next.js + App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body
        className={`${inter.variable} ${mono.variable} antialiased prose dark:prose-invert mx-auto p-4`}
      >
        <header className="my-6">
          <h1 className="text-3xl font-bold">My Blog</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
