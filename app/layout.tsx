import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ToastProvider from "@/components/providers/toastProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import Provider from "../components/Provider";

export const metadata: Metadata = {
  title: "ناجح | Nage7",
  description: "",
};

const rabar = localFont({
  src: "../public/fonts/Cairo-VariableFont_slnt,wght.ttf",
  variable: "--font-rabar",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <ClerkProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <body className={rabar.className}>
          <ConfettiProvider />
          <ToastProvider />
          <Provider>{children}</Provider>
        </body>
      </ClerkProvider>
    </html>
  );
}
