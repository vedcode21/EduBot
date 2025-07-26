import ChatInterface from "@/components/chat-interface";

export default function Chat() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <p className="text-gray-600">Manage live customer inquiries and automated responses</p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6">
        <div className="h-full">
          <ChatInterface isFullScreen />
        </div>
      </main>
    </>
  );
}
