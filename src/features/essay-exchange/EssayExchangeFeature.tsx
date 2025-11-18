import { useStepFeatureState } from '@/hooks/useFeatureState';
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
  Loader2,
  ArrowRight,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { studentDevelopmentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import { useApiError } from '@/hooks/useApiError';
import { clearFeatureState } from '@/lib/storage-utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { generatePDF } from '@/lib/pdf-generator';

type Step = 1 | 2;

interface EssayExchangeState {
  step: Step;
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
  // Step validation function
  const validateStep = (step: number, state: EssayExchangeState): boolean => {
    switch (step) {
      case 1:
        return true; // Step 1 always accessible
      case 2:
        // Step 2 requires result (essay generated)
        return !!state.result;
      default:
        return false;
    }
  };

  const [state, setState, setStep] = useStepFeatureState<EssayExchangeState>(
    {
      step: 1,
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
    'essay-exchanges',
    validateStep
  );
  const { refreshProfile } = useUserStore();
  const { handleError } = useApiError();

  const { step, formData, result } = state;

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
    onSuccess: async (data) => {
      if (data.success) {
        setState({ ...state, result: data.data, step: 2 });
        await refreshProfile();
      }
    },
    onError: (error) => {
      handleError(error, {
        default: 'Terjadi kesalahan saat generate esai',
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  const handleDownloadPDF = () => {
    if (!result) {
      toast.error('Tidak ada hasil untuk didownload');
      return;
    }

    try {
      const doc = generatePDF({
        title: 'AI Motivation Letter',
        subtitle: 'Powered by ElevAI',
        content: result.essay,
        userData: {
          'Nama Program': formData.namaProgram,
          'Negara & Universitas': formData.negaraUniversitas,
          'Motivasi Akademik': formData.motivasiAkademik,
          'Motivasi Pribadi': formData.motivasiPribadi,
          'Skill & Pengalaman': formData.skillPengalaman,
          'Rencana Kontribusi': formData.rencanaPasca,
        },
      });

      doc.save(
        `Motivation-Letter-${formData.namaProgram}-${new Date().getTime()}.pdf`
      );
      toast.success('PDF berhasil didownload!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF');
    }
  };

  if (step === 2 && result) {
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

        {/* Download PDF Button */}
        <Button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 w-full"
        >
          <Download className="w-4 h-4" />
          Download Laporan PDF
        </Button>

        <div className="flex items-center gap-2 text-lg font-semibold">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span>Hasil Motivation Letter:</span>
        </div>

        {/* Data Analisis */}
        <Card className="p-6 bg-card/50 border-border/50">
          <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Data Analisis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Nama Program:</strong> {formData.namaProgram}
              </p>
              <p>
                <strong>Negara & Universitas:</strong>{' '}
                {formData.negaraUniversitas}
              </p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Motivasi Akademik:</strong>
              </p>
              <p className="text-muted-foreground">
                {formData.motivasiAkademik}
              </p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Motivasi Pribadi & Kultural:</strong>
              </p>
              <p className="text-muted-foreground">
                {formData.motivasiPribadi}
              </p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Skill & Pengalaman:</strong>
              </p>
              <p className="text-muted-foreground">
                {formData.skillPengalaman}
              </p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Rencana Kontribusi:</strong>
              </p>
              <p className="text-muted-foreground">{formData.rencanaPasca}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <MarkdownRenderer>{result.essay}</MarkdownRenderer>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Clear session storage first
            clearFeatureState('essay-exchanges');
            // Then reset state completely
            setState({
              step: 1,
              formData: {
                namaProgram: '',
                negaraUniversitas: '',
                motivasiAkademik: '',
                motivasiPribadi: '',
                skillPengalaman: '',
                rencanaPasca: '',
              },
              result: null,
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
              setState({
                ...state,
                formData: { ...formData, namaProgram: e.target.value },
              })
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
              setState({
                ...state,
                formData: { ...formData, negaraUniversitas: e.target.value },
              })
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
              setState({
                ...state,
                formData: { ...formData, motivasiAkademik: e.target.value },
              })
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
              setState({
                ...state,
                formData: { ...formData, motivasiPribadi: e.target.value },
              })
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
              setState({
                ...state,
                formData: { ...formData, skillPengalaman: e.target.value },
              })
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
              setState({
                ...state,
                formData: { ...formData, rencanaPasca: e.target.value },
              })
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
