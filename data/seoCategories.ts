import { SEOCategory, SEOParentCategory } from '../types';

const BASE_URL = 'https://miratekstiltr.com';

// =============================================
// ÜST KATEGORİLER
// =============================================
export const seoParentCategories: SEOParentCategory[] = [
    {
        slug: 'perde',
        name: 'Perde',
        title: 'Perde Modelleri ve Fiyatları 2025 | MiraTekstil',
        metaDescription: 'En şık perde modelleri, blackout perde, saten perde, tül perde ve özel ölçü perde seçenekleri uygun fiyatlarla MiraTekstil\'de. Ücretsiz kargo fırsatı!',
        h1: 'Perde Modelleri',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Evinizin dekorasyonunu tamamlayan en önemli unsurlardan biri olan perde, hem estetik hem de fonksiyonel bir görev üstlenir. Doğru perde seçimi, odanızın atmosferini tamamen değiştirebilir. MiraTekstil olarak, yaşam alanlarınıza uygun geniş perde koleksiyonumuzu sizlere sunuyoruz.'
            },
            {
                type: 'heading',
                content: 'Perde Çeşitleri ve Kullanım Alanları'
            },
            {
                type: 'paragraph',
                content: 'Blackout perdeler yatak odanızda tam karanlık sağlarken, saten perdeler salonunuza zarif bir hava katar. Tül perdeler ise doğal ışığı süzerek odanıza ferah bir ambiyans yaratır. Her oda için farklı perde ihtiyaçlarınızı tek bir adresten karşılayabilirsiniz.'
            },
            {
                type: 'heading',
                content: 'Perde Seçiminde Dikkat Edilmesi Gerekenler'
            },
            {
                type: 'paragraph',
                content: 'Perde seçerken odanın boyutunu, pencerenin yönünü ve istediğiniz ışık kontrolü seviyesini göz önünde bulundurmalısınız. Güney cepheli odalarda güneş geçirmeyen blackout perdeler, kuzey cepheli odalarda ise ışık geçiren tül perdeler idealdir. Kumaş kalitesi, dikiş işçiliği ve ölçü hassasiyeti de perde alırken dikkat etmeniz gereken önemli detaylardır.'
            },
            {
                type: 'heading',
                content: 'MiraTekstil Perde Farkı'
            },
            {
                type: 'paragraph',
                content: 'MiraTekstil olarak tüm perdelerimizi birinci sınıf kumaşlardan, özenli dikiş işçiliğiyle üretiyoruz. Standart ölçülerin yanı sıra özel ölçü perde dikimi hizmeti de sunuyoruz. Pencerelerinize birebir oturan, kusursuz perdeler için bize güvenebilirsiniz. 500 TL üzeri siparişlerde ücretsiz kargo ayrıcalığından faydalanın.'
            },
            {
                type: 'heading',
                content: 'Sık Tercih Edilen Perde Modelleri'
            },
            {
                type: 'list',
                content: 'Popüler perde kategorilerimiz:',
                items: [
                    'Karartma blackout perde - Tam karanlık için ideal',
                    'Parlak saten perde - Salon ve oturma odaları için zarif seçim',
                    'Sade tül perde - Doğal ışık geçiren şık tasarımlar',
                    'Özel ölçü perde dikimi - Her pencereye birebir uyum'
                ]
            },
            {
                type: 'paragraph',
                content: 'Her bütçeye uygun fiyat seçenekleri, kolay iade garantisi ve hızlı teslimat ile perde alışverişinizi keyifli hale getiriyoruz. Koleksiyonumuzu inceleyerek evinize en uygun perde modelini bulabilirsiniz.'
            }
        ],
        children: [
            { name: 'Blackout Perde', slug: 'blackout-perde', description: 'Tam karartma sağlayan blackout perde modelleri' },
            { name: 'Saten Perde', slug: 'saten-perde', description: 'Zarif ve parlak saten perde koleksiyonu' },
            { name: 'Tül Perde', slug: 'tul-perde', description: 'Işık geçiren şık tül perde çeşitleri' },
            { name: 'Özel Ölçü Perde', slug: 'ozel-olcu-perde', description: 'Pencerelerinize özel ölçülerde perde dikimi' },
        ]
    },
    {
        slug: 'ev-tekstili',
        name: 'Ev Tekstili',
        title: 'Ev Tekstili Ürünleri | Yastık Kılıfı & Dekorasyon | MiraTekstil',
        metaDescription: 'Dekoratif yastık kılıfları ve ev tekstili ürünleri MiraTekstil\'de. Modern tasarımlar, kaliteli kumaşlar ve uygun fiyatlar. Hemen keşfedin!',
        h1: 'Ev Tekstili Ürünleri',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Evinizi bir yuvaya dönüştüren detaylar, ev tekstili ürünlerinde gizlidir. Dekoratif yastık kılıflarından koltuk örtülerine kadar geniş ev tekstili koleksiyonumuz ile yaşam alanlarınıza sıcaklık ve şıklık katın.'
            },
            {
                type: 'heading',
                content: 'Ev Dekorasyonunda Tekstilin Önemi'
            },
            {
                type: 'paragraph',
                content: 'Bir odanın havasını değiştirmenin en kolay yolu, tekstil aksesuarlarını yenilemektir. Doğru renk ve desende bir yastık kılıfı seti, salonunuzu tamamen farklı bir mekan gibi gösterebilir. MiraTekstil olarak modern tasarımları kaliteli kumaşlarla buluşturarak evinize değer katan ürünler sunuyoruz.'
            },
            {
                type: 'heading',
                content: 'Kaliteli Kumaş, Uzun Ömürlü Kullanım'
            },
            {
                type: 'paragraph',
                content: 'Tüm ev tekstili ürünlerimiz birinci sınıf kumaşlardan üretilmektedir. Yıkama sonrası formunu koruyacak, renkleri solmayacak ürünler için doğru adrestesiniz. Her mevsime uygun farklı doku ve kalınlıkta seçeneklerle evinizi her dönem yenileyebilirsiniz.'
            }
        ],
        children: [
            { name: 'Yastık Kılıfı', slug: 'yastik-kilifi', description: 'Dekoratif ve modern yastık kılıfı modelleri' },
        ]
    },

];

// =============================================
// ALT KATEGORİLER (SEO LANDING PAGES)
// =============================================
export const seoCategories: SEOCategory[] = [
    // BLACKOUT PERDE
    {
        parentSlug: 'perde',
        categorySlug: 'blackout-perde',
        firebaseCategoryName: 'Blackout Perde',
        title: 'Blackout Perde Modelleri ve Fiyatları 2025 | Karartma Perde | MiraTekstil',
        metaDescription: 'Karartma blackout perde modelleri ve fiyatları. Güneş geçirmeyen tam karartma perde, yatak odası karartma perde seçenekleri. Özel ölçü blackout perde dikimi.',
        h1: 'Blackout Perde Modelleri',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Karartma blackout perde, güneş ışığını tamamen keserek yaşam alanlarınızda ideal karanlık ortamı sağlayan fonksiyonel bir perde türüdür. Özellikle yatak odalarında tercih edilen tam karartma perde modelleri, kaliteli uyku düzeni için vazgeçilmezdir.'
            },
            {
                type: 'heading',
                content: 'Blackout Perde Nedir ve Neden Tercih Edilir?'
            },
            {
                type: 'paragraph',
                content: 'Blackout perde, özel dokuma teknikleriyle üretilen, güneş geçirmeyen kumaşlardan yapılmış perdelerdir. Normal perdelerden farklı olarak ışığı %99-100 oranında engeller. Gündüz uyuyanlar, gece vardiyası çalışanları ve bebek odaları için ideal bir çözümdür. Ayrıca yaz aylarında odanızı serin tutarak enerji tasarrufu sağlar.'
            },
            {
                type: 'heading',
                content: 'Blackout Perde Kullanım Alanları'
            },
            {
                type: 'list',
                content: 'Blackout perde şu alanlarda ideal performans gösterir:',
                items: [
                    'Yatak odası - Tam karanlık ile kaliteli uyku',
                    'Bebek/çocuk odası - Gündüz uykuları için ideal',
                    'Ev sinema odası - Yansıma olmadan film keyfi',
                    'Ofis ve toplantı odaları - Projeksiyon için ideal ortam',
                    'Güneye bakan odalar - Sıcak kontrolü ve UV koruması'
                ]
            },
            {
                type: 'heading',
                content: 'Blackout Perde Özel Ölçü Seçenekleri'
            },
            {
                type: 'paragraph',
                content: 'Her pencerenin boyutu farklıdır. MiraTekstil olarak standart ölçülerin yanı sıra blackout perde özel ölçü dikimi hizmeti de sunuyoruz. Genişlik ve yükseklik değerlerini belirleyerek pencerelerinize birebir oturan karartma perde siparişi verebilirsiniz.'
            },
            {
                type: 'heading',
                content: 'Blackout Perde Bakımı'
            },
            {
                type: 'paragraph',
                content: 'Blackout perdeler düşük sıcaklıkta makine yıkamaya uygundur. Ütü gerektirmeyen kumaş yapısı sayesinde bakımı kolaydır. Düzenli toz alma ve periyodik yıkama ile uzun yıllar ilk günkü performansını korur.'
            }
        ],
        faq: [
            {
                question: 'Blackout perde güneş ışığını tamamen keser mi?',
                answer: 'Evet, kaliteli blackout perde kumaşları güneş ışığının %99-100\'ünü keserek odanızda tam karanlık ortam sağlar. MiraTekstil blackout perdeleri birinci sınıf karartma kumaşlarından üretilmektedir.'
            },
            {
                question: 'Blackout perde yatak odası için uygun mu?',
                answer: 'Blackout perde yatak odası için en ideal perde türüdür. Gece boyunca dış ışık kaynaklarını engeller, sabah güneşinin erken saatte sizi uyandırmasını önler ve derin uyku kalitesini artırır.'
            },
            {
                question: 'Blackout perde özel ölçü yaptırabilir miyim?',
                answer: 'Evet! MiraTekstil olarak istediğiniz genişlik ve yükseklikte özel ölçü blackout perde dikimi yapıyoruz. Ürün sayfasından ölçülerinizi girerek sipariş verebilirsiniz.'
            },
            {
                question: 'Blackout perde nasıl yıkanır?',
                answer: 'Blackout perdeler 30 derece hassas programda makine yıkamaya uygundur. Ağartıcı kullanmayın. Sıkmadan asarak kurutun. Ütü gerektirmez.'
            }
        ],
        keywords: [
            'karartma blackout perde',
            'güneş geçirmeyen perde',
            'tam karartma perde',
            'blackout perde özel ölçü',
            'yatak odası karartma perde'
        ]
    },

    // SATEN PERDE
    {
        parentSlug: 'perde',
        categorySlug: 'saten-perde',
        firebaseCategoryName: 'Saten Perde',
        title: 'Saten Perde Modelleri ve Fiyatları 2025 | Parlak Saten Perde | MiraTekstil',
        metaDescription: 'Parlak saten perde modelleri, salon için saten perde ve modern özel dikim seçenekleri. En şık saten perde fiyatları MiraTekstil\'de!',
        h1: 'Saten Perde Modelleri',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Parlak saten perde, zarif dokusu ve ışıltılı görünümüyle salonunuza ve oturma odanıza lüks bir hava katan dekoratif perde türüdür. Saten kumaşın doğal parlaklığı, ışıkla buluştuğunda odanıza sofistike bir ambiyans yaratır.'
            },
            {
                type: 'heading',
                content: 'Saten Perde Neden Salonlar İçin İdealdir?'
            },
            {
                type: 'paragraph',
                content: 'Salon için saten perde seçimi, mekanınızın görsel kalitesini bir üst seviyeye taşır. Saten kumaşın yumuşak döküşü ve ipeksi parlaklığı, hem klasik hem modern dekorasyonlara mükemmel uyum sağlar. Misafirlerinizi ağırladığınız salon ve oturma odalarınız için en doğru tercih saten perdedir.'
            },
            {
                type: 'heading',
                content: 'Saten Perde Renk ve Model Seçenekleri'
            },
            {
                type: 'paragraph',
                content: 'Modern saten perde modeli arayışınızda geniş renk yelpazemizi inceleyebilirsiniz. Krem, bej, gri, bordo ve altın tonları en çok tercih edilen saten perde renkleridir. Düz, jakar desenli ve simli seçeneklerle evinizin dekoruna uygun modeli bulabilirsiniz.'
            },
            {
                type: 'heading',
                content: 'Özel Dikim Saten Perde'
            },
            {
                type: 'paragraph',
                content: 'MiraTekstil olarak özel dikim saten perde hizmeti sunuyoruz. Pencerelerinizin ölçülerine göre dikilen perdeler, kusursuz bir duruş ve estetik sağlar. Pileli, büzgülü veya düz dikim seçenekleri arasından tercih yapabilirsiniz.'
            }
        ],
        faq: [
            {
                question: 'Saten perde hangi odalar için uygundur?',
                answer: 'Saten perde özellikle salon, oturma odası ve yemek odası gibi temsili alanlarda harika görünür. Parlak yüzeyi sayesinde odanızı daha geniş ve aydınlık gösterir.'
            },
            {
                question: 'Saten perde ile tül perde birlikte kullanılır mı?',
                answer: 'Evet, saten perde ve tül perde kombinasyonu en çok tercih edilen perde düzenidir. İç kısma tül, dış kısma saten perde takarak hem gün ışığından faydalanabilir hem de istediğinizde karartma sağlayabilirsiniz.'
            },
            {
                question: 'Saten perde bakımı nasıl yapılır?',
                answer: 'Saten perdeler hassas kumaş programında 30 derecede yıkanmalıdır. Düşük sıcaklıkta ütülenebilir. Kurutma makinesine atmayın, serin gölgede asarak kurutun.'
            }
        ],
        keywords: [
            'parlak saten perde',
            'salon için saten perde',
            'özel dikim saten perde',
            'modern saten perde modeli'
        ]
    },

    // TÜL PERDE
    {
        parentSlug: 'perde',
        categorySlug: 'tul-perde',
        firebaseCategoryName: 'Tül Perde',
        title: 'Tül Perde Modelleri ve Fiyatları 2025 | Salon Tül Perde | MiraTekstil',
        metaDescription: 'Sade tül perde modelleri, salon için tül perde ve özel ölçü tül perde dikimi. En şık tül perde çeşitleri uygun fiyatlarla MiraTekstil\'de!',
        h1: 'Tül Perde Modelleri',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Sade tül perde modeli arayanlar için MiraTekstil geniş bir koleksiyon sunuyor. Tül perde, doğal gün ışığını süzerek odanıza ferah ve aydınlık bir atmosfer katar. Hafif ve zarif yapısıyla her mevsim kullanıma uygun olan tül perde, ev dekorasyonunun temel taşlarından biridir.'
            },
            {
                type: 'heading',
                content: 'Salon İçin Tül Perde Seçimi'
            },
            {
                type: 'paragraph',
                content: 'Salon için tül perde seçerken odanızın boyutuna, mobilya renklerine ve istediğiniz ışık geçirgenliğine dikkat etmelisiniz. Geniş salonlarda büyük desen ve pileli tüller şık dururken, küçük odalarda sade ve düz tüller mekanı daha geniş gösterir.'
            },
            {
                type: 'heading',
                content: 'Özel Ölçü Tül Perde Dikimi'
            },
            {
                type: 'paragraph',
                content: 'Her pencerenin ölçüsü farklıdır. Özel ölçü tül perde dikimi hizmetimiz ile pencerelerinize birebir oturan, profesyonel görünümlü tül perdeler elde edebilirsiniz. Genişlik ve yükseklik değerlerini girerek sipariş vermek çok kolay.'
            },
            {
                type: 'heading',
                content: 'Tül Perde Trendleri 2025'
            },
            {
                type: 'paragraph',
                content: 'Bu sezon sade ve minimalist tül perde modelleri ön planda. Düz beyaz ve krem tonlarında tüller, modern dekorasyonlarla mükemmel uyum sağlıyor. İşlemeli ve dantelli modeller ise klasik dekorasyon sevenlerin gözdesi olmaya devam ediyor.'
            }
        ],
        faq: [
            {
                question: 'Tül perde salon için uygun mu?',
                answer: 'Evet, tül perde salon için en çok tercih edilen perde türlerinden biridir. Doğal ışığı süzerek odanıza ferah bir ambiyans katar. Fon perde veya saten perde ile birlikte kullanarak hem aydınlık hem karartma seçeneği elde edebilirsiniz.'
            },
            {
                question: 'Tül perde özel ölçüde diktirebilir miyim?',
                answer: 'Evet, MiraTekstil olarak tüm tül perde modellerimizi istediğiniz ölçülerde dikiyoruz. Ürün sayfasından genişlik ve yükseklik belirleyerek özel ölçü sipariş verebilirsiniz.'
            },
            {
                question: 'Tül perde nasıl yıkanır?',
                answer: 'Tül perdeler 30 derecede hassas yıkama programında yıkanmalıdır. Daha iyi sonuç için çamaşır poşetine koyarak yıkayın. Sıkmadan, ıslak asarak kurutun ve hafif nemli iken düşük ısıda ütüleyin.'
            }
        ],
        keywords: [
            'sade tül perde modeli',
            'salon için tül perde',
            'özel ölçü tül perde dikimi'
        ]
    },

    // ÖZEL ÖLÇÜ PERDE
    {
        parentSlug: 'perde',
        categorySlug: 'ozel-olcu-perde',
        firebaseCategoryName: 'Özel Ölçü Perde',
        title: 'Özel Ölçü Perde Dikimi ve Fiyatları | MiraTekstil',
        metaDescription: 'Pencerelerinize özel ölçülerde perde dikimi hizmeti. Blackout, saten, tül - tüm perde türlerinde özel ölçü. Kolay sipariş, hızlı teslimat!',
        h1: 'Özel Ölçü Perde Dikimi',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Standart perde ölçüleri pencerelerinize uymadığında, özel ölçü perde dikimi en doğru çözümdür. MiraTekstil olarak her pencere tipine, her oda boyutuna uygun özel ölçülerde perde dikimi yapıyoruz.'
            },
            {
                type: 'heading',
                content: 'Özel Ölçü Perde Nasıl Sipariş Edilir?'
            },
            {
                type: 'paragraph',
                content: 'Sipariş süreci çok basit: İstediğiniz perde modelini seçin, genişlik ve yükseklik değerlerini santimetre olarak girin. Fiyat otomatik hesaplanır. Siparişiniz profesyonel dikiş ekibimiz tarafından özenle hazırlanarak kargoya verilir.'
            },
            {
                type: 'heading',
                content: 'Perde Ölçüsü Nasıl Alınır?'
            },
            {
                type: 'list',
                content: 'Doğru perde ölçüsü almak için şu adımları izleyin:',
                items: [
                    'Kornişin veya rayın toplam genişliğini ölçün',
                    'Yerden kornişe kadar olan yüksekliği ölçün',
                    'Her iki tarafa 10-15 cm taşma payı ekleyin',
                    'Yere kadar istiyor iseniz yerden 1-2 cm kısa bırakın'
                ]
            },
            {
                type: 'paragraph',
                content: 'Tüm perde türlerinde özel ölçü hizmeti sunuyoruz: blackout perde, saten perde, tül perde ve fon perde. Her model özel ölçülerle üretilebilir.'
            }
        ],
        faq: [
            {
                question: 'Özel ölçü perde ne kadar sürede hazır olur?',
                answer: 'Özel ölçü perdeler genellikle sipariş tarihinden itibaren 3-5 iş günü içinde hazırlanarak kargoya verilir. Yoğun dönemlerde bu süre 7 iş gününe kadar uzayabilir.'
            },
            {
                question: 'Özel ölçü perde iade edilebilir mi?',
                answer: 'Özel ölçü perdeler müşteriye özel üretildiği için standart iade kapsamı dışındadır. Ancak ölçü hatası veya üretim kaynaklı sorunlarda değişim yapılmaktadır.'
            },
            {
                question: 'Perde ölçümü için hizmet geliyor musunuz?',
                answer: 'Şu an için ölçüm hizmeti sunmuyoruz. Ancak ürün sayfalarımızdaki ölçü alma rehberimizi takip ederek doğru ölçülerinizi kolayca alabilirsiniz.'
            }
        ],
        keywords: [
            'özel ölçü perde dikimi',
            'perde ölçüsü nasıl alınır',
            'özel dikim perde fiyatları'
        ]
    },

    // YASTIK KILIFI
    {
        parentSlug: 'ev-tekstili',
        categorySlug: 'yastik-kilifi',
        firebaseCategoryName: 'Yastık Kılıfı',
        title: 'Dekoratif Yastık Kılıfı Modelleri ve Fiyatları | MiraTekstil',
        metaDescription: 'Dekoratif yastık kılıfı, salon yastık kılıfı ve modern yastık kılıfı modelleri. Kaliteli kumaş, şık tasarım. MiraTekstil\'de keşfedin!',
        h1: 'Yastık Kılıfı Modelleri',
        seoBlocks: [
            {
                type: 'paragraph',
                content: 'Dekoratif yastık kılıfı, evinizin dekorasyonunu en kolay ve ekonomik şekilde yenilemenin yoludur. Birkaç yastık kılıfı değişikliği ile salonunuzun havasını tamamen değiştirebilirsiniz.'
            },
            {
                type: 'heading',
                content: 'Salon Yastık Kılıfı Seçim Rehberi'
            },
            {
                type: 'paragraph',
                content: 'Salon yastık kılıfı seçerken koltuk renginize uyumlu veya kontrast renkler tercih edebilirsiniz. Modern dekorasyon trendlerinde geometrik desenler, pastel tonlar ve kadife dokular ön plandadır. Kaliteli bir yastık kılıfı hem yumuşak dokunuşu hem de solmayan renkleri ile uzun süre kullanılabilir.'
            },
            {
                type: 'heading',
                content: 'Yastık Kılıfı Kumaş Çeşitleri'
            },
            {
                type: 'paragraph',
                content: 'Modern yastık kılıfı modeli arayanlar için kadife, keten, saten ve pamuklu kumaş seçenekleri sunuyoruz. Her kumaş türü farklı bir ambiyans yaratır: kadife sıcak ve şık, keten doğal ve bohem, saten zarif ve parlak bir görünüm sağlar.'
            }
        ],
        faq: [
            {
                question: 'Yastık kılıfı hangi ölçülerde gelir?',
                answer: 'Yastık kılıflarımız standart 43x43 cm ve 45x45 cm ölçülerinde mevcuttur. Bazı modellerde dikdörtgen (30x50 cm) seçeneği de bulunmaktadır.'
            },
            {
                question: 'Dekoratif yastık kılıfları yıkanabilir mi?',
                answer: 'Evet, tüm yastık kılıflarımız 30 derecede makine yıkamaya uygundur. Renk haslığı test edilmiş kumaşlar kullanılmaktadır.'
            },
            {
                question: 'Yastık kılıfları ile birlikte iç yastık geliyor mu?',
                answer: 'Ürünlerimiz sadece dış kılıf olarak satılmaktadır. Standart ölçüdeki iç yastıklarınıza kolayca takabilirsiniz.'
            }
        ],
        keywords: [
            'dekoratif yastık kılıfı',
            'salon yastık kılıfı',
            'modern yastık kılıfı modeli'
        ]
    },


];

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Ürün adından hangi SEO alt kategorisine ait olduğunu tespit eder.
 * Firestore'da tüm ürünler category: "Perde" olarak kayıtlı,
 * bu yüzden ürün adındaki anahtar kelimelere bakarız.
 */
const subcategoryKeywords: { categorySlug: string; parentSlug: string; keywords: string[] }[] = [
    {
        categorySlug: 'blackout-perde',
        parentSlug: 'perde',
        keywords: ['blackout', 'karartma', 'fon perde', 'ışık geçirmez', 'isik gecirmez']
    },
    {
        categorySlug: 'saten-perde',
        parentSlug: 'perde',
        keywords: ['saten']
    },
    {
        categorySlug: 'tul-perde',
        parentSlug: 'perde',
        keywords: ['tül', 'tul']
    },
    {
        categorySlug: 'ozel-olcu-perde',
        parentSlug: 'perde',
        keywords: [] // Özel ölçü, isCustomSize=true olan ürünlerden ayrı değerlendirilir
    },
    {
        categorySlug: 'yastik-kilifi',
        parentSlug: 'ev-tekstili',
        keywords: ['yastık', 'yastik', 'kılıf', 'kilif', 'yorgan']
    },
    {
        categorySlug: 'cibinlik',
        parentSlug: 'cocuk',
        keywords: ['cibinlik']
    },
];

function detectSubcategoryFromName(productName: string): { parentSlug: string; categorySlug: string } | null {
    const nameLower = productName.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');

    const nameOriginalLower = productName.toLowerCase();

    for (const sub of subcategoryKeywords) {
        for (const keyword of sub.keywords) {
            const keyLower = keyword.toLowerCase();
            if (nameOriginalLower.includes(keyLower) || nameLower.includes(keyLower)) {
                return { parentSlug: sub.parentSlug, categorySlug: sub.categorySlug };
            }
        }
    }

    return null;
}

export function findSEOCategory(parentSlug: string, categorySlug: string): SEOCategory | undefined {
    return seoCategories.find(c => c.parentSlug === parentSlug && c.categorySlug === categorySlug);
}

export function findSEOParent(parentSlug: string): SEOParentCategory | undefined {
    return seoParentCategories.find(p => p.slug === parentSlug);
}

export function findSEOCategoryByFirebaseName(name: string): SEOCategory | undefined {
    return seoCategories.find(c => c.firebaseCategoryName === name);
}

export function getCategoryUrl(categoryName: string): string {
    // Önce direkt eşleşme dene
    const cat = findSEOCategoryByFirebaseName(categoryName);
    if (cat) return `/${cat.parentSlug}/${cat.categorySlug}`;

    // Firestore'daki genel "Perde" kategorisi → /perde
    if (categoryName.toLowerCase().includes('perde')) return '/perde';
    if (categoryName.toLowerCase().includes('yorgan') || categoryName.toLowerCase().includes('yastık')) return '/ev-tekstili';
    if (categoryName.toLowerCase().includes('cibinlik')) return '/cocuk';

    return '/perde';
}

/**
 * Ürün URL'i oluşturur.
 * Eğer ürünün slug, categorySlug, parentSlug alanları varsa direkt kullanır.
 * Yoksa ürün adından tespit eder (eski ürünler için fallback).
 */
export function getProductUrl(
    productName: string,
    productId: string,
    categoryName: string,
    productSlug?: string,
    productCategorySlug?: string,
    productParentSlug?: string
): string {
    // Eğer migration yapılmışsa (slug alanları var), direkt kullan
    if (productSlug && productCategorySlug && productParentSlug) {
        return `/${productParentSlug}/${productCategorySlug}/${productSlug}`;
    }

    // Fallback: ürün adından tespit et (migration öncesi ürünler için)
    const detected = detectSubcategoryFromName(productName);

    let parentSlug: string;
    let categorySlug: string;

    if (detected) {
        parentSlug = detected.parentSlug;
        categorySlug = detected.categorySlug;
    } else {
        parentSlug = 'perde';
        categorySlug = 'blackout-perde';
    }

    // Build product slug from name
    let slug = productName
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    if (slug.length > 60) {
        slug = slug.substring(0, 60).replace(/-[^-]*$/, '');
    }

    return `/${parentSlug}/${categorySlug}/${slug}-${productId}`;
}

/**
 * Firestore'dan çekilen ürünleri SEO kategorisine göre filtreler.
 * Ürün adına bakarak keyword matching yapar.
 */
export function filterProductsBySubcategory(
    products: { name: string }[],
    categorySlug: string
): typeof products {
    const subcategory = subcategoryKeywords.find(s => s.categorySlug === categorySlug);
    if (!subcategory || subcategory.keywords.length === 0) return products;

    return products.filter(product => {
        const nameLower = product.name.toLowerCase();
        const nameNorm = nameLower
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c');

        return subcategory.keywords.some(keyword => {
            const keyLower = keyword.toLowerCase();
            return nameLower.includes(keyLower) || nameNorm.includes(keyLower);
        });
    });
}

export function getAllValidParentSlugs(): string[] {
    return seoParentCategories.map(p => p.slug);
}

export function getAllValidCategorySlugs(): { parentSlug: string; categorySlug: string }[] {
    return seoCategories.map(c => ({ parentSlug: c.parentSlug, categorySlug: c.categorySlug }));
}

