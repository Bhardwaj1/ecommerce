
import { Outlet, Link } from 'react-router-dom'
import { Menu } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block p-5">
        <h1 className="text-2xl font-bold mb-6">My Admin</h1>
        <nav className="space-y-3">
          <Link to="/" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/product-category" className="block p-2 rounded hover:bg-gray-100">Product Category</Link>
          <Link to="/product-subcategory" className="block p-2 rounded hover:bg-gray-100">Product Sub Category</Link>
          <Link to={`/product`} className="block p-2 rounded hover:bg-gray-100">Product</Link>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-white shadow z-50">
        <h1 className="text-xl font-bold">My Admin</h1>
        <Menu />
      </header>

      {/* Main */}
      <main className="flex-1 p-6 mt-14 md:mt-0">
        <Outlet />
      </main>
    </div>
  )
}

