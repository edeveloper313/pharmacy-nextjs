import type { Metadata } from 'next';
import "@/app/global.css";
import ThemeProviderWrapper from './ThemeProviderWrapper'; // Path check kar lein agar error aaye

export const metadata: Metadata = {
  title: 'RxPilot', // Yahan apni company ka naam likh dein
  icons: {
    icon: '/icon.png', 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Yahan humne apna naya wrapper use kiya hai */}
        <ThemeProviderWrapper >
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}