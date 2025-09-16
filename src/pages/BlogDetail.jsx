import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch blog data from API
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`)
        if (response.ok) {
          const blogData = await response.json()
          setBlog(blogData)
          
          // Fetch related blogs
          const relatedResponse = await fetch(`/api/blogs?status=published&limit=3`)
          if (relatedResponse.ok) {
            const relatedResult = await relatedResponse.json()
            if (relatedResult.blogs) {
              const related = relatedResult.blogs.filter(post => post._id !== id).slice(0, 2)
              setRelatedBlogs(related)
            }
          }
        } else {
          // Fallback to static data
          const foundBlog = staticBlogPosts.find(post => post.id === parseInt(id))
          setBlog(foundBlog)
          const related = staticBlogPosts.filter(post => post.id !== parseInt(id)).slice(0, 2)
          setRelatedBlogs(related)
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
        // Fallback to static data
        const foundBlog = staticBlogPosts.find(post => post.id === parseInt(id))
        setBlog(foundBlog)
        const related = staticBlogPosts.filter(post => post.id !== parseInt(id)).slice(0, 2)
        setRelatedBlogs(related)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  // Static blog data (same as Home page)
  const staticBlogPosts = [
    {
      id: 1,
      title: 'Dubai Real Estate Market Trends 2024',
      excerpt: 'Discover the latest trends shaping Dubai\'s luxury property market and investment opportunities.',
      content: `
        <h2>The Dubai Real Estate Market in 2024</h2>
        <p>Dubai's real estate market continues to show remarkable resilience and growth in 2024. With new developments, innovative financing options, and a growing international investor base, the market presents numerous opportunities for both local and international buyers.</p>
        
        <h3>Key Market Trends</h3>
        <ul>
          <li><strong>Sustainable Development:</strong> Green building initiatives and eco-friendly properties are becoming increasingly popular.</li>
          <li><strong>Smart Homes:</strong> Integration of IoT and smart home technologies in luxury developments.</li>
          <li><strong>Off-Plan Investments:</strong> Continued strong demand for off-plan properties with attractive payment plans.</li>
          <li><strong>International Investment:</strong> Growing interest from European and Asian investors.</li>
        </ul>
        
        <h3>Investment Opportunities</h3>
        <p>The current market conditions present excellent opportunities for investors looking to diversify their portfolio with Dubai real estate. Key areas showing strong growth include:</p>
        <ul>
          <li>Dubai Creek Harbour</li>
          <li>Downtown Dubai</li>
          <li>Dubai Marina</li>
          <li>Business Bay</li>
        </ul>
        
        <h3>Future Outlook</h3>
        <p>With Expo 2020's lasting impact and Dubai's vision for 2071, the real estate market is positioned for continued growth. The government's initiatives to attract foreign investment and the introduction of new visa categories further strengthen the market's appeal.</p>
      `,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
      date: '2024-01-15',
      category: 'Market Analysis',
      author: 'AMZ Properties Team',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Investment Guide: Off-Plan Properties',
      excerpt: 'Everything you need to know about investing in off-plan properties in the UAE.',
      content: `
        <h2>Understanding Off-Plan Property Investment</h2>
        <p>Off-plan property investment involves purchasing a property before it's completed, often during the construction phase. This investment strategy has become increasingly popular in Dubai due to its potential for high returns and flexible payment plans.</p>
        
        <h3>Benefits of Off-Plan Investment</h3>
        <ul>
          <li><strong>Lower Initial Investment:</strong> Typically requires only 10-20% down payment.</li>
          <li><strong>Flexible Payment Plans:</strong> Spread payments over the construction period.</li>
          <li><strong>Capital Appreciation:</strong> Property value often increases during construction.</li>
          <li><strong>Modern Amenities:</strong> New developments feature the latest amenities and technologies.</li>
        </ul>
        
        <h3>Key Considerations</h3>
        <p>Before investing in off-plan properties, consider these important factors:</p>
        <ul>
          <li>Developer reputation and track record</li>
          <li>Location and future development plans</li>
          <li>Payment schedule and terms</li>
          <li>Expected completion date</li>
          <li>Market conditions and trends</li>
        </ul>
        
        <h3>Top Off-Plan Projects in Dubai</h3>
        <p>Some of the most promising off-plan projects currently available include developments in Dubai Creek Harbour, Downtown Dubai, and Dubai South. These areas offer excellent connectivity, world-class amenities, and strong potential for capital appreciation.</p>
      `,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
      date: '2024-01-10',
      category: 'Investment',
      author: 'Investment Team',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Luxury Living: Premium Amenities Guide',
      excerpt: 'Explore the world-class amenities that define luxury living in Dubai\'s premium developments.',
      content: `
        <h2>Defining Luxury Living in Dubai</h2>
        <p>Dubai's luxury real estate market sets global standards for premium amenities and lifestyle offerings. From world-class spas to private beaches, luxury developments in Dubai offer an unparalleled living experience.</p>
        
        <h3>Essential Luxury Amenities</h3>
        <ul>
          <li><strong>Infinity Pools:</strong> Rooftop and ground-level infinity pools with stunning city or sea views.</li>
          <li><strong>Private Beach Access:</strong> Exclusive beach clubs and private shoreline access.</li>
          <li><strong>Spa and Wellness Centers:</strong> Full-service spas with massage rooms, saunas, and wellness programs.</li>
          <li><strong>Concierge Services:</strong> 24/7 concierge for restaurant reservations, travel planning, and personal assistance.</li>
        </ul>
        
        <h3>Recreational Facilities</h3>
        <p>Modern luxury developments feature extensive recreational facilities:</p>
        <ul>
          <li>State-of-the-art fitness centers</li>
          <li>Tennis and squash courts</li>
          <li>Golf simulators and putting greens</li>
          <li>Children's play areas and nurseries</li>
          <li>Multi-purpose halls and event spaces</li>
        </ul>
        
        <h3>Smart Home Integration</h3>
        <p>Today's luxury properties feature cutting-edge smart home technologies, including automated lighting, climate control, security systems, and entertainment centers, all controllable via smartphone apps.</p>
        
        <h3>Investment Value</h3>
        <p>Properties with premium amenities not only provide an exceptional lifestyle but also maintain higher resale values and rental yields, making them excellent long-term investments.</p>
      `,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=400&fit=crop',
      date: '2024-01-05',
      category: 'Lifestyle',
      author: 'Lifestyle Team',
      readTime: '6 min read'
    }
  ]



  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-dark-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-dark-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
                Home
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-300">Blog</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-white">{blog.title}</span>
            </nav>

            {/* Blog Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
                {blog.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-gray-400">
                <span>By {blog.author || 'AMZ Properties Team'}</span>
                <span>•</span>
                <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : (blog.date || new Date(blog.createdAt).toLocaleDateString())}</span>
                <span>•</span>
                <span>{blog.readTime || '5 min read'}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-2xl mb-12">
              <img 
                src={blog.image ? `http://localhost:5003${blog.image}` : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'} 
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gold-500/20">
              <div 
                className="prose prose-lg prose-invert max-w-none"
                style={{
                  color: '#e5e7eb',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 border-t border-gold-500/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-12 text-center font-serif">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link 
                    key={relatedBlog._id || relatedBlog.id}
                    to={`/blog/${relatedBlog._id || relatedBlog.id}`}
                    className="group"
                  >
                    <article className="bg-dark-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img 
                          src={relatedBlog.image ? `http://localhost:5003${relatedBlog.image}` : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'} 
                          alt={relatedBlog.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-gold-400 text-sm mb-3">
                          <span>{relatedBlog.category}</span>
                          <span className="mx-2">•</span>
                          <span>{relatedBlog.publishedAt ? new Date(relatedBlog.publishedAt).toLocaleDateString() : (relatedBlog.date || new Date(relatedBlog.createdAt).toLocaleDateString())}</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-gold-400 transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {relatedBlog.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gold-600/20 to-gold-400/20 border-t border-gold-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-serif">
            Ready to Explore Dubai's Luxury Properties?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our expert team to discover exclusive investment opportunities in Dubai's premium real estate market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-semibold hover:from-gold-700 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              to="/properties" 
              className="px-8 py-4 border border-gold-500 text-gold-400 rounded-xl font-semibold hover:bg-gold-500/10 transition-all duration-300"
            >
              View Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetail