import { useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiService.put("/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async () => {
    setLoading(true);
    try {
      await apiService.put("/theme", { theme });
      toast.success("Theme updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 px-6 bg-blue-50">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      {/* Change Password Section */}
      <div className="bg-white border border-gray-500 rounded-lg p-6 shadow-xl mb-6">
        <h2 className="text-lg font-medium mb-4">Change Password</h2>
            <div className="w-full border-t-2 border-gray-400"></div>
        <div className="space-y-4 mt-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-400 rounded-md px-3 py-2 "
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-400 rounded-md px-3 py-2 "
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
className="w-full border border-gray-400 rounded-md px-3 py-2 "              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={loading}
            className="bg-indigo-600 text-white rounded-md px-4 py-2 font-medium hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
