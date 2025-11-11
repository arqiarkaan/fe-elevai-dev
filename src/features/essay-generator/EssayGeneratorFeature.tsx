import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { asistenLombaApi } from "@/lib/api";
import { toast } from "sonner";
import { useUserStore } from "@/lib/user-store";
import { GeneratedResultCard, LoadingStateCard } from "@/components/GeneratedResultCard";

const subTemaMap = {
  soshum: ["Umum", "Pengabdian Masyarakat", "Sosial Budaya", "Ekonomi Kreatif", "Pendidikan Inklusif", "Hukum dan HAM", "Politik Digital", "Budaya Lokal", "Gender & Kesetaraan", "Kearsipan"],
  saintek: ["Umum", "Kesehatan", "Lingkungan & Energi Terbarukan", "Teknologi Tepat Guna", "Inovasi Pertanian", "Kecerdasan Buatan", "Bioteknologi", "Robotika Edukasi", "Ketahanan Pangan", "Teknologi Masa Depan"]
};

export const EssayGeneratorFeature = () => {
  const [temaUtama, setTemaUtama] = useState<"" | "soshum" | "saintek">("");
  const [subTema, setSubTema] = useState("");
  const [latarBelakang, setLatarBelakang] = useState("");
  const [showLatarBelakang, setShowLatarBelakang] = useState(false);
  const [showOpsiLanjutan, setShowOpsiLanjutan] = useState(false);
  const [sertakanPenjelasan, setSertakanPenjelasan] = useState(false);
  const [sertakanMetode, setSertakanMetode] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<Record<string, unknown> | null>(null);
  const { refreshProfile } = useUserStore();

  const isValid = temaUtama && subTema;

  const generateMutation = useMutation({
    mutationFn: async () => {
      const requestData = {
        temaUtama,
        subTema,
        ...(showLatarBelakang && latarBelakang ? { latarBelakang } : {}),
        ...(showOpsiLanjutan ? {
          sertakanPenjelasan,
          sertakanMetode,
        } : {}),
      };
      setLastFormData(requestData);
      return await asistenLombaApi.essayIdea(requestData);
    },
    onSuccess: (data) => {
      if (data.success) {
        // Handle different response formats
        let resultText = '';
        
        // Check if data.data is a string (direct result)
        if (typeof data.data === 'string') {
          resultText = data.data;
        }
        // Check if data.data has a result field
        else if (data.data.result) {
          resultText = data.data.result;
        }
        // Check if data.data has an ideas field that's an array
        else if (Array.isArray(data.data.ideas)) {
          resultText = data.data.ideas.map((idea: { title: string; explanation?: string }, index: number) => 
            `### ${index + 1}. ${idea.title}\n\n${idea.explanation || ''}\n\n`
          ).join('\n');
        }
        // Check if data.data has other possible fields
        else if (data.data.ideas) {
          resultText = data.data.ideas;
        }
        else if (data.data.essay_ideas) {
          resultText = data.data.essay_ideas;
        }
        else if (data.data.generated_ideas) {
          resultText = data.data.generated_ideas;
        }
        // If no recognized field, show error message
        else {
          console.error('Unexpected response format:', data.data);
          toast.error('Format response tidak dikenali. Silakan coba lagi.');
          return;
        }
        
        setResult(resultText);
        refreshProfile();
      }
    },
    onError: (error: { error?: string; current_balance?: number; need_to_purchase?: number }) => {
      console.error("Essay Idea Generator error:", error);
      if (error.error === "Insufficient tokens") {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else {
        toast.error(error.error || "Terjadi kesalahan saat generate ide esai");
      }
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success("Hasil berhasil disalin!");
    }
  };

  const handleRegenerate = () => {
    generateMutation.mutate();
  };

  const handleReset = () => {
    setResult(null);
    setTemaUtama("");
    setSubTema("");
    setLatarBelakang("");
    setShowLatarBelakang(false);
    setShowOpsiLanjutan(false);
    setSertakanPenjelasan(false);
    setSertakanMetode(false);
    setLastFormData(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Essay Idea Generator</h2>
        <p className="text-muted-foreground">Biarkan AI membantu Anda menemukan ide judul esai yang inovatif dan kompetitif untuk lomba.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tema Utama</Label>
          <Select value={temaUtama} onValueChange={(value: "soshum" | "saintek") => {
            setTemaUtama(value);
            setSubTema("");
          }}>
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
          <Label>Sub-Tema</Label>
          <Select value={subTema} onValueChange={setSubTema} disabled={!temaUtama}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Sub-Tema..." />
            </SelectTrigger>
            <SelectContent>
              {temaUtama && subTemaMap[temaUtama].map(sub => (
                <SelectItem key={sub} value={sub.toLowerCase().replace(/ /g, '-')}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 space-y-4 bg-card/50 border-border/50">
        <div className="flex items-center justify-between">
          <Label htmlFor="latar-belakang" className="cursor-pointer">Gunakan Latar Belakang</Label>
          <Switch 
            id="latar-belakang"
            checked={showLatarBelakang}
            onCheckedChange={setShowLatarBelakang}
          />
        </div>
        
        {showLatarBelakang && (
          <Textarea 
            placeholder="Contoh: Saya adalah mahasiswa IT yang tertarik dengan isu keamanan siber..."
            value={latarBelakang}
            onChange={(e) => setLatarBelakang(e.target.value)}
            rows={4}
            className="animate-fade-in"
          />
        )}
      </Card>

      <Card className="p-4 space-y-4 bg-card/50 border-border/50">
        <div className="flex items-center justify-between">
          <Label htmlFor="opsi-lanjutan" className="cursor-pointer">Opsi Judul Lanjutan</Label>
          <Switch 
            id="opsi-lanjutan"
            checked={showOpsiLanjutan}
            onCheckedChange={setShowOpsiLanjutan}
          />
        </div>

        {showOpsiLanjutan && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <Label htmlFor="penjelasan" className="cursor-pointer">Sertakan Penjelasan Judul</Label>
              <Switch 
                id="penjelasan"
                checked={sertakanPenjelasan}
                onCheckedChange={setSertakanPenjelasan}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="metode" className="cursor-pointer">Sertakan Metode/Teknologi</Label>
              <Switch 
                id="metode"
                checked={sertakanMetode}
                onCheckedChange={setSertakanMetode}
              />
            </div>
          </div>
        )}
      </Card>

      <Button 
        className="w-full" 
        size="lg"
        disabled={!isValid || generateMutation.isPending}
        onClick={handleGenerate}
      >
        <Lightbulb className="w-4 h-4" />
        Generate Judul
      </Button>

      {/* Loading State */}
      {generateMutation.isPending && (
        <LoadingStateCard message="ElevAI sedang menggenerate ide esai..." />
      )}

      {/* Result */}
      {result && !generateMutation.isPending && (
        <GeneratedResultCard
          result={result}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
          onReset={handleReset}
          isRegenerating={generateMutation.isPending}
          requiredTokens={1}
        />
      )}
    </div>
  );
};
