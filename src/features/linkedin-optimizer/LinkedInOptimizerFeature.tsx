import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Loader2,
  Linkedin,
  Copy,
  Trash2,
  Plus,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  targetOptimasi: 'headline' | 'summary' | '';
  namaLengkap: string;
  jurusan: string;
  semester: string;
  targetKarir: 'sesuai' | 'eksplorasi' | '';
  tujuanUtama: 'karir' | 'branding' | '';
  targetRole: string;
  identitasProfesional: string;
  pencapaian: string[];
  skills: string[];
}

export const LinkedInOptimizerFeature = () => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    targetOptimasi: '',
    namaLengkap: '',
    jurusan: '',
    semester: '',
    targetKarir: '',
    tujuanUtama: '',
    targetRole: '',
    identitasProfesional: '',
    pencapaian: [''],
    skills: [''],
  });

  const addItem = (field: 'pencapaian' | 'skills') => {
    if (formData[field].length < 3) {
      setFormData({
        ...formData,
        [field]: [...formData[field], ''],
      });
    }
  };

  const removeItem = (field: 'pencapaian' | 'skills', index: number) => {
    const newItems = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newItems.length > 0 ? newItems : [''],
    });
  };

  const updateItem = (
    field: 'pencapaian' | 'skills',
    index: number,
    value: string
  ) => {
    const newItems = [...formData[field]];
    newItems[index] = value;
    setFormData({
      ...formData,
      [field]: newItems,
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.targetOptimasi) {
      toast.error('Pilih target optimasi terlebih dahulu');
      return;
    }
    if (
      step === 2 &&
      (!formData.namaLengkap ||
        !formData.jurusan ||
        !formData.semester ||
        !formData.targetKarir)
    ) {
      toast.error('Lengkapi semua informasi dasar');
      return;
    }
    if (step === 3) {
      const words = formData.identitasProfesional
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      if (words.length < 4 || words.length > 7) {
        toast.error('Identitas Profesional harus 4-7 kata');
        return;
      }
      if (!formData.tujuanUtama || !formData.targetRole) {
        toast.error('Lengkapi fokus profil Anda');
        return;
      }
    }

    if (step === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(5);
      }, 2000);
      return;
    }

    setStep((prev) => (prev + 1) as Step);
  };

  const isStep2Valid =
    formData.namaLengkap &&
    formData.jurusan &&
    formData.semester &&
    formData.targetKarir;

  const isStep3Valid = () => {
    const words = formData.identitasProfesional
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    return (
      formData.tujuanUtama &&
      formData.targetRole &&
      words.length >= 4 &&
      words.length <= 7
    );
  };

  const isStep4Valid =
    formData.pencapaian.some((p) => p.trim() !== '') &&
    formData.skills.some((s) => s.trim() !== '');

  const handleBack = () => {
    setStep((prev) => (prev - 1) as Step);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Teks berhasil disalin!');
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-start gap-3 mb-8 overflow-x-auto pb-2 px-4 pt-4">
      {[
        { num: 1, label: 'Tipe Output' },
        { num: 2, label: 'Data Diri' },
        { num: 3, label: 'Fokus Profil' },
        { num: 4, label: 'Detail Pendukung' },
        { num: 5, label: 'Hasil Optimasi' },
      ].map((item) => (
        <div
          key={item.num}
          className="flex flex-col items-center gap-2 w-[100px] flex-shrink-0"
        >
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
            className={`text-xs font-medium text-center leading-tight ${
              step >= item.num ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  const generatedResults = {
    headline: `${formData.namaLengkap} | ${formData.identitasProfesional} | ${formData.targetRole} Enthusiast | ${formData.jurusan}`,
    summary: `Saya ${formData.namaLengkap}, mahasiswa ${
      formData.jurusan
    } semester ${formData.semester} yang passionate di bidang ${
      formData.targetRole
    }. Sebagai ${formData.identitasProfesional.toLowerCase()}, saya memiliki fokus kuat pada pengembangan keterampilan teknis dan soft skills yang relevan dengan industri.

🎯 Tujuan Profesional
Saya bercita-cita untuk ${
      formData.tujuanUtama === 'karir'
        ? 'membangun karir yang solid'
        : 'mengembangkan personal branding yang kuat'
    } di bidang ${
      formData.targetRole
    }. Dengan kombinasi latar belakang akademis dan pengalaman praktis, saya siap berkontribusi pada proyek-proyek inovatif.

🏆 Pencapaian & Pengalaman
${formData.pencapaian
  .filter((p) => p)
  .map((p, i) => `• ${p}`)
  .join('\n')}

💡 Keahlian Utama
${formData.skills
  .filter((s) => s)
  .map((s, i) => `• ${s}`)
  .join('\n')}

Saya selalu terbuka untuk peluang kolaborasi, mentoring, dan networking dengan profesional di industri. Mari terhubung dan berkembang bersama!

#${formData.targetRole.replace(/\s+/g, '')} #${formData.jurusan.replace(
      /\s+/g,
      ''
    )} #ProfessionalDevelopment`,
  };

  if (step === 5) {
    return (
      <div className="space-y-6">
        {renderStepIndicator()}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            <Linkedin className="w-8 h-8 text-primary" />
            LinkedIn Profile Optimizer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Buat Headline & Summary LinkedIn yang menarik perhatian rekruter
            dengan AI.
          </p>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">
            Hasil Optimasi Profil Anda
          </h3>
          <p className="text-muted-foreground">
            {formData.targetOptimasi === 'headline' ? 'Headline' : 'Summary'}{' '}
            LinkedIn yang telah dioptimasi untuk Anda
          </p>
        </div>

        <Card className="p-6 gradient-card border-border/50 relative group">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleCopy(
                formData.targetOptimasi === 'headline'
                  ? generatedResults.headline
                  : generatedResults.summary
              )
            }
            className="absolute top-4 right-4"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <div className="pr-12">
            <h4 className="font-bold text-lg mb-4 text-primary">
              {formData.targetOptimasi === 'headline'
                ? '📌 LinkedIn Headline'
                : '📝 LinkedIn Summary'}
            </h4>
            <div className="prose prose-sm max-w-none">
              {formData.targetOptimasi === 'headline' ? (
                <p className="text-lg font-medium">
                  {generatedResults.headline}
                </p>
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                  {generatedResults.summary}
                </pre>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-4 mt-6">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Tips Penggunaan
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-7">
              <li>• Sesuaikan tone dan gaya sesuai preferensi personal Anda</li>
              <li>• Tambahkan link portfolio atau project jika ada</li>
              <li>• Update secara berkala seiring perkembangan karir Anda</li>
              <li>• Gunakan keyword yang relevan dengan industri target</li>
            </ul>
          </Card>

          <Button
            onClick={() => {
              setStep(1);
              setFormData({
                targetOptimasi: '',
                namaLengkap: '',
                jurusan: '',
                semester: '',
                targetKarir: '',
                tujuanUtama: '',
                targetRole: '',
                identitasProfesional: '',
                pencapaian: [''],
                skills: [''],
              });
            }}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Linkedin className="w-5 h-5" />
            Buat Optimasi Baru
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderStepIndicator()}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
          <Linkedin className="w-8 h-8 text-primary" />
          LinkedIn Profile Optimizer
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Buat Headline & Summary LinkedIn yang menarik perhatian rekruter
          dengan AI.
        </p>
      </div>

      <Card className="p-6 gradient-card border-border/50">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center mb-6">
              Pilih Target Optimasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-glow ${
                  formData.targetOptimasi === 'headline'
                    ? 'border-primary shadow-glow bg-primary/5'
                    : 'border-border/50'
                }`}
                onClick={() =>
                  setFormData({ ...formData, targetOptimasi: 'headline' })
                }
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Linkedin className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Optimasi Headline</h4>
                  <p className="text-sm text-muted-foreground">
                    Buat headline yang menarik dan profesional untuk profil
                    LinkedIn Anda
                  </p>
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-glow ${
                  formData.targetOptimasi === 'summary'
                    ? 'border-primary shadow-glow bg-primary/5'
                    : 'border-border/50'
                }`}
                onClick={() =>
                  setFormData({ ...formData, targetOptimasi: 'summary' })
                }
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Linkedin className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">
                    Optimasi Summary (About)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Buat summary yang komprehensif untuk section About di
                    LinkedIn
                  </p>
                </div>
              </Card>
            </div>
            <Button
              onClick={handleNext}
              disabled={!formData.targetOptimasi}
              className="w-full"
              size="lg"
            >
              Lanjut
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center mb-6">
              Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input
                  placeholder="Contoh: Budi Santoso"
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    setFormData({ ...formData, namaLengkap: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Jurusan/Bidang Studi</Label>
                <Input
                  placeholder="Contoh: Teknik Informatika"
                  value={formData.jurusan}
                  onChange={(e) =>
                    setFormData({ ...formData, jurusan: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Semester (Angka)</Label>
                <Input
                  type="number"
                  placeholder="Contoh: 5"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Target Karir</Label>
                <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, targetKarir: 'sesuai' })
                    }
                    className={`py-3 px-4 transition-smooth ${
                      formData.targetKarir === 'sesuai'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    Sesuai Jurusan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, targetKarir: 'eksplorasi' })
                    }
                    className={`py-3 px-4 border-l border-border transition-smooth ${
                      formData.targetKarir === 'eksplorasi'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    Eksplorasi
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStep2Valid}
                className="flex-1"
                size="lg"
              >
                Lanjut
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center mb-6">
              Fokus Profil Anda
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tujuan Utama Profil</Label>
                <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tujuanUtama: 'karir' })
                    }
                    className={`py-3 px-4 transition-smooth ${
                      formData.tujuanUtama === 'karir'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    Mencari Karir
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tujuanUtama: 'branding' })
                    }
                    className={`py-3 px-4 border-l border-border transition-smooth ${
                      formData.tujuanUtama === 'branding'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    Personal Branding
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Role/Minat Utama</Label>
                <Input
                  placeholder="Contoh: Data Scientist"
                  value={formData.targetRole}
                  onChange={(e) =>
                    setFormData({ ...formData, targetRole: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Identitas Profesional (4-7 kata)</Label>
                <Input
                  placeholder="Contoh: Mahasiswa Teknik Penuh Semangat"
                  value={formData.identitasProfesional}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      identitasProfesional: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Jumlah kata:{' '}
                  {
                    formData.identitasProfesional
                      .trim()
                      .split(/\s+/)
                      .filter((w) => w.length > 0).length
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStep3Valid()}
                className="flex-1"
                size="lg"
              >
                Lanjut
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center mb-6">
              Detail Pendukung
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pencapaian */}
              <div className="space-y-3">
                <Label>Pencapaian Utama (Maks. 3)</Label>
                {formData.pencapaian.map((pencapaian, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Pencapaian #${index + 1}`}
                      value={pencapaian}
                      onChange={(e) =>
                        updateItem('pencapaian', index, e.target.value)
                      }
                      className="flex-1"
                    />
                    {formData.pencapaian.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem('pencapaian', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.pencapaian.length < 3 && (
                  <Button
                    variant="outline"
                    onClick={() => addItem('pencapaian')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Pencapaian
                  </Button>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label>Skill Utama (Maks. 3)</Label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Skill #${index + 1}`}
                      value={skill}
                      onChange={(e) =>
                        updateItem('skills', index, e.target.value)
                      }
                      className="flex-1"
                    />
                    {formData.skills.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem('skills', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.skills.length < 3 && (
                  <Button
                    variant="outline"
                    onClick={() => addItem('skills')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Skill
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading || !isStep4Valid}
                className="flex-1"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Linkedin className="w-5 h-5" />
                    Generate Rekomendasi
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
