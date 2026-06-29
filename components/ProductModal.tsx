"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ isOpen, onClose, product, onAddToCart }: any) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [selectedModifiers, setSelectedModifiers] = useState<any[]>([]);

  // Limpiar estados cuando se abre un producto nuevo
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setInstructions("");
      setSelectedModifiers([]);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Lógica de cálculo de precios forzando el tipo Número para evitar errores NaN
  const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + Number(mod.priceDelta), 0);
  const unitPrice = Number(product.price) + modifiersTotal;
  const totalPrice = unitPrice * quantity;

  const toggleModifier = (mod: any) => {
    if (selectedModifiers.some(m => m.id === mod.id)) {
      setSelectedModifiers(selectedModifiers.filter(m => m.id !== mod.id));
    } else {
      setSelectedModifiers([...selectedModifiers, mod]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[var(--bakery-cream)] w-full max-w-md overflow-hidden shadow-2xl relative border-4 border-[var(--bakery-pink)]"
            style={{ borderRadius: "18px 4px 22px 4px" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
            >
              <X size={20} />
            </button>

            {product.image && (
              <div className="h-56 w-full relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bakery-cream)] to-transparent" />
              </div>
            )}

            <div className="p-6 pt-2 max-h-[60vh] overflow-y-auto">
              <h2 className="font-serif text-2xl font-bold text-[var(--bakery-brown)] mb-2">
                {product.name}
              </h2>
              <p className="text-sm font-medium text-[var(--bakery-brown)]/80 mb-6">
                {product.description}
              </p>

              {/* RENDERIZADO DINÁMICO DE OPCIONES (CASILLAS) */}
              {product.modifiers && product.modifiers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--bakery-pink)] mb-3">
                    Opciones de preparación
                  </h3>
                  <div className="space-y-2">
                    {product.modifiers.map((mod: any) => (
                      <label 
                        key={mod.id}
                        className="flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all bg-white"
                        style={{ borderColor: selectedModifiers.some(m => m.id === mod.id) ? "var(--bakery-pink)" : "rgba(92,61,50,0.1)" }}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={selectedModifiers.some(m => m.id === mod.id)}
                            onChange={() => toggleModifier(mod)}
                            className="w-5 h-5 accent-[var(--bakery-pink)] cursor-pointer"
                          />
                          <span className="text-sm font-bold text-[var(--bakery-brown)]">{mod.name}</span>
                        </div>
                        <span className="text-sm font-black text-[var(--bakery-brown)]">
                          {mod.priceDelta > 0 ? "+" : ""}{mod.priceDelta} Bs
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[var(--bakery-brown)]/60 mb-2">
                  Comentarios para cocina
                </h3>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ej: Para regalo, doble servilleta..."
                  className="w-full p-3 rounded-lg border-2 border-[var(--bakery-pink)]/30 bg-white/50 text-[var(--bakery-brown)] placeholder:text-[var(--bakery-brown)]/40 focus:outline-none focus:border-[var(--bakery-pink)] text-sm resize-none h-20"
                />
              </div>
            </div>

            <div className="p-6 bg-white border-t-2 border-[var(--bakery-pink)]/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 bg-[var(--bakery-cream)] rounded-full px-2 py-1 border border-[var(--bakery-pink)]/30">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[var(--bakery-brown)] font-bold hover:bg-[var(--bakery-pink)]/10 rounded-full transition-colors"
                >
                  -
                </button>
                <span className="font-black text-[var(--bakery-brown)] w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[var(--bakery-brown)] font-bold hover:bg-[var(--bakery-pink)]/10 rounded-full transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(quantity, instructions, selectedModifiers, unitPrice);
                  onClose();
                }}
                className="flex-1 bg-[var(--bakery-pink)] text-white py-3 rounded-full font-black tracking-widest uppercase text-sm shadow-[4px_4px_0px_var(--bakery-brown)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--bakery-brown)]"
              >
                Añadir {totalPrice.toFixed(2)} Bs
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}