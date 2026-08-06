import { PageHeader } from "@/components/dashboard/page-header";
import { MarketingView } from "@/components/dashboard/marketing/marketing-view";

export const metadata = { title: "Marketing" };

export default function MarketingPage() {
  return (
    <div>
      <PageHeader title="Marketing" description="Coupons, loyalty, referrals, and email campaigns" />
      <MarketingView />
    </div>
  );
}
