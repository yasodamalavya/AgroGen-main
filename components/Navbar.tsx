'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#impact", label: "Impact" },
    { href: "#tech-stack", label: "Technology" },
    { href: "#roadmap", label: "Roadmap" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.06]" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src={'/favicon.png'}
                width={40}
                height={40}
                alt="AgroGen Logo"
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-nohemi)]">
              <span className="text-black">Agro</span>
              <span className="text-green-600">Gen</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-black/60 hover:text-black transition-colors duration-200 font-[family-name:var(--font-nohemi)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="/dashboard">
              <Button
                className="bg-green-600 text-white hover:bg-green-700 font-semibold px-6 py-2 rounded-full transition-all duration-300 cursor-pointer"
                variant="default"
              >
                Get Started
              </Button>
            </Link>
          </div>
          <button
            className="md:hidden text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-black/[0.06] py-6 px-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-black/60 hover:text-black transition-colors duration-200 font-[family-name:var(--font-nohemi)] text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-700 font-semibold px-6 py-2 rounded-full"
                  variant="default"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
