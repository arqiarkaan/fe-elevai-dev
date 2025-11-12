import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CustomCursor } from '@/components/CustomCursor';
import { FeatureLayout } from '@/features/FeatureLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Import all feature components
import { IkigaiFeature } from '@/features/ikigai/IkigaiFeature';
import { SwotFeature } from '@/features/swot/SwotFeature';
import { InterviewFeature } from '@/features/interview/InterviewFeature';
import { EssayExchangeFeature } from '@/features/essay-exchange/EssayExchangeFeature';
import { EssayGeneratorFeature } from '@/features/essay-generator/EssayGeneratorFeature';
import { KtiGeneratorFeature } from '@/features/kti-generator/KtiGeneratorFeature';
import { BusinessPlanFeature } from '@/features/business-plan/BusinessPlanFeature';
import { VeoPromptingFeature } from '@/features/veo-prompting/VeoPromptingFeature';
import { PromptEnhancerFeature } from '@/features/prompt-enhancer/PromptEnhancerFeature';
import { InstagramBioFeature } from '@/features/instagram-bio/InstagramBioFeature';
import { LinkedInOptimizerFeature } from '@/features/linkedin-optimizer/LinkedInOptimizerFeature';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Feature Routes nested under dashboard with State Preservation */}
          <Route
            path="/dashboard/features"
            element={
              <ProtectedRoute>
                <FeatureLayout />
              </ProtectedRoute>
            }
          >
            {/* Student Development */}
            <Route path="ikigai" element={<IkigaiFeature />} />
            <Route path="swot" element={<SwotFeature />} />
            <Route path="interview-simulation" element={<InterviewFeature />} />

            {/* Asisten Lomba */}
            <Route path="essay-exchanges" element={<EssayExchangeFeature />} />
            <Route path="essay-generator" element={<EssayGeneratorFeature />} />
            <Route path="kti-generator" element={<KtiGeneratorFeature />} />
            <Route path="business-plan" element={<BusinessPlanFeature />} />

            {/* Personal Branding */}
            <Route path="instagram-bio" element={<InstagramBioFeature />} />
            <Route
              path="linkedin-optimizer"
              element={<LinkedInOptimizerFeature />}
            />

            {/* Daily Tools */}
            <Route path="veo-prompting" element={<VeoPromptingFeature />} />
            <Route path="prompt-enhancer" element={<PromptEnhancerFeature />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
