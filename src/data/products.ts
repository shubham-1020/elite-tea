import { Product, CouponCode, Testimonial } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    slug: 'elite-assam-ctc',
    name: 'Elite Assam CTC',
    category: 'Black Tea',
    description:
      'Our flagship Elite Assam CTC tea is sourced directly from the finest tea estates in the Brahmaputra valley. Each granule is crafted using the traditional Crush, Tear, Curl method, producing a bold, full-bodied brew with a rich malty character. The deep amber liquor carries the unmistakable strength and aroma that has made Assam tea world-renowned. Perfect for those who appreciate a robust cup that pairs beautifully with milk and sugar, or enjoyed strong and black. Every sip takes you to the misty gardens of Assam.',
    shortDescription: 'Bold, malty & full-bodied — the authentic Elite Assam experience.',
    price: 200,
    originalPrice: 320,
    weight: '500g',
    weightOptions: [
      { weight: '500g', price: 200 },
      { weight: '1kg', price: 380 },
    ],
    image: '/images/assam-ctc.png',
    images: ['/images/assam-ctc.png'],
    tags: ['bestseller', 'premium', 'organic'],
    brewingInstructions:
      'Use 1 teaspoon per cup. Brew with boiling water (100°C) for 3-5 minutes. Add milk and sweetener to taste. Best enjoyed fresh.',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    slug: 'elite-green-tea',
    name: 'Elite Green Tea',
    category: 'Green Tea',
    description:
      'Our Elite Green Tea is carefully handpicked from the lush gardens of Assam and minimally processed to preserve the natural antioxidants and delicate flavour profile. The light, refreshing brew carries subtle vegetal notes with a clean, smooth finish. Rich in catechins and natural polyphenols, this tea supports wellness with every cup. The pale golden-green liquor is as beautiful to look at as it is to sip. Ideal for health-conscious tea lovers seeking a daily ritual of calm and clarity.',
    shortDescription: 'Light, refreshing & antioxidant-rich — Elite wellness in every cup.',
    price: 175,
    originalPrice: 200,
    weight: '100g',
    weightOptions: [
      { weight: '100g', price: 175 },
      { weight: '250g', price: 399 },
      { weight: '500g', price: 749 },
    ],
    image: '/images/green-tea.png',
    images: ['/images/green-tea.png'],
    tags: ['healthy', 'organic', 'antioxidant'],
    brewingInstructions:
      'Use 1 teaspoon per cup. Brew with water at 75-80°C for 2-3 minutes. Do not use boiling water. Best enjoyed without milk.',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: '3',
    slug: 'elite-rose-tea',
    name: 'Elite Rose Tea',
    category: 'Flavoured Tea',
    description:
      'An exquisite blend of premium Assam tea infused with real rose petals, creating a romantic and aromatic experience. The floral fragrance of Damask roses intertwines with the malty strength of Assam tea, producing a cup that is both comforting and luxurious. The beautiful rose-tinted liquor fills your space with an intoxicating aroma. Each batch is carefully blended with hand-selected dried rose petals for an authentic floral experience. A perfect companion for quiet afternoons and special moments.',
    shortDescription: 'Floral, aromatic & luxurious — Elite romance in every sip.',
    price: 220,
    originalPrice: 280,
    weight: '100g',
    weightOptions: [
      { weight: '100g', price: 220 },
      { weight: '250g', price: 499 },
      { weight: '500g', price: 949 },
    ],
    image: '/images/rose-tea.png',
    images: ['/images/rose-tea.png'],
    tags: ['premium', 'floral', 'gift'],
    brewingInstructions:
      'Use 1 teaspoon per cup. Brew with water at 90°C for 3-4 minutes. Can be enjoyed with a touch of honey. Beautiful as an iced tea too.',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '4',
    slug: 'elite-himalayan-churpi',
    name: 'Elite Himalayan Churpi',
    category: 'Specialty',
    description:
      'A unique delicacy from the high Himalayas — Churpi is a traditional hard cheese made from yak and cow milk by indigenous communities of Northeast India and the Himalayan region. Sun-dried and aged to perfection, each piece carries centuries of artisanal tradition. With a smoky, slightly tangy flavour and satisfyingly chewy texture, Churpi is the perfect companion to your cup of tea. Rich in protein and calcium, it\'s a wholesome snack that connects you to the ancient food heritage of the mountains. Pair it with our Elite Assam CTC for the ultimate Northeast experience.',
    shortDescription: 'Traditional Himalayan cheese — an Elite cultural delicacy.',
    price: 250,
    originalPrice: 350,
    weight: '200g',
    weightOptions: [
      { weight: '200g', price: 250 },
      { weight: '500g', price: 600 },
    ],
    image: '/images/churpi.png',
    images: ['/images/churpi.png'],
    tags: ['unique', 'traditional', 'northeast'],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 98,
  },
];

export const couponCodes: CouponCode[] = [
  {
    code: 'ELITE10',
    discount: 10,
    minOrder: 300,
    description: '10% off on orders above ₹300',
  },
  {
    code: 'FIRSTORDER',
    discount: 15,
    minOrder: 200,
    description: '15% off on your first order (min ₹200)',
  },
  {
    code: 'TEA20',
    discount: 20,
    minOrder: 500,
    description: '20% off on orders above ₹500',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    text: 'The Elite Assam CTC is hands down the best tea I\'ve ever had. The malty richness is unmatched. I\'ve been ordering every month!',
    rating: 5,
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Rahul Gogoi',
    location: 'Guwahati',
    text: 'Being from Assam, I\'m very particular about my tea. Elite Tea captures the authentic taste perfectly. The Elite Himalayan Churpi is a wonderful bonus — reminds me of home.',
    rating: 5,
    avatar: 'RG',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Mumbai',
    text: 'The Elite Rose Tea is absolutely divine! The aroma fills my entire kitchen. It\'s become my go-to gift for friends and family.',
    rating: 5,
    avatar: 'AP',
  },
  {
    id: 4,
    name: 'Dr. Vikram Singh',
    location: 'Bangalore',
    text: 'Switched to Elite Green Tea as part of my wellness routine. The quality is exceptional and I can genuinely taste the difference from supermarket brands.',
    rating: 4,
    avatar: 'VS',
  },
];
