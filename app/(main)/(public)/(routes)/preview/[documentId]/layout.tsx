import { ReactNode } from 'react';

interface DocumentIdPageLayoutProps {
  children: ReactNode;
}

const DocumentIdPageLayout = async ({
  children,
}: DocumentIdPageLayoutProps) => (
  <main>
    {children}
  </main>
);

export default DocumentIdPageLayout;
