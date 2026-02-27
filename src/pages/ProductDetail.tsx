import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { Star, Minus, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle Recently Viewed
  useEffect(() => {
    if (product) {
      const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Get product details for viewed IDs (excluding current)
      const viewedProducts = viewedIds
        .map((vid: number) => products.find(p => p.id === vid))
        .filter((p: Product | undefined): p is Product => p !== undefined && p.id !== product.id)
        .slice(0, 4);
      
      setRecentlyViewed(viewedProducts);

      // Update local storage with current product
      const newViewedIds = [product.id, ...viewedIds.filter((vid: number) => vid !== product.id)].slice(0, 8);
      localStorage.setItem('recentlyViewed', JSON.stringify(newViewedIds));
    }
  }, [product]);

  if (!product) {
    return <div className="pt-32 text-center">Producto no encontrado</div>;
  }

  // Get related products (same category) or fallback to others if not enough
  const getRelatedProducts = () => {
    let related = products
      .filter(p => p.category === product.category && p.id !== product.id);
    
    if (related.length < 4) {
      const others = products
        .filter(p => p.category !== product.category && p.id !== product.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4 - related.length);
      related = [...related, ...others];
    }
    return related;
  };

  const relatedProducts = getRelatedProducts();

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAddToCart = () => {
    // In a real app, we would pass color and size to the cart
    addToCart(product);
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-black transition-colors uppercase text-sm font-bold tracking-widest"
      >
        <X size={20} /> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img 
                  src={product.image} 
                  alt={`${product.name} view ${i}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-500">(24 reviews)</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia aliquid blanditiis soluta enim. Eius, fugit aspernatur. Iure veniam aperiam quas ex commodi ad. Fuga sapiente fugiat quod dolorem earum pariatur!
          </p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            {product.isSale && (
              <span className="text-xl text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Choose a Color</h3>
            <p className="text-xs text-gray-500 mb-3">Color seleccionado: <span className="font-bold text-black">{selectedColor}</span></p>
            <div className="flex gap-3">
              {['red', 'blue', 'green', 'black'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Choose a Size</h3>
            <div className="flex gap-3">
              {['Small', 'Medium', 'Large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border text-sm ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Choose a Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-red-500 text-sm font-medium">Only 4 items left! Don't miss it</span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mb-12"
          >
            Agregar al Carrito
          </button>

          {/* Accordions */}
          <div className="border-t border-gray-200">
            {['Descripción', 'Envío y Devoluciones', 'Cuidados'].map((title, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(title)}
                  className="w-full flex justify-between items-center py-4 text-left font-bold uppercase tracking-widest text-sm hover:text-gray-600"
                >
                  {title}
                  {openSection === title ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {openSection === title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 text-gray-600 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia aliquid blanditiis soluta enim. Eius, fugit aspernatur. Iure veniam aperiam quas ex commodi ad. Fuga sapiente fugiat quod dolorem earum pariatur!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-200 pt-20 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">También te podría gustar</h2>
            <div className="w-12 h-0.5 bg-black mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="border-t border-gray-200 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Vistos Recientemente</h2>
            <div className="w-12 h-0.5 bg-black mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {recentlyViewed.map((viewedProduct) => (
              <ProductCard key={viewedProduct.id} product={viewedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
