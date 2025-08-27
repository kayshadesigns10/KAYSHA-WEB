import { useRef, useEffect } from 'react';

export default function AboutPage() {
  const observedElements = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('fade-in-active', 'slide-up-active');
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center fade-in slide-up" ref={(el) => (observedElements.current[0] = el)}>
            <h1 className="heading-xl mb-6">Our Story</h1>
            <p className="text-lg text-muted-foreground">
              Discover the journey and vision behind Kaysha Styles, where elegance meets empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="fade-in slide-up" ref={(el) => (observedElements.current[1] = el)}>
              <h2 className="subheading mb-2">Our Beginning</h2>
              <h3 className="heading-lg mb-6">Founded with a Purpose</h3>
              <p className="text-muted-foreground mb-6">
                Kaysha Styles was born in 2018 from a simple observation: women deserved better-tailored professional attire 
                that didn't compromise on style or comfort. Our founder, Emily Kaysha, spent 15 years in corporate environments 
                experiencing firsthand the limited options for women seeking elegant, well-fitted suits.
              </p>
              <p className="text-muted-foreground">
                Starting with a small collection of custom-tailored suits for friends and colleagues, word spread quickly 
                about the quality and attention to detail in each piece. What began as a passion project soon developed into 
                a brand dedicated to elevating women's professional attire.
              </p>
            </div>
            <div className="aspect-square relative overflow-hidden rounded-sm fade-in slide-up" ref={(el) => (observedElements.current[2] = el)}>
              <img
                src="/assets/images/LightBG.png"
                alt="Kaysha Styles Founder"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center fade-in slide-up" ref={(el) => (observedElements.current[3] = el)}>
            <h2 className="subheading mb-2">Our Mission</h2>
            <h3 className="heading-lg mb-8">Empowering Through Elegance</h3>
            <p className="text-lg mb-8">
              We believe that clothing is more than fabric—it's an expression of identity and confidence. 
              Our mission is to provide women with impeccably tailored garments that empower them to move through 
              the world with assurance and grace.
            </p>
            <div className="flex justify-center">
              <img
                src="/assets/images/Symbol.png"
                alt="Kaysha Styles Symbol"
                className="h-16"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in slide-up" ref={(el) => (observedElements.current[4] = el)}>
            <h2 className="subheading mb-2">Our Values</h2>
            <h3 className="heading-lg">What We Stand For</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center px-6 fade-in slide-up" ref={(el) => (observedElements.current[5] = el)}>
              <div className="rounded-full bg-accent w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/assets/images/Symbol.png"
                  alt="Quality Icon"
                  className="h-8 w-8"
                />
              </div>
              <h4 className="text-xl font-medium mb-4">Quality Craftsmanship</h4>
              <p className="text-muted-foreground">
                We never compromise on materials or construction. Each piece is meticulously crafted 
                to ensure longevity and timeless style.
              </p>
            </div>

            <div className="text-center px-6 fade-in slide-up" style={{ transitionDelay: '100ms' }} ref={(el) => (observedElements.current[6] = el)}>
              <div className="rounded-full bg-accent w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/assets/images/Symbol.png"
                  alt="Sustainability Icon"
                  className="h-8 w-8"
                />
              </div>
              <h4 className="text-xl font-medium mb-4">Sustainable Practices</h4>
              <p className="text-muted-foreground">
                We're committed to responsible production methods, ethical sourcing, and reducing waste 
                through timeless designs that transcend seasonal trends.
              </p>
            </div>

            <div className="text-center px-6 fade-in slide-up" style={{ transitionDelay: '200ms' }} ref={(el) => (observedElements.current[7] = el)}>
              <div className="rounded-full bg-accent w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <img
                  src="/assets/images/Symbol.png"
                  alt="Inclusivity Icon"
                  className="h-8 w-8"
                />
              </div>
              <h4 className="text-xl font-medium mb-4">Inclusive Design</h4>
              <p className="text-muted-foreground">
                We design for real women with diverse body types, believing that exceptional fit 
                and style should be accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in slide-up" ref={(el) => (observedElements.current[8] = el)}>
            <h2 className="subheading mb-2">Our Team</h2>
            <h3 className="heading-lg">The People Behind Kaysha Styles</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="text-center fade-in slide-up" ref={(el) => (observedElements.current[9] = el)}>
              <div className="relative aspect-square overflow-hidden rounded-full w-48 h-48 mx-auto mb-6">
                <img
                  src="/assets/images/DarkBG.png"
                  alt="Emily Kaysha"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl font-medium mb-1">Emily Kaysha</h4>
              <p className="text-muted-foreground mb-4">Founder & Creative Director</p>
              <p className="text-sm text-muted-foreground px-4">
                With a background in fashion design and corporate experience, Emily brings a unique perspective to women's professional attire.
              </p>
            </div>

            <div className="text-center fade-in slide-up" style={{ transitionDelay: '100ms' }} ref={(el) => (observedElements.current[10] = el)}>
              <div className="relative aspect-square overflow-hidden rounded-full w-48 h-48 mx-auto mb-6">
                <img
                  src="/assets/images/GreenBG.png"
                  alt="Sophie Lin"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl font-medium mb-1">Sophie Lin</h4>
              <p className="text-muted-foreground mb-4">Head of Design</p>
              <p className="text-sm text-muted-foreground px-4">
                Sophie has over a decade of experience in luxury fashion, specializing in tailoring and innovative silhouettes.
              </p>
            </div>

            <div className="text-center fade-in slide-up" style={{ transitionDelay: '200ms' }} ref={(el) => (observedElements.current[11] = el)}>
              <div className="relative aspect-square overflow-hidden rounded-full w-48 h-48 mx-auto mb-6">
                <img
                  src="/assets/images/LightBG.png"
                  alt="James Rodriguez"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl font-medium mb-1">James Rodriguez</h4>
              <p className="text-muted-foreground mb-4">Production Director</p>
              <p className="text-sm text-muted-foreground px-4">
                James oversees our ethical production processes, ensuring the highest standards of craftsmanship and sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}