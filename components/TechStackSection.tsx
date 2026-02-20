import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TechStackSection = () => {
  const technologies = [
    { name: "Next.js", description: "React Framework" },
    { name: "Supabase", description: "Backend & Database" },
    { name: "Clerk", description: "Authentication" },
    { name: "AWS SageMaker", description: "ML Platform" },
    { name: "Gemini", description: "AI Language Model" },
    { name: "Firebase", description: "Real-time Data" },
    { name: "Vercel", description: "Deployment Platform" },
  ];

  return (
    <section id="tech-stack" className="py-24 bg-black/[0.02] border-t border-black/[0.06]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-6">
            <span className="text-sm font-medium text-green-700">Technology Stack</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-black mb-4 font-[family-name:var(--font-nohemi)]">
            Built with Modern Technology
          </h2>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            Scalable, modern, and production-ready tech stack powering AgroGen.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {technologies.map((tech, index) => (
            <Card
              key={index}
              className="border border-black/[0.06] hover:border-green-200 transition-all duration-300 rounded-xl bg-white"
            >
              <CardHeader className="text-center pb-4 pt-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors duration-300">
                  <span className="text-xl font-bold text-green-600 font-[family-name:var(--font-nohemi)]">
                    {tech.name.charAt(0)}
                  </span>
                </div>
                <CardTitle className="text-sm font-semibold text-black font-[family-name:var(--font-nohemi)]">{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-black/50 text-center">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
