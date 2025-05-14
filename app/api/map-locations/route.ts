import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import type { LocationItem } from "@/lib/map-utils"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const locations: LocationItem[] = []

    // שליפת האקתונים
    const { data: hackathons, error: hackathonsError } = await supabase
      .from("hackathons")
      .select("id, name, location, latitude, longitude, description")
      .not("latitude", "is", null)

    if (hackathonsError) throw hackathonsError

    hackathons?.forEach((hackathon) => {
      locations.push({
        id: hackathon.id,
        name: hackathon.name,
        category: "hackathons",
        latitude: hackathon.latitude,
        longitude: hackathon.longitude,
        address: hackathon.location,
        description: hackathon.description,
      })
    })

    // שליפת מנטורים
    const { data: mentors, error: mentorsError } = await supabase
      .from("mentors")
      .select("id, name, location, latitude, longitude, occupation, organization")
      .not("latitude", "is", null)

    if (mentorsError) throw mentorsError

    mentors?.forEach((mentor) => {
      locations.push({
        id: mentor.id,
        name: mentor.name,
        category: "mentors",
        latitude: mentor.latitude,
        longitude: mentor.longitude,
        address: mentor.location,
        description: mentor.occupation
          ? `${mentor.occupation}${mentor.organization ? ` ב${mentor.organization}` : ""}`
          : undefined,
      })
    })

    // שליפת משתתפים
    const { data: participants, error: participantsError } = await supabase
      .from("participants")
      .select("id, name, location, latitude, longitude, participant_type, organization")
      .not("latitude", "is", null)

    if (participantsError) throw participantsError

    participants?.forEach((participant) => {
      locations.push({
        id: participant.id,
        name: participant.name,
        category: "participants",
        latitude: participant.latitude,
        longitude: participant.longitude,
        address: participant.location,
        description: participant.participant_type
          ? `${participant.participant_type}${participant.organization ? ` מ${participant.organization}` : ""}`
          : undefined,
      })
    })

    // שליפת ספקי מזון
    const { data: foodSuppliers, error: foodSuppliersError } = await supabase
      .from("food_suppliers")
      .select("id, name, address, latitude, longitude, contact_person")
      .not("latitude", "is", null)

    if (foodSuppliersError) throw foodSuppliersError

    foodSuppliers?.forEach((supplier) => {
      locations.push({
        id: supplier.id,
        name: supplier.name,
        category: "food_suppliers",
        latitude: supplier.latitude,
        longitude: supplier.longitude,
        address: supplier.address,
        description: supplier.contact_person ? `איש קשר: ${supplier.contact_person}` : undefined,
      })
    })

    // שליפת ספקי חולצות
    const { data: shirtSuppliers, error: shirtSuppliersError } = await supabase
      .from("shirt_suppliers")
      .select("id, name, location, address, latitude, longitude, contact_person")
      .not("latitude", "is", null)

    if (shirtSuppliersError) throw shirtSuppliersError

    shirtSuppliers?.forEach((supplier) => {
      locations.push({
        id: supplier.id,
        name: supplier.name,
        category: "shirt_suppliers",
        latitude: supplier.latitude,
        longitude: supplier.longitude,
        address: supplier.location || supplier.address,
        description: supplier.contact_person ? `איש קשר: ${supplier.contact_person}` : undefined,
      })
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching map locations:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}
