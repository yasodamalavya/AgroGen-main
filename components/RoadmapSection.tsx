import { CheckCircle, Rocket, Store, Sparkles } from "lucide-react";

const RoadmapSection = () => {
  const milestones = [
    {
      icon: CheckCircle,
      title: "AI-Powered Dashboard & Predictions",
      description: "Core platform with machine learning yield forecasting, real-time weather data, and crop recommendations",
      details: ["ML-based predictions", "Weather integration", "Market insights"],
      status: "completed",
      label: "Completed",
      quarter: "Q4 2024"
    },
    {
      icon: Rocket,
      title: "Multilingual Support & Expansion",
      description: "Regional language support with voice and text capabilities for global accessibility",
      details: ["50+ languages", "Voice support", "Local dialects"],
      status: "inProgress",
      label: "In Progress",
      quarter: "Q1 2025"
    },
    {
      icon: Store,
      title: "Direct Marketplace Platform",
      description: "Revolutionary peer-to-peer marketplace enabling farmers to sell crops directly to consumers without mediators",
      details: ["No middlemen", "Fair pricing", "Direct transactions", "Blockchain verified"],
      status: "planned",
      label: "Coming Soon",
      quarter: "Q3 2025"
    }
  ];

  return (
    <section id="roadmap" className="py-32 bg-gradient-to-b from-white to-black/[0.02] border-t border-black/[0.06] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[150px] opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Development Timeline</span>
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-black mb-6 font-[family-name:var(--font-nohemi)]">
            Our Journey Forward
          </h2>
          <p className="text-xl text-black/60 max-w-3xl mx-auto leading-relaxed">
            Continuous innovation and feature development to revolutionize agriculture and empower farmers worldwide.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-600 via-green-400 to-black/[0.1]"></div>
            
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="relative mb-16 last:mb-0 group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s backwards`
                }}
              >
                <div className="flex items-start gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 transition-all duration-500 group-hover:scale-110 ${
                      milestone.status === 'completed' 
                        ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30' 
                        : milestone.status === 'inProgress'
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-400 shadow-lg shadow-green-400/20'
                        : 'bg-white border-black/10 shadow-md'
                    }`}>
                      <milestone.icon className={`w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 ${
                        milestone.status === 'completed'
                          ? 'text-white'
                          : milestone.status === 'inProgress'
                          ? 'text-green-600'
                          : 'text-black/40'
                      }`} />
                      
                      {milestone.status === 'inProgress' && (
                        <div className="absolute inset-0 rounded-2xl bg-green-400 animate-ping opacity-20"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 pb-8">
                    <div className={`p-8 rounded-2xl border-2 transition-all duration-500 ${
                      milestone.status === 'completed'
                        ? 'bg-white border-green-100 shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-200/50'
                        : milestone.status === 'inProgress'
                        ? 'bg-gradient-to-br from-green-50/50 to-white border-green-200 shadow-lg shadow-green-100/30 hover:shadow-xl hover:shadow-green-200/40'
                        : 'bg-white border-black/[0.08] shadow-md hover:shadow-xl hover:border-black/[0.12]'
                    }`}>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-[family-name:var(--font-nohemi)] tracking-wide ${
                          milestone.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : milestone.status === 'inProgress'
                            ? 'bg-green-600 text-white'
                            : 'bg-black/[0.06] text-black/50'
                        }`}>
                          {milestone.label}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] text-black/60">
                          {milestone.quarter}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 font-[family-name:var(--font-nohemi)] group-hover:text-green-600 transition-colors duration-300">
                        {milestone.title}
                      </h3>

                      <p className="text-lg text-black/70 leading-relaxed mb-4">
                        {milestone.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {milestone.details.map((detail, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.03] rounded-lg text-sm text-black/60 border border-black/[0.06]"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
