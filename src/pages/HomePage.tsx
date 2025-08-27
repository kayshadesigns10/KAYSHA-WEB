import { useState, useEffect, useRef } from "react";
import { ChevronRight, ShoppingBag, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import InstagramStoriesDemo from "@/components/InstagramStoriesDemo";
import { ProductCard } from "@/components/ProductCard";
import { ProductService } from "@/services/productService";
import { trackPageView, type Product } from "@/lib/firebase";

const instagramPosts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop",
    link: "https://instagram.com",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=500&auto=format&fit=crop",
    link: "https://instagram.com",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=500&auto=format&fit=crop",
    link: "https://instagram.com",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=500&auto=format&fit=crop",
    link: "https://instagram.com",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop",
    link: "https://instagram.com",
  },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const observedElements = useRef<(HTMLElement | null)[]>([]);

  const videoUrl = "/assets/videos/hero-video.mp4";

  useEffect(() => {
    trackPageView("Home");

    const loadFeaturedProducts = async () => {
      try {
        const products = await ProductService.getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add("fade-in-active", "slide-up-active");
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0">
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "blur(3px)" }}
          />
        </div>
        <div className="container-custom relative z-20 text-white">
          <div
            className="max-w-2xl fade-in slide-up"
            ref={(el) => (observedElements.current[0] = el)}
          >
            <h1 className="heading-xl mb-6">
              Elegant Suits for the Modern Woman
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Discover our premium collection of suits and clothing designed for
              confidence and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="btn-primary">
                <Link to="/shop">Shop Collection</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white bg-white/10"
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container-custom">
          <div
            className="mb-12 text-center fade-in slide-up"
            ref={(el) => (observedElements.current[1] = el)}
          >
            <h2 className="subheading mb-2">Our Collection</h2>
            <h3 className="heading-lg">Featured Products</h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="slide-up"
                />
              ))}
            </div>
          )}

          <div
            className="flex justify-center mt-12 fade-in slide-up"
            ref={(el) => (observedElements.current[6] = el)}
          >
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link to="/shop">
                View All Products
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Message Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div
              className="aspect-[4/5] relative overflow-hidden rounded-sm fade-in slide-up"
              ref={(el) => (observedElements.current[7] = el)}
            >
              <img
                src="https://images.unsplash.com/photo-1608228088998-57828365d486?q=80&w=1000&auto=format&fit=crop"
                alt="Kaysha Styles Fashion"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="fade-in slide-up"
              ref={(el) => (observedElements.current[8] = el)}
            >
              <h2 className="subheading mb-2">Our Philosophy</h2>
              <h3 className="heading-lg mb-6">
                Crafted with Precision, Designed with Purpose
              </h3>
              <p className="text-muted-foreground mb-6">
                At Kaysha Styles, we believe in the transformative power of
                well-tailored clothing. Our suits and collections are crafted
                with meticulous attention to detail, using premium fabrics and
                sustainable practices.
              </p>
              <p className="text-muted-foreground mb-8">
                Each piece is designed to empower women, combining timeless
                elegance with modern silhouettes that celebrate confidence and
                individuality.
              </p>
              <Button asChild className="btn-primary">
                <Link to="/about">Discover Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div
            className="fade-in slide-up"
            ref={(el) => (observedElements.current[9] = el)}
          >
            <InstagramStoriesDemo />
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20">
        <div className="container-custom">
          <div
            className="mb-12 text-center fade-in slide-up"
            ref={(el) => (observedElements.current[10] = el)}
          >
            <h2 className="subheading mb-2">Social Media</h2>
            <h3 className="heading-lg mb-4">Follow Us on Instagram</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our community and stay updated with the latest collections,
              styling tips, and behind-the-scenes content.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {instagramPosts.map((post, index) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group aspect-square overflow-hidden relative fade-in slide-up"
                ref={(el) => (observedElements.current[11 + index] = el)}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img
                  src={post.image}
                  alt="Instagram post"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <Instagram
                    className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                    size={32}
                  />
                </div>
              </a>
            ))}
          </div>

          <div
            className="flex justify-center mt-10 fade-in slide-up"
            ref={(el) => (observedElements.current[16] = el)}
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-primary hover:underline transition-colors"
            >
              <Instagram size={18} />
              <span>@kaysha_styles</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
