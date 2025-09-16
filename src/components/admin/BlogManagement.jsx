import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Market Trends',
    tags: '',
    status: 'draft',
    featured: false,
    image: null,
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  })

  const categories = [
    'Market Trends',
    'Investment Guide', 
    'Property News',
    'Lifestyle',
    'Technology'
  ]

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await apiService.getBlogs({ 
        status: 'all',
        limit: 1000 // Set high limit for admin panel to show all blogs
      })
      if (response.blogs) {
        setBlogs(response.blogs || [])
      } else {
        toast.error('Failed to fetch blogs')
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Error fetching blogs')
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key])
        } else if (key !== 'image') {
          submitData.append(key, formData[key])
        }
      })

      let response
      if (editingBlog) {
        response = await apiService.updateBlog(editingBlog._id, submitData)
      } else {
        response = await apiService.createBlog(submitData)
      }

      if (response.success) {
        toast.success(`Blog ${editingBlog ? 'updated' : 'created'} successfully`)
        setShowForm(false)
        setEditingBlog(null)
        resetForm()
        fetchBlogs()
      } else {
        toast.error(response.message || 'Failed to save blog')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Error saving blog')
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags ? blog.tags.join(', ') : '',
      status: blog.status,
      featured: blog.featured,
      image: null,
      metaTitle: blog.seo?.metaTitle || '',
      metaDescription: blog.seo?.metaDescription || '',
      keywords: blog.seo?.keywords ? blog.seo.keywords.join(', ') : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      const response = await apiService.deleteBlog(blogId)
      
      if (response.success) {
        toast.success('Blog deleted successfully')
        fetchBlogs()
      } else {
        toast.error(response.message || 'Failed to delete blog')
        // Fallback: remove from local state if API fails
        setBlogs(prev => prev.filter(blog => blog._id !== blogId))
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Error deleting blog')
      // Fallback: remove from local state if API fails
      setBlogs(prev => prev.filter(blog => blog._id !== blogId))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Market Trends',
      tags: '',
      status: 'draft',
      featured: false,
      image: null,
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    })
  }

  const getStatusBadge = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors.draft
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Blog Management</h2>
          <p className="text-yellow-300/70 mt-1">Create and manage your blog posts</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingBlog(null)
            resetForm()
          }}
          className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Blog</span>
        </button>
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl border border-yellow-400/30 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-1">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="dubai, real estate, investment"
                  className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-1">
                Featured Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-yellow-500/30 rounded bg-gray-700"
              />
              <label className="ml-2 block text-sm text-yellow-300">
                Featured Blog
              </label>
            </div>

            {/* SEO Fields */}
            <div className="border-t border-yellow-500/30 pt-4">
              <h4 className="text-md font-medium text-yellow-300 mb-3">SEO Settings</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-1">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-yellow-500/30 rounded-md px-3 py-2 text-white placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingBlog(null)
                  resetForm()
                }}
                className="px-6 py-3 border border-yellow-500/30 rounded-xl text-yellow-300 hover:bg-gray-700 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {editingBlog ? 'Update' : 'Create'} Blog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Blog Posts ({blogs.length})</h3>
          </div>
        </div>
        <div className="p-8">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No blogs found</div>
              <p className="text-yellow-300/60 mt-2">Create your first blog post to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {blog.image && (
                          <img 
                            src={`http://localhost:5003${blog.image}`} 
                            alt={blog.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-xl font-bold text-yellow-300 hover:text-yellow-400 transition-colors">{blog.title}</h4>
                            {blog.featured && (
                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusBadge(blog.status)}`}>
                            {blog.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-yellow-200/70 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center space-x-6 text-sm text-yellow-300/60">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>{blog.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{blog.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-6">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl transition-all duration-300 hover:scale-110 group"
                        title="Edit blog"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 group"
                        title="Delete blog"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default BlogManagement