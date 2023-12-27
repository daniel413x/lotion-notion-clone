import { Id } from '@/convex/_generated/dataModel';
import DocumentIdPageContent from '@/components/ui/document/DocumentIdPageContent';
import { Metadata } from 'next';
import { generateDocumentPageMetadata } from '@/lib/utils';

export const revalidate = 300;

type MetadataProps = {
  params: {
    documentId: Id<'documents'>;
  },
};

export async function generateMetadata(
  { params }: MetadataProps,
): Promise<Metadata> {
  const metadata = await generateDocumentPageMetadata(params.documentId);
  return metadata;
}

interface DocumentIdPageProps {
  params: {
    documentId: Id<'documents'>
  };
}

const DocumentIdPage = ({
  params,
}: DocumentIdPageProps) => (
  <DocumentIdPageContent params={params} />
);

export default DocumentIdPage;
