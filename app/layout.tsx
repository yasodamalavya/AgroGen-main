// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroGen - AI for Agriculture",
  description: "AI-powered solutions for modern agriculture",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: "#16a34a",
          colorText: "#1a2e05",
          colorBackground: "#f0fdf4",
          colorInputBackground: "#ffffff",
          colorInputText: "#1a2e05",
        },
        elements: {
          card: "border-2 border-green-500",
          headerTitle: "text-2xl font-semibold text-green-700",
          headerSubtitle: "text-green-600",
          socialButtonsBlockButton: "bg-green-600 hover:bg-green-700 text-white",
          formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
          formFieldLabel: "text-green-800",
          footer: "text-green-600",
          footerActionLink: "text-green-700 hover:text-green-800",
          profileSectionTitle: "text-green-700",
          formFieldInput: "border-green-300 focus:border-green-500 focus:ring-green-500",
          badge: "bg-green-100 text-green-800",
          alert: "bg-green-50 border-green-200 text-green-800",
          button: "mr-2",
          avatar: "border-2 border-green-400",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${schibstedGrotesk.variable} antialiased`}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}