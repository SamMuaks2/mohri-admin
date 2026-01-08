// import ProtectedRoute from "../../components/ProtectedRoute";

// export default function CertificationsPage() {
//   return (
//     <ProtectedRoute>
//       <section>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gold">Certifications & Awards</h2>
//           <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
//             + Add Certification
//           </button>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <CertificationCard
//             title="AWS Certified Solutions Architect"
//             issuer="Amazon Web Services"
//             date="Dec 2024"
//             credentialId="AWS-12345-6789"
//             status="Active"
//             expiryDate="Dec 2027"
//           />
//           <CertificationCard
//             title="Google Cloud Professional Developer"
//             issuer="Google Cloud"
//             date="Sep 2024"
//             credentialId="GCP-98765-4321"
//             status="Active"
//             expiryDate="Sep 2026"
//           />
//           <CertificationCard
//             title="Certified Kubernetes Administrator"
//             issuer="Cloud Native Computing Foundation"
//             date="Jun 2024"
//             credentialId="CKA-55555-3333"
//             status="Active"
//             expiryDate="Jun 2027"
//           />
//           <CertificationCard
//             title="Meta Front-End Developer Certificate"
//             issuer="Meta"
//             date="Mar 2024"
//             credentialId="META-11111-2222"
//             status="Active"
//             expiryDate="Never"
//           />
//           <CertificationCard
//             title="MongoDB Certified Developer"
//             issuer="MongoDB University"
//             date="Jan 2024"
//             credentialId="MONGO-44444-6666"
//             status="Active"
//             expiryDate="Jan 2027"
//           />
//           <CertificationCard
//             title="Microsoft Azure Fundamentals"
//             issuer="Microsoft"
//             date="Nov 2023"
//             credentialId="AZ-77777-8888"
//             status="Active"
//             expiryDate="Never"
//           />
//         </div>
//       </section>
//     </ProtectedRoute>
//   );
// }

// function CertificationCard({
//   title,
//   issuer,
//   date,
//   credentialId,
//   status,
//   expiryDate,
// }: {
//   title: string;
//   issuer: string;
//   date: string;
//   credentialId: string;
//   status: string;
//   expiryDate: string;
// }) {
//   return (
//     <div className="bg-black border-2 border-gold p-6 rounded">
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex-1">
//           <h3 className="text-xl font-bold text-gold mb-2">{title}</h3>
//           <p className="text-white font-semibold mb-1">{issuer}</p>
//           <p className="text-sm text-silver">Issued: {date}</p>
//         </div>
//         <span
//           className={`px-3 py-1 rounded text-xs font-semibold ${
//             status === "Active"
//               ? "bg-green-600 text-white"
//               : "bg-gray-600 text-white"
//           }`}
//         >
//           {status}
//         </span>
//       </div>

//       <div className="space-y-2 mb-4">
//         <div className="text-sm">
//           <span className="text-silver">Credential ID: </span>
//           <span className="text-white font-mono">{credentialId}</span>
//         </div>
//         <div className="text-sm">
//           <span className="text-silver">Expires: </span>
//           <span className="text-white">{expiryDate}</span>
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <button className="flex-1 px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
//           Edit
//         </button>
//         <button className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold">
//           View
//         </button>
//         <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  createdAt: string;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/certifications");
      setCertifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const certificationData = {
        name: formData.name,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || undefined,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
        description: formData.description || undefined,
      };

      await apiClient.post("/certifications", certificationData);
      setShowModal(false);
      resetForm();
      fetchCertifications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingCertification) return;

    try {
      const certificationData = {
        name: formData.name,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || undefined,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
        description: formData.description || undefined,
      };

      await apiClient.put(`/certifications/${editingCertification._id}`, certificationData);
      setShowModal(false);
      setEditingCertification(null);
      resetForm();
      fetchCertifications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      await apiClient.delete(`/certifications/${id}`);
      fetchCertifications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData({
      name: certification.name,
      issuer: certification.issuer,
      issueDate: certification.issueDate.split("T")[0],
      expiryDate: certification.expiryDate ? certification.expiryDate.split("T")[0] : "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
      description: certification.description || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      description: "",
    });
    setEditingCertification(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getStatus = (certification: Certification) => {
    if (!certification.expiryDate) return "Active";
    return isExpired(certification.expiryDate) ? "Expired" : "Active";
  };

  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Certifications & Awards</h2>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors"
          >
            + Add Certification
          </button>
        </div>

        {loading && <p className="text-silver">Loading certifications...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification._id}
              certification={certification}
              onEdit={() => openEditModal(certification)}
              onDelete={() => handleDelete(certification._id)}
              formatDate={formatDate}
              getStatus={getStatus}
            />
          ))}
        </div>

        {!loading && certifications.length === 0 && (
          <p className="text-center text-silver py-8">
            No certifications added yet. Add your first one!
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-black border-2 border-gold p-8 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gold mb-6">
                {editingCertification ? "Edit Certification" : "Add New Certification"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-silver mb-2 font-semibold">Certification Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Issuing Organization *</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-silver mb-2 font-semibold">Issue Date *</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-silver mb-2 font-semibold">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Credential ID</label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="e.g., AWS-12345-6789"
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Credential URL</label>
                  <input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-silver mb-2 font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-black border-2 border-gold rounded text-white"
                    placeholder="Brief description of the certification..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={editingCertification ? handleUpdate : handleCreate}
                  className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-[#b8941e] transition-colors"
                >
                  {editingCertification ? "Update Certification" : "Add Certification"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCertification(null);
                    resetForm();
                  }}
                  className="flex-1 bg-black border-2 border-gold text-gold px-6 py-3 rounded font-semibold hover:bg-gold hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}

function CertificationCard({
  certification,
  onEdit,
  onDelete,
  formatDate,
  getStatus,
}: {
  certification: Certification;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
  getStatus: (cert: Certification) => string;
}) {
  const status = getStatus(certification);
  
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gold mb-2">{certification.name}</h3>
          <p className="text-white font-semibold mb-1">{certification.issuer}</p>
          <p className="text-sm text-silver">Issued: {formatDate(certification.issueDate)}</p>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${
            status === "Active"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {certification.credentialId && (
          <div className="text-sm">
            <span className="text-silver">Credential ID: </span>
            <span className="text-white font-mono">{certification.credentialId}</span>
          </div>
        )}
        <div className="text-sm">
          <span className="text-silver">Expires: </span>
          <span className="text-white">
            {certification.expiryDate ? formatDate(certification.expiryDate) : "Never"}
          </span>
        </div>
        {certification.description && (
          <p className="text-sm text-silver mt-2">{certification.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold"
        >
          Edit
        </button>
        {certification.credentialUrl && (
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold"
          >
            View
          </a>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}