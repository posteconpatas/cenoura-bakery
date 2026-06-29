export const storeConfig = {
  brand: {
    name: "Cenoura Bakery",
    whatsappNumber: "+59175739871", 
    currency: "Bs",
    logoPath: "/conejo-final.png" 
  },
  design: {
    heroImage: "/fondo.jpg", 
  },
  logistics: {
    baseDeliveryFee: 15, 
    freePickupLocations: [
      "Comunidad Católica Shalom (Av. Virgen de Cotoca entre 2do y 3er anillo)",
      "Plazuela Blacutt"
    ]
  },
  catalog: [
    {
      id: "porcion-zanahoria",
      name: "Porción Torta de Zanahoria",
      description: "Nuestra deliciosa porción individual. Viene acompañada de una exquisita cobertura de chocolate artesanal, o puedes seleccionarla simple.",
      category: "Nuestro Menú",
      price: 6, // Precio base con cobertura
      image: "/porcion.jpg", // Guarda tu foto como public/porcion.jpg
      modifiers: [
        { id: "sin-cobertura", name: "Sin cobertura de chocolate", priceDelta: -2 }
      ]
    },
    {
      id: "torta-zanahoria-familiar",
      name: "Torta de Zanahoria Familiar",
      description: "Tamaño familiar ideal para compartir. Bañada en nuestro ganache de chocolate o totalmente simple de pura zanahoria.",
      category: "Nuestro Menú",
      price: 120, // Precio base con cobertura
      image: "/torta-entera.jpg", // Guarda tu foto como public/torta-entera.jpg
      modifiers: [
        { id: "sin-cobertura", name: "Sin cobertura de chocolate", priceDelta: -15 }
      ]
    }
  ]
};
