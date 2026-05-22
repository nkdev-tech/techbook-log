import Header from "@/components/Header";
import SidebarNav from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cookies, headers } from "next/headers";
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

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <div className="flex flex-col h-svh">
      <Header />
      <SidebarProvider className="flex-1 min-h-0" defaultOpen={defaultOpen}>
        <SidebarNav />
        <SidebarInset className="min-w-0">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
