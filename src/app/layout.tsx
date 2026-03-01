import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { TopicNav } from "@/components/topic-nav";
import { TableOfContents } from "@/components/table-of-contents";
import { Github } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { KeyboardProvider } from "@/components/keyboard-provider";
import { CommandPalette } from "@/components/command-palette";
import { JsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://r3f-visualized.vercel.app"),
  title: {
    default: "Learn R3F — Interactive Guide to React Three Fiber",
    template: "%s | Learn R3F",
  },
  description:
    "Interactive learning guide for React Three Fiber and Three.js — story-driven lessons, live 3D demos, hands-on challenges, and debug controls.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Learn R3F",
    title: "Learn R3F — Interactive Guide to React Three Fiber",
    description:
      "Master 3D on the web with 80+ interactive lessons covering Three.js, React Three Fiber, shaders, physics, and production deployment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn R3F — Interactive Guide to React Three Fiber",
    description:
      "Master 3D on the web with 80+ interactive lessons, live demos, and hands-on challenges.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Course",
            name: "Learn React Three Fiber",
            description: "Interactive guide to 3D on the web — from Three.js fundamentals to production R3F with live demos, hands-on challenges, and debug controls.",
            provider: {
              "@type": "Organization",
              name: "R3F Visualized",
              url: "https://r3f-visualized.vercel.app",
            },
            educationalLevel: "Beginner to Advanced",
            programmingLanguage: "JavaScript",
            teaches: "React Three Fiber, Three.js, WebGL, GLSL Shaders, 3D Web Development",
            numberOfLessons: 59,
            isAccessibleForFree: true,
            inLanguage: "en",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Learn R3F",
            url: "https://r3f-visualized.vercel.app",
            description: "Interactive learning guide for React Three Fiber and Three.js",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://r3f-visualized.vercel.app/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </head>
      <GoogleAnalytics />
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="max-h-svh overflow-hidden">
              <KeyboardProvider>
                <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 !h-4" />
                  <BreadcrumbNav />
                  <div className="ml-auto flex items-center gap-1">
                    <CommandPalette />
                    <a
                      href="https://github.com/purush-o7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-7 w-7"
                    >
                      <Github className="size-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                    <ThemeToggle />
                  </div>
                </header>
                <div className="flex flex-1 min-h-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 lg:p-10 min-w-0">
                    <PageTransition>
                      {children}
                    </PageTransition>
                    <TopicNav />
                  </div>
                  <TableOfContents />
                </div>
              </KeyboardProvider>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
