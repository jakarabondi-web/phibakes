import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { parseKenyanPhone } from "@/lib/kenya-phone";
import { ProfileView } from "./profile-view";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  // The layout already guaranteed a signed-in, non-staff user.
  const user = await getCurrentUser();

  // Phone lives on the user row and isn't part of the session payload.
  let phone = "";
  if (user && isDatabaseConfigured()) {
    try {
      const row = await prisma.user.findUnique({
        where: { id: user.id },
        select: { phone: true },
      });
      phone = row?.phone ? (parseKenyanPhone(row.phone)?.formatted ?? row.phone) : "";
    } catch {
      // Non-fatal: the rest of the profile still renders.
    }
  }

  return (
    <ProfileView
      initial={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone,
        avatarUrl: user?.avatarUrl ?? null,
      }}
    />
  );
}
