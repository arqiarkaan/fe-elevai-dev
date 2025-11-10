import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Video, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const waktuOptions = ["Pagi", "Siang", "Sore", "Malam", "Senja (Golden Hour)", "Fajar (Blue Hour)"];

export const VeoPromptingFeature = () => {
  const [formData, setFormData] = useState({
    subjek: "",
    aksi: "",
    ekspresi: "",
    lokasi: "",
    waktu: "Pagi",
    pencahayaan: "",
    gerakanKamera: "",
    gaya: "",
    suasana: "",
    suara: "",
    dialog: "",
    detail: ""
  });

  const isValid = formData.subjek && formData.aksi && formData.lokasi;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Generator Prompt Veo</h2>
        <p className="text-muted-foreground">Isi detail di bawah ini untuk membuat prompt video yang deskriptif untuk AI seperti Google Veo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Subjek Utama</Label>
          <Input 
            placeholder="Contoh: Seekor kucing oranye, astronot"
            value={formData.subjek}
            onChange={(e) => setFormData({...formData, subjek: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Aksi / Kegiatan</Label>
          <Input 
            placeholder="Contoh: sedang bermain piano, berlari di padang bunga"
            value={formData.aksi}
            onChange={(e) => setFormData({...formData, aksi: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Ekspresi / Emosi</Label>
          <Input 
            placeholder="Senang, terkejut, melamun"
            value={formData.ekspresi}
            onChange={(e) => setFormData({...formData, ekspresi: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Lokasi / Tempat</Label>
          <Input 
            placeholder="Perpustakaan tua, planet Mars"
            value={formData.lokasi}
            onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Waktu</Label>
          <Select value={formData.waktu} onValueChange={(value) => setFormData({...formData, waktu: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {waktuOptions.map(w => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pencahayaan</Label>
          <Input 
            placeholder="Dramatis, lembut, neon"
            value={formData.pencahayaan}
            onChange={(e) => setFormData({...formData, pencahayaan: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Gerakan Kamera</Label>
          <Input 
            placeholder="Panning shot, zoom in, drone shot"
            value={formData.gerakanKamera}
            onChange={(e) => setFormData({...formData, gerakanKamera: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Gaya Video</Label>
          <Input 
            placeholder="Cinematic, timelapse, rekaman arsip"
            value={formData.gaya}
            onChange={(e) => setFormData({...formData, gaya: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Suasana Video</Label>
          <Input 
            placeholder="Misterius, ceria, nostalgia"
            value={formData.suasana}
            onChange={(e) => setFormData({...formData, suasana: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Suara / Musik</Label>
          <Input 
            placeholder="Musik orkestra, suara alam"
            value={formData.suara}
            onChange={(e) => setFormData({...formData, suara: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label>Kalimat yang Diucapkan (Dialog)</Label>
          <Input 
            placeholder="Contoh: 'Kita berhasil!'"
            value={formData.dialog}
            onChange={(e) => setFormData({...formData, dialog: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Detail Tambahan</Label>
        <Textarea 
          placeholder="Contoh: sangat detail, 8K, photorealistic, fokus pada detail mata"
          value={formData.detail}
          onChange={(e) => setFormData({...formData, detail: e.target.value})}
          rows={4}
        />
      </div>

      <Button 
        className="w-full" 
        size="lg"
        disabled={!isValid}
      >
        <Video className="w-4 h-4" />
        Buat Prompt
      </Button>
    </div>
  );
};
