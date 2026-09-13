import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Fluffy HÜGS",
  description: "A playful three-scene animated slides.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
