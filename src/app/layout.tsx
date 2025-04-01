import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./ReactQueryProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CodMan",
    default: "CodMan",
  },
  description: "The Social Media App for Coders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>
          {`
            :root {
              --background: 210 40% 98%;
              --foreground: 222 47% 11%;
              
              --card: 0 0% 100%;
              --card-foreground: 222 47% 11%;
              
              --primary: 217 91% 60%;
              --primary-foreground: 210 40% 98%;
              --primary-light: 213 94% 68%;
              --primary-dark: 215 82% 53%;
              
              --secondary: 210 40% 96%;
              --secondary-foreground: 222 47% 11%;
              
              --muted: 210 40% 96%;
              --muted-foreground: 215 16% 47%;
              
              --border: 214 32% 91%;
              --input: 214 32% 91%;
              --ring: 217 91% 60%;
            }

            .dark {
              --background: 222 47% 11%;
              --foreground: 210 40% 98%;
              
              --card: 217 33% 17%;
              --card-foreground: 210 40% 98%;
              
              --primary: 213 94% 68%;
              --primary-foreground: 222 47% 11%;
              --primary-light: 217 91% 60%;
              --primary-dark: 217 92% 76%;
              
              --secondary: 215 28% 17%;
              --secondary-foreground: 210 40% 98%;
              
              --muted: 215 28% 17%;
              --muted-foreground: 215 20% 65%;
              
              --border: 215 28% 17%;
              --input: 215 28% 17%;
              --ring: 213 94% 68%;
            }

            * {
              transition: background-color 0.3s ease, border-color 0.3s ease;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: hsl(var(--background));
            }

            ::-webkit-scrollbar-thumb {
              background: hsl(var(--primary) / 30%);
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--primary) / 50%);
            }
          `}
        </style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark"]}
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}