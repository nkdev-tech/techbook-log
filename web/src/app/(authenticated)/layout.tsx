import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import SidebarNav from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
    <div className="flex flex-col h-svh">
      <Header />
      <SidebarProvider
        className="flex-1 min-h-0"
        style={{ "--header-height": "3.5rem" } as React.CSSProperties}
      >
        <SidebarNav />
        <SidebarInset className="min-w-0">
          <main className="w-full px-8 py-4">
            <Navigation />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
