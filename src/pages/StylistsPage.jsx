import React from 'react';
import { motion } from 'framer-motion';
import { useFirestore } from '../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';

const StylistsPage = () => {
  const { data: stylists, loading } = useFirestore('stylists');
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking');
  };

  return (
    <div className="min-h-screen py-16 bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Stylists</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of expert stylists are dedicated to bringing out your unique beauty
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stylists.map((stylist, index) => (
              <motion.div
                key={stylist.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-64 bg-gray-200 relative">
                  {stylist.image ? (
                    <img 
                      src={stylist.image} 
                      alt={stylist.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{stylist.name}</h3>
                  <p className="text-gold-500 font-medium mb-3">{stylist.specialty}</p>
                  <p className="text-gray-600 mb-4 text-sm">{stylist.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {stylist.services?.map((service, idx) => (
                        <span 
                          key={idx} 
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Working Hours</p>
                      <p className="text-sm font-medium">{stylist.workingHours}</p>
                    </div>
                    <button 
                      className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-full text-sm font-medium transition duration-300"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StylistsPage;