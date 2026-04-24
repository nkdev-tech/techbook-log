import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="w-full max-w-5xl container mx-auto px-5">
        <Navigation />
        {children}
      </main>
      <Toaster />
    </>
  );
}
