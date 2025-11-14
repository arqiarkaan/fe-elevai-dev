import { useFeatureState } from '@/hooks/useFeatureState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Globe,
  MapPin,
  BookOpen,
  Heart,
  Award,
  Target,
  Sparkles,
  Copy,
  Loader2,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { studentDevelopmentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface EssayExchangeState {
  formData: {
    namaProgram: string;
    negaraUniversitas: string;
    motivasiAkademik: string;
    motivasiPribadi: string;
    skillPengalaman: string;
    rencanaPasca: string;
  };
  result: {
    essay: string;
    tokens_used?: number;
  } | null;
}

export const EssayExchangeFeature = () => {
  const [state, setState] = useFeatureState<EssayExchangeState>(
    {
      formData: {
        namaProgram: '',
        negaraUniversitas: '',
        motivasiAkademik: '',
        motivasiPribadi: '',
        skillPengalaman: '',
        rencanaPasca: '',
      },
      result: null,
    },
    'essay-exchange'
  );
  const { refreshProfile } = useUserStore();

  const { formData, result } = state;
  const setFormData = (data: EssayExchangeState['formData']) =>
    setState({ ...state, formData: data });
  const setResult = (data: { essay: string; tokens_used?: number } | null) =>
    setState({ ...state, result: data });

  const isValid = Object.values(formData).every((val) => val.trim() !== '');

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await studentDevelopmentApi.essayExchange({
        programName: formData.namaProgram,
        negaraUniversitas: formData.negaraUniversitas,
        motivasiAkademik: formData.motivasiAkademik,
        motivasiPribadi: formData.motivasiPribadi,
        skillPengalaman: formData.skillPengalaman,
        rencanKontribusi: formData.rencanaPasca,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        refreshProfile();
      }
    },
    onError: (error: {
      error?: string;
      current_balance?: number;
      need_to_purchase?: number;
    }) => {
      console.error('Essay Exchange error:', error);
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else if (error.error === 'Premium subscription required') {
        toast.error('Fitur ini memerlukan langganan premium');
      } else {
        toast.error(error.error || 'Terjadi kesalahan saat generate esai');
      }
    },
  });

  const handleCopy = () => {
    if (result?.essay) {
      navigator.clipboard.writeText(result.essay);
      toast.success('Esai berhasil disalin!');
    }
  };

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  if (result) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            AI Motivation Letter Assistant
          </h2>
          <p className="text-muted-foreground">
            Hasil motivation letter untuk program impianmu.
          </p>
        </div>

        <Card className="p-6 bg-card/50 border-border/50 relative">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="absolute top-4 right-4"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <div className="pr-12">
            <MarkdownRenderer>{result.essay}</MarkdownRenderer>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setResult(null);
            setFormData({
              namaProgram: '',
              negaraUniversitas: '',
              motivasiAkademik: '',
              motivasiPribadi: '',
              skillPengalaman: '',
              rencanaPasca: '',
            });
          }}
        >
          <Sparkles className="w-4 h-4" />
          Generate Esai Baru
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          AI Motivation Letter Assistant
        </h2>
        <p className="text-muted-foreground">
          Susun draf pertama motivation letter untuk program impianmu dengan
          bantuan AI yang terstruktur.
        </p>
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
            onChange={(e) =>
              setFormData({ ...formData, namaProgram: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, negaraUniversitas: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, motivasiAkademik: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, motivasiPribadi: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, skillPengalaman: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, rencanaPasca: e.target.value })
            }
            rows={4}
          />
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!isValid || generateMutation.isPending}
        onClick={handleGenerate}
      >
        {generateMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Draf Esai
          </>
        )}
      </Button>
    </div>
  );
};
