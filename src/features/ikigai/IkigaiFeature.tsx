import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  User,
  GraduationCap,
  Calendar,
  Building,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Copy,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useMutation } from '@tanstack/react-query';
import { studentDevelopmentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import { generatePDF } from '@/lib/pdf-generator';
import { useStepFeatureState } from '@/hooks/useFeatureState';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  nama: string;
  jurusan: string;
  semester: string;
  universitas: string;
  karirSesuai: 'ya' | 'tidak' | '';
  mbti: string;
  via1: string;
  via2: string;
  via3: string;
  career1: string;
  career2: string;
  career3: string;
  ikigaiSpot: string;
  sliceOfLife: string;
}

interface Stage1Response {
  ikigai_spots: Array<{ title: string; description: string }>;
  life_purposes: Array<{ statement: string }>;
}

interface IkigaiState {
  step: Step;
  formData: FormData;
  stage1Data: Stage1Response | null;
  finalResult: {
    analysis: string;
    stage1_data: unknown;
  } | null;
}

export const IkigaiFeature = () => {
  // Step validation function
  const validateStep = (step: number, state: IkigaiState): boolean => {
    switch (step) {
      case 1:
        return true; // Step 1 always accessible
      case 2:
        // Step 2 requires basic info from step 1
        return !!(
          state.formData.nama &&
          state.formData.jurusan &&
          state.formData.semester &&
          state.formData.universitas &&
          state.formData.karirSesuai
        );
      case 3:
        // Step 3 requires step 1 data (same as step 2)
        return !!(
          state.formData.nama &&
          state.formData.jurusan &&
          state.formData.semester &&
          state.formData.universitas &&
          state.formData.karirSesuai
        );
      case 4:
        // Step 4 requires stage1Data (analysis completed)
        return !!state.stage1Data;
      case 5:
        // Step 5 requires finalResult
        return !!state.finalResult;
      default:
        return false;
    }
  };

  const [state, setState, setStep] = useStepFeatureState<IkigaiState>(
    {
      step: 1,
      formData: {
        nama: '',
        jurusan: '',
        semester: '',
        universitas: '',
        karirSesuai: '',
        mbti: '',
        via1: '',
        via2: '',
        via3: '',
        career1: '',
        career2: '',
        career3: '',
        ikigaiSpot: '',
        sliceOfLife: '',
      },
      stage1Data: null,
      finalResult: null,
    },
    'ikigai',
    validateStep
  );
  const { refreshProfile, profile } = useUserStore();

  const { step, formData, stage1Data, finalResult } = state;
  const setFormData = (data: FormData) =>
    setState({ ...state, formData: data });
  const setStage1Data = (data: Stage1Response | null) =>
    setState({ ...state, stage1Data: data });
  const setFinalResult = (
    data: { analysis: string; stage1_data: unknown } | null
  ) => setState({ ...state, finalResult: data });

  const isStep1Valid =
    formData.nama &&
    formData.jurusan &&
    formData.semester &&
    formData.universitas &&
    formData.karirSesuai;
  const isStep3Valid =
    formData.mbti &&
    formData.via1 &&
    formData.via2 &&
    formData.via3 &&
    formData.career1 &&
    formData.career2 &&
    formData.career3;
  const isStep4Valid = formData.ikigaiSpot && formData.sliceOfLife;

  const stage1Mutation = useMutation({
    mutationFn: async () => {
      return await studentDevelopmentApi.ikigaiStage1({
        nama: formData.nama,
        jurusan: formData.jurusan,
        semester: parseInt(formData.semester),
        universitas: formData.universitas,
        karirSesuaiJurusan:
          formData.karirSesuai === 'ya' ? 'ya_sesuai' : 'tidak_explore',
        mbtiType: formData.mbti,
        viaStrengths: [formData.via1, formData.via2, formData.via3],
        careerRoles: [formData.career1, formData.career2, formData.career3],
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setStage1Data(data.data);
        setStep(4);
        refreshProfile();
      }
    },
    onError: (error: unknown) => {
      console.error('Ikigai Stage 1 error:', error);
      // Handle different error formats
      const err = error as {
        response?: { data?: { error?: unknown } };
        error?: string;
        message?: string;
        current_balance?: number;
        need_to_purchase?: number;
      };

      let errorMessage = 'Terjadi kesalahan saat menganalisis';

      if (err?.response?.data?.error) {
        const apiError = err.response.data.error;
        if (typeof apiError === 'string') {
          errorMessage = apiError;
        } else if (
          apiError &&
          typeof apiError === 'object' &&
          'message' in apiError
        ) {
          errorMessage = String(apiError.message);
        }
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      if (
        err?.error === 'Insufficient tokens' ||
        errorMessage.includes('Insufficient tokens')
      ) {
        toast.error(
          `Token anda kurang (${err.current_balance || 0}). Butuh ${
            err.need_to_purchase || 0
          } token lagi.`
        );
      } else if (
        err?.error === 'Premium subscription required' ||
        errorMessage.includes('Premium subscription')
      ) {
        toast.error('Fitur ini memerlukan langganan premium');
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const finalMutation = useMutation({
    mutationFn: async () => {
      return await studentDevelopmentApi.ikigaiFinal({
        stage1Data: {
          nama: formData.nama,
          jurusan: formData.jurusan,
          semester: parseInt(formData.semester),
          universitas: formData.universitas,
          karirSesuaiJurusan:
            formData.karirSesuai === 'ya' ? 'ya_sesuai' : 'tidak_explore',
          mbtiType: formData.mbti,
          viaStrengths: [formData.via1, formData.via2, formData.via3],
          careerRoles: [formData.career1, formData.career2, formData.career3],
        },
        selectedIkigaiSpot: formData.ikigaiSpot,
        selectedSliceOfLife: formData.sliceOfLife,
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        setFinalResult(data.data);
        setStep(5);
        await refreshProfile();
      }
    },
    onError: (error: unknown) => {
      console.error('Ikigai Final error:', error);
      // Handle different error formats
      const err = error as {
        response?: { data?: { error?: unknown } };
        error?: string;
        message?: string;
        current_balance?: number;
        need_to_purchase?: number;
      };

      let errorMessage = 'Terjadi kesalahan saat menganalisis';

      if (err?.response?.data?.error) {
        const apiError = err.response.data.error;
        if (typeof apiError === 'string') {
          errorMessage = apiError;
        } else if (
          apiError &&
          typeof apiError === 'object' &&
          'message' in apiError
        ) {
          errorMessage = String(apiError.message);
        }
      } else if (err?.error) {
        errorMessage = err.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      if (
        err?.error === 'Insufficient tokens' ||
        errorMessage.includes('Insufficient tokens')
      ) {
        toast.error(
          `Token anda kurang (${err.current_balance || 0}). Butuh ${
            err.need_to_purchase || 0
          } token lagi.`
        );
      } else if (
        err?.error === 'Premium subscription required' ||
        errorMessage.includes('Premium subscription')
      ) {
        toast.error('Fitur ini memerlukan langganan premium');
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleNext = async () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && isStep3Valid) {
      stage1Mutation.mutate();
    } else if (step === 4 && isStep4Valid) {
      finalMutation.mutate();
    }
  };

  const handleDownloadPDF = () => {
    if (!finalResult) {
      toast.error('Tidak ada hasil untuk didownload');
      return;
    }

    try {
      const doc = generatePDF({
        title: 'Analisis Sweet Spot Career & Business',
        subtitle: 'Powered by ElevAI',
        content: finalResult.analysis,
        userData: {
          Nama: formData.nama,
          Jurusan: formData.jurusan,
          Semester: formData.semester,
          Universitas: formData.universitas,
          'Karir Sesuai Jurusan':
            formData.karirSesuai === 'ya' ? 'Sesuai Jurusan' : 'Eksplorasi',
          'MBTI Type': formData.mbti,
          'VIA Strengths': `${formData.via1}, ${formData.via2}, ${formData.via3}`,
          'Career Roles': `${formData.career1}, ${formData.career2}, ${formData.career3}`,
          'Ikigai Spot': formData.ikigaiSpot,
          'Slice of Life': formData.sliceOfLife,
        },
      });

      doc.save(`Ikigai-Analysis-${formData.nama}-${new Date().getTime()}.pdf`);
      toast.success('PDF berhasil didownload!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF');
    }
  };

  if (step === 5 && finalResult) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Hasil Ikigai Analysis
          </h2>
          <p className="text-muted-foreground">
            Berikut adalah strategi karier & bisnis yang dipersonalisasi
            untukmu.
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
          <span>Hasil Analisis Ikigai & Strategi Karier:</span>
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
                <strong>Nama:</strong> {formData.nama}
              </p>
              <p>
                <strong>Jurusan:</strong> {formData.jurusan}
              </p>
              <p>
                <strong>Semester:</strong> {formData.semester}
              </p>
              <p>
                <strong>Universitas:</strong> {formData.universitas}
              </p>
            </div>
            <div>
              <p>
                <strong>Karir Sesuai:</strong>{' '}
                {formData.karirSesuai === 'ya'
                  ? 'Sesuai Jurusan'
                  : 'Eksplorasi'}
              </p>
              <p>
                <strong>VIA Strengths:</strong> {formData.via1}, {formData.via2}
                , {formData.via3}
              </p>
              <p>
                <strong>MBTI:</strong> {formData.mbti}
              </p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Ikigai Spot yang Dipilih:</strong>
              </p>
              <p className="text-muted-foreground">{formData.ikigaiSpot}</p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Slice of Life yang Dipilih:</strong>
              </p>
              <p className="text-muted-foreground">{formData.sliceOfLife}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <MarkdownRenderer>{finalResult.analysis}</MarkdownRenderer>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Clear session storage first
            sessionStorage.removeItem('feature_state_ikigai');
            // Then reset state completely
            setState({
              step: 1,
              formData: {
                nama: '',
                jurusan: '',
                semester: '',
                universitas: '',
                karirSesuai: '',
                mbti: '',
                via1: '',
                via2: '',
                via3: '',
                career1: '',
                career2: '',
                career3: '',
                ikigaiSpot: '',
                sliceOfLife: '',
              },
              stage1Data: null,
              finalResult: null,
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
      {step === 1 && (
        <>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Step 1: Data Diri
            </h2>
            <p className="text-muted-foreground">
              Isi data dirimu sebagai fondasi untuk pemetaan Ikigai yang akurat
              oleh AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Kamu
              </Label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Jurusan
              </Label>
              <Input
                placeholder="Contoh: Ilmu Komputer"
                value={formData.jurusan}
                onChange={(e) =>
                  setFormData({ ...formData, jurusan: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Semester Saat Ini
              </Label>
              <Input
                type="number"
                placeholder="Gunakan angka, contoh: 4"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Universitas
              </Label>
              <Input
                placeholder="Nama universitas anda"
                value={formData.universitas}
                onChange={(e) =>
                  setFormData({ ...formData, universitas: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ingin Berkarir Sesuai Jurusan?</Label>
            <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, karirSesuai: 'ya' })}
                className={`py-3 px-4 transition-smooth ${
                  formData.karirSesuai === 'ya'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                Ya, Sesuai
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, karirSesuai: 'tidak' })
                }
                className={`py-3 px-4 border-l border-border transition-smooth ${
                  formData.karirSesuai === 'tidak'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                Tidak, Ingin Explore
              </button>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!isStep1Valid}
            onClick={handleNext}
          >
            Lanjut ke Tahap Tes
            <ArrowRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Step 2: Lakukan Tes Kepribadian
            </h2>
            <p className="text-muted-foreground">
              Klik tombol-tombol di bawah ini untuk mengikuti 3 tes. Setelah
              selesai, lanjut ke langkah berikutnya untuk input hasilnya.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 hover:border-primary/50 transition-smooth"
              onClick={() =>
                window.open('https://boo.world/16-personality-test', '_blank')
              }
            >
              <span className="text-2xl mr-3">🧠</span>
              <span className="text-lg">MBTI Test</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 hover:border-primary/50 transition-smooth"
              onClick={() =>
                window.open(
                  'https://www.viacharacter.org/account/register',
                  '_blank'
                )
              }
            >
              <span className="text-2xl mr-3">💪</span>
              <span className="text-lg">VIA Character Test</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 hover:border-primary/50 transition-smooth"
              onClick={() =>
                window.open(
                  'https://www.careerexplorer.com/assessments',
                  '_blank'
                )
              }
            >
              <span className="text-2xl mr-3">🚀</span>
              <span className="text-lg">Career Explorer Test</span>
            </Button>
          </div>

          <Button className="w-full" size="lg" onClick={handleNext}>
            <span className="text-xl mr-2">✅</span>
            Saya sudah Selesai Tes → Lanjut Input Hasil
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Step 3: AI Ikigai Analyzer
            </h2>
            <p className="text-muted-foreground">
              Masukkan hasil tes kepribadian Anda untuk mendapatkan pemetaan
              awal Ikigai yang dipersonalisasi oleh AI.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                MBTI Type (4 Huruf Kapital)
              </Label>
              <Input
                placeholder="Contoh: INFP"
                maxLength={4}
                value={formData.mbti}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mbti: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Top 3 VIA Character Strengths
                </Label>
                <Input
                  placeholder="VIA Strength #1"
                  value={formData.via1}
                  onChange={(e) =>
                    setFormData({ ...formData, via1: e.target.value })
                  }
                />
                <Input
                  placeholder="VIA Strength #2"
                  value={formData.via2}
                  onChange={(e) =>
                    setFormData({ ...formData, via2: e.target.value })
                  }
                />
                <Input
                  placeholder="VIA Strength #3"
                  value={formData.via3}
                  onChange={(e) =>
                    setFormData({ ...formData, via3: e.target.value })
                  }
                />
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Top 3 Career Explorer Roles
                </Label>
                <Input
                  placeholder="Career Role #1"
                  value={formData.career1}
                  onChange={(e) =>
                    setFormData({ ...formData, career1: e.target.value })
                  }
                />
                <Input
                  placeholder="Career Role #2"
                  value={formData.career2}
                  onChange={(e) =>
                    setFormData({ ...formData, career2: e.target.value })
                  }
                />
                <Input
                  placeholder="Career Role #3"
                  value={formData.career3}
                  onChange={(e) =>
                    setFormData({ ...formData, career3: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!isStep3Valid || stage1Mutation.isPending}
            onClick={handleNext}
          >
            {stage1Mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Analisis & Lanjut
              </>
            )}
          </Button>
        </>
      )}

      {step === 4 && stage1Data && (
        <>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Step 4: Final Ikigai Analysis
            </h2>
            <p className="text-muted-foreground">
              Pilih kombinasi terbaikmu untuk mendapatkan strategi karier dan
              bisnis yang paling relevan dari AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Pilih Ikigai Spot</Label>
              {stage1Data.ikigai_spots && stage1Data.ikigai_spots.length > 0 ? (
                stage1Data.ikigai_spots.map((spot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        ikigaiSpot: `${spot.title || ''}: ${
                          spot.description || ''
                        }`,
                      })
                    }
                    className={`w-full p-4 text-left text-sm rounded-md border transition-smooth ${
                      formData.ikigaiSpot.includes(spot.title || '')
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <strong>{spot.title || `Option ${idx + 1}`}:</strong>{' '}
                    {spot.description || 'No description available'}
                  </button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-4 border border-border rounded-md">
                  Tidak ada data ikigai spots tersedia. Silakan coba lagi.
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Pilih Slice of Life Purpose</Label>
              {stage1Data.life_purposes &&
              stage1Data.life_purposes.length > 0 ? (
                stage1Data.life_purposes.map((purpose, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        sliceOfLife: purpose.statement || '',
                      })
                    }
                    className={`w-full p-4 text-left text-sm rounded-md border transition-smooth ${
                      formData.sliceOfLife === (purpose.statement || '')
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    {purpose.statement || `Option ${idx + 1}`}
                  </button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-4 border border-border rounded-md">
                  Tidak ada data life purposes tersedia. Silakan coba lagi.
                </div>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!isStep4Valid || finalMutation.isPending}
            onClick={handleNext}
          >
            {finalMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menganalisis Sweetspot...
              </>
            ) : (
              'Analisis Sweetspot Saya'
            )}
          </Button>
        </>
      )}
    </div>
  );
};
