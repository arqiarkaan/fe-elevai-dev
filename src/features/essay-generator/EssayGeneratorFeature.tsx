import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
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
import { useApiError } from '@/hooks/useApiError';
import {
  GeneratedResultCard,
  LoadingStateCard,
} from '@/components/GeneratedResultCard';
import { useFeatureState } from '@/hooks/useFeatureState';

const subTemaMap = {
  soshum: [
    'Umum',
    'Pengabdian Masyarakat',
    'Sosial Budaya',
    'Ekonomi Kreatif',
    'Pendidikan Inklusif',
    'Hukum dan HAM',
    'Politik Digital',
    'Budaya Lokal',
    'Gender & Kesetaraan',
    'Kearsipan',
  ],
  saintek: [
    'Umum',
    'Kesehatan',
    'Lingkungan & Energi Terbarukan',
    'Teknologi Tepat Guna',
    'Inovasi Pertanian',
    'Kecerdasan Buatan',
    'Bioteknologi',
    'Robotika Edukasi',
    'Ketahanan Pangan',
    'Teknologi Masa Depan',
  ],
};

interface EssayGeneratorState {
  temaUtama: '' | 'soshum' | 'saintek';
  subTema: string;
  latarBelakang: string;
  showLatarBelakang: boolean;
  showOpsiLanjutan: boolean;
  sertakanPenjelasan: boolean;
  sertakanMetode: boolean;
  result: string | null;
  lastFormData: Record<string, unknown> | null;
}

export const EssayGeneratorFeature = () => {
  const [state, setState] = useFeatureState<EssayGeneratorState>(
    {
      temaUtama: '',
      subTema: '',
      latarBelakang: '',
      showLatarBelakang: false,
      showOpsiLanjutan: false,
      sertakanPenjelasan: false,
      sertakanMetode: false,
      result: null,
      lastFormData: null,
    },
    'essay-generator'
  );
  const { refreshProfile } = useUserStore();
  const { handleError } = useApiError();

  const {
    temaUtama,
    subTema,
    latarBelakang,
    showLatarBelakang,
    showOpsiLanjutan,
    sertakanPenjelasan,
    sertakanMetode,
    result,
    lastFormData,
  } = state;

  const setTemaUtama = (value: '' | 'soshum' | 'saintek') => {
    // Reset subTema when temaUtama changes
    setState({ ...state, temaUtama: value, subTema: '' });
  };
  const setSubTema = (value: string) => setState({ ...state, subTema: value });
  const setLatarBelakang = (value: string) =>
    setState({ ...state, latarBelakang: value });
  const setShowLatarBelakang = (value: boolean) =>
    setState({ ...state, showLatarBelakang: value });
  const setShowOpsiLanjutan = (value: boolean) =>
    setState({ ...state, showOpsiLanjutan: value });
  const setSertakanPenjelasan = (value: boolean) =>
    setState({ ...state, sertakanPenjelasan: value });
  const setSertakanMetode = (value: boolean) =>
    setState({ ...state, sertakanMetode: value });
  const setResult = (value: string | null) =>
    setState({ ...state, result: value });
  const setLastFormData = (value: Record<string, unknown> | null) =>
    setState({ ...state, lastFormData: value });

  const isValid = temaUtama && subTema;

  const generateMutation = useMutation({
    mutationFn: async () => {
      const requestData = {
        temaUtama,
        subTema,
        ...(showLatarBelakang && latarBelakang ? { latarBelakang } : {}),
        ...(showOpsiLanjutan
          ? {
              sertakanPenjelasan,
              sertakanMetode,
            }
          : {}),
      };
      setLastFormData(requestData);
      return await asistenLombaApi.essayIdea(requestData);
    },
    onSuccess: async (data) => {
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
          resultText = data.data.ideas
            .map(
              (idea: { title: string; explanation?: string }, index: number) =>
                `### ${index + 1}. ${idea.title}\n\n${
                  idea.explanation || ''
                }\n\n`
            )
            .join('\n');
        }
        // Check if data.data has other possible fields
        else if (data.data.ideas) {
          resultText = data.data.ideas;
        } else if (data.data.essay_ideas) {
          resultText = data.data.essay_ideas;
        } else if (data.data.generated_ideas) {
          resultText = data.data.generated_ideas;
        }
        // If no recognized field, show error message
        else {
          console.error('Unexpected response format:', data.data);
          toast.error('Format response tidak dikenali. Silakan coba lagi.');
          return;
        }

        setResult(resultText);
        await refreshProfile();
      }
    },
    onError: (error) => {
      handleError(error, {
        default: 'Terjadi kesalahan saat generate ide esai',
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

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
      latarBelakang: '',
      showLatarBelakang: false,
      showOpsiLanjutan: false,
      sertakanPenjelasan: false,
      sertakanMetode: false,
      result: null,
      lastFormData: null,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          AI Essay Idea Generator
        </h2>
        <p className="text-muted-foreground">
          Biarkan AI membantu Anda menemukan ide judul esai yang inovatif dan
          kompetitif untuk lomba.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tema Utama</Label>
          <Select
            value={temaUtama}
            onValueChange={(value: 'soshum' | 'saintek') => {
              setTemaUtama(value);
            }}
          >
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
          <Select
            value={subTema}
            onValueChange={setSubTema}
            disabled={!temaUtama}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Sub-Tema..." />
            </SelectTrigger>
            <SelectContent>
              {temaUtama &&
                subTemaMap[temaUtama].map((sub) => (
                  <SelectItem
                    key={sub}
                    value={sub.toLowerCase().replace(/ /g, '-')}
                  >
                    {sub}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 space-y-4 bg-card/50 border-border/50">
        <div className="flex items-center justify-between">
          <Label htmlFor="latar-belakang" className="cursor-pointer">
            Gunakan Latar Belakang
          </Label>
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
          <Label htmlFor="opsi-lanjutan" className="cursor-pointer">
            Opsi Judul Lanjutan
          </Label>
          <Switch
            id="opsi-lanjutan"
            checked={showOpsiLanjutan}
            onCheckedChange={setShowOpsiLanjutan}
          />
        </div>

        {showOpsiLanjutan && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <Label htmlFor="penjelasan" className="cursor-pointer">
                Sertakan Penjelasan Judul
              </Label>
              <Switch
                id="penjelasan"
                checked={sertakanPenjelasan}
                onCheckedChange={setSertakanPenjelasan}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="metode" className="cursor-pointer">
                Sertakan Metode/Teknologi
              </Label>
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
