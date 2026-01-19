
import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductAttribute } from '../../types';
import { CloseIcon, TrashIcon, UploadIcon, StarIcon, SparklesIcon, PlusIcon } from '../Icons';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext'; // Import CategoryContext
import { useNotification } from '../../context/NotificationContext';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product | Omit<Product, 'id'>) => Promise<void>;
    productToEdit: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
    const { uploadImage } = useProducts();
    const { categories } = useCategories(); // Use real categories
    const { showNotification } = useNotification();
    const [isSaving, setIsSaving] = useState(false);

    // Fallback if no categories exist yet
    const defaultCategory = categories.length > 0 ? categories[0].name : '';

    const initialProductState: Omit<Product, 'id' | 'averageRating' | 'reviews'> = {
        name: '',
        brand: '',
        category: defaultCategory,
        imageUrl: '',
        images: [],
        description: '',
        details: [], // Array of strings
        priceFrom: 0,
        variants: [{ sku: '', price: 0, stock: 0, color: '', size: '', imageUrl: '' }],
        featuredAttributes: [], // New field initialization
        isCustomSize: false,
        pricePerSqM: 0,
        minWidth: 100,
        maxWidth: 500,
        minHeight: 180,
        maxHeight: 280,
        showSizeGuide: false
    };

    const [productData, setProductData] = useState(initialProductState);
    // Details state needs to be managed as string in the input, then converted to array on save
    const [detailsInput, setDetailsInput] = useState('');

    // Featured Attributes State
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

    // Store either the URL (string) or the File object for pending uploads
    const [images, setImages] = useState<(string | File)[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // --- Bulk Generator State ---
    const [genColors, setGenColors] = useState('');
    const [genWidths, setGenWidths] = useState('');
    const [genHeights, setGenHeights] = useState('');
    const [genPrice, setGenPrice] = useState<number>(0);
    const [genStock, setGenStock] = useState<number>(100);
    const [showGenerator, setShowGenerator] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            const allImages = [productToEdit.imageUrl, ...(productToEdit.images || [])].filter(Boolean);
            setImages(allImages);

            // Convert array to string for input
            const detailsStr = Array.isArray(productToEdit.details)
                ? productToEdit.details.join(', ')
                : '';
            setDetailsInput(detailsStr);

            // Load existing attributes
            setAttributes(productToEdit.featuredAttributes || []);

            setProductData({
                ...productToEdit,
                details: productToEdit.details || [],
                variants: productToEdit.variants.length > 0 ? productToEdit.variants : initialProductState.variants,
                featuredAttributes: productToEdit.featuredAttributes || [],
                isCustomSize: productToEdit.isCustomSize || false,
                pricePerSqM: productToEdit.pricePerSqM || 0,
                minWidth: productToEdit.minWidth || 100,
                maxWidth: productToEdit.maxWidth || 500,
                minHeight: productToEdit.minHeight || 180,
                maxHeight: productToEdit.maxHeight || 280,
                showSizeGuide: productToEdit.showSizeGuide || false
            });
        } else {
            setProductData({
                ...initialProductState,
                category: categories.length > 0 ? categories[0].name : ''
            });
            setDetailsInput('');
            setAttributes([]);
            setImages([]);
        }
    }, [productToEdit, isOpen, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Checkbox handling
        if (type === 'checkbox') {
            setProductData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
            return;
        }
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetailsInput(e.target.value);
    };

    // Attribute Handlers
    const handleAddAttribute = () => {
        setAttributes([...attributes, { label: '', value: '' }]);
    };

    const handleFillSampleAttributes = () => {
        // HACI: Burası artık resmi birebir taklit ediyor.
        const sampleAttributes = [
            { label: "Materyal", value: "Polyester" },
            { label: "Özellik", value: "Yıkanabilir" },
            { label: "Takma Şekli", value: "Kornişli" },
            { label: "Pile", value: "Pilesiz (1 x 1)" },
            { label: "Işık Geçirgenliği", value: "Blackout" },
            { label: "Parça Sayısı", value: "1" },
            { label: "Renk", value: "Gri" },
            { label: "Desen", value: "Düz" }
        ];
        setAttributes(sampleAttributes);
    };

    const handleClearAttributes = () => {
        setAttributes([]);
    };

    const handleRemoveAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const handleAttributeChange = (index: number, field: 'label' | 'value', text: string) => {
        const newAttrs = [...attributes];
        newAttrs[index][field] = text;
        setAttributes(newAttrs);
    };

    const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newVariants = [...productData.variants];
        const key = name as keyof ProductVariant;
        (newVariants[index] as any)[key] = (name === 'price' || name === 'stock') ? parseFloat(value) || 0 : value;
        setProductData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setProductData(prev => ({
            ...prev,
            variants: [...prev.variants, { sku: '', price: 0, stock: 0, color: '', size: '', imageUrl: '' }]
        }));
    };

    const removeVariant = (index: number) => {
        if (productData.variants.length <= 1) return;
        const newVariants = productData.variants.filter((_, i) => i !== index);
        setProductData(prev => ({ ...prev, variants: newVariants }));
    };

    // --- Bulk Generator Logic ---
    const handleBulkGenerate = () => {
        const colors = genColors.split(',').map(s => s.trim()).filter(Boolean);
        const widths = genWidths.split(',').map(s => s.trim()).filter(Boolean);
        const heights = genHeights.split(',').map(s => s.trim()).filter(Boolean);

        const newVariants: ProductVariant[] = [];
        const generateSKU = (color: string, size: string) => {
            const cleanColor = color.substring(0, 3).toUpperCase();
            const cleanSize = size.replace(/[^0-9]/g, '');
            const random = Math.floor(Math.random() * 1000);
            return `${cleanColor}-${cleanSize}-${random}`;
        };

        // Get first image URL if available
        const firstImage = images.length > 0 && typeof images[0] === 'string' ? images[0] as string : '';

        const colorLoop = colors.length > 0 ? colors : [''];

        colorLoop.forEach(color => {
            if (widths.length > 0 && heights.length > 0) {
                widths.forEach(width => {
                    heights.forEach(height => {
                        const size = `${width} x ${height}`;
                        newVariants.push({
                            sku: generateSKU(color, size),
                            color: color || undefined,
                            size: size,
                            price: genPrice,
                            stock: genStock,
                            imageUrl: firstImage
                        });
                    });
                });
            } else if (widths.length > 0) {
                widths.forEach(size => {
                    newVariants.push({
                        sku: generateSKU(color, size),
                        color: color || undefined,
                        size: size,
                        price: genPrice,
                        stock: genStock,
                        imageUrl: firstImage
                    });
                });
            } else if (colors.length > 0) {
                newVariants.push({
                    sku: generateSKU(color, 'STD'),
                    color: color,
                    size: undefined,
                    price: genPrice,
                    stock: genStock,
                    imageUrl: firstImage
                });
            }
        });

        if (newVariants.length === 0) {
            alert("Lütfen en az bir renk veya ölçü giriniz.");
            return;
        }

        setProductData(prev => {
            const currentVariants = prev.variants.length === 1 && !prev.variants[0].sku ? [] : prev.variants;
            return {
                ...prev,
                variants: [...currentVariants, ...newVariants]
            };
        });
        alert(`${newVariants.length} adet varyant başarıyla oluşturuldu!`);
    };

    const handleImageFileSelect = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setImages(prev => [...prev, ...newFiles]);
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(false); handleImageFileSelect(e.dataTransfer.files); };
    const removeImage = (indexToRemove: number) => { setImages(prev => prev.filter((_, index) => index !== indexToRemove)); };

    const setAsMainImage = (indexToSet: number) => {
        setImages(prev => {
            const newArray = [...prev];
            const mainImage = newArray.splice(indexToSet, 1)[0];
            newArray.unshift(mainImage);
            return newArray;
        });
    };

    const getPreviewUrl = (item: string | File) => {
        if (typeof item === 'string') return item;
        return URL.createObjectURL(item);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // 1. Upload pending images to Firebase Storage
            const finalImageUrls: string[] = [];
            for (const item of images) {
                if (typeof item === 'string') {
                    finalImageUrls.push(item);
                } else {
                    // Upload File
                    try {
                        const url = await uploadImage(item);
                        finalImageUrls.push(url);
                    } catch (error) {
                        console.error("Image upload failed", error);
                        showNotification("Resim yüklenemedi, lütfen tekrar deneyin.", "error");
                        setIsSaving(false);
                        return;
                    }
                }
            }

            // 2. Calculate price (UPDATED LOGIC: Width based if custom)
            let lowestPrice = 0;
            if (productData.isCustomSize) {
                // Price = (MinWidth / 100) * Metretül Fiyatı
                lowestPrice = (productData.minWidth! / 100) * (productData.pricePerSqM || 0);
            } else {
                lowestPrice = Math.min(...productData.variants.map(v => v.price).filter(p => p > 0));
            }

            // 3. Prepare final data
            const finalProductData = {
                ...productData,
                id: productToEdit?.id, // ID is undefined for new products, handled by addDoc
                averageRating: productToEdit?.averageRating || 0,
                reviews: productToEdit?.reviews || [],
                details: detailsInput.split(',').map(d => d.trim()).filter(Boolean), // Convert string back to array
                featuredAttributes: attributes.filter(a => a.label.trim() && a.value.trim()), // Save attributes
                priceFrom: lowestPrice === Infinity ? 0 : lowestPrice,
                imageUrl: finalImageUrls[0] || '',
                images: finalImageUrls.slice(1),
                isFeatured: productToEdit?.isFeatured || false,
                pricePerSqM: Number(productData.pricePerSqM),
                minWidth: Number(productData.minWidth),
                maxWidth: Number(productData.maxWidth),
                minHeight: Number(productData.minHeight),
                maxHeight: Number(productData.maxHeight),
                showSizeGuide: productData.showSizeGuide // Ensure this is saved
            };

            // 4. Save to Firestore
            await onSave(finalProductData as any);

        } catch (error) {
            console.error("Save error:", error);
            showNotification("Kaydederken bir hata oluştu.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const inputClass = "mt-1 block w-full bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm p-2.5 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{productToEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                    <button onClick={onClose}><CloseIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                        {/* Left Column for text fields */}
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Ürün Adı</label>
                                <input type="text" name="name" value={productData.name} onChange={handleChange} required className={inputClass} placeholder="Örn: Pamuklu Nevresim" />
                            </div>
                            <div>
                                <label className={labelClass}>Marka</label>
                                <input type="text" name="brand" value={productData.brand} onChange={handleChange} required className={inputClass} placeholder="Örn: MiraTekstil" />
                            </div>
                            <div>
                                <label className={labelClass}>Kategori</label>
                                <select name="category" value={productData.category} onChange={handleChange} required className={inputClass}>
                                    <option value="">Kategori Seçin</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Açıklama</label>
                                <textarea name="description" value={productData.description} onChange={handleChange} rows={4} required className={inputClass} placeholder="Ürün özelliklerini açıklayın..."></textarea>
                            </div>
                            <div>
                                <label className={labelClass}>Detaylar (Virgülle ayırın)</label>
                                <input type="text" name="details" value={detailsInput} onChange={handleDetailsChange} className={inputClass} placeholder="Örn: %100 Pamuk, Yıkanabilir" />
                            </div>

                            {/* ÖNE ÇIKAN ÖZELLİKLER BÖLÜMÜ */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <label className={`${labelClass} font-bold`}>Öne Çıkan Özellikler</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleFillSampleAttributes}
                                            className="text-xs bg-brand-secondary text-white border border-brand-secondary px-3 py-1 rounded hover:bg-brand-dark transition-colors font-semibold"
                                        >
                                            Otomatik Doldur
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClearAttributes}
                                            className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                        >
                                            Temizle
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Otomatik doldur butonuna basarak resimdeki özellikleri tek tıkla yükleyebilirsiniz.</p>
                                <div className="space-y-2">
                                    {attributes.map((attr, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="Etiket (Örn: Materyal)"
                                                value={attr.label}
                                                onChange={(e) => handleAttributeChange(index, 'label', e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded text-sm text-gray-900 focus:ring-brand-secondary focus:border-brand-secondary bg-white font-medium"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Değer (Örn: Polyester)"
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded text-sm text-gray-900 focus:ring-brand-secondary focus:border-brand-secondary"
                                            />
                                            <button type="button" onClick={() => handleRemoveAttribute(index)} className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors" title="Kaldır">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddAttribute}
                                        className="text-sm text-brand-secondary hover:text-brand-dark flex items-center font-medium mt-2"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-1" /> Yeni Özellik Ekle
                                    </button>
                                </div>
                            </div>

                            {/* NEW FEATURE TOGGLE */}
                            <div className="pt-2">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="showSizeGuide"
                                        checked={productData.showSizeGuide}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-brand-secondary rounded border-gray-300 focus:ring-brand-secondary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Ürün sayfasında "Ölçü Rehberi" alanını göster</span>
                                </label>
                            </div>
                        </div>

                        {/* Right Column for images */}
                        <div>
                            <label className={`${labelClass} mb-2`}>Ürün Resimleri</label>
                            <div
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragEvents}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-brand-secondary bg-brand-secondary/10' : 'border-gray-300 bg-gray-50'}`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageFileSelect(e.target.files)}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <UploadIcon className="h-10 w-10 mx-auto text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">Resimleri buraya sürükleyin veya <span className="font-semibold text-brand-secondary">seçmek için tıklayın</span></p>
                                </label>
                            </div>
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {images.map((item, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={getPreviewUrl(item)} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-1">
                                            {index !== 0 &&
                                                <button type="button" onClick={() => setAsMainImage(index)} title="Ana resim yap" className="text-white hover:text-yellow-400">
                                                    <StarIcon className="h-5 w-5" />
                                                </button>
                                            }
                                            <button type="button" onClick={() => removeImage(index)} title="Resmi sil" className="text-white hover:text-red-500">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        {index === 0 && <div className="absolute top-1 left-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">ANA</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        {/* MODE SWITCHER */}
                        <div className="flex items-center mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <input
                                type="checkbox"
                                id="isCustomSize"
                                name="isCustomSize"
                                checked={productData.isCustomSize || false}
                                onChange={handleChange}
                                className="h-5 w-5 text-brand-secondary rounded border-gray-300 focus:ring-brand-secondary"
                            />
                            <label htmlFor="isCustomSize" className="ml-3 block text-sm font-bold text-gray-800">
                                Bu ürün Özel Ölçülü (Custom Size) bir üründür
                                <span className="block text-xs font-normal text-gray-500 mt-1">
                                    İşaretlenirse, müşteri En/Boy girer ve fiyat <strong>Metretül (mt)</strong> üzerinden hesaplanır.
                                </span>
                            </label>
                        </div>

                        {productData.isCustomSize ? (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fadeIn">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Özel Ölçü Ayarları</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClass}>Metretül Fiyatı (TL/mt) - En'e Göre</label>
                                        <input type="number" name="pricePerSqM" value={productData.pricePerSqM} onChange={handleChange} required className={inputClass} placeholder="Örn: 300" />
                                        <p className="text-xs text-gray-500 mt-1">Sadece EN ölçüsü ile çarpılır.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Min En (cm)</label>
                                            <input type="number" name="minWidth" value={productData.minWidth} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Max En (cm)</label>
                                            <input type="number" name="maxWidth" value={productData.maxWidth} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Min Boy (cm)</label>
                                            <input type="number" name="minHeight" value={productData.minHeight} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Max Boy (cm)</label>
                                            <input type="number" name="maxHeight" value={productData.maxHeight} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="text-sm font-semibold mb-2 text-gray-700">Renk Varyantları (Sadece Renk Seçimi İçin)</p>
                                    <p className="text-xs text-gray-500 mb-3">Özel ölçülü üründe müşteri sadece renk seçer, ölçüyü kendisi girer.</p>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {productData.variants.map((variant, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded border border-gray-200">
                                                <div className="col-span-5">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Renk Adı</label>
                                                    <input type="text" name="color" value={variant.color} onChange={(e) => handleVariantChange(index, e)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary" placeholder="Örn: Antrasit" />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stok</label>
                                                    <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary" placeholder="100" />
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Görsel</label>
                                                    <select name="imageUrl" value={variant.imageUrl} onChange={(e) => handleVariantChange(index, e)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary">
                                                        <option value="">Resim Seç</option>
                                                        {images.map((item, i) => <option key={i} value={typeof item === 'string' ? item : item.name}>Resim {i + 1}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-span-1 flex justify-end pb-2">
                                                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addVariant} className="text-sm text-brand-secondary hover:underline font-medium">+ Renk Ekle</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Varyantlar</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowGenerator(!showGenerator)}
                                        className="flex items-center text-sm font-medium text-brand-primary hover:text-brand-secondary bg-brand-secondary/10 px-3 py-1.5 rounded-md transition-colors"
                                    >
                                        <SparklesIcon className="w-4 h-4 mr-1.5" />
                                        {showGenerator ? 'Oluşturucuyu Gizle' : 'Otomatik Varyant Oluştur'}
                                    </button>
                                </div>

                                {showGenerator && (
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 mb-6 animate-fadeIn">
                                        <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                                            <SparklesIcon className="w-4 h-4 mr-2" />
                                            Toplu Varyant Oluşturucu
                                        </h4>
                                        <p className="text-xs text-indigo-700 mb-4">Renkleri, enleri ve boyları virgülle ayırarak girin.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div><label className="block text-xs font-semibold text-indigo-800 mb-1">Renkler</label><input type="text" value={genColors} onChange={e => setGenColors(e.target.value)} className={inputClass} placeholder="Virgülle ayırın" /></div>
                                            <div><label className="block text-xs font-semibold text-indigo-800 mb-1">Enler (cm)</label><input type="text" value={genWidths} onChange={e => setGenWidths(e.target.value)} className={inputClass} placeholder="100, 120..." /></div>
                                            <div><label className="block text-xs font-semibold text-indigo-800 mb-1">Boylar (cm)</label><input type="text" value={genHeights} onChange={e => setGenHeights(e.target.value)} className={inputClass} placeholder="200, 250..." /></div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><label className="block text-xs font-semibold text-indigo-800 mb-1">Fiyat</label><input type="number" value={genPrice} onChange={e => setGenPrice(parseFloat(e.target.value))} className={inputClass} /></div>
                                                <div><label className="block text-xs font-semibold text-indigo-800 mb-1">Stok</label><input type="number" value={genStock} onChange={e => setGenStock(parseFloat(e.target.value))} className={inputClass} /></div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button type="button" onClick={handleBulkGenerate} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Varyantları Oluştur</button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {productData.variants.map((variant, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-x-4 gap-y-3 p-4 border border-gray-200 rounded-md relative bg-gray-50 hover:border-gray-300 transition-colors">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block text-xs font-medium text-gray-600">SKU</label>
                                                <input type="text" name="sku" value={variant.sku} onChange={(e) => handleVariantChange(index, e)} required className={inputClass} placeholder="SKU-001" />
                                            </div>
                                            <div className="col-span-6 sm:col-span-2">
                                                <label className="block text-xs font-medium text-gray-600">Renk</label>
                                                <input type="text" name="color" value={variant.color} onChange={(e) => handleVariantChange(index, e)} className={inputClass} placeholder="Beyaz" />
                                            </div>
                                            <div className="col-span-6 sm:col-span-2">
                                                <label className="block text-xs font-medium text-gray-600">Ölçü</label>
                                                <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} className={inputClass} placeholder="M" />
                                            </div>
                                            <div className="col-span-6 sm:col-span-2">
                                                <label className="block text-xs font-medium text-gray-600">Fiyat (TL)</label>
                                                <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} required step="0.01" className={inputClass} />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="block text-xs font-medium text-gray-600">Stok</label>
                                                <input type="number" name="stock" value={variant.stock} onChange={(e) => handleVariantChange(index, e)} required className={inputClass} />
                                            </div>
                                            <div className="col-span-12 sm:col-span-6">
                                                <label className="block text-xs font-medium text-gray-600">Varyant Resmi</label>
                                                <select name="imageUrl" value={variant.imageUrl} onChange={(e) => handleVariantChange(index, e)} className={inputClass}>
                                                    <option value="">Varsayılan Resim</option>
                                                    {images.map((item, imgIndex) => {
                                                        return <option key={imgIndex} value={typeof item === 'string' ? item : item.name}>Resim {imgIndex + 1} {typeof item !== 'string' ? '(Kaydedince Seçilebilir)' : ''}</option>
                                                    })}
                                                </select>
                                            </div>
                                            {productData.variants.length > 1 && (
                                                <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addVariant} className="mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                                    + Tek Varyant Ekle
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} disabled={isSaving} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">İptal</button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-dark shadow-sm flex items-center disabled:opacity-70"
                        >
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
