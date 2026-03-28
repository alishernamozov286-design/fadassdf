# 🌐 AI Translator

Full-stack AI-powered translation web application using Groq API, React, TypeScript, and Node.js.

## ✨ Features

- 🤖 AI-powered translations using Groq's Llama3-70B model
- 🎨 Modern dark blue gradient UI with Tailwind CSS
- ⚡ Real-time translation
- 📋 Copy to clipboard functionality
- 🔊 Text-to-speech for translated text
- 🌍 Support for 12+ languages
- 🔄 Loading states and error handling
- 📱 Fully responsive design
- ⌨️ Keyboard shortcuts (Ctrl+Enter to translate)
- 📲 PWA support - Install as mobile/desktop app
- 🚀 Offline capability with Service Worker
- 🎯 Auto-formatting text input
- 🌐 Works on all devices and screen sizes

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- Axios
- dotenv
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- PWA (Progressive Web App)
- Service Worker
- Web Manifest

### AI
- Groq API (llama3-70b-8192 model)

## 📁 Project Structure

```
ai-translator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── groq.js
│   │   ├── controllers/
│   │   │   └── translationController.js
│   │   ├── routes/
│   │   │   └── translationRoutes.js
│   │   ├── services/
│   │   │   └── translationService.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Translator.tsx
    │   ├── services/
    │   │   └── translationService.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Groq API key (already configured)

### Quick Start

1. Install all dependencies (first time only):
```bash
npm run install:all
```

2. Start both backend and frontend:
```bash
npm run dev
```

That's it! Both servers will start automatically.

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

### Alternative Commands

```bash
# Start everything (same as npm run dev)
npm start

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend
```

### Environment Variables

Create a `.env` file in the `backend/` directory:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

Get your Groq API key from: https://console.groq.com/keys

## 🎯 Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and go to `http://localhost:5173`
3. Enter text in the input area
4. Select target language from the dropdown
5. Click "Translate" button or press Ctrl+Enter
6. View the translated text
7. Click "Copy" to copy the result to clipboard

## 🌍 Supported Languages

- English
- O'zbek (Uzbek)
- Русский (Russian)
- Español (Spanish)
- Français (French)
- Deutsch (German)
- 中文 (Chinese)
- العربية (Arabic)
- Türkçe (Turkish)
- 한국어 (Korean)

## 📡 API Endpoints

### POST /api/translate

Translate text to target language.

**Request Body:**
```json
{
  "text": "Hello world",
  "targetLang": "Uzbek"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalText": "Hello world",
    "translatedText": "Salom dunyo",
    "targetLang": "Uzbek"
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "AI Translator API is running"
}
```

## 🎨 UI Features

- Dark theme with blue gradient accents
- Smooth animations and transitions
- Loading spinner during translation
- Error messages with icons
- Copy confirmation feedback
- Responsive design for all screen sizes
- Modern glassmorphism effects

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

## 📝 Notes

- The Groq API key is already configured in the `.env` file
- Make sure to keep your API key secure and never commit it to public repositories
- The backend must be running for the frontend to work properly
- CORS is enabled for local development

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License

---

Built with ❤️ using React, TypeScript, Node.js, and Groq AI


## 📱 PWA (Progressive Web App)

This application is a full-featured PWA that can be installed on any device!

### PWA Features

- ✅ **Installable** - Add to home screen on mobile/desktop
- ✅ **Offline Support** - Works without internet connection
- ✅ **Fast Loading** - Service Worker caching
- ✅ **Responsive** - Adapts to all screen sizes
- ✅ **App-like Experience** - Runs in standalone mode

### Install on Mobile

#### Android:
1. Open the app in Chrome browser
2. Tap the "Install" prompt that appears
3. Or tap menu (⋮) → "Add to Home screen"

#### iOS (iPhone/iPad):
1. Open the app in Safari browser
2. Tap the Share button (□↑)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Install on Desktop

#### Chrome/Edge:
1. Click the install icon (⊕) in the address bar
2. Or click menu (⋮) → "Install AI Translator"

### PWA Icons

The app includes optimized icons for all devices:
- 72x72, 96x96, 128x128, 144x144, 152x152
- 192x192 (standard), 384x384, 512x512 (high-res)

### Generate Custom Icons

To create icons from your own image:

1. Place your image in `frontend/public/` as `AI-powered translation in action.png`
2. Run:
```bash
cd frontend
npm run generate-icons
```

### Build PWA for Production

```bash
cd frontend
npm run build
npm run preview
```

### Test PWA Quality

Use Chrome DevTools Lighthouse:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"

### PWA Configuration Files

- `frontend/vite.config.ts` - Vite PWA plugin settings
- `frontend/public/manifest.json` - Web app manifest
- `frontend/src/components/PWAInstallPrompt.tsx` - Install prompt component

### Responsive Breakpoints

The app adapts to these screen sizes:
- **xs**: 475px+ (extra small phones)
- **sm**: 640px+ (small phones)
- **md**: 768px+ (tablets)
- **lg**: 1024px+ (small laptops)
- **xl**: 1280px+ (desktops)
- **2xl**: 1536px+ (large screens)

For more details, see [PWA_GUIDE.md](PWA_GUIDE.md)
