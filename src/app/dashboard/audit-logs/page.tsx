import { PageHeader } from "@/components/dashboard/page-header";
import { AuditLogTable } from "@/components/dashboard/audit-logs/audit-log-table";
import { AUDIT_LOG } from "@/lib/data/audit-log";

export const metadata = { title: "Audit Logs" };

export default function AuditLogsPage() {
  return (
    <div>
      <PageHeader title="Audit Logs" description="Who did what, and when" />
      <AuditLogTable entries={AUDIT_LOG} />
    </div>
  );
}
