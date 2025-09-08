// app/layout.tsx
export const metadata = {
  title: "Mantenimiento — Producción (Demo)",
  description: "Demo de flujo Conductor / Taller / Coordinación",
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}



