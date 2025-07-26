import ResponseTemplatesTable from "@/components/response-templates-table";

export default function KnowledgeBase() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-gray-600">Manage response templates and automated replies</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <ResponseTemplatesTable />
      </main>
    </>
  );
}
