import { Id } from '@/convex/_generated/dataModel';
import DocumentIdPageContent from '@/components/ui/document/DocumentIdPageContent';

interface DocumentIdPageProps {
  params: {
    docId: Id<'documents'>
  };
}

const DocumentIdPage = ({
  params,
}: DocumentIdPageProps) => (
  <DocumentIdPageContent
    preview
    params={params}
  />
);

export default DocumentIdPage;
