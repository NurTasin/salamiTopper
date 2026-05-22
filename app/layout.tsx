import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({ 
  subsets: ["bengali", "latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind"
});

export const metadata: Metadata = {
  title: "SalamiTopper 🎊 | Eid Mubarak!",
  description: "Share the joy of Eid with Salami! Give Salami to your loved ones and top the leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans bg-[#FDFBF7] text-emerald-950`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
