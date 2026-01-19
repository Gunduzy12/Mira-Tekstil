
import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { User } from '../../types';
import { UserIcon } from '../Icons';

const CustomersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: User[] = [];
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data() as User);
        });
        setUsers(usersList);
      } catch (err: any) {
        console.error("Error fetching customers:", err);
        if (err.code === 'permission-denied') {
            setError("Erişim Reddedildi: Verileri görmek için Firebase Console'dan Firestore Kurallarını düzenlemelisiniz.");
        } else {
            setError("Müşteri listesi alınırken bir hata oluştu.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Müşteriler</h1>
      
      {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Hata! </strong>
              <span className="block sm:inline">{error}</span>
              <p className="mt-2 text-sm text-red-600">
                  Çözüm: Firebase Console &gt; Firestore Database &gt; Rules sekmesine gidin ve "allow read, write: if true;" yapın (Test modu).
              </p>
          </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 overflow-hidden">
            {isLoading ? (
            <div className="text-center py-10 text-gray-500">Müşteri listesi yükleniyor...</div>
            ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mr-3">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role || 'customer'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        Henüz kayıtlı müşteri bulunmuyor.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default CustomersView;
