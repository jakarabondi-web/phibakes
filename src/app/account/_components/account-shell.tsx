import { AccountTopbar } from "./account-topbar";
import { AccountSidebar } from "./account-sidebar";
import { unreadCount } from "../_lib/notifications";

/** The signed-in customer, resolved by the layout — never a demo identity. */
export type AccountUser = {
  name: string;
  email: string;
  avatarUrl: string | null;
};

export function AccountShell({
  user,
  children,
}: {
  user: AccountUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-secondary/30">
      <AccountTopbar
        customerName={user.name}
        customerEmail={user.email}
        avatar={user.avatarUrl ?? undefined}
        unread={unreadCount()}
      />
      <div className="mx-auto flex w-full max-w-[100rem] flex-1">
        <AccountSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
