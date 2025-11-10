import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, GraduationCap, Calendar, Building, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  nama: string;
  jurusan: string;
  semester: string;
  universitas: string;
  karirSesuai: "ya" | "tidak" | "";
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

const ikigaiOptions = [
  "Digital Storycrafter: Peran utama kamu adalah meramu kode dan narasi humanis jadi website interaktif yang bikin user merasa \"dianggap\". Contoh konkret: bikin platform komunitas kampus yang langsung kasih rekomendasi self-care harian buat mahasiswa yang lagi burnout mata kuliah.",
  "Insight Architect: Peran utama kamu adalah menyelam ke data perilaku orang, lalu membangun solusi tech yang \"ngeh\" sama emosi penggunanya. Contoh konkret: skripsi analitik mood tracker yang prediksi kapan teman kos butuh ajakan nongkrong.",
  "Empathic Debugger: Peran utama kamu adalah memecah masalah sosial layaknya bug—pelan, teliti, dan penuh empati. Contoh konkret: volunteering di hotline kesehatan mental sambil ngembangin chatbot pendengar curhat."
];

const sliceOptions = [
  "Gue pengen bantu orang yang ngerasa \"cuma angka NIM\" biar sadar suaranya penting lewat platform digital ramah hati.",
  "Gue pengen temenin teman-teman introvert nemu safe space online buat eksplor bakat tanpa takut di-judge.",
  "Gue pengen nunjukkin kalau teknologi bisa jadi pelukan, bukan cuma layar dingin."
];

export const IkigaiFeature = () => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    jurusan: "",
    semester: "",
    universitas: "",
    karirSesuai: "",
    mbti: "",
    via1: "",
    via2: "",
    via3: "",
    career1: "",
    career2: "",
    career3: "",
    ikigaiSpot: "",
    sliceOfLife: ""
  });

  const isStep1Valid = formData.nama && formData.jurusan && formData.semester && formData.universitas && formData.karirSesuai;
  const isStep3Valid = formData.mbti && formData.via1 && formData.via2 && formData.via3 && formData.career1 && formData.career2 && formData.career3;
  const isStep4Valid = formData.ikigaiSpot && formData.sliceOfLife;

  const handleNext = async () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && isStep3Valid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 1500);
    } else if (step === 4 && isStep4Valid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(5);
      }, 1500);
    }
  };

  const mockResult = `
Nama: ${formData.nama}
Jurusan: ${formData.jurusan}
MBTI: ${formData.mbti}
VIA Strengths: ${formData.via1}, ${formData.via2}, ${formData.via3}
Career Roles: ${formData.career1}, ${formData.career2}, ${formData.career3}

**Ikigai Spot Dipilih:** ${formData.ikigaiSpot.substring(0, 100)}...

**Slice of Life Dipilih:** ${formData.sliceOfLife}

---

## 1. Strategi Realistis Awal per Track

### Employee Track
Bayangin ${formData.nama} kerja di startup health-tech sebagai "Empathic QA/UX Engineer." Job-desc-nya: ngetes fitur, cari bug, sambil ngobrol sama user—khususnya yang pakai aplikasi buat curhat. Jadi, debugging plus listening ear. Pelan, teliti, empatik: ${formData.mbti} mode ON.

**Bisa mulai sekarang?** Ikut program magang remote atau volunteership di platform kesehatan mental; cari posisi QA Tester/User Research, kirim portofolio mini berisi analisis bug + saran perbaikan empatik.

### Self-Employed Track
Menjadi "Freelance Empathic Chatbot Builder." ${formData.nama} bikin chatbot pendengar curhat, jual jasa ke NGO, sekolah, atau komunitas. Client senang karena dapat solusi tech yang hangat, user merasa dipeluk, dan ${formData.nama} tetap bebas ngatur waktu kuliah.

**Bisa mulai sekarang?** Buka akun di Fiverr/LinkedIn, pasang demo chatbot (pakai Dialogflow/Rasa), tulis caption sederhana: "Bot ini nggak cuma jawab, tapi juga mendengar."

### Business Owner Track
Mendirikan micro-studio "Teknologi Pelukan." Produknya: suite tools low-code untuk konselor dan organisasi sosial—mulai dari chatbot curhat, dashboard progress, sampai plugin "empathy meter." Re-invest profit ke riset psikologi + AI etis.

**Bisa mulai sekarang?** Bentuk tim 2-3 teman sejurusan, bikin landing page + prototype di weekend hackathon, kumpulkan feedback dari komunitas kesehatan mental.

### Jurusan-Based Track
Fokus sebagai "Full-Stack Web Dev Pro-Social." Ini jalur konvensional: bangun portofolio website/apps yang menonjolkan fitur inklusif—dark mode nyaman mata, bahasa ramah, dan badge "Safe Space." Kerjaan bisa di agency, korporat, atau research lab kampus.

**Bisa mulai sekarang?** Refactor tugas kuliah jadi project GitHub: "CurhatHub"—web forum anonim dengan sistem moderasi empatik.

---

## 2. Penjabaran per Track

### Employee Track
- **Peran:** Empathic QA/UX Engineer di startup health-tech
- **Hard Skills (Top 3):** Manual & automated testing dasar, UX research interview, Basic front-end debugging (HTML/CSS/JS)
- **Soft Skills (Top 3):** Active listening, Detail-oriented mindset, Compassionate communication
- **Alasan Personal Match:** ${formData.nama} senang "mecahin bug sosial," ${formData.mbti} suka meaningful impact, dan strength ${formData.via1} + ${formData.via2} bikin proses QA terasa human-centered, bukan sekadar ceklis.

### Self-Employed Track
- **Peran:** Freelance Empathic Chatbot Builder
- **Hard Skills (Top 3):** Conversational design (Dialogflow/Rasa), Python/Node scripting, Basic data privacy & ethics
- **Soft Skills (Top 3):** Creativity (meracik persona bot), Client empathy, Self-management
- **Alasan Personal Match:** Track ini memadukan kreativitas dan detektif-mode menemukan pola curhat user. Plus fleksibel dengan ritme kuliah ${formData.jurusan}.

### Business Owner Track
- **Peran:** Founder Micro-Studio "Teknologi Pelukan"
- **Hard Skills (Top 3):** Product roadmap & MVP building, Fundraising/pitch deck, Team leadership agile
- **Soft Skills (Top 3):** Visionary thinking, Resilience, Ethical decision-making
- **Alasan Personal Match:** VIA ${formData.via1} & ${formData.via2} = modal bikin solusi inovatif; ${formData.via3} jadi kompas moral saat scaling. ${formData.mbti} umumnya nyaman jadi mission-driven leader ketimbang bos diktator.

### Jurusan-Based Track
- **Peran:** Full-Stack Web Dev Pro-Social
- **Hard Skills (Top 3):** React / Next.js, REST & database design, Accessibility & inclusive design
- **Soft Skills (Top 3):** Problem framing ala "detektif", Collaboration, Continuous learning
- **Alasan Personal Match:** Langsung nyambung ke kurikulum ${formData.jurusan}, memudahkan cari internship, skripsi, dan network dosen. Impact-driven theme bikin tetap selaras dengan ikigai "teknologi = pelukan."

---

## 3. CTA Penutup

Sekarang pilih satu track yang paling bikin mata kamu berbinar (dan detak jantung excited) saat ngebayangin hari-hari ke depan. Mulai dari situ dulu—karena ketika langkah pertama selaras sama empati dan kreativitasmu, semua skill teknis akan nyusul dengan lebih enteng. Kamu #TeamEmpathicDebugger, ayo tentukan jalur utamanya hari ini!
`;

  if (step === 5) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Hasil Ikigai Analysis</h2>
          <p className="text-muted-foreground">Berikut adalah strategi karier & bisnis yang dipersonalisasi untukmu.</p>
        </div>

        <div className="flex items-center gap-2 text-lg font-semibold">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span>Hasil Strategi Karier & Bisnis:</span>
        </div>

        <Button className="w-full" size="lg">
          <ArrowRight className="w-4 h-4" />
          Unduh PDF
        </Button>

        <Card className="p-6 bg-card/50 border-border/50 space-y-4">
          <h3 className="text-xl font-bold">Data Analisis</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{mockResult.split('---')[0]}</ReactMarkdown>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{mockResult.split('---')[1]}</ReactMarkdown>
          </div>
        </Card>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            setStep(1);
            setFormData({
              nama: "", jurusan: "", semester: "", universitas: "", karirSesuai: "",
              mbti: "", via1: "", via2: "", via3: "", career1: "", career2: "", career3: "",
              ikigaiSpot: "", sliceOfLife: ""
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Step 1: Data Diri</h2>
            <p className="text-muted-foreground">Isi data dirimu sebagai fondasi untuk pemetaan Ikigai yang akurat oleh AI.</p>
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
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
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
                onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
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
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
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
                onChange={(e) => setFormData({...formData, universitas: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ingin Berkarir Sesuai Jurusan?</Label>
            <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData({...formData, karirSesuai: "ya"})}
                className={`py-3 px-4 transition-smooth ${
                  formData.karirSesuai === "ya" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card hover:bg-muted/50"
                }`}
              >
                Ya, Sesuai
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, karirSesuai: "tidak"})}
                className={`py-3 px-4 border-l border-border transition-smooth ${
                  formData.karirSesuai === "tidak" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card hover:bg-muted/50"
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Step 2: Lakukan Tes Kepribadian</h2>
            <p className="text-muted-foreground">Klik tombol-tombol di bawah ini untuk mengikuti 3 tes. Setelah selesai, lanjut ke langkah berikutnya untuk input hasilnya.</p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 hover:border-primary/50 transition-smooth"
              onClick={() => window.open('https://boo.world/16-personality-test', '_blank')}
            >
              <span className="text-2xl mr-3">🧠</span>
              <span className="text-lg">MBTI Test</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 hover:border-primary/50 transition-smooth"
              onClick={() => window.open('https://www.viacharacter.org/account/register', '_blank')}
            >
              <span className="text-2xl mr-3">💪</span>
              <span className="text-lg">VIA Character Test</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 hover:border-primary/50 transition-smooth"
              onClick={() => window.open('https://www.careerexplorer.com/assessments', '_blank')}
            >
              <span className="text-2xl mr-3">🚀</span>
              <span className="text-lg">Career Explorer Test</span>
            </Button>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleNext}
          >
            <span className="text-xl mr-2">✅</span>
            Saya sudah Selesai Tes → Lanjut Input Hasil
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Step 3: AI Ikigai Analyzer</h2>
            <p className="text-muted-foreground">Masukkan hasil tes kepribadian Anda untuk mendapatkan pemetaan awal Ikigai yang dipersonalisasi oleh AI.</p>
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
                onChange={(e) => setFormData({...formData, mbti: e.target.value.toUpperCase()})}
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
                  onChange={(e) => setFormData({...formData, via1: e.target.value})}
                />
                <Input 
                  placeholder="VIA Strength #2"
                  value={formData.via2}
                  onChange={(e) => setFormData({...formData, via2: e.target.value})}
                />
                <Input 
                  placeholder="VIA Strength #3"
                  value={formData.via3}
                  onChange={(e) => setFormData({...formData, via3: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, career1: e.target.value})}
                />
                <Input 
                  placeholder="Career Role #2"
                  value={formData.career2}
                  onChange={(e) => setFormData({...formData, career2: e.target.value})}
                />
                <Input 
                  placeholder="Career Role #3"
                  value={formData.career3}
                  onChange={(e) => setFormData({...formData, career3: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!isStep3Valid || loading}
            onClick={handleNext}
          >
            {loading ? (
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

      {step === 4 && (
        <>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Step 4: Final Ikigai Analysis</h2>
            <p className="text-muted-foreground">Pilih kombinasi terbaikmu untuk mendapatkan strategi karier dan bisnis yang paling relevan dari AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Pilih Ikigai Spot</Label>
              {ikigaiOptions.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({...formData, ikigaiSpot: option})}
                  className={`w-full p-4 text-left text-sm rounded-md border transition-smooth ${
                    formData.ikigaiSpot === option
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Label>Pilih Slice of Life Purpose</Label>
              {sliceOptions.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({...formData, sliceOfLife: option})}
                  className={`w-full p-4 text-left text-sm rounded-md border transition-smooth ${
                    formData.sliceOfLife === option
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!isStep4Valid || loading}
            onClick={handleNext}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menganalisis Sweetspot...
              </>
            ) : (
              "Analisis Sweetspot Saya"
            )}
          </Button>
        </>
      )}
    </div>
  );
};
