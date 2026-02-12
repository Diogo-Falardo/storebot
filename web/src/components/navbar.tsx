import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from './ui/button'
import ShopBtn from './shop/shop.btn'

const Navbar = () => {
  return (
    <nav className="w-full flex justify-center">
      <div className="w-full lg:max-w-7xl flex items-center justify-between">
        <Link to="/" className="select-none text-4xl font-bold tracking-widest">
          Kira
        </Link>
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton />
            <ShopBtn />
          </div>
        </SignedIn>
        <SignedOut>
          <Link
            className={`${buttonVariants({ variant: 'default' })}`}
            to="/auth/sign-in/$"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </nav>
  )
}

export default Navbar
