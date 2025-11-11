import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Get authorization header with Supabase JWT token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('No active session');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

/**
 * Payment API
 */
export const paymentApi = {
  /**
   * Get available subscription plans and token packages
   */
  async getPlans() {
    const response = await fetch(`${API_BASE_URL}/api/payment/plans`);
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    return response.json();
  },

  /**
   * Create payment transaction
   */
  async createPayment(data: {
    type: 'subscription' | 'tokens';
    item: string;
    amount: number;
    tokens_amount?: number;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment');
    }

    return response.json();
  },
};

/**
 * User API
 */
export const userApi = {
  /**
   * Get user profile from API
   */
  async getProfile() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  /**
   * Get token balance
   */
  async getTokens() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/user/tokens`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token balance');
    }

    return response.json();
  },

  /**
   * Get transaction history
   */
  async getTransactions() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/user/transactions`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  },
};

/**
 * Student Development API
 */
export const studentDevelopmentApi = {
  /**
   * Ikigai Self Discovery - Stage 1
   */
  async ikigaiStage1(data: {
    nama: string;
    jurusan: string;
    semester: number;
    universitas: string;
    karirSesuaiJurusan: string;
    mbtiType: string;
    viaStrengths: string[];
    careerRoles: string[];
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/student-development/ikigai/stage1`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Ikigai Self Discovery - Final Analysis
   */
  async ikigaiFinal(data: {
    stage1Data: {
      nama: string;
      jurusan: string;
      semester: number;
      universitas: string;
      karirSesuaiJurusan: string;
      mbtiType: string;
      viaStrengths: string[];
      careerRoles: string[];
    };
    selectedIkigaiSpot: string;
    selectedSliceOfLife: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/student-development/ikigai/final`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * SWOT Self-Analysis
   */
  async swotAnalysis(data: {
    mbtiType: string;
    viaStrengths: string[];
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/student-development/swot`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Essay Exchanges
   */
  async essayExchange(data: {
    programName: string;
    negaraUniversitas: string;
    motivasiAkademik: string;
    motivasiPribadi: string;
    skillPengalaman: string;
    rencanKontribusi: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/student-development/essay-exchanges`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Interview Simulation - Upload CV
   */
  async interviewUploadCV(file: File) {
    const headers = await getAuthHeaders();
    const formData = new FormData();
    formData.append('cv', file);

    // Remove Content-Type header to let browser set it with boundary
    const headersWithoutContentType: Record<string, string> = { ...headers } as Record<string, string>;
    delete headersWithoutContentType['Content-Type'];

    const response = await fetch(`${API_BASE_URL}/api/student-development/interview/upload-cv`, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Interview Simulation - Start
   */
  async interviewStart(data: {
    namaPanggilan: string;
    cvContent?: string;
    jenisInterview: 'beasiswa' | 'magang';
    bahasa?: 'english' | 'indonesia';
    namaBeasiswa?: string;
    posisiMagang?: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/student-development/interview/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Interview Simulation - Submit Answer
   */
  async interviewAnswer(data: {
    sessionId: string;
    questionNumber: number;
    answer: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/student-development/interview/answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },
};

/**
 * Personal Branding API
 */
export const personalBrandingApi = {
  /**
   * Instagram Bio - Upload Image
   */
  async instagramBioUploadImage(file: File) {
    const headers = await getAuthHeaders();
    const formData = new FormData();
    formData.append('image', file);

    // Remove Content-Type header to let browser set it with boundary
    const headersWithoutContentType: Record<string, string> = { ...headers } as Record<string, string>;
    delete headersWithoutContentType['Content-Type'];

    const response = await fetch(`${API_BASE_URL}/api/personal-branding/instagram-bio/upload-image`, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Instagram Bio - Analyze
   */
  async instagramBioAnalyze(bioContent: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/personal-branding/instagram-bio/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ bioContent }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Instagram Bio - Generate
   */
  async instagramBioGenerate(data: {
    bioContent: string;
    analisisAwal: string;
    tujuanUtama: string;
    gayaTulisan: string;
    siapaKamu: string;
    targetAudiens: string;
    pencapaian: string[];
    callToAction: string;
    hashtag?: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/personal-branding/instagram-bio/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * LinkedIn Profile Optimizer
   */
  async linkedinOptimizer(data: {
    targetOptimasi: string;
    namaLengkap: string;
    jurusan: string;
    semester: number;
    targetKarir: string;
    tujuanUtama: string;
    targetRole: string;
    identitasProfesional: string;
    pencapaian: string[];
    skills: string[];
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/personal-branding/linkedin-optimizer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },
};

/**
 * Asisten Lomba API
 */
export const asistenLombaApi = {
  /**
   * Essay Idea Generator
   */
  async essayIdea(data: {
    temaUtama: string;
    subTema: string;
    latarBelakang?: string;
    sertakanPenjelasan?: boolean;
    sertakanMetode?: boolean;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/asisten-lomba/essay-idea`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * KTI Idea Generator
   */
  async ktiIdea(data: {
    temaUtama: string;
    subTema: string;
    latarBelakangUrgensi?: boolean;
    penelitianTerdahulu?: boolean;
    keterbaruan?: boolean;
    successRate?: boolean;
    langkahKonkret?: boolean;
    efisiensi?: boolean;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/asisten-lomba/kti-idea`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Business Plan Generator
   */
  async businessPlan(data: {
    deskripsiBisnis: string;
    ringkasanEksekutif?: boolean;
    analisisPasar?: boolean;
    strategiPemasaran?: boolean;
    keuangan?: boolean;
    analisisSWOT?: boolean;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/asisten-lomba/business-plan`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },
};

/**
 * Daily Tools API
 */
export const dailyToolsApi = {
  /**
   * Generator Prompt Veo
   */
  async promptVeo(data: {
    subjekUtama: string;
    aksiKegiatan: string;
    ekspresiEmosi?: string;
    lokasiTempat: string;
    waktu?: string;
    pencahayaan?: string;
    gerakanKamera?: string;
    gayaVideo?: string;
    suasanaVideo?: string;
    suaraMusik?: string;
    dialog?: string;
    detailTambahan?: string;
  }) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-veo`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Prompt Enhancer - Topik Baru
   */
  async promptEnhancerTopikBaru(prompt: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-enhancer/topik-baru`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Prompt Enhancer - Tugas
   */
  async promptEnhancerTugas(prompt: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-enhancer/tugas`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Prompt Enhancer - Konten
   */
  async promptEnhancerKonten(prompt: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-enhancer/konten`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Prompt Enhancer - Rencana
   */
  async promptEnhancerRencana(prompt: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-enhancer/rencana`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Prompt Enhancer - Brainstorming
   */
  async promptEnhancerBrainstorming(prompt: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-enhancer/brainstorming`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  /**
   * Prompt Enhancer - Koding
   */
  async promptEnhancerKoding(prompt: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/daily-tools/prompt-enhancer/koding`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },
};

/**
 * Direct Supabase queries for faster access
 */
export const supabaseQueries = {
  /**
   * Get user profile directly from Supabase
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user tokens directly from Supabase
   */
  async getTokenBalance(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data.tokens;
  },

  /**
   * Check if user is premium
   */
  async isPremium(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium, premium_expires_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Check if premium and not expired
    if (!data.is_premium) return false;
    if (!data.premium_expires_at) return data.is_premium;

    const expiryDate = new Date(data.premium_expires_at);
    return expiryDate > new Date();
  },
};
