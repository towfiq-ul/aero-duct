import { useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">Job #{id}</h1>
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <p>Customer: John Doe</p>
        <p>Service: Premium Duct Clean</p>
        <a href={`/technician/checklist/${id}`} className="mt-6 block text-center bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-500">Start Checklist</a>
      </div>
    </div>
  );
}
