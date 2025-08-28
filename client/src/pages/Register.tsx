import SimpleRegisterForm from '@/components/SimpleRegisterForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Register() {
  const handleSwitchToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SimpleRegisterForm onSwitchToLogin={handleSwitchToLogin} />
      <Footer />
    </div>
  );
}
