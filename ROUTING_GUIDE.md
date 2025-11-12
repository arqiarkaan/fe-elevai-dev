# 🚀 Feature Routing Guide

## Overview

Setiap feature di ElevAI sekarang memiliki URL path sendiri dengan state preservation. State akan disimpan saat refresh, tapi akan dihapus saat navigasi keluar dari feature.

## URL Structure

Semua feature accessible via `/dashboard/features/{feature-name}`:

### Student Development

- `/dashboard/features/ikigai` - Ikigai Analysis
- `/dashboard/features/swot` - SWOT Analysis
- `/dashboard/features/interview-simulation` - Interview Simulation

### Asisten Lomba

- `/dashboard/features/essay-exchanges` - Essay Exchange
- `/dashboard/features/essay-generator` - Essay Generator
- `/dashboard/features/kti-generator` - KTI Generator
- `/dashboard/features/business-plan` - Business Plan

### Personal Branding

- `/dashboard/features/instagram-bio` - Instagram Bio Generator
- `/dashboard/features/linkedin-optimizer` - LinkedIn Profile Optimizer

### Daily Tools

- `/dashboard/features/veo-prompting` - VEO Prompting
- `/dashboard/features/prompt-enhancer` - Prompt Enhancer

## State Preservation

### Using `useFeatureState` Hook

Gunakan hook ini untuk state yang ingin di-preserve saat refresh:

```tsx
import { useFeatureState } from '@/hooks/useFeatureState';

export const YourFeature = () => {
  // Define initial state
  const [state, setState] = useFeatureState(
    {
      step: 1,
      input: '',
      result: null,
      // ... other state
    },
    'your-feature-name' // harus match dengan route name
  );

  // Use state
  const handleNext = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleInput = (value: string) => {
    setState((prev) => ({ ...prev, input: value }));
  };

  return (
    <div>
      <h1>Step {state.step}</h1>
      <input
        value={state.input}
        onChange={(e) => handleInput(e.target.value)}
      />
    </div>
  );
};
```

### Behavior

✅ **State TERSIMPAN ketika:**

- User refresh halaman (F5)
- User close dan reopen tab (dalam session yang sama)
- User navigate menggunakan browser back button (dalam satu session)

❌ **State DIHAPUS ketika:**

- User klik "Kembali ke Dashboard"
- User navigate ke route lain
- User close browser (sessionStorage)
- User logout

## Navigation Flow

```
/dashboard
  ↓ (click feature card)
/dashboard/features/{feature-name}
  ↓ (state preserved on refresh)
Refresh → State Tetap Ada
  ↓ (click back button)
/dashboard (state cleared)
```

## Implementation Details

### 1. App.tsx - Route Configuration

```tsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

<Route
  path="/dashboard/features"
  element={
    <ProtectedRoute>
      <FeatureLayout />
    </ProtectedRoute>
  }
>
  <Route path="ikigai" element={<IkigaiFeature />} />
  <Route path="swot" element={<SwotFeature />} />
  // ... other routes
</Route>
```

### 2. FeatureLayout.tsx - Wrapper dengan Navbar

- Menampilkan navbar yang konsisten
- Menangani tombol back
- Clear state saat keluar

### 3. useFeatureState Hook - State Management

- Simpan ke `sessionStorage`
- Auto load saat mount
- Auto save saat state berubah
- Auto clear saat unmount (jika navigasi keluar)

## Benefits

1. ✅ **Better UX** - User bisa refresh tanpa kehilangan progress
2. ✅ **Shareable Links** - Setiap feature punya URL sendiri
3. ✅ **Browser Navigation** - Back/forward button works
4. ✅ **Bookmarkable** - User bisa bookmark feature spesifik
5. ✅ **Testing** - Easier to test specific features directly

## Migration Guide

Untuk migrate existing feature:

1. Replace `useState` dengan `useFeatureState`:

```tsx
// Before
const [step, setStep] = useState(1);
const [input, setInput] = useState('');

// After
const [state, setState] = useFeatureState(
  { step: 1, input: '' },
  'feature-name'
);
```

2. Update state access:

```tsx
// Before
setStep(2);
setInput('value');

// After
setState((prev) => ({ ...prev, step: 2 }));
setState((prev) => ({ ...prev, input: 'value' }));
```

3. Feature sudah otomatis punya routing dari App.tsx

## Example: Full Feature with State Preservation

Lihat `src/features/prompt-enhancer/PromptEnhancerFeature.tsx` sebagai referensi implementasi lengkap.

## Notes

- Feature name di `useFeatureState` **harus match** dengan route path
- Gunakan `sessionStorage` (auto clear saat tab close), bukan `localStorage`
- State structure bisa nested object atau array
- Hook automatically handles JSON serialization
