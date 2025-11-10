import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const SwotFeature = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "Kaan",
    mbti: "",
    via1: "",
    via2: "",
    via3: ""
  });

  const isValid = formData.mbti && formData.via1 && formData.via2 && formData.via3;

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const mockResult = `
## 🌟 INTRO VIBE CHECK

${formData.mbti} + ${formData.via1} + ${formData.via2} + ${formData.via3} = paket lengkap "idealis visioner" yang hangat tapi tajam. Kamu tipe yang suka mikir jauh ke depan, punya imajinasi liar, sekaligus peduli manusia di sekitar. Jadi, aura­-mu kayak kombinasi "story-teller yang ngemong" plus "strategist diam-diam".

🔄 Nah, biar self-awareness makin tajam, kita pakai SWOT—alat refleksi simpel tapi mantap.

---

## 🟩 S – Strength (Kekuatan Alami)

### ⭐ Empati Visioner
Peka emosi + lihat big picture.

**Contoh:** Saat diskusi kelompok, kamu cepat baca mood teman & arahkan ide ke tujuan.

**Strategi:** Jadi facilitator atau notulen strategis agar tim tetap selaras.

### ⭐ Kreativitas Out-of-the-Box
Otakmu gampang nyusun pola baru.

**Contoh:** Punya konsep tugas video kuliah yang beda dari biasanya & dosen ter-wow.

**Strategi:** Simpan bank ide di notion/google keep untuk dieksekusi saat proyek.

### ⭐ Sudut Pandang Mendalam
Strength "${formData.via3}" bikin analisis multi-layer.

**Contoh:** Nulis esai yang ngaitin teori, data, dan refleksi pribadi.

**Strategi:** Pitch ide paper/interseksi lintas mata kuliah ke dosen.

### ⭐ Kindness yang Autentik
Orang merasa aman curhat ke kamu.

**Contoh:** Jadi teman curhat sebelum ujian, bantu mereka tenang.

**Strategi:** Bangun networking tulus; tawarkan bantuan 15-minute check-in per minggu.

---

## 🟨 W – Weakness (Hambatan Pribadi)

### ⚠️ Over-Idealism
Standar tinggi → mudah kecewa.

**Contoh:** Revisi tugas berkali-kali sampai dead­line mepet.

**Strategi:** Terapkan aturan 80% done is better than 100% perfect.

### ⚠️ Energy Drain dari Social Overload
Empati tinggi bikin cepat capek.

**Contoh:** Habis rapat panjang, langsung tepar & skip belajar.

**Strategi:** Jadwalkan "recharge slot" di kalender sebelum & sesudah event ramai.

### ⚠️ Conflict-Avoidant
Enggan konfrontasi langsung.

**Contoh:** Diam saat teman tim malas, akhirnya bebanmu nambah.

**Strategi:** Pakai "I-statement" + data saat feedback, latihan lewat chat dulu.

### ⚠️ Analysis Paralysis
Kebanyakan mikir skenario.

**Contoh:** Nunda daftar lomba karena takut opsi lain lebih cocok.

**Strategi:** Set time-box 30 menit untuk keputusan kecil, 24 jam untuk besar.

---

## 🟦 O – Opportunity (Peluang Potensial)

### 🚀 Rise of Creative Projects di Kampus
Media sosial & tugas digital melimpah.

**Contoh:** Kompetisi konten edukasi dari BEM.

**Strategi:** Bentuk micro-team produksi konten bertema sosial-humaniora.

### 🚀 Trend Kolaborasi Interdisipliner
Banyak program riset lintas jurusan.

**Contoh:** Hackathon sosial dengan mentor industri.

**Strategi:** Tawarkan perspektif human-centered untuk tim tech.

### 🚀 Dukungan Well-being Movement
Kampus mulai buka peer-counseling.

**Contoh:** Unit Kesehatan Mahasiswa rekrut volunteer listener.

**Strategi:** Daftar jadi peer counselor; sinergikan ${formData.via2} & empati.

### 🚀 Beasiswa & Program Leadership Global
Diburu mahasiswa visioner.

**Contoh:** YSEALI, LPDP pra-S2, etc.

**Strategi:** Kumpulkan portfolio impact sosial sejak dini.

---

## 🟥 T – Threat (Tantangan yang Perlu Diwaspadai)

### 🔥 Burnout Culture
Overwork dianggap keren.

**Contoh:** Teman brag "tidur 3 jam", kamu ikut terpacu.

**Strategi:** Buat personal KPI berbasis kualitas, bukan jam lembur.

### 🔥 Kompetisi Ekstrovert-Centric
Presentasi & networking masif.

**Contoh:** Career fair full small talk; energi ${formData.mbti} drop.

**Strategi:** Siapkan skrip perkenalan 30 detik & recharge corner.

### 🔥 Informasi Overload
FOMO event, webinar, peluang.

**Contoh:** Timeline dipenuhi poster lomba, bingung pilih.

**Strategi:** Pakai matrix Eisenhower + nilai 1-5 relevance sebelum daftar.

### 🔥 Label "Terlalu Sensitif"
Orang salah paham empati = lemah.

**Contoh:** Ide diabaikan karena kamu tidak vokal.

**Strategi:** Latih delivery assertif; gunakan data pendukung di awal pitch.

---

## TAHAP 2: SWOT ACTION LENS

### 🎓 AKADEMIK

#### 📌 SO
- Angkat topik tugas yang menyentuh isu kemanusiaan kreatif – Pakai ${formData.via1} & ${formData.via3} untuk memenuhi permintaan project interdisipliner (Opportunity).
- Jadi mentor belajar peer-to-peer – Gunakan ${formData.via2} untuk bantu teman sekaligus memperdalam materi.

#### 📌 ST
- Presentasi dengan storytelling visual – Kekuatan kreatif menutupi ancaman environment ekstrovert-centric.
- Buat jadwal belajar mindful – Empati pada diri sendiri cegah burnout akademik.

#### 📌 WO
- Ikut kelompok studi terstruktur – Atasi analysis paralysis dengan struktur plus peluang kolaborasi.
- Konsultasi rutin ke dosen pembimbing – Lawan over-idealism lewat feedback praktis.

#### 📌 WT
- Gunakan teknik Pomodoro + refleksi harian – Minimalkan perfectionism & hindari burnout.
- Batasi SKS ekstrim, fokus mata kuliah inti – Hindari informasi overload & kualitas jeblok.

**Kesimpulan Akademik:** Posisi idealmu adalah "Creative Analyst" yang menggabungkan riset mendalam dengan narasi human-centered. Pegang prinsip progress > perfection dan kelola energi sebagai aset utama.

---

### 🤝 ORGANISASI

#### 📌 SO
- Pimpin divisi kreatif di BEM/UKM – Gunakan ide visioner untuk kampanye sosial (Opportunity).
- Bangun program mentoring anggota baru – ${formData.via2} + empati jadi keunggulan retensi.

#### 📌 ST
- Rancang SOP kerja ramah kesehatan mental – Kalahkan budaya burnout dengan perspektif holistik.
- Kemas proposal sponsorship dengan storytelling kuat – Hadang ancaman dana terbatas.

#### 📌 WO
- Duet dengan partner ekstrovert di event – Kelemahan public speaking tertolong peluang networking luas.
- Gunakan tools project management (Trello/Notion) – Redam overthinking lewat dashboard transparan.

#### 📌 WT
- Delegasikan detail operasional – Hindari energy drain dan konflik internal.
- Terapkan "silent break" di agenda rapat – Jaga kesehatan mental & hindari label sensitif.

**Kesimpulan Organisasi:** Peran idealmu adalah "Visionary Creative Director" yang menjaga budaya suportif. Prinsip strategis: kolaborasi berempati + sistem kerja sehat = impact berkelanjutan.

---

### 🏆 LOMBA

#### 📌 SO
- Daftar kompetisi essay/ide sosial – Strength analisis mendalam selaras peluang kreatif kampus.
- Masuk kategori "user experience" pada hackathon – Empati ${formData.mbti} jadi nilai plus.

#### 📌 ST
- Gunakan storytelling data-driven saat pitching – Melawan juri kritis (Threat) dengan kekuatan perspektif.
- Rencanakan self-care timeline – Antisipasi burnout menjelang submission.

#### 📌 WO
- Join tim multi-jurusan – Atasi gap teknis lewat peluang kolaborasi interdisipliner.
- Manfaatkan mentoring lomba kampus – Mentor bantu mereduksi over-idealism & paralysis.

#### 📌 WT
- Seleksi lomba sesuai minat inti (max 2 per semester) – Minimalkan FOMO & workload.
- Buat "de-brief" usai lomba – Hindari kekecewaan berlarut, ubah jadi lesson.

**Kesimpulan Lomba:** Kamu pas sebagai "Insight Crafter" dalam tim—penyumbang ide mendalam & human-touch. Prinsip: fokus kualitas, jaga energi, ubah feedback jadi upgrade berkelanjutan.
`;

  if (step === 2) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">AI SWOT Self-Analysis</h2>
          <p className="text-muted-foreground">Kenali dirimu dan bangun rencana aksi strategis berdasarkan kepribadian MBTI dan VIA Character Strengths.</p>
        </div>

        <div className="flex items-center gap-2 text-lg font-semibold">
          <ArrowRight className="w-5 h-5 text-primary" />
          <span>Hasil Analisis SWOT Diri & Rencana Aksi:</span>
        </div>

        <Button className="w-full" size="lg">
          <ArrowRight className="w-4 h-4" />
          Unduh PDF
        </Button>

        <Card className="p-6 bg-card/50 border-border/50 space-y-2">
          <h3 className="text-xl font-bold">Data Diri untuk Analisis:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Nama:</strong> {formData.nama}</p>
            <p><strong>MBTI:</strong> {formData.mbti}</p>
            <p><strong>VIA Strengths:</strong> {formData.via1}, {formData.via2}, {formData.via3}</p>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 border-border/50">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{mockResult}</ReactMarkdown>
          </div>
        </Card>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => {
            setStep(1);
            setFormData({ nama: "Kaan", mbti: "", via1: "", via2: "", via3: "" });
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
        <h2 className="text-2xl md:text-3xl font-bold mb-2">AI SWOT Self-Analysis</h2>
        <p className="text-muted-foreground">Kenali dirimu dan bangun rencana aksi strategis berdasarkan kepribadian MBTI dan VIA Character Strengths.</p>
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
              onChange={(e) => setFormData({...formData, mbti: e.target.value.toUpperCase()})}
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
              onChange={(e) => setFormData({...formData, via1: e.target.value})}
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
              onChange={(e) => setFormData({...formData, via2: e.target.value})}
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
              onChange={(e) => setFormData({...formData, via3: e.target.value})}
            />
          </div>
        </div>
      </Card>

      <Button 
        className="w-full" 
        size="lg"
        disabled={!isValid || loading}
        onClick={handleAnalyze}
      >
        {loading ? (
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
