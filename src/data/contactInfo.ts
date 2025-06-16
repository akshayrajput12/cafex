// Contact information for CNC Coffee N Cravings
export const contactInfo = {
  name: 'CNC Coffee N Cravings',
  tagline: "India's Top Cafe",
  description: 'Premium coffee, delicious food, and beautiful ambiance in the heart of Jaipur',
  
  // Location details
  address: {
    street: 'Sirsi Road, Opposite Capital Gallery Mall',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302012',
    country: 'India',
    fullAddress: 'Sirsi Road, Opposite Capital Gallery Mall, Jaipur, Rajasthan 302012, India'
  },
  
  // Contact details
  phone: {
    primary: '+91-9876543210',
    secondary: '+91-9876543211',
    display: '+91 98765 43210'
  },
  
  email: {
    general: 'info@cnccoffee.com',
    reservations: 'reservations@cnccoffee.com',
    admin: 'admin@cnccoffee.com',
    support: 'support@cnccoffee.com'
  },
  
  // Operating hours
  hours: {
    weekdays: '8:00 AM - 11:00 PM',
    weekends: '8:00 AM - 11:00 PM',
    display: 'Mon-Sun: 8:00 AM - 11:00 PM',
    structured: 'Mo-Su 08:00-23:00'
  },
  
  // Social media
  social: {
    instagram: 'https://instagram.com/cnccoffeecravings',
    facebook: 'https://facebook.com/cnccoffeecravings',
    twitter: 'https://twitter.com/cnccoffee',
    youtube: 'https://youtube.com/@cnccoffeecravings',
    linkedin: 'https://linkedin.com/company/cnccoffeecravings'
  },
  
  // Location coordinates for maps
  coordinates: {
    latitude: 26.9124,
    longitude: 75.7873
  },
  
  // Website URLs
  website: {
    main: 'https://cnc-coffee-cravings.vercel.app',
    admin: 'https://cnc-coffee-cravings.vercel.app/admin'
  },
  
  // Business details
  business: {
    established: '2020',
    type: 'Restaurant & Cafe',
    cuisine: ['Coffee', 'Continental', 'Indian', 'Italian', 'Desserts', 'Beverages'],
    priceRange: '₹₹',
    capacity: 80,
    features: [
      'Premium Coffee',
      'Fresh Food',
      'Beautiful Ambiance',
      'Free WiFi',
      'Air Conditioning',
      'Outdoor Seating',
      'Private Events',
      'Takeaway',
      'Home Delivery'
    ]
  },
  
  // SEO and marketing
  seo: {
    keywords: [
      'CNC Coffee N Cravings',
      'Jaipur cafe',
      'best cafe Jaipur',
      'India top cafe',
      'Sirsi Road cafe',
      'Capital Gallery Mall',
      'premium coffee Jaipur',
      'restaurant Jaipur',
      'coffee shop Rajasthan',
      'aesthetic cafe Jaipur'
    ],
    description: "Experience India's top cafe at CNC Coffee N Cravings, Jaipur. Located on Sirsi Road opposite Capital Gallery Mall. Premium coffee, delicious food, beautiful ambiance, and exceptional service.",
    title: "CNC Coffee N Cravings - India's Top Cafe in Jaipur | Premium Coffee & Food"
  }
}

// Utility functions
export const getFullAddress = () => contactInfo.address.fullAddress

export const getPhoneNumber = () => contactInfo.phone.primary

export const getEmailAddress = () => contactInfo.email.general

export const getOperatingHours = () => contactInfo.hours.display

export const getGoogleMapsUrl = () => {
  const { latitude, longitude } = contactInfo.coordinates
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export const getDirectionsUrl = () => {
  const address = encodeURIComponent(contactInfo.address.fullAddress)
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`
}

export const getWhatsAppUrl = (message?: string) => {
  const phone = contactInfo.phone.primary.replace(/[^0-9]/g, '')
  const defaultMessage = `Hi! I'd like to make a reservation at CNC Coffee N Cravings.`
  const text = encodeURIComponent(message || defaultMessage)
  return `https://wa.me/${phone}?text=${text}`
}

export const getCallUrl = () => `tel:${contactInfo.phone.primary}`

export const getEmailUrl = (subject?: string) => {
  const defaultSubject = 'Inquiry - CNC Coffee N Cravings'
  const emailSubject = encodeURIComponent(subject || defaultSubject)
  return `mailto:${contactInfo.email.general}?subject=${emailSubject}`
}
