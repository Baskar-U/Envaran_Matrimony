import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const eventServices = [
  {
    id: "wedding-halls",
    title: "Wedding Halls",
    description: "Book verified wedding halls near you with premium amenities and stunning venues",
    startingPrice: "₹50,000",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "Premium",
    categoryColor: "bg-royal-blue",
  },
  {
    id: "catering",
    title: "Catering Services", 
    description: "Top caterers with customizable menus for traditional and modern celebrations",
    startingPrice: "₹800/plate",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "Popular",
    categoryColor: "bg-gold",
  },
  {
    id: "photography",
    title: "Photography",
    description: "Capture memories with premium photographers specializing in weddings",
    startingPrice: "₹25,000",
    imageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "Trending",
    categoryColor: "bg-pink-500",
  },
  {
    id: "makeup",
    title: "Makeup & Mehendi",
    description: "Exclusive bridal and groom packages by top beauty professionals",
    startingPrice: "₹15,000",
    imageUrl: "https://images.unsplash.com/photo-1577036421869-7c8d388d2123?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "Exclusive",
    categoryColor: "bg-purple-500",
  },
];

export default function EventSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      const currentScroll = sliderRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleConnectVendor = (serviceId: string) => {
    // TODO: Implement vendor connection logic
    console.log(`Connecting to ${serviceId} vendor`);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-royal-blue to-blue-800 text-white" data-testid="event-slider-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold mb-4" data-testid="text-event-title">
            <span className="text-gold">Planora</span> Event Management
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8" data-testid="text-event-description">
            Your trusted partner for creating unforgettable wedding celebrations. From intimate ceremonies to grand receptions, 
            we connect you with the best vendors and venues across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">500+ Verified Vendors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">50+ Cities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm">1000+ Happy Couples</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto space-x-6 pb-6 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            data-testid="event-slider"
          >
            {eventServices.map((service) => (
              <Card 
                key={service.id} 
                className="flex-none w-80 bg-white text-charcoal shadow-xl card-hover"
                data-testid={`card-event-${service.id}`}
              >
                <div className="relative h-48">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    data-testid={`img-event-${service.id}`}
                  />
                  <div className={`absolute top-4 left-4 ${service.categoryColor} text-white px-3 py-1 rounded-full text-sm font-semibold`} data-testid={`tag-event-${service.id}`}>
                    {service.category}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-poppins font-semibold mb-3" data-testid={`text-event-title-${service.id}`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4" data-testid={`text-event-description-${service.id}`}>
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-royal-blue font-semibold" data-testid={`text-event-price-${service.id}`}>
                      Starting {service.startingPrice}
                    </span>
                    <Button
                      onClick={() => handleConnectVendor(service.id)}
                      className="bg-royal-blue text-white hover:bg-blue-700 transition-colors"
                      data-testid={`button-connect-${service.id}`}
                    >
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Slider Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              onClick={() => scroll('left')}
              variant="secondary"
              size="icon"
              className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all rounded-full"
              data-testid="button-slider-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => scroll('right')}
              variant="secondary"
              size="icon"
              className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all rounded-full"
              data-testid="button-slider-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Visit Planora Website Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gold text-royal-blue hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold"
              onClick={() => window.open('https://planora-ce3a5.web.app/', '_blank')}
              data-testid="button-visit-planora"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Visit Planora Website
            </Button>
            <p className="text-blue-100 text-sm mt-3">
              Explore our complete wedding planning platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
