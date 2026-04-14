import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Plus, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Analyst'

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <span className="text-xs font-bold text-white tracking-tight">A</span>
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">
              ASIS <span className="text-muted-foreground font-normal text-sm">v5.0</span>
            </span>
          </Link>

          {/* Nav links (logged in only) */}
          {user && (
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/dashboard">
                <Button variant={isActive('/dashboard') ? 'secondary' : 'ghost'} size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </Button>
              </Link>
              <Link to="/analysis/new">
                <Button variant={isActive('/analysis/new') ? 'secondary' : 'ghost'} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />New Analysis
                </Button>
              </Link>
            </div>
          )}

          {/* User menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  {displayName[0].toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-[120px] truncate">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-popover shadow-xl py-1 z-50"
                  onBlur={() => setMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium text-foreground truncate">{user.email || displayName}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <LogOut className="h-4 w-4" />Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
