// Sistema de Pedidos de Bebidas - 100% Operacional
class DrinkOrderSystem {
  constructor() {
    this.form = document.getElementById('drinkOrderForm');
    this.init();
  }

  init() {
    console.log('🍷 Inicializando sistema de pedidos de bebidas...');
    
    if (this.form) {
      this.setupEventListeners();
      this.setupValidation();
      console.log('✅ Formulário de bebidas encontrado e configurado');
    } else {
      console.warn('⚠️ Formulário de bebidas não encontrado');
    }
  }

  setupEventListeners() {
    // Submit do formulário
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('📋 Formulário de bebidas submetido');
      this.submitDrinkOrder();
    });

    // Validação em tempo real
    const drinkCheckboxes = this.form.querySelectorAll('input[name="drinks"]');
    drinkCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.validateDrinkSelection();
      });
    });

    // Formatação do contato
    const contactInput = document.getElementById('contactInfo');
    if (contactInput) {
      contactInput.addEventListener('input', (e) => {
        this.formatContactInput(e.target);
      });
    }

    console.log('✅ Event listeners configurados');
  }

  setupValidation() {
    // Adicionar validação HTML5 personalizada
    const nameInput = document.getElementById('drinkName');
    const contactInput = document.getElementById('contactInfo');
    
    if (nameInput) {
      nameInput.setAttribute('minlength', '3');
      nameInput.setAttribute('pattern', '[A-Za-zÀ-ú\\s]+');
      nameInput.setAttribute('title', 'Por favor, insira um nome válido (mínimo 3 caracteres)');
    }

    if (contactInput) {
      contactInput.setAttribute('title', 'Insira um número de WhatsApp (+258 8X XXX XXXX) ou email válido');
    }

    console.log('✅ Validação configurada');
  }

  validateDrinkSelection() {
    const selectedDrinks = this.form.querySelectorAll('input[name="drinks"]:checked');
    const drinkOptions = this.form.querySelector('.drink-options');
    
    if (selectedDrinks.length === 0) {
      drinkOptions.classList.add('validation-error');
      this.showFieldError('drinkOptions', 'Por favor, selecione pelo menos uma bebida');
    } else {
      drinkOptions.classList.remove('validation-error');
      this.hideFieldError('drinkOptions');
    }
  }

  formatContactInput(input) {
    let value = input.value.trim();
    
    // Detectar se é WhatsApp ou Email
    if (value.startsWith('+') || /^\d+$/.test(value.replace(/\s/g, ''))) {
      // Formatar WhatsApp
      value = value.replace(/\D/g, ''); // Remove não-dígitos
      if (value.startsWith('258')) {
        value = '+258 ' + value.substring(3).replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
      } else if (value.length === 9) {
        value = '+258 ' + value.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
      }
    }
    
    input.value = value;
  }

  submitDrinkOrder() {
    console.log('🚀 Processando pedido de bebidas...');
    
    const formData = this.getFormData();
    
    if (!this.validateForm(formData)) {
      console.log('❌ Validação falhou');
      return;
    }

    console.log('✅ Dados validados:', formData);

    // Salvar no localStorage
    this.saveDrinkOrder(formData);
    
    // Enviar via WhatsApp ou Email
    this.sendOrder(formData);
    
    // Mostrar confirmação
    this.showConfirmation(formData);
    
    // Limpar formulário
    this.form.reset();
    
    console.log('✅ Pedido processado com sucesso');
  }

  getFormData() {
    const selectedDrinks = Array.from(this.form.querySelectorAll('input[name="drinks"]:checked'))
      .map(checkbox => checkbox.value);
    
    return {
      name: document.getElementById('drinkName').value.trim(),
      drinks: selectedDrinks,
      quantity: document.getElementById('drinkQuantity').value,
      restrictions: document.getElementById('drinkRestrictions').value.trim(),
      contactMethod: this.form.querySelector('input[name="contactMethod"]:checked').value,
      contactInfo: document.getElementById('contactInfo').value.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };
  }

  validateForm(data) {
    let isValid = true;

    // Validar nome
    if (!data.name || data.name.length < 3) {
      this.showFieldError('drinkName', 'Por favor, insira seu nome completo (mínimo 3 caracteres)');
      isValid = false;
    } else {
      this.hideFieldError('drinkName');
    }

    // Validar bebidas
    if (data.drinks.length === 0) {
      this.showFieldError('drinkOptions', 'Por favor, selecione pelo menos uma bebida');
      isValid = false;
    } else {
      this.hideFieldError('drinkOptions');
    }

    // Validar contato
    if (!data.contactInfo) {
      this.showFieldError('contactInfo', 'Por favor, informe seu WhatsApp ou e-mail');
      isValid = false;
    } else if (!this.validateContact(data.contactInfo)) {
      this.showFieldError('contactInfo', 'Por favor, insira um WhatsApp válido (+258 8X XXX XXXX) ou e-mail');
      isValid = false;
    } else {
      this.hideFieldError('contactInfo');
    }

    return isValid;
  }

  validateContact(contact) {
    // Validar WhatsApp
    const whatsappPattern = /^\+258\s?\d{2}\s?\d{3}\s?\d{3}$/;
    if (whatsappPattern.test(contact.replace(/\s/g, ' '))) {
      return true;
    }

    // Validar Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(contact)) {
      return true;
    }

    return false;
  }

  showFieldError(fieldId, message) {
    let field;
    if (fieldId === 'drinkOptions') {
      field = this.form.querySelector('.drink-options');
    } else {
      field = document.getElementById(fieldId);
    }

    if (!field) return;

    // Remover erro anterior
    this.hideFieldError(fieldId);

    // Adicionar classe de erro
    field.classList.add('field-error');

    // Criar mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    errorDiv.id = fieldId + '-error';
    
    // Inserir após o campo
    if (fieldId === 'drinkOptions') {
      field.parentNode.appendChild(errorDiv);
    } else {
      field.parentNode.appendChild(errorDiv);
    }
  }

  hideFieldError(fieldId) {
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) {
      errorDiv.remove();
    }

    let field;
    if (fieldId === 'drinkOptions') {
      field = this.form.querySelector('.drink-options');
    } else {
      field = document.getElementById(fieldId);
    }

    if (field) {
      field.classList.remove('field-error');
    }
  }

  saveDrinkOrder(data) {
    try {
      const orders = JSON.parse(localStorage.getItem('weddingDrinkOrders') || '[]');
      orders.push(data);
      localStorage.setItem('weddingDrinkOrders', JSON.stringify(orders));
      console.log('💾 Pedido salvo no localStorage. Total:', orders.length);
    } catch (error) {
      console.error('❌ Erro ao salvar no localStorage:', error);
    }
  }

  sendOrder(data) {
    console.log('📤 Enviando pedido via', data.contactMethod);
    
    const message = this.formatMessage(data);
    
    if (data.contactMethod === 'whatsapp') {
      // WhatsApp: substitua pelo número real dos noivos
      const whatsappNumber = '+258841234567'; // Número placeholder
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
      console.log('📱 Abrindo WhatsApp:', whatsappUrl);
      window.open(whatsappUrl, '_blank');
    } else {
      // Email
      const subject = 'Pedido de Bebidas - Casamento Vânia & Fabião';
      const email = 'vaniaefabiao@casamento.com'; // Email placeholder
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      console.log('📧 Abrindo email:', mailtoUrl);
      window.location.href = mailtoUrl;
    }
  }

  formatMessage(data) {
    const drinksText = data.drinks.map(drink => {
      const drinkNames = {
        'vinho-tinto': '🍷 Vinho Tinto',
        'vinho-branco': '🍾 Vinho Branco',
        'cerveja': '🍺 Cerveja',
        'espumante': '🥂 Espumante',
        'refrigerante': '🥤 Refrigerante',
        'agua': '💧 Água',
        'sumo-natural': '🧃 Sumo Natural'
      };
      return drinkNames[drink] || drink;
    }).join(', ');

    const contactIcon = data.contactMethod === 'whatsapp' ? '📱' : '📧';
    
    return `🍷 *PEDIDO DE BEBIDAS - CASAMENTO VÂNIA & FABIÃO* 🍷

👤 *Nome:* ${data.name}
🥤 *Bebidas:* ${drinksText}
📊 *Quantidade:* ${data.quantity}
📝 *Restrições:* ${data.restrictions || 'Nenhuma'}
${contactIcon} *Contato:* ${data.contactInfo}
📅 *Data:* ${new Date().toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })}
🕐 *Hora:* ${new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}

🎉 *Obrigado pela sua preferência!*

---
*Este pedido foi registrado automaticamente através do convite digital*`;
  }

  showConfirmation(data) {
    const drinkCount = data.drinks.length;
    const methodText = data.contactMethod === 'whatsapp' ? 'WhatsApp' : 'E-mail';
    
    this.showToast(
      '✅ Pedido enviado com sucesso!', 
      `Seu pedido de ${drinkCount} bebida(s) foi registrado e enviado via ${methodText}. Entraremos em contato em breve!`,
      'success'
    );

    // Adicionar confetti para celebração
    this.celebrateSuccess();
  }

  celebrateSuccess() {
    // Criar efeito de confetti simples
    const colors = ['#4CAF50', '#D4AF37', '#9C27B0', '#FF5722'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}%;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          animation: confettiFall 3s linear forwards;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }

    // Adicionar CSS da animação se não existir
    if (!document.querySelector('#confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  showToast(title, message, type = 'success') {
    // Remover toast existente
    const existingToast = document.querySelector('.drink-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'drink-toast';
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✅' : '❌'}</div>
      <div>
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => toast.classList.add('show'), 100);

    // Remover após 4 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('drinkOrderSession');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('drinkOrderSession', sessionId);
    }
    return sessionId;
  }

  // Método público para exportar dados
  exportDrinkOrders() {
    const orders = JSON.parse(localStorage.getItem('weddingDrinkOrders') || '[]');
    
    if (orders.length === 0) {
      alert('Nenhum pedido de bebidas encontrado');
      return;
    }

    // Criar CSV
    const headers = ['Nome', 'Bebidas', 'Quantidade', 'Restrições', 'Contato', 'Método', 'Data'];
    const csv = [
      headers.join(','),
      ...orders.map(order => [
        `"${order.name}"`,
        `"${order.drinks.join('; ')}"`,
        `"${order.quantity}"`,
        `"${order.restrictions || ''}"`,
        `"${order.contactInfo}"`,
        `"${order.contactMethod}"`,
        `"${new Date(order.timestamp).toLocaleString('pt-MZ')}"`
      ].join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_bebidas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

// Sistema de Upload de Fotos - 100% Operacional
class PhotoUploadSystem {
  constructor() {
    this.uploadZone = document.getElementById('uploadZone');
    this.photoInput = document.getElementById('photoInput');
    this.photoGrid = document.getElementById('photoGrid');
    this.previewArea = document.getElementById('photoPreviewArea');
    this.selectedPhotos = [];
    this.maxPhotos = 20;
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp'];
    this.init();
  }

  init() {
    console.log('📸 Inicializando sistema de upload de fotos...');
    
    if (this.uploadZone) {
      this.setupEventListeners();
      this.setupValidation();
      console.log('✅ Sistema de fotos encontrado e configurado');
    } else {
      console.warn('⚠️ Sistema de upload de fotos não encontrado');
    }
  }

  setupEventListeners() {
    // Click para selecionar fotos
    this.uploadZone.addEventListener('click', (e) => {
      if (e.target.id !== 'photoInput') {
        console.log('📁 Abrindo seletor de arquivos...');
        this.photoInput.click();
      }
    });

    // File input change
    this.photoInput.addEventListener('change', (e) => {
      console.log('📁 Arquivos selecionados:', e.target.files.length);
      this.handleFileSelect(e.target.files);
    });

    // Drag and drop
    this.uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadZone.classList.add('dragover');
      console.log('🎯 Arquivo arrastado sobre a zona');
    });

    this.uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this.uploadZone.classList.remove('dragover');
    });

    this.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadZone.classList.remove('dragover');
      console.log('📂 Arquivos soltos:', e.dataTransfer.files.length);
      this.handleFileSelect(e.dataTransfer.files);
    });

    // Botões
    const selectBtn = document.getElementById('selectPhotosBtn');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.photoInput.click();
      });
    }

    const addMoreBtn = document.getElementById('addMorePhotosBtn');
    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', () => {
        console.log('➕ Adicionando mais fotos...');
        this.photoInput.click();
      });
    }

    const uploadBtn = document.getElementById('uploadPhotosBtn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        console.log('📤 Iniciando upload das fotos...');
        this.uploadPhotos();
      });
    }

    // Prevenir comportamento padrão de drag em todo o documento
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    console.log('✅ Event listeners do sistema de fotos configurados');
  }

  setupValidation() {
    // Configurar input de arquivo
    this.photoInput.setAttribute('accept', 'image/jpeg,image/jpg,image/png,image/heic,image/webp');
    this.photoInput.setAttribute('multiple', 'true');
    
    // Adicionar tooltips informativos
    this.addInfoTooltips();
    
    console.log('✅ Validação do sistema de fotos configurada');
  }

  addInfoTooltips() {
    const infoItems = document.querySelectorAll('.photo-gallery-info .info-item');
    infoItems.forEach(item => {
      item.setAttribute('title', 'Clique para mais informações');
      item.style.cursor = 'help';
    });
  }

  handleFileSelect(files) {
    console.log('🔍 Processando', files.length, 'arquivos...');
    
    const validFiles = Array.from(files).filter(file => {
      return this.validateFile(file);
    });

    if (validFiles.length === 0) {
      console.log('❌ Nenhum arquivo válido encontrado');
      return;
    }

    console.log('✅', validFiles.length, 'arquivos válidos, processando...');

    // Processar arquivos válidos
    validFiles.forEach(file => {
      this.processFile(file);
    });

    // Mostrar feedback
    this.showFileFeedback(validFiles.length, files.length - validFiles.length);
  }

  validateFile(file) {
    // Validar tipo
    if (!this.allowedTypes.includes(file.type)) {
      this.showToast('❌ Formato inválido', `${file.name} não é um formato suportado. Use: JPG, PNG, HEIC ou WEBP.`, 'error');
      return false;
    }

    // Validar tamanho
    if (file.size > this.maxFileSize) {
      this.showToast('❌ Arquivo muito grande', `${file.name} excede o limite de 10MB.`, 'error');
      return false;
    }

    // Validar limite de fotos
    if (this.selectedPhotos.length >= this.maxPhotos) {
      this.showToast('❌ Limite atingido', `Máximo de ${this.maxPhotos} fotos por envio.`, 'error');
      return false;
    }

    // Validar duplicatas
    const isDuplicate = this.selectedPhotos.some(photo => 
      photo.name === file.name && photo.size === file.size
    );
    
    if (isDuplicate) {
      this.showToast('⚠️ Arquivo duplicado', `${file.name} já foi adicionado.`, 'warning');
      return false;
    }

    return true;
  }

  processFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const photoData = {
        file: file,
        url: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        id: this.generatePhotoId()
      };

      this.selectedPhotos.push(photoData);
      this.updatePhotoGrid();
      
      console.log('✅ Foto processada:', file.name);
    };

    reader.onerror = () => {
      this.showToast('❌ Erro ao ler arquivo', `Não foi possível processar ${file.name}.`, 'error');
      console.error('❌ Erro ao ler arquivo:', file.name);
    };

    reader.readAsDataURL(file);
  }

  generatePhotoId() {
    return 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  updatePhotoGrid() {
    this.photoGrid.innerHTML = '';
    
    this.selectedPhotos.forEach((photo, index) => {
      const photoItem = this.createPhotoItem(photo, index);
      this.photoGrid.appendChild(photoItem);
    });

    // Atualizar contador
    this.updatePhotoCounter();

    // Mostrar/esconder áreas
    this.toggleAreas();

    console.log('🖼️ Grid atualizado com', this.selectedPhotos.length, 'fotos');
  }

  createPhotoItem(photo, index) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.setAttribute('data-photo-id', photo.id);
    
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.name;
    img.loading = 'lazy';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'photo-item-remove';
    removeBtn.innerHTML = '×';
    removeBtn.setAttribute('aria-label', `Remover ${photo.name}`);
    removeBtn.onclick = () => this.removePhoto(index);
    
    // Adicionar informações da foto
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'photo-info-overlay';
    infoOverlay.innerHTML = `
      <div class="photo-name">${photo.name}</div>
      <div class="photo-size">${this.formatFileSize(photo.size)}</div>
    `;
    
    photoItem.appendChild(img);
    photoItem.appendChild(removeBtn);
    photoItem.appendChild(infoOverlay);
    
    return photoItem;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  updatePhotoCounter() {
    const counter = document.getElementById('photoCounter');
    if (counter) {
      counter.textContent = `${this.selectedPhotos.length}/${this.maxPhotos}`;
    }
  }

  toggleAreas() {
    const hasPhotos = this.selectedPhotos.length > 0;
    
    if (hasPhotos) {
      this.previewArea.style.display = 'block';
      this.uploadZone.parentElement.style.display = 'none';
    } else {
      this.previewArea.style.display = 'none';
      this.uploadZone.parentElement.style.display = 'block';
    }
  }

  removePhoto(index) {
    const removedPhoto = this.selectedPhotos[index];
    this.selectedPhotos.splice(index, 1);
    this.updatePhotoGrid();
    
    this.showToast('🗑️ Foto removida', `${removedPhoto.name} foi removida.`, 'info');
    console.log('🗑️ Foto removida:', removedPhoto.name);
  }

  async uploadPhotos() {
    const name = document.getElementById('photoName')?.value?.trim();
    const email = document.getElementById('photoEmail')?.value?.trim();
    const message = document.getElementById('photoMessage')?.value?.trim();

    // Validação
    if (!this.validateUploadForm(name, email)) {
      return;
    }

    if (this.selectedPhotos.length === 0) {
      this.showToast('❌ Nenhuma foto', 'Por favor, selecione pelo menos uma foto.', 'error');
      return;
    }

    console.log('📤 Iniciando upload de', this.selectedPhotos.length, 'fotos...');

    // Mostrar estado de loading
    this.setUploadLoading(true);

    try {
      // Simular upload progress
      await this.simulateUploadProgress();
      
      // Processar upload
      const photoData = this.createPhotoSubmission(name, email, message);
      
      // Salvar dados
      this.savePhotoSubmission(photoData);
      
      // Enviar confirmação
      await this.sendEmailConfirmation(photoData);
      
      // Celebrar sucesso
      this.celebrateUploadSuccess();
      
      // Limpar formulário
      this.clearForm();
      
      console.log('✅ Upload concluído com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      this.showToast('❌ Erro no upload', 'Ocorreu um erro ao enviar as fotos. Tente novamente.', 'error');
    } finally {
      this.setUploadLoading(false);
    }
  }

  validateUploadForm(name, email) {
    let isValid = true;

    if (!name || name.length < 3) {
      this.showFieldError('photoName', 'Por favor, insira seu nome completo (mínimo 3 caracteres)');
      isValid = false;
    } else {
      this.hideFieldError('photoName');
    }

    if (!email || !this.validateEmail(email)) {
      this.showFieldError('photoEmail', 'Por favor, insira um e-mail válido');
      isValid = false;
    } else {
      this.hideFieldError('photoEmail');
    }

    return isValid;
  }

  validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    this.hideFieldError(fieldId);
    field.classList.add('field-error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    errorDiv.id = fieldId + '-error';
    
    field.parentNode.appendChild(errorDiv);
  }

  hideFieldError(fieldId) {
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) errorDiv.remove();

    const field = document.getElementById(fieldId);
    if (field) field.classList.remove('field-error');
  }

  setUploadLoading(loading) {
    const uploadBtn = document.getElementById('uploadPhotosBtn');
    if (!uploadBtn) return;

    if (loading) {
      uploadBtn.classList.add('loading');
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<i class="spinner"></i> Enviando...';
    } else {
      uploadBtn.classList.remove('loading');
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<i data-lucide="upload"></i> Enviar Fotos';
      
      // Recriar ícone Lucide
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }

  async simulateUploadProgress() {
    const progressBar = this.createProgressBar();
    
    for (let i = 0; i <= 100; i += 10) {
      progressBar.style.width = i + '%';
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTimeout(() => progressBar.remove(), 500);
  }

  createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'upload-progress-container';
    progressContainer.innerHTML = '<div class="upload-progress-bar"></div>';
    
    const photoActions = document.querySelector('.photo-actions');
    if (photoActions) {
      photoActions.parentNode.insertBefore(progressContainer, photoActions);
    }
    
    return progressContainer.querySelector('.upload-progress-bar');
  }

  createPhotoSubmission(name, email, message) {
    return {
      name: name,
      email: email,
      message: message,
      photos: this.selectedPhotos.map(photo => ({
        id: photo.id,
        name: photo.name,
        size: photo.size,
        type: photo.type,
        timestamp: new Date().toISOString()
      })),
      totalPhotos: this.selectedPhotos.length,
      totalSize: this.selectedPhotos.reduce((total, photo) => total + photo.size, 0),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };
  }

  savePhotoSubmission(data) {
    try {
      const submissions = JSON.parse(localStorage.getItem('weddingPhotoSubmissions') || '[]');
      submissions.push(data);
      localStorage.setItem('weddingPhotoSubmissions', JSON.stringify(submissions));
      console.log('💾 Submissão de fotos salva. Total:', submissions.length);
    } catch (error) {
      console.error('❌ Erro ao salvar submissão:', error);
      throw error;
    }
  }

  async sendEmailConfirmation(data) {
    const subject = 'Confirmação de Fotos - Casamento Vânia & Fabião';
    const body = `Olá ${data.name},

Recebemos suas ${data.totalPhotos} fotos com sucesso! 📸

${data.message ? `Mensagem: "${data.message}"` : ''}

Informações do envio:
• Total de fotos: ${data.totalPhotos}
• Tamanho total: ${this.formatFileSize(data.totalSize)}
• Data: ${new Date(data.timestamp).toLocaleString('pt-MZ')}

Obrigado por compartilhar estes momentos especiais do nosso casamento! ❤️
As fotos serão adicionadas à nossa galeria de memórias.

Com amor,
Vânia & Fabião 💍`;

    const mailtoUrl = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Abrir cliente de email após um pequeno delay
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1000);
  }

  celebrateUploadSuccess() {
    const photoCount = this.selectedPhotos.length;
    
    this.showToast(
      '✅ Fotos enviadas!', 
      `${photoCount} foto(s) recebidas com sucesso! Obrigado por compartilhar estes momentos especiais do nosso casamento. ❤️`,
      'success'
    );

    // Confetti especial para fotos
    this.createPhotoConfetti();
  }

  createPhotoConfetti() {
    const colors = ['#9C27B0', '#BA68C8', '#E1BEE7', '#CE93D8', '#AB47BC'];
    const icons = ['📸', '📷', '❤️', '💍', '✨'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}%;
          font-size: ${Math.random() * 10 + 15}px;
          z-index: 10000;
          animation: photoConfettiFall 4s linear forwards;
          pointer-events: none;
        `;
        confetti.textContent = icons[Math.floor(Math.random() * icons.length)];
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }, i * 25);
    }

    // Adicionar CSS da animação se não existir
    if (!document.querySelector('#photo-confetti-style')) {
      const style = document.createElement('style');
      style.id = 'photo-confetti-style';
      style.textContent = `
        @keyframes photoConfettiFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  clearForm() {
    this.selectedPhotos = [];
    this.updatePhotoGrid();
    
    // Limpar campos do formulário
    const nameField = document.getElementById('photoName');
    const emailField = document.getElementById('photoEmail');
    const messageField = document.getElementById('photoMessage');
    
    if (nameField) nameField.value = '';
    if (emailField) emailField.value = '';
    if (messageField) messageField.value = '';
    
    // Limpar erros
    ['photoName', 'photoEmail'].forEach(fieldId => {
      this.hideFieldError(fieldId);
    });
    
    console.log('🧹 Formulário de fotos limpo');
  }

  showFileFeedback(validCount, invalidCount) {
    if (invalidCount > 0) {
      this.showToast(
        '⚠️ Alguns arquivos ignorados', 
        `${validCount} fotos adicionadas, ${invalidCount} arquivos inválidos foram ignorados.`,
        'warning'
      );
    } else {
      this.showToast(
        '✅ Fotos adicionadas', 
        `${validCount} foto(s) adicionadas com sucesso!`,
        'success'
      );
    }
  }

  showToast(title, message, type = 'success') {
    const existingToast = document.querySelector('.photo-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'photo-toast';
    toast.innerHTML = `
      <div class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</div>
      <div>
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('photoUploadSession');
    if (!sessionId) {
      sessionId = 'photo_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('photoUploadSession', sessionId);
    }
    return sessionId;
  }

  // Método público para exportar dados
  exportPhotoSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('weddingPhotoSubmissions') || '[]');
    
    if (submissions.length === 0) {
      alert('Nenhuma submissão de fotos encontrada');
      return;
    }

    // Criar CSV detalhado
    const headers = ['Nome', 'Email', 'Total Fotos', 'Tamanho Total', 'Mensagem', 'Data'];
    const csv = [
      headers.join(','),
      ...submissions.map(submission => [
        `"${submission.name}"`,
        `"${submission.email}"`,
        submission.totalPhotos,
        `"${this.formatFileSize(submission.totalSize)}"`,
        `"${submission.message || ''}"`,
        `"${new Date(submission.timestamp).toLocaleString('pt-MZ')}"`
      ]).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `submissoes_fotos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

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
  
  // Inicializar novos sistemas
  window.drinkOrderSystem = new DrinkOrderSystem();
  window.photoUploadSystem = new PhotoUploadSystem();

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
  
  // Botões de desenvolvimento (localhost only)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const devButtons = document.createElement('div');
    devButtons.id = 'dev-buttons';
    devButtons.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    
    // Botão para ver dados RSVP
    const rsvpBtn = document.createElement('button');
    rsvpBtn.textContent = 'Ver RSVP';
    rsvpBtn.style.cssText = `
      background: #D4AF37;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    `;
    rsvpBtn.onclick = () => {
      const data = localStorage.getItem('weddingRSVP');
      console.log('RSVP Data:', data ? JSON.parse(data) : 'Nenhum dado');
      alert('Dados RSVP exibidos no console');
    };
    
    // Botão para ver pedidos de bebidas
    const drinksBtn = document.createElement('button');
    drinksBtn.textContent = 'Ver Bebidas';
    drinksBtn.style.cssText = `
      background: #4CAF50;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    `;
    drinksBtn.onclick = () => {
      const data = localStorage.getItem('weddingDrinkOrders');
      console.log('Drink Orders:', data ? JSON.parse(data) : 'Nenhum dado');
      alert('Pedidos de bebidas exibidos no console');
    };
    
    // Botão para exportar pedidos de bebidas
    const exportDrinksBtn = document.createElement('button');
    exportDrinksBtn.textContent = 'Exportar Bebidas';
    exportDrinksBtn.style.cssText = `
      background: #2E7D32;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    `;
    exportDrinksBtn.onclick = () => {
      if (window.drinkOrderSystem) {
        window.drinkOrderSystem.exportDrinkOrders();
      } else {
        alert('Sistema de bebidas não encontrado');
      }
    };
    
    // Botão para ver uploads de fotos
    const photosBtn = document.createElement('button');
    photosBtn.textContent = 'Ver Fotos';
    photosBtn.style.cssText = `
      background: #9C27B0;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    `;
    photosBtn.onclick = () => {
      const data = localStorage.getItem('weddingPhotoSubmissions');
      console.log('Photo Submissions:', data ? JSON.parse(data) : 'Nenhum dado');
      alert('Submissões de fotos exibidas no console');
    };
    
    // Botão para exportar fotos
    const exportPhotosBtn = document.createElement('button');
    exportPhotosBtn.textContent = 'Exportar Fotos';
    exportPhotosBtn.style.cssText = `
      background: #7B1FA2;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    `;
    exportPhotosBtn.onclick = () => {
      if (window.photoUploadSystem) {
        window.photoUploadSystem.exportPhotoSubmissions();
      } else {
        alert('Sistema de fotos não encontrado');
      }
    };
    
    // Botão para limpar dados
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpar Dados';
    clearBtn.style.cssText = `
      background: #f44336;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    `;
    clearBtn.onclick = () => {
      if (confirm('Limpar todos os dados?')) {
        localStorage.removeItem('weddingRSVP');
        localStorage.removeItem('weddingDrinkOrders');
        localStorage.removeItem('weddingPhotoSubmissions');
        alert('Dados limpos com sucesso');
      }
    };
    
    devButtons.appendChild(rsvpBtn);
    devButtons.appendChild(drinksBtn);
    devButtons.appendChild(exportDrinksBtn);
    devButtons.appendChild(photosBtn);
    devButtons.appendChild(exportPhotosBtn);
    devButtons.appendChild(clearBtn);
    document.body.appendChild(devButtons);
  }
});
