import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { asistenLombaApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import {
  GeneratedResultCard,
  LoadingStateCard,
} from '@/components/GeneratedResultCard';
import { useFeatureState } from '@/hooks/useFeatureState';
import { showTokenConsumptionToast } from '@/utils/token-toast';

const switchOptions = [
  { key: 'ringkasanEksekutif', label: 'Ringkasan Eksekutif' },
  { key: 'analisisPasar', label: 'Analisis Pasar' },
  { key: 'strategiPemasaran', label: 'Strategi Pemasaran' },
  { key: 'keuangan', label: 'Keuangan' },
  { key: 'analisisSWOT', label: 'Analisis SWOT' },
];

interface BusinessPlanState {
  ideBisnis: string;
  switches: Record<string, boolean>;
  result: string | null;
}

export const BusinessPlanFeature = () => {
  const [state, setState] = useFeatureState<BusinessPlanState>(
    {
      ideBisnis: '',
      switches: {},
      result: null,
    },
    'business-plan'
  );
  const { refreshProfile, profile } = useUserStore();

  const { ideBisnis, switches, result } = state;
  const setIdeBisnis = (value: string) =>
    setState({ ...state, ideBisnis: value });
  const setSwitches = (value: Record<string, boolean>) =>
    setState({ ...state, switches: value });
  const setResult = (value: string | null) =>
    setState({ ...state, result: value });

  const isValid = ideBisnis.trim() !== '';

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await asistenLombaApi.businessPlan({
        deskripsiBisnis: ideBisnis,
        ringkasanEksekutif: switches.ringkasanEksekutif,
        analisisPasar: switches.analisisPasar,
        strategiPemasaran: switches.strategiPemasaran,
        keuangan: switches.keuangan,
        analisisSWOT: switches.analisisSWOT,
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
        } else if (data.data.plan) {
          resultText = data.data.plan;
        } else if (data.data.business_plan) {
          resultText = data.data.business_plan;
        } else if (data.data.business_plan_outline) {
          resultText = data.data.business_plan_outline;
        } else {
          // If no recognized field, show error message
          console.error('Unexpected response format:', data.data);
          toast.error('Format response tidak dikenali. Silakan coba lagi.');
          return;
        }

        // Save token balance BEFORE refresh
        const previousBalance = profile?.tokens || 0;

        setResult(resultText);
        await refreshProfile();

        // Get new balance after refresh and show token consumption toast
        const newBalance = useUserStore.getState().profile?.tokens || 0;
        showTokenConsumptionToast(previousBalance, newBalance);
      }
    },
    onError: (error: {
      error?: string;
      current_balance?: number;
      need_to_purchase?: number;
    }) => {
      console.error('Business Plan Generator error:', error);
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else {
        toast.error(
          error.error || 'Terjadi kesalahan saat generate business plan'
        );
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
      ideBisnis: '',
      switches: {},
      result: null,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          AI Business Plan Generator
        </h2>
        <p className="text-muted-foreground">
          Ubah ide brilian Anda menjadi kerangka rencana bisnis yang terstruktur
          dengan bantuan AI.
        </p>
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
        <Briefcase className="w-4 h-4" />
        Generate Business Plan
      </Button>

      {generateMutation.isPending && (
        <LoadingStateCard message="ElevAI sedang menggenerate business plan..." />
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
