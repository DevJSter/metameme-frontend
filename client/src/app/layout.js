import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/modules/navbar";
import AptosWalletProvider from "@/wallet-provider/aptos-wallet-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "What Was That Meme",
  description: "Find memes in seconds",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AptosWalletProvider>
          <>
            <Navbar />
            {children}
          </>
        </AptosWalletProvider>
      </body>
    </html>
  );
}
