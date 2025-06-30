#!/bin/bash

echo "🚀 Setting up CPQ Frontend..."

# Create Vite React project
npm create vite@latest cpq-frontend -- --template react
cd cpq-frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install
npm install -D tailwindcss postcss autoprefixer

# Create directories
mkdir -p src/components src/services

echo "⚙️ Creating configuration files..."

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Create postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Update src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Update src/App.css
cat > src/App.css << 'EOF'
/* Custom styles for the CPQ application */
EOF

echo "📝 Creating API service..."

# Create src/services/api.js
cat > src/services/api.js << 'EOF'
const API_BASE_URL = 'http://localhost:8080/api/v1/demo';

class CPQApiService {
  async fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async calculatePricing(skuId, quantity, termMonths = 12, customerId = '') {
    try {
      const params = new URLSearchParams({
        sku_id: skuId,
        quantity: quantity.toString(),
        term_months: termMonths.toString(),
        ...(customerId && { customer_id: customerId })
      });
      
      const response = await fetch(`${API_BASE_URL}/pricing?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      throw error;
    }
  }

  async createQuote(quoteRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteRequest)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  }

  async listQuotes(customerId = '') {
    try {
      const params = customerId ? `?customer_id=${customerId}` : '';
      const response = await fetch(`${API_BASE_URL}/quotes${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }
}

export const cpqApi = new CPQApiService();
export default cpqApi;
EOF

echo "✅ Setup complete!"
echo "📁 Project created in: cpq-frontend/"
echo "🔗 Next steps:"
echo "   1. cd cpq-frontend"
echo "   2. Download the component files (I'll provide links)"
echo "   3. npm run dev"
