import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased font-poppins text-gray-800 text-base`}
      >
        {/* <Header /> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
