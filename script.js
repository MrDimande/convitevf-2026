// Sistema de Áudio - Reprodução Automática
class WeddingAudio {
  constructor() {
    this.audio = document.getElementById('bgMusic');
    this.audioToggle = document.getElementById('audioToggle');
    this.isPlaying = false;
    this.hasStarted = false;
    this.currentSong = {
      title: 'First Time',
      artist: 'TEEKS'
    };
    
    this.init();
  }

  init() {
    // Verificar se estamos na capa ou no convite
    const isCapa = window.location.pathname.includes('capa.html');
    const isConvite = window.location.pathname.includes('convite.html');
    
    // Debugging
    console.log('🎵 Inicializando sistema de áudio...');
    console.log('🎵 Página atual:', isCapa ? 'Capa' : 'Convite');
    console.log('🎵 Elemento áudio:', this.audio);
    console.log('🎵 Elemento botão:', this.audioToggle);
    
    if (isCapa) {
      this.setupCapaBehavior();
    } else if (isConvite) {
      this.setupConviteBehavior();
    }
    
    // Setup do botão de áudio (comum para ambas páginas)
    this.setupAudioToggle();
    
    // Verificar se áudio pode ser carregado
    if (this.audio) {
      this.audio.addEventListener('loadeddata', () => {
        console.log('🎵 Áudio carregado com sucesso!');
      });
      
      this.audio.addEventListener('error', (e) => {
        console.error('🎵 Erro ao carregar áudio:', e);
        console.error('🎵 Código do erro:', this.audio.error ? this.audio.error.code : 'Desconhecido');
        console.error('🎵 Mensagem do erro:', this.audio.error ? this.audio.error.message : 'Desconhecida');
      });
    }
  }

  setupCapaBehavior() {
    // Configurar o botão "Ver Convite" para iniciar música automaticamente
    const openInviteBtn = document.getElementById('openInvite');
    
    if (openInviteBtn) {
      openInviteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Iniciar música automaticamente (apenas na primeira vez)
        if (!this.hasStarted) {
          this.playMusic(true); // true = auto-play
          this.hasStarted = true;
        }
        
        // Mostrar toast indicador
        this.showMusicToast();
        
        // Navegar para o convite após um breve delay
        setTimeout(() => {
          window.location.href = 'convite.html';
        }, 300);
      });
    }
  }

  setupConviteBehavior() {
    // Verificar se a música já foi iniciada na capa
    const urlParams = new URLSearchParams(window.location.search);
    const musicStarted = urlParams.get('music') === 'started';
    
    // TOCAR IMEDIATAMENTE ao entrar no convite, independente de qualquer coisa
    console.log('🎵 Convite aberto - iniciando música imediatamente');
    
    // Delay mínimo para garantir que o DOM está pronto
    setTimeout(() => {
      if (!this.hasStarted) {
        this.playMusic(true); // true = auto-play
        this.hasStarted = true;
        this.showMusicToast();
      }
    }, 100); // Reduzido para 100ms para tocar mais rápido
    
    // Se veio da capa com música já iniciada, continuar
    if (musicStarted && !this.hasStarted) {
      console.log('🎵 Música veio da capa - continuando reprodução');
      setTimeout(() => {
        if (!this.hasStarted) {
          this.playMusic(true);
          this.hasStarted = true;
          this.showMusicToast();
        }
      }, 100);
    }
  }

  setupAudioToggle() {
    if (!this.audioToggle) return;
    
    this.audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (this.isPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic(false); // false = manual play
      }
    });
    
    // Atualizar estado inicial do botão
    this.updateToggleButton();
  }

  async playMusic(isAutoPlay = false) {
    try {
      // Debugging - verificar se elemento existe
      if (!this.audio) {
        console.error('🎵 Erro: Elemento de áudio não encontrado!');
        return;
      }

      const targetVolume = window.location.pathname.includes('convite.html') ? 0.42 : 1;
      
      // Debugging - verificar se arquivo carrega
      console.log('🎵 Tentando reproduzir áudio...');
      console.log('🎵 Src:', this.audio.src);
      console.log('🎵 ReadyState:', this.audio.readyState);
      console.log('🎵 AutoPlay:', isAutoPlay);
      
      // Estratégia AGRESSIVA para autoplay
      if (isAutoPlay) {
        // Tentativa 1: Play direto imediato
        try {
          await this.audio.play();
          console.log('🎵 ✅ Play direto funcionou!');
        } catch (directError) {
          console.log('🎵 Play direto falhou, tentando abordagem 2...');
          
          // Tentativa 2: Configurar volume e tocar
          try {
            this.audio.volume = 0.1;
            await this.audio.play();
            this.audio.volume = targetVolume;
            console.log('🎵 ✅ Play com volume control funcionou!');
          } catch (volumeError) {
            console.log('🎵 Play com volume falhou, tentando abordagem 3...');
            
            // Tentativa 3: Carregar áudio completamente
            try {
              this.audio.load();
              await new Promise(resolve => setTimeout(resolve, 200));
              await this.audio.play();
              console.log('🎵 ✅ Play com load funcionou!');
            } catch (loadError) {
              console.log('🎵 Play com load falhou, tentando abordagem 4...');
              
              // Tentativa 4: Muted play depois unmute
              try {
                this.audio.muted = true;
                await this.audio.play();
                this.audio.muted = false;
                console.log('🎵 ✅ Play com mute/unmute funcionou!');
              } catch (muteError) {
                console.log('🎵 Todas as tentativas de autoplay falharam');
                throw muteError;
              }
            }
          }
        }
      } else {
        // Play manual
        await this.audio.play();
      }

      this.audio.volume = targetVolume;
      
      this.isPlaying = true;
      this.hasStarted = true;
      
      // Atualizar botão
      this.updateToggleButton();
      
      // Adicionar parâmetro URL se for autoplay
      if (isAutoPlay && window.location.pathname.includes('convite.html')) {
        const url = new URL(window.location);
        url.searchParams.set('music', 'started');
        window.history.replaceState({}, '', url);
      }
      
      console.log('🎵 Música ' + (isAutoPlay ? 'iniciada automaticamente' : 'retomada') + ': ' + this.currentSong.title);
      
    } catch (error) {
      console.warn('🎵 Erro ao reproduzir música:', error);
      console.warn('🎵 Detalhes do erro:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Se for autoplay bloqueado, mostrar mensagem amigável
      if (isAutoPlay && (error.name === 'NotAllowedError' || error.name === 'NotSupportedError')) {
        console.log('🎵 Autoplay bloqueado pelo browser - configurando fallback AGRESSIVO...');
        
        // Configurar fallback para primeira interação
        const fallbackPlay = () => {
          if (!this.hasStarted) {
            console.log('🎵 Executando fallback - primeira interação detectada');
            this.playMusic(false);
          }
        };
        
        // Adicionar MULTIPLOS listeners para garantir que funcione
        document.addEventListener('click', fallbackPlay, { once: true, passive: true });
        document.addEventListener('keydown', fallbackPlay, { once: true, passive: true });
        document.addEventListener('scroll', fallbackPlay, { once: true, passive: true });
        document.addEventListener('mousemove', fallbackPlay, { once: true, passive: true });
        document.addEventListener('touchstart', fallbackPlay, { once: true, passive: true });
        document.addEventListener('wheel', fallbackPlay, { once: true, passive: true });
        
        // Tentar novamente após 1 segundo
        setTimeout(() => {
          if (!this.hasStarted) {
            console.log('🎵 Tentativa automática após 1 segundo...');
            this.playMusic(false);
          }
        }, 1000);
        
        // Mostrar mensagem visual para usuário
        this.showUserInteractionMessage();
      }
    }
  }

  pauseMusic() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateToggleButton();
    console.log('⏸️ Música pausada');
  }

  updateToggleButton() {
    if (!this.audioToggle) return;

    const icon = this.isPlaying ? 'pause' : 'play';
    this.audioToggle.innerHTML =
      '<i data-lucide="' + icon + '" class="audio-toggle__icon" aria-hidden="true"></i>';
    this.audioToggle.setAttribute(
      'aria-label',
      this.isPlaying ? 'Pausar música' : 'Tocar música'
    );

    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  showUserInteractionMessage() {
    // Remover mensagem existente se houver
    const existingMsg = document.querySelector('.user-interaction-message');
    if (existingMsg) {
      existingMsg.remove();
    }
    
    // Criar mensagem para usuário
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-interaction-message';
    messageDiv.innerHTML = `
      <div class="message-content">
        <span class="music-icon">🎵</span>
        <div class="message-text">
          <strong>Clique em qualquer lugar para tocar a música</strong>
          <small>O seu browser precisa da sua permissão para reproduzir áudio automaticamente</small>
        </div>
      </div>
    `;
    
    // Estilos
    messageDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.95), rgba(184, 148, 31, 0.95));
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
      max-width: 400px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: messageSlideIn 0.5s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = 'messageSlideOut 0.5s ease-in';
        setTimeout(() => {
          messageDiv.parentNode.removeChild(messageDiv);
        }, 500);
      }
    }, 5000);
  }

  showMusicToast() {
    // Remover toast existente se houver
    const existingToast = document.querySelector('.music-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = 'music-toast';
    toast.innerHTML = '<span class="music-icon">🎶</span>' +
      '<div class="music-info">' +
        '<div class="song-title">' + this.currentSong.title + '</div>' +
        '<div class="artist-name">' + this.currentSong.artist + '</div>' +
      '</div>';
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 3000);
  }
}

/**
 * Endpoint do Google Apps Script (Web App) para receber RSVPs.
 * Também podes definir data-rsvp-endpoint no <form id="rsvp-form"> para sobrepor este valor.
 */
const RSVP_APPS_SCRIPT_URL = '';

// Sistema RSVP Existente (mantido para compatibilidade)
class WeddingRSVP {
  constructor() {
    this.rsvpData = this.loadRSVPData();
    this.init();
  }

  init() {
    this.setupForm();
    this.loadRSVPStats();
  }

  setupForm() {
    const form = document.getElementById('rsvp-form');
    if (form) {
      form.addEventListener('submit', (e) => this.submitRSVP(e));
    }
  }

  getRsvpEndpoint() {
    const form = document.getElementById('rsvp-form');
    const fromAttr = form && form.getAttribute('data-rsvp-endpoint');
    if (fromAttr && fromAttr.trim()) return fromAttr.trim();
    return typeof RSVP_APPS_SCRIPT_URL === 'string' && RSVP_APPS_SCRIPT_URL.trim()
      ? RSVP_APPS_SCRIPT_URL.trim()
      : '';
  }

  async submitRSVP(e) {
    e.preventDefault();

    const formData = this.getFormData();
    if (!this.validateForm(formData)) return;

    const form = document.getElementById('rsvp-form');
    const submitBtn = form && form.querySelector('button[type="submit"]');
    const endpoint = this.getRsvpEndpoint();
    const endpointOk = /^https?:\/\/.+/i.test(endpoint);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.labelWas = submitBtn.textContent;
      submitBtn.textContent = 'A enviar…';
    }
    this.showStatus('A enviar a tua confirmação...', 'info', 0);

    if (!endpointOk) {
      this.showError(
        'RSVP não configurado. Define o endpoint do Google Apps Script em RSVP_APPS_SCRIPT_URL ou data-rsvp-endpoint no formulário.'
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.labelWas || 'Enviar confirmação';
      }
      return;
    }

    try {
      const payload = JSON.stringify(formData);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: payload
      });

      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }

      const result = await res.json();
      if (!result || result.ok !== true || result.saved !== true) {
        throw new Error((result && result.message) || 'Falha ao guardar RSVP.');
      }

      if (result.emailSent === true) {
        this.showStatus(
          'Confirmação enviada com sucesso. O RSVP foi guardado e o email foi enviado.',
          'success',
          7000
        );
      } else {
        this.showStatus(
          'RSVP guardado com sucesso, mas sem envio de email neste momento. A tua confirmação não foi perdida.',
          'warning',
          8000
        );
      }

      if (form) form.reset();
    } catch (err) {
      // Fallback para cenários de CORS/redirect do Apps Script no browser.
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(formData)
        });
        this.showStatus(
          'RSVP enviado. Se não aparecer confirmação detalhada, verifica a planilha RSVP para confirmar o registo.',
          'warning',
          8000
        );
        if (form) form.reset();
      } catch (fallbackErr) {
        console.error('RSVP endpoint:', err);
        console.error('RSVP endpoint fallback:', fallbackErr);
        this.showStatus(
          'Não foi possível enviar o RSVP agora. Verifica a ligação e tenta novamente.',
          'error',
          8000
        );
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.labelWas || 'Enviar confirmação';
        }
        return;
      }
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.labelWas || 'Enviar confirmação';
    }

    if (window.triggerConfetti) {
      setTimeout(() => {
        window.triggerConfetti();
      }, 500);
    }
  }

  getFormData() {
    const form = document.getElementById('rsvp-form');
    const formData = {};

    if (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        if (!input.name) return;
        formData[input.name] = typeof input.value === 'string' ? input.value.trim() : input.value;
      });
    }

    if (formData.presenca === 'Não poderei comparecer') {
      formData.acompanhantes = '0';
    }

    return formData;
  }

  validateForm(data) {
    if (!data.nome || data.nome.trim() === '') {
      this.showError('Por favor, preenche o teu nome completo.');
      return false;
    }

    if (!data.telefone || data.telefone.trim() === '') {
      this.showError('Por favor, indica o teu telemóvel.');
      return false;
    }

    const telefoneApenasDigitos = String(data.telefone || '').replace(/\D/g, '');
    if (telefoneApenasDigitos.length < 8) {
      this.showError('Por favor, indica um telemóvel válido.');
      return false;
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      this.showError('Por favor, indica um email válido ou deixa o campo em branco.');
      return false;
    }

    if (!data.presenca) {
      this.showError('Por favor, escolhe se vens ou não ao nosso dia.');
      return false;
    }

    return true;
  }

  showError(message) {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    form.parentNode.querySelectorAll('.rsvp-error').forEach((el) => el.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'rsvp-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;

    form.parentNode.insertBefore(errorDiv, form);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  showStatus(message, type = 'info', autoHideMs = 5000) {
    const form = document.getElementById('rsvp-form');
    if (!form || !form.parentNode) return;

    form.parentNode.querySelectorAll('.rsvp-status').forEach((el) => el.remove());

    const statusDiv = document.createElement('div');
    statusDiv.className = 'rsvp-status rsvp-status--' + type;
    statusDiv.setAttribute('role', 'status');
    statusDiv.textContent = message;
    form.parentNode.insertBefore(statusDiv, form);

    if (autoHideMs > 0) {
      setTimeout(() => {
        if (statusDiv.parentNode) statusDiv.remove();
      }, autoHideMs);
    }
  }

  saveRSVPData(data) {
    // Salvar no localStorage
    const existingData = this.loadRSVPData();
    existingData.push(data);
    localStorage.setItem('weddingRSVP', JSON.stringify(existingData));
  }

  loadRSVPData() {
    const data = localStorage.getItem('weddingRSVP');
    return data ? JSON.parse(data) : [];
  }

  showRSVPConfirmation(data, emailEnviado, emailErro) {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    const attending = data.presenca === 'Sim, com muito gosto';
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className =
      'rsvp-confirmation' + (attending ? ' rsvp-confirmation--yes' : ' rsvp-confirmation--no');
    confirmationDiv.setAttribute('role', 'status');

    const nome = (data.nome || '').trim() || 'Amigo(a)';
    const nomeSafe = nome.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const emailNota = emailEnviado
      ? ''
      : emailErro
        ? '<p class="rsvp-confirmation__note">A tua resposta foi guardada, mas o envio por email falhou neste momento. Tenta novamente mais tarde ou confirma também por WhatsApp.</p>'
        : '<p class="rsvp-confirmation__note">A tua resposta ficou guardada neste dispositivo. Configura o email de destino no site para os noivos receberem uma cópia por email.</p>';
    if (attending) {
      confirmationDiv.innerHTML =
        '<h3 class="rsvp-confirmation__title">Obrigado, ' +
        nomeSafe +
        '</h3>' +
        '<p class="rsvp-confirmation__text">A tua presença ficou registada. Mal podemos esperar por te ver no nosso grande dia.</p>' +
        emailNota;
    } else {
      confirmationDiv.innerHTML =
        '<h3 class="rsvp-confirmation__title">Obrigado, ' +
        nomeSafe +
        '</h3>' +
        '<p class="rsvp-confirmation__text">Registámos que não vais poder estar presente. O carinho de teres respondido significa muito para nós.</p>' +
        emailNota;
    }

    const mainBlock = document.querySelector('.rsvp-main-block');
    const heading = document.querySelector('.panel--rsvp .rsvp-card-heading');
    if (mainBlock) {
      mainBlock.style.display = 'none';
    }
    if (heading) {
      heading.insertAdjacentElement('afterend', confirmationDiv);
    } else {
      form.parentNode.insertBefore(confirmationDiv, form.nextSibling);
      form.style.display = 'none';
    }
  }

  loadRSVPStats() {
    // Carregar estatísticas (se existir elemento)
    const statsElement = document.getElementById('rsvp-stats');
    if (statsElement) {
      const data = this.loadRSVPData();
      const confirmed = data.filter(r => r.presenca === 'Sim, com muito gosto').length;
      const declined = data.filter(r => r.presenca === 'Não poderei comparecer').length;
      
      statsElement.innerHTML = `
        <div class="stat-item">
          <span class="stat-number">${confirmed}</span>
          <span class="stat-label">Confirmados</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${declined}</span>
          <span class="stat-label">Não Comparecerão</span>
        </div>
      `;
    }
  }

  showConfirmedPanel() {
    const data = this.loadRSVPData();
    
    // Criar painel de confirmados
    const panel = document.createElement('div');
    panel.className = 'confirmed-panel';
    panel.innerHTML = `
      <div class="panel-header">
        <h3>📋 Confirmados (${data.length})</h3>
        <button class="close-panel" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="panel-content">
        ${data.map((rsvp, index) => `
          <div class="confirmed-item">
            <span class="item-number">${index + 1}</span>
            <div class="item-details">
              <strong>${rsvp.nome}</strong>
              <span class="item-status ${rsvp.presenca === 'Sim, com muito gosto' ? 'confirmed' : 'declined'}">
                ${rsvp.presenca}
              </span>
              ${rsvp.email ? '<small>' + rsvp.email + '</small>' : ''}
              ${rsvp.mensagem ? '<p><em>"' + rsvp.mensagem + '"</em></p>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    `;
    
    document.body.appendChild(panel);
  }

  exportRSVPData() {
    const data = this.loadRSVPData();
    const jsonStr = JSON.stringify(data, null, 2);
    
    // Criar e baixar arquivo
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  exportToExcel() {
    const data = this.loadRSVPData();

    // Criar CSV simples
    const csv = [
      ['Nome', 'Presença', 'Email', 'Mensagem', 'Data'],
      ...data.map((r) => [
        r.nome || '',
        r.presenca || '',
        r.email || '',
        r.mensagem || '',
        new Date().toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    // Criar e baixar arquivo
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  clearRSVPData() {
    if (confirm('Tem certeza que deseja limpar todos os dados do RSVP?')) {
      localStorage.removeItem('weddingRSVP');
      location.reload();
    }
  }
}

const WEDDING_COUNTDOWN_TARGET = new Date('2026-05-09T00:00:00');
/* Salão de Eventos Evelyn — KaMavota, Bairro Albazine */
const VENUE_MAP_LAT = -25.838;
const VENUE_MAP_LNG = 32.639;
const VENUE_MAP_LABEL = 'Salão de Eventos Evelyn, KaMavota, Albazine, Maputo, Moçambique';
const VENUE_GOOGLE_SEARCH = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(VENUE_MAP_LABEL);

function initCountdown() {
  function tick() {
    const now = Date.now();
    const diffMs = WEDDING_COUNTDOWN_TARGET.getTime() - now;

    const heroDays = document.getElementById('heroDays');
    if (heroDays) {
      const daysHero = diffMs <= 0 ? 0 : Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      heroDays.textContent = String(daysHero).padStart(2, '0');
    }

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (daysEl && hoursEl && minutesEl && secondsEl) {
      if (diffMs <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
      } else {
        const totalSec = Math.floor(diffMs / 1000);
        const d = Math.floor(totalSec / 86400);
        const h = Math.floor((totalSec % 86400) / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
      }
    }
  }

  tick();
  window.setInterval(tick, 1000);
}

let conviteMapScale = 1;

function getConviteMapContentEl() {
  return document.querySelector('#map .map-content');
}

function initConviteMapEmbed() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  mapEl.classList.remove('map-placeholder');
  mapEl.classList.add('map-embed-root');
  mapEl.style.background = 'none';

  const q = encodeURIComponent(VENUE_MAP_LABEL);
  mapEl.innerHTML =
    '<div class="map-content">' +
    '<iframe title="Salão de Eventos Evelyn, Maputo" src="https://maps.google.com/maps?q=' + q + '&z=16&output=embed" ' +
    'style="border:0;width:100%;height:100%;min-height:360px" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
    '</div>';

  conviteMapScale = 1;
}

function registerConviteMapGlobals() {
  window.openGoogleMaps = function () {
    window.open(VENUE_GOOGLE_SEARCH, '_blank', 'noopener,noreferrer');
  };

  window.openWaze = function () {
    const url = 'https://waze.com/ul?ll=' + VENUE_MAP_LAT + ',' + VENUE_MAP_LNG + '&navigate=yes';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  window.getDirections = function () {
    if (!navigator.geolocation) {
      window.openGoogleMaps();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const origin = position.coords.latitude + ',' + position.coords.longitude;
        const dest = VENUE_MAP_LAT + ',' + VENUE_MAP_LNG;
        const url = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(dest);
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      function () {
        window.openGoogleMaps();
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  window.zoomIn = function () {
    const el = getConviteMapContentEl();
    if (!el) return;
    conviteMapScale = Math.min(3, conviteMapScale * 1.2);
    el.style.transform = 'scale(' + conviteMapScale + ')';
  };

  window.zoomOut = function () {
    const el = getConviteMapContentEl();
    if (!el) return;
    conviteMapScale = Math.max(0.5, conviteMapScale * 0.8);
    el.style.transform = 'scale(' + conviteMapScale + ')';
  };

  window.resetMap = function () {
    const el = getConviteMapContentEl();
    if (!el) return;
    conviteMapScale = 1;
    el.style.transform = 'scale(1)';
  };

  window.toggleFullscreen = function () {
    const container = document.querySelector('.map-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  };
}

function initLucideIcons() {
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

/** Atenua corações/partículas/sparkles enquanto o hero intro ocupa uma fatia visível do ecrã. */
function initHeroIntroAmbientDim() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const update = () => {
    const rect = intro.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    const ratio = rect.height > 0 ? Math.max(0, visible) / vh : 0;
    document.body.classList.toggle('hero-intro-in-view', ratio > 0.2);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
  window.weddingAudio = new WeddingAudio();

  const isCapa = window.location.pathname.includes('capa.html');
  const isConvite = window.location.pathname.includes('convite.html');

  initCountdown();

  if (isConvite) {
    initHeroIntroAmbientDim();
    registerConviteMapGlobals();
    initConviteMapEmbed();
  }

  initLucideIcons();

  if (isCapa) {
    return;
  }

  window.weddingRSVP = new WeddingRSVP();

  // --- Modal Artigos ---
  const openBtn = document.getElementById('openArtigosModal');
  const overlay = document.getElementById('artigosModalOverlay');
  const closeBtn = document.getElementById('closeArtigosModal');

  if (openBtn && overlay) {
    openBtn.addEventListener('click', () => {
      overlay.classList.add('is-open');
      document.body.classList.add('artigos-modal-open');
    });

    const closeModal = () => {
      overlay.classList.remove('is-open');
      document.body.classList.remove('artigos-modal-open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
  }
});
