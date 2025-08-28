import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Find Your Perfect Match",
    subtitle: "Second Chance Matrimony",
    description: "Connect with amazing people who share your values. Whether you're single, divorced, widowed, or separated, your journey to love starts here.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
    buttonText: "Start Your Journey",
    buttonLink: "/profiles",
    icon: <Heart className="h-12 w-12 text-white" />,
    bgGradient: "from-royal-blue to-blue-800"
  },
  {
    id: 2,
    title: "Plan Your Dream Wedding",
    subtitle: "Planora Event Management",
    description: "From intimate ceremonies to grand celebrations, we help you create the perfect wedding experience with our trusted network of vendors.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
    buttonText: "Explore Services",
    buttonLink: "/events",
    icon: <Calendar className="h-12 w-12 text-white" />,
    bgGradient: "from-purple-600 to-pink-600"
  }
];

export default function HomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[500px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-white space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${slide.bgGradient}`}>
                      {slide.icon}
                    </div>
                    <span className="text-lg font-medium text-gray-200">{slide.subtitle}</span>
                  </div>
                  
                  <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                    {slide.title}
                  </h2>
                  
                  <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
                    {slide.description}
                  </p>
                  
                  <Button 
                    size="lg" 
                    className={`bg-gradient-to-r ${slide.bgGradient} hover:opacity-90 text-white px-8 py-3 text-lg font-semibold`}
                    onClick={() => {
                      console.log(`HomeSlider button clicked - navigating to ${slide.buttonLink}`);
                      window.location.href = slide.buttonLink;
                    }}
                  >
                    {slide.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Image/Visual Element */}
                <div className="hidden lg:block">
                  <div className={`w-full h-80 rounded-2xl bg-gradient-to-br ${slide.bgGradient} opacity-20`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ArrowRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
        <div 
          className="h-full bg-white transition-all duration-3000 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
