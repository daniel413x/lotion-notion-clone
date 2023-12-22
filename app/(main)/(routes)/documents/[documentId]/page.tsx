import { Id } from '@/convex/_generated/dataModel';
import DocumentIdPageContent from './_components/DocumentIdPageContent';

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
