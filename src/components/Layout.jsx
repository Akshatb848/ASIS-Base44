import Navbar from './Navbar'

export default function Layout({ children, className = '' }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </main>
    </div>
  )
}
