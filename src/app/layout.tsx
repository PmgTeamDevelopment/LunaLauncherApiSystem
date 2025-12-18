export const metadata = {
  title: "LunaAccount",
  description: "LunaLauncher Account Server"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
