export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Vestido Floral de Verano",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
    category: "Vestidos",
    isNew: true
  },
  {
    id: 2,
    name: "Blusa de Seda Blanca",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop",
    category: "Blusas"
  },
  {
    id: 3,
    name: "Pantalón Palazzo Negro",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    category: "Pantalones",
    isSale: true
  },
  {
    id: 4,
    name: "Chaqueta de Mezclilla",
    price: 68.00,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop",
    category: "Chaquetas"
  },
  {
    id: 5,
    name: "Falda Midi Plisada",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop",
    category: "Faldas",
    isNew: true
  },
  {
    id: 6,
    name: "Suéter de Punto Beige",
    price: 42.00,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
    category: "Suéteres"
  },
  {
    id: 7,
    name: "Bolso de Cuero Marrón",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
    category: "Accesorios"
  },
  {
    id: 8,
    name: "Tacones Clásicos Nude",
    price: 60.00,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
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
