import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsView } from "@/components/dashboard/settings/settings-view";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Business profile, capacity, notifications, and integrations" />
      <SettingsView />
    </div>
  );
}
