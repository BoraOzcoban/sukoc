# SuKoç - Su Tasarrufu Rehberi

SuKoç, su kullanım alışkanlıklarınızı analiz eden ve kişiselleştirilmiş tasarruf önerileri sunan modern bir web uygulamasıdır.

## 🚀 Özellikler

- **Kişiselleştirilmiş Analiz**: Ev tipiniz, bölgeniz ve alışkanlıklarınıza göre özel öneriler
- **Etkileşimli Quiz**: Su kullanım alışkanlıklarınızı keşfeden akıllı sorular
- **Görsel Sonuçlar**: Detaylı grafikler ve karşılaştırmalı analizler
- **Uygulanabilir Öneriler**: Hemen hayata geçirebileceğiniz pratik çözümler
- **İlerleme Takibi**: Tasarruf hedeflerinizi takip edin ve başarılarınızı kutlayın
- **Meydan Okumalar**: Gamification ile eğlenceli su tasarrufu deneyimi

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** - Modern UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Hızlı build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **Framer Motion** - Animasyonlar
- **Recharts** - Grafikler
- **React i18next** - Çok dilli destek

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Tip güvenliği
- **SQLite** - Veritabanı (development)

### Testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 📦 Kurulum

### Gereksinimler
- Node.js 18.x veya üzeri
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın**
   ```bash
   git clone https://github.com/your-username/sukoc.git
   cd sukoc
   ```

2. **Frontend bağımlılıklarını yükleyin**
   ```bash
   npm install
   ```

3. **Backend bağımlılıklarını yükleyin**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Geliştirme sunucularını başlatın**

   **Frontend (Terminal 1):**
   ```bash
   npm run dev
   ```

   **Backend (Terminal 2):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Note:** If you encounter Node.js compatibility issues, the backend will automatically use the JavaScript version. For TypeScript support, ensure you have Node.js 16+ and run `npm run dev:ts` instead.

5. **Tarayıcıda açın**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🧪 Test

### Unit Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Tests
```bash
npx playwright test
```

## 🏗️ Build

### Frontend
```bash
npm run build
```

### Backend
```bash
cd backend
npm run build
```

## 📁 Proje Yapısı

```
sukoc/
├── src/                    # Frontend kaynak kodları
│   ├── components/         # React bileşenleri
│   │   ├── ui/            # Temel UI bileşenleri
│   │   ├── quiz/          # Quiz bileşenleri
│   │   └── results/       # Sonuç bileşenleri
│   ├── pages/             # Sayfa bileşenleri
│   ├── store/             # Zustand store
│   ├── utils/             # Yardımcı fonksiyonlar
│   ├── data/              # Statik veriler
│   └── i18n/              # Çok dilli dosyalar
├── backend/               # Backend kaynak kodları
│   ├── src/
│   │   ├── routes/        # API route'ları
│   │   └── types/         # TypeScript tipleri
│   └── package.json
├── e2e/                   # E2E test dosyaları
├── public/                # Statik dosyalar
└── docs/                  # Dokümantasyon
```

## 🎯 API Endpoints

### Quiz Answers
- `POST /api/answers` - Quiz cevaplarını kaydet
- `PUT /api/answers/:sessionId/complete` - Quiz'i tamamlandı olarak işaretle
- `GET /api/answers/:userId` - Kullanıcının quiz geçmişini getir

### Suggestions
- `GET /api/suggestions` - Tüm önerileri getir
- `GET /api/suggestions/:category` - Kategoriye göre öneriler
- `GET /api/suggestions/user/:userId` - Kişiselleştirilmiş öneriler

### Analytics
- `GET /api/analytics` - Genel analitik veriler
- `GET /api/analytics/usage-trends` - Kullanım trendleri
- `GET /api/analytics/suggestions/effectiveness` - Öneri etkinlik verileri

## 🌍 Çok Dilli Destek

Uygulama şu anda Türkçe dilini desteklemektedir. Yeni diller eklemek için:

1. `src/i18n/locales/` klasörüne yeni dil dosyası ekleyin
2. `src/i18n/index.ts` dosyasında yeni dili kaydedin

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# dist/ klasörünü deploy edin
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# dist/ klasörünü deploy edin
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🆘 Destek

Sorularınız için:
- GitHub Issues kullanın
- Email: support@sukoc.com

## 🙏 Teşekkürler

- React ekibine harika bir framework için
- TailwindCSS ekibine güzel styling sistemi için
- Tüm açık kaynak katkıda bulunanlara

---

**SuKoç** - Su tasarrufu için akıllı çözümler 💧🌱
