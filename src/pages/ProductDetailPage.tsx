import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Info, Share2, Copy, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { OrderService } from "@/services/orderService";
import { ProductService } from "@/services/productService";
import { getGoogleDriveEmbedUrl, formatCurrency } from "@/lib/utils";
import {
  trackProductView,
  trackAddToCart,
  trackPurchaseIntent,
  trackShare,
  trackImageView,
  trackImageModal,
  type Product,
} from "@/lib/firebase";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      const fetchedProduct = await ProductService.getProductById(id);
      setProduct(fetchedProduct);
      setLoading(false);

      if (fetchedProduct) {
        trackProductView(fetchedProduct.id, fetchedProduct.name);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart(product, selectedSize);
    const price = product.discountedPrice || product.sellingPrice;
    trackAddToCart(product.id, product.name, price);
    alert("Added to cart!");
  };

  const handleBuyNow = async () => {
    if (!product || !selectedSize) {
      alert("Please select a size");
      return;
    }

    const price = product.discountedPrice || product.sellingPrice;
    trackPurchaseIntent(product.id, product.name, price, "buy_now");

    await OrderService.buyNow(product, selectedSize);
  };

  const handleShare = async (method: 'copy' | 'whatsapp' | 'facebook' | 'twitter') => {
    if (!product) return;

    const url = window.location.href;
    const text = `Check out this ${product.name} - ${formatCurrency(product.discountedPrice || product.sellingPrice)}`;

    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
      }
      trackShare(product.id, product.name, method);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleFavoriteToggle = () => {
    if (!product) return;
    toggleFavorite(product.id, product.name);
  };

  const handleImageClick = (index: number) => {
    if (!product) return;
    trackImageView(product.id, index, allImages.length);
    setSelectedImageIndex(index);
  };

  const openImageModal = (index: number) => {
    if (!product) return;
    setModalImageIndex(index);
    setShowImageModal(true);
    trackImageModal(product.id, 'open');
  };

  const closeImageModal = () => {
    if (!product) return;
    setShowImageModal(false);
    trackImageModal(product.id, 'close');
  };

  const nextImage = () => {
    const nextIndex = (modalImageIndex + 1) % allImages.length;
    setModalImageIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (modalImageIndex - 1 + allImages.length) % allImages.length;
    setModalImageIndex(prevIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.sellingPrice - product.discountedPrice) /
          product.sellingPrice) *
          100
      )
    : 0;

  const allImages = [product.mainImageLink, ...product.images];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in group">
                <img
                  src={getGoogleDriveEmbedUrl(allImages[selectedImageIndex])}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-opacity duration-300"
                  loading="lazy"
                  onClick={() => openImageModal(selectedImageIndex)}
                  onError={(e) => {
                    // Fallback to iframe if img fails
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
                
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
                    -{discountPercentage}%
                  </div>
                )}
                
                {/* Image navigation arrows for main image */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevIndex = (selectedImageIndex - 1 + allImages.length) % allImages.length;
                        handleImageClick(prevIndex);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-70 hover:opacity-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIndex = (selectedImageIndex + 1) % allImages.length;
                        handleImageClick(nextIndex);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-70 hover:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={`${product.id}-${index}`}
                      onClick={() => {
                        console.log('Thumbnail clicked:', index, 'Current:', selectedImageIndex);
                        handleImageClick(index);
                      }}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImageIndex === index
                          ? "border-primary border-3 shadow-md"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={getGoogleDriveEmbedUrl(image)}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to iframe if img fails
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
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Product Details</DialogTitle>
                          <DialogDescription asChild>
                            <div className="space-y-2">
                              <p><strong>Category:</strong> {product.category}</p>
                              {product.subCategory && (
                                <p><strong>Sub-category:</strong> {product.subCategory}</p>
                              )}
                              {product.color && (
                                <p><strong>Color:</strong> {product.color}</p>
                              )}
                              <p><strong>Best Seller Rank:</strong> #{product.bestSellerNumber}</p>
                              {product.descriptionSuits && (
                                <p><strong>Description:</strong> {product.descriptionSuits}</p>
                              )}
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Share and Favorite buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFavoriteToggle}
                      className={`${isFavorite(product.id) ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Share Product</DialogTitle>
                          <DialogDescription>
                            Share this amazing product with others
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleShare('copy')}
                            className="justify-start"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('whatsapp')}
                            className="justify-start bg-green-50 hover:bg-green-100 border-green-200"
                          >
                            📱 WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('facebook')}
                            className="justify-start bg-blue-50 hover:bg-blue-100 border-blue-200"
                          >
                            📘 Facebook
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShare('twitter')}
                            className="justify-start bg-sky-50 hover:bg-sky-100 border-sky-200"
                          >
                            🐦 Twitter
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-3xl font-bold text-primary">
                        {formatCurrency(product.discountedPrice)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(product.sellingPrice)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap mb-6">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.subCategory && (
                    <Badge variant="outline">{product.subCategory}</Badge>
                  )}
                  {product.color && (
                    <Badge variant="outline">{product.color}</Badge>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.size.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className={`px-4 ${isFavorite(product.id) ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <Button 
                  onClick={handleBuyNow} 
                  className="w-full" 
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>

              {/* Product Description */}
              {product.descriptionSuits && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.descriptionSuits}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous button */}
            {allImages.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative max-h-full max-w-full">
              <img
                src={getGoogleDriveEmbedUrl(allImages[modalImageIndex])}
                alt={`${product.name} - Image ${modalImageIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const iframe = document.createElement('iframe');
                  iframe.src = target.src;
                  iframe.className = 'max-h-full max-w-full rounded-lg';
                  iframe.style.width = '800px';
                  iframe.style.height = '600px';
                  iframe.title = target.alt;
                  target.parentNode?.replaceChild(iframe, target);
                }}
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {modalImageIndex + 1} of {allImages.length}
              </div>
            </div>

            {/* Next button */}
            {allImages.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}