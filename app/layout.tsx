// app/layout.tsx
export const metadata = { title: "Mantenimiento" };

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{fontFamily:"system-ui, Arial"}}>{children}</body>
    </html>
  );
}

