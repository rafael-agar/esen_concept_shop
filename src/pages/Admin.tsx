import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Package, Users, Tag, Settings, Truck, Edit, Trash2, Plus, CheckCircle, XCircle, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const { orders: userOrders } = useAuth(); // In a real app, fetch all orders. Mocking with user's orders for demo.
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon, freeShippingThreshold, setFreeShippingThreshold, baseShippingCost, setBaseShippingCost } = useCart();
  const { products, updateProduct } = useProducts();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'captcha'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaSelected, setCaptchaSelected] = useState<number | null>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users' | 'settings'>('orders');
  
  // Captcha images (using product images for theme)
  const captchaImages = [
    "https://esenconcept.netlify.app/esen01.jpg",
    "https://esenconcept.netlify.app/esen02.jpg",
    "https://esenconcept.netlify.app/esen03.jpg",
    "https://esenconcept.netlify.app/esen04.jpg",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop"
  ];
  const CORRECT_IMAGE_INDEX = 0; // Let's say the first one is the "correct" one (RAÍZ)

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setLoginStep('captcha');
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleCaptchaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaSelected === CORRECT_IMAGE_INDEX && captchaText.toUpperCase() === 'ESEN') {
      setIsLoggedIn(true);
    } else {
      setLoginError('Validación incorrecta. Inténtalo de nuevo.');
      setCaptchaSelected(null);
      setCaptchaText('');
    }
  };

  // ... rest of the existing handlers ...
  const [orders, setOrders] = useState(userOrders.length > 0 ? userOrders : [
    { id: 'ORD-123', date: new Date().toISOString(), total: 150, status: 'Pendiente', items: [] },
    { id: 'ORD-124', date: new Date().toISOString(), total: 85, status: 'Pago Aprobado', items: [] }
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [shippingThresholdInput, setShippingThresholdInput] = useState(freeShippingThreshold.toString());
  const [baseShippingCostInput, setBaseShippingCostInput] = useState(baseShippingCost.toString());

  // Product Edit State
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editSalePrice, setEditSalePrice] = useState('');
  const [editIsSale, setEditIsSale] = useState(false);
  const [editIsNew, setEditIsNew] = useState(false);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCouponCode && newCouponDiscount) {
      addCoupon({
        code: newCouponCode.toUpperCase(),
        discountPercentage: Number(newCouponDiscount),
        isActive: true
      });
      setNewCouponCode('');
      setNewCouponDiscount('');
    }
  };

  const handleSaveSettings = () => {
    setFreeShippingThreshold(Number(shippingThresholdInput));
    setBaseShippingCost(Number(baseShippingCostInput));
    alert('Configuración guardada');
  };

  const startEditingProduct = (product: any) => {
    setEditingProductId(product.id);
    setEditPrice(product.price.toString());
    setEditSalePrice(product.salePrice ? product.salePrice.toString() : '');
    setEditIsSale(product.isSale || false);
    setEditIsNew(product.isNew || false);
  };

  const saveProductEdit = (product: any) => {
    updateProduct({
      ...product,
      price: Number(editPrice),
      salePrice: editSalePrice ? Number(editSalePrice) : undefined,
      isSale: editIsSale,
      isNew: editIsNew
    });
    setEditingProductId(null);
  };

  const renderProducts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Gestión de Productos</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-bold">Producto</th>
              <th className="p-4 font-bold">Precio Regular</th>
              <th className="p-4 font-bold">Precio Oferta</th>
              <th className="p-4 font-bold">En Oferta</th>
              <th className="p-4 font-bold">Nuevo</th>
              <th className="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    <span className="font-medium text-sm">{product.name}</span>
                  </div>
                </td>
                
                {editingProductId === product.id ? (
                  <>
                    <td className="p-4">
                      <input 
                        type="number" 
                        value={editPrice} 
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-20 border border-gray-300 rounded p-1 text-sm"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        value={editSalePrice} 
                        onChange={(e) => setEditSalePrice(e.target.value)}
                        className="w-20 border border-gray-300 rounded p-1 text-sm"
                        placeholder="Opcional"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={editIsSale} 
                        onChange={(e) => setEditIsSale(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={editIsNew} 
                        onChange={(e) => setEditIsNew(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => saveProductEdit(product)}
                        className="bg-black text-white px-3 py-1 rounded text-xs font-bold uppercase"
                      >
                        Guardar
                      </button>
                      <button 
                        onClick={() => setEditingProductId(null)}
                        className="bg-gray-200 text-black px-3 py-1 rounded text-xs font-bold uppercase"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                    <td className="p-4 font-medium text-red-500">
                      {product.salePrice ? `$${product.salePrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4">
                      {product.isSale ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800">Sí</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.isNew ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">Sí</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => startEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit size={16} /> Editar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Gestión de Pedidos</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-bold">ID Pedido</th>
              <th className="p-4 font-bold">Fecha</th>
              <th className="p-4 font-bold">Total</th>
              <th className="p-4 font-bold">Tipo</th>
              <th className="p-4 font-bold">Estado</th>
              <th className="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-medium">{order.id}</td>
                <td className="p-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                <td className="p-4">
                  {order.isGift ? (
                    <div className="group relative cursor-help">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Regalo
                      </span>
                      {order.giftDetails && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                          <p className="text-xs font-bold text-purple-800 mb-1">Para: {order.giftDetails.recipientName}</p>
                          <p className="text-[10px] text-gray-500 mb-2">{order.giftDetails.recipientEmail}</p>
                          <p className="text-xs italic text-gray-600 border-t border-gray-100 pt-2">"{order.giftDetails.message}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-[10px] font-bold uppercase">Normal</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Pago Aprobado' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded p-1 focus:outline-none focus:border-black"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pago Aprobado">Pago Aprobado</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-bold mb-6">Lógica de Negocio</h2>
      
      {/* Shipping Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Truck size={20} /> Configuración de Envío
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Costo de Envío Base ($)</label>
            <input 
              type="number" 
              value={baseShippingCostInput}
              onChange={(e) => setBaseShippingCostInput(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
            />
            <p className="text-[10px] text-gray-400 mt-1">Monto que se cobrará si no se cumple el envío gratis.</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Monto Mínimo para Envío Gratis ($)</label>
            <input 
              type="number" 
              value={shippingThresholdInput}
              onChange={(e) => setShippingThresholdInput(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
            />
            <p className="text-[10px] text-gray-400 mt-1">Los pedidos por encima de este monto tendrán envío gratuito.</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handleSaveSettings}
            className="bg-black text-white px-8 py-2 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Coupons Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Tag size={20} /> Cupones de Descuento
        </h3>
        
        <form onSubmit={handleAddCoupon} className="flex items-end gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Código</label>
            <input 
              type="text" 
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              placeholder="Ej: VERANO20"
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descuento (%)</label>
            <input 
              type="number" 
              value={newCouponDiscount}
              onChange={(e) => setNewCouponDiscount(e.target.value)}
              placeholder="Ej: 15"
              min="1"
              max="100"
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
            />
          </div>
          <button 
            type="submit"
            className="bg-black text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Agregar
          </button>
        </form>

        <div className="space-y-3">
          {coupons.map(coupon => (
            <div key={coupon.code} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${coupon.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-bold text-lg">{coupon.code}</p>
                  <p className="text-sm text-gray-500">{coupon.discountPercentage}% de descuento</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleCouponStatus(coupon.code)}
                  className={`text-sm font-medium px-3 py-1 rounded-full ${coupon.isActive ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  {coupon.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button 
                  onClick={() => deleteCoupon(coupon.code)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Eliminar cupón"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && (
            <p className="text-gray-500 text-center py-4">No hay cupones creados.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-serif font-bold mb-4">{title}</h2>
      <p className="text-gray-500">Módulo en desarrollo para la versión final.</p>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold">Acceso Administrativo</h1>
            <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <AnimatePresence mode="wait">
            {loginStep === 'credentials' ? (
              <motion.form 
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLoginSubmit} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Usuario</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
                    placeholder="admin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
                    placeholder="••••"
                    required
                  />
                </div>
                {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
                <button 
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Siguiente
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="captcha"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleCaptchaSubmit} 
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                    <ShieldCheck size={18} className="text-green-600" /> Verificación de Seguridad
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Selecciona la imagen de la primera cápsula (RAÍZ)</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {captchaImages.map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCaptchaSelected(idx)}
                        className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${captchaSelected === idx ? 'border-black ring-2 ring-black/10' : 'border-transparent hover:border-gray-200'}`}
                      >
                        <img src={img} alt="captcha" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1 text-left">Escribe 'ESEN' para confirmar</label>
                    <input 
                      type="text" 
                      value={captchaText}
                      onChange={(e) => setCaptchaText(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black uppercase text-center tracking-widest"
                      placeholder="ESEN"
                      required
                    />
                  </div>
                </div>

                {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setLoginStep('credentials')}
                    className="flex-1 border border-gray-300 py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    Atrás
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-black text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Entrar
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar ... existing code ... */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <div className="mb-6 px-4 flex justify-between items-center">
              <div>
                <h1 className="font-serif font-bold text-xl">Panel Admin</h1>
                <p className="text-xs text-gray-500">ESEN CONCEPT</p>
              </div>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package size={18} /> Pedidos
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'products' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Tag size={18} /> Productos
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'users' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users size={18} /> Usuarios
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={18} /> Configuración
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'users' && renderPlaceholder('Gestión de Usuarios (CRUD)')}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
