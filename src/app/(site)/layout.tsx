import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ResumeBanner } from "@/components/site/resume-banner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <ResumeBanner />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
