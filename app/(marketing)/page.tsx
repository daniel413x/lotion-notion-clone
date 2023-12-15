import { Metadata } from 'next';
import siteConfig from '@/lib/config';
import MarketingPageContent from './_components/MarketingPageContent';

export const metadata: Metadata = {
  title: `Get ${siteConfig.title}`,
};

const MarketingPage = () => (
  <MarketingPageContent />
);

export default MarketingPage;
