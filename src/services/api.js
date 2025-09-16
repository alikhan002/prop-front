const API_BASE_URL = '/api';

// API service for making HTTP requests
class ApiService {
  async request(endpoint, options = {}) {
    if (!endpoint) {
      console.error('Endpoint is undefined or null');
      throw new Error('Invalid endpoint provided to API request');
    }
    
    // Add cache-busting parameter to prevent browser caching
    const cacheBuster = `_=${new Date().getTime()}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${API_BASE_URL}${endpoint}${separator}${cacheBuster}`;
    
    const config = {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(options.headers || {}),
      },
      ...options,
    };
    
    // Don't set Content-Type for FormData - browser will handle it
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      console.log(`API Request to: ${url}`, config);
      
      // Check if server is available first
      try {
        const response = await fetch(url, config);
        console.log(`API Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP error! status: ${response.status}, response:`, errorText);
          let errorMessage = `HTTP error! status: ${response.status}`;
          
          // Try to parse error message from response if possible
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson && errorJson.message) {
              errorMessage = errorJson.message;
            }
          } catch (e) {
            // If can't parse JSON, use the error text if it exists
            if (errorText) {
              errorMessage += ` - ${errorText}`;
            }
          }
          
          throw new Error(errorMessage);
        }
        
        // Safely parse JSON response
        const responseText = await response.text();
        if (!responseText) {
          console.warn('Empty response received');
          return {};
        }
        
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Response text:', responseText);
          throw new Error('Invalid JSON response from server');
        }
      } catch (fetchError) {
        if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
          console.error('Server connection error - backend may not be running');
          throw new Error('Cannot connect to server. Please check if the backend is running.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Properties API methods
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getPropertyById(id) {
    return this.request(`/properties/${id}`);
  }

  async searchProperties(query) {
    return this.request(`/properties/search?q=${encodeURIComponent(query)}`);
  }
  
  async createProperty(propertyData, isFormData = false) {
    try {
      console.log('Creating property with data:', isFormData ? 'FormData object' : propertyData);
      
      const headers = {};
      
      // Don't set Content-Type for FormData (browser will set it with boundary)
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      // Remove Content-Type from request options for FormData
      const requestOptions = {
        method: 'POST',
        headers,
        body: isFormData ? propertyData : JSON.stringify(propertyData),
      };
      
      if (isFormData) {
        delete requestOptions.headers['Content-Type'];
      }
      
      const response = await this.request('/properties', requestOptions);
      console.log('Create property response:', response);
      return response;
    } catch (error) {
      console.error('Error in createProperty:', error);
      return { success: false, message: error.message || 'Failed to create property' };
    }
  }
  
  async updateProperty(id, propertyData, isFormData = false) {
    if (!id) {
      console.error('No property ID provided for update');
      return { success: false, message: 'No property ID provided' };
    }
    
    try {
      console.log('Updating property with ID:', id);
      console.log('Property data:', isFormData ? 'FormData object' : propertyData);
      
      const headers = {};
      
      // Don't set Content-Type for FormData (browser will set it with boundary)
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      // Remove Content-Type from request options for FormData
      const requestOptions = {
        method: 'PUT',
        headers,
        body: isFormData ? propertyData : JSON.stringify(propertyData),
      };
      
      if (isFormData) {
        delete requestOptions.headers['Content-Type'];
      }
      
      const response = await this.request(`/properties/${id}`, requestOptions);
      console.log('Update property response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateProperty:', error);
      return { success: false, message: error.message || 'Failed to update property' };
    }
  }
  
  async deleteProperty(id) {
    if (!id) {
      console.error('No property ID provided for deletion');
      return { success: false, message: 'No property ID provided' };
    }
    
    try {
      console.log('Deleting property with ID:', id);
      const response = await this.request(`/properties/${id}`, {
        method: 'DELETE'
      });
      console.log('Delete property response:', response);
      return response;
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      return { success: false, message: error.message || 'Failed to delete property' };
    }
  }

  // Contact API methods
  async submitContactForm(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async getContactSubmissions() {
    return this.request('/contact', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }
  
  async updateContact(id, contactData) {
    if (!id) {
      console.error('No contact ID provided for update');
      return { success: false, message: 'No contact ID provided' };
    }
    
    try {
      console.log('Updating contact with ID:', id);
      return this.request(`/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(contactData),
      });
    } catch (error) {
      console.error('Error in updateContact:', error);
      throw error;
    }
  }
  
  async updateContactStatus(id, status, isEdited = false) {
    if (!id) {
      console.error('No contact ID provided for status update');
      return { success: false, message: 'No contact ID provided' };
    }
    
    try {
      console.log('Updating contact status with ID:', id);
      return this.request(`/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status, isEdited }),
      });
    } catch (error) {
      console.error('Error in updateContactStatus:', error);
      throw error;
    }
  }
  
  async deleteContact(id) {
    if (!id) {
      console.error('No contact ID provided for deletion');
      return { success: false, message: 'No contact ID provided' };
    }
    
    try {
      console.log('Deleting contact with ID:', id);
      return this.request(`/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
    } catch (error) {
      console.error('Error in deleteContact:', error);
      throw error;
    }
  }

  // Posts API methods
  async getPosts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getPostBySlug(slug) {
    return this.request(`/posts/${slug}`);
  }

  async getAdminPosts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== 'all') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    // Make sure we're using the correct endpoint path
    const endpoint = `/posts/admin/all${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching admin posts with endpoint:', endpoint);
    const adminToken = localStorage.getItem('adminToken');
    console.log('Admin token available:', !!adminToken);
    
    try {
      const result = await this.request(endpoint, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      console.log('Admin posts API response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching admin posts:', error);
      throw error;
    }
  }

  async createPost(postData) {
    console.log('API Service: Creating post with data:', postData);
    return this.request('/posts/admin', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  async updatePost(id, postData) {
    console.log('API Service: Updating post with ID:', id, 'Data:', postData);
    return this.request(`/posts/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  async deletePost(id) {
    return this.request(`/posts/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  async getPostForEdit(id) {
    return this.request(`/posts/admin/edit/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  // Blog API methods
  async getBlogs(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/blogs${queryString ? `?${queryString}` : ''}`;
    
    // Check if admin token exists to include authentication
    const token = localStorage.getItem('adminToken');
    const options = {};
    
    if (token) {
      options.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
    
    return this.request(endpoint, options);
  }

  async getBlogById(id) {
    if (!id) {
      throw new Error('Blog ID is required');
    }
    return this.request(`/blogs/${id}`);
  }

  async createBlog(blogData) {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    };
    
    const requestOptions = {
      method: 'POST',
      headers
    };
    
    if (blogData instanceof FormData) {
      requestOptions.body = blogData;
    } else {
      headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(blogData);
    }
    
    return this.request('/blogs', requestOptions);
  }

  async updateBlog(id, blogData) {
    if (!id) {
      throw new Error('Blog ID is required');
    }
    
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    };
    
    const requestOptions = {
      method: 'PUT',
      headers
    };
    
    if (blogData instanceof FormData) {
      requestOptions.body = blogData;
    } else {
      headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(blogData);
    }
    
    return this.request(`/blogs/${id}`, requestOptions);
  }

  async deleteBlog(id) {
    if (!id) {
      throw new Error('Blog ID is required');
    }
    
    return this.request(`/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  // Partner API methods
  async getPartners(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== 'all') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/partners${queryString ? `?${queryString}` : ''}`;
    
    // Check if admin token exists to include authentication
    const token = localStorage.getItem('adminToken');
    const options = {};
    
    if (token) {
      options.headers = {
        'Authorization': `Bearer ${token}`
      };
    }
    
    return this.request(endpoint, options);
  }

  async getPartnerById(id) {
    if (!id) {
      throw new Error('Partner ID is required');
    }
    return this.request(`/partners/${id}`);
  }

  async createPartner(partnerData) {
    const token = localStorage.getItem('adminToken');
    console.log('API Service - createPartner called');
    console.log('Token available:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: partnerData instanceof FormData ? partnerData : JSON.stringify(partnerData)
    };
    
    if (!(partnerData instanceof FormData)) {
      requestOptions.headers['Content-Type'] = 'application/json';
    }
    
    console.log('Request options:', { ...requestOptions, body: 'FormData/JSON content' });
    return this.request('/partners', requestOptions);
  }

  async updatePartner(id, partnerData) {
    if (!id) {
      throw new Error('Partner ID is required for update');
    }
    
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: partnerData instanceof FormData ? partnerData : JSON.stringify(partnerData)
    };
    
    if (!(partnerData instanceof FormData)) {
      requestOptions.headers['Content-Type'] = 'application/json';
    }
    
    return this.request(`/partners/${id}`, requestOptions);
  }

  async deletePartner(id) {
    if (!id) {
      throw new Error('Partner ID is required for deletion');
    }
    
    try {
      const response = await this.request(`/partners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      // Return consistent format
      return {
        success: true,
        message: response.message || 'Partner deleted successfully'
      };
    } catch (error) {
      console.error('Delete partner error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete partner'
      };
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Wishlist API methods
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(propertyId, userNote = '') {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ propertyId, userNote }),
    });
  }

  async removeFromWishlist(propertyId) {
    return this.request(`/wishlist/${propertyId}`, {
      method: 'DELETE',
    });
  }

  async checkWishlistStatus(propertyId) {
    return this.request(`/wishlist/check/${propertyId}`);
  }

  async updateWishlistNote(propertyId, userNote) {
    return this.request(`/wishlist/${propertyId}/note`, {
      method: 'PUT',
      body: JSON.stringify({ userNote })
    });
  }

  // Admin wishlist methods
  async getAdminWishlist() {
    return this.request('/admin/wishlist', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  async deleteWishlistItem(itemId) {
    return this.request(`/admin/wishlist/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  async updateWishlistItemNote(itemId, userNote) {
    return this.request(`/admin/wishlist/${itemId}/note`, {
      method: 'PUT',
      body: JSON.stringify({ userNote }),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  }

  // Admin API methods
  async adminLogin(credentials) {
    if (!credentials || typeof credentials !== 'object') {
      console.error('Invalid credentials provided:', credentials);
      throw new Error('Invalid credentials format');
    }
    
    console.log('Attempting login with credentials:', credentials);
    try {
      const response = await this.request('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
export { apiService };

// Export individual methods for convenience
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