import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

export const metadata: Metadata = {
  title: 'MiraTekstil | Lüks Ev Tekstili, Nevresim & Dekorasyon',
  description: 'Yatak odanızdan salonunuza, evinize lüks ve konfor katan en kaliteli pamuk ve keten ürünleri keşfedin.',
};

export default function Home() {
  return (
    <HomePage />
  );
}
