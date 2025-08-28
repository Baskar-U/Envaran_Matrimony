import { Link } from "wouter";
import { 
  Heart, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Envaran Matrimony" className="h-8 w-8 rounded-full" />
              <span className="text-2xl font-bold">Envaran Matrimony</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Connecting hearts and creating beautiful beginnings. Your journey to love and perfect celebrations starts here.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Matrimony Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 mr-2 text-royal-blue" />
              Matrimony Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profiles" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link href="/matches" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  My Matches
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Messages
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-400" />
              Event Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Wedding Halls
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Catering Services
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Photography
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Decorations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
                             <div className="flex items-center text-gray-300">
                 <Phone className="h-4 w-4 mr-3 text-royal-blue" />
                 <span>+91 9176 400 700</span>
               </div>
               <div className="flex items-center text-gray-300">
                 <Mail className="h-4 w-4 mr-3 text-royal-blue" />
                 <span>info@envaranmatrimony.com</span>
               </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="h-4 w-4 mr-3 mt-1 text-royal-blue" />
                <span>123 Matrimony Street, Love City, LC 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear}Powered By Cookies Tech. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
