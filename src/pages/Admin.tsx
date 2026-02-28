import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Package, Users, Tag, Settings, Truck, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  const { orders: userOrders } = useAuth(); // In a real app, fetch all orders. Mocking with user's orders for demo.
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon, freeShippingThreshold, setFreeShippingThreshold } = useCart();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users' | 'settings'>('orders');
  
  // Mock data for demo purposes
  const [orders, setOrders] = useState(userOrders.length > 0 ? userOrders : [
    { id: 'ORD-123', date: new Date().toISOString(), total: 150, status: 'Pendiente', items: [] },
    { id: 'ORD-124', date: new Date().toISOString(), total: 85, status: 'Pago Aprobado', items: [] }
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [shippingThresholdInput, setShippingThresholdInput] = useState(freeShippingThreshold.toString());

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
    alert('Configuración guardada');
  };

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
          <Truck size={20} /> Envío Gratis
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Monto Mínimo ($)</label>
            <input 
              type="number" 
              value={shippingThresholdInput}
              onChange={(e) => setShippingThresholdInput(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
            />
          </div>
          <button 
            onClick={handleSaveSettings}
            className="bg-black text-white px-6 py-2 rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Guardar
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Los pedidos por encima de este monto tendrán envío gratuito automáticamente.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <div className="mb-6 px-4">
              <h1 className="font-serif font-bold text-xl">Panel Admin</h1>
              <p className="text-xs text-gray-500">ESEN CONCEPT</p>
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
            {activeTab === 'products' && renderPlaceholder('Gestión de Productos (CRUD)')}
            {activeTab === 'users' && renderPlaceholder('Gestión de Usuarios (CRUD)')}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
