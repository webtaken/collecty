// Legal pages (terms, privacy) use the root layout directly
// This layout is a simple passthrough

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
