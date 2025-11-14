import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  User,
  ArrowRight,
  ArrowLeft,
  Upload,
  Flag,
  Briefcase,
  Loader2,
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  Download,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { studentDevelopmentApi } from '@/lib/api';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/user-store';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { generatePDF } from '@/lib/pdf-generator';
import { useStepFeatureState } from '@/hooks/useFeatureState';
import { showTokenConsumptionToast } from '@/utils/token-toast';

type Step = 1 | 2 | 3 | 4;

interface InterviewSession {
  session_id: string;
  question: string;
  question_audio: string;
  question_number: number;
  total_questions: number;
}

interface InterviewEvaluation {
  completed: true;
  qa_history: Array<{
    question: string;
    answer: string;
  }>;
  evaluation: string;
  tokens_used: number;
}

interface InterviewState {
  step: Step;
  formData: {
    nama: string;
    cvFile: File | null;
    cvContent: string;
    jenisInterview: '' | 'beasiswa' | 'magang';
    bahasa: string;
    namaBeasiswa: string;
    posisiMagang: string;
  };
  interviewSession: InterviewSession | null;
  currentAnswer: string;
  evaluation: InterviewEvaluation | null;
}

export const InterviewFeature = () => {
  // Step validation function
  const validateStep = (step: number, state: InterviewState): boolean => {
    switch (step) {
      case 1:
        return true; // Step 1 always accessible
      case 2:
        // Step 2 requires nama from step 1
        return !!state.formData.nama;
      case 3:
        // Step 3 requires interview session (started interview)
        return !!state.interviewSession;
      case 4:
        // Step 4 requires evaluation (completed interview)
        return !!state.evaluation;
      default:
        return false;
    }
  };

  const [state, setState, setStep] = useStepFeatureState<InterviewState>(
    {
      step: 1,
      formData: {
        nama: '',
        cvFile: null,
        cvContent: '',
        jenisInterview: '',
        bahasa: '',
        namaBeasiswa: '',
        posisiMagang: '',
      },
      interviewSession: null,
      currentAnswer: '',
      evaluation: null,
    },
    'interview-simulation',
    validateStep
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [speechError, setSpeechError] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { refreshProfile, profile } = useUserStore();

  const { step, formData, interviewSession, currentAnswer, evaluation } = state;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    commands: [],
  });

  useEffect(() => {
    if (transcript) {
      setState({ ...state, currentAnswer: transcript });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Setup speech recognition error handlers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        SpeechRecognition?: typeof SpeechRecognition;
        webkitSpeechRecognition?: typeof SpeechRecognition;
      };

      const SpeechRecognitionAPI =
        win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        setSpeechError(
          'Browser Anda tidak mendukung speech recognition. Gunakan Chrome, Edge, atau Safari terbaru.'
        );
      }
    }
  }, []);

  // Configure language for speech recognition based on interview type
  const getRecognitionLanguage = () => {
    if (formData.jenisInterview === 'magang') {
      return 'id-ID';
    }
    if (
      formData.jenisInterview === 'beasiswa' &&
      formData.bahasa === 'english'
    ) {
      return 'en-US';
    }
    return 'id-ID';
  };

  const startListening = async () => {
    try {
      const language = getRecognitionLanguage();

      // Check for browser support
      if (!browserSupportsSpeechRecognition) {
        const errorMsg =
          'Browser tidak mendukung speech recognition. Gunakan Chrome/Edge/Safari.';
        setSpeechError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch (permError) {
        toast.error(
          'Akses mikrofon ditolak. Harap berikan izin mikrofon di browser Anda.'
        );
        return;
      }

      // Reset before starting
      resetTranscript();
      setSpeechError('');

      // Start listening
      await SpeechRecognition.startListening({
        continuous: true,
        language,
      });

      toast.success('🎤 Mulai merekam - Silakan berbicara...');
    } catch (error) {
      const errorMsg =
        'Gagal memulai speech recognition: ' + (error as Error).message;
      setSpeechError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const stopListening = () => {
    try {
      SpeechRecognition.stopListening();

      if (transcript && transcript.length > 0) {
        toast.success('Rekaman selesai - Jawaban berhasil ditangkap');
      } else {
        toast.warning(
          'Tidak ada suara terdeteksi - Coba lagi atau ketik manual'
        );
      }
    } catch (error) {
      toast.error('Gagal menghentikan rekaman');
    }
  };

  const playAudio = (base64Audio: string) => {
    if (audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${base64Audio}`;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const uploadCVMutation = useMutation({
    mutationFn: async (file: File) => {
      return await studentDevelopmentApi.interviewUploadCV(file);
    },
    onSuccess: (data) => {
      if (data.success) {
        setState({
          ...state,
          formData: { ...formData, cvContent: data.data.cv_text },
        });
        toast.success('CV berhasil diupload dan diekstrak');
      }
    },
    onError: (error: unknown) => {
      console.error('Upload CV error:', error);
      const err = error as { error?: string; message?: string };
      const errorMessage = err?.error || err?.message || 'Gagal mengupload CV';
      toast.error(errorMessage);
    },
  });

  const startInterviewMutation = useMutation({
    mutationFn: async () => {
      const payload: {
        namaPanggilan: string;
        jenisInterview: 'beasiswa' | 'magang';
        cvContent?: string;
        bahasa?: 'english' | 'indonesia';
        namaBeasiswa?: string;
        posisiMagang?: string;
      } = {
        namaPanggilan: formData.nama,
        jenisInterview: formData.jenisInterview as 'beasiswa' | 'magang',
      };

      if (formData.cvContent) {
        payload.cvContent = formData.cvContent;
      }

      if (formData.jenisInterview === 'beasiswa') {
        payload.bahasa = formData.bahasa as 'english' | 'indonesia';
        payload.namaBeasiswa = formData.namaBeasiswa;
      } else {
        payload.posisiMagang = formData.posisiMagang;
      }

      return await studentDevelopmentApi.interviewStart(payload);
    },
    onSuccess: (data) => {
      if (data.success) {
        setState({ ...state, interviewSession: data.data, step: 3 });
        // Auto-play first question
        setTimeout(() => {
          playAudio(data.data.question_audio);
        }, 500);
      }
    },
    onError: (error: unknown) => {
      console.error('Start interview error:', error);
      const err = error as { error?: string; message?: string };
      const errorMessage =
        err?.error || err?.message || 'Gagal memulai interview';
      toast.error(errorMessage);
    },
  });

  const answerMutation = useMutation({
    mutationFn: async () => {
      if (!interviewSession) throw new Error('No active session');
      return await studentDevelopmentApi.interviewAnswer({
        sessionId: interviewSession.session_id,
        questionNumber: interviewSession.question_number,
        answer: currentAnswer,
      });
    },
    onSuccess: async (data) => {
      if (data.success) {
        if (data.data.completed) {
          // Interview completed
          const evaluationData = data.data as InterviewEvaluation;

          // Save token balance BEFORE refresh
          const previousBalance = profile?.tokens || 0;

          setState({
            ...state,
            evaluation: evaluationData,
            step: 4,
          });
          await refreshProfile();

          // Get new balance after refresh and show token consumption toast
          const newBalance = useUserStore.getState().profile?.tokens || 0;
          showTokenConsumptionToast(previousBalance, newBalance);
        } else {
          // Next question - preserve session_id from previous state
          const nextQuestion = data.data as InterviewSession;
          const updatedSession = {
            ...nextQuestion,
            session_id: interviewSession?.session_id || nextQuestion.session_id,
          };
          setState({
            ...state,
            interviewSession: updatedSession,
            currentAnswer: '',
          });
          resetTranscript();
          // Auto-play next question
          setTimeout(() => {
            playAudio(nextQuestion.question_audio);
          }, 500);
        }
      }
    },
    onError: (error: unknown) => {
      console.error('Answer mutation error:', error);

      // Handle different error formats
      const err = error as {
        error?: string | { name?: string; message?: string };
        message?: string;
        current_balance?: number;
        need_to_purchase?: number;
      };

      // Extract error message from various formats
      let errorMessage = 'Terjadi kesalahan';

      if (typeof err?.error === 'string') {
        errorMessage = err.error;
      } else if (typeof err?.error === 'object' && err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      const currentBalance = err?.current_balance;
      const needToPurchase = err?.need_to_purchase;

      if (
        errorMessage === 'Insufficient tokens' &&
        currentBalance !== undefined
      ) {
        toast.error(
          `Token anda kurang (${currentBalance}). Butuh ${needToPurchase} token lagi.`
        );
      } else if (errorMessage === 'Premium subscription required') {
        toast.error('Fitur ini memerlukan langganan premium');
      } else {
        // Show more readable error message
        toast.error(errorMessage);
      }
    },
  });

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setState({ ...state, formData: { ...formData, cvFile: file } });
        uploadCVMutation.mutate(file);
      } else {
        toast.error('Harap upload file PDF');
      }
    }
  };

  const handleStartInterview = () => {
    startInterviewMutation.mutate();
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Harap jawab pertanyaan terlebih dahulu');
      return;
    }
    if (listening) {
      stopListening();
    }
    answerMutation.mutate();
  };

  const handleDownloadPDF = () => {
    if (!evaluation) {
      toast.error('Tidak ada hasil untuk didownload');
      return;
    }

    try {
      const interviewTypeLabel =
        formData.jenisInterview === 'beasiswa'
          ? `Beasiswa ${formData.namaBeasiswa} (${
              formData.bahasa === 'english' ? 'English' : 'Indonesia'
            })`
          : `Magang ${formData.posisiMagang}`;

      const doc = generatePDF({
        title: 'Hasil Evaluasi Interview',
        subtitle: 'Powered by ElevAI',
        content: evaluation.evaluation,
        userData: {
          Nama: formData.nama,
          'Jenis Interview': interviewTypeLabel,
          CV: formData.cvContent ? 'Diupload' : 'Tidak diupload',
        },
        qaHistory: evaluation.qa_history,
      });

      doc.save(
        `Interview-Evaluation-${formData.nama}-${new Date().getTime()}.pdf`
      );
      toast.success('PDF berhasil didownload!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF');
    }
  };

  const handleRestartInterview = () => {
    // Clear session storage first
    sessionStorage.removeItem('feature_state_interview-simulation');
    // Then reset state completely
    setState({
      step: 1,
      formData: {
        nama: '',
        cvFile: null,
        cvContent: '',
        jenisInterview: '',
        bahasa: '',
        namaBeasiswa: '',
        posisiMagang: '',
      },
      interviewSession: null,
      currentAnswer: '',
      evaluation: null,
    });
    resetTranscript();
  };

  const isStep1Valid = formData.nama.trim() !== '';
  const isStep2Valid =
    formData.jenisInterview &&
    ((formData.jenisInterview === 'beasiswa' &&
      formData.bahasa &&
      formData.namaBeasiswa) ||
      (formData.jenisInterview === 'magang' && formData.posisiMagang));

  // Evaluation Result Screen
  if (step === 4 && evaluation) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            Hasil Evaluasi Interview
          </h2>
          <p className="text-muted-foreground">
            Berikut adalah evaluasi lengkap dari performa interview Anda.
          </p>
        </div>

        <Button onClick={handleDownloadPDF} className="w-full" size="lg">
          <Download className="w-4 h-4" />
          Download Laporan PDF
        </Button>

        {/* Full Evaluation (Markdown) */}
        <Card className="p-6 bg-card/50 border-border/50">
          <h3 className="font-bold text-xl mb-4 text-primary">
            📋 Hasil Evaluasi Interview
          </h3>
          <MarkdownRenderer>{evaluation.evaluation}</MarkdownRenderer>
        </Card>

        {/* Q&A History */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-primary">
            💬 Riwayat Pertanyaan & Jawaban
          </h3>
          {evaluation.qa_history.map((qa, idx) => (
            <Card key={idx} className="p-6 bg-card/50 border-border/50">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-primary">
                    Pertanyaan {idx + 1}:
                  </p>
                  <p className="text-muted-foreground italic">{qa.question}</p>
                </div>
                <div>
                  <p className="font-semibold">Jawaban Anda:</p>
                  <p className="text-muted-foreground">{qa.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleRestartInterview}
          size="lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Mulai Interview Baru
        </Button>
      </div>
    );
  }

  // Interview Session Screen
  if (step === 3 && interviewSession) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Pertanyaan {interviewSession.question_number} dari{' '}
            {interviewSession.total_questions}
          </h2>
          <div className="flex gap-2">
            {Array.from({ length: interviewSession.total_questions }).map(
              (_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx + 1 < interviewSession.question_number
                      ? 'bg-green-500'
                      : idx + 1 === interviewSession.question_number
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              )
            )}
          </div>
        </div>{' '}
        {/* Question Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary mb-2">
                  Interviewer:
                </p>
                <div className="text-lg">
                  <MarkdownRenderer>
                    {interviewSession.question}
                  </MarkdownRenderer>
                </div>
              </div>
            </div>

            {/* Audio Player */}
            <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg">
              <Button size="lg" onClick={toggleAudio} variant="outline">
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <div className="flex-1">
                <p className="text-sm font-semibold">Audio Pertanyaan</p>
                <p className="text-xs text-muted-foreground">
                  Dengarkan pertanyaan dalam audio
                </p>
              </div>
              <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
            </div>
          </div>
        </Card>
        {/* Answer Input with Mic */}
        <Card className="p-6 bg-card/50 border-border/50">
          <Label className="text-lg font-semibold mb-4 block">
            Jawaban Anda:
          </Label>

          {(!browserSupportsSpeechRecognition || speechError) && (
            <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
                ⚠️ Speech Recognition Tidak Tersedia
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {speechError ||
                  'Browser Anda tidak mendukung speech recognition. Silakan ketik jawaban Anda.'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Gunakan <strong>Chrome</strong>, <strong>Edge</strong>,
                atau <strong>Safari</strong> untuk fitur speech-to-text.
              </p>
            </div>
          )}

          {/* Microphone Button with Side Audio Waves */}
          {browserSupportsSpeechRecognition && (
            <div className="flex justify-center items-center gap-6 mb-6">
              {/* Left Audio Wave */}
              {listening && (
                <div className="flex gap-1 items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`left-${i}`}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Microphone Button */}
              <button
                onClick={listening ? stopListening : startListening}
                disabled={isPlaying}
                className={`relative p-8 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-muted cursor-not-allowed opacity-50'
                    : listening
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50 scale-110'
                    : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50'
                }`}
              >
                {listening ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}

                {/* Animated Ring when Recording */}
                {listening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse"></div>
                  </>
                )}
              </button>

              {/* Right Audio Wave */}
              {listening && (
                <div className="flex gap-1 items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`right-${i}`}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {listening && (
            <div className="mb-4 text-center">
              <span className="text-sm text-red-500 font-semibold">
                🎙️ Merekam...
              </span>
            </div>
          )}

          <textarea
            value={currentAnswer}
            onChange={(e) => {
              if (!listening && !isPlaying) {
                setState({ ...state, currentAnswer: e.target.value });
              }
            }}
            placeholder={
              isPlaying
                ? '⏸️ Audio pertanyaan sedang diputar...'
                : listening
                ? '🎙️ Sedang merekam...'
                : 'Klik tombol mic untuk mulai berbicara, atau ketik jawaban Anda di sini...'
            }
            className={`w-full min-h-[200px] p-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              listening || isPlaying ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            readOnly={listening || isPlaying}
            disabled={isPlaying}
          />

          {isPlaying && (
            <p className="text-xs text-muted-foreground mt-2">
              ⏸️ Tunggu audio pertanyaan selesai diputar untuk mulai menjawab
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setState({ ...state, currentAnswer: '' });
                resetTranscript();
              }}
              disabled={listening || isPlaying}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              disabled={
                answerMutation.isPending ||
                !currentAnswer.trim() ||
                listening ||
                isPlaying
              }
              className="flex-1"
              size="lg"
            >
              {answerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : interviewSession.question_number === 5 ? (
                <>
                  Submit Jawaban & Lihat Evaluasi
                  <CheckCircle2 className="w-5 h-5" />
                </>
              ) : (
                <>
                  Submit Jawaban
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {step === 1 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Siapa Nama Panggilan Anda?
            </h2>
          </div>
          <p className="text-muted-foreground">
            Nama ini akan digunakan oleh AI selama sesi interview.
          </p>

          <Input
            placeholder="Contoh: Budi"
            value={formData.nama}
            onChange={(e) =>
              setState({
                ...state,
                formData: { ...formData, nama: e.target.value },
              })
            }
            className="text-lg"
          />

          <Button
            className="w-full"
            size="lg"
            disabled={!isStep1Valid}
            onClick={() => setStep(2)}
          >
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Pengaturan Sesi</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload CV (Opsional)
              </Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 text-center transition-smooth cursor-pointer ${
                  uploadCVMutation.isPending
                    ? 'border-primary bg-primary/5'
                    : formData.cvFile
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() =>
                  !uploadCVMutation.isPending &&
                  document.getElementById('cv-upload')?.click()
                }
              >
                {uploadCVMutation.isPending ? (
                  <>
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-sm text-primary font-semibold">
                      Mengupload & Mengekstrak CV...
                    </p>
                  </>
                ) : formData.cvFile ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formData.cvFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CV berhasil diupload dan diekstrak
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Pilih File PDF...
                    </p>
                  </>
                )}
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleCVUpload}
                  disabled={uploadCVMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Jenis Interview</Label>
              <div className="grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setState({
                      ...state,
                      formData: {
                        ...formData,
                        jenisInterview: 'beasiswa',
                        posisiMagang: '',
                      },
                    })
                  }
                  className={`py-3 px-4 transition-smooth ${
                    formData.jenisInterview === 'beasiswa'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  Beasiswa
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setState({
                      ...state,
                      formData: {
                        ...formData,
                        jenisInterview: 'magang',
                        bahasa: '',
                        namaBeasiswa: '',
                      },
                    })
                  }
                  className={`py-3 px-4 border-l border-border transition-smooth ${
                    formData.jenisInterview === 'magang'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-muted/50'
                  }`}
                >
                  Magang
                </button>
              </div>
            </div>

            {formData.jenisInterview === 'beasiswa' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Bahasa
                  </Label>
                  <Select
                    value={formData.bahasa}
                    onValueChange={(value) =>
                      setState({
                        ...state,
                        formData: { ...formData, bahasa: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indonesia">🇮🇩 Indonesia</SelectItem>
                      <SelectItem value="english">🇬🇧 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nama Beasiswa</Label>
                  <Input
                    placeholder="Masukkan nama beasiswa"
                    value={formData.namaBeasiswa}
                    onChange={(e) =>
                      setState({
                        ...state,
                        formData: { ...formData, namaBeasiswa: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {formData.jenisInterview === 'magang' && (
              <div className="space-y-2 animate-fade-in">
                <Label>Posisi Magang</Label>
                <Input
                  placeholder="Contoh: Software Engineer Intern at Google"
                  value={formData.posisiMagang}
                  onChange={(e) =>
                    setState({
                      ...state,
                      formData: { ...formData, posisiMagang: e.target.value },
                    })
                  }
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={!isStep2Valid || startInterviewMutation.isPending}
              onClick={handleStartInterview}
            >
              {startInterviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memulai...
                </>
              ) : (
                <>
                  Mulai Interview
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
