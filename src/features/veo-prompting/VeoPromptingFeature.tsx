import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Video } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { dailyToolsApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import {
  GeneratedResultCard,
  LoadingStateCard,
} from '@/components/GeneratedResultCard';
import { useFeatureState } from '@/hooks/useFeatureState';

const waktuOptions = [
  'Pagi',
  'Siang',
  'Sore',
  'Malam',
  'Senja (Golden Hour)',
  'Fajar (Blue Hour)',
];

interface VeoFormData {
  subjek: string;
  aksi: string;
  ekspresi: string;
  lokasi: string;
  waktu: string;
  pencahayaan: string;
  gerakanKamera: string;
  gaya: string;
  suasana: string;
  suara: string;
  dialog: string;
  detail: string;
}

interface VeoState {
  formData: VeoFormData;
  result: string | null;
}

export const VeoPromptingFeature = () => {
  const [state, setState] = useFeatureState<VeoState>(
    {
      formData: {
        subjek: '',
        aksi: '',
        ekspresi: '',
        lokasi: '',
        waktu: 'Pagi',
        pencahayaan: '',
        gerakanKamera: '',
        gaya: '',
        suasana: '',
        suara: '',
        dialog: '',
        detail: '',
      },
      result: null,
    },
    'veo-prompting'
  );
  const { refreshProfile } = useUserStore();

  const { formData, result } = state;
  const setFormData = (value: VeoFormData) =>
    setState({ ...state, formData: value });
  const setResult = (value: string | null) =>
    setState({ ...state, result: value });

  const isValid = formData.subjek && formData.aksi && formData.lokasi;

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await dailyToolsApi.promptVeo({
        subjekUtama: formData.subjek,
        aksiKegiatan: formData.aksi,
        ekspresiEmosi: formData.ekspresi,
        lokasiTempat: formData.lokasi,
        waktu: formData.waktu,
        pencahayaan: formData.pencahayaan,
        gerakanKamera: formData.gerakanKamera,
        gayaVideo: formData.gaya,
        suasanaVideo: formData.suasana,
        suaraMusik: formData.suara,
        dialog: formData.dialog,
        detailTambahan: formData.detail,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        // Handle different response formats
        let resultText = '';

        if (typeof data.data === 'string') {
          resultText = data.data;
        } else if (data.data.prompt) {
          resultText = data.data.prompt;
        } else if (data.data.result) {
          resultText = data.data.result;
        } else if (data.data.enhanced_prompt) {
          resultText = data.data.enhanced_prompt;
        } else if (data.data.video_prompt) {
          resultText = data.data.video_prompt;
        } else if (data.data.veo_prompt) {
          resultText = data.data.veo_prompt;
        } else {
          // If no recognized field, show error message
          console.error('Unexpected response format:', data.data);
          toast.error('Format response tidak dikenali. Silakan coba lagi.');
          return;
        }

        setResult(resultText);
        refreshProfile();
      }
    },
    onError: (error: {
      error?: string;
      current_balance?: number;
      need_to_purchase?: number;
    }) => {
      console.error('Veo Prompting error:', error);
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else {
        toast.error(error.error || 'Terjadi kesalahan saat generate prompt');
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
      formData: {
        subjek: '',
        aksi: '',
        ekspresi: '',
        lokasi: '',
        waktu: 'Pagi',
        pencahayaan: '',
        gerakanKamera: '',
        gaya: '',
        suasana: '',
        suara: '',
        dialog: '',
        detail: '',
      },
      result: null,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Generator Prompt Veo
        </h2>
        <p className="text-muted-foreground">
          Isi detail di bawah ini untuk membuat prompt video yang deskriptif
          untuk AI seperti Google Veo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Subjek Utama</Label>
          <Input
            placeholder="Contoh: Seekor kucing oranye, astronot"
            value={formData.subjek}
            onChange={(e) =>
              setFormData({ ...formData, subjek: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Aksi / Kegiatan</Label>
          <Input
            placeholder="Contoh: sedang bermain piano, berlari di padang bunga"
            value={formData.aksi}
            onChange={(e) => setFormData({ ...formData, aksi: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Ekspresi / Emosi</Label>
          <Input
            placeholder="Senang, terkejut, melamun"
            value={formData.ekspresi}
            onChange={(e) =>
              setFormData({ ...formData, ekspresi: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Lokasi / Tempat</Label>
          <Input
            placeholder="Perpustakaan tua, planet Mars"
            value={formData.lokasi}
            onChange={(e) =>
              setFormData({ ...formData, lokasi: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Waktu</Label>
          <Select
            value={formData.waktu}
            onValueChange={(value) =>
              setFormData({ ...formData, waktu: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {waktuOptions.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pencahayaan</Label>
          <Input
            placeholder="Dramatis, lembut, neon"
            value={formData.pencahayaan}
            onChange={(e) =>
              setFormData({ ...formData, pencahayaan: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Gerakan Kamera</Label>
          <Input
            placeholder="Panning shot, zoom in, drone shot"
            value={formData.gerakanKamera}
            onChange={(e) =>
              setFormData({ ...formData, gerakanKamera: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Gaya Video</Label>
          <Input
            placeholder="Cinematic, timelapse, rekaman arsip"
            value={formData.gaya}
            onChange={(e) => setFormData({ ...formData, gaya: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Suasana Video</Label>
          <Input
            placeholder="Misterius, ceria, nostalgia"
            value={formData.suasana}
            onChange={(e) =>
              setFormData({ ...formData, suasana: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Suara / Musik</Label>
          <Input
            placeholder="Musik orkestra, suara alam"
            value={formData.suara}
            onChange={(e) =>
              setFormData({ ...formData, suara: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Kalimat yang Diucapkan (Dialog)</Label>
          <Input
            placeholder="Contoh: 'Kita berhasil!'"
            value={formData.dialog}
            onChange={(e) =>
              setFormData({ ...formData, dialog: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Detail Tambahan</Label>
        <Textarea
          placeholder="Contoh: sangat detail, 8K, photorealistic, fokus pada detail mata"
          value={formData.detail}
          onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
          rows={4}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!isValid || generateMutation.isPending}
        onClick={() => generateMutation.mutate()}
      >
        <Video className="w-4 h-4" />
        Buat Prompt
      </Button>

      {generateMutation.isPending && (
        <LoadingStateCard message="ElevAI sedang menggenerate prompt Veo..." />
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
