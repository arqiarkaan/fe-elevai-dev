import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, ArrowRight, Loader2, ArrowLeft, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useMutation } from '@tanstack/react-query';
import { studentDevelopmentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';

export const SwotFeature = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mbti: '',
    via1: '',
    via2: '',
    via3: '',
  });
  const [result, setResult] = useState<{ analysis: string; tokens_used?: number } | null>(null);
  const { profile, refreshProfile } = useUserStore();

  const isValid =
    formData.mbti && formData.via1 && formData.via2 && formData.via3;

  const analysisMutation = useMutation({
    mutationFn: async () => {
      return await studentDevelopmentApi.swotAnalysis({
        mbtiType: formData.mbti,
        viaStrengths: [formData.via1, formData.via2, formData.via3],
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        setStep(2);
        // Refresh profile to update token balance
        refreshProfile();
      }
    },
    onError: (error: { error?: string; current_balance?: number; need_to_purchase?: number }) => {
      console.error('SWOT Analysis error:', error);
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else if (error.error === 'Premium subscription required') {
        toast.error('Fitur ini memerlukan langganan premium');
      } else {
        toast.error(error.error || 'Terjadi kesalahan saat menganalisis');
      }
    },
  });

  const handleAnalyze = () => {
    analysisMutation.mutate();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    toast.info('Fitur download PDF akan segera tersedia');
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
          Download PDF
        </Button>

        <div className="flex items-center gap-2 text-lg font-semibold">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span>Hasil Analisis SWOT Diri & Rencana Aksi:</span>
        </div>

        <Card className="p-6 bg-card/50 border-border/50 space-y-2">
          <h3 className="text-xl font-bold">Data Diri untuk Analisis:</h3>
          <div className="text-sm space-y-1">
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
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{result.analysis}</ReactMarkdown>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setStep(1);
            setResult(null);
            setFormData({ mbti: '', via1: '', via2: '', via3: '' });
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

      <Card className="p-6 bg-card/50 border-border/50 space-y-4">
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
                setFormData({ ...formData, mbti: e.target.value.toUpperCase() })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              VIA Character Strength #1
            </Label>
            <Input
              placeholder="Misal: Creativity"
              value={formData.via1}
              onChange={(e) =>
                setFormData({ ...formData, via1: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              VIA Character Strength #2
            </Label>
            <Input
              placeholder="Misal: Honesty"
              value={formData.via2}
              onChange={(e) =>
                setFormData({ ...formData, via2: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              VIA Character Strength #3
            </Label>
            <Input
              placeholder="Misal: Kindness"
              value={formData.via3}
              onChange={(e) =>
                setFormData({ ...formData, via3: e.target.value })
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
