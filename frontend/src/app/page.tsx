import Navbar from '@/components/layout/Header/Navbar';
import HeroBanner from '@/components/home/HeroBanner';
import FeatureCards from '@/components/home/FeatureCards';
import QuickTools from '@/components/home/QuickTools';
import UserCenterEntry from '@/components/home/UserCenterEntry';
import Footer from '@/components/layout/Footer/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <HeroBanner />
      <FeatureCards />
      <QuickTools />
      <UserCenterEntry />
      <Footer />
    </main>
  );
}
