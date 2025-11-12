# API Endpoints Reference

Quick reference untuk semua available endpoints.

## Legend
- 🔓 Public (no auth required)
- 🔒 Protected (requires authentication)
- 💎 Premium (requires premium subscription)
- 💰 Paid (consumes tokens)

---

## Health & Info

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | 🔓 | Root API info |
| GET | `/health` | 🔓 | Health check |
| GET | `/features` | 🔓 | List all features |

---

## Payment

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payment/plans` | 🔓 | Get subscription & token plans |
| POST | `/api/payment/create` | 🔒 | Create payment transaction |
| POST | `/api/payment/webhook` | 🔓 | Midtrans webhook (internal) |

---

## User Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/user/profile` | 🔒 | Get user profile |
| GET | `/api/user/tokens` | 🔒 | Get token balance & logs |
| GET | `/api/user/transactions` | 🔒 | Get transaction history |
| GET | `/api/user/usage` | 🔒 | Get feature usage statistics |
| GET | `/api/user/subscription` | 🔒 | Get subscription status |

---

## Student Development

### Ikigai Self Discovery
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/student-development/ikigai/stage1` | 🔒💎💰 | 7-8 tokens |
| POST | `/api/student-development/ikigai/final` | 🔒💎💰 | 7-8 tokens |

**Total for complete flow**: 15 tokens

### SWOT Self-Analysis
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/student-development/swot` | 🔒💎💰 | 10 tokens |

### Essay Exchanges
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/student-development/essay-exchanges` | 🔒💎💰 | 12 tokens |

### Interview Simulation
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/student-development/interview/upload-cv` | 🔒 | Free (PDF extraction) |
| POST | `/api/student-development/interview/start` | 🔒💎 | 0 tokens (start) |
| POST | `/api/student-development/interview/answer` | 🔒💎💰 | 20 tokens (on completion) |

**Note**: 
- CV upload is optional, extracts text from PDF
- Tokens charged only when interview completed (after 5th question)

---

## Asisten Lomba

| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/asisten-lomba/essay-idea` | 🔒💰 | 5 tokens |
| POST | `/api/asisten-lomba/kti-idea` | 🔒💰 | 6 tokens |
| POST | `/api/asisten-lomba/business-plan` | 🔒💰 | 8 tokens |

---

## Personal Branding

### Instagram Bio Analyzer
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/personal-branding/instagram-bio/upload-image` | 🔒 | Free (OCR extraction) |
| POST | `/api/personal-branding/instagram-bio/analyze` | 🔒💎 | 0 tokens (stage 1) |
| POST | `/api/personal-branding/instagram-bio/generate` | 🔒💎💰 | 8 tokens |

**Note**:
- Image upload required (screenshot of Instagram bio)
- Uses Gemini Vision for text extraction
- **Total for complete flow**: 8 tokens

### LinkedIn Profile Optimizer
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/personal-branding/linkedin-optimizer` | 🔒💎💰 | 10 tokens |

---

## Daily Tools

### Generator Prompt Veo
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/daily-tools/prompt-veo` | 🔒💰 | 3 tokens |

### Prompt Enhancer
| Method | Endpoint | Auth | Cost |
|--------|----------|------|------|
| POST | `/api/daily-tools/prompt-enhancer/topik-baru` | 🔒💰 | 2 tokens |
| POST | `/api/daily-tools/prompt-enhancer/tugas` | 🔒💰 | 2 tokens |
| POST | `/api/daily-tools/prompt-enhancer/konten` | 🔒💰 | 2 tokens |
| POST | `/api/daily-tools/prompt-enhancer/rencana` | 🔒💰 | 2 tokens |
| POST | `/api/daily-tools/prompt-enhancer/brainstorming` | 🔒💰 | 2 tokens |
| POST | `/api/daily-tools/prompt-enhancer/koding` | 🔒💰 | 2 tokens |

---

## Request Headers

All protected endpoints require:
```
Authorization: Bearer <supabase-jwt-token>
Content-Type: application/json
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "error message"
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (no/invalid token) |
| 402 | Payment Required (insufficient tokens) |
| 403 | Forbidden (premium required) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| General API | 100 requests | 15 minutes |
| Feature endpoints | 10 requests | 1 minute |
| Auth endpoints | 5 requests | 15 minutes |

---

## Feature Categories

### 1. Student Development (Premium 💎)
- Ikigai Self Discovery
- SWOT Self-Analysis
- Essay Exchanges
- Interview Simulation

### 2. Asisten Lomba (Free)
- Essay Idea Generator
- KTI Idea Generator
- Business Plan Generator

### 3. Personal Branding (Premium 💎)
- Instagram Bio Analyzer
- LinkedIn Profile Optimizer

### 4. Daily Tools (Free)
- Generator Prompt Veo
- Prompt Enhancer (6 types)

---

## Token Costs Summary

| Feature | Category | Cost | Premium? |
|---------|----------|------|----------|
| Ikigai Self Discovery | Student Dev | 15 | ✅ |
| SWOT Self-Analysis | Student Dev | 10 | ✅ |
| Essay Exchanges | Student Dev | 12 | ✅ |
| Interview Simulation | Student Dev | 20 | ✅ |
| Essay Idea Generator | Asisten Lomba | 5 | ❌ |
| KTI Idea Generator | Asisten Lomba | 6 | ❌ |
| Business Plan Generator | Asisten Lomba | 8 | ❌ |
| Instagram Bio Analyzer | Personal Brand | 8 | ✅ |
| LinkedIn Optimizer | Personal Brand | 10 | ✅ |
| Generator Prompt Veo | Daily Tools | 3 | ❌ |
| Prompt Enhancer (each) | Daily Tools | 2 | ❌ |

---

## Example Request Flow

### 1. User Registration (Frontend → Supabase)
```
1. User signs up via Supabase Auth
2. Profile automatically created in profiles table
3. User gets 5 free tokens
```

### 2. Check Balance
```
GET /api/user/tokens
→ Returns current token balance
```

### 3. Use Feature
```
POST /api/asisten-lomba/essay-idea
→ Checks authentication
→ Checks token balance
→ Consumes tokens
→ Returns generated content
```

### 4. Buy More Tokens
```
POST /api/payment/create
→ Creates Midtrans transaction
→ User completes payment
→ Webhook updates tokens
```

---

## Testing Checklist

- [ ] Health check works
- [ ] Features list returns data
- [ ] Authentication works with Supabase JWT
- [ ] Token consumption works correctly
- [ ] Premium check blocks free users
- [ ] Payment creation works
- [ ] LLM responses are generated
- [ ] Error handling works properly
- [ ] Rate limiting activates
- [ ] Webhook processes payments

---

For detailed request/response examples, see [API_EXAMPLES.md](./API_EXAMPLES.md)
