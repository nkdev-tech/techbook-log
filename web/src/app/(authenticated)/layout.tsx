import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const session = await authClient.getSession({
      fetchOptions: { headers: await headers() },
    });
    if (!session.data) {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="w-full max-w-5xl container mx-auto px-5">
        <Navigation />
        {children}
      </main>
    </>
  );
}
