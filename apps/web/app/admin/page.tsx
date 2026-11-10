import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, isAuthorizedAdmin } from "@/lib/admin-auth";
import { readEventState } from "@/lib/event-store";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isAuthorizedAdmin(token))) redirect("/admin/login");

  const state = await readEventState();
  return <AdminDashboard initialData={state.eventData} initialVersion={state.version} />;
}
