import { Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Tentang ElevatEd Indonesia</h3>
            <p className="text-muted-foreground leading-relaxed">
              ElevatEd Indonesia adalah sebuah startup Edutech yang berfokus pada pengembangan diri mahasiswa secara holistik. 
              Kami percaya bahwa setiap mahasiswa memiliki potensi unik, dan dengan bimbingan serta alat yang tepat, 
              mereka dapat meraih versi terbaik dari diri mereka dan siap menghadapi tantangan global.
            </p>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Terhubung Dengan Kami</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="https://instagram.com/elevated.indonesia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <Instagram className="w-5 h-5" />
                @elevated.indonesia
              </a>
              <a 
                href="https://linkedin.com/company/elevated-indonesia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                <Linkedin className="w-5 h-5" />
                Elevated Indonesia
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-muted-foreground text-sm">
          © 2025 ElevatEd Indonesia. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
