# API Usage Examples

Contoh lengkap cara menggunakan API ElevAI Backend.

## Setup

Base URL untuk development:

```
http://localhost:3000
```

Semua request yang memerlukan authentication harus menyertakan header:

```
Authorization: Bearer <supabase-jwt-token>
```

## 1. Health Check

### Get API Status

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "ElevAI Backend API"
}
```

### Get All Features

```bash
curl http://localhost:3000/features
```

## 2. User Management

### Get User Profile

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "tokens": 150,
    "is_premium": true,
    "premium_plan": "monthly",
    "premium_expires_at": "2024-02-01T00:00:00.000Z"
  }
}
```

### Get Token Balance

```bash
curl -X GET http://localhost:3000/api/user/tokens \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Transaction History

```bash
curl -X GET http://localhost:3000/api/user/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 3. Payment

### Get Available Plans

```bash
curl http://localhost:3000/api/payment/plans
```

Response:

```json
{
  "success": true,
  "data": {
    "subscriptions": {
      "monthly": {
        "name": "Premium 1 Bulan",
        "duration": "monthly",
        "price": 39000,
        "tokens": 30,
        "description": "Akses penuh semua fitur premium ElevAI selama 30 hari.",
        "isBestValue": false
      },
      "yearly": {
        "name": "Premium 1 Tahun",
        "duration": "yearly",
        "price": 390000,
        "tokens": 150,
        "description": "Hemat lebih banyak dengan akses premium penuh selama 365 hari.",
        "isBestValue": true
      }
    },
    "tokens": {
      "small": {
        "name": "5 Token",
        "amount": 5,
        "price": 7495,
        "description": "Cocok untuk mencoba beberapa fitur premium.",
        "isBestValue": false
      },
      "medium": {
        "name": "10 Token",
        "amount": 10,
        "price": 9999,
        "description": "Pilihan populer untuk pengguna reguler.",
        "isBestValue": true
      }
    }
  }
}
```

### Create Payment

```bash
curl -X POST http://localhost:3000/api/payment/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "subscription",
    "item": "monthly",
    "amount": 49000,
    "tokens_amount": 200
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "order_id": "SUB-1234567890-ABC123",
    "snap_token": "xxxx-xxxx-xxxx",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v3/..."
  }
}
```

## 4. Student Development Features

### Ikigai Self Discovery - Stage 1

Generate Ikigai spots and life purposes:

```bash
curl -X POST http://localhost:3000/api/student-development/ikigai/stage1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Budi Santoso",
    "jurusan": "Teknik Informatika",
    "semester": 6,
    "universitas": "Universitas Indonesia",
    "karirSesuaiJurusan": "ya_sesuai",
    "mbtiType": "INTJ",
    "viaStrengths": ["Creativity", "Curiosity", "Love of Learning"],
    "careerRoles": ["Software Engineer", "Data Scientist", "Product Manager"]
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "ikigai_spots": [
      {
        "title": "Digital Storycrafter",
        "description": "Peran utama kamu adalah meramu kode..."
      }
    ],
    "life_purposes": ["Gue pengen bantu orang yang ngerasa..."]
  }
}
```

### Ikigai Self Discovery - Final Analysis

```bash
curl -X POST http://localhost:3000/api/student-development/ikigai/final \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stage1Data": {
      "nama": "Budi Santoso",
      "jurusan": "Teknik Informatika",
      "semester": 6,
      "universitas": "Universitas Indonesia",
      "karirSesuaiJurusan": "ya_sesuai",
      "mbtiType": "INTJ",
      "viaStrengths": ["Creativity", "Curiosity", "Love of Learning"],
      "careerRoles": ["Software Engineer", "Data Scientist", "Product Manager"]
    },
    "selectedIkigaiSpot": "Digital Storycrafter: ...",
    "selectedSliceOfLife": "Gue pengen bantu orang..."
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "stage1_data": {
      "nama": "Budi Santoso",
      "jurusan": "Teknik Informatika",
      ...
    },
    "analysis": "# Strategi Realistis Awal per Track\n\n## Employee Track\n...",
    "tokens_used": 2500
  }
}
```

### SWOT Self-Analysis

```bash
curl -X POST http://localhost:3000/api/student-development/swot \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mbtiType": "INTJ",
    "viaStrengths": ["Creativity", "Curiosity", "Love of Learning"]
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "user_input": {
      "mbtiType": "INTJ",
      "viaStrengths": ["Creativity", "Curiosity", "Love of Learning"]
    },
    "analysis": "# 🌟 INTRO VIBE CHECK\n\nINTJ + Creativity + Curiosity...",
    "tokens_used": 2000
  }
}
```

### Essay Exchanges

```bash
curl -X POST http://localhost:3000/api/student-development/essay-exchanges \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "programName": "Erasmus+ Exchange",
    "negaraUniversitas": "Germany, Technical University of Munich",
    "motivasiAkademik": "I want to learn advanced AI...",
    "motivasiPribadi": "Experience different culture...",
    "skillPengalaman": "3 years programming experience...",
    "rencanKontribusi": "Share knowledge with local students..."
  }'
```

### Interview Simulation - Upload CV (Optional)

Upload PDF CV untuk ekstraksi teks otomatis:

```bash
curl -X POST http://localhost:3000/api/student-development/interview/upload-cv \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cv=@/path/to/cv.pdf"
```

Response:

```json
{
  "success": true,
  "data": {
    "cv_text": "CURRICULUM VITAE\n\nBudi Santoso\nEmail: budi@example.com...\n\nEDUCATION\nUniversitas Indonesia\nTeknik Informatika\n2020-2024\n\nEXPERIENCE\nSoftware Engineer Intern at PT ABC\n..."
  }
}
```

**Note**:

- Endpoint ini gratis (tidak konsumsi token)
- Hanya menerima file PDF
- Menggunakan pdf-parse untuk ekstraksi teks
- CV content bisa digunakan untuk personalisasi interview

### Interview Simulation - Start

Memulai sesi interview baru dengan Text-to-Speech audio:

```bash
curl -X POST http://localhost:3000/api/student-development/interview/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "namaPanggilan": "Budi",
    "cvContent": "CURRICULUM VITAE... (optional, from upload-cv)",
    "jenisInterview": "beasiswa",
    "bahasa": "indonesia",
    "namaBeasiswa": "LPDP"
  }'
```

**For Scholarship Interview (beasiswa):**

```json
{
  "namaPanggilan": "Budi",
  "cvContent": "CV text here (optional)",
  "jenisInterview": "beasiswa",
  "bahasa": "english", // or "indonesia"
  "namaBeasiswa": "Chevening Scholarship"
}
```

**For Internship Interview (magang):**

```json
{
  "namaPanggilan": "Sarah",
  "cvContent": "CV text here (optional)",
  "jenisInterview": "magang",
  "posisiMagang": "Software Engineer Intern at Google"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "session_id": "session_1234567890_abc",
    "question": "Hello Budi, thank you for joining us today. Can you start by telling me about yourself and why you're interested in the Chevening Scholarship?",
    "question_audio": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2Zj...",
    "question_number": 1,
    "total_questions": 5
  }
}
```

**Audio Format**:

- `question_audio` adalah **base64-encoded MP3 audio**
- Generated menggunakan Google Cloud Text-to-Speech
- Bahasa English menggunakan voice: `en-US-Neural2-C` (Female US English)
- Bahasa Indonesia menggunakan voice: `id-ID-Wavenet-A` (Female Indonesian)

**How to Play Audio**:

1. **Di Browser (HTML/JavaScript)**:

```html
<audio controls>
  <source id="audioSource" type="audio/mp3" />
</audio>

<script>
  const base64Audio = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2Zj...'; // from API
  document.getElementById(
    'audioSource'
  ).src = `data:audio/mp3;base64,${base64Audio}`;
</script>
```

2. **Atau save ke file untuk testing**:

```bash
# Save base64 audio to file
echo "BASE64_STRING_HERE" | base64 -d > question.mp3

# Play with media player
vlc question.mp3
```

3. **Test dengan online tool**:

- Copy base64 string dari `question_audio`
- Paste ke: https://base64.guru/converter/decode/audio
- Atau: https://codebeautify.org/base64-to-audio-converter

### Interview Simulation - Submit Answer

Submit jawaban untuk pertanyaan saat ini dan dapatkan pertanyaan berikutnya:

```bash
curl -X POST http://localhost:3000/api/student-development/interview/answer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_abc",
    "questionNumber": 1,
    "answer": "Thank you for having me. I am passionate about education reform in Indonesia..."
  }'
```

**Response untuk Q1-Q4** (Next Question):

```json
{
  "success": true,
  "data": {
    "question": "That's interesting. Can you elaborate on specific leadership experiences that demonstrate your ability to drive change?",
    "question_audio": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//...",
    "question_number": 2,
    "total_questions": 5
  }
}
```

**Response untuk Q5** (Final with Evaluation):

```json
{
  "success": true,
  "data": {
    "completed": true,
    "qa_history": [
      {
        "question": "Hello Budi, can you tell me about yourself?",
        "answer": "I am passionate about education..."
      },
      {
        "question": "Can you elaborate on your leadership experiences?",
        "answer": "During my time as student council president..."
      },
      {
        "question": "What are your career goals after the scholarship?",
        "answer": "I plan to establish an EdTech startup..."
      },
      {
        "question": "How will you contribute to your home country?",
        "answer": "I will create free online courses..."
      },
      {
        "question": "What makes you a strong candidate?",
        "answer": "My combination of technical skills and social impact..."
      }
    ],
    "evaluation": "# 📋 Interview Recap\n\n## Questions & Answers\n\n**Q1:** Hello Budi, can you tell me about yourself?\n**A1:** I am passionate about education...\n**Score:** 8/10 - Strong opening, clear passion\n\n**Q2:** Can you elaborate on your leadership experiences?\n**A2:** During my time as student council president...\n**Score:** 9/10 - Concrete examples with impact\n\n**Q3:** What are your career goals after the scholarship?\n**A3:** I plan to establish an EdTech startup...\n**Score:** 7/10 - Clear vision but needs more specificity\n\n**Q4:** How will you contribute to your home country?\n**A4:** I will create free online courses...\n**Score:** 8/10 - Good community focus\n\n**Q5:** What makes you a strong candidate?\n**A5:** My combination of technical skills...\n**Score:** 9/10 - Excellent summary\n\n---\n\n# 🎯 Total Score: 41/50 (82%)\n\n# 📊 Overall Assessment\n\n**Strengths:**\n- Clear articulation of goals\n- Strong leadership examples\n- Genuine passion for education\n\n**Areas for Improvement:**\n- Add more specific metrics/achievements\n- Connect experiences more to scholarship objectives\n- Practice concise storytelling\n\n**Recommendation:** Strong candidate, ready for actual interview with minor refinements.",
    "evaluation_audio": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//...",
    "tokens_used": 3500
  }
}
```

**Note**:

- **Token consumption**: 20 tokens dikonsumsi hanya pada completion (setelah Q5)
- Setiap pertanyaan include audio (base64-encoded MP3)
- Final evaluation juga include audio untuk full feedback
- Pertanyaan berikutnya dibuat berdasarkan jawaban sebelumnya (adaptive interview)
- Audio generation menggunakan Google Cloud Text-to-Speech

**Interview Session Flow**:

```
1. Upload CV (Optional) → Free
2. Start Interview → Generate Q1 + Audio
3. Answer Q1 → Generate Q2 + Audio
4. Answer Q2 → Generate Q3 + Audio
5. Answer Q3 → Generate Q4 + Audio
6. Answer Q4 → Generate Q5 + Audio
7. Answer Q5 → Generate Evaluation + Audio + Consume 20 Tokens
```

## 5. Asisten Lomba Features

### Essay Idea Generator

```bash
curl -X POST http://localhost:3000/api/asisten-lomba/essay-idea \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "temaUtama": "Teknologi Pendidikan",
    "subTema": "AI dalam Pembelajaran",
    "latarBelakang": "Pendidikan di Indonesia masih...",
    "sertakanPenjelasan": true,
    "sertakanMetode": true
  }'
```

### KTI Idea Generator

```bash
curl -X POST http://localhost:3000/api/asisten-lomba/kti-idea \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "temaUtama": "Machine Learning",
    "subTema": "Deteksi Penyakit dengan Deep Learning",
    "latarBelakangUrgensi": true,
    "penelitianTerdahulu": true,
    "keterbaruan": true,
    "successRate": true,
    "langkahKonkret": true,
    "efisiensi": true
  }'
```

### Business Plan Generator

```bash
curl -X POST http://localhost:3000/api/asisten-lomba/business-plan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deskripsiBisnis": "Platform edukasi online yang menghubungkan...",
    "ringkasanEksekutif": true,
    "analisisPasar": true,
    "strategiPemasaran": true,
    "keuangan": true,
    "analisisSWOT": true
  }'
```

## 6. Personal Branding Features

### Instagram Bio - Upload Image

```bash
curl -X POST http://localhost:3000/api/personal-branding/instagram-bio/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/instagram-bio-screenshot.png"
```

Response:

```json
{
  "success": true,
  "data": {
    "bio_text": "Software Engineer | Tech Enthusiast 💻\nBuilding cool stuff\n🚀 DM for collaboration"
  }
}
```

### Instagram Bio - Analyze

```bash
curl -X POST http://localhost:3000/api/personal-branding/instagram-bio/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bioContent": "Software Engineer | Tech Enthusiast 💻\nBuilding cool stuff\n🚀 DM for collaboration"
  }'
```

### Instagram Bio - Generate

```bash
curl -X POST http://localhost:3000/api/personal-branding/instagram-bio/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bioContent": "Software Engineer | Tech Enthusiast",
    "analisisAwal": "Your bio is good but...",
    "tujuanUtama": "professional_networking",
    "gayaTulisan": "professional",
    "siapaKamu": "Full-stack Developer",
    "targetAudiens": "Tech recruiters and fellow developers",
    "pencapaian": ["3+ years experience", "Built 10+ apps", "Open source contributor"],
    "callToAction": "DM for collaboration",
    "hashtag": "#DevLife"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "bios": [
      "Full-stack Dev | 3+ yrs | 10+ Apps Built | Open Source 💻 | DM for Collab #DevLife",
      "Senior Developer | Building Digital Solutions | Let's Connect 🚀 #DevLife",
      "Code Enthusiast | Tech Problem Solver | Open to Projects 👨‍💻 #DevLife"
    ]
  }
}
```

### LinkedIn Profile Optimizer

```bash
curl -X POST http://localhost:3000/api/personal-branding/linkedin-optimizer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetOptimasi": "headline",
    "namaLengkap": "Budi Santoso",
    "jurusan": "Teknik Informatika",
    "semester": 6,
    "targetKarir": "sesuai_jurusan",
    "tujuanUtama": "mencari_karir",
    "targetRole": "Software Engineer",
    "identitasProfesional": "Aspiring Full-stack Developer",
    "pencapaian": ["Dean List 3 semesters", "Hackathon Winner", "Intern at Startup"],
    "skills": ["JavaScript", "React", "Node.js"]
  }'
```

## 7. Daily Tools Features

### Generator Prompt Veo

```bash
curl -X POST http://localhost:3000/api/daily-tools/prompt-veo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subjekUtama": "Young entrepreneur presenting startup pitch",
    "aksiKegiatan": "Speaking confidently to investors",
    "ekspresiEmosi": "Passionate and determined",
    "lokasiTempat": "Modern co-working space",
    "waktu": "Afternoon",
    "pencahayaan": "Natural window light",
    "gerakanKamera": "Slow zoom in",
    "gayaVideo": "Professional documentary style",
    "suasanaVideo": "Inspiring and motivational",
    "suaraMusik": "Uplifting background music",
    "dialog": "This is the future of education",
    "detailTambahan": "Include laptop screen showing graphs"
  }'
```

### Prompt Enhancer - Learning

```bash
curl -X POST http://localhost:3000/api/daily-tools/prompt-enhancer/topik-baru \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain machine learning"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "original_prompt": "Explain machine learning",
    "enhanced_prompt": "I want to learn about machine learning. Please provide:\n1. A clear definition...",
    "tokens_used": 150
  }
}
```

### Other Prompt Enhancers

Available endpoints:

- `/api/daily-tools/prompt-enhancer/tugas` - For assignments
- `/api/daily-tools/prompt-enhancer/konten` - For content creation
- `/api/daily-tools/prompt-enhancer/rencana` - For planning
- `/api/daily-tools/prompt-enhancer/brainstorming` - For brainstorming
- `/api/daily-tools/prompt-enhancer/koding` - For coding help

All use the same request format:

```json
{
  "prompt": "your original prompt here"
}
```

## Error Responses

### Insufficient Tokens

```json
{
  "success": false,
  "error": "Insufficient tokens",
  "required_tokens": 10,
  "current_balance": 5,
  "need_to_purchase": 5
}
```

### Premium Required

```json
{
  "success": false,
  "error": "Premium subscription required",
  "feature": "Ikigai Self Discovery",
  "upgrade_required": true
}
```

### Unauthorized

```json
{
  "success": false,
  "error": "Missing or invalid authorization header"
}
```

### Rate Limited

```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retry_after": 60
}
```

### Invalid File Type (CV Upload)

```json
{
  "success": false,
  "error": "Invalid PDF file. Please upload a valid PDF document."
}
```

## Testing Tips

1. **Use Postman or Thunder Client** untuk testing yang lebih mudah
2. **Save your JWT token** sebagai environment variable
3. **Check token balance** sebelum testing premium features
4. **Monitor response tokens_used** untuk tracking usage
5. **Test error cases** untuk memastikan error handling bekerja
6. **Test audio playback** menggunakan HTML test file atau online base64 decoder
7. **Use real PDF CV** untuk testing upload-cv endpoint