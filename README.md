# SHAHARIYAR.EXE

> **An Unconventional, Premium, Interactive Developer Portfolio**  
> Designed and built for **Shahariyar Khan Rashad** — Aspiring AI Engineer.

---

## ✦ Overview

**SHAHARIYAR.EXE** is an award-winning digital experience that breaks away from generic portfolio templates. It fuses **experimental editorial magazine design**, **modern Swiss typography**, and **futuristic aesthetics** to create an unforgettable personal identity.

- **Warm Ivory (`#F7F4EC`)** & **Deep Espresso (`#211F1B`)** alternating rhythm
- **Champagne Gold (`#C6A76B`)** surgical accents
- **Editorial Typography**: *Playfair Display* paired with *Space Grotesk*, *DM Sans*, and *Manrope*
- **IRIS — AI Companion**: Interactive intelligent mascot powered by Google Gemini API & local knowledge base
- **Motion System**: Built with *Framer Motion* with strict reduced-motion accessibility

---

## ✦ Key Sections

1. **Hero**: Asymmetric full-screen layout, parallax mouse-tracking, oversized typography, artistic portrait framing, and interactive scroll indicator.
2. **About**: Magazine-spread editorial layout with pull quotes and 3 interactive identity cards.
3. **Education**: Minimal academic foundation highlighting Daffodil International University, Department of Software Engineering, Batch 44.
4. **Skills Universe**: Interactive orbital constellation with categorized technical competencies.
5. **Projects Showcase**: Editorial project gallery with expandable cards and accurate project statuses.
6. **Research & Exploration**: Future-facing academic focus across AI, Machine Learning, and Software Engineering.
7. **Achievements**: Highlighting *National Science Week — Regional Champion*.
8. **Contact**: Interactive social hubs, one-click email copying, and configured contact form via EmailJS.
9. **IRIS AI**: Floating mascot with facial animation, chat modal, suggested prompts, and contextual awareness.

---

## ✦ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Motion & Physics**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://greensock.com/)
- **Email Service**: [EmailJS](https://www.emailjs.com/)
- **AI Engine**: [Google Gemini 2.0 API](https://aistudio.google.com/)
- **Deployment**: [Netlify](https://www.netlify.com/)

---

## ✦ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/shahariyar542/SHAHARIYAR.EXE.git
cd SHAHARIYAR.EXE
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your configuration:
```env
# Google Gemini API Key for IRIS AI Companion
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# EmailJS Configuration for Contact Form
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

*(Note: Even without API keys configured, IRIS gracefully uses its rich internal local knowledge engine, and the contact form informs the user to email directly!)*

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## ✦ Netlify Deployment

This repository includes:
- `netlify.toml`: Preconfigured build commands and publish directories
- `public/_redirects`: Single Page Application (SPA) routing support

To deploy on Netlify:
1. Connect your GitHub repository to Netlify.
2. Set Build command to `npm run build` and Publish directory to `dist`.
3. Add the environment variables from your `.env` in the Netlify Dashboard (**Site Settings > Environment Variables**).
4. Deploy!

---

## ✦ Author

**Shahariyar Khan Rashad**  
*Aspiring AI Engineer*  
- **Email**: [khanshahariyar28@gmail.com](mailto:khanshahariyar28@gmail.com)  
- **LinkedIn**: [shahariyar-khan-rashad](https://www.linkedin.com/in/shahariyar-khan-rashad-66391a32a/)  
- **GitHub**: [@shahariyar542](https://github.com/shahariyar542)  
- **Facebook**: [khan.rashad.9887](https://www.facebook.com/khan.rashad.9887)  
