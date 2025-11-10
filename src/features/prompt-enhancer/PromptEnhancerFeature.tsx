import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckSquare, FileText, Calendar, Lightbulb, Code, ArrowLeft, Sparkles } from "lucide-react";

const kebutuhanOptions = [
  {
    id: "belajar",
    icon: BookOpen,
    header: "Mempelajari Topik Baru",
    subheader: "Dapatkan penjelasan mendalam & terstruktur.",
    placeholder: "Contoh: Jelaskan konsep blockchain dengan analogi sederhana yang mudah dipahami pemula."
  },
  {
    id: "tugas",
    icon: CheckSquare,
    header: "Menyelesaikan Tugas",
    subheader: "Dapatkan hasil yang detail & akurat untuk pekerjaan.",
    placeholder: "Contoh: Buatkan rangkuman 500 kata tentang dampak AI terhadap industri kreatif."
  },
  {
    id: "konten",
    icon: FileText,
    header: "Membuat Konten",
    subheader: "Hasilkan ide & tulisan untuk blog, email, atau script.",
    placeholder: "Contoh: Buatkan caption Instagram yang engaging untuk produk skincare alami."
  },
  {
    id: "rencana",
    icon: Calendar,
    header: "Membuat Rencana/Jadwal",
    subheader: "Buat rencana kerja atau jadwal yang sistematis.",
    placeholder: "Contoh: Susunkan jadwal belajar 2 minggu untuk persiapan ujian TOEFL."
  },
  {
    id: "brainstorm",
    icon: Lightbulb,
    header: "Brainstorming Ide",
    subheader: "Gali berbagai kemungkinan & sudut pandang baru.",
    placeholder: "Contoh: Berikan 10 ide nama brand untuk coffee shop dengan tema sustainable living."
  },
  {
    id: "koding",
    icon: Code,
    header: "Bantuan Koding/Teknis",
    subheader: "Dapatkan solusi, penjelasan, & optimasi kode.",
    placeholder: "Contoh: Jelaskan cara kerja React hooks useState dan berikan contoh praktisnya."
  }
];

export const PromptEnhancerFeature = () => {
  const [selectedKebutuhan, setSelectedKebutuhan] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  const selected = kebutuhanOptions.find(opt => opt.id === selectedKebutuhan);

  if (selected) {
    const Icon = selected.icon;
    return (
      <div className="space-y-6 animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => {
            setSelectedKebutuhan(null);
            setPrompt("");
          }}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali Pilih Kebutuhan
        </Button>

        <div className="text-center space-y-3">
          <Icon className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">{selected.header}</h2>
          <p className="text-muted-foreground">{selected.subheader}</p>
        </div>

        <Textarea 
          placeholder={selected.placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          className="text-base"
        />

        <Button 
          className="w-full" 
          size="lg"
          disabled={!prompt.trim()}
        >
          <Sparkles className="w-4 h-4" />
          Upgrade Prompt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Pilih Kebutuhan Anda</h2>
        <p className="text-muted-foreground">Setiap pilihan akan menerapkan metode prompting yang berbeda untuk hasil maksimal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kebutuhanOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.id}
              className="p-6 cursor-pointer hover:border-primary/50 hover:shadow-glow transition-smooth group"
              onClick={() => setSelectedKebutuhan(option.id)}
            >
              <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-smooth" />
              <h3 className="text-lg font-bold mb-2">{option.header}</h3>
              <p className="text-sm text-muted-foreground">{option.subheader}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
