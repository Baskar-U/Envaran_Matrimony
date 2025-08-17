import { useState, useEffect } from "react";
import { Heart, Play, Shield, UserCheck, MessageSquare, SearchCheck, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import EventSlider from "@/components/EventSlider";
import RegistrationPopup from "@/components/RegistrationPopup";

export default function Landing() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show registration popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" data-testid="landing-page">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-blue to-blue-800 text-white py-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-poppins font-bold mb-6" data-testid="text-hero-title">
                Your Second Chapter 
                <span className="text-gold block">Starts Here</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100" data-testid="text-hero-description">
                A premium matrimony platform designed specifically for divorced individuals seeking meaningful connections. Built on trust, privacy, and celebration of new beginnings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                  data-testid="button-find-match"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Find Your Match
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-royal-blue transition-all duration-300"
                  data-testid="button-how-it-works"
                >
                  <Play className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Happy couple representing second chance love"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero-couple"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="text-green-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal" data-testid="text-verified-badge">Verified Profiles</p>
                    <p className="text-sm text-gray-600">100% Authentic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-16 bg-white" data-testid="trust-privacy-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-trust-title">
              Built on <span className="text-royal-blue">Trust</span> & <span className="text-gold">Privacy</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-trust-description">
              Your journey to finding love again deserves the highest level of security and respect.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center card-hover p-6 bg-soft-pink rounded-2xl" data-testid="card-privacy">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Privacy Protected</h3>
              <p className="text-gray-600">Your personal information is encrypted and secure. Control who sees your profile.</p>
            </div>
            <div className="text-center card-hover p-6 bg-yellow-50 rounded-2xl" data-testid="card-verified">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Verified Members</h3>
              <p className="text-gray-600">All profiles undergo thorough verification for authentic connections.</p>
            </div>
            <div className="text-center card-hover p-6 bg-blue-50 rounded-2xl" data-testid="card-communication">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-3">Secure Communication</h3>
              <p className="text-gray-600">Chat, audio, and video calls with end-to-end encryption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-charcoal mb-4" data-testid="text-features-title">
              Why Choose <span className="text-royal-blue">SecondChance</span>
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
            Join thousands of members who found love and happiness on SecondChance Matrimony
          </p>
          <Button
            size="lg"
            className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4"
            data-testid="button-start-journey"
          >
            <Heart className="mr-2 h-5 w-5" />
            Start Your Journey Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-poppins font-bold mb-4 gradient-text">SecondChance Matrimony</h3>
              <p className="text-gray-400 mb-4">Finding love shouldn't have an expiry date. We celebrate second chances and new beginnings.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium Plans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +91 98765 43210</li>
                <li>✉️ hello@secondchance.com</li>
                <li>📍 Chennai, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SecondChance Matrimony. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <RegistrationPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
