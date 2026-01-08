import ProtectedRoute from "../../components/ProtectedRoute";

export default function CertificationsPage() {
  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Certifications & Awards</h2>
          <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
            + Add Certification
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CertificationCard
            title="AWS Certified Solutions Architect"
            issuer="Amazon Web Services"
            date="Dec 2024"
            credentialId="AWS-12345-6789"
            status="Active"
            expiryDate="Dec 2027"
          />
          <CertificationCard
            title="Google Cloud Professional Developer"
            issuer="Google Cloud"
            date="Sep 2024"
            credentialId="GCP-98765-4321"
            status="Active"
            expiryDate="Sep 2026"
          />
          <CertificationCard
            title="Certified Kubernetes Administrator"
            issuer="Cloud Native Computing Foundation"
            date="Jun 2024"
            credentialId="CKA-55555-3333"
            status="Active"
            expiryDate="Jun 2027"
          />
          <CertificationCard
            title="Meta Front-End Developer Certificate"
            issuer="Meta"
            date="Mar 2024"
            credentialId="META-11111-2222"
            status="Active"
            expiryDate="Never"
          />
          <CertificationCard
            title="MongoDB Certified Developer"
            issuer="MongoDB University"
            date="Jan 2024"
            credentialId="MONGO-44444-6666"
            status="Active"
            expiryDate="Jan 2027"
          />
          <CertificationCard
            title="Microsoft Azure Fundamentals"
            issuer="Microsoft"
            date="Nov 2023"
            credentialId="AZ-77777-8888"
            status="Active"
            expiryDate="Never"
          />
        </div>
      </section>
    </ProtectedRoute>
  );
}

function CertificationCard({
  title,
  issuer,
  date,
  credentialId,
  status,
  expiryDate,
}: {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  status: string;
  expiryDate: string;
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gold mb-2">{title}</h3>
          <p className="text-white font-semibold mb-1">{issuer}</p>
          <p className="text-sm text-silver">Issued: {date}</p>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${
            status === "Active"
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <span className="text-silver">Credential ID: </span>
          <span className="text-white font-mono">{credentialId}</span>
        </div>
        <div className="text-sm">
          <span className="text-silver">Expires: </span>
          <span className="text-white">{expiryDate}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
          Edit
        </button>
        <button className="px-4 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold">
          View
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
          Delete
        </button>
      </div>
    </div>
  );
}