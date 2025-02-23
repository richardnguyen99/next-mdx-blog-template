import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

import Header from "@/components/header";
import Footer from "@/components/footer";
import sharedMetadata from "@/app/shared-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = sharedMetadata;

const script = /*js*/ `
void function () {
  /**
   * Callback fired when window.__theme was set or updated
   */
  window.__onThemeChange = function () {};

  /**
   * Sets the theme on the <body> element
   * @param {string} newTheme - The new theme to set
   */
  let preferredTheme;
  try {
    preferredTheme = localStorage.getItem("theme");
  } catch (err) { }

  function setTheme(newTheme) {
    const oldTheme = window.__theme;
    const darkOrLight = 
      newTheme === "system" 
        ? (
            window.matchMedia("(prefers-color-scheme: dark)").matches 
            ? "dark" 
            : "light"
          ) 
        : newTheme;

    if (preferredTheme && document.documentElement.classList.contains(preferredTheme) && preferredTheme !== darkOrLight) {
      document.documentElement.classList.replace(preferredTheme, darkOrLight);
    } else {
      document.documentElement.classList.add(darkOrLight);
    }

    window.__theme = newTheme;
    preferredTheme = darkOrLight;
    window.__onThemeChange(darkOrLight);
  }

  window.__setPreferredTheme = function (newTheme) {
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (err) {}
  }

  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkQuery.addListener(function (e) {
    window.__setPreferredTheme(e.matches ? "dark" : "light");
  });

  setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"))
}();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId="G-WPL99G45VC" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
          integrity="sha512-fHwaWebuwA7NSF5Qg/af4UeDx9XqUpYpOGgubo3yWu+b2IQR4UeQwbb42Ti7gVAjNtVoI/I9TEoYeu9omwcC6g=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: script,
          }}
        ></script>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
