import type { Metadata } from "next";
import "./globals.css";
import { Arima, Roboto, Shrikhand } from "next/font/google";

const mainFont = Arima({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--arima",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--roboto",
});
const shrinkHand = Shrikhand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--shrinkHand",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.variable} ${shrinkHand.variable} ${roboto.variable} font-roboto antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
