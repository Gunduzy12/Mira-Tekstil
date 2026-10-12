export default function CurtainMeasurementDiagram() {
    return (
        <figure className="my-8 rounded-xl border border-brand-border bg-white p-4">
            <svg viewBox="0 0 600 340" role="img" aria-labelledby="measurement-title measurement-description" className="w-full max-w-xl mx-auto">
                <title id="measurement-title">Perdede en ve boy ölçümü</title>
                <desc id="measurement-description">En, kapatılacak alan boyunca yatay ölçülür. Boy, bağlantı noktasından istenen alt bitişe kadar dikey ölçülür.</desc>
                <path d="M110 85H445" stroke="#424242" strokeWidth="8" />
                <path d="M120 95H435V285H120Z" fill="#eee5d9" stroke="#8c7356" strokeWidth="2" />
                {[150, 195, 240, 285, 330, 375, 420].map(x => <path key={x} d={`M${x} 98V282`} stroke="#c7b39b" strokeWidth="3" />)}
                <path d="M120 50H435M120 42V58M435 42V58M485 95V285M477 95H493M477 285H493" stroke="#424242" strokeWidth="2" />
                <text x="275" y="32" textAnchor="middle" fontSize="20">En (cm)</text>
                <text x="500" y="195" fontSize="18">Boy</text>
                <text x="275" y="320" textAnchor="middle" fontSize="15">İstenen alt bitiş</text>
            </svg>
            <figcaption className="text-center text-sm text-gray-600">Temsili ölçüm çizimi; bağlantı şekli ve bitiş noktası ürüne göre değişir. Dikiş payı eklemeden önce ürünün ölçü talimatını kontrol edin.</figcaption>
        </figure>
    );
}
