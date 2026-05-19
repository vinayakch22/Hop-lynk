import { Navbar } from '../components/shared/Navbar';
import { Sidebar } from '../components/shared/Sidebar';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col">
      <Navbar />
      <div className="flex-1 min-w-0 flex">
        <Sidebar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};
