import { NextResponse } from 'next/server';
/* eslint-disable @typescript-eslint/no-explicit-any */

interface WeatherRequest {
  location: string;
  state?: string;
  days?: number;
  includeAlerts?: boolean;
  cropType?: string;
}

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    weatherCode: number;
    weatherDescription: string;
    uvIndex: number;
    visibility: number;
    pressure: number;
  };
  forecast: {
    date: string;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    precipitation: number;
    precipitationProbability: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    uvIndex: number;
  }[];
  agricultural: {
    soilMoisture: string;
    growingConditions: string;
    irrigationAdvice: string;
    pestRisk: string;
    harvestSuitability: string;
    fieldWorkability: string;
  };
  alerts: {
    type: string;
    severity: string;
    message: string;
    validUntil: string;
  }[];
}

const locationCoordinates: { [key: string]: { lat: number; lon: number; name: string } } = {
  'andhra pradesh': { lat: 15.9129, lon: 79.7400, name: 'Andhra Pradesh' },
  'telangana': { lat: 18.1124, lon: 79.0193, name: 'Telangana' },
  'tamil nadu': { lat: 11.0168, lon: 76.9558, name: 'Tamil Nadu' },
  'karnataka': { lat: 12.9716, lon: 77.5946, name: 'Karnataka' },
  'kerala': { lat: 10.8505, lon: 76.2711, name: 'Kerala' },
  'maharashtra': { lat: 19.7515, lon: 75.7139, name: 'Maharashtra' },
  'gujarat': { lat: 22.2587, lon: 71.1924, name: 'Gujarat' },
  'rajasthan': { lat: 27.0238, lon: 74.2179, name: 'Rajasthan' },
  'madhya pradesh': { lat: 22.9734, lon: 78.6569, name: 'Madhya Pradesh' },
  'uttar pradesh': { lat: 26.8467, lon: 80.9462, name: 'Uttar Pradesh' },
  'bihar': { lat: 25.0961, lon: 85.3131, name: 'Bihar' },
  'west bengal': { lat: 22.9868, lon: 87.8550, name: 'West Bengal' },
  'odisha': { lat: 20.9517, lon: 85.0985, name: 'Odisha' },
  'chhattisgarh': { lat: 21.2787, lon: 81.8661, name: 'Chhattisgarh' },
  'jharkhand': { lat: 23.6102, lon: 85.2799, name: 'Jharkhand' },
  'punjab': { lat: 31.1471, lon: 75.3412, name: 'Punjab' },
  'haryana': { lat: 29.0588, lon: 76.0856, name: 'Haryana' },
  'himachal pradesh': { lat: 31.1048, lon: 77.1734, name: 'Himachal Pradesh' },
  'uttarakhand': { lat: 30.0668, lon: 79.0193, name: 'Uttarakhand' },
  'assam': { lat: 26.2006, lon: 92.9376, name: 'Assam' },
  
  'delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
  'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
  'bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Hyderabad' },
  'chennai': { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
  'kolkata': { lat: 22.5726, lon: 88.3639, name: 'Kolkata' },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad' },
  'pune': { lat: 18.5204, lon: 73.8567, name: 'Pune' },
  'jaipur': { lat: 26.9124, lon: 75.7873, name: 'Jaipur' },
  'lucknow': { lat: 26.8467, lon: 80.9462, name: 'Lucknow' },
  
  'default': { lat: 20.5937, lon: 78.9629, name: 'India (Central)' }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location')?.toLowerCase() || 'default';
  const days = parseInt(searchParams.get('days') || '7');
  const includeAlerts = searchParams.get('includeAlerts') === 'true';
  const cropType: any = searchParams.get('cropType');

  try {
    const coords = locationCoordinates[location] || locationCoordinates['default'];
    
    const weatherData = await fetchWeatherData(coords, days);
    const agriculturalData = generateAgriculturalInsights(weatherData, cropType);
    const alerts = includeAlerts ? generateWeatherAlerts(weatherData) : [];

    const response: WeatherData = {
      current: weatherData.current,
      forecast: weatherData.forecast,
      agricultural: agriculturalData,
      alerts
    };

    return NextResponse.json({
      success: true,
      location: coords.name,
      coordinates: { lat: coords.lat, lon: coords.lon },
      data: response,
      lastUpdated: new Date().toISOString(),
      source: 'Open-Meteo API'
    });

  } catch (error: any) {
    console.error('Weather API Error:', error);

    const fallbackData = getFallbackWeatherData(location);
    
    return NextResponse.json({
      success: false,
      error: 'Weather service temporarily unavailable',
      location: locationCoordinates[location]?.name || 'Unknown',
      data: fallbackData,
      source: 'fallback'
    });
  }
}

export async function POST(request: Request) {
  try {
    const body: WeatherRequest = await request.json();
    const { location, days = 7, includeAlerts = false, cropType } = body;

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    const coords = locationCoordinates[location.toLowerCase()] || locationCoordinates['default'];
    
    const weatherData = await fetchWeatherData(coords, days);
    const agriculturalData = generateAgriculturalInsights(weatherData, cropType);
    const alerts = includeAlerts ? generateWeatherAlerts(weatherData) : [];

    const response: WeatherData = {
      current: weatherData.current,
      forecast: weatherData.forecast,
      agricultural: agriculturalData,
      alerts
    };

    return NextResponse.json({
      success: true,
      location: coords.name,
      coordinates: { lat: coords.lat, lon: coords.lon },
      data: response,
      lastUpdated: new Date().toISOString(),
      requestedDays: days,
      cropType: cropType || 'general',
      source: 'Open-Meteo API'
    });

  } catch (error: any) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function fetchWeatherData(coords: { lat: number; lon: number }, days: number) {
  const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index,visibility,surface_pressure&timezone=Asia/Kolkata`;
  
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,relative_humidity_2m_max&timezone=Asia/Kolkata&forecast_days=${Math.min(days, 16)}`;

  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(currentWeatherUrl),
    fetch(forecastUrl)
  ]);

  if (!currentResponse.ok || !forecastResponse.ok) {
    throw new Error('Weather API request failed');
  }

  const [currentData, forecastData] = await Promise.all([
    currentResponse.json(),
    forecastResponse.json()
  ]);

  return {
    current: {
      temperature: Math.round(currentData.current.temperature_2m || 0),
      humidity: Math.round(currentData.current.relative_humidity_2m || 0),
      windSpeed: Math.round(currentData.current.wind_speed_10m || 0),
      windDirection: Math.round(currentData.current.wind_direction_10m || 0),
      precipitation: Math.round((currentData.current.precipitation || 0) * 10) / 10,
      weatherCode: currentData.current.weather_code || 0,
      weatherDescription: getWeatherDescription(currentData.current.weather_code || 0),
      uvIndex: Math.round(currentData.current.uv_index || 0),
      visibility: Math.round((currentData.current.visibility || 0) / 1000),
      pressure: Math.round(currentData.current.surface_pressure || 0)
    },
    forecast: forecastData.daily.time.map((date: string, index: number) => ({
      date,
      maxTemp: Math.round(forecastData.daily.temperature_2m_max[index] || 0),
      minTemp: Math.round(forecastData.daily.temperature_2m_min[index] || 0),
      humidity: Math.round(forecastData.daily.relative_humidity_2m_max[index] || 0),
      precipitation: Math.round((forecastData.daily.precipitation_sum[index] || 0) * 10) / 10,
      precipitationProbability: Math.round(forecastData.daily.precipitation_probability_max[index] || 0),
      windSpeed: Math.round(forecastData.daily.wind_speed_10m_max[index] || 0),
      weatherCode: forecastData.daily.weather_code[index] || 0,
      weatherDescription: getWeatherDescription(forecastData.daily.weather_code[index] || 0),
      uvIndex: Math.round(forecastData.daily.uv_index_max[index] || 0)
    }))
  };
}

function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return weatherCodes[code] || 'Unknown';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateAgriculturalInsights(weatherData: any, cropType?: string): any {
  const current = weatherData.current;
  const forecast = weatherData.forecast.slice(0, 7);
  
  const avgTemp = forecast.reduce((sum: number, day: any) => sum + (day.maxTemp + day.minTemp) / 2, 0) / forecast.length;
  const totalRain = forecast.reduce((sum: number, day: any) => sum + day.precipitation, 0);
  const avgHumidity = forecast.reduce((sum: number, day: any) => sum + day.humidity, 0) / forecast.length;
  
  let soilMoisture = 'Moderate';
  if (totalRain > 50) soilMoisture = 'High';
  else if (totalRain < 10) soilMoisture = 'Low';
  
  let growingConditions = 'Fair';
  if (avgTemp >= 20 && avgTemp <= 30 && totalRain >= 20 && totalRain <= 100) {
    growingConditions = 'Excellent';
  } else if ((avgTemp >= 15 && avgTemp <= 35) && totalRain >= 10) {
    growingConditions = 'Good';
  } else if (avgTemp < 10 || avgTemp > 40 || totalRain > 150) {
    growingConditions = 'Poor';
  }
  
  let irrigationAdvice = 'Monitor soil moisture';
  if (totalRain < 10) {
    irrigationAdvice = 'Increase irrigation frequency';
  } else if (totalRain > 100) {
    irrigationAdvice = 'Reduce irrigation, ensure drainage';
  } else if (totalRain >= 20 && totalRain <= 50) {
    irrigationAdvice = 'Maintain current irrigation schedule';
  }
  
  let pestRisk = 'Low';
  if (avgHumidity > 80 && avgTemp >= 25) {
    pestRisk = 'High';
  } else if (avgHumidity > 60 && avgTemp >= 20) {
    pestRisk = 'Moderate';
  }
  
  let harvestSuitability = 'Not suitable';
  const rainyDays = forecast.filter((day: any) => day.precipitation > 5).length;
  if (rainyDays <= 2 && avgHumidity < 70) {
    harvestSuitability = 'Excellent';
  } else if (rainyDays <= 3 && avgHumidity < 80) {
    harvestSuitability = 'Good';
  } else if (rainyDays <= 4) {
    harvestSuitability = 'Fair';
  }
  
  let fieldWorkability = 'Moderate';
  if (rainyDays <= 1 && current.windSpeed < 20) {
    fieldWorkability = 'Excellent';
  } else if (rainyDays <= 3 && current.windSpeed < 30) {
    fieldWorkability = 'Good';
  } else if (rainyDays > 5 || current.windSpeed > 40) {
    fieldWorkability = 'Poor';
  }
  
  return {
    soilMoisture,
    growingConditions,
    irrigationAdvice,
    pestRisk,
    harvestSuitability,
    fieldWorkability
  };
}

function generateWeatherAlerts(weatherData: any): any[] {
  const alerts: any[] = [];
  const current = weatherData.current;
  const forecast = weatherData.forecast.slice(0, 3);
  
  if (current.temperature > 40) {
    alerts.push({
      type: 'Heat Wave',
      severity: 'High',
      message: 'Extreme heat conditions. Provide shade for crops and increase irrigation.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } else if (current.temperature < 5) {
    alerts.push({
      type: 'Cold Wave',
      severity: 'High',
      message: 'Very low temperatures. Protect sensitive crops from frost damage.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  const heavyRainDays = forecast.filter((day: { precipitation: number; }) => day.precipitation > 50);
  if (heavyRainDays.length > 0) {
    alerts.push({
      type: 'Heavy Rainfall',
      severity: 'Medium',
      message: 'Heavy rainfall expected. Ensure proper drainage and postpone spraying operations.',
      validUntil: heavyRainDays[heavyRainDays.length - 1].date
    });
  }
  
  if (current.windSpeed > 50) {
    alerts.push({
      type: 'Strong Winds',
      severity: 'Medium',
      message: 'Strong winds may damage crops. Secure equipment and provide support to tall plants.',
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
    });
  }
  
  if (current.uvIndex > 8) {
    alerts.push({
      type: 'High UV Index',
      severity: 'Low',
      message: 'Very high UV levels. Consider protective measures for outdoor farm work.',
      validUntil: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return alerts;
}

function getFallbackWeatherData(location: string): WeatherData {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const coords = locationCoordinates[location.toLowerCase()] || locationCoordinates['default'];
  
  const currentDate = new Date();
  const month = currentDate.getMonth();
  
  let baseTemp = 25;
  if (month >= 3 && month <= 5) baseTemp = 32; 
  else if (month >= 6 && month <= 9) baseTemp = 28; 
  else if (month >= 10 && month <= 2) baseTemp = 22; 
  
  return {
    current: {
      temperature: baseTemp + Math.floor(Math.random() * 6) - 3,
      humidity: 60 + Math.floor(Math.random() * 20),
      windSpeed: 10 + Math.floor(Math.random() * 15),
      windDirection: Math.floor(Math.random() * 360),
      precipitation: Math.random() < 0.3 ? Math.random() * 5 : 0,
      weatherCode: Math.random() < 0.7 ? (Math.random() < 0.5 ? 1 : 2) : 61,
      weatherDescription: Math.random() < 0.7 ? (Math.random() < 0.5 ? 'Mainly clear' : 'Partly cloudy') : 'Light rain',
      uvIndex: Math.floor(Math.random() * 10),
      visibility: 8 + Math.floor(Math.random() * 12),
      pressure: 1010 + Math.floor(Math.random() * 20)
    },
    forecast: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        maxTemp: baseTemp + Math.floor(Math.random() * 8) - 2,
        minTemp: baseTemp - 8 + Math.floor(Math.random() * 6),
        humidity: 55 + Math.floor(Math.random() * 25),
        precipitation: Math.random() < 0.4 ? Math.random() * 15 : 0,
        precipitationProbability: Math.floor(Math.random() * 60),
        windSpeed: 8 + Math.floor(Math.random() * 20),
        weatherCode: Math.random() < 0.6 ? 1 : (Math.random() < 0.7 ? 2 : 61),
        weatherDescription: Math.random() < 0.6 ? 'Mainly clear' : (Math.random() < 0.7 ? 'Partly cloudy' : 'Light rain'),
        uvIndex: Math.floor(Math.random() * 10)
      };
    }),
    agricultural: {
      soilMoisture: 'Moderate',
      growingConditions: 'Fair',
      irrigationAdvice: 'Monitor soil conditions',
      pestRisk: 'Low',
      harvestSuitability: 'Fair',
      fieldWorkability: 'Moderate'
    },
    alerts: []
  };
}