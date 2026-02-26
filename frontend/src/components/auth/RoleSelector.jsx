export default function RoleSelector({ role, setRole }) {
  const roles = [
    { value: "student", label: "Student" },
    { value: "admin", label: "Admin" },
  ];

  function handleSelect(value) {
    setRole(value);
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">
        Select role
      </p>

      <div className="flex gap-2">
        {roles.map((item) => {
          const isActive = role === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect(item.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}