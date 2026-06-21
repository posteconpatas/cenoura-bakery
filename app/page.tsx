"use client";

import { useRef, useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
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

  // ================= ESTADOS DE LOS MODALES =================
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // ================= MOTOR DE SCROLL (Framer Motion) =================
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Imagen segura en caso de que falle tu archivo local
  const safeHeroImage = storeConfig.design.heroImage || "https://images.unsplash.com/photo-1578985543219-12a4f48b1d6c?q=80&w=1920";

  return (
    <main className="bg-[var(--bakery-cream)] text-[var(--bakery-brown)] min-h-screen">
      
      {/* ================= HEADER PASTEL ================= */}
      <header className="bg-[var(--bakery-pink)] w-full pt-4 pb-4 px-6 flex items-center justify-between z-50 relative shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white">
            <img 
              src={storeConfig.brand.logoPath} 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=Logo"; }}
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest drop-shadow-sm">
            CENOURA <br/><span className="text-lg font-medium tracking-normal">BAKERY</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-white font-bold text-sm uppercase tracking-wider">
          <a href="#" className="border-b-2 border-white pb-1">Inicio</a>
          <a href="#" className="hover:opacity-90 transition-colors">Nuestros Productos</a>
          <a href="#" className="hover:opacity-90 transition-colors">Contacto</a>
        </nav>
      </header>
      
      {/* ONDAS CSS */}
      <div className="borde-ondas relative z-40"></div>

      {/* ================= HERO INTERACTIVO DEGRADADO ================= */}
      <section ref={heroRef} className="relative h-[85vh] w-full overflow-hidden border-b-[12px] border-[var(--bakery-pink)] bg-gradient-to-br from-[var(--bakery-pink)] via-[#e2b1b1] to-[var(--bakery-cream)]">
        
        {/* Capa animada por la GPU */}
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

        {/* Overlay en degradado rosa sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bakery-pink)]/30 via-transparent to-[var(--bakery-pink)]/60 mix-blend-multiply pointer-events-none" />

        {/* Textos que desaparecen al bajar */}
        <motion.div 
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="font-serif text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_8px_rgba(92,61,50,0.4)] sm:text-7xl md:text-8xl"
              style={{ textShadow: "2px 2px 0px var(--bakery-pink), -1px -1px 0px var(--bakery-pink)" }}
          >
            {storeConfig.brand.name}
          </h1>
          <p className="mt-4 max-w-md font-sans font-bold text-xl text-white sm:text-2xl drop-shadow-md">
            Dulzura horneada con el amor que te mereces.
          </p>
        </motion.div>
      </section>

      {/* ================= MENÚ — ASIMÉTRICO RÚSTICO ================= */}
      <section className="relative bg-[var(--bakery-cream)] px-6 py-20 sm:px-10 md:px-16 z-20">
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
                          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400?text=Cenoura"; }}
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
                          Añadir
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTÓN FLOTANTE DEL CARRITO ================= */}
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

      {/* ================= MODALES ================= */}
      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={(qty, inst) => {
          addToCart({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            basePrice: selectedProduct.price,
            quantity: qty,
            selectedModifiers: [],
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