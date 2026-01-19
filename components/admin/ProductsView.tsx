
import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import { EditIcon, TrashIcon, StarIcon, UploadIcon } from '../Icons';
import ProductFormModal from './ProductFormModal';

const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, seedDatabase } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
        deleteProduct(productId);
    }
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct({ ...product, isFeatured: !product.isFeatured });
  };

  const handleSaveProduct = async (productData: Product | Omit<Product, 'id'>) => {
    if (productToEdit) {
      // Update existing
      await updateProduct(productData as Product);
    } else {
      // Add new
      await addProduct(productData as Omit<Product, 'id'>);
    }
    setIsModalOpen(false);
  };

  const getPriceRange = (product: Product): string => {
      if (!product.variants || product.variants.length === 0) return 'N/A';
      if (product.variants.length === 1) return `${product.variants[0].price.toFixed(2)} TL`;

      const prices = product.variants.map(v => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      if (min === max) return `${min.toFixed(2)} TL`;
      return `${min.toFixed(2)} - ${max.toFixed(2)} TL`;
  }
  
  const getTotalStock = (product: Product): number => {
    return product.variants.reduce((acc, v) => acc + v.stock, 0);
  }

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Ürün Yönetimi</h1>
          <div className="flex gap-4">
              {products.length === 0 && (
                   <button
                    onClick={seedDatabase}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center"
                   >
                       <UploadIcon className="w-4 h-4 mr-2" />
                       Örnek Verileri Yükle
                   </button>
              )}
              <button
                onClick={handleAddProduct}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow hover:bg-brand-dark transition-colors"
              >
                Yeni Ürün Ekle
              </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat Aralığı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Stok</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Öne Çıkan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Eylemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? products.map(product => {
                  const totalStock = getTotalStock(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover bg-white rounded border border-gray-200" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPriceRange(product)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {totalStock > 10 ? 
                            <span className="text-green-600">{totalStock}</span> : 
                            <span className="text-red-600 font-bold">{totalStock} (Düşük)</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => handleToggleFeatured(product)} aria-label="Öne Çıkar">
                            <StarIcon className={`h-6 w-6 transition-colors ${product.isFeatured ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditProduct(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteProduct(product.id); }} 
                            className="text-red-600 hover:text-red-900 relative z-20 cursor-pointer p-2 rounded-full hover:bg-red-50"
                        >
                          <TrashIcon className="h-5 w-5 pointer-events-none" />
                        </button>
                      </td>
                    </tr>
                );
              }) : (
                  <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                          Henüz ürün yok. "Örnek Verileri Yükle" butonu ile başlayabilir veya yeni ürün ekleyebilirsiniz.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
        />
      )}
    </>
  );
};

export default ProductsView;
