"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { type LocationItem, MAP_CATEGORIES, getCategoryColor, getCategoryName } from "@/lib/map-utils"
import Script from "next/script"

export function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(MAP_CATEGORIES.map((cat) => cat.id))
  const [isLoading, setIsLoading] = useState(true)
  const [mapInitialized, setMapInitialized] = useState(false)
  const leafletMapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)

  // טעינת נתוני המיקומים
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/map-locations")
        const data = await response.json()
        setLocations(data)
        setFilteredLocations(data)
      } catch (error) {
        console.error("Error fetching locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // אתחול המפה
  useEffect(() => {
    if (!mapRef.current || mapInitialized || typeof window === "undefined" || !window.L) return

    // אתחול המפה
    const map = window.L.map(mapRef.current).setView([31.5, 34.75], 8)

    // הוספת שכבת מפה
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // יצירת שכבת סמנים
    const markersLayer = window.L.layerGroup().addTo(map)

    // שמירת הרפרנסים
    leafletMapRef.current = map
    markersLayerRef.current = markersLayer
    setMapInitialized(true)
  }, [mapInitialized, mapRef.current, typeof window !== "undefined" && window.L])

  // עדכון הסמנים במפה
  useEffect(() => {
    if (!mapInitialized || !leafletMapRef.current || !markersLayerRef.current) return

    // ניקוי הסמנים הקיימים
    markersLayerRef.current.clearLayers()

    // הוספת הסמנים המסוננים
    filteredLocations.forEach((location) => {
      const color = getCategoryColor(location.category)

      // יצירת סמן מותאם אישית
      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      })

      // יצירת הסמן והוספתו למפה
      const marker = window.L.marker([location.latitude, location.longitude], { icon: customIcon }).bindPopup(`
          <div dir="rtl" style="text-align: right;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3>
            <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 5px;">${getCategoryName(location.category)}</p>
            ${location.address ? `<p style="font-size: 0.875rem; margin-top: 5px;">${location.address}</p>` : ""}
            ${location.description ? `<p style="font-size: 0.875rem; margin-top: 5px;">${location.description}</p>` : ""}
          </div>
        `)

      marker.addTo(markersLayerRef.current)
    })

    // אם יש תוצאות חיפוש, מרכז את המפה על התוצאה הראשונה
    if (filteredLocations.length > 0 && searchQuery) {
      leafletMapRef.current.setView(
        [filteredLocations[0].latitude, filteredLocations[0].longitude],
        leafletMapRef.current.getZoom(),
      )
    }
  }, [filteredLocations, mapInitialized, searchQuery])

  // פילטור מיקומים לפי קטגוריות וחיפוש
  useEffect(() => {
    let filtered = locations

    // פילטור לפי קטגוריות נבחרות
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((location) => selectedCategories.includes(location.category))
    }

    // פילטור לפי חיפוש
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(query) ||
          (location.address && location.address.toLowerCase().includes(query)) ||
          getCategoryName(location.category).toLowerCase().includes(query),
      )
    }

    setFilteredLocations(filtered)
  }, [locations, selectedCategories, searchQuery])

  // טיפול בשינוי קטגוריות
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // טיפול בחיפוש
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // החיפוש כבר מתבצע ב-useEffect
  }

  return (
    <>
      {/* טעינת Leaflet מ-CDN */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        onLoad={() => console.log("Leaflet script loaded")}
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <div className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4 mb-4">
            {MAP_CATEGORIES.map((category) => (
              <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={`category-${category.id}`} className="flex items-center gap-2 cursor-pointer">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  {category.name}
                </Label>
              </div>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="חפש לפי שם, כתובת או קטגוריה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 ml-2" />
              חפש
            </Button>
          </form>
        </div>

        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>טוען מיקומים...</p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
          )}
        </div>

        <div className="p-4 border-t">
          <p className="text-sm text-muted-foreground">
            מציג {filteredLocations.length} מיקומים מתוך {locations.length}
          </p>
        </div>
      </div>
    </>
  )
}
