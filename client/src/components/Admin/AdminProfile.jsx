import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await apiService.get("/admin/profile");
      setProfile(res.data);
      setEditName(res.data.name);
      setEditEmail(res.data.email);
      setEditPhone(res.data.phone);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await apiService.put("/admin/profile", {
        name: editName,
        email: editEmail,
        phone: editPhone
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-center items-center justify-center py-20">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🛠️ Admin Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage your profile and company overview.</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-center text-gray-800 bg-yellow-200 py-4 mb-4 border-b rounded-xl">🧍 Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 border rounded-md">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 border rounded-md">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 border rounded-md">{profile.phone || "-"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 p-2 bg-gray-50 border rounded-md">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              {isEditing ? (
                <div className="space-x-4">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
                  <button onClick={saveProfile} disabled={isSaving} className="px-4 py-2 bg-green-600 text-white rounded-md">{isSaving ? "Saving..." : "Save"}</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Edit Profile</button>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-center text-gray-800 bg-yellow-200 py-4 mb-4 border-b rounded-xl">🏢 Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <p className="mt-1 p-2 bg-gray-50 border rounded-md">{profile.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Company Domain</label>
                <p className="mt-1 p-2 bg-gray-50 border rounded-md">{profile.companyDomain || "-"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 ">
            <div className="bg-purple-200 p-4 rounded-lg text-center border mt-10">
              <p className="text-gray-600">👥 Total Team Leads</p>
              <p className="text-2xl font-bold text-purple-700">{profile.totalTeamLeads || 0}</p>
            </div>
            <div className="bg-purple-200 p-4 rounded-lg text-center border mt-10">
              <p className="text-gray-600">👨‍👩‍👧‍👦 Total Employees</p>
              <p className="text-2xl font-bold text-purple-700">{profile.totalEmployees || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
