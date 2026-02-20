import { Card, CardContent } from "@/components/ui/card";

const ImpactSection = () => {
  const impacts = [
    {
      emoji: "🌾",
      title: "+15% Yield Growth",
      description: "Average increase in crop productivity using our AI predictions"
    },
    {
      emoji: "⚡",
      title: "10–20% Less Fertilizer",
      description: "Reduction in fertilizer usage through optimized recommendations"
    },
    {
      emoji: "👩‍🌾",
      title: "120M+ Farmers",
      description: "Potential reach to smallholder farmers globally"
    }
  ];

  return (
    <section id="impact" className="py-24 bg-white relative overflow-hidden border-t border-black/[0.06]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-6">
            <span className="text-sm font-medium text-green-700">Impact Metrics</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-black mb-4 font-[family-name:var(--font-nohemi)]">
            Real Impact, Real Results
          </h2>
          <p className="text-lg text-black/60 max-w-3xl mx-auto leading-relaxed">
            Transforming agriculture through technology and making a meaningful difference in farmers&apos; lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {impacts.map((impact, index) => (
            <Card 
              key={index}
              className="bg-white border border-black/[0.06] rounded-2xl hover:border-green-200 transition-all duration-300 group"
            >
              <CardContent className="text-center p-10">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{impact.emoji}</div>
                <h3 className="text-2xl font-bold text-black mb-4 font-[family-name:var(--font-nohemi)]">
                  {impact.title}
                </h3>
                <p className="text-black/60 leading-relaxed">
                  {impact.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
