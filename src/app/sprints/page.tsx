const sprints = [
  { name: 'Sprint 1', status: 'Completed', dot: 'bg-success' },
  { name: 'Sprint 2', status: 'Active', dot: 'bg-primary' },
  { name: 'Sprint 3', status: 'Planned', dot: 'bg-accent' },
];

export default function SprintsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Sprints</h1>
      <ul className="space-y-4">
        {sprints.map((sprint) => (
          <li key={sprint.name} className="rounded-lg shadow p-4 flex items-center gap-4 bg-white">
            <span className={`inline-block w-3 h-3 rounded-full ${sprint.dot}`}></span>
            <div className="font-bold text-lg text-gray-900">{sprint.name}</div>
            <span className="ml-auto rounded px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
              {sprint.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 