import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { FAQSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseUs />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
