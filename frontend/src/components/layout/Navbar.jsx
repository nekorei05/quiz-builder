import { useState } from "react";
import {Menu,X,GraduationCap,LogOut,LayoutDashboard,PlusCircle,ListChecks,BarChart3,BookOpen,History,Sparkles,} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
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

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function handleNavigate() {
    setIsOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="md:hidden">

      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">

        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm">QuizBuilder</span>
        </div>

        <button
          onClick={toggleMenu}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

      </div>

      {isOpen && (
        <div className="absolute inset-x-0 top-[52px] z-50 bg-card border-b border-border shadow-lg p-3 space-y-1 animate-fade-in">

          {links.map((link) => (
            <NavLink
              key={link.url}
              to={link.url}
              end={link.url === "/admin" || link.url === "/student"}
              onClick={handleNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors",
                  isActive && "bg-accent text-accent-foreground font-medium"
                )
              }
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span>{link.title}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </button>

        </div>
      )}

    </div>
  );
}

export default Navbar;