import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPdfs, getSignedPdfUrl } from "../../api/pdfApi";

const PdfAndFiles = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrls, setFileUrls] = useState({}); 

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getPdfs();
        // Filter to include only 'pdf' type
        const filteredData = data.filter(doc => doc.type === 'pdf');
        setPdfs(filteredData);
      } catch (err) {
        console.error(err);
        setError("Unable to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Function to get fresh pre-signed URL when needed
  const fetchSignedUrl = async (fileKey) => {
    try {
      const signedUrl = await getSignedPdfUrl(fileKey);
      setFileUrls(prev => ({ ...prev, [fileKey]: signedUrl }));
    } catch (err) {
      // Handle error
    }
  };
  useEffect(() => {
    pdfs.forEach(pdf => {
      if (!fileUrls[pdf.fileKey]) {
        fetchSignedUrl(pdf.fileKey);
      }
    });
  }, [pdfs]);





console.log('fileKey');
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Document Library</h1>
      </div>

      {pdfs.length === 0 ? (
        <p className="text-gray-600 text-center">No documents available.</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {pdfs.map((doc) => {
            const signedUrl = fileUrls[doc.fileKey] || null;

            return (
              <motion.div
                key={doc._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                {/* Title */}
                <h3
                  className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1"
                  title={doc.title}
                >
                  {doc.title || "Untitled Document"}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {doc.description || "No description provided."}
                </p>

                {/* Load Signed URL on Button Click */}
                {signedUrl ? (
                  <iframe
                    title={doc.title || "Document Preview"}
                    src={signedUrl}
                    className="w-full h-40 border-none bg-gray-50"
                    loading="lazy"
                  />
                ) : (
                  <button
                    onClick={() => fetchSignedUrl(doc.fileKey)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-700 transition"
                  >
                    Load Document
                  </button>
                )}

                {/* Download/Open link */}
                {signedUrl && (
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors mt-2"
                  >
                    View PDF
                  </a>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default PdfAndFiles;
