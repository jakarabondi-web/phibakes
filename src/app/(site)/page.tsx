import { HeroSection } from "@/components/homepage/hero-section";
import { FeatureStrip } from "@/components/homepage/feature-strip";
import { CategoryGrid } from "@/components/homepage/category-grid";
import { HowItWorks } from "@/components/homepage/how-it-works";
import { FeaturedCakes } from "@/components/homepage/featured-cakes";
import { CustomCakeBanner } from "@/components/homepage/custom-cake-banner";
import { ReadyToday } from "@/components/homepage/ready-today";
import { Testimonials } from "@/components/homepage/testimonials";
import { DeliveryAreas } from "@/components/homepage/delivery-areas";
import { InstagramGallery } from "@/components/homepage/instagram-gallery";
import { Newsletter } from "@/components/homepage/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />

      <section className="py-20">
        <div className="container-luxe">
          <CategoryGrid />
        </div>
      </section>

      <section className="container-luxe">
        <HowItWorks />
      </section>

      <section className="py-20">
        <div className="container-luxe">
          <FeaturedCakes />
        </div>
      </section>

      <section className="py-20">
        <div className="container-luxe">
          <CustomCakeBanner />
        </div>
      </section>

      <section className="py-20">
        <div className="container-luxe">
          <ReadyToday />
        </div>
      </section>

      <section className="py-20">
        <div className="container-luxe">
          <Testimonials />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-luxe">
          <DeliveryAreas />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-luxe">
          <InstagramGallery />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-luxe">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
