'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-white flex items-center mt-20">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-black rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-black rounded-full blur-[120px]"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 border border-green-200 rounded-full">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">AI-Driven Agriculture Platform</span>
            </div>
          </div>

          <h1 className="text-center mb-8 animate-fade-in-up">
            <div className="text-3xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-4">
              <span className="block text-black font-[family-name:var(--font-nohemi)]">
                Crop Yield Optimization
              </span>
            </div>
            <div className="text-[clamp(2rem,6vw,5rem)] font-[family-name:var(--font-instrument-serif)] text-green-600 leading-[1.1]">
              Reimagined
            </div>
          </h1>

          <p className="text-center text-[clamp(1rem,2vw,1.375rem)] text-black/60 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
            An AI-driven crop yield optimization platform for farmers who break tradition. 
            Empowering <span className="text-black font-semibold">120M+ smallholders</span> with 
            intelligent yield predictions and market insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Link href="/dashboard">
              <Button 
                size="lg"
                className="group cursor-pointer bg-green-600 text-white hover:bg-green-700 font-semibold text-base px-8 py-6 rounded-full transition-all duration-300"
              >
                Start Optimizing
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent md:flex items-center justify-center hidden cursor-pointer border-2 border-black/10 text-black hover:bg-black/[0.02] hover:border-black/20 font-medium text-base px-8 py-6 rounded-full transition-all duration-300"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
            {[
              { label: 'AI Predictions', value: '99.2%', sub: 'Accuracy' },
              { label: 'Real-time Data', value: '24/7', sub: 'Monitoring' },
              { label: 'Languages', value: '50+', sub: 'Supported' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="group relative p-6 bg-black/[0.02] border border-black/[0.06] rounded-2xl hover:bg-black/[0.04] hover:border-black/10 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-black font-[family-name:var(--font-nohemi)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-black/40 font-medium mb-0.5">{stat.sub}</div>
                  <div className="text-xs text-black/60 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-black/10 rounded-full p-1">
          <div className="w-1.5 h-3 bg-black/20 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
