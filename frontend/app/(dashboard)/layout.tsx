import Sidebar from '@/app/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        {/* Container con max-width para contenido */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}