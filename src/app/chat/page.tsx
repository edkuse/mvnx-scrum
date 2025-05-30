const messages = [
  { user: 'Alice', text: 'Hey team, daily standup at 10am!', dot: 'bg-accent', nameColor: 'text-accent' },
  { user: 'Bob', text: 'Got it! See you all there.', dot: 'bg-info', nameColor: 'text-info' },
  { user: 'Carol', text: 'I have a blocker, will discuss.', dot: 'bg-warning', nameColor: 'text-warning' },
];

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="rounded-lg shadow p-4 max-w-lg bg-white flex items-center gap-3">
            <span className={`inline-block w-3 h-3 rounded-full ${msg.dot}`}></span>
            <div>
              <div className={`font-bold ${msg.nameColor}`}>{msg.user}</div>
              <div className="text-gray-900">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 