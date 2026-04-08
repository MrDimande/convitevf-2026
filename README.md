<div align="center">

# 💍 Convite Digital Premium — Vânia & Fabião

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Responsive](https://img.shields.io/badge/100%25-Responsive-28a745?style=flat-square)](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/CSS_layout/Responsive_Design)

**Uma experiência imersiva e elegante para celebrar o amor**  
*09 de Maio de 2026 • Maputo, Moçambique*

[🌐 Ver Demo](https://vaniaefabiao2026.com) • [📱 Scan QR Code](#qr-code) • [💒 Detalhes do Evento](#eventos)

</div>

---

## ✨ Destaques

| Recurso | Descrição | Tecnologia |
|---------|-----------|------------|
| 🎨 **Design Premium** | Tema dourado com tipografia elegante e animações fluidas | CSS3 + Google Fonts |
| 📸 **Upload de Fotos** | Galeria colaborativa com Cloudinary em HD | Cloudinary Widget |
| 🍷 **Pedido de Bebidas** | Selecção interactiva integrada com WhatsApp | JavaScript + WhatsApp API |
| 🎵 **Música Ambiente** | Player flutuante com controles intuitivos | Web Audio API |
| 📱 **100% Responsivo** | Experiência perfeita em todos os dispositivos | CSS Grid + Flexbox |
| ⚡ **Performance** | Carregamento optimizado e lazy loading | Intersection Observer |

---

## 🗂️ Arquitetura do Projeto

```
convitefv/
├── 📄 capa.html              # Landing page com contagem regressiva
├── 📄 convite.html          # Página principal completa
├── 🎨 style.css            # Design system premium (CSS 178KB)
├── ⚡ script.js            # Lógica interactiva (JS 52KB)
├── 📁 images/              # Assets visuais optimizados
├── 🎵 audio/               # Trilha sonora ambiente
└── 📖 README.md           # Documentação técnica
```

### Fluxo de Navegação

```
┌─────────────┐     ┌─────────────────────────────────────────┐
│  capa.html  │────▶│              convite.html               │
│  (Landing)  │     │  • Capa Editorial                       │
│             │     │  • Versículo Bíblico                    │
└─────────────┘     │  • Secção dos Noivos                     │
                    │  • Cards de Eventos                     │
                    │  • Galeria de Fotos                     │
                    │  • Contagem Regressiva                  │
                    │  • Formulário RSVP                     │
                    │  • Pedido de Bebidas ☁️                │
                    │  • Upload de Fotos 📸                   │
                    └─────────────────────────────────────────┘
```

---

## 🚀 Funcionalidades Premium

### 1. Sistema de RSVP Integrado

- ✅ Formulário validado com feedback em tempo real
- ✅ Integração WhatsApp para confirmações instantâneas
- ✅ Backend Google Apps Script para persistência
- ✅ Contadores dinâmicos de convidados confirmados

### 2. Pedido de Bebidas ☁️

```javascript
// Selecção múltipla com dropdown customizado
// Notificação automática via WhatsApp para o casal
// Persistência local para recuperação de dados
```

**Recursos:**

- Dropdown multisseleção com UX premium
- 8 opções de bebidas (água, refrigerantes, sumos, cerveja, cocktails)
- Validação de campos obrigatórios
- Mensagem formatada para WhatsApp

### 3. Galeria Colaborativa com Cloudinary 📸

**Configuração de Qualidade HD:**

```javascript
{
  quality: 'auto:best',      // Máxima qualidade automática
  fetch_format: 'auto',      // WebP/AVIF quando suportado
  dpr: 'auto'                // Optimização para telas retina
}
```

**Recursos:**

- Upload direto de até 20 fotos
- Suporte para câmera do dispositivo
- Formato HEIC (iPhone) convertido automaticamente
- Notificação WhatsApp para novos uploads
- Exportação de URLs em arquivo TXT

### 4. Player de Música Flutuante 🎵

- Controle de volume com fade suave
- Playlist com visualização da música atual
- Ícone animado indicando reprodução
- Memória de preferência do usuário

---

## 🎨 Design System

### Paleta de Cores

| Cor | HEX | Uso |
|-----|-----|-----|
| Dourado Premium | `#D4AF37` | Títulos, botões CTA, acentos |
| Dourado Escuro | `#b8941f` | Hover states, bordas |
| Marfim | `#faf8f5` | Fundo principal (light mode) |
| Preto Sofisticado | `#1a1a1a` | Textos principais |
| Vermelho Amor | `#c62828` | Destaques românticos |

### Tipografia

- **Títulos:** `Philosopher, serif` — Elegância clássica
- **Corpo:** `Montserrat, sans-serif` — Legibilidade moderna
- **Destaques:** `Great Vibes, cursive` — Toque caligráfico

### Animações

```css
/* Efeito de entrada suave */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Glow dourado pulsante */
@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
}
```

---

## ⚙️ Configuração Técnica

### Pré-requisitos

- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexão com internet (para Cloudinary e WhatsApp)
- Servidor web local ou hospedagem (para testes)

### Personalização Rápida

#### 1. Dados do Casal

```javascript
// script.js - Linhas iniciais
const COUPLE_NAMES = {
  bride: 'Vânia',
  groom: 'Fabião',
  hashtag: '#VaniaEFabiao2026'
};
```

#### 2. Data do Evento

```javascript
// capa.html & convite.html
const WEDDING_DATE = new Date('2026-05-09T10:30:00');
```

#### 3. Configuração Cloudinary

```javascript
// script.js - PhotoUploadSystem
{
  cloudName: 'seu-cloud-name',
  uploadPreset: 'seu-upload-preset',
  folder: 'casamentos/nome-do-casal'
}
```

#### 4. Números WhatsApp

```javascript
// script.js - Atualizar em 3 locais:
// 1. RSVP System
// 2. DrinkOrderSystem  
// 3. PhotoUploadSystem
const WHATSAPP_NUMBER = '+258XXXXXXXXX';
```

---

## 📱 Compatibilidade & Performance

### Browsers Suportados

| Browser | Versão Mínima | Recursos Avançados |
|---------|---------------|-------------------|
| Chrome | 90+ | ✅ Todos |
| Firefox | 88+ | ✅ Todos |
| Safari | 14+ | ✅ Todos (backdrop-filter com prefixo) |
| Edge | 90+ | ✅ Todos |
| iOS Safari | 14+ | ✅ Todos |
| Android Chrome | 90+ | ✅ Todos |

### Métricas de Performance

- **Lighthouse Score:** 95+ (Performance, Acessibilidade, SEO)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### Otimizações Aplicadas

- ✅ Imagens com lazy loading e decoding async
- ✅ CSS crítico inline (para capa.html)
- ✅ Fontes pré-carregadas com `preload`
- ✅ Assets comprimidos (Gzip/Brotli)
- ✅ Intersection Observer para animações

---

## 🔒 Segurança & Privacidade

- **Dados dos Convidados:** Armazenados apenas em localStorage (client-side)
- **Fotos:** Upload directo para Cloudinary com URLs seguras
- **Comunicações:** WhatsApp API oficial (wa.me)
- **Sem Cookies:** Zero rastreamento de terceiros
- **HTTPS Recomendado:** Para Service Workers (futuro PWA)

---

## 📦 Deployment

### Opções de Hospedagem

| Plataforma | Dificuldade | Custo | Recursos |
|------------|-------------|-------|----------|
| **Netlify** | ⭐ Fácil | Grátis | CI/CD automático, HTTPS |
| **Vercel** | ⭐ Fácil | Grátis | Edge Network, Analytics |
| **GitHub Pages** | ⭐⭐ Médio | Grátis | Integração Git, Jekyll |
| **Cloudflare Pages** | ⭐ Fácil | Grátis | CDN global, Workers |
| **Hostinger/Namecheap** | ⭐⭐⭐ Difícil | Pago | Domínio personalizado |

### Deploy na Netlify (Recomendado)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Fazer login
netlify login

# 3. Deploy
netlify deploy --prod --dir=.
```

---

## 🤝 Contribuição & Personalização

### Para Desenvolvedores

Este projecto foi construído como **Vanilla JS** intencionalmente — sem frameworks pesados para máxima performance e simplicidade de customização.

**Estrutura do Código:**

- Classes ES6+ para cada sistema (RSVP, DrinkOrder, PhotoUpload, Audio)
- CSS BEM-like para nomenclatura de classes
- Separação clara de concerns (presentation vs logic)

### Para Noivos

Quer usar este template para o seu casamento?

1. **Fork** este repositório
2. Substitua as imagens na pasta `images/`
3. Actualize textos e dados no `convite.html`
4. Configure sua conta Cloudinary
5. Deploy! 🚀

---

## 📞 Suporte & Contacto

**Desenvolvedor:** Alberto Dimande  
**Email:** <aldimande@outlook.com>  
**WhatsApp:** +258 82 088 3478

---

<div align="center">

💒 **Com amor, para Vânia & Fabião** 💒

*"Por essa razão, o homem deixará pai e mãe e unir-se-á à sua mulher, e eles se tornarão uma só carne."*  
— Gênesis 2:24

</div>
