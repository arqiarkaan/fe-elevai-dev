import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const switchOptions = [
  "Latar Belakang Urgensi",
  "Penelitian Terdahulu",
  "Keterbaruan",
  "Success Rate + Contoh Input/Output",
  "Langkah Konkret",
  "Efisiensi"
];

export const KtiGeneratorFeature = () => {
  const [temaUtama, setTemaUtama] = useState("");
  const [subTema, setSubTema] = useState("");
  const [switches, setSwitches] = useState<Record<string, boolean>>({});

  const isValid = temaUtama && subTema;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">AI KTI Idea Generator</h2>
        <p className="text-muted-foreground">Buat ide Karya Tulis Ilmiah yang kompetitif dan terstruktur dengan bantuan AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tema Utama</Label>
          <Select value={temaUtama} onValueChange={setTemaUtama}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Tema..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soshum">Soshum</SelectItem>
              <SelectItem value="saintek">Saintek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sub-Tema Spesifik</Label>
          <Input 
            placeholder="Contoh: Pengolahan Sampah Plastik"
            value={subTema}
            onChange={(e) => setSubTema(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-4 space-y-3 bg-card/50 border-border/50">
        {switchOptions.map((option) => (
          <div key={option} className="flex items-center justify-between">
            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
            <Switch 
              id={option}
              checked={switches[option] || false}
              onCheckedChange={(checked) => setSwitches({...switches, [option]: checked})}
            />
          </div>
        ))}
      </Card>

      <Button 
        className="w-full" 
        size="lg"
        disabled={!isValid}
      >
        <FileText className="w-4 h-4" />
        Generate Ide KTI
      </Button>
    </div>
  );
};
