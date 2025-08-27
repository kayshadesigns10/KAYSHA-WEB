import { db, type Product } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  WhereFilterOp,
  QueryConstraint,
} from "firebase/firestore";

export interface ProductFilters {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
}

export interface ProductSort {
  field: 'sellingPrice' | 'bestSellerNumber' | 'createdAt' | 'name';
  direction: 'asc' | 'desc';
}

const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Classic Pinstripe Suit**",
    descriptionSuits: "Elegant pinstripe suit for professional women",
    sellingPrice: 500,
    discountedPrice: 199,
    category: "Suits",
    subCategory: "Professional",
    size: ["XS", "S", "M", "L", "XL"],
    color: "navy",
    bestSellerNumber: 45,
    mainImageLink:
      "https://images.unsplash.com/photo-1632149877166-f75d49000351?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1632149877166-f75d49000351?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Modern Blazer Set",
    descriptionSuits: "Contemporary blazer with matching trousers",
    sellingPrice: 199,
    discountedPrice: 179,
    category: "Suits",
    subCategory: "Casual",
    size: ["XS", "S", "M", "L", "XL"],
    color: "black",
    bestSellerNumber: 32,
    mainImageLink:
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Tailored Wool Coat",
    descriptionSuits: "Premium wool coat for winter elegance",
    sellingPrice: 299,
    discountedPrice: 249,
    category: "Coats",
    subCategory: "Winter",
    size: ["XS", "S", "M", "L", "XL"],
    color: "camel",
    bestSellerNumber: 28,
    mainImageLink:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Statement Trouser Suit",
    descriptionSuits: "Bold design for confident women",
    sellingPrice: 249,
    discountedPrice: 219,
    category: "Suits",
    subCategory: "Statement",
    size: ["XS", "S", "M", "L", "XL"],
    color: "burgundy",
    bestSellerNumber: 18,
    mainImageLink:
      "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=1000&auto=format&fit=crop",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class ProductService {
  static async getAllProducts(filters?: ProductFilters, sort?: ProductSort): Promise<Product[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters) {
        // Category filter
        if (filters.categories.length > 0) {
          constraints.push(where('category', 'in', filters.categories));
        }

        // Price range filter
        if (filters.priceRange[0] > 0) {
          constraints.push(where('sellingPrice', '>=', filters.priceRange[0]));
        }
        if (filters.priceRange[1] < 50000) {
          constraints.push(where('sellingPrice', '<=', filters.priceRange[1]));
        }
      }

      // Sorting
      if (sort) {
        constraints.push(orderBy(sort.field, sort.direction));
      } else {
        // Default sort by bestSellerNumber
        constraints.push(orderBy('bestSellerNumber', 'desc'));
      }

      const productsQuery = query(
        collection(db, "products"),
        ...constraints
      );

      const querySnapshot = await getDocs(productsQuery);
      let products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
        } as Product);
      });

      // Use fallback if no products found
      if (products.length === 0) {
        products = fallbackProducts;
      }

      // Client-side filtering for complex filters that can't be done in Firestore
      if (filters) {
        products = this.applyClientSideFilters(products, filters);
      }

      // Apply sorting if specified
      if (sort) {
        products = this.sortProducts(products, sort);
      }

      return products;
    } catch (error) {
      console.warn("Using fallback products:", error);
      let products = fallbackProducts;
      
      if (filters) {
        products = this.applyClientSideFilters(products, filters);
      }
      
      if (sort) {
        products = this.sortProducts(products, sort);
      }
      
      return products;
    }
  }

  static async getFeaturedProducts(limitCount: number = 4): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        orderBy("bestSellerNumber", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return products.length > 0
        ? products
        : fallbackProducts.slice(0, limitCount);
    } catch (error) {
      console.warn("Using fallback products:", error);
      return fallbackProducts.slice(0, limitCount);
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("category", "==", category),
        orderBy("bestSellerNumber", "desc")
      );
      const querySnapshot = await getDocs(q);

      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return products;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return fallbackProducts.filter((p) => p.category === category);
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, "products", id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
      }

      return fallbackProducts.find((p) => p.id === id) || null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return fallbackProducts.find((p) => p.id === id) || null;
    }
  }

  private static applyClientSideFilters(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      // Size filter - check if product has any of the selected sizes
      if (filters.sizes.length > 0) {
        const hasMatchingSize = filters.sizes.some(size => 
          product.size.some(productSize => 
            productSize.toLowerCase() === size.toLowerCase()
          )
        );
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (filters.colors.length > 0 && product.color) {
        if (!filters.colors.includes(product.color.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  static sortProducts(products: Product[], sort: ProductSort): Product[] {
    return [...products].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }
}
