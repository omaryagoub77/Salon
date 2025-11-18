# Luxury Salon - React + TailwindCSS + Firebase

A fully responsive, animated, modern hair salon website built with React, TailwindCSS, and Firebase.

## Features

- 🎨 **Luxurious Design**: Gold, black, beige, and white color scheme
- 📱 **Fully Responsive**: Mobile-first design with perfect responsiveness
- ✨ **Animations**: Smooth transitions and scroll-based effects with Framer Motion
- 🔥 **Firebase Integration**: Dynamic content from Firestore collections
- 🖼️ **Image Lazy Loading**: Optimized image loading for better performance

## Pages

1. **Home Page**
   - Animated hero section with headline "Your Style, Your Confidence"
   - Services carousel (dynamic from Firestore)
   - Testimonials slider (from Firestore)
   - Footer with info and social links

2. **Services Page**
   - Dynamic grid of services (1 col mobile, 2 tablet, 3-4 desktop)
   - Hover zoom and glow animations

3. **Booking Page**
   - Step-by-step form for appointments
   - Service selection, stylist selection, date/time picker
   - Personal info form with validation

4. **Stylists Page**
   - Stylist cards with specialties and working hours
   - "Book Now" buttons

5. **Gallery Page**
   - Responsive masonry grid
   - Modal pop-up for images

6. **About Page**
   - Salon story and values
   - Google Maps integration

7. **Contact Page**
   - Contact form with validation
   - Salon information and hours

8. **Client Login/Register**
   - Firebase Authentication
   - Profile page with booking history

## Firebase Collections

- `services` - Hair services with pricing and descriptions
- `stylists` - Salon stylists with bios and specialties
- `appointments` - Client appointments
- `reviews` - Customer testimonials
- `gallery` - Salon images
- `settings` - Salon information and hours
- `contacts` - Contact form submissions
- `clients` - Registered clients
- `users` - User authentication data

## Tech Stack

- **Frontend**: React 18, TailwindCSS, Framer Motion
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router v6
- **Icons**: Heroicons
- **Build Tool**: Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```