/**
 * Centralized API types for better type safety
 */

// Common API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// Error Response
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  current_balance?: number;
  need_to_purchase?: number;
}

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tokens: number;
  is_premium: boolean;
  premium_plan: string | null;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// Feature
export interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  isPremium: boolean;
  tokenCost: number;
  endpoint: string;
}

// Payment Plans
export interface SubscriptionPlan {
  name: string;
  duration: string;
  price: number;
  tokens: number;
  description: string;
  isBestValue: boolean;
}

export interface TokenPackage {
  name: string;
  amount: number;
  price: number;
  description: string;
  isBestValue: boolean;
}

export interface PaymentPlans {
  subscriptions: Record<string, SubscriptionPlan>;
  tokens: Record<string, TokenPackage>;
}

// Payment Transaction
export interface PaymentTransaction {
  snap_token: string;
  order_id: string;
}

// Ikigai Responses
export interface IkigaiStage1Response {
  ikigai_spots: Array<{ title: string; description: string }>;
  life_purposes: Array<{ statement: string }>;
  tokens_used?: number;
}

export interface IkigaiFinalResponse {
  analysis: string;
  stage1_data: unknown;
  tokens_used?: number;
}

// SWOT Response
export interface SwotResponse {
  analysis: string;
  tokens_used?: number;
}

// Essay Exchange Response
export interface EssayExchangeResponse {
  essay: string;
  tokens_used?: number;
}

// Interview Responses
export interface InterviewSession {
  session_id: string;
  question: string;
  question_audio: string;
  question_number: number;
  total_questions: number;
}

export interface InterviewEvaluation {
  completed: true;
  qa_history: Array<{
    question: string;
    answer: string;
  }>;
  evaluation: string;
  tokens_used: number;
}

export interface CVUploadResponse {
  cv_text: string;
}

// Personal Branding Responses
export interface InstagramBioImageResponse {
  bio_content: string;
}

export interface InstagramBioAnalysisResponse {
  analysis: string;
  tokens_used?: number;
}

export interface InstagramBioGenerateResponse {
  bio: string;
  tokens_used?: number;
}

export interface LinkedInOptimizerResponse {
  optimized_profile: string;
  tokens_used?: number;
}

// Asisten Lomba Responses
export interface EssayIdeaResponse {
  ideas: string;
  tokens_used?: number;
}

export interface KtiIdeaResponse {
  ideas: string;
  tokens_used?: number;
}

export interface BusinessPlanResponse {
  business_plan: string;
  tokens_used?: number;
}

// Daily Tools Responses
export interface PromptVeoResponse {
  prompt: string;
  tokens_used?: number;
}

export interface PromptEnhancerResponse {
  enhanced_prompt?: string;
  result?: string;
  prompt?: string;
  improved_prompt?: string;
  tokens_used?: number;
}
