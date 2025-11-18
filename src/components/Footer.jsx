import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

const Footer = () => {
  const { data: settingsDocs, loading, error } = useFirestore('settings');
  const settings = settingsDocs?.[0] || {};
  
  // Handle loading state
  if (loading) {
    return (
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </footer>
    );
  }
  
  // Handle error state
  if (error) {
    console.error('Error loading settings:', error);
  }
  
  const footerLinks = [
    {
      title: 'Services',
      links: [
        { name: 'Haircuts', path: '/services' },
        { name: 'Coloring', path: '/services' },
        { name: 'Styling', path: '/services' },
        { name: 'Treatments', path: '/services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Team', path: '/stylists' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
      ],
    },
  ];

  // Format day names (e.g., "monday" -> "Monday")
  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-gold-500">{settings?.salonName || 'Luxury Salon'}</span>
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">
              {settings?.description || 'Experience luxury and elegance with our premium hair services. Our expert stylists are dedicated to bringing out your unique beauty.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gold-500 mr-3" />
                <span>{settings?.address || '123 Beauty Street, New York, NY 10001'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gold-500 mr-3" />
                <span>{settings?.phone || '(555) 123-4567'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gold-500 mr-3" />
                <span>{settings?.email || 'info@luxurysalon.com'}</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-gold-500">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-gold-500 transition duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold-500">Follow Us</h3>
            <div className="flex space-x-4">
              <a href={settings?.socialLinks?.facebook || '#'} className="text-gray-300 hover:text-gold-500 transition duration-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href={settings?.socialLinks?.instagram || '#'} className="text-gray-300 hover:text-gold-500 transition duration-300">
                <Instagram className="h-6 w-6" />
              </a>
              <a href={settings?.socialLinks?.whatsapp || '#'} className="text-gray-300 hover:text-gold-500 transition duration-300">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Opening Hours</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                {settings?.openingHours ? (
                  Object.entries(settings.openingHours).map(([day, hours]) => (
                    <li key={day}>{formatDayName(day)}: {hours}</li>
                  ))
                ) : (
                  <>
                    <li>Monday - Friday: 9am - 8pm</li>
                    <li>Saturday: 8am - 9pm</li>
                    <li>Sunday: 10am - 6pm</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.salonName || 'Luxury Salon'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;