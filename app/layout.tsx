// app/layout.tsx
export const metadata = {
  title: "Mantenimiento — Flujo completo",
  description: "Conductor · Taller · Coordinación · Reparación · Entrega",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial, sans-serif", color: "#0f172a" }}>
        {children}
      </body>
    </html>
  );
}



