import { ReactNode } from 'react';
import Navbar from './_components/Navbar';

interface MarketingLayoutProps {
  children: ReactNode;
}

const MarketingLayout = ({
  children,
}: MarketingLayoutProps) => (
  <div className="h-full dark:bg-[#1f1f1f]">
    <Navbar />
    <main className="pt-40">
      {children}
    </main>
  </div>
);

export default MarketingLayout;
