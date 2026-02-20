"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/services/SupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  SunIcon,
  Thermometer,
  Droplets,
  MapPin,
  Sprout,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Calendar,
  BarChart3,
  Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  crop: string;
  season: string;
  state: string;
  annualRainfall: string;
  area: string;
  fertilizer: string;
  pesticide: string;
  cropYear: string;
}

interface Prediction {
  model: string;
  predicted_yield: string;
  total_expected_production: string;
  assessment: string;
}

interface UserData {
  formData: FormData;
  prediction: Prediction;
  createdAt: string;
}

interface WeatherData {
  temperature_2m: number;
  precipitation: number;
  windspeed: number;
  weathercode: number;
}

// Language translations object
const translations = {
  en: {
    recentCropAnalyses: "Recent Crop Analyses",
    selectedAnalysisDetails: "Selected Analysis Details",
    cropAnalysisDashboard: "Crop Analysis Dashboard",
    weatherConditions: "Weather Conditions",
    farmingInputs: "Farming Inputs",
    yieldPredictionResults: "Yield Prediction Results",
    currentMarketPrice: "Current Market Price",
    yield: "Yield",
    season: "Season",
    area: "Area",
    rainfall: "mm Rainfall",
    fertilizer: "kg/ha Fertilizer",
    pesticide: "kg/ha Pesticide",
    aiModel: "AI Model",
    predictedYield: "Predicted Yield",
    totalProduction: "Total Production",
    perQuintal: "per quintal in",
    temperature: "Temperature",
    precipitation: "Precipitation",
    currentConditions: "Current conditions",
    fetchingPrices: "Fetching latest prices...",
    loadingWeather: "Loading weather data...",
    weatherUnavailable: "Weather data temporarily unavailable",
    joined: "Joined",
    analyses: "Analyses"
  },
  hi: {
    recentCropAnalyses: "हाल की फसल विश्लेषण",
    selectedAnalysisDetails: "चयनित विश्लेषण विवरण",
    cropAnalysisDashboard: "फसल विश्लेषण डैशबोर्ड",
    weatherConditions: "मौसम की स्थिति",
    farmingInputs: "कृषि इनपुट",
    yieldPredictionResults: "उत्पादन पूर्वानुमान परिणाम",
    currentMarketPrice: "वर्तमान बाज़ार मूल्य",
    yield: "उत्पादन",
    season: "मौसम",
    area: "क्षेत्र",
    rainfall: "मिमी वर्षा",
    fertilizer: "किग्रा/हेक्टेयर उर्वरक",
    pesticide: "किग्रा/हेक्टेयर कीटनाशक",
    aiModel: "AI मॉडल",
    predictedYield: "अनुमानित उत्पादन",
    totalProduction: "कुल उत्पादन",
    perQuintal: "प्रति क्विंटल में",
    temperature: "तापमान",
    precipitation: "वर्षा",
    currentConditions: "वर्तमान स्थितियां",
    fetchingPrices: "नवीनतम मूल्य प्राप्त कर रहे हैं...",
    loadingWeather: "मौसम डेटा लोड हो रहा है...",
    weatherUnavailable: "मौसम डेटा अस्थायी रूप से उपलब्ध नहीं है",
    joined: "शामिल हुए",
    analyses: "विश्लेषण"
  },
  te: {
    recentCropAnalyses: "ఇటీవలి పంట విశ్లేషణలు",
    selectedAnalysisDetails: "ఎంచుకున్న విశ్లేషణ వివరాలు",
    cropAnalysisDashboard: "పంట విశ్లేషణ డాష్‌బోర్డ్",
    weatherConditions: "వాతావరణ పరిస్థితులు",
    farmingInputs: "వ్యవసాయ ఇన్‌పుట్‌లు",
    yieldPredictionResults: "దిగుబడి అంచనా ఫలితాలు",
    currentMarketPrice: "ప్రస్తుత మార్కెట్ ధర",
    yield: "దిగుబడి",
    season: "కాలం",
    area: "వైశాల్యం",
    rainfall: "మిమీ వర్షపాతం",
    fertilizer: "కిగ్రా/హెక్టేర్ ఎరువులు",
    pesticide: "కిగ్రా/హెక్టేర్ పురుగుమందులు",
    aiModel: "AI మోడల్",
    predictedYield: "అంచనా దిగుబడి",
    totalProduction: "మొత్తం ఉత్పాదన",
    perQuintal: "క్వింటాల్‌కు",
    temperature: "ఉష్ణోగ్రత",
    precipitation: "వర్షపాతం",
    currentConditions: "ప్రస్తుత పరిస్థితులు",
    fetchingPrices: "తాజా ధరలను పొందుతోంది...",
    loadingWeather: "వాతావరణ డేటా లోడ్ అవుతోంది...",
    weatherUnavailable: "వాతావరణ డేటా తాత్కాలికంగా అందుబాటులో లేదు",
    joined: "చేరారు",
    analyses: "విశ్లేషణలు"
  },
  or: {
    recentCropAnalyses: "ସାମ୍ପ୍ରତିକ ଫସଲ ବିଶ୍ଳେଷଣ",
    selectedAnalysisDetails: "ମନୋନୀତ ବିଶ୍ଳେଷଣ ବିବରଣୀ",
    cropAnalysisDashboard: "ଫସଲ ବିଶ୍ଳେଷଣ ଡାସବୋର୍ଡ",
    weatherConditions: "ପାଣିପାଗ ଅବସ୍ଥା",
    farmingInputs: "କୃଷି ଇନପୁଟ୍",
    yieldPredictionResults: "ଅମଳ ପୂର୍ବାନୁମାନ ଫଳାଫଳ",
    currentMarketPrice: "ବର୍ତ୍ତମାନର ବଜାର ମୂଲ୍ୟ",
    yield: "ଅମଳ",
    season: "ଋତୁ",
    area: "କ୍ଷେତ୍ର",
    rainfall: "ମିମି ବର୍ଷା",
    fertilizer: "କିଗ୍ରା/ହେକ୍ଟର ସାର",
    pesticide: "କିଗ୍ରା/ହେକ୍ଟର କୀଟନାଶକ",
    aiModel: "AI ମଡେଲ",
    predictedYield: "ପୂର୍ବାନୁମାନିତ ଅମଳ",
    totalProduction: "ମୋଟ ଉତ୍ପାଦନ",
    perQuintal: "କ୍ୱିଣ୍ଟାଲ ପ୍ରତି",
    temperature: "ତାପମାତ୍ରା",
    precipitation: "ବର୍ଷା",
    currentConditions: "ବର୍ତ୍ତମାନର ଅବସ୍ଥା",
    fetchingPrices: "ନୂତନ ମୂଲ୍ୟ ଆଣୁଛି...",
    loadingWeather: "ପାଣିପାଗ ଡାଟା ଲୋଡ୍ ହେଉଛି...",
    weatherUnavailable: "ପାଣିପାଗ ଡାଟା ଅସ୍ଥାୟୀ ଭାବେ ଉପଲବ୍ଧ ନାହିଁ",
    joined: "ଯୋଗ ଦେଲେ",
    analyses: "ବିଶ୍ଳେଷଣ"
  }
};

const ProfilePage = () => {
  const { user } = useUser();
  const [userAnalyses, setUserAnalyses] = useState<UserData[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<UserData | null>(null);
  const [cropPrices, setCropPrices] = useState<{ [key: string]: string }>({});
  const [weathers, setWeathers] = useState<{ [key: string]: WeatherData }>({});
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'te' | 'or'>('en');
  const t = translations[currentLanguage];

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selectedAnalysis) {
      const state = selectedAnalysis.formData.state;
      const crop = selectedAnalysis.formData.crop;
      const priceKey = `${state}_${crop}`;

      if (!cropPrices[priceKey]) {
        setPriceLoading(true);
        fetchCropPrice(crop, state)
          .then((price) => {
            setCropPrices((prev) => ({ ...prev, [priceKey]: price }));
          })
          .finally(() => setPriceLoading(false));
      }

      if (!weathers[state]) {
        setWeatherLoading(true);
        fetchWeather(state)
          .then((w) => {
            setWeathers((prev) => ({ ...prev, [state]: w }));
          })
          .finally(() => setWeatherLoading(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnalysis]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("Data")
        .select("FormDataAndResponse, created_at")
        .eq("userEmail", user?.primaryEmailAddress?.emailAddress)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error("Database connection failed");
      }

      if (!data || data.length === 0) {
        setError(
          "No farming data found. Please complete a crop analysis first."
        );
        setLoading(false);
        return;
      }

      const parsedAnalyses = data.map((d) => {
        const parsedData =
          typeof d.FormDataAndResponse === "string"
            ? JSON.parse(d.FormDataAndResponse)
            : d.FormDataAndResponse;
        return { ...parsedData, createdAt: d.created_at };
      });

      setUserAnalyses(parsedAnalyses);
      setSelectedAnalysis(parsedAnalyses[0]);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load profile data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCropPrice = async (crop: string, state: string) => {
    try {
      const response = await fetch("/api/crop-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crop, state }),
      });

      if (!response.ok) {
        throw new Error("Price API unavailable");
      }

      const data = await response.json();
      return data.price || "Price not available";
    } catch (error) {
      console.error("Error fetching crop price:", error);
      return "Price unavailable";
    }
  };

  const fetchWeather = async (location: string) => {
    try {
      const response = await fetch(
        `/api/weather?location=${encodeURIComponent(location)}`
      );

      if (!response.ok) {
        throw new Error("Weather service unavailable");
      }

      const data = await response.json();
      return (
        data.current_weather || {
          temperature_2m: 25,
          precipitation: 0,
          windspeed: 10,
          weathercode: 0,
        }
      );
    } catch (err) {
      console.error("Error fetching weather:", err);
      return {
        temperature_2m: 25,
        precipitation: 0,
        windspeed: 10,
        weathercode: 0,
      };
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchUserData();
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
    };
    return weatherCodes[code] || "Unknown";
  };

  const LanguageSwitcher = () => (
    <div className="flex items-center space-x-2 ml-4">
      <Globe className="w-5 h-5 text-gray-600" />
      <div className="flex space-x-1 bg-white/80 rounded-lg p-1 shadow-sm">
        {[
          { code: 'en', label: 'EN' },
          { code: 'hi', label: 'हि' },
          { code: 'te', label: 'తె' },
          { code: 'or', label: 'ଓଡ଼' }
        ].map(({ code, label }) => (
          <Button
            key={code}
            onClick={() => setCurrentLanguage(code as 'en' | 'hi' | 'te' | 'or')}
            variant={currentLanguage === code ? "default" : "ghost"}
            size="sm"
            className={`px-3 py-1 text-xs font-medium transition-all duration-200 ${
              currentLanguage === code
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-36 w-full rounded-2xl shadow-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[28rem] rounded-2xl shadow-lg" />
            <Skeleton className="h-[28rem] rounded-2xl shadow-lg" />
          </div>
          <Skeleton className="h-56 rounded-2xl shadow-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6 md:p-8">
        <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border-none bg-white/80 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Oops! Something went wrong
            </h2>
            <Alert className="mb-6 border-red-200 bg-red-50/80 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium text-lg">
                {error}
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <Button
                onClick={handleRetry}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500">
                  Attempt {retryCount + 1} - If the problem persists, please
                  contact support
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="border-none shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <CardHeader className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="w-24 h-24 bg-white text-emerald-600 text-4xl font-bold">
                  {user?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="text-4xl font-bold tracking-tight">
                  {user?.fullName || "Farmer"}
                </CardTitle>
                <p className="text-teal-100 text-lg mt-1">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 py-1 px-3 text-sm font-medium rounded-full transition-colors duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {t.joined}{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 py-1 px-3 text-sm font-medium rounded-full transition-colors duration-200"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {userAnalyses.length} {t.analyses}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t.recentCropAnalyses}</h2>
            <LanguageSwitcher />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAnalyses.map((analysis, index) => (
              <Card 
                key={index} 
                className="border-none shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-2xl py-4">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Sprout className="w-6 h-6 mr-2" />
                    {analysis.formData.crop}
                  </CardTitle>
                  <p className="text-sm text-cyan-100">
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t.yield}</span>
                    <span className="font-bold text-emerald-600">
                      {analysis.prediction.predicted_yield}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t.season}</span>
                    <span className="font-medium">{analysis.formData.season}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t.area}</span>
                    <span className="font-medium">{analysis.formData.area} ha</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {analysis.prediction.assessment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedAnalysis && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t.selectedAnalysisDetails}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-2xl font-semibold">
                    <Sprout className="w-7 h-7 mr-3" />
                    {t.cropAnalysisDashboard}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Crop Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4 p-5 bg-emerald-50/80 rounded-xl border border-emerald-100 transition-all duration-200 hover:bg-emerald-100">
                      <div className="p-3 bg-emerald-500 rounded-lg">
                        <Sprout className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {selectedAnalysis.formData.crop}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedAnalysis.formData.season} •{" "}
                          {selectedAnalysis.formData.cropYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-5 bg-cyan-50/80 rounded-xl border border-cyan-100 transition-all duration-200 hover:bg-cyan-100">
                      <div className="p-3 bg-cyan-500 rounded-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {selectedAnalysis.formData.state}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedAnalysis.formData.area} hectares
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inputs Summary */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                      <Thermometer className="w-6 h-6 mr-2 text-amber-600" />
                      {t.farmingInputs}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold text-cyan-600">
                          {selectedAnalysis.formData.annualRainfall}
                        </p>
                        <p className="text-sm text-gray-600">{t.rainfall}</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-emerald-600">
                          {selectedAnalysis.formData.fertilizer}
                        </p>
                        <p className="text-sm text-gray-600">{t.fertilizer}</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-purple-600">
                          {selectedAnalysis.formData.pesticide}
                        </p>
                        <p className="text-sm text-gray-600">{t.pesticide}</p>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Results */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center text-xl">
                      <TrendingUp className="w-7 h-7 mr-2 text-emerald-600" />
                      {t.yieldPredictionResults}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                        <p className="text-sm text-gray-500 mb-1">{t.aiModel}</p>
                        <p className="font-bold text-sm text-gray-900">
                          {selectedAnalysis.prediction.model}
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                        <p className="text-sm text-gray-500 mb-1">
                          {t.predictedYield}
                        </p>
                        <p className="font-bold text-sm text-emerald-600">
                          {selectedAnalysis.prediction.predicted_yield}
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                        <p className="text-sm text-gray-500 mb-1">
                          {t.totalProduction}
                        </p>
                        <p className="font-bold text-sm text-cyan-600">
                          {selectedAnalysis.prediction.total_expected_production}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 bg-emerald-100/80 rounded-lg">
                      <p className="font-semibold text-emerald-800 text-center text-lg">
                        {selectedAnalysis.prediction.assessment}
                      </p>
                    </div>
                  </div>

                  {/* Market Price */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                      <TrendingUp className="w-6 h-6 mr-2 text-amber-600" />
                      {t.currentMarketPrice}
                    </h4>
                    {priceLoading ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                        <p className="text-amber-700 text-lg">
                          {t.fetchingPrices}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl font-bold text-amber-800">
                          ₹{cropPrices[`${selectedAnalysis.formData.state}_${selectedAnalysis.formData.crop}`] || "N/A"}
                        </p>
                        <p className="text-sm text-amber-700">
                          {t.perQuintal} {selectedAnalysis.formData.state}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Weather Card */}
              <Card className="border-none shadow-2xl rounded-2xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
                <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white rounded-t-2xl py-6">
                  <CardTitle className="flex items-center text-2xl font-semibold">
                    <SunIcon className="w-7 h-7 mr-3" />
                    {t.weatherConditions}
                  </CardTitle>
                  <p className="text-cyan-100 text-lg">
                    {selectedAnalysis.formData.state || "Your Location"}
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {weatherLoading ? (
                    <div className="text-center py-10">
                      <RefreshCw className="w-10 h-10 text-cyan-600 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600 text-lg">{t.loadingWeather}</p>
                    </div>
                  ) : weathers[selectedAnalysis.formData.state] ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-6 rounded-xl text-center transition-all duration-200 hover:shadow-md">
                          <SunIcon className="w-14 h-14 text-cyan-600 mx-auto mb-3" />
                          <p className="text-4xl font-bold text-cyan-800">
                            {weathers[selectedAnalysis.formData.state].temperature_2m}°C
                          </p>
                          <p className="text-sm text-cyan-600 font-medium">
                            {t.temperature}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-xl text-center transition-all duration-200 hover:shadow-md">
                          <Droplets className="w-14 h-14 text-teal-600 mx-auto mb-3" />
                          <p className="text-4xl font-bold text-teal-800">
                            {weathers[selectedAnalysis.formData.state].precipitation}mm
                          </p>
                          <p className="text-sm text-teal-600 font-medium">
                            {t.precipitation}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50/80 p-5 rounded-xl text-center">
                        <p className="text-xl font-semibold text-gray-800">
                          {getWeatherDescription(weathers[selectedAnalysis.formData.state].weathercode)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t.currentConditions}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <AlertCircle className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        {t.weatherUnavailable}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
