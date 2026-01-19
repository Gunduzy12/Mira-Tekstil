
import React, { useState } from 'react';
import { CloseIcon, ChevronDownIcon, ChevronUpIcon, RulerIcon, EditIcon } from './Icons';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState<string | null>('tul');
  const [showTools, setShowTools] = useState(false);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Custom Ladder Icon
  const LadderIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5v18h14V3zm-2 16H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V9h10v2zm0-4H7V5h10v2z" opacity="0.6"/>
        <path d="M8 5h8v2H8V5zm0 4h8v2H8V9zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-brand-primary">Perde Ölçü Rehberi</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <CloseIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 custom-scrollbar">
            {/* Banner Image Placeholder */}
            <div className="relative rounded-lg overflow-hidden mb-6 bg-gray-100 border border-gray-200">
                {/* User requested Imgur placeholders to replace later */}
                <img 
                    src="https://imgur.com/GVz7gi6.jpg" 
                    alt="Perde Ölçüsü Nasıl Alınır Banner" 
                    className="w-full h-auto object-cover min-h-[150px]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x300/E35606/white?text=Perde+%C3%96l%C3%A7%C3%BC+Rehberi+Banner';
                    }}
                />
            </div>

            {/* Tools Toggle Button */}
            <button 
                onClick={() => setShowTools(!showTools)}
                className="w-full bg-[#E35606] text-white py-3 px-4 rounded-md font-bold mb-4 flex justify-between items-center hover:bg-[#c94b05] transition-colors shadow-md"
            >
                <span>Ölçü Almak İçin Nelere İhtiyacımız var?</span>
                {showTools ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
            </button>

            {/* Tools Content */}
            {showTools && (
                <div className="mb-6 p-6 bg-white border border-gray-200 rounded-md text-center animate-fadeIn shadow-sm">
                    <p className="text-gray-600 mb-6 font-medium">Ölçü almaya geçmeden önce birkaç malzemeye ihtiyacın olacak!</p>
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#E35606] flex items-center justify-center mb-2 bg-orange-50">
                                <RulerIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#E35606]" />
                            </div>
                            <span className="font-bold text-[#E35606] text-sm sm:text-base">Metal Mezura</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#E35606] flex items-center justify-center mb-2 bg-orange-50">
                                <EditIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#E35606]" />
                            </div>
                            <span className="font-bold text-[#E35606] text-sm sm:text-base">Kalem/Defter</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#E35606] flex items-center justify-center mb-2 bg-orange-50">
                                <LadderIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#E35606]" />
                            </div>
                            <span className="font-bold text-[#E35606] text-sm sm:text-base">Merdiven</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Accordion Header */}
            <div className="bg-[#E35606] text-white py-3 px-4 rounded-t-md font-bold text-center shadow-md text-lg">
                Perde Çeşitlerine Göre Nasıl Ölçü Alınır?
            </div>

            <div className="border border-gray-200 rounded-b-md divide-y divide-gray-200 shadow-sm">
                {/* 1. Tül Perde Section */}
                <div className="group">
                    <button 
                        onClick={() => toggleSection('tul')}
                        className="w-full py-4 px-6 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-gray-800"
                    >
                        <span>Tül Perde Ölçüsü Nasıl Alınır?</span>
                        {openSection === 'tul' ? <ChevronUpIcon className="w-5 h-5 text-[#E35606]"/> : <ChevronDownIcon className="w-5 h-5 text-gray-400"/>}
                    </button>
                    {openSection === 'tul' && (
                        <div className="p-6 bg-white text-gray-600 text-sm leading-relaxed space-y-4 animate-fadeIn border-t border-gray-100">
                            <ul className="list-disc list-inside space-y-3 marker:text-[#E35606]">
                                <li>
                                    Perdenin <strong>boy ölçüsü</strong> alınırken, kornişten (perdenin takılacağı yerden) istenilen yere, metal mezura kullanarak ölçüm yapabilirsiniz. 
                                    Uzun isteniyorsa yere, kısa isteniyorsa peteğe kadar ölçüm yapılır. Çıkan ölçüden 2-5 cm kısa sipariş edebilirsiniz. 
                                    Perdenin yere değmemesine dikkat edilmelidir.
                                </li>
                                <li>
                                    <strong>Tül perde genişliğinin ölçüsü</strong> perdenin yapılacağı mekanın durumuna göre belirlenir. Salon perdeleri için duvardan duvara ölçü tercih edilebilir. 
                                    Bunun için metal mezura kullanarak duvarınızın genişliğini boydan boya ölçüp çıkan ölçünün, seyrek pile isterseniz 2 katı, sık pile için 3 katı sipariş edebilirsiniz.
                                </li>
                                <li>
                                    Duvardan duvara değil de sadece pencereyi kapsayacak şekilde tül perde alınacaksa mezura yardımıyla pencerenin genişliği ölçülüp, 
                                    çıkan ölçüye sağdan ve soldan ayrı ayrı <strong>20 ya da 30 cm ilave edilir</strong>. Yani toplamda 40 ya da 60 cm eklenmiş olur. 
                                    Seyrek pile için 2, sık pile için 3 katı ile çarpmalısınız. Çıkan ölçüleri EN x BOY şeklinde sipariş verebilirsiniz.
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* 2. Fon Perde Section */}
                <div className="group">
                    <button 
                        onClick={() => toggleSection('fon')}
                        className="w-full py-4 px-6 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-gray-800"
                    >
                        <span>Fon Perde Ölçüsü Nasıl Alınır?</span>
                        {openSection === 'fon' ? <ChevronUpIcon className="w-5 h-5 text-[#E35606]"/> : <ChevronDownIcon className="w-5 h-5 text-gray-400"/>}
                    </button>
                    {openSection === 'fon' && (
                        <div className="p-6 bg-white text-gray-600 text-sm leading-relaxed space-y-4 animate-fadeIn border-t border-gray-100">
                            <ul className="list-disc list-inside space-y-3 marker:text-[#E35606]">
                                <li>
                                    Kornişten yere olan yüksekliği metal mezura yardımıyla ölçüp, perdenizin yere değmesini istemiyorsanız <strong>2-5 cm daha kısa</strong> şekilde sipariş verebilirsiniz. 
                                    Yere yığılma şeklinde bir duruş sergilemek isterseniz, tavandan yere kadar olan ölçüye 15 cm ilave edebilirsiniz.
                                </li>
                                <li>
                                    <strong>Fon perdenin 2 farklı kullanım alanı vardır;</strong>
                                    <div className="mt-3 pl-4 border-l-4 border-gray-100 space-y-3">
                                        <p>
                                            <span className="font-bold text-gray-800 block mb-1">Dekor Amaçlı:</span>
                                            Sağ ve sol taraf için ayrı ayrı olmak üzere ideal en; 70-90 cm arasındadır. Seyrek pileli görünüm için 2 katı, sık pileli görünüm için 3 katı sipariş verebilirsiniz. 
                                            Gündüz içeri giren ışığın kesilmemesi için çok geniş sipariş edilmemesine dikkat edilmelidir.
                                        </p>
                                        <p>
                                            <span className="font-bold text-gray-800 block mb-1">Blackout (Karartma) Amaçlı:</span>
                                            Pencerenizin ışığı kapatmasını istiyorsanız, mezura yardımıyla pencerenizin genişliğini ölçüp çıkan sonuca, sağdan ve soldan ayrı ayrı <strong>20 ya da 30 cm ilave edebilirsiniz</strong> ki dışarıdan ışık girmesin. 
                                            Çıkan ölçüyü seyrek pile istiyorsanız 2 katı, sık pileli istiyorsanız 3 katı ile çarpmalısınız.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* 3. Stor ve Zebra Perde Section */}
                <div className="group">
                    <button 
                        onClick={() => toggleSection('stor')}
                        className="w-full py-4 px-6 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-gray-800"
                    >
                        <span>Stor ve Zebra Perde Ölçüsü Nasıl Alınır?</span>
                        {openSection === 'stor' ? <ChevronUpIcon className="w-5 h-5 text-[#E35606]"/> : <ChevronDownIcon className="w-5 h-5 text-gray-400"/>}
                    </button>
                    {openSection === 'stor' && (
                        <div className="p-6 bg-white text-gray-600 text-sm leading-relaxed space-y-6 animate-fadeIn border-t border-gray-100">
                            
                            {/* Diagram Title */}
                            <div className="bg-[#E35606] text-white py-2 text-center font-bold rounded shadow-sm">
                                STOR VE ZEBRA PERDE ÖLÇÜ ALMA ŞEMASI
                            </div>
                            
                            {/* Diagram Image Placeholder */}
                            <div className="flex justify-center">
                                <img 
                                    src="https://imgur.com/XGHyxTf.jpg" 
                                    alt="Stor Perde Ölçü Şeması" 
                                    className="max-w-full h-auto rounded border border-gray-300 shadow-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f3f4f6/a1a1aa?text=Stor+Perde+Semasi';
                                    }}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-3 text-base">Storun pencere içine tam oturmasını istiyorsanız;</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Pencerenin iç genişliğini pervaz içinden metal mezura yardımıyla ölçün, bu değer perdenin genişlik ölçüsünü (enini) verecektir, 
                                        sonra da pervaz içinden pencerenin yüksekliğini ölçün. Bu iki ölçüyü <strong>EN x BOY</strong> olarak sipariş verebilirsiniz.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-3 text-base">Eğer storun pencere dışına taşmasını istiyorsanız;</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Perdenin boyunu hesaplarken perdeyi asacağınız yerden pencere bitimine kadar olan yüksekliği ölçüp, (boyunu) <strong>10 cm daha uzun</strong> şekilde sipariş verebilirsiniz. 
                                        Pencere genişliğini (enini) hesaplarken; pencerenin genişliğini pervaz dışından ölçün, eğer pay varsa çıkan ölçüye sağdan 10 cm, soldan 10 cm toplamda <strong>(enini) 20 cm fazla</strong> sipariş verebilirsiniz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button onClick={onClose} className="bg-gray-800 text-white px-8 py-2.5 rounded hover:bg-gray-700 transition-colors font-medium shadow-sm">
                Kapat
            </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
