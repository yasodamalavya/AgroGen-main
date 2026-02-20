import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-black/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-white/60">
            <p className="font-[family-name:var(--font-nohemi)]">
              © 2025 AgroGen. All farming rights reserved.
            </p>
            <Link 
              href="/privacy" 
              className="text-white/60 hover:text-white transition-colors duration-200 font-[family-name:var(--font-nohemi)]"
            >
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm font-[family-name:var(--font-nohemi)]">
            <span>Cultivate with AI</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/60">
              <path d="M8 2L10 6L14 7L10 9L8 14L6 9L2 7L6 6L8 2Z" fill="currentColor"/>
            </svg>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="https://twitter.com" 
              target="_blank"
              className="text-white/60 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </Link>
            <Link 
              href="https://instagram.com" 
              target="_blank"
              className="text-white/60 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>
            <Link 
              href="https://linkedin.com" 
              target="_blank"
              className="text-white/60 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>

        <div className="text-center mt-10 text-xs text-white/40">
          All rights reserved. All wrongs reversed.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
