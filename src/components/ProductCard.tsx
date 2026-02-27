import React from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
              Nuevo
            </span>
          )}
          {product.isSale && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
              Oferta
            </span>
          )}
          
          {/* Add to Cart Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
              <button
                  onClick={(e) => {
                      e.preventDefault(); // Prevent navigation when clicking add to cart
                      e.stopPropagation();
                      addToCart(product);
                  }}
                  className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                  <Plus size={16} /> Agregar al Carrito
              </button>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{product.name}</h3>
          <p className="text-sm text-gray-500 font-serif italic">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
