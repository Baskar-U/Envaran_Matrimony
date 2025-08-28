import { Heart, Play, Shield, UserCheck, MessageSquare, SearchCheck, Video, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import EventSlider from "@/components/EventSlider";
import Footer from "@/components/Footer";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50" data-testid="landing-page">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-poppins font-bold mb-6" data-testid="text-hero-title">
                Find Your Perfect 
                <span className="text-gold block">Match</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100" data-testid="text-hero-description">
                Envaran Matrimony - A premium matrimony platform for everyone seeking meaningful connections - whether single, divorced, widowed, or separated. Built on trust, privacy, and celebration of new beginnings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                  data-testid="button-login"
                  onClick={() => {
                    console.log('Login button clicked - navigating to /login');
                    window.location.href = '/login';
                  }}
                >
                  <User className="mr-2 h-5 w-5" />
                  Login
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-royal-blue transition-all duration-300 font-semibold bg-transparent"
                  data-testid="button-register-free"
                  onClick={() => {
                    console.log('Register Free button clicked - navigating to /registration');
                    window.location.href = '/registration';
                  }}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Register Free
                </Button>
              </div>
            </div>
            <HeroSlideshow />
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-16 bg-white" data-testid="trust-privacy-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-trust-title">
              Enterprise-Grade <span className="text-royal-blue">Security</span> & <span className="text-gold">Privacy</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-trust-description">
              Envaran Matrimony employs industry-leading security protocols and GDPR-compliant data protection to ensure your personal information remains confidential and secure throughout your journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center card-hover p-6 bg-soft-pink rounded-2xl" data-testid="card-privacy">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">256-bit SSL Encryption</h3>
              <p className="text-gray-600">Bank-level security with AES-256 encryption, two-factor authentication, and real-time fraud detection to protect your personal and financial data.</p>
            </div>
            <div className="text-center card-hover p-6 bg-yellow-50 rounded-2xl" data-testid="card-verified">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Identity Verification</h3>
              <p className="text-gray-600">Multi-step verification process including document verification, phone verification, and manual profile review by our dedicated security team.</p>
            </div>
            <div className="text-center card-hover p-6 bg-blue-50 rounded-2xl" data-testid="card-communication">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">End-to-End Encryption</h3>
              <p className="text-gray-600">All communications are encrypted using Signal Protocol standards. Your messages, calls, and personal data are protected with military-grade encryption.</p>
            </div>
          </div>
          
          {/* Additional Security Features */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h4 className="text-lg font-semibold mb-3 text-charcoal">Data Protection Compliance</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• GDPR and CCPA compliant data handling</li>
                <li>• Regular security audits by third-party experts</li>
                <li>• 24/7 monitoring for suspicious activities</li>
                <li>• Automatic data backup and disaster recovery</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h4 className="text-lg font-semibold mb-3 text-charcoal">Privacy Controls</h4>
              <ul className="text-gray-600 space-y-2">
                <li>• Granular privacy settings for profile visibility</li>
                <li>• Right to data deletion and portability</li>
                <li>• Anonymous browsing and incognito mode</li>
                <li>• No data sharing with third-party advertisers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-features-title">
              Why Choose <span className="text-royal-blue">Envaran</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-features-description">
              Advanced features designed specifically for mature individuals seeking meaningful relationships
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 card-hover" data-testid="feature-matching">
              <div className="w-20 h-20 bg-gradient-to-br from-royal-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SearchCheck className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Smart Matching</h3>
              <p className="text-gray-600">AI-powered compatibility matching based on your preferences and location</p>
            </div>
            <div className="text-center p-6 card-hover" data-testid="feature-video">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Video Calls</h3>
              <p className="text-gray-600">Secure video and audio calling to connect before meeting in person</p>
            </div>
            <div className="text-center p-6 card-hover" data-testid="feature-likes">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Mutual Likes</h3>
              <p className="text-gray-600">Connect only when both parties show interest for meaningful conversations</p>
            </div>
            <div className="text-center p-6 card-hover" data-testid="feature-events">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Event Planning</h3>
              <p className="text-gray-600">Complete wedding planning services when you find your perfect match</p>
            </div>
          </div>
        </div>
      </section>

      <EventSlider />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-royal-blue to-blue-800 text-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold mb-6" data-testid="text-cta-title">
            Ready to Start Your <span className="text-gold">New Journey?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8" data-testid="text-cta-description">
            Join thousands of members who found love and happiness on Envaran Matrimony
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
              data-testid="button-login-cta"
              onClick={() => {
                console.log('Login CTA button clicked - navigating to /login');
                window.location.href = '/login';
              }}
            >
              <User className="mr-2 h-5 w-5" />
              Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-royal-blue transition-all duration-300 text-lg px-8 py-4"
              data-testid="button-get-started-cta"
              onClick={() => {
                      console.log('Get Started CTA button clicked - navigating to /registration');
      window.location.href = '/registration';
              }}
            >
              <Heart className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
