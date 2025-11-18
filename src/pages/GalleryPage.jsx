import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore } from '../hooks/useFirestore';

const GalleryPage = () => {
  // Fetch images from Firestore
  const { data: images, loading } = useFirestore('gallery');
  const [selectedImage, setSelectedImage] = useState(null);

  // Debug: Log images to check the data structure
  useEffect(() => {
    if (!loading && images) {
      console.log('Gallery images data:', images);
      images.forEach((image, index) => {
        console.log(`Image ${index} structure:`, image);
        console.log(`Image ${index} URL:`, image.url);
        console.log(`Image ${index} keys:`, Object.keys(image));
      });
    }
  }, [loading, images]);

  // Open modal when image is clicked
  const openModal = (image) => {
    setSelectedImage(image);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Handle broken images by replacing with a placeholder
  const handleImageError = (e) => {
    console.error('Image failed to load. URL:', e.target.src);
    e.target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  };

  // Function to get image URL with fallback
  const getImageUrl = (image) => {
    // Try different possible URL properties
    if (image.url) return image.url;
    if (image.imageUrl) return image.imageUrl;
    if (image.src) return image.src;
    if (image.image) return image.image;
    
    // If no URL found, return placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  };

  return (
    <div className="min-h-screen py-16 bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of stunning transformations and beautiful hairstyles
          </p>
        </div>

        {/* Debug information */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm">Loading: {loading ? 'Yes' : 'No'}</p>
          <p className="text-sm">Images count: {images ? images.length : 0}</p>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Render images if available */}
            {images && images.length > 0 ? (
              images.map((image, index) => {
                const imageUrl = getImageUrl(image);
                const hasValidUrl = imageUrl && imageUrl !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                
                return (
                  <motion.div
                    key={image.id || index} // Use index as fallback if id is missing
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => openModal(image)}
                  >
                    <div className="relative group h-64">
                      {/* Show URL for debugging */}
                      <div className="absolute top-0 left-0 z-10 bg-black/40/40 bg-opacity-50 text-white text-xs p-1 truncate w-full">
                        {hasValidUrl ? 'Valid URL' : 'No URL'}
                      </div>
                      
                      {/* Image with error handling */}
                      <img
                        src={imageUrl}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={handleImageError}
                        onLoad={() => console.log(`Image ${index} loaded successfully`)}
                      />
                      
                      {/* No URL indicator */}
                      {!hasValidUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-90">
                          <p className="text-gray-700 text-sm text-center px-4">No image URL available</p>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            className="h-10 w-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No gallery images available at the moment.</p>
                <p className="text-gray-400 mt-2">Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white bg-black/40 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300 z-10"
                onClick={closeModal}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal image */}
              <img
                src={getImageUrl(selectedImage)}
                alt={selectedImage.title || 'Gallery image'}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
              />

              {/* Modal image info */}
              {selectedImage.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 bg-opacity-50 text-white p-4">
                  <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                  {selectedImage.description && <p className="mt-2">{selectedImage.description}</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;