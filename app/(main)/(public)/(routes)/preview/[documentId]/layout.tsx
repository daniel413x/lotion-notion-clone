import { ReactNode } from 'react';

interface DocumentIdPageLayoutProps {
  children: ReactNode;
}

const DocumentIdPageLayout = ({
  children,
}: DocumentIdPageLayoutProps) => (
  <main>
    {children}
  </main>
);

export default DocumentIdPageLayout;
