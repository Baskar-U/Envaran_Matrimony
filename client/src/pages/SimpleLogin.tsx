import SimpleLoginForm from '@/components/SimpleLoginForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function SimpleLogin() {
  const handleSwitchToRegister = () => {
            window.location.href = '/registration';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SimpleLoginForm onSwitchToRegister={handleSwitchToRegister} />
      <Footer />
    </div>
  );
}
