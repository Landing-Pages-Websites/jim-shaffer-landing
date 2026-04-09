import type { Metadata } from "next";
import { Josefin_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title:
    "Jim Shaffer & Associates | #1 Real Estate Team in Metro Detroit",
  description:
    "Work with Metro Detroit's top-rated real estate team. 850+ transactions per year, $2B+ in career sales, 2,700+ five-star Google reviews. Buy or sell your home with confidence.",
  openGraph: {
    title:
      "Jim Shaffer & Associates | #1 Real Estate Team in Metro Detroit",
    description:
      "Metro Detroit's top-rated real estate team. 850+ annual transactions, 2,700+ five-star reviews, serving Oakland, Macomb & Wayne Counties since 1999.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SITE_ID = "PLACEHOLDER_SITE_ID";
  const SITE_KEY = "PLACEHOLDER_SITE_KEY";

  return (
    <html
      lang="en"
      className={`${josefin.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        {/* MegaTag config */}
        <meta name="mega-site-id" content={SITE_ID} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"${SITE_KEY}",siteId:"${SITE_ID}"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script
          id="optimizer-script"
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          data-site-id={SITE_ID}
          async
        />
        {/* CTM tracking script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(a,b,c,d,e,f,g){a.CallTrkId=e;a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)};a[e].l=1*new Date();f=b.createElement(c);g=b.getElementsByTagName(c)[0];f.async=1;f.src=d;g.parentNode.insertBefore(f,g)})(window,document,"script","//cdn.calltrk.com/companies/PLACEHOLDER_CTM/PLACEHOLDER_CTM.js","__ctm");`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
