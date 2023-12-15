import { ReactNode } from 'react';
import Navbar from './_components/Navbar';

interface MarketingLayoutProps {
  children: ReactNode;
}

const MarketingLayout = ({
  children,
}: MarketingLayoutProps) => (
  <div>
    <Navbar />
    {children}
  </div>
);

export default MarketingLayout;
