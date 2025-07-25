// src/app/403/page.tsx
export default function ForbiddenPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">403</h1>
          <p className="text-xl">You are not allowed to access this page.</p>
          <p className="text-muted-foreground">Please login with the correct account.</p>
        </div>
      </div>
    )
  }
  