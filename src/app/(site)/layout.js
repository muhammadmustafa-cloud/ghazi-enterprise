import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-snow">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
