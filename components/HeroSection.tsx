
import React from 'react';
import { useCategories } from '../context/CategoryContext';

interface HeroSectionProps {
    onNavigate: (view: 'shop') => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
    const { categories } = useCategories();
    
    // Select specific categories to feature or just take the first 3
    const featuredCategories = categories.slice(0, 3);

    return (
        <section className="bg-brand-light pb-12 md:pb-24">
            <div className="relative h-[50vh] md:h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1600')" }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-start text-white">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold max-w-2xl leading-tight">Zamansız Zarafet, Modern Dokunuş</h1>
                    <p className="mt-4 max-w-lg text-lg">Evinizin her köşesi için özenle seçilmiş, en kaliteli tekstil ürünlerini keşfedin.</p>
                    <button
                        onClick={() => onNavigate('shop')}
                        className="mt-8 bg-brand-bg text-brand-primary font-bold py-3 px-8 rounded-md hover:bg-brand-secondary hover:text-white transition-all duration-300 shadow-lg"
                    >
                        Koleksiyonu Keşfet
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-16 md:-mt-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {featuredCategories.map(category => (
                        <div key={category.id} onClick={() => onNavigate('shop')} className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer aspect-video md:aspect-square">
                           <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
                           <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
                           <div className="absolute bottom-6 left-6">
                               <h3 className="text-white text-2xl font-serif font-semibold">{category.name}</h3>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
