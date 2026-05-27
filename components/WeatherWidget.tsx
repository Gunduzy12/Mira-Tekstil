"use client";

import React, { useState, useEffect } from 'react';

interface WeatherWidgetProps {
    productCategory?: string;
    productName?: string;
}

interface CityCoords {
    name: string;
    lat: number;
    lon: number;
}

const CITIES: CityCoords[] = [
    { name: 'Antalya', lat: 36.8841, lon: 30.7056 },
    { name: 'İstanbul', lat: 41.0082, lon: 28.9784 },
    { name: 'Ankara', lat: 39.9334, lon: 32.8597 },
    { name: 'İzmir', lat: 38.4192, lon: 27.1287 },
    { name: 'Bursa', lat: 40.1885, lon: 29.0610 },
    { name: 'Adana', lat: 37.0017, lon: 35.3250 },
    { name: 'Hatay', lat: 36.2021, lon: 36.1606 },
    { name: 'Muğla', lat: 37.2181, lon: 28.3665 }
];

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ productCategory = '', productName = '' }) => {
    const [selectedCity, setSelectedCity] = useState<string>('Antalya');
    const [temperature, setTemperature] = useState<number | null>(null);
    const [weatherCode, setWeatherCode] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            setError(false);
            const city = CITIES.find(c => c.name === selectedCity);
            if (!city) return;

            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
                );
                if (!response.ok) throw new Error('API Error');
                const data = await response.json();
                if (data?.current_weather) {
                    setTemperature(Math.round(data.current_weather.temperature));
                    setWeatherCode(data.current_weather.weathercode);
                }
            } catch (err) {
                console.error('Error fetching weather data:', err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [selectedCity]);

    // WMO Weather Interpretation Codes (https://open-meteo.com/en/docs)
    const getWeatherCondition = (code: number | null): { text: string; icon: string } => {
        if (code === null) return { text: 'Bilinmiyor', icon: '☁️' };
        if (code === 0) return { text: 'Açık, Güneşli', icon: '☀️' };
        if (code >= 1 && code <= 3) return { text: 'Parçalı Bulutlu', icon: '⛅' };
        if (code >= 45 && code <= 48) return { text: 'Sisli', icon: '🌫️' };
        if (code >= 51 && code <= 67) return { text: 'Yağmurlu', icon: '🌧️' };
        if (code >= 71 && code <= 77) return { text: 'Karlı', icon: '❄️' };
        if (code >= 80 && code <= 82) return { text: 'Sağanak Yağış', icon: '🌦️' };
        if (code >= 95 && code <= 99) return { text: 'Fırtına', icon: '⛈️' };
        return { text: 'Bulutlu', icon: '☁️' };
    };

    const condition = getWeatherCondition(weatherCode);

    // Kategoriye ve hava durumuna göre akıllı öneri motoru
    const getRecommendation = () => {
        const cat = (productCategory + ' ' + productName).toLowerCase();
        const temp = temperature !== null ? temperature : 20;

        const isBlackout = cat.includes('blackout') || cat.includes('karartma') || cat.includes('black out') || cat.includes('karanlık');
        const isTul = cat.includes('tül') || cat.includes('tul') || cat.includes('organze') || cat.includes('sade tül');
        const isSaten = cat.includes('saten') || cat.includes('parlak') || cat.includes('fon');

        if (isBlackout) {
            if (temp >= 24) {
                return `${selectedCity}'da bugün sıcaklık ${temp}°C ve güneş etkisini hissettiriyor. Bu sıcak havada evinizin iç mekan ısısını korumak ve klima enerjisinden tasarruf etmek için blackout (karartma) perdelerimiz %100 güneş koruması ve yüksek ısı yalıtımı sunar.`;
            } else {
                return `${selectedCity}'da hava ${temp}°C. Kaliteli bir uyku ortamı oluşturmak ve gün ışığını tamamen engellemek için blackout perdelerimiz oda sıcaklığını dengeleyerek mükemmel bir loşluk sağlar.`;
            }
        }

        if (isTul) {
            if (temp >= 20) {
                return `${selectedCity} semalarında parlak bir gün! Zarif tül perdelerimiz, gün ışığını odanıza en estetik şekilde süzerek aydınlık ve ferah bir yaşam alanı oluştururken mahremiyetinizi de korur.`;
            } else {
                return `${selectedCity}'da bugün sıcaklık ${temp}°C. Evinize taze ve aydınlık bir hava katmak için düz ve dökümlü tül perde modellerimizi fon perdelerinizle kolayca kombinleyebilirsiniz.`;
            }
        }

        if (isSaten) {
            return `${selectedCity}'da hava ${temp}°C. Saten fon perdelerimiz, parlak dokusuyla güneş ışığı altında odanıza asil bir ışıltı ve şıklık katmak için mükemmel bir tercihtir.`;
        }

        // Genel / Fallback öneri
        if (temp >= 25) {
            return `${selectedCity}'da sıcaklık ${temp}°C'ye ulaştı. Evinizi güneşin yakıcı etkilerinden korurken dekoratif şıklığı korumak için kalın kumaşlı perdelerimizi tercih edebilirsiniz.`;
        }
        return `${selectedCity}'da bugün sıcaklık ${temp}°C. Pencerelerinize tam oturan, ısı ve ışık kontrolü sağlayan özel dikim perde koleksiyonlarımızı keşfedin.`;
    };

    const getCitySlug = (cityName: string): string => {
        const map: Record<string, string> = {
            'İstanbul': 'istanbul',
            'Ankara': 'ankara',
            'İzmir': 'izmir',
            'Antalya': 'antalya',
            'Bursa': 'bursa',
            'Adana': 'adana',
            'Hatay': 'hatay',
            'Muğla': 'mugla'
        };
        return map[cityName] || 'antalya';
    };

    return (
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                <div>
                    <h4 className="font-serif font-bold text-base text-brand-primary">Akıllı Perde Asistanı</h4>
                    <p className="text-xs text-gray-500">Şehrinizin havasına göre perde tavsiyesi</p>
                </div>
                
                {/* Şehir Seçici */}
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="text-sm bg-brand-bg border border-brand-border rounded-md py-1 px-3 focus:outline-none focus:ring-1 focus:ring-brand-secondary cursor-pointer text-brand-primary"
                    aria-label="Hava durumu için şehir seçimi"
                >
                    {CITIES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Hava Durumu Ekranı */}
            <div className="space-y-4">
                {/* Resmi HavaPusula Widget'ı */}
                <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 border border-brand-border/60 rounded-xl p-4 shadow-inner max-w-sm mx-auto">
                    <iframe
                        src={`https://havapusula.com.tr/widget/${getCitySlug(selectedCity)}`}
                        width="300"
                        height="160"
                        frameBorder="0"
                        scrolling="no"
                        className="rounded-lg"
                    ></iframe>
                    <div style={{ width: '300px', textAlign: 'center' }} className="mt-2">
                        <a
                            href="https://havapusula.com.tr"
                            target="_blank"
                            rel="dofollow"
                            style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}
                            className="hover:text-brand-secondary transition-colors font-bold"
                        >
                            Hava Durumu
                        </a>
                    </div>
                </div>

                {/* Öneri Yazısı */}
                {!isLoading && !error && (
                    <div className="text-sm text-gray-600 leading-relaxed bg-brand-light/40 p-3 rounded-lg border border-brand-border/30">
                        <strong className="text-brand-secondary text-xs block mb-1 uppercase tracking-wider">Öneri:</strong>
                        {getRecommendation()}
                    </div>
                )}
            </div>

            {/* Contextual & Branded City Deep Link */}
            <div className="border-t border-gray-100 pt-3 mt-4 text-center">
                <span className="text-[11px] text-gray-400">
                    Detaylı rapor için{" "}
                    <a
                        href={`https://www.havapusula.com.tr/hava/${getCitySlug(selectedCity)}`}
                        target="_blank"
                        rel="dofollow"
                        className="font-bold text-brand-secondary hover:underline inline-flex items-center gap-0.5"
                        title={`${selectedCity} Hava Durumu`}
                    >
                        {selectedCity} Hava Durumu
                    </a>{" "}
                    sayfasını ziyaret edebilirsiniz.
                </span>
            </div>
        </div>
    );
};
