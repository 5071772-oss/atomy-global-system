import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // Клиент Supabase подключается здесь и только здесь: в первую загрузку сайта
    // эта библиотека не попадает.
    const { supabase } = await import('@/integrations/supabase/client')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      })
    }
    return { session }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="glass border-b sticky top-0 z-50 h-16 flex items-center justify-between px-6">
        <div className="font-bold tracking-wider text-primary">ENGINE PLATFORM</div>
        <div className="flex items-center gap-4">
          <button 
            onClick={async () => {
              const { supabase } = await import('@/integrations/supabase/client')
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Выйти
          </button>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
