import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileForm } from "@/components/ProfileForm";
import { useProfile } from "@/hooks/useProfile";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About Us", path: "/about" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { profile, hasProfile } = useProfile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="container-custom flex items-center justify-between h-full">
        <Link to="/" className="z-10">
          <img
            src="/assets/images/TextIcon.png"
            alt="Kaysha Styles"
            className="h-14 sm:h-16"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "nav-link text-sm tracking-wider",
                location.pathname === item.path && "nav-link-active"
              )}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-sm space-x-1 nav-link"
          >
            <Instagram size={18} />
            <span>Instagram</span>
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ProfileForm
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className={hasProfile ? "bg-green-50 hover:bg-green-100 text-green-600" : ""}
                title={hasProfile ? `Profile: ${profile?.name}` : "Setup Profile"}
              >
                <User className="h-5 w-5" />
              </Button>
            }
          />
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <ProfileForm
            trigger={
              <Button 
                variant="ghost" 
                size="icon" 
                className={hasProfile ? "bg-green-50 hover:bg-green-100 text-green-600" : ""}
                title={hasProfile ? `Profile: ${profile?.name}` : "Setup Profile"}
              >
                <User className="h-5 w-5" />
              </Button>
            }
          />
          <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <div className="flex justify-between items-center py-4">
                <h2 className="font-medium text-lg">Menu</h2>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>
              <nav className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "text-lg tracking-wider",
                      location.pathname === item.path && "font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-lg space-x-2"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
