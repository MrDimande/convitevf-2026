# Convite de Casamento Digital - Vânia & Fabião

Um convite de casamento digital elegante e premium, criado com HTML, CSS e JavaScript puro.

## Estrutura do Projecto

```
convitefv/
├── capa.html           # Página inicial (capa)
├── convite.html         # Página principal do convite
├── style.css           # Estilos completos (compartilhado)
├── script.js           # Funcionalidades JavaScript (opcional)
├── images/             # Pasta para imagens
├── audio/              # Pasta para música de fundo
└── README.md           # Este arquivo
```

## Como Funciona

### **Fluxo de Navegação**

1. **capa.html** - Página inicial com:
   - Design hero com imagem de fundo
   - Contagem regressiva de dias
   - Botão "Ver Convite" que leva para `convite.html`

2. **convite.html** - Página principal com:
   - Segunda capa com design editorial
   - Versículo bíblico
   - Secção dos noivos
   - Eventos (Cerimónia Religiosa, Civil, Copo de Água)
   - Galeria de fotos
   - Contagem regressiva detalhada
   - Formulário RSVP
   - Secção de presentes
   - Rodapé final

## Personalização

### Imagens Necessárias

As seguintes imagens já estão disponíveis na pasta `images/`:

1. **capa.jpg** - ✅ Imagem de fundo da capa inicial (2.4MB)
2. **foto.jpg** - ✅ Foto do casal (seção noivos) (1.0MB)
3. **foto2.jpg** - ✅ Imagem para Cerimónia Religiosa (1.8MB)
4. **foto3.jpg** - ✅ Imagem para Cerimónia Civil (2.2MB)
5. **foto4.jpg** - ✅ Imagem para Copo de Água (2.3MB)
6. **imag.jpg** - ✅ Primeira imagem da galeria (2.3MB)
7. **imh.jpg** - ✅ Segunda imagem da galeria (1.4MB)
8. **principal.jpg** - ✅ Terceira imagem da galeria e footer (1.3MB)

### Mapeamento das Imagens

- **capa.jpg** → `capa.html` (hero section)
- **foto.jpg** → `convite.html` (seção dos noivos)
- **foto2.jpg** → `convite.html` (evento 1 - cerimónia religiosa)
- **foto3.jpg** → `convite.html` (evento 2 - cerimónia civil)
- **foto4.jpg** → `convite.html` (evento 3 - copo de água)
- **imag.jpg** → `convite.html` (galeria 1)
- **imh.jpg** → `convite.html` (galeria 2 e contagem regressiva)
- **principal.jpg** → `convite.html` (galeria 3 e footer)

### Áudio

Adicione `musica-casamento.mp3` na pasta `audio/` para o botão de música funcionar.

### Textos para Editar

#### Nomes dos Pais

No arquivo `convite.html`, localize e substitua:

```html
<p>[Nome do pai]</p>
<p>[Nome da mãe]</p>
```

#### Locais e Horários dos Eventos

No arquivo `convite.html`, localize os cartões de eventos e substitua:

```html
<div>Paróquia [Nome da Igreja]</div>
<div>[Local da cerimónia civil]</div>
<div>[Local da recepção]</div>
```

### Cores e Estilos

As cores principais estão definidas no arquivo `style.css` nas variáveis CSS:

```css
:root {
    --gold: #ccb26b;        /* Dourado principal */
    --gold-dark: #b39442;   /* Dourado escuro */
    --ivory: #f3f0eb;       /* Marfim */
    --sand: #e7dfd2;        /* Areia */
}
```

### Data do Casamento

Para alterar a data do casamento, modifique nos arquivos HTML:

- `capa.html`: linha do script
- `convite.html`: linha do script

```javascript
const targetDate = new Date('2026-05-09T10:30:00');
```

## Funcionalidades

### ✅ Recursos Implementados

1. **Capa Interativa**
   - Contagem regressiva em tempo real
   - Botão "Ver Convite" com navegação
   - Design com overlay e blur effect

2. **Página Principal Completa**
   - Segunda capa editorial
   - Versículo bíblico com design tipográfico
   - Apresentação dos noivos
   - Cards de eventos com imagens de fundo
   - Galeria com legendas
   - Contagem regressiva detalhada
   - Formulário RSVP funcional
   - Secção de presentes
   - Rodapé com design consistente

3. **Interatividade**
   - Botão de música flutuante
   - Contagem regressiva em tempo real
   - Animações suaves
   - Design responsivo

4. **Responsividade**
   - Layout adaptável para desktop e mobile
   - Tipografia fluida
   - Optimização para touch em dispositivos móveis

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design responsivo e animações
- **JavaScript Vanilla** - Interatividade e contagem regressiva
- **Google Fonts** - Great Vibes e Montserrat

## Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS Safari (com -webkit-backdrop-filter)
- ✅ Android Chrome
- ✅ Responsivo para todos os dispositivos

## Otimizações

- Código limpo e organizado
- CSS separado e compartilhado
- Performance optimizada
- Estrutura modular

## Próximos Passos

1. Adicionar as imagens reais do casal
2. Configurar backend para RSVP
3. Adicionar música de fundo
4. Integrar com sistema de presentes
5. Testar em diferentes dispositivos

## Licença

Este projecto foi criado especificamente para o casamento de Vânia e Fabião.

---

**Desenvolvido com ❤️ para Vânia & Fabião**
