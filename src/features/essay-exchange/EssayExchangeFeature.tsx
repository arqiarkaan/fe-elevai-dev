import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, MapPin, BookOpen, Heart, Award, Target, Sparkles } from "lucide-react";

export const EssayExchangeFeature = () => {
  const [formData, setFormData] = useState({
    namaProgram: "",
    negaraUniversitas: "",
    motivasiAkademik: "",
    motivasiPribadi: "",
    skillPengalaman: "",
    rencanaPasca: ""
  });

  const isValid = Object.values(formData).every(val => val.trim() !== "");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Motivation Letter Assistant</h2>
        <p className="text-muted-foreground">Susun draf pertama motivation letter untuk program impianmu dengan bantuan AI yang terstruktur.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Nama Program Exchange
          </Label>
          <Input 
            placeholder="Cth: IISMA"
            value={formData.namaProgram}
            onChange={(e) => setFormData({...formData, namaProgram: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Negara & Universitas Tujuan
          </Label>
          <Input 
            placeholder="Cth: USA, University of Pennsylvania"
            value={formData.negaraUniversitas}
            onChange={(e) => setFormData({...formData, negaraUniversitas: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Motivasi Akademik
          </Label>
          <Textarea 
            placeholder="Mata kuliah apa yang ingin diambil? Mengapa Relevan?"
            value={formData.motivasiAkademik}
            onChange={(e) => setFormData({...formData, motivasiAkademik: e.target.value})}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Motivasi Pribadi & Kultural
          </Label>
          <Textarea 
            placeholder="Apa yang kamu pelajari dari budayanya?"
            value={formData.motivasiPribadi}
            onChange={(e) => setFormData({...formData, motivasiPribadi: e.target.value})}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Skill & Pengalaman Relevan
          </Label>
          <Textarea 
            placeholder="Sebutkan 2-3 skill atau pengalaman terkuatmu."
            value={formData.skillPengalaman}
            onChange={(e) => setFormData({...formData, skillPengalaman: e.target.value})}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Rencana Kontribusi Pasca-Program
          </Label>
          <Textarea 
            placeholder="Apa rencanamu setelah kembali ke Indonesia?"
            value={formData.rencanaPasca}
            onChange={(e) => setFormData({...formData, rencanaPasca: e.target.value})}
            rows={4}
          />
        </div>
      </div>

      <Button 
        className="w-full" 
        size="lg"
        disabled={!isValid}
      >
        <Sparkles className="w-4 h-4" />
        Generate Draf Esai
      </Button>
    </div>
  );
};
