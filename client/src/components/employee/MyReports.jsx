import { useEffect, useState } from "react";
import { Eye, Edit3, Trash2, X, FileText, Download, Clock, CheckCircle, XCircle } from "lucide-react";
import apiService from "../../api/apiService";

// Date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
               type === 'error' ? <XCircle className="w-5 h-5" /> : 
               <FileText className="w-5 h-5" />;

  return (
    <div className={`fixed top-4 right-4 z-[60] ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 flex items-center gap-3 max-w-md`}>
      {icon}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};


export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const fetchReports = async () => {
    try {
      const response = await apiService.get("/employee/reports");
      setReports(response.data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      showToast("Failed to fetch reports", "error");
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setEditContent(report.content);
    setShowEditModal(true);
  };

  const handleDeleteReport = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const submitEdit = async () => {
    if (!editContent.trim()) {
      showToast("Content cannot be empty", "error");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.put(`/employee/report/${selectedReport.id}`, {
        content: editContent
      });
      
      showToast("Report updated successfully", "success");
      setShowEditModal(false);
      setEditContent("");
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error updating report:", err);
      showToast(err.response?.data?.message || "Failed to update report", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await apiService.delete(`/employee/report/${selectedReport.id}`);
      
      showToast("Report deleted successfully", "success");
      setShowDeleteModal(false);
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      showToast(err.response?.data?.message || "Failed to delete report", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const closeAllModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedReport(null);
    setEditContent("");
  };

  const getStatusBadge = (status) => {
    const configs = {
      APPROVED: {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Approved"
      },
      REJECTED: {
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected"
      },
      PENDING: {
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending"
      }
    };

    const config = configs[status] || configs.PENDING;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.task?.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {toast && <Toast {...toast} onClose={hideToast} />}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h2>
          <p className="text-gray-600">View and manage your submitted reports</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search reports by content or task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="min-w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 text-lg mb-2">
                {reports.length === 0 ? "No reports submitted yet" : "No reports match your search"}
              </div>
              <p className="text-gray-400">
                {reports.length === 0 ? "Start by submitting your first report" : "Try adjusting your search criteria"}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Report #{report.id}
                        </h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Task: <span className="font-medium text-gray-900">{report.task?.title || "N/A"}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      
                      {report && (
                        <>
                          <button
                            onClick={() => handleEditReport(report)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors group"
                            title="Edit Report"
                          >
                            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteReport(report)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete Report"
                          >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {report.content.length > 120
                        ? report.content.slice(0, 120) + "..."
                        : report.content}
                    </p>
                  </div>
                  
                  {report.comment && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                      <p className="text-xs font-medium text-blue-800 mb-1">Team Lead Comment:</p>
                      <p className="text-sm text-blue-700">{report.comment}</p>
                    </div>
                  )}
                  
                  {report.fileURL && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Download className="w-4 h-4" />
                      <span>Attachment available</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Modal */}
        {showViewModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Report Details</h3>
                    <p className="text-sm text-gray-600 mt-1">Report #{selectedReport.id}</p>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedReport.task?.title || "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex">
                      {getStatusBadge(selectedReport.status)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submission Date</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {formatDateLong(selectedReport.createdAt)}
                    </p>
                  </div>
                  
                  {selectedReport.fileURL && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                      <a
                        href={`http://localhost:8004${selectedReport.fileURL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Attachment
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Content</label>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedReport.content}
                    </p>
                  </div>
                </div>
                
                {selectedReport.comment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Lead Comment</label>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                        {selectedReport.comment}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Edit Report</h3>
                    <p className="text-sm text-gray-600 mt-1">Report #{selectedReport.id}</p>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Content</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Update your report content..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeAllModals}
                    disabled={isLoading}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitEdit}
                    disabled={isLoading || !editContent.trim()}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isLoading && (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    )}
                    {isLoading ? "Updating..." : "Update Report"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Report</h3>
                    <p className="text-sm text-gray-600">
                      Are you sure you want to delete Report #{selectedReport.id}? This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeAllModals}
                    disabled={isLoading}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isLoading}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isLoading && (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    )}
                    {isLoading ? "Deleting..." : "Delete Report"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );}