import { SEOContentBlock } from '../types';

const p = (content: string): SEOContentBlock => ({ type: 'paragraph', content });
const h = (content: string): SEOContentBlock => ({ type: 'heading', content });
const l = (content: string, items: string[]): SEOContentBlock => ({ type: 'list', content, items });

// Rehber yazılarına eklenen ek bölümler. Liste maddelerinde HTML kullanılmaz (düz metin olarak gösterilir).
export const guideExtras: Record<string, SEOContentBlock[]> = {
    'blackout-perde-nedir': [
        h('Blackout Perde Türleri'),
        l('Piyasada genel olarak şu yapılar bulunur:', [
            'Tek katlı sık dokulu blackout kumaş: daha hafif ve ince, dökümü sade.',
            'Astarlı (ekstraforlu) blackout: daha dolgun ve ağır, karartma ve döküm açısından güçlü.',
            'Arka yüzü ek katmanla kaplanan kumaşlar: karartmayı artırır; bakım talimatına özellikle dikkat edilmelidir.',
        ]),
        h('Blackout Perde Ne Zaman Gerekli Değildir?'),
        p(`Her oda karartma istemez. Gün ışığını sevdiğiniz salonlarda, ışığın zaten az girdiği kuzey cepheli odalarda veya çalışma odasında doğal ışığı kullanmak istiyorsanız blackout perde odayı gereğinden loş yapabilir. Bu durumda tül perdeyi esas alıp blackout perdeyi yalnızca ihtiyaç duyduğunuz saatlerde kapatacağınız ikinci katman olarak düşünebilirsiniz.`),
        h('Bir Günde Blackout Perde Kullanımı'),
        p(`Sabah güneşinin uykuyu bölmesini istemiyorsanız perdeyi geceden kapalı bırakabilirsiniz. Gündüz çalışırken veya oyun saatlerinde açıp tülle ışığı süzebilirsiniz. Akşam ışıkları yakıldığında tekrar kapatmak mahremiyet sağlar. Perde açıkken kenarda toplanan kumaş miktarını azaltmak için perdeyi geniş bir kornişe asmak pencerenin görüntüsünü kapatmaz.`),
    ],
    'ekstraforlu-perde-nedir': [
        h('Ekstraforlu Perde Nasıl Anlaşılır?'),
        l('Satın alırken şunlara bakın:', [
            'Ürün açıklamasında "ekstraforlu" veya "astarlı" ifadesi geçiyor mu?',
            'Perdeyi eliniz altında tuttuğunuzda iki ayrı kumaş katmanı hissediliyor mu?',
            'Kenar dikişinde iki kat kumaşın birleştiği çizgi görünüyor mu?',
            'Ürün ağırlığı ve kumaş bilgisi belirtilmiş mi?',
        ]),
        h('Fiyat ve Değer'),
        p(`İki kat kumaş ve ek dikiş işçiliği nedeniyle ekstraforlu perde genellikle tek katlı perdeden daha maliyetlidir. Karşılığında daha düzgün döküm, daha az ışık geçişi ve daha dolgun görünüm elde edersiniz. Bütçeniz sınırlıysa yatak odası gibi ışık kontrolünün önemli olduğu odalarda tercih edip diğer odalarda daha hafif perdeleri değerlendirebilirsiniz.`),
        h('Bakım ve Saklama'),
        l('Perdenin ömrünü uzatmak için:', [
            'Yıkamadan önce etiket talimatını mutlaka okuyun; astarlı yapıda küçülme farkı olabilir.',
            'Yıkamada filede ve düşük devirde yıkayın, sıkıp çevirmeyin.',
            'Islakken kornişe asarak kuruyun; astar ve ön kumaşın düzgün kuruması için perdeyi düzeltin.',
            'Mevsim değişiminde saklayacaksanız tam kuruduktan sonra katlayıp nemsiz yerde bekletin.',
        ]),
    ],
    'saten-perde-nedir': [
        h('Saten Perde Fiyat ve Kalite İpuçları'),
        l('Kaliteli saten perdeyi ayırt etmek için:', [
            'Yüzeyin pürüzsüz ve eşit parlaklıkta olması; leke veya çekik iplik olmaması.',
            'Dikişlerin düzgün ve kenarların kıvrılmaması.',
            'Kumaş bilgisi (polyester gibi) ve bakım talimatının açıkça yazılması.',
            'Doğal ışık altında renk tonunun fotoğrafla uyuşması.',
        ]),
        h('Saten Perde Nasıl Asılır?'),
        p(`Saten kumaş akışkan olduğu için kornişe düzgün dağılması önemlidir. Halkaları eşit aralıkla yerleştirin ve perdeyi hafifçe çekerek asın. Pilesiz (1x1) modellerde kumaş düz durur, pileli modellerde ise dalgalı bir görünüm oluşur. Ölçü ve pile hesabı için <a href="/blog/perde-pile-hesabi-nasil-yapilir" class="underline">pile hesabı rehberimize</a> bakın.`),
        h('Saten Perde İçin Doğru Aydınlatma'),
        p(`Parlak yüzey ışığı yansıttığı için odanın aydınlatmasıyla görünümü değişir. Sıcak ışıkta saten perde daha yumuşak ve altın tonlu, soğuk ışıkta daha parlak ve net görünür. Perdeyi seçerken odanın akşam ışığını da düşünün.`),
    ],
    'fon-perde-ile-tul-perde-farki': [
        h('Fon ve Tül Perdenin Montaj Farkları'),
        l('Montajda dikkat edilecekler:', [
            'Fon perde ağır olduğu için dayanıklı korniş ve sağlam duvar montajı gerekir.',
            'Tül hafif olduğu için ince kornişte de rahat durur; ancak çift raylı sistemde iki katman da aynı anda taşınır.',
            'Tülü pencereye yakın, fon perdeyi dış rayda asmak, perdelerin birbirine sürtünmesini azaltır.',
            'İki katmanı farklı uzunluklarda seçmek (örneğin tül biraz daha kısa) görünüm olarak da pratik olabilir.',
        ]),
        h('Fon ve Tül Birlikte Bütçeyi Nasıl Planlar?'),
        p(`İki katman için toplam maliyet tek perdeye göre doğal olarak daha yüksektir. Bütçeyi bölmek isterseniz önce yatak odasında blackout fon perdeyi, salonda ise tül veya saten perdeyi alıp zamanla diğer katmanları ekleyebilirsiniz.`),
        h('Sık Yapılan Hatalar'),
        l('Kaçının:', [
            'İki katman için tek raylı korniş alıp sonradan ek ray sorunu yaşamak.',
            'Tül ve fon perde rengini birbirine tamamen zıt seçmek.',
            'Tül perdenin pilesini düşük tutup pencerede ince ve boş görünmesine yol açmak.',
        ]),
    ],
    'perde-rengi-nasil-secilir': [
        h('Renk Seçiminde Pratik Bir Test'),
        p(`Karar veremiyorsanız kumaş numunesini veya perde fotoğrafını odanın gün içinde farklı saatlerde yaklaştırıp bakın. Sabah ve akşam ışığında renk farklı görünür. Eğer iki renk arasında kararsızsanız, odanın en büyük yüzeyine (duvar) daha yakın olan tonu seçmek güvenli bir tercihtir.`),
        h('Perde Rengi ve Oda Boyutu'),
        l('Oda boyutuna göre öneriler:', [
            'Küçük oda: açık, nötr ve tek tonlu perdeler odayı geniş gösterir.',
            'Orta boy oda: nötr bir ana renk ve koyu bir tül veya aksesuarla denge kurulabilir.',
            'Büyük oda: koyu ve doygun renkler odayı sıcak ve samimi yapabilir.',
            'Yüksek tavan: perdeyi tavana yakın asıp koyu renkle dikey çizgi vurgusu yapılabilir.',
        ]),
        h('Mevsimlere Göre Renk'),
        p(`Yazın açık renkli ve ferah tonlar odanın daha serin hissedilmesine yardımcı olabilir; kışın koyu ve sıcak tonlar daha rahat bir atmosfer yaratabilir. Perdeyi mevsime göre değiştirmek istemiyorsanız nötr bir fon perde seçip tülü veya aksesuarı mevsime göre yenilemek pratik bir yoldur.`),
    ],
    'cocuk-odasi-perde-secimi': [
        h('Çocuk Odası İçin Montaj Kontrol Listesi'),
        l('Perdeyi astıktan sonra kontrol edin:', [
            'Korniş duvara sağlam sabitlendi mi, çocuk perdeye asılsa da yerinde kalıyor mu?',
            'Tüm halka ve kancalar kapalı ve sağlam mı?',
            'Perde ipi veya bağlama kordonu çocuğun erişemeyeceği yükseklikte mi?',
            'Perdenin altında oyun alanı varsa perde yerden yeterince yüksek mi?',
        ]),
        h('Çocuk Büyüdükçe Perdeyi Güncelleme'),
        p(`Çocuk odasında zamanla ihtiyaçlar değişir. Bebeklik döneminde karartma ve kolay temizlik öncelikliyken, okul çağında ders çalışma alanı için gün ışığı önem kazanır. Nötr renkli bir blackout fon perde seçip tülü veya aksesuarları yenilemek, perdeyi komple değiştirmeden odayı güncellemenizi sağlar.`),
        h('Perde Yanında Mobilya Yerleşimi'),
        p(`Perdenin yanına çocuğun tırmanabileceği sandık veya sehpa yerleştirmekten kaçının. Pencere kenarına yakın mobilyalar perde ipine veya korniş sistemine erişimi kolaylaştırabilir.`),
    ],
    'mutfak-perdesi-secimi': [
        h('Mutfak İçin Uygun Perde Alternatifleri'),
        l('Pencere ve kullanım biçimine göre:', [
            'Kısa tül perde: pencere altı hizasında, kolay yıkanır ve ışığı süzer.',
            'Café perdesi (pencerenin yarısını kapatan kısa perde): mahremiyet sağlar ve gün ışığını alt tarafta bırakır.',
            'Yere kadar tül: balkon kapılı mutfaklarda kapı geçişini engellemeyecek şekilde hafif kumaşla.',
        ]),
        h('Mutfak Perdesinde Sık Yapılan Hatalar'),
        l('Kaçının:', [
            'Perdeyi ocağa veya fırın havalandırmasına yakın asmak.',
            'Kalın ve koyu kumaşı mutfağın küçük penceresine seçip ışığı gereğinden fazla kesmek.',
            'Tezgâha değen uzunlukta perdeyi nemli kalan yerde bırakmak.',
            'Perdeyi aylarca yıkamadan bırakıp yağın kumaşa işlemesine izin vermek.',
        ]),
        h('Mutfak Perdesi Yıkama Hatırlatması'),
        p(`Yağ lekeleri kumaşa işlemeden önce sabunlu suyla ön işlem uygulamak temizliği kolaylaştırır. Yıkama sonrası ıslakken asmak ütü ihtiyacını azaltır. Perde değiştirme zamanı geldiğinde ürünün bakım etiketine göre yıkama programı seçin.`),
    ],
    'perde-boyu-ne-kadar-olmali': [
        h('Perde Boyunu Etkileyen Detaylar'),
        l('Boy kararını verirken şunları da düşünün:', [
            'Halı veya paspas kalınlığı: perdenin altından sürtünmesini engellemek için boyu buna göre kısaltın.',
            'Süpürge ve robot süpürge kullanımı: yerden yüksek bitiş süpürgenin perdeye takılmasını önler.',
            'Pencere altında mobilya veya radyatör: perde bunları rahatça örtmeli veya bunlardan uzak durmalı.',
            'Perdenin pile bolluğu: çok pileli perdede kıvrımlar altta daha çok yer kaplar.',
        ]),
        h('Perde Boyunu Kesin Karara Bağlamadan Önce'),
        p(`Perdeyi sipariş etmeden önce bir şerit metre veya ip ile planladığınız bitiş noktasını işaretleyin. Perde boyunun gözünüzde nasıl duracağını görmek için perde asılacak noktadan zemine bir ip sarkıtıp bitiş noktasından geriye bakın. Bu küçük deneme yanlış ölçüyle sipariş vermeyi önler.`),
        h('Perde Boyu ve Oda Algısı'),
        p(`Uzun perdeler odayı yüksek ve zarif gösterir; kısa perdeler daha sade ve pratik bir görünüm verir. Alçak tavanlı odalarda perdeyi tavana yakın asıp yere kadar indirmek tavanı yüksek gösterir. Geniş ve sade bir görünüm için perde tek renk ve düz kumaştan seçilebilir.`),
    ],
    'standart-kornis-olcusu-kac-cm': [
        h('Korniş Türleri ve Seçimi'),
        l('Yaygın korniş ve ray türleri:', [
            'Çubuk korniş: klasik görünümlüdür, halka veya kancayla perde asılır.',
            'Ray sistemi: tavana veya duvara monte edilir, sade ve modern görünüm verir.',
            'Çift raylı korniş: fon ve tül perdeyi birlikte asmanıza olanak tanır.',
            'Motorlu sistemler: geniş pencerelerde konfor sağlar; montaj için uzman desteği gerekir.',
        ]),
        h('Korniş Montajında Dikkat Edilecekler'),
        l('Montaj öncesi kontrol edin:', [
            'Duvarın malzemesi (beton, alçı, tuğla) uygun dübel ve vida seçimini belirler.',
            'Montaj noktaları arasındaki mesafe kornişin taşıyacağı ağırlığa uygun olmalıdır.',
            'Kornişi su terazisiyle hizalayın; eğri monte edilen korniş perdenin de eğri durmasına yol açar.',
            'Kornişin uçlarında perde açıldığında toplanacağı kadar boşluk bırakın.',
        ]),
        h('Ölçü Hatası Yaparsam Ne Olur?'),
        p(`Korniş çok kısa seçilirse perde açık olduğunda pencerenin bir kısmını kapatır ve oda daha karanlık görünür. Çok uzun seçilirse duvarda gereksiz yer kaplar ve görünüm dengesiz olur. Kendi pencerenizi ölçüp örneklerdeki oranlara göre karar vermek en güvenli yoldur.`),
    ],
    'ozel-olcu-perde-nasil-siparis-verilir': [
        h('Sık Sorulan Ölçü Soruları'),
        l('Özel ölçü sipariş verirken sık yaşanan kararsızlıklar:', [
            'Perde pencereden mi korniş genişliğinden mi hesaplanır? Korniş genişliğinden.',
            'Pile payı ürün fiyatına dahil mi? Ürün sayfasındaki ölçü yöntemini ve fiyat bilgisini kontrol edin.',
            'Ölçüler cm mi mm mi? Ürün sayfasında santimetre cinsinden girilir.',
            'Çift kanat perde için ayrı ölçü mü? Genellikle toplam ölçüyü iki panele bölmek gerekir; ürün açıklamasına bakın.',
        ]),
        h('Siparişten Sonra Süreç'),
        p(`Siparişiniz onaylandıktan sonra ölçünüze göre hazırlanır ve kargoya verilir. Üretim ve teslimat süresi ürüne göre değişebileceği için ürün sayfasındaki bilgilere bakın veya iletişim sayfamızdan bize yazın. Kargo sonrası takip numarasıyla siparişinizi izleyebilirsiniz.`),
        h('Ölçüyü Doğrulamak İçin İpuçları'),
        p(`Aldığınız ölçüyü başka biriyle birlikte kontrol etmek hatayı azaltır. Ölçüyü not edip bir süre sonra tekrar ölçerek karşılaştırmak, özellikle büyük pencerelerde faydalıdır.`),
    ],
    'perde-nasil-yikanir': [
        h('Leke Çıkarma İpuçları'),
        l('Yaygın lekeler için başlangıç adımları:', [
            'Yağ lekesi: hemen kağıt havluyla bastırın, hafif sabunlu suyla hafifçe silin.',
            'Çay veya kahve: soğuk suyla bastırın, sıcak su lekeyi kumaşa işletebilir.',
            'Toz ve kir: silkeleme ve yıkama çoğu zaman yeterlidir.',
            'Küf: nemli ortamda saklanan perdede görülebilir; yıkamadan önce kumaşın dayanıklılığını kontrol edin.',
        ]),
        h('Yıkama Sonrası Perdeyi Yerleştirme'),
        p(`Yıkama bittiğinde perdeyi hemen çıkarıp hafifçe silkeleyin ve ıslakken kornişe asın. Perde kuruyana kadar kıvrımları elinizle düzeltmek kırışıklığı azaltır. Eğer ütü gerekiyorsa kumaşın etiketindeki sıcaklığa uygun, tersinden ve düşük ısıda ütüleyin.`),
        h('Perdeyi Daha Uzun Süre Temiz Tutmak'),
        p(`Aylık hafif silkeleme, pencereyi havalandırma ve perdenin yağlı veya yoğun nemli ortamlardan uzak durması perdenin temiz kalmasını sağlar. Mutfak ve banyo gibi alanlarda daha sık yıkama planlayın.`),
    ],
    'balkon-perdesi-nedir-nasil-secilir': [
        h('Balkon Perdesi Montajında Dikkat Edilecekler'),
        l('Montaj öncesi kontrol listesi:', [
            'Bağlantı noktaları (korkuluk, çerçeve, korniş) sağlam ve paslanmaz mı?',
            'Bağcıklar eşit aralıkla bağlanıyor mu, perde gergin ama yırtılmayacak şekilde mi duruyor?',
            'Perde alt kenarı yere veya korkuluğa sürtünmeyecek yükseklikte mi?',
            'Rüzgarlı günlerde perdenin sallanmasını azaltacak ek bağlantı noktaları var mı?',
        ]),
        h('Balkon Perdesi ve Mahremiyet'),
        p(`Kalın gabardin kumaş dışarıdan içeriye görüntüyü büyük ölçüde engeller. Balkonu oturma alanı olarak kullanıyorsanız perde, hem gün içinde gölge hem de akşam saatlerinde mahremiyet sağlar. Perdeyi tam kapatmak yerine yarım açık bırakmak havalandırmayı korur.`),
        h('Balkon Perdesi Seçerken Bütçe ve Değer'),
        p(`Dış mekânda kullanılan perde güneşe, rüzgara ve yağmura maruz kalır. Bu nedenle ürünün kumaş bilgisi, bakım talimatı ve ölçü seçeneklerini karşılaştırarak değer odaklı seçim yapın. En ve boy ölçüsünü doğru almak yeniden sipariş maliyetini önler.`),
    ],
    'perde-olculeri-hangi-pencere-icin-hangi-olcu': [
        h('Ölçüyü Doğru Okumak İçin Örnek Alıştırma'),
        p(`Diyelim ki kornişinizin kullanılabilir genişliği 200 cm ve perde boyunuz 250 cm. Pilesiz (1x1) bir perde için ölçünüz yaklaşık 200x250 olur. Aynı kornişe 1/2 pileli bir perde alacaksanız perde eni yaklaşık 400 cm, boy 250 cm olur ve ölçü 400x250 şeklinde yazılır. Yani aynı pencere için iki farklı ölçü doğru olabilir; hangisinin geçerli olduğunu perdenin pile oranı belirler.`),
        h('Çift Kanat Perde Ölçüsü'),
        p(`Pencereye iki panel perde asacaksanız toplam perde enini ikiye bölerek her panelin enini bulabilirsiniz. Örneğin toplam 400 cm gerekiyorsa her panel 200 cm eninde olur. Ürün sayfasında panel sayısı ve ölçü yöntemi belirtilmişse onu esas alın.`),
        h('Ölçü Seçiminde Son Kontrol'),
        l('Sipariş vermeden önce:', [
            'Kornişin kullanılabilir genişliğini ölçtünüz mü?',
            'Pile oranına göre perde enini hesapladınız mı?',
            'Boyu perdenin asılacağı noktadan başlayarak ölçtünüz mü?',
            'Ölçüleri santimetre olarak ve doğru sırayla (en x boy) yazdınız mı?',
        ]),
    ],
    'yastik-kilifi-olcusu-nasil-secilir': [
        h('Yastık Kılıfı Seçerken Kumaş Farkları'),
        l('Kumaşa göre beklentiler:', [
            'Pamuk polyester karışımı: hava geçirgen, dayanıklı ve kolay bakımlı.',
            'Saf pamuk: yumuşak dokulu ama yıkamada çekme riski olabilir.',
            'Saten: parlak ve kaygan yüzeyli, farklı bir dokunuş hissi verir.',
            'Mevsime göre: yazın ince ve hava geçirgen, kışın daha dolgun dokulu kumaşlar tercih edilebilir.',
        ]),
        h('Yastık Kılıfı Ne Sıklıkla Değiştirilmeli?'),
        p(`Yatak yastık kılıflarının haftada bir veya iki haftada bir yıkanması hijyen açısından yaygın bir uygulamadır. Birden fazla yedek kılıfınız olursa yıkama günü yastık boş kalmaz. Bu nedenle 10 adetlik kılıf setleri düzenli değişim için pratiktir.`),
        h('Kılıf ve Yastık Ömrü'),
        p(`Yastığın kendisi zamanla şekil değiştirir; kılıfı yıpranmışsa değiştirmek yastığın iç yapısını da korur. Fermuarlı kılıf yastığı toz ve ter lekelerinden koruyan ek bir bariyer oluşturur.`),
    ],
};
