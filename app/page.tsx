import HomePage from '@/components/HomePage';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '@/types';

export const revalidate = 3600;

async function getProducts(): Promise<Product[]> {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export default async function Home() {
    const products = await getProducts();
    return (
        <HomePage initialProducts={products} />
    );
}
