import { CategoryFAQ, SEOContentBlock } from '../types';

const p = (content: string): SEOContentBlock => ({ type: 'paragraph', content });
const h = (content: string): SEOContentBlock => ({ type: 'heading', content });
const l = (content: string, items: string[]): SEOContentBlock => ({ type: 'list', content, items });
const q = (question: string, answer: string): CategoryFAQ => ({ question, answer });

interface LegacyExtra {
    content: SEOContentBlock[];
    faq?: CategoryFAQ[];
    relatedLinks?: { label: string; href: string; description: string }[];
}

// Daha önce yayınlanmış yazılara eklenen pratik bölümler. Liste maddelerinde HTML kullanılmaz.
export const legacyExtras: Record<string, LegacyExtra> = {
    'sicak-havalarda-hava-durumuna-gore-perde-secimi': {
        content: [
            h('Gün İçinde Perde Yönetimi'),
            l('Sıcak günlerde perdeleri gün boyunca şöyle kullanabilirsiniz:', [
                'Sabah: serin saatlerde perdeleri açıp camları aralayarak odayı havalandırın.',
                'Öğle ve öğleden sonra: güneşin doğrudan girdiği pencerelerde fon veya blackout perdeyi kapatın.',
                'Akşam: güneş battıktan sonra perdeleri açıp serinliği içeri alın.',
                'Gece: dışarıdan görüntü ve ışık rahatsız ediyorsa tülü veya fon perdeyi tekrar kapatın.',
            ]),
            h('Pencere Yönüne Göre Perde Kullanımı'),
            l('Pencerenin baktığı yön güneşin geldiği saati belirler:', [
                'Güney cephe: gün boyu güneş alır; öğle saatlerinde kalın perdeye en çok ihtiyaç duyulur.',
                'Batı cephe: öğleden sonra ve akşamüstü güneş güçlüdür; bu odalarda fon perdeyi öğleden sonra kapalı tutmak yararlı olur.',
                'Doğu cephe: sabah güneşi gelir; yatak odasında sabah ışığını azaltmak için blackout perde tercih edilebilir.',
                'Kuzey cephe: doğrudan güneş az alır; ışığı süzen tül çoğu zaman yeterlidir.',
            ]),
            h('Renk ve Kumaşın Etkisi'),
            p(`Genel bir kural olarak koyu renkler ışığı daha fazla emer, açık renkler daha fazla yansıtır. Bu nedenle sıcak ve güneşli odalarda açık renkli perdeler odanın ısınmasını sınırlamaya yardımcı olabilir. Öte yandan karartma gerektiren odalarda koyu tonlu blackout perde ışığı daha fazla azaltabilir. Hangi rengin hangi odaya uyduğunu görmek için <a href="/blog/perde-rengi-nasil-secilir" class="underline">perde rengi rehberimize</a> bakabilirsiniz.`),
            h('Perde Tek Başına Yeterli mi?'),
            p(`Perde, güneşin içeri girmesini azaltarak evin ısınmasını sınırlamaya yardımcı olur; ancak tek başına klima veya yalıtım çözümünün yerini tutmaz. Gün içinde perdeleri doğru saatlerde kapatmak, akşam serinliğinde havalandırma yapmak ve güneşli cephelerde kalın perde kullanmak birlikte uygulandığında daha dengeli sonuç verir.`),
            h('Yaz İçin Kısa Kontrol Listesi'),
            l('Sıcak mevsime hazırlanırken:', [
                'Güneş gören pencerelerin hangileri olduğunu belirleyin.',
                'Bu pencerelerde fon veya blackout perde, diğerlerinde tül yeterli mi karar verin.',
                'Perdelerin tamamen kapandığı ve yanlardan ışık sızdırmadığı kontrol edin.',
                'Perdeleri yıkayıp mevsime hazır hale getirin; yıkama için perde yıkama rehberimiz yardımcı olur.',
            ]),
            p(`Karartmayı öne çıkaran modelleri <a href="/perde/blackout-perde" class="underline">blackout perde koleksiyonunda</a>, ışığı süzen modelleri <a href="/perde/tul-perde" class="underline">tül perde koleksiyonunda</a> inceleyebilirsiniz. Perdelerinizi temizlemek için <a href="/blog/perde-nasil-yikanir" class="underline">perde nasıl yıkanır</a> yazımıza bakın.`),
        ],
        faq: [
            q('Yazın hangi perde odayı serin tutar?', 'Güneşin içeri girmesini azaltan kalın fon veya blackout perdeler ve açık renkli kumaşlar odanın ısınmasını sınırlamaya yardımcı olabilir. Tek başına klima yerine geçmez.'),
            q('Sıcak havalarda perdeyi ne zaman kapatmalıyım?', 'Güneşin doğrudan pencereye girdiği saatlerde, özellikle güney ve batı cephelerde öğle ve öğleden sonra kapatmak yararlıdır.'),
            q('Tül perde odayı serin tutar mı?', 'Tül ışığı süzer ama güneşi büyük ölçüde engellemez. Güneşli pencerelerde fon veya blackout perde ile birlikte kullanmak daha etkilidir.'),
        ],
        relatedLinks: [
            { label: 'Blackout perde modelleri', href: '/perde/blackout-perde', description: 'Güneşi azaltan fon perde seçenekleri.' },
            { label: 'Açık renk perdeler', href: '/perde/acik-renk-perde', description: 'Bej, krem, beyaz, vizon ve gri perdeler.' },
        ],
    },
    'perde-pile-hesabi-nasil-yapilir': {
        content: [
            h('Pile Oranı Perdenin Görünümünü Nasıl Değiştirir?'),
            l('Pile oranına göre genel görünüm:', [
                '1/2 pile: daha sade ve düz bir görünüm; kumaş ihtiyacı daha az.',
                '1/2,5 pile: dengeli ve dolgun görünüm.',
                '1/3 pile: çok dolgun ve gösterişli görünüm; kumaş ihtiyacı ve maliyet daha yüksek.',
            ]),
            h('İki Örnek Daha'),
            l('Yaklaşık değerlerle:', [
                '150 cm bitmiş en için: 1/2 pile yaklaşık 300 cm, 1/2,5 pile yaklaşık 375 cm, 1/3 pile yaklaşık 450 cm kumaş eni.',
                '250 cm bitmiş en için: 1/2 pile yaklaşık 500 cm, 1/2,5 pile yaklaşık 625 cm, 1/3 pile yaklaşık 750 cm kumaş eni.',
            ]),
            p(`Bunlar eğitim amaçlı yaklaşık hesaplardır; üretim payları ve dikiş çekmesi ayrıca değerlendirilir. Kesin değer için ürünün ölçü ve pile açıklamasını esas alın.`),
            h('Pile Seçerken Hangi Kriterlere Bakılır?'),
            l('Karar verirken:', [
                'Kumaşın kalınlığı: kalın kumaşta çok sık pile ağır ve hacimli görünebilir.',
                'Pencerenin genişliği: geniş pencerede çok sık pile kumaş maliyetini hızla artırır.',
                'İstenen görünüm: sade ve modern için seyrek, klasik ve dolgun için sık pile.',
                'Bütçe: pile arttıkça kumaş miktarı arttığı için maliyet de artar.',
            ]),
            h('Perde Açıkken Ne Kadar Yer Kaplar?'),
            p(`Pile oranı yükseldikçe perde açıkken kenarda toplanan kumaş miktarı da artar. Dar duvarlı veya mobilyaların yakın olduğu pencerelerde sık pile perdenin toplandığı alanı büyütebilir. Kornişin pencereden yeterince taşmasına dikkat edin.`),
            h('Sık Yapılan Hatalar'),
            l('Kaçının:', [
                'Pile katsayısıyla çarpılmış değeri bitmiş en olarak sipariş vermek.',
                'Tüm perde türlerinde aynı pile oranını kullanmak; tül ve fon perde farklı oranlarda dolgun görünür.',
                'Kornişin kullanılabilir genişliğini değil pencere genişliğini ölçmek.',
            ]),
            p(`Perde türleri arasındaki farkı <a href="/blog/fon-perde-ile-tul-perde-farki" class="underline">fon perde ile tül perde farkı</a> yazımızdan okuyabilirsiniz. Ölçü örnekleri için <a href="/blog/perde-olculeri-hangi-pencere-icin-hangi-olcu" class="underline">perde ölçüleri rehberine</a> bakın.`),
        ],
        faq: [
            q('1/2 pile ile 1/3 pile arasındaki fark nedir?', '1/3 pile bitmiş enin yaklaşık üç katı, 1/2 pile ise yaklaşık iki katı kumaş kullanır. 1/3 pile daha dolgun görünür ve daha fazla kumaş gerektirir.'),
            q('Pilesiz perde ne demek?', 'Pilesiz (1x1) perdede kumaş toplanmadan düz asılır; kumaş eni bitmiş ene yakındır.'),
        ],
    },
    'balkon-perdesi-olcusu-nasil-alinir': {
        content: [
            h('Parçalı ve Köşe Balkonlarda Ölçü'),
            l('Balkonunuz düz değilse:', [
                'Her yüzeyi ayrı ayrı ölçün ve her yüzey için ayrı bir perde parçası planlayın.',
                'Köşe birleşimlerinde perdenin birbirine bindirme veya boşluk bırakma biçimini önceden belirleyin.',
                'Her parçanın en ve boyunu ayrı satırda not edin; toplam değeri sipariş vermek yerine parçaları ayrı ayrı yazın.',
                'Camın açılma yönünü ve kapı kanadının hareket alanını kontrol edin.',
            ]),
            h('Fotoğrafla Ölçü Notu Hazırlamak'),
            p(`Ölçü notunuzu daha anlaşılır yapmak için balkonun genel görünümünü ve bağlantı noktalarını gösteren fotoğraflar çekin. Fotoğrafın üzerine ölçüleri not edin. Ürün veya ölçü hakkında tereddüt ettiğinizde bu fotoğrafları ve notu <a href="/contact" class="underline">bize iletebilirsiniz</a>; sipariş öncesinde doğrulama yapmak yanlış ölçü riskini azaltır.`),
            h('Yaygın Ölçü Hataları'),
            l('Sık karşılaşılan hatalar:', [
                'Balkonun içi ile dışı arasındaki ölçü farkını gözden kaçırmak.',
                'Korkuluk veya çerçeve çıkıntılarını hesaba katmamak.',
                'Boyu zeminden değil perdenin asılacağı noktadan ölçmemek.',
                'Ölçüyü tek noktadan alıp duvarın eğrilik veya daralma ihtimalini kaçırmak.',
            ]),
            h('Siparişten Sonra Montaj Hazırlığı'),
            p(`Perde elinize ulaştığında bağlantı noktalarını önceden temizleyip hazırlayın. Perdeyi önce bir noktadan sabitleyip ardından diğer noktalara bağlayarak düzgün gergi sağlayın. Rüzgarlı günlerde perdenin çok sallanmaması için bağlantı noktalarını sık tutun.`),
            p(`Genel bilgi için <a href="/blog/balkon-perdesi-nedir-nasil-secilir" class="underline">balkon perdesi nedir, nasıl seçilir</a> yazımıza bakabilirsiniz.`),
        ],
        faq: [
            q('Köşe balkonlara tek parça perde olur mu?', 'Köşe balkonlarda genellikle her yüzey için ayrı parça planlamak daha doğru sonuç verir. Ürün açıklamasını ve ölçü notunu birlikte değerlendirin.'),
            q('Balkon perdesi ölçüsü için fotoğraf göndermek gerekir mi?', 'Zorunlu değildir ancak ölçü veya bağlantı konusunda tereddüt varsa fotoğraf ve ölçü notu sipariş öncesi doğrulamayı kolaylaştırır.'),
        ],
        relatedLinks: [
            { label: 'Balkon perdesi nedir', href: '/blog/balkon-perdesi-nedir-nasil-secilir', description: 'Kumaş, montaj ve renk seçimi.' },
        ],
    },
    'perde-olcusu-nasil-alinir': {
        content: [
            h('Ölçü Almak İçin Gerekli Araçlar'),
            l('Hazırlık listesi:', [
                'Sağlam bir çelik şerit metre (kumaş metre yerine).',
                'Ölçüleri yazmak için kâğıt ve kalem veya telefon notu.',
                'Yüksek noktalar için sağlam bir merdiven veya tabure.',
                'Mümkünse ölçüyü kontrol edecek ikinci bir kişi.',
            ]),
            h('Örnek Ölçü Formu'),
            l('Notunuza şu başlıkları ekleyin:', [
                'Korniş veya ray genişliği (cm).',
                'Perdenin asılacağı noktadan zemine yükseklik (cm), sol-orta-sağ ayrı yazılmış.',
                'Pile oranı veya pilesiz tercihi.',
                'Tek veya iki kanat tercihi.',
                'Perdenin yerden bitiş mesafesi (örneğin yerden 2 cm yüksek).',
            ]),
            h('Duvar ve Tavan Farklılıkları'),
            p(`Evlerin duvar ve tavanları her zaman düz ve eşit olmayabilir. Farklı noktalardan ölçüm alarak eğrilik veya yükseklik farkı olup olmadığını kontrol edin. Boyda en kısa ölçüyü baz almak perdenin zemine sürtmesini önler; enlerde ise kornişin kullanılabilir bölümünü esas alın.`),
            h('Korniş mi, Ray mı?'),
            p(`Perdenin asılacağı sistemin türü ölçüyü etkiler. Çubuk kornişte uç parçaları ve halkaların konumu kullanılabilir genişliği etkiler; ray sistemde ise rayın kullanılabilir uzunluğu esastır. Hangi sistemi kullandığınızı bilmiyorsanız fotoğrafını çekip sipariş öncesi bize danışabilirsiniz.`),
            h('Ölçüyü Siparişe Dönüştürmeden Önce'),
            l('Son kontrol:', [
                'Ölçüleri iki kez, farklı zamanlarda aldınız mı?',
                'En ile boyu yanlış sırada yazmadığınızdan emin misiniz?',
                'Pile oranına göre perde enini hesapladınız mı? Hesap için pile hesabı rehberimiz yardımcı olur.',
                'Siparişte seçtiğiniz renk ve ölçünün ürün sayfasındaki ölçü aralığına uyduğunu kontrol ettiniz mi?',
            ]),
            p(`Pile hesabını <a href="/blog/perde-pile-hesabi-nasil-yapilir" class="underline">pile hesabı rehberimizden</a>, boy seçimini <a href="/blog/perde-boyu-ne-kadar-olmali" class="underline">perde boyu rehberimizden</a> yapabilirsiniz.`),
        ],
        faq: [
            q('Perde ölçüsü alırken şerit metre mi kumaş metre mi kullanılmalı?', 'Çelik şerit metre kullanmak daha doğru sonuç verir; kumaş metre esneyebilir.'),
            q('Perde ölçüsünü kendim alabilir miyim?', 'Evet. Rehberdeki adımları izleyip ölçüleri iki kez kontrol ederek doğru ölçü alabilirsiniz. Tereddüt ettiğiniz durumda sipariş öncesi bize danışın.'),
        ],
    },
    'yatak-odasi-icin-en-iyi-perde': {
        content: [
            h('Yatak Odasında Perde ve Uyku Ortamı'),
            p(`Perde, yatak odasında ışığı ve dış görünümü kontrol ederek uyku ortamınızı düzenlemenize yardımcı olur. Sabah güneşi ya da sokak aydınlatması uykunuzu bölüyorsa karartma özelliği olan bir perde işinizi kolaylaştırabilir. Işık düzeyi tek faktör değildir; oda sıcaklığı ve havalandırma da konforu etkiler.`),
            h('Pencerenin Konumuna Göre Seçim'),
            l('Pencerenin yönüne göre öneriler:', [
                'Doğu cephe: sabah güneşi erken girer; blackout perde sabah ışığını azaltmaya yardımcı olur.',
                'Batı cephe: akşamüstü güneş güçlüdür; yatak odasını yazın ısıtabilir, kalın perde faydalıdır.',
                'Sokağa bakan pencere: sokak lambası ışığı ve dışarıdan görüntü için kalın perde kullanın.',
                'Bahçeye bakan pencere: mahremiyet ihtiyacı daha azsa tül ile yetinebilirsiniz.',
            ]),
            h('Aydınlatma ve Perde Uyumu'),
            p(`Perdeyi kapattığınızda oda gün boyu loş kalacaksa yatak odası aydınlatmasını da düşünün. Sıcak tonlu ışıklar ve perdeyle uyumlu renkler odayı daha rahat gösterir. Gündüz perdeyi açıp odayı havalandırmak da önemlidir.`),
            h('Yatak Odası Perdesinde Bakım'),
            p(`Yatak odası perdeleri toz ve nem ile temas eder. Birkaç ayda bir silkelemek, yılda birkaç kez etiket talimatına göre yıkamak perdelerin temiz ve ömrünün uzun olmasını sağlar. Ayrıntılar için <a href="/blog/perde-nasil-yikanir" class="underline">perde nasıl yıkanır</a> rehberimize bakın.`),
            h('Sık Yapılan Hatalar'),
            l('Kaçının:', [
                'Perdeyi pencereden dar ölçmek; kenarlardan giren ışık karartmayı azaltır.',
                'Yatak başlığı ve duvar rengini düşünmeden çok zıt bir perde seçmek.',
                'Karartma ihtiyacını belirlemeden her odaya aynı perdeyi almak.',
                'Perde boyunu yerden çok yüksek bitirip alttan ışık sızdırmak.',
            ]),
            p(`Yatak odası için hazırladığımız seçenekleri <a href="/perde/yatak-odasi-perdesi" class="underline">yatak odası perdesi koleksiyonunda</a> inceleyebilirsiniz. Perdeyi daha iyi ölçmek için <a href="/blog/perde-olcusu-nasil-alinir" class="underline">ölçü rehberimize</a> bakın.`),
        ],
        relatedLinks: [
            { label: 'Yatak odası perdesi koleksiyonu', href: '/perde/yatak-odasi-perdesi', description: 'Blackout ve saten perdeleri birlikte inceleyin.' },
        ],
    },
};
