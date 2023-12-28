import { Id } from '@/convex/_generated/dataModel';
import { generateDocumentPageMetadata } from '@/lib/utils';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const revalidate = 300;

type MetadataProps = {
  params: {
    docId: Id<'documents'>;
  },
};

export async function generateMetadata(
  { params }: MetadataProps,
): Promise<Metadata> {
  const metadata = await generateDocumentPageMetadata(params.docId);
  return metadata;
}

interface DocumentIdPageLayoutProps {
  children: ReactNode;
}

const DocumentIdPageLayout = async ({
  children,
}: DocumentIdPageLayoutProps) => (
  <main tabIndex={-1}>
    {children}
  </main>
);

export default DocumentIdPageLayout;
