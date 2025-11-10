import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Briefcase, Sparkles } from "lucide-react";

const switchOptions = [
  "Ringkasan Eksekutif",
  "Analisis Pasar",
  "Strategi Pemasaran",
  "Keuangan",
  "Analisis SWOT"
];

export const BusinessPlanFeature = () => {
  const [ideBisnis, setIdeBisnis] = useState("");
  const [switches, setSwitches] = useState<Record<string, boolean>>({});

  const isValid = ideBisnis.trim() !== "";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Business Plan Generator</h2>
        <p className="text-muted-foreground">Ubah ide brilian Anda menjadi kerangka rencana bisnis yang terstruktur dengan bantuan AI.</p>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Deskripsikan Ide Bisnis Anda
        </Label>
        <Textarea 
          placeholder="Contoh: Membuat platform marketplace untuk menyewakan alat-alat camping antar pengguna Indonesia..."
          value={ideBisnis}
          onChange={(e) => setIdeBisnis(e.target.value)}
          rows={6}
        />
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
        <Sparkles className="w-4 h-4" />
        Generate Business Plan
      </Button>
    </div>
  );
};
