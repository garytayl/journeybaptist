import type { Metadata } from "next"
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google"
import "./globals.css"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jb-serif",
  display: "swap",
})

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jb-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Journey Baptist · Scripture preparation",
    template: "%s · Journey Baptist",
  },
  description:
    "Weekly Head, Heart, and Hands Scripture preparation for Journey Baptist—Tuesday Bible study and Sunday worship.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f6f3ee] font-sans text-stone-900">
        {children}
      </body>
    </html>
  )
}
