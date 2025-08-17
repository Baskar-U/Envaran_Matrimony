import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <h1 className="text-2xl font-poppins font-bold gradient-text">SecondChance</h1>
            <span className="ml-2 text-royal-blue font-medium">Matrimony</span>
          </Link>
          
          {isAuthenticated && (
            <div className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className={`transition-colors ${location === '/' ? 'text-royal-blue' : 'text-charcoal hover:text-royal-blue'}`}
                data-testid="nav-home"
              >
                Home
              </Link>
              <Link 
                href="/profiles" 
                className={`transition-colors ${location === '/profiles' ? 'text-royal-blue' : 'text-charcoal hover:text-royal-blue'}`}
                data-testid="nav-profiles"
              >
                Profiles
              </Link>
              <Link 
                href="/matches" 
                className={`transition-colors ${location === '/matches' ? 'text-royal-blue' : 'text-charcoal hover:text-royal-blue'}`}
                data-testid="nav-matches"
              >
                Matches
              </Link>
            </div>
          )}
          
          <div className="flex space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-profile-avatar"
                  />
                )}
                <span className="text-charcoal" data-testid="text-user-name">
                  {user?.firstName || 'User'}
                </span>
                <a 
                  href="/api/logout" 
                  className="px-4 py-2 text-royal-blue hover:bg-royal-blue hover:text-white transition-all duration-300 border border-royal-blue rounded-lg"
                  data-testid="button-logout"
                >
                  Logout
                </a>
              </div>
            ) : (
              <>
                <a 
                  href="/api/login" 
                  className="px-4 py-2 text-royal-blue hover:bg-royal-blue hover:text-white transition-all duration-300 border border-royal-blue rounded-lg"
                  data-testid="button-login"
                >
                  Login
                </a>
                <a 
                  href="/api/login" 
                  className="px-4 py-2 bg-royal-blue text-white hover:bg-blue-700 transition-all duration-300 rounded-lg"
                  data-testid="button-register"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
