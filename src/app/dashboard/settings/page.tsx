import { PageHeader } from "@/components/dashboard/page-header";
import { AdminNotice } from "@/components/dashboard/admin-notice";
import { BusinessSettingsForm } from "@/components/dashboard/settings/business-settings-form";
import { DeliveryRatesPanel } from "@/components/dashboard/settings/delivery-rates-panel";
import { SettingsView } from "@/components/dashboard/settings/settings-view";
import { getCurrentUser } from "@/lib/auth/dal";
import { getPlatformSettings, getZoneRates } from "@/lib/platform-settings";
import { databaseSetupHint, isDatabaseConfigured } from "@/lib/db-status";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  // The layout already guarantees a staff user; this only distinguishes owner
  // from other staff. The server actions re-check regardless — this just stops
  // non-owners being shown editable fields they can't submit.
  const user = await getCurrentUser();
  const isOwner = user?.role === "OWNER";
  const databaseReady = isDatabaseConfigured();

  const [settings, zones] = await Promise.all([getPlatformSettings(), getZoneRates()]);
  const canEdit = isOwner && databaseReady;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Business profile, pricing, delivery rates, and integrations"
      />
      <AdminNotice
        isOwner={isOwner}
        databaseReady={databaseReady}
        databaseHint={databaseSetupHint()}
      />
      <div className="flex flex-col gap-5">
        <BusinessSettingsForm settings={settings} canEdit={canEdit} />
        <DeliveryRatesPanel zones={zones} canEdit={canEdit} />
        {/* Appearance, notifications, and the permission matrix stay as-is for now. */}
        <SettingsView />
      </div>
    </div>
  );
}
