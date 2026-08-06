import { PageHeader } from "@/components/dashboard/page-header";
import { StaffView } from "@/components/dashboard/staff/staff-view";
import { STAFF } from "@/lib/data/staff";

export const metadata = { title: "Staff" };

export default function StaffPage() {
  return (
    <div>
      <PageHeader title="Staff Directory" description={`${STAFF.length} team members`} />
      <StaffView staff={STAFF} />
    </div>
  );
}
