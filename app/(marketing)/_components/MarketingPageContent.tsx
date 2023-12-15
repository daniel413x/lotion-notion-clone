import Footer from './Footer';
import Heading from './Heading';
import Heroes from './Heroes';

const MarketingPageContent = () => (
  <div className="min-h-full flex flex-col">
    <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
      <Heading />
      <Heroes />
    </div>
    <Footer />
  </div>
);

export default MarketingPageContent;
