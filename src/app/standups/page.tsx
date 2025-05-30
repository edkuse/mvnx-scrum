'use client';
import { useState } from 'react';

const mockResponses = [
  { name: 'Alice', date: 'Today', progress: 'Finished login page', blockers: 'None', plans: 'Start dashboard' },
  { name: 'Bob', date: 'Today', progress: 'Reviewed PRs', blockers: 'Waiting on QA', plans: 'Work on API' },
];

export default function StandupsPage() {
  const [form, setForm] = useState({ progress: '', blockers: '', plans: '' });
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Daily Standup</h1>
      <form className="space-y-4 bg-white p-6 rounded-lg shadow max-w-xl">
        <div>
          <label className="block text-gray-700 font-medium mb-1">What did you accomplish?</label>
          <input className="w-full border rounded px-3 py-2" value={form.progress} onChange={e => setForm(f => ({ ...f, progress: e.target.value }))} placeholder="Yesterday's progress" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Any blockers?</label>
          <input className="w-full border rounded px-3 py-2" value={form.blockers} onChange={e => setForm(f => ({ ...f, blockers: e.target.value }))} placeholder="Blockers" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">What will you do next?</label>
          <input className="w-full border rounded px-3 py-2" value={form.plans} onChange={e => setForm(f => ({ ...f, plans: e.target.value }))} placeholder="Today's plan" />
        </div>
        <button type="button" className="bg-primary text-white px-4 py-2 rounded font-semibold">Send Standup</button>
      </form>
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Recent Standups</h2>
        <ul className="space-y-3">
          {mockResponses.map((resp, i) => (
            <li key={i} className="bg-white rounded shadow p-4">
              <div className="font-bold text-gray-900">{resp.name} <span className="text-xs text-gray-500">({resp.date})</span></div>
              <div className="text-sm text-gray-700"><span className="font-medium">Progress:</span> {resp.progress}</div>
              <div className="text-sm text-gray-700"><span className="font-medium">Blockers:</span> {resp.blockers}</div>
              <div className="text-sm text-gray-700"><span className="font-medium">Plans:</span> {resp.plans}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 