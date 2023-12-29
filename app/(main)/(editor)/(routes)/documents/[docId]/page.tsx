import { Id } from '@/convex/_generated/dataModel';
import DocumentIdPageContent from '@/components/ui/document/DocumentIdPageContent';
import { Metadata } from 'next';
import { generateDocumentPageMetadata } from '@/lib/utils';

export const revalidate = 86400;

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

interface DocumentIdPageProps {
  params: {
    docId: Id<'documents'>
  };
}

const DocumentIdPage = ({
  params,
}: DocumentIdPageProps) => (
  <DocumentIdPageContent params={params} />
);

export default DocumentIdPage;
