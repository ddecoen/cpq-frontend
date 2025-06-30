import { useState } from 'react'
import ProductCatalog from './components/ProductCatalog'
import PricingCalculator from './components/PricingCalculator'
import QuoteManager from './components/QuoteManager'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('catalog')

  const tabs = [
    { id: 'catalog', name: 'Product Catalog', icon: '📦' },
    { id: 'pricing', name: 'Pricing Calculator', icon: '💰' },
    { id: 'quotes', name: 'Quote Manager', icon: '📋' }
  ]

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'catalog':
        return <ProductCatalog />
      case 'pricing':
        return <PricingCalculator />
      case 'quotes':
        return <QuoteManager />
      default:
        return <ProductCatalog />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">CPQ System</h1>
              <span className="ml-3 text-sm text-gray-500">Configure • Price • Quote</span>
            </div>
            <div className="text-sm text-gray-500">
              Enterprise Licensing & AI Add-ons
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderActiveComponent()}
      </main>
    </div>
  )
}

export default App
2. src/components/ProductCatalog.jsx (New file)
import { useState, useEffect } from 'react'
import { cpqApi } from '../services/api'

const ProductCatalog = () => {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await cpqApi.fetchProducts()
      setProducts(data.products || [])
      setCustomers(data.customers || [])
    } catch (err) {
      setError('Failed to load products. Please ensure the backend is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'enterprise_license', name: 'Enterprise Licenses' },
    { id: 'ai_addon', name: 'AI Add-ons' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'enterprise_license':
        return '🏢'
      case 'ai_addon':
        return '🤖'
      default:
        return '📦'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'enterprise_license':
        return 'bg-blue-100 text-blue-800'
      case 'ai_addon':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="text-red-400">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
          <p className="mt-1 text-sm text-gray-600">
            Browse our enterprise licenses and AI add-ons
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getCategoryIcon(product.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                  {product.category.replace('_', ' ')}
                </span>
              </div>
              
              <p className="mt-4 text-sm text-gray-600">{product.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.base_price)}</span>
                  <span className="text-sm text-gray-500 ml-1">/{product.pricing_type.replace('_', ' ')}</span>
                </div>
              </div>
              
              {product.tiers && product.tiers.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Pricing Tiers</h4>
                  <div className="space-y-1">
                    {product.tiers.map((tier, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{tier.name}</span>
                        <span className="font-medium">{formatPrice(tier.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try selecting a different category or check back later.</p>
        </div>
      )}
    </div>
  )
}

export default ProductCatalog
