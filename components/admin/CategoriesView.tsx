
import React, { useState } from 'react';
import { Category } from '../../types';
import { EditIcon, TrashIcon, PlusIcon, UploadIcon } from '../Icons';
import { useCategories } from '../../context/CategoryContext';
import { useNotification } from '../../context/NotificationContext';

const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, uploadCategoryImage } = useCategories();
  const { showNotification } = useNotification();
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<string>('');
  const [newCategoryImageFile, setNewCategoryImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEditing && editingCategory) {
          uploadCategoryImage(file).then(url => {
              setEditingCategory({ ...editingCategory, imageUrl: url });
          }).catch(() => showNotification("Resim yüklenirken hata oluştu", "error"));

        } else {
          setNewCategoryImage(result);
          setNewCategoryImageFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;
    setIsSubmitting(true);

    try {
        let imageUrl = newCategoryImage;
        if (newCategoryImageFile) {
            imageUrl = await uploadCategoryImage(newCategoryImageFile);
        } else if (!imageUrl) {
            imageUrl = 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=600';
        }

        await addCategory({
            name: newCategoryName.trim(),
            imageUrl: imageUrl,
        });

        setNewCategoryName('');
        setNewCategoryImage('');
        setNewCategoryImageFile(null);
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || editingCategory.name.trim() === '') return;
    await updateCategory(editingCategory);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategoriye ait ürünler etkilenmeyecektir.')) {
      deleteCategory(categoryId);
    }
  };

  const inputClass = "p-2.5 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary w-full";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kategori Yönetimi</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Yeni Kategori Ekle</h2>
        <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Örn: Yatak Odası"
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
          <div className="md:col-span-5">
             <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Görseli</label>
             <div className="flex items-center space-x-4">
                {newCategoryImage ? (
                    <div className="relative h-12 w-12 rounded overflow-hidden border border-gray-300 group">
                        <img src={newCategoryImage} alt="Preview" className="h-full w-full object-cover bg-gray-50" />
                        <button 
                            type="button" 
                            onClick={() => { setNewCategoryImage(''); setNewCategoryImageFile(null); }}
                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="h-12 w-12 rounded border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
                        <UploadIcon className="h-6 w-6" />
                    </div>
                )}
                <label className={`cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors shadow-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    Görsel Seç
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" disabled={isSubmitting} />
                </label>
             </div>
          </div>
          <div className="md:col-span-2">
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-brand-dark transition-colors flex items-center justify-center disabled:opacity-70"
            >
                {isSubmitting ? '...' : <><PlusIcon className="h-5 w-5 mr-2" /> Ekle</>}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mevcut Kategoriler</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori Adı</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Eylemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                     {editingCategory?.id === category.id ? (
                        <div className="relative h-12 w-12 group">
                             <img src={editingCategory.imageUrl} alt={editingCategory.name} className="h-12 w-12 object-cover bg-gray-50 rounded border border-gray-300" />
                             <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded">
                                <UploadIcon className="h-5 w-5 text-white" />
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                             </label>
                        </div>
                     ) : (
                        <img src={category.imageUrl} alt={category.name} className="h-12 w-12 object-cover bg-white rounded border border-gray-300 p-0.5" />
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-full">
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="p-2 w-full bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingCategory?.id === category.id ? (
                      <div className="flex justify-end space-x-3">
                        <button onClick={handleUpdateCategory} className="text-green-600 hover:text-green-800 font-semibold">Kaydet</button>
                        <button onClick={() => setEditingCategory(null)} className="text-gray-500 hover:text-gray-700">İptal</button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => setEditingCategory(category)} className="text-indigo-600 hover:text-indigo-900">
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteCategory(category.id); }} 
                            className="text-red-600 hover:text-red-900 relative z-20 cursor-pointer p-2 rounded-full hover:bg-red-50"
                        >
                          <TrashIcon className="h-5 w-5 pointer-events-none" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">Henüz kategori eklenmemiş.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesView;
