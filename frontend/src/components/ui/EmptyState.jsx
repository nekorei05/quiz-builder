export default function EmptyState({
  title = "Nothing here",
  description = "Check back later",
  children,
}) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <p className="text-lg font-medium">
        {title}
      </p>

      <p className="text-sm mt-1">
        {description}
      </p>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}