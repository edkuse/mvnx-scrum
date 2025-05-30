const reports = [
  { label: 'Participation Rate', value: '92%', color: 'text-success' },
  { label: 'Blockers Reported', value: '3', color: 'text-warning' },
  { label: 'Tasks Completed', value: '27', color: 'text-primary' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {reports.map((r) => (
          <div key={r.label} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className={`text-3xl font-bold ${r.color}`}>{r.value}</div>
            <div className="text-gray-700 mt-2">{r.label}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Analytics Overview</h2>
        <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">
          [Analytics Chart Placeholder]
        </div>
      </div>
    </div>
  );
} 