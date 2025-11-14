import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  User,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useMutation } from '@tanstack/react-query';
import { studentDevelopmentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import { useApiError } from '@/hooks/useApiError';
import { clearFeatureState } from '@/lib/storage-utils';
import { generatePDF } from '@/lib/pdf-generator';
import { useStepFeatureState } from '@/hooks/useFeatureState';

interface SwotState {
  step: number;
  formData: {
    mbti: string;
    via1: string;
    via2: string;
    via3: string;
  };
  result: {
    analysis: string;
    tokens_used?: number;
  } | null;
}

export const SwotFeature = () => {
  // Step validation function
  const validateStep = (step: number, state: SwotState): boolean => {
    switch (step) {
      case 1:
        return true; // Step 1 always accessible
      case 2:
        // Step 2 requires result (analysis completed)
        return !!state.result;
      default:
        return false;
    }
  };

  const [state, setState, setStep] = useStepFeatureState<SwotState>(
    {
      step: 1,
      formData: {
        mbti: '',
        via1: '',
        via2: '',
        via3: '',
      },
      result: null,
    },
    'swot',
    validateStep
  );
  const { refreshProfile } = useUserStore();
  const { handleError } = useApiError();

  const { step, formData, result } = state;

  const isValid =
    formData.mbti && formData.via1 && formData.via2 && formData.via3;

  const analysisMutation = useMutation({
    mutationFn: async () => {
      return await studentDevelopmentApi.swotAnalysis({
        mbtiType: formData.mbti,
        viaStrengths: [formData.via1, formData.via2, formData.via3],
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        setState({ ...state, result: data.data, step: 2 });

        // Refresh profile to update token balance
        await refreshProfile();
      }
    },
    onError: (error) => {
      handleError(error, {
        default: 'Terjadi kesalahan saat menganalisis',
      });
    },
  });

  const handleAnalyze = () => {
    analysisMutation.mutate();
  };

  const handleDownloadPDF = () => {
    if (!result) {
      toast.error('Tidak ada hasil untuk didownload');
      return;
    }

    try {
      const doc = generatePDF({
        title: 'AI SWOT Self-Analysis',
        subtitle: 'Powered by ElevAI',
        content: result.analysis,
        userData: {
          'MBTI Type': formData.mbti,
          'VIA Strength #1': formData.via1,
          'VIA Strength #2': formData.via2,
          'VIA Strength #3': formData.via3,
        },
      });

      doc.save(`SWOT-Analysis-${formData.mbti}-${new Date().getTime()}.pdf`);
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
            AI SWOT Self-Analysis
          </h2>
          <p className="text-muted-foreground">
            Kenali dirimu dan bangun rencana aksi strategis berdasarkan
            kepribadian MBTI dan VIA Character Strengths.
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
          <span>Hasil Analisis SWOT Diri & Rencana Aksi:</span>
        </div>

        {/* Data Analisis */}
        <Card className="p-6 bg-card/50 border-border/50">
          <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Data Analisis
          </h3>
          <div className="space-y-3 text-sm">
            <p>
              <strong>MBTI:</strong> {formData.mbti}
            </p>
            <p>
              <strong>VIA Strengths:</strong> {formData.via1}, {formData.via2},{' '}
              {formData.via3}
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <MarkdownRenderer>{result.analysis}</MarkdownRenderer>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Clear session storage first
            clearFeatureState('swot');
            // Then reset state completely
            setState({
              step: 1,
              formData: { mbti: '', via1: '', via2: '', via3: '' },
              result: null,
            });
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali & Analisis dari Awal
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          AI SWOT Self-Analysis
        </h2>
        <p className="text-muted-foreground">
          Kenali dirimu dan bangun rencana aksi strategis berdasarkan
          kepribadian MBTI dan VIA Character Strengths.
        </p>
      </div>

      <Card className="p-6 gradient-card border-border/50 space-y-4">
        <h3 className="text-lg font-semibold">Masukkan Data Kepribadian</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              MBTI Type (4 Huruf Kapital)
            </Label>
            <Input
              placeholder="Misal: INFP"
              maxLength={4}
              value={formData.mbti}
              onChange={(e) =>
                setState({
                  ...state,
                  formData: { ...formData, mbti: e.target.value.toUpperCase() },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              VIA Character Strength #1
            </Label>
            <Input
              placeholder="VIA Strength #1"
              value={formData.via1}
              onChange={(e) =>
                setState({
                  ...state,
                  formData: { ...formData, via1: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              VIA Character Strength #2
            </Label>
            <Input
              placeholder="VIA Strength #2"
              value={formData.via2}
              onChange={(e) =>
                setState({
                  ...state,
                  formData: { ...formData, via2: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              VIA Character Strength #3
            </Label>
            <Input
              placeholder="VIA Strength #3"
              value={formData.via3}
              onChange={(e) =>
                setState({
                  ...state,
                  formData: { ...formData, via3: e.target.value },
                })
              }
            />
          </div>
        </div>
      </Card>

      <Button
        className="w-full"
        size="lg"
        disabled={!isValid || analysisMutation.isPending}
        onClick={handleAnalyze}
      >
        {analysisMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Menganalisis...
          </>
        ) : (
          <>
            <ArrowRight className="w-4 h-4" />
            Analisis SWOT
          </>
        )}
      </Button>
    </div>
  );
};
