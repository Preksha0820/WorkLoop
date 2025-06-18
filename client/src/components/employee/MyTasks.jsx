import { useEffect, useState } from "react";
import apiService from "../../api/apiService"; 
import { format } from "date-fns";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [workSummary, setWorkSummary] = useState("");
  const [file, setFile] = useState(null);
  const [submissionType, setSubmissionType] = useState("normal"); // normal or table
  const [tableData, setTableData] = useState([{ key: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await apiService.get("/employee/tasks");
      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filter and search
  useEffect(() => {
    let filtered = [...tasks];
    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    if (search) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredTasks(filtered);
  }, [tasks, search, statusFilter]);

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
    setWorkSummary("");
    setFile(null);
    setSubmissionType("normal");
    setTableData([{ key: "", value: "" }]);
  };

  const closeModal = () => {
    setShowModal(false);
    setWorkSummary("");
    setFile(null);
    setSubmissionType("normal");
    setTableData([{ key: "", value: "" }]);
    setSelectedTask(null);
  };

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

  const handleSubmit = async () => {
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
      formData.append("taskId", selectedTask.id);
      if (file) formData.append("file", file);

      await apiService.post("/employee/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Report submitted successfully");
      closeModal();
      fetchTasks();
    } catch (err) {
      console.error("Error submitting report", err);
      alert("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && selectedTask?.status !== "COMPLETED";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">Manage and submit reports for your assigned tasks</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by task name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="min-w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Task Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Task Details</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Deadline</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {task.description.length > 80
                            ? task.description.slice(0, 80) + "..."
                            : task.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isOverdue(task.deadline) ? 'text-red-600' : 'text-gray-900'}`}>
                          {format(new Date(task.deadline), "MMM dd, yyyy")}
                        </span>
                        {isOverdue(task.deadline) && (
                          <span className="text-xs text-red-500 font-medium">Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openModal(task)}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-all"
                      >
                        {task.status === "COMPLETED" ? "Update Report" : "Submit Report"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No tasks found</div>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Submit Work Report</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedTask.title}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                {/* Task Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Task Details</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedTask.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-600">
                      Due: {format(new Date(selectedTask.deadline), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>

                {/* Submission Type Toggle */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Report Format</label>
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
                      <span className="text-sm text-gray-700">Free Text</span>
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
                      <span className="text-sm text-gray-700">Structured Data</span>
                    </label>
                  </div>
                </div>

                {/* Content Input */}
                {submissionType === "normal" ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Summary</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Describe the work completed, challenges faced, and any important notes..."
                      value={workSummary}
                      onChange={(e) => setWorkSummary(e.target.value)}
                      rows={6}
                    ></textarea>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Structured Report Data</label>
                      <button
                        type="button"
                        onClick={addTableRow}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        + Add Row
                      </button>
                    </div>
                    <div className="space-y-3">
                      {tableData.map((row, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <input
                            type="text"
                            placeholder="Field name (e.g., Hours worked)"
                            value={row.key}
                            onChange={(e) => updateTableRow(index, "key", e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., 8 hours)"
                            value={row.value}
                            onChange={(e) => updateTableRow(index, "value", e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          {tableData.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTableRow(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach File (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {file ? file.name : "Click to upload file"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (submissionType === "normal" && !workSummary.trim()) || (submissionType === "table" && !tableData.some(row => row.key.trim() && row.value.trim()))}
                  className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}