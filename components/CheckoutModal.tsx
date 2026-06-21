"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useCartStore } from "../store/cartStore";
import { generateWhatsAppLink } from "../utils/whatsappCompiler";
import { X, Send, MapPin, Calendar, Info, AlertTriangle, Map, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // Ahora traemos removeFromCart para poder borrar ítems
  const { items, getCartTotal, removeFromCart } = useCartStore();
  
  const [name, setName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [addressType, setAddressType] = useState<"now" | "later">("now");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [agreedToPay, setAgreedToPay] = useState(false);
  
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapError, setMapError] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const total = getCartTotal();

  const handleGetLocation = () => {
    setIsLocating(true);
    setMapError(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setShowMap(true);
          setIsLocating(false);
        },
        (error) => {
          setLat(-17.7833);
          setLng(-63.1821);
          setShowMap(true);
          setMapError(true);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setLat(-17.7833);
      setLng(-63.1821);
      setShowMap(true);
      setMapError(true);
      setIsLocating(false);
    }
  };

  const handleManualMap = () => {
    setLat(-17.7833);
    setLng(-63.1821);
    setShowMap(true);
    setMapError(true);
  };

  const handleConfirmOrder = () => {
    const link = generateWhatsAppLink({
      items,
      customerName: name,
      deliveryDate,
      addressType,
      deliveryAddress: address,
      lat,
      lng,
      total
    });
    window.open(link, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[var(--bakery-cream)] w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[var(--bakery-pink)] max-h-[95vh] flex flex-col"
        >
          <div className="bg-[var(--bakery-pink)] p-5 text-white flex justify-between items-center shrink-0">
            <h2 className="text-xl font-black tracking-tight">MI PEDIDO</h2>
            <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/40">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            
            {/* ================= RESUMEN DEL CARRITO ================= */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-[var(--bakery-brown)] uppercase tracking-widest border-b-2 border-[var(--bakery-pink)]/30 pb-2">
                Resumen de tu compra
              </h3>
              
              {items.length === 0 ? (
                <p className="text-center text-[var(--bakery-brown)]/60 py-4 font-medium">Tu carrito está vacío.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                      <div className="flex-1">
                        <p className="font-bold text-[var(--bakery-brown)] text-sm">{item.quantity}x {item.name}</p>
                        {item.instructions && (
                          <p className="text-xs text-[var(--bakery-brown)]/70 mt-1 italic leading-tight bg-orange-50 p-1.5 rounded-md">
                            Nota: {item.instructions}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                        <span className="font-black text-[var(--bakery-brown)]">{item.itemTotal.toFixed(2)} Bs</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors bg-red-50 p-1.5 rounded-md"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ADVERTENCIA DE PAGO */}
            {items.length > 0 && (
              <div className={`p-4 rounded-2xl border-2 transition-all ${agreedToPay ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                <div className="flex gap-3 mb-3">
                  <AlertTriangle className={agreedToPay ? "text-green-600" : "text-orange-500"} />
                  <h3 className="font-black text-[var(--bakery-brown)] text-sm uppercase">Políticas de Pago</h3>
                </div>
                <p className="text-sm text-[var(--bakery-brown)] mb-4 font-medium leading-relaxed">
                  Para procesar tu pedido deberás cancelarlo previamente. No habilitamos pagos en efectivo, todo se maneja mediante transferencia o QR.
                </p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreedToPay} 
                    onChange={(e) => setAgreedToPay(e.target.checked)}
                    className="w-5 h-5 accent-[var(--bakery-pink)]"
                  />
                  <span className="font-bold text-sm text-[var(--bakery-brown)]">Entendido, estoy de acuerdo.</span>
                </label>
              </div>
            )}

            {/* CUERPO DEL FORMULARIO */}
            {items.length > 0 && (
              <div className={`space-y-6 transition-opacity ${!agreedToPay ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                
                <div className="space-y-4">
                  <label className="block text-sm font-black text-[var(--bakery-brown)] uppercase tracking-widest">¿Quién recibe?</label>
                  <input 
                    type="text" placeholder="Tu Nombre" 
                    className="w-full p-4 rounded-xl border-2 border-[var(--bakery-pink)]/30 focus:border-[var(--bakery-pink)] outline-none bg-white text-lg font-medium"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-[var(--bakery-brown)] uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={18}/> Fecha de Entrega
                  </label>
                  <p className="text-xs text-[var(--bakery-brown)]/60 -mt-3">Aceptamos pedidos con mínimo 24h de anticipación.</p>
                  <input 
                    type="date" 
                    min={minDate}
                    className="w-full p-4 rounded-xl border-2 border-[var(--bakery-pink)]/30 focus:border-[var(--bakery-pink)] outline-none bg-white text-lg font-medium text-[var(--bakery-brown)]"
                    value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-black text-[var(--bakery-brown)] uppercase tracking-widest">Ubicación</label>
                  
                  <div className="flex bg-white rounded-xl border-2 border-[var(--bakery-pink)]/30 overflow-hidden">
                    <button 
                      onClick={() => setAddressType("now")}
                      className={`flex-1 p-3 text-sm font-bold transition-colors ${addressType === "now" ? "bg-[var(--bakery-pink)] text-white" : "text-[var(--bakery-brown)]/60"}`}
                    >
                      Dar Dirección
                    </button>
                    <button 
                      onClick={() => setAddressType("later")}
                      className={`flex-1 p-3 text-sm font-bold transition-colors ${addressType === "later" ? "bg-[var(--bakery-pink)] text-white" : "text-[var(--bakery-brown)]/60"}`}
                    >
                      Coordinar Luego
                    </button>
                  </div>

                  {addressType === "now" && (
                    <div className="space-y-4 p-4 bg-white rounded-xl border-2 border-[var(--bakery-pink)]/30">
                      {!showMap ? (
                        <div className="flex flex-col gap-3">
                          <button 
                            onClick={handleGetLocation}
                            className="w-full flex items-center justify-center gap-2 bg-[var(--bakery-pink)] p-4 rounded-xl text-sm font-bold text-white hover:bg-[var(--bakery-brown)] transition-colors shadow-md"
                          >
                            <MapPin size={18} />
                            {isLocating ? "Buscando satélites..." : "Extraer GPS Automático"}
                          </button>
                          <button 
                            onClick={handleManualMap}
                            className="w-full flex items-center justify-center gap-2 bg-neutral-100 p-4 rounded-xl text-sm font-bold text-[var(--bakery-brown)] hover:bg-neutral-200 transition-colors"
                          >
                            <Map size={18} />
                            O marcar en el mapa manualmente
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                          {mapError ? (
                            <p className="text-xs font-bold text-orange-600 text-center bg-orange-50 p-2 rounded-lg border border-orange-200">
                              Arrastra el pin rosado hasta tu domicilio.
                            </p>
                          ) : (
                            <p className="text-xs font-bold text-green-600 text-center bg-green-50 p-2 rounded-lg border border-green-200">
                              ¡GPS encontrado! Verifica que el pin esté correcto o arrástralo.
                            </p>
                          )}
                          <MapPicker 
                            initialLat={lat || -17.7833} 
                            initialLng={lng || -63.1821} 
                            onChangePosition={(newLat, newLng) => {
                              setLat(newLat);
                              setLng(newLng);
                            }} 
                          />
                        </div>
                      )}
                      
                      <textarea 
                        placeholder="Escribe referencias: Barrio, avenida, color de reja, frente a una farmacia..." 
                        className="w-full p-3 rounded-lg border-2 border-[var(--bakery-pink)]/30 focus:border-[var(--bakery-pink)] outline-none bg-neutral-50 h-24 resize-none font-sans text-sm"
                        value={address} onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {addressType === "later" && (
                    <div className="flex items-start gap-2 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--bakery-brown)] font-medium">Perfecto. Te pediremos tu ubicación y referencias por WhatsApp el día de la entrega.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-orange-50 border-t-2 border-orange-100 mt-auto shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[var(--bakery-brown)] opacity-60 uppercase">Total Neto</span>
              <span className="text-3xl font-black text-[var(--bakery-brown)]">{total.toFixed(2)} <span className="text-lg text-[var(--bakery-pink)]">Bs</span></span>
            </div>
            <button 
              disabled={items.length === 0 || !agreedToPay || !name || !deliveryDate || (addressType === "now" && !address && !lat)}
              onClick={handleConfirmOrder}
              className="w-full flex items-center justify-center gap-3 bg-[var(--bakery-pink)] text-white py-4 rounded-full font-black text-lg hover:bg-[var(--bakery-brown)] transition-all shadow-xl disabled:opacity-40 disabled:pointer-events-none"
            >
              ENVIAR PEDIDO A WHATSAPP <Send size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}