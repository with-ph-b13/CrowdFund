import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-bold whitespace-nowrap text-blue-600">CrowdFund</span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
          {!user ? (
            <>
              <Link href="/login" className="text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none">Login</Link>
              <Link href="/register" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 text-center">Register</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">{user.credits} Credits</span>
              <Link href="/dashboard" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Dashboard</Link>
              <button onClick={logout} className="text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none">Logout</button>
            </div>
          )}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <Link href="/" className={`block py-2 px-3 rounded md:p-0 ${pathname === '/' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`} aria-current="page">Home</Link>
            </li>
            <li>
              <Link href="/explore" className={`block py-2 px-3 rounded md:p-0 ${pathname === '/explore' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}`}>Explore Campaigns</Link>
            </li>
            <li>
              <a href="https://github.com/with-ph-b13/CrowdFund" target="_blank" rel="noreferrer" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Join as Developer</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
