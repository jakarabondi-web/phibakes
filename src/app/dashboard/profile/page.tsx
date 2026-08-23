import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForms } from "@/components/dashboard/profile/profile-forms";
import { requireStaff } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { OWNER_ACCOUNT_ID } from "@/lib/auth/owner-account";
import { parseKenyanPhone } from "@/lib/kenya-phone";

export const metadata = { title: "My Profile" };

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  BAKER: "Baker",
  DECORATOR: "Decorator",
  DELIVERY_RIDER: "Rider",
  SUPPORT: "Customer Support",
  CUSTOMER: "Customer",
};

export default async function DashboardProfilePage() {
  const user = await requireStaff("/dashboard/profile");

  const isEnvOwner = user.id === OWNER_ACCOUNT_ID;
  const databaseReady = isDatabaseConfigured();
  const editable = !isEnvOwner && databaseReady;

  // Phone lives on the user row and isn't part of the session payload.
  let phone = "";
  if (!isEnvOwner && databaseReady) {
    try {
      const row = await prisma.user.findUnique({
        where: { id: user.id },
        select: { phone: true },
      });
      // Stored in E.164 for APIs; shown in the local format people recognise.
      phone = row?.phone ? (parseKenyanPhone(row.phone)?.formatted ?? row.phone) : "";
    } catch {
      // Non-fatal: the rest of the profile still renders.
    }
  }

  const reason = isEnvOwner
    ? "You're signed in with the environment-configured owner account, which has no database record. Its name, email, and password come from OWNER_NAME, OWNER_EMAIL, and OWNER_PASSWORD_HASH — change them there, or connect a database and create an owner account for an editable profile."
    : !databaseReady
      ? "No database is connected, so profile changes can't be saved yet."
      : undefined;

  return (
    <div>
      <PageHeader title="My Profile" description="Your own account details and password" />
      <ProfileForms
        me={{
          name: user.name,
          email: user.email,
          phone,
          role: ROLE_LABEL[user.role] ?? user.role,
          avatarUrl: user.avatarUrl,
        }}
        editable={editable}
        reason={reason}
      />
    </div>
  );
}
