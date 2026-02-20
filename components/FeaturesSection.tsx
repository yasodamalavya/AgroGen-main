import { BarChart3, CloudRain, MessageSquare } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: "AI Predictions",
      description: "Advanced yield forecasting using Machine Learning with Random Forest Regression models.",
    },
    {
      icon: CloudRain,
      title: "Live Data",
      description: "Real-time weather, soil conditions, and market insights through integrated APIs.",
    },
    {
      icon: MessageSquare,
      title: "Multilingual Support",
      description: "AI chatbot with text and voice support in local languages for global accessibility.",
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden border-t border-black/[0.06]">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-6">
            <span className="text-sm font-medium text-green-700">Core Capabilities</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-black mb-4 font-[family-name:var(--font-nohemi)]">
            AI-Powered Intelligence
          </h2>
          <p className="text-[clamp(1.5rem,4vw,3rem)] font-[family-name:var(--font-instrument-serif)] text-green-600 mb-6">
            for Modern Farming
          </p>
          <p className="text-lg text-black/60 max-w-2xl mx-auto leading-relaxed">
            Transforming agriculture through AI-driven insights and real-time data. 
            Simply input your crop, location, and let our AI handle the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-8 bg-white border border-black/[0.06] rounded-2xl hover:border-green-200 transition-all duration-300"
            >
              <div className="mb-6">
                <div className="inline-flex p-3 rounded-xl bg-green-50">
                  <feature.icon className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-3 font-[family-name:var(--font-nohemi)]">
                {feature.title}
              </h3>
              <p className="text-black/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
