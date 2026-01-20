import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.11_0.015_285)] relative overflow-hidden">
      {/* Background gradient effects - matching landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[900px] h-[900px] bg-[oklch(0.68_0.19_18)]/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/3 -left-1/4 w-[700px] h-[700px] bg-[oklch(0.75_0.15_55)]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[oklch(0.72_0.16_160)]/8 rounded-full blur-[80px]" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      {/* Logo in top left */}
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <Image
          src="/logo.svg"
          alt="Collecty Logo"
          width={36}
          height={36}
          className="rounded-xl"
        />
        <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-outfit)] text-white">
          Collecty
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
