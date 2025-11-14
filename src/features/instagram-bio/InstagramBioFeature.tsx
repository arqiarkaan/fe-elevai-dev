import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import {
  Upload,
  Loader2,
  Sparkles,
  Copy,
  Trash2,
  Plus,
  CheckCircle2,
  Instagram,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { personalBrandingApi } from '@/lib/api';
import { useUserStore } from '@/lib/user-store';
import { useState } from 'react';

import { useStepFeatureState } from '@/hooks/useFeatureState';
import { showTokenConsumptionToast } from '@/utils/token-toast';

type Step = 1 | 2 | 3;

interface FormData {
  tujuanUtama: string;
  tujuanLainnya: string;
  gayaTulisan: string;
  gayaLainnya: string;
  siapa: string;
  targetAudiens: string;
  pencapaian: string[];
  cta: string;
  punyaHashtag: 'ya' | 'tidak' | '';
  hashtag: string;
}

interface InstagramBioState {
  step: Step;
  uploadedImage: string | null;
  bioContent: string;
  analisisAwal: string;
  generatedBios: string[];
  formData: FormData;
}

export const InstagramBioFeature = () => {
  // Step validation function
  const validateStep = (step: number, state: InstagramBioState): boolean => {
    switch (step) {
      case 1:
        return true; // Step 1 always accessible
      case 2:
        // Step 2 requires bioContent and analisisAwal (uploaded & analyzed)
        return !!(state.bioContent && state.analisisAwal);
      case 3:
        // Step 3 requires generatedBios (generation completed)
        return state.generatedBios.length > 0;
      default:
        return false;
    }
  };

  const [state, setState, setStep] = useStepFeatureState<InstagramBioState>(
    {
      step: 1,
      uploadedImage: null,
      bioContent: '',
      analisisAwal: '',
      generatedBios: [],
      formData: {
        tujuanUtama: '',
        tujuanLainnya: '',
        gayaTulisan: '',
        gayaLainnya: '',
        siapa: '',
        targetAudiens: '',
        pencapaian: [''],
        cta: '',
        punyaHashtag: '',
        hashtag: '',
      },
    },
    'instagram-bio',
    validateStep
  );
  const { refreshProfile, profile } = useUserStore();

  // Use local state for File object (cannot be serialized to localStorage)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    step,
    uploadedImage,
    bioContent,
    analisisAwal,
    generatedBios,
    formData,
  } = state;
  const setUploadedImage = (data: string | null) =>
    setState({ ...state, uploadedImage: data });
  const setBioContent = (data: string) =>
    setState({ ...state, bioContent: data });
  const setAnalisisAwal = (data: string) =>
    setState({ ...state, analisisAwal: data });
  const setGeneratedBios = (data: string[]) =>
    setState({ ...state, generatedBios: data });
  const setFormData = (data: FormData) =>
    setState({ ...state, formData: data });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return await personalBrandingApi.instagramBioUploadImage(file);
    },
    onSuccess: (data) => {
      if (data.success) {
        setBioContent(data.data.bio_text);
        analyzeMutation.mutate(data.data.bio_text);
      }
    },
    onError: (error: { error?: string }) => {
      toast.error(error.error || 'Gagal mengupload gambar');
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (content: string) => {
      return await personalBrandingApi.instagramBioAnalyze(content);
    },
    onSuccess: (data) => {
      if (data.success) {
        setAnalisisAwal(data.data.analysis);
        setStep(2);
      }
    },
    onError: (error: { error?: string }) => {
      toast.error(error.error || 'Gagal menganalisis bio');
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await personalBrandingApi.instagramBioGenerate({
        bioContent,
        analisisAwal,
        tujuanUtama:
          formData.tujuanUtama === 'lainnya'
            ? formData.tujuanLainnya
            : formData.tujuanUtama,
        gayaTulisan:
          formData.gayaTulisan === 'lainnya'
            ? formData.gayaLainnya
            : formData.gayaTulisan,
        siapaKamu: formData.siapa,
        targetAudiens: formData.targetAudiens,
        pencapaian: formData.pencapaian.filter((p) => p.trim() !== ''),
        callToAction: formData.cta,
        ...(formData.punyaHashtag === 'ya' && formData.hashtag
          ? { hashtag: formData.hashtag }
          : {}),
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        // Save token balance BEFORE refresh
        const previousBalance = profile?.tokens || 0;

        setGeneratedBios(data.data.bios);
        setStep(3);
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
      if (error.error === 'Insufficient tokens') {
        toast.error(
          `Token anda kurang (${error.current_balance}). Butuh ${error.need_to_purchase} token lagi.`
        );
      } else if (error.error === 'Premium subscription required') {
        toast.error('Fitur ini memerlukan langganan premium');
      } else {
        toast.error(error.error || 'Terjadi kesalahan saat generate bio');
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Set the file first
      setUploadedFile(file);

      // Then read and display the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Harap pilih file gambar yang valid (JPG, PNG, GIF, dll)');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Set the file first
      setUploadedFile(file);

      // Then read and display the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Harap drop file gambar yang valid (JPG, PNG, GIF, dll)');
    }
  };

  const handleAnalyze = () => {
    if (!uploadedFile) {
      toast.error('Harap upload gambar bio Instagram terlebih dahulu');
      return;
    }
    uploadMutation.mutate(uploadedFile);
  };

  const addPencapaian = () => {
    if (formData.pencapaian.length < 3) {
      setFormData({
        ...formData,
        pencapaian: [...formData.pencapaian, ''],
      });
    }
  };

  const removePencapaian = (index: number) => {
    const newPencapaian = formData.pencapaian.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      pencapaian: newPencapaian.length > 0 ? newPencapaian : [''],
    });
  };

  const updatePencapaian = (index: number, value: string) => {
    const newPencapaian = [...formData.pencapaian];
    newPencapaian[index] = value;
    setFormData({
      ...formData,
      pencapaian: newPencapaian,
    });
  };

  const siapaWordCount = formData.siapa.trim().split(/\s+/).length;
  const isSiapaValid =
    formData.siapa.trim() !== '' && siapaWordCount >= 3 && siapaWordCount <= 5;

  const isStep2Valid =
    formData.tujuanUtama &&
    (formData.tujuanUtama !== 'lainnya' || formData.tujuanLainnya) &&
    formData.gayaTulisan &&
    (formData.gayaTulisan !== 'lainnya' || formData.gayaLainnya) &&
    isSiapaValid &&
    formData.targetAudiens &&
    formData.cta &&
    formData.punyaHashtag &&
    formData.pencapaian.some((p) => p.trim() !== '');

  const handleCopyBio = (bio: string) => {
    navigator.clipboard.writeText(bio);
    toast.success('Bio berhasil disalin!');
  };

  const handleAnalyzeAnother = () => {
    // Clear session storage first
    sessionStorage.removeItem('feature_state_instagram-bio');

    // Reset local state
    setUploadedFile(null);

    // Reset all persisted state in one call
    setState({
      step: 1,
      uploadedImage: null,
      bioContent: '',
      analisisAwal: '',
      generatedBios: [],
      formData: {
        tujuanUtama: '',
        tujuanLainnya: '',
        gayaTulisan: '',
        gayaLainnya: '',
        siapa: '',
        targetAudiens: '',
        pencapaian: [''],
        cta: '',
        punyaHashtag: '',
        hashtag: '',
      },
    });
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center gap-4 mb-8">
      {[
        { num: 1, label: 'Analisis' },
        { num: 2, label: 'Kustomisasi' },
        { num: 3, label: 'Hasil' },
      ].map((item) => (
        <div key={item.num} className="flex flex-col items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
              step >= item.num
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step > item.num ? <CheckCircle2 className="w-6 h-6" /> : item.num}
          </div>
          <span
            className={`text-sm font-medium ${
              step >= item.num ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  if (step === 1) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Instagram className="w-8 h-8 text-primary" />
              <span>AI Instagram Bio Analyzer</span>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Paste atau upload screenshot bio IG Anda, biarkan AI memberi masukan
            dan membantu Anda membuat versi yang lebih baik.
          </p>
        </div>

        <Card className="p-12 gradient-card border-border/50">
          <div className="space-y-6">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-all cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-105'
                  : uploadedImage
                  ? 'border-green-500 bg-green-500/5'
                  : 'border-border/50 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadedImage ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded bio"
                    className="max-w-md max-h-96 rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Gambar berhasil diupload - Klik untuk ganti
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-primary mb-4" />
                  <span className="text-lg font-medium mb-2">
                    {isDragging
                      ? 'Drop gambar di sini'
                      : 'Drag & Drop atau Klik untuk upload'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Format: JPG, PNG, GIF, atau format gambar lainnya
                  </span>
                </>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={
                uploadMutation.isPending ||
                analyzeMutation.isPending ||
                !uploadedFile
              }
              className="w-full"
              size="lg"
            >
              {uploadMutation.isPending || analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadMutation.isPending
                    ? 'Mengupload...'
                    : 'Menganalisis...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analisis Bio Saya
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">
            Step 2: Sempurnakan Bio Anda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI telah menganalisis bio Anda. Sekarang, lengkapi detail ini untuk
            membuat versi final yang lebih powerful.
          </p>
        </div>

        <Card className="p-6 gradient-card border-border/50 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="w-full">
              <h3 className="font-bold text-lg mb-2">Hasil Analisis Awal</h3>
              <MarkdownRenderer>{analisisAwal}</MarkdownRenderer>
            </div>
          </div>
        </Card>

        <Card className="p-6 gradient-card border-border/50">
          <div className="space-y-6">
            {/* Row 1: 4 fields horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Tujuan Utama Bio</Label>
                <Select
                  value={formData.tujuanUtama}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tujuanUtama: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Pilih Tujuan --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal-branding">
                      Personal Branding
                    </SelectItem>
                    <SelectItem value="edu-creator">Edu Creator</SelectItem>
                    <SelectItem value="freelance">
                      Freelance/Portofolio
                    </SelectItem>
                    <SelectItem value="community">Community/NGO</SelectItem>
                    <SelectItem value="mentor">Mentor/Coach</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {formData.tujuanUtama === 'lainnya' && (
                  <Input
                    placeholder="Sebutkan tujuan lainnya..."
                    value={formData.tujuanLainnya}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tujuanLainnya: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Gaya Tulisan</Label>
                <Select
                  value={formData.gayaTulisan}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gayaTulisan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Pilih Gaya --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profesional">Profesional</SelectItem>
                    <SelectItem value="santai">Santai</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="inspiratif">Inspiratif</SelectItem>
                    <SelectItem value="gen-z">Gen Z</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {formData.gayaTulisan === 'lainnya' && (
                  <Input
                    placeholder="Sebutkan gaya lainnya..."
                    value={formData.gayaLainnya}
                    onChange={(e) =>
                      setFormData({ ...formData, gayaLainnya: e.target.value })
                    }
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Siapa Kamu? (3-5 kata)</Label>
                <Input
                  placeholder="Contoh: Mentor Mahasiswa"
                  value={formData.siapa}
                  onChange={(e) =>
                    setFormData({ ...formData, siapa: e.target.value })
                  }
                />
                {formData.siapa && (
                  <p
                    className={`text-xs ${
                      formData.siapa.trim().split(/\s+/).length >= 3 &&
                      formData.siapa.trim().split(/\s+/).length <= 5
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {formData.siapa.trim().split(/\s+/).length} kata (min 3, max
                    5)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Siapa Target Audiensmu?</Label>
                <Input
                  placeholder="Contoh: Fresh Graduate"
                  value={formData.targetAudiens}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudiens: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Pencapaian / Kredibilitas */}
            <div className="space-y-3">
              <Label>Pencapaian / Kredibilitas (Max 3)</Label>
              {formData.pencapaian.map((pencapaian, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Pencapaian #${index + 1}`}
                    value={pencapaian}
                    onChange={(e) => updatePencapaian(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.pencapaian.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removePencapaian(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.pencapaian.length < 3 && (
                <Button
                  variant="outline"
                  onClick={addPencapaian}
                  className="w-full"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Pencapaian
                </Button>
              )}
            </div>

            {/* CTA */}
            <div className="space-y-2">
              <Label>Call to Action (CTA)</Label>
              <Input
                placeholder="DM for collaboration"
                value={formData.cta}
                onChange={(e) =>
                  setFormData({ ...formData, cta: e.target.value })
                }
              />
            </div>

            {/* Hashtag */}
            <div className="space-y-3">
              <Label>Punya Hashtag Unik?</Label>
              <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, punyaHashtag: 'ya' })
                  }
                  className={`py-3 px-4 transition-smooth ${
                    formData.punyaHashtag === 'ya'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      punyaHashtag: 'tidak',
                      hashtag: '',
                    })
                  }
                  className={`py-3 px-4 border-l border-border transition-smooth ${
                    formData.punyaHashtag === 'tidak'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  Tidak
                </button>
              </div>
              {formData.punyaHashtag === 'ya' && (
                <div className="space-y-2">
                  <Label>Hashtag Pribadi Anda</Label>
                  <Input
                    placeholder="Contoh: #HalaMadrid"
                    value={formData.hashtag}
                    onChange={(e) =>
                      setFormData({ ...formData, hashtag: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !isStep2Valid}
              className="w-full"
              size="lg"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menggenerate...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Bio Final
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">
            Draf Bio Revolusioner Untuk Anda
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih, salin, dan gunakan bio favorit Anda. Jangan lupa sesuaikan
            link jika ada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedBios.map((bio, index) => (
            <Card
              key={index}
              className="p-4 sm:p-5 gradient-card border-border/50 relative group flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 flex-1">
                <p className="text-sm sm:text-lg font-medium whitespace-pre-line leading-tight flex-1 break-words">
                  {bio}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyBio(bio)}
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleAnalyzeAnother}
          className="w-full bg-primary hover:bg-primary/90 mt-6"
          size="lg"
        >
          <Sparkles className="w-5 h-5" />
          Analisis Bio Lain
        </Button>
      </div>
    );
  }

  return null;
};
