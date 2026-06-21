"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Ícono de pin rojo para que resalte en el mapa rosado
const customIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapPickerProps {
  onChangePosition: (lat: number, lng: number) => void
  initialLat: number
  initialLng: number
}

export default function MapPicker({ onChangePosition, initialLat, initialLng }: MapPickerProps) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng })
  const markerRef = useRef<any>(null)

  useEffect(() => {
    setPosition({ lat: initialLat, lng: initialLng })
  }, [initialLat, initialLng])

  // Permite arrastrar el pin libremente
  const markerEvents = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const newPos = marker.getLatLng()
          setPosition(newPos)
          onChangePosition(newPos.lat, newPos.lng)
        }
      },
    }),
    [onChangePosition]
  )

  // Permite hacer clic en cualquier lado del mapa para mover el pin
  function MapClickEvents() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng)
        onChangePosition(e.latlng.lat, e.latlng.lng)
      },
    })
    return null
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border-4 border-[var(--bakery-pink)] relative shadow-inner">
      {/* Filtros Tailwind: Sepia, rotación de tono a rosa y saturación alta para el estilo Bakery */}
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
        className="sepia-[0.3] hue-rotate-[-20deg] saturate-150"
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker
          draggable={true}
          eventHandlers={markerEvents}
          position={[position.lat, position.lng]}
          icon={customIcon}
          ref={markerRef}
        />
        <MapClickEvents />
      </MapContainer>
    </div>
  )
}