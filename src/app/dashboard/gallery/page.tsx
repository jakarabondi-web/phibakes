import { PageHeader } from "@/components/dashboard/page-header";
import { GalleryView } from "@/components/dashboard/gallery/gallery-view";
import { CAKE_IMAGES } from "@/lib/data/images";

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <div>
      <PageHeader title="Gallery" description="Manage the public-facing cake gallery" />
      <GalleryView images={CAKE_IMAGES} />
    </div>
  );
}
