import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFirestore } from '../hooks/useFirestore';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const { data: services, loading: servicesLoading } = useFirestore('services');
  const { data: stylists, loading: stylistsLoading } = useFirestore('stylists');
  
  // Filter stylists based on selected service
  const filteredStylists = selectedService 
    ? stylists.filter(stylist => 
        stylist.services && stylist.services.includes(selectedService.name)
      )
    : stylists;

  // Debugging: Log the data to see what's happening
  console.log('Services:', services);
  console.log('Stylists:', stylists);
  console.log('Selected Service:', selectedService);
  console.log('Filtered Stylists:', filteredStylists);

  // Generate time slots (9:00 AM to 6:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 18) {
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Prefill personal info if user is logged in
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setPersonalInfo({
        name: user.displayName || '',
        email: user.email || '',
        phone: ''
      });
    }
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
    setStep(3);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError('');
    
    try {
      const user = auth.currentUser;
      const appointmentData = {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        stylistId: selectedStylist.id,
        stylistName: selectedStylist.name,
        date: selectedDate,
        time: selectedTime,
        clientName: personalInfo.name,
        clientEmail: personalInfo.email,
        clientPhone: personalInfo.phone,
        timestamp: new Date(),
        status: 'confirmed'
      };
      
      // Add clientId if user is logged in
      if (user) {
        appointmentData.clientId = user.uid;
      }
      
      await addDoc(collection(db, 'appointments'), appointmentData);
      
      setBookingSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setStep(1);
        setSelectedService(null);
        setSelectedStylist(null);
        setSelectedDate('');
        setSelectedTime('');
        setBookingSuccess(false);
      }, 5000);
    } catch (error) {
      setBookingError('Failed to book appointment. Please try again.');
      console.error('Error booking appointment: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-beige-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Schedule your visit with our expert stylists
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gold-500 -z-10 transition-all duration-500"
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-gold-500 text-black' : 'bg-white border-2 border-gray-300 text-gray-500'
                }`}>
                  {num}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-700">
                  {num === 1 && 'Service'}
                  {num === 2 && 'Stylist'}
                  {num === 3 && 'Date & Time'}
                  {num === 4 && 'Details'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
            
            {servicesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gold-500"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600 mt-2">{service.description}</p>
                      </div>
                      <div className="bg-gold-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                        ${service.price}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-500 text-sm">{service.duration} mins</span>
                      <span className="text-gray-500 text-sm">{service.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Select Stylist */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setStep(1)}
                className="mr-4 text-gold-500 hover:text-gold-600"
              >
                ← Back to Services
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Select a Stylist</h2>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Selected Service: {selectedService?.name}</h3>
            </div>
            
            {stylistsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Show filtered stylists if there are any, otherwise show all stylists */}
                {(filteredStylists.length > 0 ? filteredStylists : stylists).map((stylist) => (
                  <div
                    key={stylist.id}
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gold-500"
                    onClick={() => handleStylistSelect(stylist)}
                  >
                    <div className="flex items-center">
                      {stylist.image ? (
                        <img 
                          src={stylist.image} 
                          alt={stylist.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      )}
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">{stylist.name}</h3>
                        <p className="text-gold-500">{stylist.specialty}</p>
                        <p className="text-gray-600 text-sm mt-1">{stylist.workingHours}</p>
                      </div>
                    </div>
                    {stylist.services && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Specializes in:</h4>
                        <div className="flex flex-wrap gap-2">
                          {stylist.services.slice(0, 3).map((service, idx) => (
                            <span 
                              key={idx} 
                              className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setStep(2)}
                className="mr-4 text-gold-500 hover:text-gold-600"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedService?.name} with {selectedStylist?.name}
              </h3>
              <p className="text-gray-600">{selectedService?.duration} mins - ${selectedService?.price}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Select Date</h4>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
              
              {/* Time Selection */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Select Time</h4>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-gold-500 text-black'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      disabled={!selectedDate}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Personal Information */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setStep(3)}
                className="mr-4 text-gold-500 hover:text-gold-600"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Service:</span> {selectedService?.name}</p>
                <p><span className="font-medium">Stylist:</span> {selectedStylist?.name}</p>
                <p><span className="font-medium">Date:</span> {selectedDate}</p>
                <p><span className="font-medium">Time:</span> {selectedTime}</p>
                <p><span className="font-medium">Duration:</span> {selectedService?.duration} mins</p>
                <p><span className="font-medium">Price:</span> ${selectedService?.price}</p>
              </div>
            </div>
            
            {bookingSuccess && (
              <motion.div
                className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Appointment booked successfully! We've sent a confirmation to your email.
              </motion.div>
            )}
            
            {bookingError && (
              <motion.div
                className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {bookingError}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;