import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { asistenLombaApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import {
  GeneratedResultCard,
  LoadingStateCard,
} from '@/components/GeneratedResultCard';
import { useFeatureState } from '@/hooks/useFeatureState';

const switchOptions = [
  { key: 'latarBelakangUrgensi', label: 'Latar Belakang Urgensi' },
  { key: 'penelitianTerdahulu', label: 'Penelitian Terdahulu' },
  { key: 'keterbaruan', label: 'Keterbaruan' },
  { key: 'successRate', label: 'Success Rate + Contoh Input/Output' },
  { key: 'langkahKonkret', label: 'Langkah Konkret' },
  { key: 'efisiensi', label: 'Efisiensi' },
];

interface KtiGeneratorState {
  temaUtama: string;
  subTema: string;
  switches: Record<string, boolean>;
  result: string | null;
}

export const KtiGeneratorFeature = () => {
  const [state, setState] = useFeatureState<KtiGeneratorState>(
    {
      temaUtama: '',
      subTema: '',
      switches: {},
      result: null,
    },
    'kti-generator'
  );
  const { refreshProfile, profile } = useUserStore();

  const { temaUtama, subTema, switches, result } = state;
  const setTemaUtama = (value: string) =>
    setState({ ...state, temaUtama: value });
  const setSubTema = (value: string) => setState({ ...state, subTema: value });
  const setSwitches = (value: Record<string, boolean>) =>
    setState({ ...state, switches: value });
  const setResult = (value: string | null) =>
    setState({ ...state, result: value });

  const isValid = temaUtama && subTema;

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await asistenLombaApi.ktiIdea({
        temaUtama,
        subTema,
        latarBelakangUrgensi: switches.latarBelakangUrgensi,
        penelitianTerdahulu: switches.penelitianTerdahulu,
        keterbaruan: switches.keterbaruan,
        successRate: switches.successRate,
        langkahKonkret: switches.langkahKonkret,
        efisiensi: switches.efisiensi,
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        // Handle different response formats
        let resultText = '';

        if (typeof data.data === 'string') {
          resultText = data.data;
        } else if (data.data.result) {
          resultText = data.data.result;
        } else if (data.data.ideas) {
          resultText = data.data.ideas;
        } else if (data.data.kti_ideas) {
          resultText = data.data.kti_ideas;
        } else if (data.data.generated_ideas) {
          resultText = data.data.generated_ideas;
        } else {
          // If no recognized field, show error message
          console.error('Unexpected response format:', data.data);
          toast.error('Format response tidak dikenali. Silakan coba lagi.');
          return;
        }

        setResult(resultText);
        await refreshProfile();
      }
    },
    onError: (error: {
      error?: string;
      current_balance?: number;
      need_to_purchase?: number;
    }) => {
      console.error('KTI Generator error:', error);
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else {
        toast.error(error.error || 'Terjadi kesalahan saat generate ide KTI');
      }
    },
  });

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Hasil berhasil disalin!');
    }
  };

  const handleRegenerate = () => {
    generateMutation.mutate();
  };

  const handleReset = () => {
    setState({
      temaUtama: '',
      subTema: '',
      switches: {},
      result: null,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          AI KTI Idea Generator
        </h2>
        <p className="text-muted-foreground">
          Buat ide Karya Tulis Ilmiah yang kompetitif dan terstruktur dengan
          bantuan AI.
        </p>
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
          <div key={option.key} className="flex items-center justify-between">
            <Label htmlFor={option.key} className="cursor-pointer">
              {option.label}
            </Label>
            <Switch
              id={option.key}
              checked={switches[option.key] || false}
              onCheckedChange={(checked) =>
                setSwitches({ ...switches, [option.key]: checked })
              }
            />
          </div>
        ))}
      </Card>

      <Button
        className="w-full"
        size="lg"
        disabled={!isValid || generateMutation.isPending}
        onClick={() => generateMutation.mutate()}
      >
        <FileText className="w-4 h-4" />
        Generate Ide KTI
      </Button>

      {generateMutation.isPending && (
        <LoadingStateCard message="ElevAI sedang menggenerate ide KTI..." />
      )}

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
