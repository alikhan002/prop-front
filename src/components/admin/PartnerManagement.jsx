import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'

const PartnerManagement = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    established: '',
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    phone: '',
    email: '',
    website: '',
    address: {
      street: '',
      city: '',
      country: '',
      zipCode: ''
    },
    specialties: '',
    awards: '',
    about: '',
    vision: '',
    mission: '',
    status: 'active',
    featured: false,
    rating: 0,
    logo: null,
    coverImage: null,
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await apiService.getPartners({ 
        status: 'all',
        limit: 1000 // Set high limit for admin panel to show all partners
      })
      if (response.partners) {
        setPartners(response.partners || [])
      } else {
        toast.error('Failed to fetch partners')
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      toast.error('Error fetching partners')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Check for duplicate partner name (only for new partners)
      if (!editingPartner) {
        const existingPartner = partners.find(partner => 
          partner.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
        )
        if (existingPartner) {
          toast.error(`Partner name "${formData.name}" already exists. Please choose a different name.`)
          return
        }
      }
      
      console.log('Form data being submitted:', formData)
      
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'logo' || key === 'coverImage') {
          // Only append files if they exist
          if (formData[key]) {
            submitData.append(key, formData[key])
          }
        } else if (key === 'address' || key === 'socialMedia') {
          // Stringify objects
          submitData.append(key, JSON.stringify(formData[key]))
        } else if (key === 'specialties' || key === 'awards') {
          // Handle comma-separated strings
          submitData.append(key, formData[key])
        } else {
          // Regular fields
          submitData.append(key, formData[key] || '')
        }
      })

      let response
      if (editingPartner) {
        response = await apiService.updatePartner(editingPartner._id, submitData)
      } else {
        response = await apiService.createPartner(submitData)
      }
      
      console.log('API Response:', response)

      if (response && response.success) {
        toast.success(`Partner ${editingPartner ? 'updated' : 'created'} successfully`)
        
        // Close form and refresh partners list
        setShowForm(false)
        setEditingPartner(null)
        resetForm()
        
        // Refresh the partners list
        await fetchPartners()
      } else {
        const errorMessage = response?.message || 'Failed to save partner'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error saving partner:', error)
      toast.error(error.message || 'Error saving partner. Please try again.')
    }
  }

  const handleEdit = (partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description,
      established: partner.established,
      totalProjects: partner.totalProjects,
      completedProjects: partner.completedProjects || 0,
      ongoingProjects: partner.ongoingProjects || 0,
      phone: partner.contact?.phone || '',
      email: partner.contact?.email || '',
      website: partner.contact?.website || '',
      address: partner.contact?.address || {
        street: '',
        city: '',
        country: '',
        zipCode: ''
      },
      specialties: partner.specialties ? partner.specialties.join(', ') : '',
      awards: partner.awards ? partner.awards.join(', ') : '',
      about: partner.about,
      vision: partner.vision || '',
      mission: partner.mission || '',
      status: partner.status,
      featured: partner.featured,
      rating: partner.rating || 0,
      logo: null,
      coverImage: null,
      socialMedia: partner.socialMedia || {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      }
    })
    setShowForm(true)
  }

  const handleDelete = async (partnerId) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) {
      return
    }

    try {
      const response = await apiService.deletePartner(partnerId)
      
      if (response.success) {
        toast.success('Partner deleted successfully')
        // Immediately remove partner from the list
        setPartners(prev => prev.filter(partner => partner._id !== partnerId))
      } else {
        toast.error(response.message || 'Failed to delete partner')
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
      toast.error('Error deleting partner')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      established: '',
      totalProjects: 0,
      completedProjects: 0,
      ongoingProjects: 0,
      phone: '',
      email: '',
      website: '',
      address: {
        street: '',
        city: '',
        country: '',
        zipCode: ''
      },
      specialties: '',
      awards: '',
      about: '',
      vision: '',
      mission: '',
      status: 'active',
      featured: false,
      rating: 0,
      logo: null,
      coverImage: null,
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      }
    })
  }

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.active
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Partner Management</h2>
          <p className="text-yellow-300/70 mt-1">Manage your business partners and collaborations</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingPartner(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Partner</span>
        </button>
      </div>

      {/* Partner Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-yellow-300 hover:text-yellow-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                      !editingPartner && formData.name && partners.find(partner => 
                        partner.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
                      ) 
                        ? 'border-red-400/50 focus:ring-red-400 focus:border-red-400' 
                        : 'border-yellow-400/30 focus:ring-yellow-400 focus:border-yellow-400'
                    }`}
                  />
                  {!editingPartner && formData.name && partners.find(partner => 
                    partner.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
                  ) && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      This partner name already exists
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Established *
                  </label>
                  <input
                    type="text"
                    name="established"
                    value={formData.established}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1995"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  About *
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Project Statistics */}
            <div className="border-b border-yellow-400/30 pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Project Statistics</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Total Projects
                  </label>
                  <input
                    type="number"
                    name="totalProjects"
                    value={formData.totalProjects}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Completed Projects
                  </label>
                  <input
                    type="number"
                    name="completedProjects"
                    value={formData.completedProjects}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Ongoing Projects
                  </label>
                  <input
                    type="number"
                    name="ongoingProjects"
                    value={formData.ongoingProjects}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-yellow-400/30 pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  Address
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="Zip Code"
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-b border-yellow-400/30 pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Additional Information</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Specialties (comma separated)
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleInputChange}
                    placeholder="Luxury Residential, Commercial, Mixed-Use"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Awards (comma separated)
                  </label>
                  <input
                    type="text"
                    name="awards"
                    value={formData.awards}
                    onChange={handleInputChange}
                    placeholder="Best Developer 2023, Excellence in Design"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Vision
                    </label>
                    <textarea
                      name="vision"
                      value={formData.vision}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-yellow-300 mb-1">
                      Mission
                    </label>
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border-b border-yellow-400/30 pb-6">
              <h4 className="text-md font-medium text-yellow-300 mb-4">Images</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Logo
                  </label>
                  {editingPartner && editingPartner.logo && (
                    <div className="mb-2">
                      <img 
                        src={`http://localhost:5003${editingPartner.logo}`} 
                        alt="Current Logo" 
                        className="w-20 h-20 object-cover rounded-lg border border-yellow-400/30"
                      />
                      <p className="text-xs text-yellow-300/70 mt-1">Current Logo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="logo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-xl px-4 py-3 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Cover Image
                  </label>
                  {editingPartner && editingPartner.coverImage && (
                    <div className="mb-2">
                      <img 
                        src={`http://localhost:5003${editingPartner.coverImage}`} 
                        alt="Current Cover" 
                        className="w-32 h-20 object-cover rounded-lg border border-yellow-400/30"
                      />
                      <p className="text-xs text-yellow-300/70 mt-1">Current Cover Image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="coverImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-md px-3 py-2 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-md px-3 py-2 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full bg-gray-900/50 border border-yellow-400/30 rounded-md px-3 py-2 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Featured Partner
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingPartner(null)
                  resetForm()
                }}
                className="px-8 py-3 border border-yellow-400/30 rounded-xl text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300 font-semibold flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={!editingPartner && formData.name && partners.find(partner => 
                  partner.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
                )}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center space-x-2 ${
                  !editingPartner && formData.name && partners.find(partner => 
                    partner.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
                  )
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{editingPartner ? 'Update' : 'Create'} Partner</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partners List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Partners ({partners.length})</h3>
          </div>
        </div>
        <div className="p-8">
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No partners found</div>
              <p className="text-yellow-300/60 mt-2">Add your first business partner to get started</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <div key={partner._id} className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-lg backdrop-blur-sm group">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {partner.logo ? (
                          <img
                            src={`http://localhost:5003${partner.logo}`}
                            alt={partner.name}
                            className="w-12 h-12 object-cover rounded-xl border border-yellow-400/20"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl flex items-center justify-center border border-yellow-400/20">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            partner.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {partner.status}
                          </span>
                          {partner.featured && (
                            <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-400 transition-colors">{partner.name}</h4>
                      <p className="text-yellow-200/70 text-sm mb-3 line-clamp-2">{partner.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-yellow-300/80">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Est. {partner.established}
                        </div>
                        
                        <div className="flex items-center text-yellow-300/80">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {partner.totalProjects || 0} Projects
                        </div>
                        
                        <div className="flex items-center text-yellow-300/80">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          {partner.rating || 0}/5 Rating
                        </div>
                        
                        {partner.contact?.email && (
                          <div className="flex items-center text-yellow-300/80">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {partner.contact.email}
                          </div>
                        )}
                        
                        {partner.contact?.website && (
                          <a
                            href={partner.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-yellow-400/10 mt-4">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all duration-300 hover:scale-110"
                        title="Edit partner"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(partner._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 hover:scale-110"
                        title="Delete partner"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartnerManagement