import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Medium‑like Blog",
  description: "Rich content blog with Next.js + App Router",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased prose dark:prose-invert mx-auto p-4`}
      >
        <header className="my-6">
          <h1 className="text-3xl font-bold">My Blog</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
