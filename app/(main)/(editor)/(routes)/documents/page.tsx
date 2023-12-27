import { Metadata } from 'next';
import DocumentsPageContent from './_components/DocumentsPageContent';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DocumentsPage = () => (
  <DocumentsPageContent />
);

export default DocumentsPage;
