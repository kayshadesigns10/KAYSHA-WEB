import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductService, type ProductFilters, type ProductSort } from "@/services/productService";
import { type Product } from "@/lib/firebase";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/lib/utils";
import filtersConfig from "@/config/filters.json";

// Get filter configurations from JSON
const { categories, sizes, colors, priceRange } = filtersConfig;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({
    categories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    priceRange: [priceRange.min, priceRange.max] as [number, number],
  });
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products on component mount and when filters/sort change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const sort: ProductSort | undefined = sortBy === "featured" ? undefined : 
          sortBy === "price-asc" ? { field: 'sellingPrice', direction: 'asc' } :
          sortBy === "price-desc" ? { field: 'sellingPrice', direction: 'desc' } :
          undefined;

        const fetchedProducts = await ProductService.getAllProducts(activeFilters, sort);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters, sortBy]);

  const handleCategoryChange = (category: string) => {
    setActiveFilters((prev) => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== category),
        };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleSizeChange = (size: string) => {
    setActiveFilters((prev) => {
      if (prev.sizes.includes(size)) {
        return { ...prev, sizes: prev.sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const handleColorChange = (color: string) => {
    setActiveFilters((prev) => {
      if (prev.colors.includes(color)) {
        return { ...prev, colors: prev.colors.filter((c) => c !== color) };
      } else {
        return { ...prev, colors: [...prev.colors, color] };
      }
    });
  };

  const handlePriceChange = (value: number[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }));
  };

  // Products are already filtered and sorted by the service

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={activeFilters.categories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-medium mb-4">Sizes</h3>
        <div className="space-y-3">
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size.id}`}
                checked={activeFilters.sizes.includes(size.id)}
                onCheckedChange={() => handleSizeChange(size.id)}
              />
              <label
                htmlFor={`size-${size.id}`}
                className="text-sm cursor-pointer"
              >
                {size.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-medium mb-4">Colors</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={activeFilters.colors.includes(color.id)}
                onCheckedChange={() => handleColorChange(color.id)}
              />
              <label
                htmlFor={`color-${color.id}`}
                className="text-sm cursor-pointer"
              >
                {color.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            max={priceRange.max}
            step={priceRange.step}
            value={[activeFilters.priceRange[0], activeFilters.priceRange[1]]}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(activeFilters.priceRange[0])}</span>
            <span>{formatCurrency(activeFilters.priceRange[1])}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-16 md:py-24">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="heading-lg mb-4">Shop Our Collection</h1>
          <p className="text-muted-foreground max-w-3xl">
            Discover our curated selection of premium women's suits and
            clothing. From classic tailored pieces to modern statement suits,
            find your perfect style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Mobile Filter and Sort */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="py-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(activeFilters.categories.length > 0 ||
              activeFilters.sizes.length > 0 ||
              activeFilters.colors.length > 0 ||
              activeFilters.priceRange[0] > priceRange.min ||
              activeFilters.priceRange[1] < priceRange.max) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                  >
                    <span>
                      {categories.find((c) => c.id === category)?.label}
                    </span>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {activeFilters.sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                  >
                    <span>{sizes.find((s) => s.id === size)?.label}</span>
                    <button
                      onClick={() => handleSizeChange(size)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {activeFilters.colors.map((color) => (
                  <div
                    key={color}
                    className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
                  >
                    <span>{colors.find((c) => c.id === color)?.label}</span>
                    <button
                      onClick={() => handleColorChange(color)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(activeFilters.priceRange[0] > priceRange.min ||
                  activeFilters.priceRange[1] < priceRange.max) && (
                  <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                    <span>
                      {formatCurrency(activeFilters.priceRange[0])} - {formatCurrency(activeFilters.priceRange[1])}
                    </span>
                    <button
                      onClick={() =>
                        setActiveFilters((prev) => ({
                          ...prev,
                          priceRange: [priceRange.min, priceRange.max],
                        }))
                      }
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() =>
                    setActiveFilters({
                      categories: [],
                      sizes: [],
                      colors: [],
                      priceRange: [priceRange.min, priceRange.max],
                    })
                  }
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && products.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or browse our categories
                </p>
                <Button
                  onClick={() =>
                    setActiveFilters({
                      categories: [],
                      sizes: [],
                      colors: [],
                      priceRange: [priceRange.min, priceRange.max],
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
