import { PageHeader } from "@/components/dashboard/page-header";
import { AdminNotice } from "@/components/dashboard/admin-notice";
import { StaffManager } from "@/components/dashboard/staff/staff-manager";
import { getCurrentUser } from "@/lib/auth/dal";
import { getStaffDirectory } from "@/lib/staff-directory";
import { databaseSetupHint, isDatabaseConfigured } from "@/lib/db-status";

export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const user = await getCurrentUser();
  const isOwner = user?.role === "OWNER";
  const databaseReady = isDatabaseConfigured();
  const staff = await getStaffDirectory();

  return (
    <div>
      <PageHeader
        title="Staff Directory"
        description="Bakers, decorators, riders, and support — roles, contact details, and dispatch info"
      />
      <AdminNotice
        isOwner={isOwner}
        databaseReady={databaseReady}
        databaseHint={databaseSetupHint()}
      />
      <StaffManager staff={staff} canEdit={isOwner && databaseReady} />
    </div>
  );
}
