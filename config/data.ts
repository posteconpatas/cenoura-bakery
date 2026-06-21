export const storeConfig = {
  brand: {
    name: "Cenoura Bakery",
    // Número donde llegarán los pedidos (puedes cambiarlo mañana)
    whatsappNumber: "+59176309344", 
    currency: "Bs",
    logoPath: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=150" // Temporal hasta enlazar tu logo local
  },
  design: {
    heroImage: "https://images.unsplash.com/photo-1578985543219-12a4f48b1d6c?q=80&w=1920",
  },
  logistics: {
    baseDeliveryFee: 15, // Costo estándar para envíos a domicilio
    freePickupLocations: [
      "Comunidad Católica Shalom (Av. Virgen de Cotoca entre 2do y 3er anillo)",
      "Plazuela Blacutt"
    ]
  },
  catalog: [
    // ================= PORCIONES =================
    {
      id: "porcion-clasica",
      name: "Porción Clásica",
      description: "Nuestra receta tradicional de zanahoria, esponjosa y perfecta para acompañar un café.",
      category: "Porciones",
      price: 4, 
      image: "https://images.unsplash.com/photo-1622814197607-4e6b189ff1e3?q=80&w=600",
      modifiers: []
    },
    {
      id: "porcion-cobertura",
      name: "Porción con Baño de Chocolate",
      description: "Nuestra clásica porción coronada con una gruesa capa de chocolate fundido artesanal.",
      category: "Porciones",
      price: 6, 
      image: "https://images.unsplash.com/photo-1578985543219-12a4f48b1d6c?q=80&w=600",
      modifiers: []
    },
    // ================= TORTAS ENTERAS =================
    {
      id: "torta-clasica",
      name: "Torta Entera Clásica",
      description: "Formato familiar. Masa húmeda de zanahoria pura, horneada a la perfección.",
      category: "Tortas Familiares",
      price: 72, 
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=600",
      modifiers: []
    },
    {
      id: "torta-cobertura",
      name: "Torta con Baño de Chocolate",
      description: "El plato fuerte. Torta entera cubierta completamente con nuestro ganache rústico de chocolate.",
      category: "Tortas Familiares",
      price: 84, 
      image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=600",
      modifiers: []
    }
  ]
};