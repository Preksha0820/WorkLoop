import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await apiService.get("/employee/profile");
      setProfile(res.data);
      setEditName(res.data.name);
      setEditEmail(res.data.email);
    } catch (err) {
      console.error("Failed to load profile", err);
      toast.error("Failed to load profile");
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await apiService.put("/employee/profile", {
        name: editName,
        email: editEmail,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-base">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            👤 My Profile
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            You can view and update your personal information.
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Info Card */}
          <div className="bg-white rounded-xl border border-gray-400 shadow-sm p-6">
            <h2 className="text-lg font-semibold  text-center text-gray-800 bg-purple-200 py-4 px-2 mb-4 border-b rounded-xl">
              📝 Basic Information
            </h2>
            <div className="w-full border-t-2 border-gray-400"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-2 border border-gray-300 rounded-md text-gray-800">
                    {profile.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-2 border border-gray-300 rounded-md text-gray-800">
                    {profile.email}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-red-500 border border-gray-300 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-xl border border-gray-400 shadow-sm p-6">
            <h2 className="text-lg font-semibold bg-purple-200 text-center py-4 px-2 text-gray-800 mb-4 border-b rounded-xl">
              📌 Summary
            </h2>
            <div className="w-full border-t-2 border-gray-400 mb-4"></div>

            {/* Row 1: Employee ID + Reports To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-500 mb-1">Employee ID</p>
                <p className="font-medium text-gray-800">{profile.id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-500 mb-1">Reports To</p>
                <p className="font-medium text-gray-800">
                  {profile.teamLeadName} ({profile.teamLeadId || "N/A"})
                </p>
              </div>
            </div>

            {/* Row 2: Role + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-500 mb-1">Role</p>
                <p className="font-medium text-gray-800">{profile.role}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-500 mb-1">Company</p>
                <p className="font-medium text-gray-800">
                  {profile.companyName} ({profile.companyId || "N/A"})
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
