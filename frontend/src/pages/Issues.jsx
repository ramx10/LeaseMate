import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import { useAuth } from "../context/AuthContext";

export default function Issues() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [category, setCategory] = useState("Water supply");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIssues = () => {
    axios
      .get("http://localhost:5000/api/issues")
      .then((res) => setIssues(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const reportIssue = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/issues/report", {
        category,
        description,
      });
      setCategory("Water supply");
      setDescription("");
      fetchIssues();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}`, { status: newStatus });
      fetchIssues();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-red-100 text-red-700";
    if (status === "In Progress") return "bg-amber-100 text-amber-700";
    if (status === "Resolved") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <MainLayout title="Issues / Complaints">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🛠 Issues & Complaints</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {user?.role === "Tenant" ? "Report and track your maintenance issues." : "Manage reported issues across all properties."}
          </p>
        </div>
      </div>

      {/* Tenant Report Form */}
      {user?.role === "Tenant" && (
        <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
          <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Report a New Issue</h2>
          <form onSubmit={reportIssue} className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <select
                className="flex-1 max-w-xs border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Water supply">Water supply problem</option>
                <option value="Electricity">Electricity problem</option>
                <option value="Maintenance">Maintenance request</option>
                <option value="Billing">Billing issue</option>
                <option value="Other">Other</option>
              </select>
              <input
                className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Describe the problem in detail..."
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}
              >
                {loading ? "Submitting..." : "+ Submit Issue"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Issues Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.10)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
              {user?.role === "Owner" && (
                <>
                  <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Tenant</th>
                  <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Location</th>
                </>
              )}
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Date</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Category</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold w-1/3">Description</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Status</th>
              <th className="px-5 py-3.5 text-left text-white text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan={user?.role === "Owner" ? 7 : 5} className="text-center py-12 text-gray-400 text-sm">
                  No issues found
                </td>
              </tr>
            ) : (
              issues.map((issue, i) => (
                <tr
                  key={issue.id}
                  className={`border-t border-gray-50 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  {user?.role === "Owner" && (
                    <>
                      <td className="px-5 py-3.5 font-medium text-gray-800 text-sm">{issue.tenant_name}</td>
                      <td className="px-5 py-3.5 text-gray-600 text-sm">
                        {issue.property_name} • Room {issue.room_number}
                      </td>
                    </>
                  )}
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(issue.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 text-sm font-medium">{issue.category}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm max-w-xs truncate" title={issue.description}>
                    {issue.description}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white text-gray-700"
                      value={issue.status}
                      onChange={(e) => updateStatus(issue.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
