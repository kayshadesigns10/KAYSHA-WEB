import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useProfile } from "@/hooks/useProfile";
import { OrderService } from "@/services/orderService";
import { getGoogleDriveEmbedUrl, formatCurrency } from "@/lib/utils";
import { ProfileForm } from "@/components/ProfileForm";
import {
  trackProductView,
  trackAddToCart,
  trackPurchaseIntent,
  trackImageAutoScroll,
  type Product,
} from "@/lib/firebase";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  console.log(product);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { profile, isProfileComplete } = useProfile();

  const allImages = [product.mainImageLink, ...product.images];
  
  // Auto-scroll images when hovering
  useEffect(() => {
    if (isHovered && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => {
          const nextIndex = (prev + 1) % allImages.length;
          trackImageAutoScroll(product.id, nextIndex);
          return nextIndex;
        });
      }, 2000); // Change image every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0); // Reset to first image when not hovered
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, allImages.length, product.id]);

  const handleProductView = () => {
    trackProductView(product.id, product.name);
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id, product.name);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart(product, selectedSize);
    const price = product.discountedPrice || product.sellingPrice;
    trackAddToCart(product.id, product.name, price);
    alert("Added to cart!");
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!isProfileComplete()) {
      setShowProfileForm(true);
      return;
    }

    const price = product.discountedPrice || product.sellingPrice;
    trackPurchaseIntent(product.id, product.name, price, "buy_now");

    await OrderService.buyNow(product, selectedSize, profile);
  };

  const handleProfileSaved = async () => {
    setShowProfileForm(false);
    if (selectedSize) {
      const price = product.discountedPrice || product.sellingPrice;
      trackPurchaseIntent(product.id, product.name, price, "buy_now");
      await OrderService.buyNow(product, selectedSize, profile);
    }
  };

  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.sellingPrice - product.discountedPrice) /
          product.sellingPrice) *
          100
      )
    : 0;

  const currentImageUrl = getGoogleDriveEmbedUrl(allImages[currentImageIndex]);

  return (
    <div 
      className={`group cursor-pointer ${className}`} 
      onClick={handleProductView}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-4">
        <img
          src={currentImageUrl}
          alt={`${product.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const iframe = document.createElement('iframe');
            iframe.src = target.src;
            iframe.className = target.className;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.title = target.alt;
            target.parentNode?.replaceChild(iframe, target);
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        
        {/* Navigation arrows for multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </>
        )}

        {/* Image indicators for multiple images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white shadow-md'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            -{discountPercentage}%
          </div>
        )}

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleFavoriteClick}
            className={`${
              isFavorite(product.id) 
                ? 'bg-red-100 border-red-200 text-red-600 hover:bg-red-200' 
                : 'hover:bg-gray-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium mb-1">{product.name}</h4>
          <div className="flex items-center gap-2">
            {product.discountedPrice ? (
              <>
                <span className="text-primary font-semibold">
                  {formatCurrency(product.discountedPrice)}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </>
            ) : (
              <span className="text-primary font-semibold">
                {formatCurrency(product.sellingPrice)}
              </span>
            )}
          </div>
        </div>

        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {product.size.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          <Button onClick={handleBuyNow} size="sm" className="flex-1">
            Buy Now
          </Button>
        </div>
      </div>
      
      <ProfileForm
        open={showProfileForm}
        onOpenChange={setShowProfileForm}
        onProfileSaved={handleProfileSaved}
      />
    </div>
  );
}
