import { NavLink, useNavigate } from "react-router-dom";
import {LayoutDashboard,PlusCircle,ListChecks,BarChart3,BookOpen,History,Sparkles,LogOut, GraduationCap,} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/helpers";

const adminLinks = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Create Quiz", url: "/admin/create", icon: PlusCircle },
  { title: "My Quizzes", url: "/admin/quizzes", icon: ListChecks },
  { title: "AI Generate", url: "/admin/ai", icon: Sparkles },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const studentLinks = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard },
  { title: "Browse Quizzes", url: "/student/quizzes", icon: BookOpen },
  { title: "My Results", url: "/student/results", icon: History },
  { title: "Analytics", url: "/student/analytics", icon: BarChart3 },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside
      className="hidden md:flex flex-col w-64 min-h-screen shrink-0"
      style={{
        background: "hsl(220 25% 12%)",
        borderRight: "1px solid hsl(220 20% 20%)",
      }}
    >
      {/* Logo / Header */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid hsl(220 20% 20%)" }}
      >
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">QuizBuilder</h1>
          <p className="text-xs capitalize" style={{ color: "hsl(220 10% 55%)" }}>
            {user?.role || "User"} Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/admin" || item.url === "/student"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-primary font-medium"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid hsl(220 20% 20%)" }}
      >
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs truncate" style={{ color: "hsl(220 10% 55%)" }}>
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
