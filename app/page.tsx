"use client";

import { useRef, useState } from "react";
import { Plus, ShoppingBag, MapPin, Phone } from "lucide-react";
import { storeConfig } from "../config/data";
import { useCartStore } from "../store/cartStore";
import { motion, useScroll, useTransform } from "framer-motion";
import CheckoutModal from "../components/CheckoutModal";
import ProductModal from "../components/ProductModal";

export default function HomePage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getCartTotal());

  const categories = [...new Set(storeConfig.catalog.map(p => p.category))];

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const safeHeroImage = storeConfig.design.heroImage || "https://images.unsplash.com/photo-1578985543219-12a4f48b1d6c?q=80&w=1920";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="bg-[var(--bakery-cream)] text-[var(--bakery-brown)] min-h-screen scroll-smooth">
      
      <header className="bg-[var(--bakery-pink)] w-full py-2 px-6 flex items-center justify-between z-50 relative shadow-md">
        <div className="flex items-center gap-3">
          <div 
            className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex-shrink-0 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 z-10 -my-4 md:-my-6 lg:-my-8"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={storeConfig.brand.logoPath} 
              alt="Logo Cenoura Bakery" 
              className="w-full h-full object-contain drop-shadow-[0_4px_6px_rgba(92,61,50,0.4)]"
              onError={(e) => { e.currentTarget.src = "/conejo-final.png"; }} 
            />
          </div>

          <h1 
            className="text-2xl md:text-3xl font-black text-white tracking-widest drop-shadow-sm cursor-pointer leading-none mt-1"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            CENOURA <br/><span className="text-base md:text-lg font-medium tracking-normal">BAKERY</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex gap-8 text-white font-bold text-sm uppercase tracking-wider">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="border-b-2 border-white pb-1 font-bold">
            Inicio
          </button>
          <button onClick={() => scrollToSection("menu")} className="hover:opacity-90 transition-colors font-bold">
            Nuestros Productos
          </button>
          <button onClick={() => scrollToSection("contacto")} className="hover:opacity-90 transition-colors font-bold">
            Contacto
          </button>
        </nav>
      </header>
      
      <div className="borde-ondas relative z-40"></div>

      <section ref={heroRef} className="relative h-[40vh] min-h-[320px] w-full overflow-hidden border-b-[8px] border-[var(--bakery-pink)] bg-gradient-to-br from-[var(--bakery-pink)] via-[#e2b1b1] to-[var(--bakery-cream)]">
        <motion.div
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{
            scale: heroScale,
            y: heroY,
            backgroundImage: `url(${safeHeroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bakery-pink)]/40 via-[var(--bakery-pink)]/20 to-[var(--bakery-pink)]/80 mix-blend-multiply pointer-events-none" />
        <motion.div 
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_8px_rgba(92,61,50,0.5)] sm:text-5xl md:text-6xl"
              style={{ textShadow: "2px 2px 0px var(--bakery-pink), -1px -1px 0px var(--bakery-pink)" }}
          >
            {storeConfig.brand.name}
          </h1>
          <p className="mt-3 max-w-md font-sans font-bold text-lg text-white sm:text-xl drop-shadow-md">
            Dulzura horneada con el amor que te mereces.
          </p>
        </motion.div>
      </section>

      <section id="menu" className="relative bg-[var(--bakery-cream)] px-6 py-20 sm:px-10 md:px-16 z-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,#5c3d32_0,#5c3d32_1px,transparent_1px,transparent_8px)]" />
        <div className="relative mx-auto max-w-6xl">
          {categories.map((categoria) => (
            <div key={categoria} className="mb-20">
              <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 inline-block border-b-4 border-[var(--bakery-pink)] pb-3 font-serif text-4xl font-bold text-[var(--bakery-brown)] sm:text-5xl"
              >
                {categoria}
              </motion.h2>

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {storeConfig.catalog.filter(p => p.category === categoria).map((producto, idx) => (
                  <motion.article
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                    key={producto.id}
                    className="group relative flex flex-col overflow-hidden bg-white shadow-[6px_8px_0px_var(--bakery-pink)] transition-transform duration-300 hover:-translate-y-2 border-2 border-[var(--bakery-cream)]"
                    style={{
                      borderRadius: idx % 2 === 0 ? "2px 18px 4px 22px" : "18px 4px 22px 2px",
                    }}
                  >
                    {producto.image && (
                      <div className="relative h-60 w-full overflow-hidden bg-neutral-200">
                        <img
                          src={producto.image}
                          alt={producto.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { e.currentTarget.src = "/conejo-final.png"; }}
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="font-serif text-2xl font-bold leading-tight text-[var(--bakery-brown)]">
                        {producto.name}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-[var(--bakery-brown)]/80">
                        {producto.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-6">
                        <span className="font-sans text-3xl font-black tracking-tight text-[var(--bakery-brown)]">
                          {producto.price} <span className="text-lg text-[var(--bakery-pink)]">Bs</span>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProduct(producto);
                            setIsProductModalOpen(true);
                          }}
                          type="button"
                          className="flex items-center gap-2 rounded-sm bg-[var(--bakery-pink)] px-5 py-3 font-sans text-xs font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_var(--bakery-brown)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--bakery-brown)]"
                        >
                          <Plus className="h-4 w-4" />
                          Ver Opciones
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}

                <motion.article
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="relative flex flex-col items-center justify-center p-6 text-center bg-white/40 border-4 border-dashed border-[var(--bakery-pink)]/40 min-h-[380px]"
                  style={{ borderRadius: "18px 4px 22px 2px" }}
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--bakery-pink)]/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-[var(--bakery-pink)]/40 animate-pulse" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--bakery-brown)]/50 tracking-wide">
                    Próximamente
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--bakery-pink)]/60 mt-1">
                    Coming Soon
                  </p>
                  <p className="text-sm font-medium text-[var(--bakery-brown)]/60 max-w-[200px] mt-3 leading-relaxed">
                    Estamos horneando nuevas recetas para sorprenderte muy pronto.
                  </p>
                </motion.article>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="contacto" className="bg-[var(--bakery-brown)] text-[var(--bakery-cream)] px-6 py-12 border-t-[10px] border-[var(--bakery-pink)] z-20 relative">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white">{storeConfig.brand.name}</h3>
            <p className="text-sm font-medium opacity-80 max-w-sm">
              Dulzura horneada con ingredientes de primera calidad. Realiza tus pedidos con un mínimo de 24 horas de anticipación.
            </p>
            <div className="flex items-center gap-3 pt-2 text-white font-bold">
              <Phone size={20} className="text-[var(--bakery-pink)]" />
              <span>Pedidos: {storeConfig.brand.whatsappNumber}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-[var(--bakery-pink)]">Puntos de Entrega Gratuitos</h4>
            <div className="space-y-3">
              {storeConfig.logistics.freePickupLocations.map((loc, i) => (
                <div key={i} className="flex gap-3 bg-black/20 p-3 rounded-xl border border-white/10">
                  <MapPin size={20} className="text-[var(--bakery-pink)] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{loc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-white/10 mt-10 pt-6 text-center text-xs opacity-60 font-medium">
          &copy; {new Date().getFullYear()} Cenoura Bakery. Todos los derechos reservados. Desarrollado por Ethos Tech.
        </div>
      </footer>

      {cartItems.length > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-4 bg-[var(--bakery-pink)] border-4 border-[var(--bakery-cream)] text-[var(--bakery-brown)] py-3 px-6 shadow-[6px_8px_0px_var(--bakery-brown)] transition-transform hover:scale-105 active:scale-95"
            style={{ borderRadius: "18px 4px 22px 4px" }}
          >
            <ShoppingBag size={28} className="text-white" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{cartItems.length} items</span>
              <span className="font-black text-xl leading-none text-white">
                {cartTotal.toFixed(2)} Bs
              </span>
            </div>
          </button>
        </motion.div>
      )}

      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={(qty: number, inst: string, mods: any[], unitPrice: number) => {
          const hasNoCoverage = mods.some(m => m.id === "sin-cobertura");
          addToCart({
            productId: selectedProduct?.id + (hasNoCoverage ? "-sin-cobertura" : ""),
            name: selectedProduct?.name + (hasNoCoverage ? " (Sin cobertura)" : ""),
            basePrice: Number(unitPrice),
            quantity: qty,
            selectedModifiers: mods,
            instructions: inst
          });
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

    </main>
  );
}