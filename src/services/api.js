// Static API service - returns static data instead of making HTTP requests
import { properties, blogs, partners, reviews, contacts } from '../data/index.js';

// Simulate API delay for realistic behavior
const simulateDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys for admin functionality
const STORAGE_KEYS = {
  PROPERTIES: 'amz_properties',
  BLOGS: 'amz_blogs',
  PARTNERS: 'amz_partners',
  REVIEWS: 'amz_reviews',
  CONTACTS: 'amz_contacts',
  WISHLIST: 'amz_wishlist',
  ADMIN_TOKEN: 'adminToken'
};

// Initialize local storage with static data if not exists
const initializeLocalStorage = () => {
  console.log('🚀 Initializing localStorage...');
  console.log('📋 Imported properties:', properties);
  console.log('📊 Properties count:', properties ? properties.length : 0);
  
  if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
    console.log('💾 Storing properties to localStorage...');
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  } else {
    console.log('✅ Properties already exist in localStorage');
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
  }
  
  console.log('✅ localStorage initialization complete');
};

// Helper functions for local storage operations
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

class StaticApiService {
  constructor() {
    initializeLocalStorage();
  }

  // Simulate API response format
  createResponse(data, success = true, message = '') {
    return {
      success,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  // Properties API methods
  async getProperties(filters = {}) {
    await simulateDelay();
    let propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    
    console.log('🔍 getProperties called with filters:', filters);
    console.log('📦 Raw properties data from storage:', propertiesData);
    console.log('📊 Properties count:', propertiesData ? propertiesData.length : 0);
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      propertiesData = propertiesData.filter(p => p.category === filters.category);
    }
    if (filters.location && filters.location !== 'all') {
      propertiesData = propertiesData.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.propertyType && filters.propertyType !== 'all') {
      propertiesData = propertiesData.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      propertiesData = propertiesData.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      propertiesData = propertiesData.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    
    console.log('✅ Filtered properties data:', propertiesData);
    console.log('📈 Final count:', propertiesData ? propertiesData.length : 0);
    
    return this.createResponse(propertiesData);
  }

  async getPropertyById(id) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const property = propertiesData.find(p => p._id === id || p.id === id);
    
    if (property) {
      return this.createResponse(property);
    } else {
      throw new Error('Property not found');
    }
  }

  async searchProperties(query) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const searchResults = propertiesData.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
    );
    
    return this.createResponse(searchResults);
  }

  async createProperty(propertyData) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const newProperty = {
      ...propertyData,
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    propertiesData.push(newProperty);
    saveToStorage(STORAGE_KEYS.PROPERTIES, propertiesData);
    
    return this.createResponse(newProperty, true, 'Property created successfully');
  }

  async updateProperty(id, propertyData) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const index = propertiesData.findIndex(p => p._id === id || p.id === id);
    
    if (index !== -1) {
      propertiesData[index] = {
        ...propertiesData[index],
        ...propertyData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.PROPERTIES, propertiesData);
      return this.createResponse(propertiesData[index], true, 'Property updated successfully');
    } else {
      throw new Error('Property not found');
    }
  }

  async deleteProperty(id) {
    await simulateDelay();
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    const filteredProperties = propertiesData.filter(p => p._id !== id && p.id !== id);
    
    if (filteredProperties.length < propertiesData.length) {
      saveToStorage(STORAGE_KEYS.PROPERTIES, filteredProperties);
      return this.createResponse(null, true, 'Property deleted successfully');
    } else {
      throw new Error('Property not found');
    }
  }

  // Contact API methods
  async submitContactForm(formData) {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    const newContact = {
      ...formData,
      _id: generateId(),
      id: generateId(),
      status: 'new',
      source: 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contactsData.push(newContact);
    saveToStorage(STORAGE_KEYS.CONTACTS, contactsData);
    
    return this.createResponse(newContact, true, 'Contact form submitted successfully');
  }

  async getContactSubmissions() {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    return this.createResponse(contactsData);
  }

  async updateContact(id, contactData) {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    const index = contactsData.findIndex(c => c._id === id || c.id === id);
    
    if (index !== -1) {
      contactsData[index] = {
        ...contactsData[index],
        ...contactData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.CONTACTS, contactsData);
      return this.createResponse(contactsData[index], true, 'Contact updated successfully');
    } else {
      throw new Error('Contact not found');
    }
  }

  async updateContactStatus(id, status) {
    return this.updateContact(id, { status });
  }

  async deleteContact(id) {
    await simulateDelay();
    const contactsData = getFromStorage(STORAGE_KEYS.CONTACTS);
    const filteredContacts = contactsData.filter(c => c._id !== id && c.id !== id);
    
    if (filteredContacts.length < contactsData.length) {
      saveToStorage(STORAGE_KEYS.CONTACTS, filteredContacts);
      return this.createResponse(null, true, 'Contact deleted successfully');
    } else {
      throw new Error('Contact not found');
    }
  }

  // Blog API methods
  async getBlogs(filters = {}) {
    await simulateDelay();
    let blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      blogsData = blogsData.filter(b => b.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      blogsData = blogsData.filter(b => b.category === filters.category);
    }
    if (filters.limit) {
      blogsData = blogsData.slice(0, parseInt(filters.limit));
    }
    
    return { blogs: blogsData, success: true };
  }

  async getBlogById(id) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const blog = blogsData.find(b => b._id === id || b.id === id);
    
    if (blog) {
      return this.createResponse(blog);
    } else {
      throw new Error('Blog not found');
    }
  }

  async getBlogBySlug(slug) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const blog = blogsData.find(b => b.slug === slug);
    
    if (blog) {
      return this.createResponse(blog);
    } else {
      throw new Error('Blog not found');
    }
  }

  async createBlog(blogData) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const newBlog = {
      ...blogData,
      _id: generateId(),
      id: generateId(),
      slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: blogData.status === 'published' ? new Date().toISOString() : null
    };
    
    blogsData.push(newBlog);
    saveToStorage(STORAGE_KEYS.BLOGS, blogsData);
    
    return this.createResponse(newBlog, true, 'Blog created successfully');
  }

  async updateBlog(id, blogData) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const index = blogsData.findIndex(b => b._id === id || b.id === id);
    
    if (index !== -1) {
      blogsData[index] = {
        ...blogsData[index],
        ...blogData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.BLOGS, blogsData);
      return this.createResponse(blogsData[index], true, 'Blog updated successfully');
    } else {
      throw new Error('Blog not found');
    }
  }

  async deleteBlog(id) {
    await simulateDelay();
    const blogsData = getFromStorage(STORAGE_KEYS.BLOGS);
    const filteredBlogs = blogsData.filter(b => b._id !== id && b.id !== id);
    
    if (filteredBlogs.length < blogsData.length) {
      saveToStorage(STORAGE_KEYS.BLOGS, filteredBlogs);
      return this.createResponse(null, true, 'Blog deleted successfully');
    } else {
      throw new Error('Blog not found');
    }
  }

  // Partners API methods
  async getPartners(filters = {}) {
    await simulateDelay();
    let partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      partnersData = partnersData.filter(p => p.status === filters.status);
    }
    if (filters.limit) {
      partnersData = partnersData.slice(0, parseInt(filters.limit));
    }
    
    return { partners: partnersData, success: true };
  }

  async getPartnerById(id) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const partner = partnersData.find(p => p._id === id || p.id === id);
    
    if (partner) {
      return this.createResponse(partner);
    } else {
      throw new Error('Partner not found');
    }
  }

  async createPartner(partnerData) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const newPartner = {
      ...partnerData,
      _id: generateId(),
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    partnersData.push(newPartner);
    saveToStorage(STORAGE_KEYS.PARTNERS, partnersData);
    
    return this.createResponse(newPartner, true, 'Partner created successfully');
  }

  async updatePartner(id, partnerData) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const index = partnersData.findIndex(p => p._id === id || p.id === id);
    
    if (index !== -1) {
      partnersData[index] = {
        ...partnersData[index],
        ...partnerData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.PARTNERS, partnersData);
      return this.createResponse(partnersData[index], true, 'Partner updated successfully');
    } else {
      throw new Error('Partner not found');
    }
  }

  async deletePartner(id) {
    await simulateDelay();
    const partnersData = getFromStorage(STORAGE_KEYS.PARTNERS);
    const filteredPartners = partnersData.filter(p => p._id !== id && p.id !== id);
    
    if (filteredPartners.length < partnersData.length) {
      saveToStorage(STORAGE_KEYS.PARTNERS, filteredPartners);
      return this.createResponse(null, true, 'Partner deleted successfully');
    } else {
      throw new Error('Partner not found');
    }
  }

  // Reviews API methods
  async getReviews(filters = {}) {
    await simulateDelay();
    let reviewsData = getFromStorage(STORAGE_KEYS.REVIEWS);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      reviewsData = reviewsData.filter(r => r.status === filters.status);
    }
    if (filters.limit) {
      reviewsData = reviewsData.slice(0, parseInt(filters.limit));
    }
    
    return { data: reviewsData, success: true };
  }

  async createReview(reviewData) {
    await simulateDelay();
    const reviewsData = getFromStorage(STORAGE_KEYS.REVIEWS);
    const newReview = {
      ...reviewData,
      _id: generateId(),
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reviewsData.push(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviewsData);
    
    return this.createResponse(newReview, true, 'Review submitted successfully');
  }

  async updateReviewStatus(id, status) {
    await simulateDelay();
    const reviewsData = getFromStorage(STORAGE_KEYS.REVIEWS);
    const index = reviewsData.findIndex(r => r._id === id || r.id === id);
    
    if (index !== -1) {
      reviewsData[index] = {
        ...reviewsData[index],
        status,
        updatedAt: new Date().toISOString(),
        approvedAt: status === 'approved' ? new Date().toISOString() : null
      };
      saveToStorage(STORAGE_KEYS.REVIEWS, reviewsData);
      return this.createResponse(reviewsData[index], true, 'Review status updated successfully');
    } else {
      throw new Error('Review not found');
    }
  }

  async updateReview(id, reviewData) {
    await simulateDelay();
    const reviewsData = getFromStorage(STORAGE_KEYS.REVIEWS);
    const index = reviewsData.findIndex(r => r._id === id || r.id === id);
    
    if (index !== -1) {
      reviewsData[index] = {
        ...reviewsData[index],
        ...reviewData,
        updatedAt: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.REVIEWS, reviewsData);
      return this.createResponse(reviewsData[index], true, 'Review updated successfully');
    } else {
      throw new Error('Review not found');
    }
  }

  async deleteReview(id) {
    await simulateDelay();
    const reviewsData = getFromStorage(STORAGE_KEYS.REVIEWS);
    const filteredReviews = reviewsData.filter(r => r._id !== id && r.id !== id);
    
    if (filteredReviews.length < reviewsData.length) {
      saveToStorage(STORAGE_KEYS.REVIEWS, filteredReviews);
      return this.createResponse(null, true, 'Review deleted successfully');
    } else {
      throw new Error('Review not found');
    }
  }

  // Wishlist API methods
  async getWishlist() {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    return this.createResponse(wishlistData);
  }

  async addToWishlist(propertyId, userNote = '') {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const propertiesData = getFromStorage(STORAGE_KEYS.PROPERTIES);
    
    const property = propertiesData.find(p => p._id === propertyId || p.id === propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    const existingItem = wishlistData.find(item => item.propertyId === propertyId);
    if (existingItem) {
      throw new Error('Property already in wishlist');
    }
    
    const newWishlistItem = {
      _id: generateId(),
      propertyId,
      property,
      userNote,
      createdAt: new Date().toISOString()
    };
    
    wishlistData.push(newWishlistItem);
    saveToStorage(STORAGE_KEYS.WISHLIST, wishlistData);
    
    return this.createResponse(newWishlistItem, true, 'Property added to wishlist');
  }

  async removeFromWishlist(propertyId) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const filteredWishlist = wishlistData.filter(item => item.propertyId !== propertyId);
    
    if (filteredWishlist.length < wishlistData.length) {
      saveToStorage(STORAGE_KEYS.WISHLIST, filteredWishlist);
      return this.createResponse(null, true, 'Property removed from wishlist');
    } else {
      throw new Error('Property not found in wishlist');
    }
  }

  async checkWishlistStatus(propertyId) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const isInWishlist = wishlistData.some(item => item.propertyId === propertyId);
    return this.createResponse({ isInWishlist });
  }

  async updateWishlistNote(propertyId, userNote) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const index = wishlistData.findIndex(item => item.propertyId === propertyId);
    
    if (index !== -1) {
      wishlistData[index].userNote = userNote;
      saveToStorage(STORAGE_KEYS.WISHLIST, wishlistData);
      return this.createResponse(wishlistData[index], true, 'Wishlist note updated');
    } else {
      throw new Error('Property not found in wishlist');
    }
  }

  async getAdminWishlist() {
    return this.getWishlist();
  }

  async deleteWishlistItem(itemId) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const filteredWishlist = wishlistData.filter(item => item._id !== itemId);
    
    if (filteredWishlist.length < wishlistData.length) {
      saveToStorage(STORAGE_KEYS.WISHLIST, filteredWishlist);
      return this.createResponse(null, true, 'Wishlist item deleted');
    } else {
      throw new Error('Wishlist item not found');
    }
  }

  async updateWishlistItemNote(itemId, userNote) {
    await simulateDelay();
    const wishlistData = getFromStorage(STORAGE_KEYS.WISHLIST);
    const index = wishlistData.findIndex(item => item._id === itemId);
    
    if (index !== -1) {
      wishlistData[index].userNote = userNote;
      saveToStorage(STORAGE_KEYS.WISHLIST, wishlistData);
      return this.createResponse(wishlistData[index], true, 'Wishlist note updated');
    } else {
      throw new Error('Wishlist item not found');
    }
  }

  // Admin authentication
  async adminLogin(credentials) {
    await simulateDelay();
    // Simple static authentication - in a real app, this would be more secure
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const token = 'static-admin-token-' + Date.now();
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      return this.createResponse({ token, user: { username: 'admin', role: 'admin' } }, true, 'Login successful');
    } else {
      throw new Error('Invalid credentials');
    }
  }

  // Health check
  async healthCheck() {
    await simulateDelay();
    return this.createResponse({ status: 'healthy', mode: 'static' }, true, 'Static API service is running');
  }

  // Legacy method aliases for backward compatibility
  async getPosts(filters = {}) {
    return this.getBlogs(filters);
  }

  async getPostBySlug(slug) {
    return this.getBlogBySlug(slug);
  }

  async getAdminPosts(filters = {}) {
    return this.getBlogs(filters);
  }

  async createPost(postData) {
    return this.createBlog(postData);
  }

  async updatePost(id, postData) {
    return this.updateBlog(id, postData);
  }

  async deletePost(id) {
    return this.deleteBlog(id);
  }

  async getPostForEdit(id) {
    return this.getBlogById(id);
  }
}

const apiService = new StaticApiService();
export default apiService;
export { apiService };

// Export individual methods for backward compatibility
export const {
  getProperties,
  getPropertyById,
  searchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  submitContactForm,
  getContactSubmissions,
  getPosts,
  getPostBySlug,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
  getPostForEdit,
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  getReviews,
  createReview,
  updateReview,
  updateReviewStatus,
  deleteReview,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  updateWishlistNote,
  getAdminWishlist,
  deleteWishlistItem,
  updateWishlistItemNote,
  healthCheck,
  adminLogin
} = apiService;