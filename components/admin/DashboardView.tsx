
import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { Order } from '../../types';

const DashboardView: React.FC = () => {
  const { orders } = useOrders();
  const { products } = useProducts();
    
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const recentOrders = orders.slice(0, 5);

  const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-brand-primary">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );

  const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const colorClasses = {
      'Teslim Edildi': 'bg-green-100 text-green-800',
      'Yolda': 'bg-blue-100 text-blue-800',
      'Kargolandı': 'bg-blue-100 text-blue-800',
      'İşleniyor': 'bg-yellow-100 text-yellow-800',
      'Ödeme Bekleniyor': 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Toplam Satış" value={`${totalRevenue.toFixed(2)} TL`} description="Tüm zamanlar" />
        <StatCard title="Toplam Sipariş" value={totalOrders} description="Tüm zamanlar" />
        <StatCard title="Toplam Ürün" value={totalProducts} description="Aktif ürünler" />
      </div>
      
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Son Siparişler</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Müşteri</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} TL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Henüz sipariş bulunmuyor.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;