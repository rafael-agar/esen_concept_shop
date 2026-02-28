export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Vestido Floral de Verano",
    price: 45.00,
    image: "https://esenconcept.netlify.app/esen01.jpg",
    images: [
      "https://esenconcept.netlify.app/esen01.jpg",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Vestidos",
    isNew: true
  },
  {
    id: 2,
    name: "Blusa de Seda Blanca",
    price: 32.00,
    image: "https://esenconcept.netlify.app/esen02.jpg",
    images: [
      "https://esenconcept.netlify.app/esen02.jpg",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551163943-3f6a29e39454?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Blusas"
  },
  {
    id: 3,
    name: "Pantalón Palazzo Negro",
    price: 55.00,
    image: "https://esenconcept.netlify.app/esen03.jpg",
    images: [
      "https://esenconcept.netlify.app/esen03.jpg",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Pantalones",
    isSale: true
  },
  {
    id: 4,
    name: "Chaqueta de Mezclilla",
    price: 68.00,
    image: "https://esenconcept.netlify.app/esen04.jpg",
    images: [
      "https://esenconcept.netlify.app/esen04.jpg",
      "https://images.unsplash.com/photo-1523205565295-f8e91625443b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516257984-b1b4d8c94306?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601333762779-83bf81eaad56?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Chaquetas"
  },
  {
    id: 5,
    name: "Falda Midi Plisada",
    price: 38.00,
    image: "https://esenconcept.netlify.app/esen01.jpg",
    images: [
      "https://esenconcept.netlify.app/esen01.jpg",
      "https://images.unsplash.com/photo-1577900232427-18219b9166a3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605763240004-7e93b172d754?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582142407894-ec85f1260a46?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591369822096-35c93e188329?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Faldas",
    isNew: true
  },
  {
    id: 6,
    name: "Suéter de Punto Beige",
    price: 42.00,
    image: "https://esenconcept.netlify.app/esen02.jpg",
    images: [
      "https://esenconcept.netlify.app/esen02.jpg",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624835567150-b0545d04420a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Suéteres"
  },
  {
    id: 7,
    name: "Bolso de Cuero Marrón",
    price: 85.00,
    image: "https://esenconcept.netlify.app/esen03.jpg",
    images: [
      "https://esenconcept.netlify.app/esen03.jpg",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Accesorios"
  },
  {
    id: 8,
    name: "Tacones Clásicos Nude",
    price: 60.00,
    image: "https://esenconcept.netlify.app/esen04.jpg",
    images: [
      "https://esenconcept.netlify.app/esen04.jpg",
      "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1000&auto=format&fit=crop"
    ],
    category: "Zapatos",
    isSale: true
  }
];

export const categories = [
  {
    id: 1,
    name: "Vestidos",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Accesorios",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Zapatos",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Bolsos",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop"
  }
];
