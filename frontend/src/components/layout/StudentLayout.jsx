import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default StudentLayout;