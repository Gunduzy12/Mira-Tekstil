
import React, { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { TrashIcon, StarIcon, ChatBubbleIcon } from '../Icons';

const ReviewsQnAView: React.FC = () => {
    const { products, deleteReview, deleteQuestion, answerQuestion } = useProducts();
    const [activeTab, setActiveTab] = useState<'reviews' | 'questions'>('reviews');
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

    // Aggregate Reviews
    const allReviews = useMemo(() => {
        return products.flatMap(product => 
            (product.reviews || []).map(review => ({
                ...review,
                productName: product.name,
                productId: product.id,
                productImage: product.imageUrl
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [products]);

    // Aggregate Questions
    const allQuestions = useMemo(() => {
        return products.flatMap(product => 
            (product.questions || []).map(question => ({
                ...question,
                productName: product.name,
                productId: product.id,
                productImage: product.imageUrl
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [products]);

    const handleDeleteReview = async (productId: string, reviewId: number) => {
        if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
            await deleteReview(productId, reviewId);
        }
    };

    const handleDeleteQuestion = async (productId: string, questionId: number) => {
        if (window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
            await deleteQuestion(productId, questionId);
        }
    };

    const handleReplyChange = (questionId: number, text: string) => {
        setReplyText(prev => ({ ...prev, [questionId]: text }));
    };

    const handleSendReply = async (productId: string, questionId: number) => {
        const answer = replyText[questionId];
        if (!answer || !answer.trim()) return;

        await answerQuestion(productId, questionId, answer);
        // Clear input after sending
        setReplyText(prev => ({ ...prev, [questionId]: '' }));
    };

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Yorumlar ve Soru Yönetimi</h1>

            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit mb-8">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-2.5 px-6 font-medium text-sm rounded-md transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-brand-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                    <StarIcon className="w-4 h-4" />
                    <span>Ürün Yorumları ({allReviews.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`py-2.5 px-6 font-medium text-sm rounded-md transition-all flex items-center gap-2 ${activeTab === 'questions' ? 'bg-brand-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                    <ChatBubbleIcon className="w-4 h-4" />
                    <span>Satıcı Soruları ({allQuestions.length})</span>
                </button>
            </div>

            {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Müşteri</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Puan & Yorum</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Eylem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allReviews.map((review) => (
                                <tr key={`${review.productId}-${review.id}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img src={review.productImage} alt="" className="h-10 w-10 rounded border border-gray-200 object-cover mr-3" />
                                            <span className="text-sm font-medium text-gray-900">{review.productName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {review.author}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(review.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDeleteReview(review.productId, review.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                            title="Yorumu Sil"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allReviews.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Henüz ürün yorumu yok.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'questions' && (
                <div className="space-y-6">
                     <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                        <p className="text-sm text-blue-700">
                            Müşterilerin ürünler hakkında sorduğu sorular aşağıda listelenmiştir. Cevaplanmamış sorulara buradan yanıt verebilirsiniz.
                        </p>
                     </div>

                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Ürün & Müşteri</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Soru</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Cevap</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Eylem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allQuestions.map((qa) => (
                                    <tr key={`${qa.productId}-${qa.id}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-start">
                                                <img src={qa.productImage} alt="" className="h-10 w-10 rounded border border-gray-200 object-cover mr-3" />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{qa.productName}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{qa.user}</p>
                                                    <p className="text-xs text-gray-400">{new Date(qa.date).toLocaleDateString('tr-TR')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top text-sm text-gray-700 font-medium">
                                            "{qa.text}"
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            {qa.answer ? (
                                                <div className="bg-green-50 p-3 rounded border border-green-100 text-sm text-green-800">
                                                    <span className="font-bold block mb-1 text-green-900">Yanıtlandı:</span>
                                                    {qa.answer}
                                                    <button 
                                                        onClick={() => handleReplyChange(qa.id, qa.answer || '')}
                                                        className="block mt-2 text-xs text-green-600 hover:underline"
                                                    >
                                                        Düzenle
                                                    </button>
                                                    {replyText[qa.id] !== undefined && qa.answer === replyText[qa.id] && (
                                                        // If edit mode activated (replyText matches current answer initially)
                                                        // Actually, this logic is a bit simple. Better to show edit box if replyText exists.
                                                        null
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-50 p-2 rounded border border-yellow-100 text-xs text-yellow-800 mb-2 font-semibold">
                                                    Bekliyor
                                                </div>
                                            )}
                                            
                                            {(!qa.answer || replyText[qa.id] !== undefined) && (
                                                <div className="mt-2">
                                                    <textarea 
                                                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary"
                                                        rows={3}
                                                        placeholder="Cevabınızı yazın..."
                                                        value={replyText[qa.id] !== undefined ? replyText[qa.id] : ''}
                                                        onChange={(e) => handleReplyChange(qa.id, e.target.value)}
                                                    ></textarea>
                                                    <button 
                                                        onClick={() => handleSendReply(qa.productId, qa.id)}
                                                        disabled={!replyText[qa.id]}
                                                        className="mt-2 bg-brand-primary text-white text-xs px-3 py-2 rounded hover:bg-brand-dark disabled:opacity-50"
                                                    >
                                                        {qa.answer ? 'Güncelle' : 'Yanıtla'}
                                                    </button>
                                                    {replyText[qa.id] !== undefined && qa.answer && (
                                                        <button 
                                                            onClick={() => {
                                                                const newReplies = {...replyText};
                                                                delete newReplies[qa.id];
                                                                setReplyText(newReplies);
                                                            }}
                                                            className="mt-2 ml-2 text-gray-500 text-xs hover:underline"
                                                        >
                                                            İptal
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right align-top">
                                            <button 
                                                onClick={() => handleDeleteQuestion(qa.productId, qa.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                                title="Soruyu Sil"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {allQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Henüz soru sorulmamış.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsQnAView;
