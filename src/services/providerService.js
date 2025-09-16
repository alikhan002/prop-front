// Provider Service for handling external data feeds
// Supports Behomes, Really.AI, and other property providers

class ProviderService {
  constructor() {
    this.providers = {
      behomes: {
        name: 'Behomes',
        apiUrl: (typeof process !== 'undefined' && process.env?.REACT_APP_BEHOMES_API_URL) || 'https://api.behomes.com',
        apiKey: (typeof process !== 'undefined' && process.env?.REACT_APP_BEHOMES_API_KEY) || null,
        enabled: true
      },
      reallyAI: {
        name: 'Really.AI',
        apiUrl: (typeof process !== 'undefined' && process.env?.REACT_APP_REALLY_AI_API_URL) || 'https://api.really.ai',
        apiKey: (typeof process !== 'undefined' && process.env?.REACT_APP_REALLY_AI_API_KEY) || null,
        enabled: true
      }
    }
  }

  // Normalize property data from different providers
  normalizePropertyData(property, provider) {
    const baseStructure = {
      id: property.id || property._id,
      title: property.title || property.name,
      description: property.description,
      price: this.normalizePrice(property.price),
      location: property.location || property.address,
      bedrooms: parseInt(property.bedrooms) || 0,
      bathrooms: parseInt(property.bathrooms) || 0,
      area: property.area || property.size,
      propertyType: this.normalizePropertyType(property.type || property.propertyType),
      constructionStatus: this.normalizeConstructionStatus(property.status || property.constructionStatus),
      images: this.normalizeImages(property.images || property.photos),
      provider: provider,
      keyFeatures: property.features || property.amenities || [],
      developer: property.developer || property.developerName,
      completionDate: property.completionDate || property.handoverDate,
      paymentPlan: property.paymentPlan || property.paymentTerms,
      roi: property.roi || property.expectedROI,
      projectName: property.projectName || property.project,
      lastUpdated: new Date().toISOString()
    }

    // Provider-specific mappings
    switch (provider) {
      case 'behomes':
        return this.mapBehomesData(property, baseStructure)
      case 'reallyAI':
        return this.mapReallyAIData(property, baseStructure)
      default:
        return baseStructure
    }
  }

  // Behomes specific data mapping
  mapBehomesData(property, baseStructure) {
    return {
      ...baseStructure,
      // Behomes specific fields
      listingId: property.listing_id,
      agentInfo: property.agent,
      virtualTour: property.virtual_tour_url,
      floorPlan: property.floor_plan_url,
      pricePerSqFt: property.price_per_sqft,
      furnishing: property.furnishing_status,
      parking: property.parking_spaces,
      balcony: property.has_balcony,
      view: property.view_type
    }
  }

  // Really.AI specific data mapping
  mapReallyAIData(property, baseStructure) {
    return {
      ...baseStructure,
      // Really.AI specific fields
      aiScore: property.ai_score,
      marketTrends: property.market_analysis,
      investmentRating: property.investment_rating,
      priceHistory: property.price_history,
      neighborhoodScore: property.neighborhood_score,
      predictedAppreciation: property.predicted_appreciation
    }
  }

  // Normalize price to AED
  normalizePrice(price) {
    if (!price) return null
    
    // Handle different price formats
    if (typeof price === 'string') {
      // Remove currency symbols and convert to number
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''))
      return numericPrice
    }
    
    return parseFloat(price)
  }

  // Normalize property type
  normalizePropertyType(type) {
    if (!type) return 'apartment'
    
    const typeMap = {
      'flat': 'apartment',
      'apt': 'apartment',
      'condo': 'apartment',
      'villa': 'villa',
      'house': 'villa',
      'townhouse': 'townhouse',
      'th': 'townhouse',
      'penthouse': 'penthouse',
      'studio': 'studio'
    }
    
    return typeMap[type.toLowerCase()] || type.toLowerCase()
  }

  // Normalize construction status
  normalizeConstructionStatus(status) {
    if (!status) return 'in-construction'
    
    const statusMap = {
      'completed': 'ready',
      'ready': 'ready',
      'handover': 'ready',
      'under construction': 'in-construction',
      'construction': 'in-construction',
      'building': 'in-construction',
      'planning': 'planning',
      'approved': 'planning',
      'launched': 'planning'
    }
    
    return statusMap[status.toLowerCase()] || 'in-construction'
  }

  // Normalize images array
  normalizeImages(images) {
    if (!images) return []
    
    if (Array.isArray(images)) {
      return images.map(img => {
        if (typeof img === 'string') return img
        return img.url || img.src || img.image_url
      }).filter(Boolean)
    }
    
    if (typeof images === 'string') {
      return [images]
    }
    
    return []
  }

  // Fetch data from Behomes
  async fetchBehomesData(filters = {}) {
    try {
      const provider = this.providers.behomes
      if (!provider.enabled || !provider.apiKey) {
        console.warn('Behomes provider not configured')
        return []
      }

      const queryParams = new URLSearchParams({
        api_key: provider.apiKey,
        property_type: 'off-plan',
        ...filters
      })

      const response = await fetch(`${provider.apiUrl}/properties?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Behomes API error: ${response.status}`)
      }

      const data = await response.json()
      return data.properties?.map(property => 
        this.normalizePropertyData(property, 'behomes')
      ) || []
    } catch (error) {
      console.error('Error fetching Behomes data:', error)
      return []
    }
  }

  // Fetch data from Really.AI
  async fetchReallyAIData(filters = {}) {
    try {
      const provider = this.providers.reallyAI
      if (!provider.enabled || !provider.apiKey) {
        console.warn('Really.AI provider not configured')
        return []
      }

      const queryParams = new URLSearchParams({
        api_key: provider.apiKey,
        category: 'off-plan',
        ...filters
      })

      const response = await fetch(`${provider.apiUrl}/listings?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Really.AI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.listings?.map(property => 
        this.normalizePropertyData(property, 'reallyAI')
      ) || []
    } catch (error) {
      console.error('Error fetching Really.AI data:', error)
      return []
    }
  }

  // Fetch data from all providers
  async fetchAllProviderData(filters = {}) {
    try {
      const promises = [
        this.fetchBehomesData(filters),
        this.fetchReallyAIData(filters)
      ]

      const results = await Promise.allSettled(promises)
      
      const allProperties = []
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allProperties.push(...result.value)
        } else {
          console.error(`Provider ${index} failed:`, result.reason)
        }
      })

      // Remove duplicates based on title and location
      const uniqueProperties = this.removeDuplicates(allProperties)
      
      return uniqueProperties
    } catch (error) {
      console.error('Error fetching provider data:', error)
      return []
    }
  }

  // Remove duplicate properties
  removeDuplicates(properties) {
    const seen = new Set()
    return properties.filter(property => {
      const key = `${property.title}-${property.location}-${property.bedrooms}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  // Get provider status
  getProviderStatus() {
    return Object.entries(this.providers).map(([key, provider]) => ({
      name: provider.name,
      key,
      enabled: provider.enabled,
      configured: !!provider.apiKey
    }))
  }

  // Update provider configuration
  updateProviderConfig(providerKey, config) {
    if (this.providers[providerKey]) {
      this.providers[providerKey] = {
        ...this.providers[providerKey],
        ...config
      }
    }
  }
}

export default new ProviderService()