import { AccountTopbar } from "./account-topbar";
import { AccountSidebar } from "./account-sidebar";
import { CURRENT_CUSTOMER } from "../_lib/customer";
import { unreadCount } from "../_lib/notifications";

export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-secondary/30">
      <AccountTopbar
        customerName={CURRENT_CUSTOMER.name}
        customerEmail={CURRENT_CUSTOMER.email}
        avatar={CURRENT_CUSTOMER.avatar}
        unread={unreadCount()}
      />
      <div className="mx-auto flex w-full max-w-[100rem] flex-1">
        <AccountSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
