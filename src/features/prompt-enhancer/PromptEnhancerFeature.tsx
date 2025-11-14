import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  CheckSquare,
  FileText,
  Calendar,
  Lightbulb,
  Code,
  ArrowLeft,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { dailyToolsApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import {
  GeneratedResultCard,
  LoadingStateCard,
} from '@/components/GeneratedResultCard';
import { useFeatureState } from '@/hooks/useFeatureState';
import { useNavigate, useParams } from 'react-router-dom';

const kebutuhanOptions = [
  {
    id: 'topik-baru',
    icon: BookOpen,
    header: 'Mempelajari Topik Baru',
    subheader: 'Dapatkan penjelasan mendalam & terstruktur.',
    placeholder:
      'Contoh: Jelaskan konsep blockchain dengan analogi sederhana yang mudah dipahami pemula.',
    apiCall: (prompt: string) => dailyToolsApi.promptEnhancerTopikBaru(prompt),
  },
  {
    id: 'tugas',
    icon: CheckSquare,
    header: 'Menyelesaikan Tugas',
    subheader: 'Dapatkan hasil yang detail & akurat untuk pekerjaan.',
    placeholder:
      'Contoh: Buatkan rangkuman 500 kata tentang dampak AI terhadap industri kreatif.',
    apiCall: (prompt: string) => dailyToolsApi.promptEnhancerTugas(prompt),
  },
  {
    id: 'konten',
    icon: FileText,
    header: 'Membuat Konten',
    subheader: 'Hasilkan ide & tulisan untuk blog, email, atau script.',
    placeholder:
      'Contoh: Buatkan caption Instagram yang engaging untuk produk skincare alami.',
    apiCall: (prompt: string) => dailyToolsApi.promptEnhancerKonten(prompt),
  },
  {
    id: 'rencana',
    icon: Calendar,
    header: 'Membuat Rencana/Jadwal',
    subheader: 'Buat rencana kerja atau jadwal yang sistematis.',
    placeholder:
      'Contoh: Susunkan jadwal belajar 2 minggu untuk persiapan ujian TOEFL.',
    apiCall: (prompt: string) => dailyToolsApi.promptEnhancerRencana(prompt),
  },
  {
    id: 'brainstorming',
    icon: Lightbulb,
    header: 'Brainstorming Ide',
    subheader: 'Gali berbagai kemungkinan & sudut pandang baru.',
    placeholder:
      'Contoh: Berikan 10 ide nama brand untuk coffee shop dengan tema sustainable living.',
    apiCall: (prompt: string) =>
      dailyToolsApi.promptEnhancerBrainstorming(prompt),
  },
  {
    id: 'koding',
    icon: Code,
    header: 'Bantuan Koding/Teknis',
    subheader: 'Dapatkan solusi, penjelasan, & optimasi kode.',
    placeholder:
      'Contoh: Jelaskan cara kerja React hooks useState dan berikan contoh praktisnya.',
    apiCall: (prompt: string) => dailyToolsApi.promptEnhancerKoding(prompt),
  },
];

export const PromptEnhancerFeature = () => {
  const navigate = useNavigate();
  const { subFeature } = useParams<{ subFeature?: string }>();

  // Get selected ID from URL param (e.g., "/prompt-enhancer/koding" -> "koding")
  const selectedId = subFeature || '';

  const [state, setState] = useFeatureState(
    {
      prompt: '',
      result: null as string | null,
    },
    selectedId ? `prompt-enhancer-${selectedId}` : 'prompt-enhancer' // Use unique storage per sub-route
  );
  const { refreshProfile, profile } = useUserStore();

  const selected = kebutuhanOptions.find((opt) => opt.id === selectedId);

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error('No option selected');
      return await selected.apiCall(state.prompt);
    },
    onSuccess: async (data) => {
      if (data.success) {
        // Handle different response formats
        let resultText = '';

        if (typeof data.data === 'string') {
          resultText = data.data;
        } else if (data.data.enhanced_prompt) {
          resultText = data.data.enhanced_prompt;
        } else if (data.data.result) {
          resultText = data.data.result;
        } else if (data.data.prompt) {
          resultText = data.data.prompt;
        } else if (data.data.improved_prompt) {
          resultText = data.data.improved_prompt;
        } else {
          // If no recognized field, show error message
          console.error('Unexpected response format:', data.data);
          toast.error('Format response tidak dikenali. Silakan coba lagi.');
          return;
        }

        setState((prev) => ({ ...prev, result: resultText }));
        await refreshProfile();
      }
    },
    onError: (error: {
      error?: string;
      current_balance?: number;
      need_to_purchase?: number;
    }) => {
      console.error('Prompt Enhancer error:', error);
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else {
        toast.error(error.error || 'Terjadi kesalahan saat enhance prompt');
      }
    },
  });

  const handleCopy = () => {
    if (state.result) {
      navigator.clipboard.writeText(state.result);
      toast.success('Hasil berhasil disalin!');
    }
  };

  const handleRegenerate = () => {
    generateMutation.mutate();
  };

  const handleReset = () => {
    const storageKey = selectedId
      ? `prompt-enhancer-${selectedId}`
      : 'prompt-enhancer';
    sessionStorage.removeItem(`feature_state_${storageKey}`);
    setState({ prompt: '', result: null });
  };

  const handleBackToSelection = () => {
    const storageKey = selectedId
      ? `prompt-enhancer-${selectedId}`
      : 'prompt-enhancer';
    sessionStorage.removeItem(`feature_state_${storageKey}`);
    navigate('/dashboard/features/prompt-enhancer');
  };

  if (selected) {
    const Icon = selected.icon;
    return (
      <div className="space-y-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={handleBackToSelection}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali Pilih Kebutuhan
        </Button>

        <div className="text-center space-y-3">
          <Icon className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold">{selected.header}</h2>
          <p className="text-muted-foreground">{selected.subheader}</p>
        </div>

        <Textarea
          placeholder={selected.placeholder}
          value={state.prompt}
          onChange={(e) =>
            setState((prev) => ({ ...prev, prompt: e.target.value }))
          }
          rows={8}
          className="text-base"
        />

        <Button
          className="w-full"
          size="lg"
          disabled={!state.prompt.trim() || generateMutation.isPending}
          onClick={() => generateMutation.mutate()}
        >
          <Icon className="w-4 h-4" />
          Upgrade Prompt
        </Button>

        {generateMutation.isPending && (
          <LoadingStateCard message="ElevAI sedang meng-upgrade prompt Anda..." />
        )}

        {state.result && !generateMutation.isPending && (
          <GeneratedResultCard
            result={state.result}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            onReset={handleReset}
            isRegenerating={generateMutation.isPending}
            requiredTokens={1}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Pilih Kebutuhan Anda
        </h2>
        <p className="text-muted-foreground">
          Setiap pilihan akan menerapkan metode prompting yang berbeda untuk
          hasil maksimal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kebutuhanOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className="p-6 cursor-pointer hover:border-primary/50 hover:shadow-glow transition-smooth group"
              onClick={() =>
                navigate(`/dashboard/features/prompt-enhancer/${option.id}`)
              }
            >
              <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-smooth" />
              <h3 className="text-lg font-bold mb-2">{option.header}</h3>
              <p className="text-sm text-muted-foreground">
                {option.subheader}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
