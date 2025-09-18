import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiService from '../services/api.js'
// Using Unicode symbols instead of react-icons for now

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971',
    message: ''
  })

  const [counters, setCounters] = useState({
    properties: 0,
    clients: 0,
    experience: 0,
    awards: 0
  })
  const [exclusiveProperties, setExclusiveProperties] = useState([])
  const [offPlanProperties, setOffPlanProperties] = useState([])
  const [allExclusiveProperties, setAllExclusiveProperties] = useState([])
  const [allOffPlanProperties, setAllOffPlanProperties] = useState([])
  const [currentExclusiveIndex, setCurrentExclusiveIndex] = useState(0)
  const [currentOffPlanIndex, setCurrentOffPlanIndex] = useState(0)
  const [partnerDevelopers, setPartnerDevelopers] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0)
  const [services, setServices] = useState([])
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    title: '',
    message: ''
  })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState(null)
  const [userAvatar, setUserAvatar] = useState(null)
  
  // Background images for hero section
  const heroBackgrounds = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ]

  // Partner Developers Data
  const staticPartnerDevelopers = [
    { id: 1, name: 'Emaar Properties', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&crop=center', projects: 25 },
    { id: 2, name: 'Dubai Properties', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&crop=center', projects: 18 },
    { id: 3, name: 'Damac Properties', logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=100&fit=crop&crop=center', projects: 22 },
    { id: 4, name: 'Sobha Realty', logo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=100&fit=crop&crop=center', projects: 15 },
    { id: 5, name: 'Meraas', logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=100&fit=crop&crop=center', projects: 12 },
    { id: 6, name: 'Nakheel', logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=100&fit=crop&crop=center', projects: 20 }
  ]

  // Services Data
   const staticServices = [
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>,
      title: 'Property Sales',
      description: 'Expert guidance in buying and selling luxury properties with personalized service'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>,
      title: 'Property Management',
      description: 'Comprehensive property management services ensuring maximum returns on investment'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>,
      title: 'Investment Advisory',
      description: 'Strategic investment advice to help you make informed decisions in Dubai real estate'
    },
    {
      icon: <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>,
      title: 'Concierge Services',
      description: 'Premium concierge services for all your luxury lifestyle and property needs'
    }
  ]


  // Testimonials Data
  const staticTestimonials = [
    {
      id: 1,
      name: 'Ahmed Al Mansouri',
      role: 'CEO, Al Mansouri Holdings',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      text: 'AMZ Properties delivered exceptional service in finding our dream home. Their expertise in luxury properties is unmatched.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'International Investor',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      text: 'Professional, reliable, and truly understands the luxury market. Highly recommend for premium property investments.',
      rating: 5
    },
    {
      id: 3,
      name: 'Mohammed Hassan',
      role: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      text: 'Outstanding experience from start to finish. AMZ Properties made our property purchase seamless and stress-free.',
      rating: 5
    }
  ]

  // Blog Posts Data
  const staticBlogPosts = [
    {
      id: 1,
      title: 'Dubai Real Estate Market Trends 2024',
      excerpt: 'Discover the latest trends shaping Dubai\'s luxury property market and investment opportunities.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
      date: '2024-01-15',
      category: 'Market Analysis'
    },
    {
      id: 2,
      title: 'Investment Guide: Off-Plan Properties',
      excerpt: 'Everything you need to know about investing in off-plan properties in the UAE.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      date: '2024-01-10',
      category: 'Investment'
    },
    {
      id: 3,
      title: 'Luxury Living: Premium Amenities Guide',
      excerpt: 'Explore the world-class amenities that define luxury living in Dubai\'s premium developments.',
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=250&fit=crop',
      date: '2024-01-05',
      category: 'Lifestyle'
    }
  ]
  
  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length)
    }, 5000) // Change every 5 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  // Animated counters
  useEffect(() => {
    const targets = { properties: 500, clients: 1200, experience: 15, awards: 25 }
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps
    
    const intervals = Object.keys(targets).map(key => {
      let current = 0
      const increment = targets[key] / steps
      
      const intervalId = setInterval(() => {
        current += increment
        if (current >= targets[key]) {
          current = targets[key]
          clearInterval(intervalId)
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, stepDuration)
      
      return intervalId
    })
    
    return () => intervals.forEach(clearInterval)
  }, [])

  // Fetch approved reviews from API
  const fetchApprovedReviews = async () => {
    try {
      const data = await apiService.getReviews({ status: 'approved', limit: 10 })
      if (data.success && data.data) {
        const apiReviews = data.data.map(review => ({
          id: review._id,
          name: review.name,
          role: review.title || 'Valued Client',
          text: review.message,
          rating: review.rating,
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' // Default avatar
        }))
        
        // Combine API reviews with static testimonials as fallback
        const allReviews = apiReviews.length > 0 ? apiReviews : staticTestimonials
        setTestimonials(allReviews)
      } else {
        // Fallback to static testimonials
        setTestimonials(staticTestimonials)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Fallback to static testimonials
      setTestimonials(staticTestimonials)
    }
  }

  // Generate avatar for user based on name
  const generateAvatar = (name) => {
    if (!name) return null
    
    const initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('')
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-green-500 to-green-700', 
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-red-500 to-red-700',
      'bg-gradient-to-br from-yellow-500 to-yellow-700',
      'bg-gradient-to-br from-pink-500 to-pink-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-teal-500 to-teal-700'
    ]
    
    const colorIndex = name.charCodeAt(0) % colors.length
    
    return {
      initials: initials.slice(0, 2),
      colorClass: colors[colorIndex]
    }
  }

  // Fetch partners from API
  const fetchPartners = async () => {
    try {
      const result = await apiService.getPartners({ limit: 1000 })
      const data = result.partners || []
      if (Array.isArray(data) && data.length > 0) {
        // Transform API data to match frontend format
        const transformedPartners = data
          .filter(partner => partner.status === 'active')
          .map(partner => ({
            id: partner._id,
            name: partner.name,
            logo: partner.logo || 'https://via.placeholder.com/200x100/d97706/000000?text=' + partner.name.replace(/\s+/g, '+'),
            projects: partner.totalProjects || 0,
            description: partner.description
          }))
        setPartnerDevelopers(transformedPartners)
      } else {
        // Fallback to static data if no partners found
        setPartnerDevelopers(staticPartnerDevelopers)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      // Fallback to static data if API fails
      setPartnerDevelopers(staticPartnerDevelopers)
    }
  }

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const result = await apiService.getBlogs({ status: 'published', limit: 1000 })
      if (result.blogs && Array.isArray(result.blogs)) {
        setAllBlogs(result.blogs)
        setBlogPosts(result.blogs.slice(0, 3))
      } else {
        // Fallback to static data if API fails
        setAllBlogs(staticBlogPosts)
        setBlogPosts(staticBlogPosts.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      // Fallback to static data if API fails
      setAllBlogs(staticBlogPosts)
      setBlogPosts(staticBlogPosts.slice(0, 3))
    }
  }

  // Blog navigation functions
  const nextBlogs = () => {
    if (currentBlogIndex + 3 < allBlogs.length) {
      const newIndex = currentBlogIndex + 3
      setCurrentBlogIndex(newIndex)
      setBlogPosts(allBlogs.slice(newIndex, newIndex + 3))
    }
  }

  const prevBlogs = () => {
    if (currentBlogIndex > 0) {
      const newIndex = Math.max(0, currentBlogIndex - 3)
      setCurrentBlogIndex(newIndex)
      setBlogPosts(allBlogs.slice(newIndex, newIndex + 3))
    }
  }

  // Exclusive Properties navigation functions
  const nextExclusiveProperties = () => {
    if (currentExclusiveIndex + 3 < allExclusiveProperties.length) {
      const newIndex = currentExclusiveIndex + 3
      setCurrentExclusiveIndex(newIndex)
      setExclusiveProperties(allExclusiveProperties.slice(newIndex, newIndex + 3))
    }
  }

  const prevExclusiveProperties = () => {
    if (currentExclusiveIndex > 0) {
      const newIndex = Math.max(0, currentExclusiveIndex - 3)
      setCurrentExclusiveIndex(newIndex)
      setExclusiveProperties(allExclusiveProperties.slice(newIndex, newIndex + 3))
    }
  }

  // Off-Plan Properties navigation functions
  const nextOffPlanProperties = () => {
    if (currentOffPlanIndex + 3 < allOffPlanProperties.length) {
      const newIndex = currentOffPlanIndex + 3
      setCurrentOffPlanIndex(newIndex)
      setOffPlanProperties(allOffPlanProperties.slice(newIndex, newIndex + 3))
    }
  }

  const prevOffPlanProperties = () => {
    if (currentOffPlanIndex > 0) {
      const newIndex = Math.max(0, currentOffPlanIndex - 3)
      setCurrentOffPlanIndex(newIndex)
      setOffPlanProperties(allOffPlanProperties.slice(newIndex, newIndex + 3))
    }
  }

  // Property click handler
  const handlePropertyClick = (property) => {
    navigate(`/property/${property._id || property.id}`)
  }

  // Initialize data
  useEffect(() => {
    fetchPartners()
    fetchApprovedReviews()
    fetchBlogs()
    setServices(staticServices)
  }, [])

  // Refresh blogs when window gains focus (user returns from admin panel)
  useEffect(() => {
    const handleFocus = () => {
      fetchBlogs()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials])

  // Fetch properties from static API service
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await apiService.getProperties()
        if (result.success && Array.isArray(result.data)) {
          const exclusive = result.data.filter(property => property.type === 'exclusive')
          const offPlan = result.data.filter(property => property.type === 'off-plan')
          setAllExclusiveProperties(exclusive)
          setAllOffPlanProperties(offPlan)
          setExclusiveProperties(exclusive.slice(0, 3))
          setOffPlanProperties(offPlan.slice(0, 3))
        } else {
          // Fallback to static data if data is not an array
          setAllExclusiveProperties(staticExclusiveProperties)
          setAllOffPlanProperties(staticOffPlanProperties)
          setExclusiveProperties(staticExclusiveProperties.slice(0, 3))
          setOffPlanProperties(staticOffPlanProperties.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
        // Fallback to static data if API fails
        setAllExclusiveProperties(staticExclusiveProperties)
        setAllOffPlanProperties(staticOffPlanProperties)
        setExclusiveProperties(staticExclusiveProperties.slice(0, 3))
        setOffPlanProperties(staticOffPlanProperties.slice(0, 3))
      }
    }
    
    fetchProperties()
  }, [])

  // Form handling functions
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await apiService.submitContactForm(formData)
      if (result.success) {
        alert('Message sent successfully!')
        setFormData({ name: '', email: '', phone: '', countryCode: '+971', message: '' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    }
  }

  const handleDeveloperClick = (developerId) => {
    // Navigate to partner detail page
    // For database partners, use their _id, for static partners use their id
    window.location.href = `/partner/${developerId}`
  }

  // Review form handling functions
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target
    setReviewForm(prev => ({ ...prev, [name]: value }))
    
    // Update avatar when name changes
    if (name === 'name') {
      setUserAvatar(generateAvatar(value))
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Review form submission started:', reviewForm)
    
    // Validation
    if (!reviewForm.name || !reviewForm.email || !reviewForm.rating || !reviewForm.title || !reviewForm.message) {
      console.log('Validation failed: Missing required fields')
      setReviewMessage({
        type: 'error',
        text: 'Please fill in all required fields and select a rating.'
      })
      return
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      console.log('Validation failed: Invalid rating')
      setReviewMessage({
        type: 'error',
        text: 'Please select a rating between 1 and 5 stars.'
      })
      return
    }

    console.log('Validation passed, submitting review...')
    setReviewSubmitting(true)
    setReviewMessage(null)

    try {
      console.log('Submitting review via static API service')
      const data = await apiService.submitReview(reviewForm)
      console.log('API response data:', data)

      if (data.success) {
        console.log('Review submitted successfully')
        setReviewMessage({
          type: 'success',
          text: 'Thank you for your review! It has been submitted for approval and will be published soon.'
        })
        // Reset form
        setReviewForm({
          name: '',
          email: '',
          phone: '',
          rating: 0,
          title: '',
          message: ''
        })
        // Reset avatar
        setUserAvatar(null)
        // Refresh testimonials to show any newly approved reviews
        fetchApprovedReviews()
      } else {
        console.log('Review submission failed:', data)
        setReviewMessage({
          type: 'error',
          text: data.message || 'Error submitting review. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setReviewMessage({
        type: 'error',
        text: 'Error submitting review. Please check your connection and try again.'
      })
    } finally {
      setReviewSubmitting(false)
    }
  }

  const countryCodes = [
    { code: '+971', country: 'UAE' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+966', country: 'Saudi Arabia' }
  ]


  
  // Static Exclusive Properties Data (fallback)
  const staticExclusiveProperties = [
    {
      id: 1,
      title: 'Luxury Villa',
      price: 'FROM AED 7,500,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Jumeirah Village Triangle',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Premium Penthouse',
      price: 'FROM AED 35,000,000',
      bedrooms: 7,
      bathrooms: 7,
      location: 'Al Manara',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Modern Apartment',
      price: 'FROM AED 2,400,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Mohammad Bin Rashid City',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Studio Apartment',
      price: 'FROM AED 1,850,000',
      bedrooms: 1,
      bathrooms: 1,
      location: 'Mohammad Bin Rashid City',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Waterfront Villa',
      price: 'FROM AED 3,200,000',
      bedrooms: 4,
      bathrooms: 4,
      location: 'Damac Lagoons',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Modern Studio',
      price: 'FROM AED 1,280,000',
      bedrooms: 2,
      bathrooms: 2,
      location: 'Dubai Studio City',
      badge: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]

  // Static Off-Plan Properties Data (fallback)
  const staticOffPlanProperties = [
    {
      id: 7,
      title: 'Luxury Apartments',
      price: 'FROM AED 2,100,000',
      bedrooms: '1 2 3',
      location: 'Mina Rashid',
      developer: 'Emaar Properties',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 8,
      title: 'Studio & Apartments',
      price: 'FROM AED 748,000',
      bedrooms: 'Studio 1 2',
      location: 'Majan',
      developer: 'Meraki Developers',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 9,
      title: 'Premium Villas',
      price: 'FROM AED 4,100,000',
      bedrooms: '1 2 3 4',
      location: 'Palm Jumeirah',
      developer: 'Beyond Development',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 10,
      title: 'Waterfront Apartments',
      price: 'FROM AED 1,910,000',
      bedrooms: '1 2 3',
      location: 'Dubai Creek Harbour',
      developer: 'Emaar Properties',
      badge: 'Off Plan',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]



  const achievements = [
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-luxury-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      ), 
      number: counters.properties, 
      label: 'Premium Properties', 
      suffix: '+' 
    },
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-luxury-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.4"/>
          </svg>
        </div>
      ), 
      number: counters.clients, 
      label: 'Happy Clients', 
      suffix: '+' 
    },
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v2m0 8v2m6-6h-2m-8 0H6" stroke="currentColor" opacity="0.5"/>
          </svg>
        </div>
      ), 
      number: counters.experience, 
      label: 'Years Experience', 
      suffix: '+' 
    },
    { 
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-gold-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            <circle cx="12" cy="12" r="2" fill="white" opacity="0.3"/>
          </svg>
        </div>
      ), 
      number: counters.awards, 
      label: 'Awards Won', 
      suffix: '+' 
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Search */}
      <section className="relative min-h-screen text-white overflow-hidden">
        {/* Background Images */}
        {heroBackgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 sm:bg-black/65"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-600/60 to-gold-600/60 sm:from-luxury-600/40 sm:to-gold-600/40"></div>
        
        {/* Background Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroBackgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBgIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBgIndex 
                  ? 'bg-gold-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        
        <div className="relative container mx-auto px-4 py-12 sm:py-20 flex flex-col justify-center min-h-screen">
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <span className="text-gold-400 font-medium tracking-wider uppercase text-sm sm:text-lg mb-4 block">Welcome to AMZ Properties</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 font-serif bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent leading-tight">
                Dubai's Premier<br className="hidden sm:block" /><span className="sm:hidden"> </span>Luxury Real Estate
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4 sm:px-0">
                Discover exceptional properties in the world's most prestigious locations. 
                We specialize in exclusive luxury real estate that defines sophisticated living.
              </p>
            </div>
            
            {/* Property Search */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-white/20 mx-4 sm:mx-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-gold-200">Find Your Dream Luxury Property</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Enter project name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm sm:text-base"
                />
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-luxury-600 to-gold-500 text-white rounded-xl font-semibold hover:from-luxury-700 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Developers Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black border-t border-gold-500/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Trusted Partners</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold-400 mb-4 sm:mb-6 font-serif px-4 sm:px-0">Our Partner Developers</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">Collaborating with Dubai's most prestigious developers to bring you exceptional properties</p>
          </div>
          
          {/* Animated Logo Slider */}
          <div className="relative">
            <div className="flex animate-scroll-left">
              {/* First set of logos */}
              {partnerDevelopers.map((developer) => (
                <div 
                  key={`first-${developer.id}`}
                  onClick={() => handleDeveloperClick(developer.id)}
                  className="flex-shrink-0 mx-8 luxury-card p-6 text-center cursor-pointer group hover:scale-105 transition-all duration-300 w-48"
                >
                  <div className="relative w-full h-20 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gold-600/20 to-gold-400/20 flex items-center justify-center">
                    <img 
                      src={developer.logo} 
                      alt={developer.name}
                      className="w-full h-full object-cover group-hover:brightness-110 group-hover:scale-110 transition-all duration-300"
                      onLoad={(e) => {
                        e.target.parentElement.classList.remove('bg-gradient-to-br', 'from-gold-600/20', 'to-gold-400/20');
                      }}
                      onError={(e) => {
                        console.log('Image failed to load:', developer.logo);
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-gold-400 text-xs font-semibold';
                        fallback.textContent = developer.name;
                        e.target.parentElement.appendChild(fallback);
                      }}
                    />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{developer.name}</h3>
                  <p className="text-gold-400 text-xs">{developer.projects} Projects</p>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partnerDevelopers.map((developer) => (
                <div 
                  key={`second-${developer.id}`}
                  onClick={() => handleDeveloperClick(developer.id)}
                  className="flex-shrink-0 mx-8 luxury-card p-6 text-center cursor-pointer group hover:scale-105 transition-all duration-300 w-48"
                >
                  <div className="relative w-full h-20 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gold-600/20 to-gold-400/20 flex items-center justify-center">
                    <img 
                      src={developer.logo} 
                      alt={developer.name}
                      className="w-full h-full object-cover group-hover:brightness-110 group-hover:scale-110 transition-all duration-300"
                      onLoad={(e) => {
                        e.target.parentElement.classList.remove('bg-gradient-to-br', 'from-gold-600/20', 'to-gold-400/20');
                      }}
                      onError={(e) => {
                        console.log('Image failed to load:', developer.logo);
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-gold-400 text-xs font-semibold';
                        fallback.textContent = developer.name;
                        e.target.parentElement.appendChild(fallback);
                      }}
                    />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{developer.name}</h3>
                  <p className="text-gold-400 text-xs">{developer.projects} Projects</p>
                </div>
              ))}
            </div>
            
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
          </div>
          
          {/* Static grid for mobile fallback */}
          <div className="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-12 px-2 sm:px-4">
            {partnerDevelopers.map((developer) => (
              <div 
                key={`mobile-${developer.id}`}
                onClick={() => handleDeveloperClick(developer.id)}
                className="luxury-card p-3 sm:p-4 md:p-5 text-center cursor-pointer group hover:scale-105 transition-all duration-300"
              >
                <img 
                  src={developer.logo} 
                  alt={developer.name}
                  className="w-full h-8 sm:h-10 md:h-12 object-contain mb-2 sm:mb-3 filter brightness-0 invert group-hover:filter-none transition-all duration-300"
                />
                <h3 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{developer.name}</h3>
                <p className="text-gold-400 text-xs">{developer.projects} Projects</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Properties Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Premium Collection</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold-400 mb-4 sm:mb-6 font-serif px-4 sm:px-0">Exclusive Properties with AMZ Properties</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">Discover our handpicked selection of Dubai's most prestigious properties</p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            {allExclusiveProperties.length > 3 && (
              <>
                <button 
                  onClick={prevExclusiveProperties}
                  disabled={currentExclusiveIndex === 0}
                  className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-gold-500/20 hover:bg-gold-500/40 text-gold-400 hover:text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={nextExclusiveProperties}
                  disabled={currentExclusiveIndex + 3 >= allExclusiveProperties.length}
                  className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-gold-500/20 hover:bg-gold-500/40 text-gold-400 hover:text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4">
            {exclusiveProperties.map((property, index) => (
              <div key={property.id} onClick={() => handlePropertyClick(property)} className="group luxury-card overflow-hidden w-full h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 animate-fade-in cursor-pointer" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  
                  {/* Property Badge */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <span className="bg-gold-500/90 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {property.type === 'exclusive' ? 'Exclusive' : property.badge || 'Exclusive'}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                    <span className="bg-black/70 text-gold-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm">
                      {property.price}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                    {property.title}
                  </h3>
                  
                  {/* Property Details */}
                  <div className="flex flex-wrap items-center text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm gap-2 sm:gap-0">
                    <div className="flex items-center mr-2 sm:mr-4">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                      </svg>
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center mr-2 sm:mr-4">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                      </svg>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span>{property.area}</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 flex-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{property.location}</span>
                  </div>
                  
                  {/* View Details Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gold-400 text-xs sm:text-sm font-semibold group-hover:text-gold-300 transition-all duration-300 transform group-hover:translate-x-2">
                      <span>View Details</span>
                      <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    
                    {/* Property Type */}
                    <div className="text-gray-500 text-xs uppercase tracking-wider">
                      Premium
                    </div>
                  </div>
                </div>
                
                {/* Bottom Border Animation */}
                <div className="h-1 bg-gradient-to-r from-gold-500 to-gold-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Off-Plan Properties Section */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Future Investments</span>
            <h2 className="text-5xl font-bold text-gold-400 mb-6 font-serif animate-slide-up">Off-Plan Properties</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>Secure your future with Dubai's most promising upcoming developments</p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            {allOffPlanProperties.length > 3 && (
              <>
                <button 
                  onClick={prevOffPlanProperties}
                  disabled={currentOffPlanIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={nextOffPlanProperties}
                  disabled={currentOffPlanIndex + 3 >= allOffPlanProperties.length}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 hover:text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {offPlanProperties.map((property, index) => (
              <div key={property.id} onClick={() => handlePropertyClick(property)} className="group luxury-card overflow-hidden w-full h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 animate-fade-in cursor-pointer" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                  
                  {/* Property Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                      {property.type === 'off-plan' ? 'Off-Plan' : property.badge || 'Off-Plan'}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/70 text-gold-400 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                      {property.price}
                    </span>
                  </div>
                  
                  {/* Completion Status */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                    {property.title}
                  </h3>
                  
                  {/* Property Details */}
                  <div className="flex items-center text-gray-300 mb-4 text-sm">
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z" />
                      </svg>
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                      </svg>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span>{property.area}</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{property.location}</span>
                  </div>
                  
                  {/* Developer */}
                  {property.developer && (
                    <div className="flex items-center text-gray-400 text-sm mb-6 flex-1">
                      <svg className="w-4 h-4 mr-2 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Developer: {property.developer}</span>
                    </div>
                  )}
                  
                  {/* Reserve Now Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-gold-400 text-sm font-semibold group-hover:text-gold-300 transition-all duration-300 transform group-hover:translate-x-2">
                      <span>Reserve Now</span>
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    
                    {/* Investment Type */}
                    <div className="text-gray-500 text-xs uppercase tracking-wider">
                      Investment
                    </div>
                  </div>
                </div>
                
                {/* Bottom Border Animation */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black/90 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Premium Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Exceptional Service Excellence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tailored luxury real estate services designed for discerning clients who demand nothing but the finest
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={service.title} className="luxury-card text-center p-8 group hover:scale-105 transition-all duration-500">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-serif group-hover:text-gold-400 transition-colors">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews/Testimonials Section */}
      <section className="py-20 bg-black/90 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Client Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">What Our Clients Say</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover why our clients trust us with their most important real estate decisions
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Main Testimonial Display */}
            <div className="bg-gradient-to-br from-luxury-900/50 to-black/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gold-500/20 shadow-2xl">
              <div className="text-center">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                
                {/* Testimonial Content */}
                <div className="mb-8">
                  <p className="text-xl md:text-2xl text-white leading-relaxed mb-6 font-light italic">
                    "{testimonials[activeTestimonial]?.text}"
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-gold-400 mx-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                
                {/* Client Info */}
                <div className="flex items-center justify-center">
                  {(() => {
                    const avatar = generateAvatar(testimonials[activeTestimonial]?.name)
                    return avatar ? (
                      <div className={`w-16 h-16 rounded-full ${avatar.colorClass} flex items-center justify-center text-white font-bold text-lg border-2 border-gold-400 mr-4 shadow-lg`}>
                        {avatar.initials}
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 border-2 border-gold-400 mr-4 shadow-lg">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )
                  })()}
                  <div className="text-left">
                    <h4 className="text-white font-semibold text-lg">{testimonials[activeTestimonial]?.name}</h4>
                    <p className="text-gold-400 text-sm">{testimonials[activeTestimonial]?.role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-gold-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gold-500/20 hover:bg-gold-500/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-gold-500/30"
            >
              <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gold-500/20 hover:bg-gold-500/40 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-gold-500/30"
            >
              <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          

        </div>
      </section>

      {/* User Review Submission Section */}
      <section className="py-20 bg-gradient-to-b from-black/95 to-black border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Share Your Experience</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Write a Review</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Help others by sharing your experience with AMZ Properties</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleReviewSubmit} className="luxury-card p-8 md:p-12">
              {/* User Avatar Section */}
              <div className="flex justify-center mb-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {userAvatar ? (
                      <div className={`w-20 h-20 rounded-full ${userAvatar.colorClass} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-gold-400/20`}>
                        {userAvatar.initials}
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 shadow-lg ring-4 ring-gold-400/20">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gold-400 text-sm mt-3 font-medium">
                    {reviewForm.name ? `${reviewForm.name}'s Review` : 'Your Profile'}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Name Field */}
                <div>
                  <label htmlFor="reviewName" className="block text-gold-400 font-medium mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="reviewName"
                    name="name"
                    value={reviewForm.name}
                    onChange={handleReviewInputChange}
                    required
                    className="w-full px-4 py-3 !bg-dark-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="reviewEmail" className="block text-gold-400 font-medium mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="reviewEmail"
                    name="email"
                    value={reviewForm.email}
                    onChange={handleReviewInputChange}
                    required
                    className="w-full px-4 py-3 !bg-dark-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="reviewPhone" className="block text-gold-400 font-medium mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="reviewPhone"
                    name="phone"
                    value={reviewForm.phone}
                    onChange={handleReviewInputChange}
                    className="w-full px-4 py-3 !bg-dark-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Rating Field */}
                <div>
                  <label className="block text-gold-400 font-medium mb-3">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className={`w-8 h-8 transition-all duration-200 ${
                          star <= reviewForm.rating 
                            ? 'text-gold-400 scale-110' 
                            : 'text-gray-600 hover:text-gold-400/50'
                        }`}
                      >
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    ))}
                    <span className="ml-3 text-gray-300">
                      {reviewForm.rating > 0 ? `${reviewForm.rating} star${reviewForm.rating > 1 ? 's' : ''}` : 'Select rating'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-8">
                <label htmlFor="reviewTitle" className="block text-gold-400 font-medium mb-3">
                  Review Title *
                </label>
                <input
                  type="text"
                  id="reviewTitle"
                  name="title"
                  value={reviewForm.title}
                  onChange={handleReviewInputChange}
                  required
                  className="w-full px-4 py-3 !bg-dark-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all duration-300"
                  placeholder="Give your review a title"
                />
              </div>

              {/* Review Message */}
              <div className="mb-8">
                <label htmlFor="reviewMessage" className="block text-gold-400 font-medium mb-3">
                  Your Review *
                </label>
                <textarea
                  id="reviewMessage"
                  name="message"
                  value={reviewForm.message}
                  onChange={handleReviewInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 !bg-dark-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all duration-300 resize-none"
                  placeholder="Share your experience with AMZ Properties..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="group relative overflow-hidden bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:via-gold-300 hover:to-gold-400 text-black font-bold py-4 px-12 rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                >
                  {/* Animated Background Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center text-lg font-semibold">
                    {reviewSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="animate-pulse">Submitting Review...</span>
                      </>
                    ) : (
                      <>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">Submit Review</span>
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </>
                    )}
                  </span>
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 bg-white/30 animate-ping"></div>
                </button>
              </div>

              {/* Success/Error Messages */}
              {reviewMessage && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
                  reviewMessage.type === 'success' 
                    ? 'bg-green-900/50 border border-green-500/30 text-green-400' 
                    : 'bg-red-900/50 border border-red-500/30 text-red-400'
                }`}>
                  {reviewMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Our Achievements</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">Excellence in Numbers</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Our track record speaks for itself - delivering exceptional results for our clients</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={achievement.label} className="luxury-card text-center p-8 group hover:scale-105 transition-all duration-500">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {achievement.icon}
                </div>
                <div className="text-4xl font-bold text-gold-400 mb-2">
                  {achievement.number}{achievement.suffix}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">{achievement.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-black/95 border-t border-gold-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-medium tracking-wider uppercase text-sm mb-4 block">Latest Insights</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-6 font-serif">From Our Blog</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Stay updated with the latest trends and insights in Dubai's luxury real estate market</p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            {allBlogs.length > 3 && (
              <>
                <button
                  onClick={prevBlogs}
                  disabled={currentBlogIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full border-2 border-gold-500 flex items-center justify-center transition-all duration-300 ${
                    currentBlogIndex === 0 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                      : 'bg-black/80 text-gold-400 hover:bg-gold-500 hover:text-black hover:scale-110'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextBlogs}
                  disabled={currentBlogIndex + 3 >= allBlogs.length}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full border-2 border-gold-500 flex items-center justify-center transition-all duration-300 ${
                    currentBlogIndex + 3 >= allBlogs.length 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                      : 'bg-black/80 text-gold-400 hover:bg-gold-500 hover:text-black hover:scale-110'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4">
            {blogPosts.map((post) => (
              <Link key={post._id || post.id} to={`/blog/${post._id || post.id}`} className="block h-full">
                <article className="luxury-card overflow-hidden group cursor-pointer h-full flex flex-col transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image ? `http://localhost:5003${post.image}` : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'} 
                      alt={post.title}
                      className="w-full h-48 sm:h-52 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                      <span className="bg-gold-500/90 text-black px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                    
                    {/* Date Badge */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-black/70 text-gold-400 px-2 sm:px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : (post.date || new Date(post.createdAt).toLocaleDateString())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors duration-300 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 sm:mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More Button */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-gold-400 text-xs sm:text-sm font-semibold group-hover:text-gold-300 transition-all duration-300 transform group-hover:translate-x-2">
                        <span>Read Article</span>
                        <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      {/* Reading Time Estimate */}
                      <div className="text-gray-500 text-xs">
                        {Math.ceil((post.excerpt?.length || 100) / 200)} min read
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Border Animation */}
                  <div className="h-1 bg-gradient-to-r from-gold-500 to-gold-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </article>
              </Link>
            ))}
            </div>
            
            {/* Pagination Indicators */}
            {allBlogs.length > 3 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(allBlogs.length / 3) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const newIndex = i * 3
                      setCurrentBlogIndex(newIndex)
                      setBlogPosts(allBlogs.slice(newIndex, newIndex + 3))
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      Math.floor(currentBlogIndex / 3) === i 
                        ? 'bg-gold-400 scale-125' 
                        : 'bg-gray-600 hover:bg-gold-400/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


    </div>
  )
}

export default Home