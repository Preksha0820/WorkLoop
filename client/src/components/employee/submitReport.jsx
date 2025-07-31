import { useState, useRef } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";
import TinyMCEEditor from "../TinyMCEditior";

export default function SubmitReport() {
    const [workSummary, setWorkSummary] = useState("");
    const [file, setFile] = useState(null);
    const [submissionType, setSubmissionType] = useState("normal"); // normal or table
    const [tableData, setTableData] = useState([{ key: "", value: "" }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [fileError, setFileError] = useState("");
    const fileInputRef = useRef();
    const editorRef = useRef();
  
    const addTableRow = () => {
      setTableData([...tableData, { key: "", value: "" }]);
    };
  
    const removeTableRow = (index) => {
      if (tableData.length > 1) {
        setTableData(tableData.filter((_, i) => i !== index));
      }
    };
  
    const updateTableRow = (index, field, value) => {
      const newTableData = [...tableData];
      newTableData[index][field] = value;
      setTableData(newTableData);
    };
  
    const resetForm = () => {
      setWorkSummary("");
      setFile(null);
      setSubmissionType("normal");
      setTableData([{ key: "", value: "" }]);
      setSubmitSuccess(false);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const formData = new FormData();
  
        let content = workSummary;
        if (submissionType === "table") {
          const tableContent = tableData
            .filter(row => row.key.trim() && row.value.trim())
            .map(row => `${row.key}: ${row.value}`)
            .join('\n');
          content = tableContent;
        }
  
        formData.append("content", content);
        if (file) formData.append("file", file);
  
        const response = await apiService.post("/employee/report", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        toast.success("Report submitted successfully!");
        setSubmitSuccess(true);
        resetForm();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
        
      } catch (err) {
        console.error("Error submitting report", err);
        alert("Failed to submit report. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const isFormValid = () => {
      if (submissionType === "normal") {
        return workSummary.trim().length > 0;
      } else {
        return tableData.some(row => row.key.trim() && row.value.trim());
      }
    };
  
    const handleFileChange = (e) => {
      const selected = e.target.files[0];
      if (selected) {
        if (selected.size > 10 * 1024 * 1024) {
          setFileError("File size must be less than 10MB.");
          setFile(null);
        } else if (!/(png|jpg|jpeg|pdf|doc|docx)$/i.test(selected.name)) {
          setFileError("Invalid file type. Only PNG, JPG, PDF, DOC allowed.");
          setFile(null);
        } else {
          setFile(selected);
          setFileError("");
        }
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped) {
        if (dropped.size > 10 * 1024 * 1024) {
          setFileError("File size must be less than 10MB.");
          setFile(null);
        } else if (!/(png|jpg|jpeg|pdf|doc|docx)$/i.test(dropped.name)) {
          setFileError("Invalid file type. Only PNG, JPG, PDF, DOC allowed.");
          setFile(null);
        } else {
          setFile(dropped);
          setFileError("");
        }
      }
    };

    // Add Table handler
    const handleAddTable = () => {
      if (editorRef.current) {
        editorRef.current.editor.execCommand('mceInsertTable', false, {rows: 2, columns: 2});
      }
    };
  
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Submit Work Report
            </h2>
            <p className="text-gray-600">
              Submit your work progress and achievements
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-800 font-medium">
                  Report submitted successfully!
                </span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                {/* Submission Type Toggle */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Report Format
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="submissionType"
                        value="normal"
                        checked={submissionType === "normal"}
                        onChange={(e) => setSubmissionType(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Free Text Report
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="submissionType"
                        value="table"
                        checked={submissionType === "table"}
                        onChange={(e) => setSubmissionType(e.target.value)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Structured Data Report
                      </span>
                    </label>
                  </div>
                </div>

                {/* Content Input */}
                {submissionType === "normal" ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Summary *
                    </label>
                    <TinyMCEEditor
                      value={workSummary}
                      onChange={setWorkSummary}
                      placeholder="Write your work summary..."
                      editorRef={editorRef}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {workSummary.replace(/<[^>]+>/g, '').length} characters
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Structured Report Data *
                      </label>
                      <button
                        type="button"
                        onClick={addTableRow}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Row
                      </button>
                    </div>
                    <div className="space-y-3">
                      {tableData.map((row, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Key"
                            value={row.key}
                            onChange={e => updateTableRow(index, 'key', e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={row.value}
                            onChange={e => updateTableRow(index, 'value', e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeTableRow(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                            disabled={tableData.length === 1}
                            title="Remove Row"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Supporting Files (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition ${fileError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                    onClick={() => fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                  >
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-medium text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 text-xs mt-1"
                          onClick={e => { e.stopPropagation(); setFile(null); }}
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-purple-600 font-medium">Click to upload</span>
                        <span className="text-xs text-gray-500">or drag and drop<br/>PNG, JPG, PDF, DOC up to 10MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                    />
                  </div>
                  {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg font-semibold text-white transition ${isFormValid() && !isSubmitting ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Tips for better reports
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific about what you accomplished</li>
                  <li>
                    • Include any challenges you faced and how you resolved them
                  </li>
                  <li>• Mention any help or resources you needed</li>
                  <li>• Attach relevant files or screenshots if applicable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }