
import { useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";
import TiptapEditor from "../TipTapEditor";

export default function SubmitReport() {
    const [workSummary, setWorkSummary] = useState("");
    const [file, setFile] = useState(null);
    const [submissionType, setSubmissionType] = useState("normal"); // normal or table
    const [tableData, setTableData] = useState([{ key: "", value: "" }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
  
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
                    <TiptapEditor
                      value={workSummary}
                      onChange={setWorkSummary}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {workSummary.length} characters
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
                        <div
                          key={index}
                          className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="text"
                            placeholder="Field name (e.g., Hours worked, Tasks completed)"
                            value={row.key}
                            onChange={(e) =>
                              updateTableRow(index, "key", e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., 8 hours, 5 tasks)"
                            value={row.value}
                            onChange={(e) =>
                              updateTableRow(index, "value", e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          {tableData.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTableRow(index)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove row"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Add key-value pairs to structure your report data
                    </p>
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Supporting Files (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 mb-1">
                          <span className="font-medium text-purple-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, PDF, DOC up to 10MB
                        </span>
                      </div>
                    </label>
                    {file && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-purple-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm text-purple-800 font-medium">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">* Required fields</div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {isSubmitting ? "Submitting Report..." : "Submit Report"}
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