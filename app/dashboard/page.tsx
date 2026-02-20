'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Loader2, CloudRain, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const useReverseGeocode = () => {
  const [location, setLocation] = useState({ state: "", detailedRegion: "", lat: 0, lon: 0 })
  const [error, setError] = useState<string | null>(null)

  const getLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=10`
      )
      if (!res.ok) throw new Error("Failed to fetch location data")
      const data = await res.json()
      const state = data.address.state || data.address.province || data.address.region || "Unknown"
      const detailedRegion = `${data.address.city || ""}, ${data.address.county || ""}, ${
        data.address.state_district || ""
      }, ${data.address.state || ""}, ${data.address.country || ""}`
        .replace(/, ,/g, ",")
        .replace(/,$/, "")
      setLocation({ state, detailedRegion, lat, lon })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    }
  }

  return { location, error, getLocation }
}

const DashboardPage = () => {
  const initialFormData = {
    crop: "",
    season: "",
    state: "",
    annualRainfall: "",
    area: "",
    fertilizer: "",
    pesticide: "",
    cropYear: "",
    soilType: "",
  }

  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isRainfallLoading, setIsRainfallLoading] = useState(false)
  const { location, getLocation } = useReverseGeocode()
  const router = useRouter()

  const uniqueCrops = ['Cereals', 'Maize', 'Moong', 'Nutri/Coarse Cereals', 'Rice', 'Total Food Grains', 'Total Pulses', 'Tur', 'Urad', 'Arecanut', 'Arhar/Tur']
  const uniqueSeasons = ['Kharif', 'Total', 'Rabi', 'Whole Year']
  const soilTypes = ['Sandy', 'Clay', 'Silt', 'Loam', 'Chalk', 'Peat']

  useEffect(() => {
    if (location.detailedRegion) {
      setFormData((prev) => ({ ...prev, state: location.detailedRegion }))
    }
  }, [location.detailedRegion])

  const fetchRainfall = async () => {
    if (!location.lat || !location.lon) return
    setIsRainfallLoading(true)
    try {
      const res = await fetch(
        `http://api.weatherapi.com/v1/history.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location.lat},${location.lon}&dt=2024-01-01&end_dt=2024-12-31`
      )
      const data = await res.json()
      const totalRainfall = data.forecast.forecastday.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: number, day: any) => sum + (day.day.totalprecip_mm || 0),
        0
      )
      setFormData((prev) => ({ ...prev, annualRainfall: Math.round(totalRainfall).toString() }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setFormData((prev) => ({ ...prev, annualRainfall: "1000" }))
    } finally {
      setIsRainfallLoading(false)
    }
  }

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchRainfall()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lon])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: any) => (e: any) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { soilType, ...apiData } = formData
      const response = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const { chatId } = await response.json()
      setFormData(initialFormData)
      router.push(`/dashboard/chat/${chatId}`)
    } catch (error) {
      console.error("Error creating chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Crop Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enter your crop details for intelligent yield prediction and comprehensive agricultural insights
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Basic Crop Information</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="crop" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Crop Type
                    </Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, crop: value }))}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                        <SelectValue placeholder="Select your crop type" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-100 rounded-xl shadow-lg">
                        {uniqueCrops.map((crop) => (
                          <SelectItem 
                            key={crop} 
                            value={crop}
                            className="hover:bg-green-50 focus:bg-green-50 rounded-lg mx-1 my-0.5"
                          >
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="season" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Growing Season
                    </Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, season: value }))}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                        <SelectValue placeholder="Select growing season" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-100 rounded-xl shadow-lg">
                        {uniqueSeasons.map((season) => (
                          <SelectItem 
                            key={season} 
                            value={season}
                            className="hover:bg-green-50 focus:bg-green-50 rounded-lg mx-1 my-0.5"
                          >
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Location & Environment</h3>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    State/Region
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={handleChange("state")}
                      className="flex-1 h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                      placeholder="Enter your state or region"
                    />
                    <Button
                      type="button"
                      onClick={getLocation}
                      className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Auto-detect
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="soilType" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Soil Type
                    </Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, soilType: value }))}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                        <SelectValue placeholder="Select soil type" className="text-gray-500" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-100 rounded-xl shadow-lg">
                        {soilTypes.map((soil) => (
                          <SelectItem 
                            key={soil} 
                            value={soil}
                            className="hover:bg-blue-50 focus:bg-blue-50 rounded-lg mx-1 my-0.5"
                          >
                            {soil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="annualRainfall" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Annual Rainfall (mm)
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="annualRainfall"
                        type="number"
                        value={formData.annualRainfall}
                        onChange={handleChange("annualRainfall")}
                        className="flex-1 h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                        placeholder="e.g., 1200"
                        disabled={isRainfallLoading}
                      />
                      <Button
                        type="button"
                        onClick={fetchRainfall}
                        disabled={!formData.state || isRainfallLoading}
                        className="h-12 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRainfallLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CloudRain className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="area" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Farm Area (hectares)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={handleChange("area")}
                      className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                      placeholder="e.g., 5.5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-sm">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Agricultural Inputs</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fertilizer" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      Fertilizer Usage (kg/hectare)
                    </Label>
                    <Input
                      id="fertilizer"
                      type="number"
                      value={formData.fertilizer}
                      onChange={handleChange("fertilizer")}
                      className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-300 hover:border-gray-300"
                      placeholder="e.g., 120"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="pesticide" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      Pesticide Usage (kg/hectare)
                    </Label>
                    <Input
                      id="pesticide"
                      type="number"
                      value={formData.pesticide}
                      onChange={handleChange("pesticide")}
                      className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-300 hover:border-gray-300"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Timeline</h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="cropYear" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Crop Year
                  </Label>
                  <Input
                    id="cropYear"
                    type="number"
                    value={formData.cropYear}
                    onChange={handleChange("cropYear")}
                    className="h-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 hover:border-gray-300 max-w-md"
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-green-600 via-green-600 to-green-700 hover:from-green-700 hover:via-green-700 hover:to-green-800 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg tracking-wide"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Processing Analysis...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Crop Analysis
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
