export type AuditAction = "Create" | "Update" | "Delete" | "Status Change" | "Login";

export type AuditLogEntry = {
  id: string;
  actor: string;
  action: AuditAction;
  entity: string;
  detail: string;
  date: string;
};

export const AUDIT_LOG: AuditLogEntry[] = [
  { id: "al1", actor: "Owner", action: "Status Change", entity: "Order PB-10231", detail: 'Updated status to "Decorating"', date: "2026-08-06T07:40:00" },
  { id: "al2", actor: "Chef Otieno", action: "Status Change", entity: "Order PB-10234", detail: 'Updated status to "Baking"', date: "2026-08-06T06:05:00" },
  { id: "al3", actor: "Owner", action: "Update", entity: "Inventory · Fresh Cream", detail: "Marked stock level as critical (4L remaining)", date: "2026-08-05T18:22:00" },
  { id: "al4", actor: "Grace Achieng", action: "Create", entity: "Order PB-10238", detail: "Created new order from customer request", date: "2026-08-06T05:58:00" },
  { id: "al5", actor: "Owner", action: "Update", entity: "Quote PBQ-5502", detail: "Set quoted price to KES 16,500", date: "2026-08-01T12:10:00" },
  { id: "al6", actor: "Owner", action: "Login", entity: "Owner Console", detail: "Signed in from Nairobi, Kenya (Chrome / macOS)", date: "2026-08-06T06:00:00" },
  { id: "al7", actor: "Chef Lydia", action: "Status Change", entity: "Order PB-10233", detail: 'Updated status to "Out for Delivery"', date: "2026-08-06T08:15:00" },
  { id: "al8", actor: "Owner", action: "Update", entity: "Settings · Daily Capacity", detail: "Changed production capacity from 10 to 12 points/day", date: "2026-07-30T09:00:00" },
  { id: "al9", actor: "Owner", action: "Delete", entity: "Gallery Image", detail: "Removed outdated product photo from public gallery", date: "2026-07-29T16:40:00" },
  { id: "al10", actor: "Rider — James", action: "Status Change", entity: "Order PB-10236", detail: 'Marked delivery as "Delivered"', date: "2026-07-28T10:05:00" },
  { id: "al11", actor: "Owner", action: "Create", entity: "Coupon · SWEET10", detail: "Created new 10% promo code", date: "2026-07-25T11:20:00" },
  { id: "al12", actor: "Owner", action: "Update", entity: "Staff · Rider — Mercy", detail: "Marked staff member as inactive", date: "2026-07-24T14:30:00" },
  { id: "al13", actor: "Faith Nyambura", action: "Status Change", entity: "Production Task · pt7", detail: 'Marked task as "done"', date: "2026-07-15T09:05:00" },
  { id: "al14", actor: "Owner", action: "Update", entity: "M-PESA Settings", detail: "Rotated Daraja API consumer secret", date: "2026-07-10T08:00:00" },
  { id: "al15", actor: "Owner", action: "Create", entity: "Supplier · PakSmart Kenya", detail: "Added new packaging supplier", date: "2026-07-05T13:15:00" },
];
