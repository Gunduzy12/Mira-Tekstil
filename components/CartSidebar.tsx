"use client";

import React from 'react';
import { useCart } from '../context/CartContext';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon } from './Icons';

import { useRouter } from 'next/navigation';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, itemCount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-light shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-serif font-semibold text-brand-primary">Alışveriş Sepeti ({itemCount})</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors" aria-label="Sepeti kapat">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-500">Sepetiniz boş.</p>
              <button
                onClick={() => {
                  onClose();
                  router.push('/shop');
                }}
                className="mt-4 bg-brand-primary text-white px-6 py-2 hover:bg-brand-dark transition-colors"
              >
                Alışverişe Devam Et
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6">
                <ul className="space-y-6">
                  {cartItems.map(item => (
                    <li key={item.cartItemId} className="flex space-x-4">
                      <div className="w-24 h-24 bg-gray-200 flex-shrink-0 relative rounded-md overflow-hidden border border-gray-200">
                        <img src={item.variant.imageUrl || item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        {item.variant.originalPrice && item.variant.originalPrice > item.variant.price && (
                          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 font-bold">
                            İndirim
                          </span>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-brand-primary">{item.productName}</h3>
                          {item.customDimensions ? (
                            <p className="text-xs text-brand-secondary font-bold mt-1">
                              Özel Ölçü: {item.customDimensions.width}x{item.customDimensions.height} cm
                              {item.variant.color && ` - ${item.variant.color}`}
                            </p>
                          ) : (
                            (item.variant.color || item.variant.size) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.variant.color}{item.variant.color && item.variant.size ? ' / ' : ''}{item.variant.size}
                              </p>
                            )
                          )}
                          <div className="mt-1 flex flex-col">
                            <p className="text-sm font-bold text-brand-primary">{item.variant.price.toFixed(2)} TL</p>
                            {item.variant.originalPrice && item.variant.originalPrice > item.variant.price && (
                              <p className="text-xs text-gray-400 line-through">{item.variant.originalPrice.toFixed(2)} TL</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="p-1.5 text-gray-500 hover:bg-gray-100"><MinusIcon className="h-3 w-3" /></button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="p-1.5 text-gray-500 hover:bg-gray-100"><PlusIcon className="h-3 w-3" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`${item.productName} ürününü kaldır`}>
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center font-semibold mb-4 text-lg">
                  <span>Toplam</span>
                  <span className="text-brand-primary">{cartTotal.toFixed(2)} TL</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-primary text-white py-3.5 text-center hover:bg-brand-dark transition-colors font-bold rounded-lg shadow-md"
                >
                  Ödemeye Geç
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
