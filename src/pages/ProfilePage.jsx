import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { useFirestore } from '../hooks/useFirestore';
import { signOut } from 'firebase/auth';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const { data: appointments, loading: appointmentsLoading } = useFirestore('appointments', {
    filters: [{ field: 'clientId', operator: '==', value: user?.uid }]
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={handleSignOut}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">{user.displayName || 'User'}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-4 w-full">
                  <button className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium py-2 px-4 rounded-lg transition duration-300">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h2>
              
              {appointmentsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">You don't have any appointments yet.</p>
                  <button 
                    onClick={() => navigate('/booking')}
                    className="mt-4 bg-gold-500 hover:bg-gold-600 text-black font-medium py-2 px-6 rounded-lg transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{appointment.serviceName}</h3>
                          <p className="text-gray-600">with {appointment.stylistName}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm">
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                            <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm">
                              {appointment.time}
                            </span>
                            <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm">
                              ${appointment.servicePrice}
                            </span>
                          </div>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {appointment.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;