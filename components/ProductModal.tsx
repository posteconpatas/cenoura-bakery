"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: (quantity: number, instructions: string) => void;
}

export default function ProductModal({ isOpen, onClose, product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  // Reiniciar estado cada vez que se abre un producto nuevo
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setInstructions("");
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(quantity, instructions);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-[var(--bakery-cream)] w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[var(--bakery-pink)]"
        >
          {/* Header con Imagen */}
          <div className="relative h-48 bg-neutral-200">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-black text-[var(--bakery-brown)] mb-2">{product.name}</h3>
            <p className="text-[var(--bakery-brown)]/80 text-sm font-medium mb-6">{product.description}</p>

            {/* Comentarios Especiales */}
            <div className="mb-6">
              <label className="block text-sm font-black text-[var(--bakery-brown)] uppercase tracking-widest mb-2">Comentarios para cocina</label>
              <textarea 
                placeholder="Ej: Sin azúcar, sin cobertura de chocolate..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-[var(--bakery-pink)]/30 focus:border-[var(--bakery-pink)] outline-none bg-white h-24 resize-none font-sans text-sm"
              />
            </div>

            {/* Controles de Cantidad y Botón */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 bg-white border-2 border-[var(--bakery-pink)]/30 rounded-full px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-[var(--bakery-brown)] hover:text-[var(--bakery-pink)]"><Minus size={20}/></button>
                <span className="font-black text-xl w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-[var(--bakery-brown)] hover:text-[var(--bakery-pink)]"><Plus size={20}/></button>
              </div>

              <button 
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--bakery-pink)] text-white py-4 rounded-full font-black hover:bg-[var(--bakery-brown)] transition-colors shadow-lg"
              >
                AÑADIR <span className="font-sans font-bold">{(product.price * quantity).toFixed(2)} Bs</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}