import PDFViewer from "../components/PdfViewer";
import { useParams } from "react-router-dom";

const LegalPage = () => {
  const { fileName } = useParams();

  return (
    <div className="min-h-screen">
      <PDFViewer url={`/${fileName}`} />
    </div>
  );
};

export default LegalPage;
