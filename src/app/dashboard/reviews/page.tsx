import { PageHeader } from "@/components/dashboard/page-header";
import { ReviewsView } from "@/components/dashboard/reviews/reviews-view";
import { CAKES } from "@/lib/data/cakes";

export const metadata = { title: "Reviews" };

export default function ReviewsPage() {
  const reviews = CAKES.flatMap((c) => c.reviews.map((r) => ({ ...r, cakeName: c.name }))).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <PageHeader title="Reviews" description={`${reviews.length} customer reviews across all cakes`} />
      <ReviewsView reviews={reviews} />
    </div>
  );
}
