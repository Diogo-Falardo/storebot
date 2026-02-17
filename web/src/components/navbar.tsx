import { Link } from '@tanstack/react-router'

const Navbar = () => {
  return (
    <nav className="w-full flex justify-center">
      <div className="w-full lg:max-w-7xl flex items-center justify-between">
        <Link to="/" className="select-none text-4xl font-bold tracking-widest">
          Kira
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
