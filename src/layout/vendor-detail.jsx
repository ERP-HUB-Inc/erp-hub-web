import React, { useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
} from "lucide-react";

const ProductGrid = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 299.99,
      stock: 45,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 128,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      category: "Electronics",
      price: 399.99,
      stock: 23,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 256,
      status: "In Stock",
    },
    {
      id: 3,
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: 549.99,
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 89,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Mechanical Keyboard RGB",
      category: "Electronics",
      price: 149.99,
      stock: 67,
      image:
        "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 342,
      status: "In Stock",
    },
    {
      id: 5,
      name: "Standing Desk Electric",
      category: "Furniture",
      price: 699.99,
      stock: 8,
      image:
        "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 167,
      status: "Low Stock",
    },
    {
      id: 6,
      name: "Wireless Mouse Pro",
      category: "Electronics",
      price: 79.99,
      stock: 156,
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
      rating: 4.4,
      reviews: 423,
      status: "In Stock",
    },
    {
      id: 7,
      name: 'LED Monitor 27"',
      category: "Electronics",
      price: 449.99,
      stock: 34,
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 198,
      status: "In Stock",
    },
    {
      id: 8,
      name: "Desk Lamp Smart",
      category: "Accessories",
      price: 89.99,
      stock: 0,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      rating: 4.3,
      reviews: 76,
      status: "Out of Stock",
    },
  ];

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inventory Hub
              </h1>
              <p className="text-gray-500 mt-1">Manage your product catalog</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                + Add Product
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${
                    viewMode === "grid"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${
                    viewMode === "list"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={
                        favorites.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        Stock: {product.stock} units
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 group">
                    <ShoppingCart
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">
                            {product.category}
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < Math.floor(product.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({product.reviews} reviews)
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                product.status
                              )}`}
                            >
                              {product.status}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Heart
                            size={20}
                            className={
                              favorites.includes(product.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock} units
                        </div>
                      </div>
                      <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
