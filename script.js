// ==================== SISTEMA UNIVERSAL DE RELATÓRIOS - NOVO NORDISK ====================
// Versão: 2.0 | Salvamento Local com File System Access API
// Autor: Sistema Integrado | Data: 2025

'use strict';

// ==================== GERENCIADOR DE ARQUIVOS LOCAIS ====================
// ==================== SISTEMA DE COLAGEM COM CURSOR NO FINAL ====================

// Adicione esta classe no início do script.js:

class GerenciadorDeColagem {
    constructor() {
        this.processando = false;
        this.init();
    }

    init() {
        console.log('📋 Gerenciador de Colagem ATIVO');
        
        // Listener global para TODAS as colagens
    document.addEventListener('paste', (e) => {
        // ✅ IGNORAR SE ESTIVER PROCESSANDO
        if (this.processando) {
            console.log('⏸️ Colagem ignorada (processando)');
            return;
        }
        
        // ✅ IGNORAR SE MODAL ESTIVER ABERTO
        if (document.querySelector('.modal-overlay')) {
            console.log('⏸️ Colagem ignorada (modal aberto)');
            return;
        }
        
        // Verificar se é em elemento editável
        const target = e.target;
        if (target.isContentEditable ||
            target.contentEditable === 'true' ||
            target.classList.contains('smart-paragraph-content')) {
            console.log('📋 COLAGEM DETECTADA');
            // Processar colagem
            this.processarColagem(e, target);
        }
    }, true);
    }

// ==================== PROCESSAR COLAGEM SEM DELAYS VISÍVEIS ====================
// ==================== PREVENIR PULO VISUAL DO CURSOR ====================

// Adicione esta função no GerenciadorDeColagem:

prevenirPuloVisual(elemento) {
    // ✅ Ocultar cursor durante reposicionamento
    elemento.style.caretColor = 'transparent';
    
    setTimeout(() => {
        elemento.style.caretColor = '';
    }, 100);
}

// ✅ USE no processarColagem:
processarColagem(event, elemento) {
    console.log('📋 COLAGEM DETECTADA');
    
    // ✅ OCULTAR CURSOR TEMPORARIAMENTE
    this.prevenirPuloVisual(elemento);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Mover cursor
            this.moverCursorParaFinalDoElemento(elemento);
            
            // Verificar quebra
            requestAnimationFrame(() => {
                if (sistema && sistema.verificarQuebraAutomatica) {
                    sistema.verificarQuebraAutomatica(elemento);
                    
                    setTimeout(() => {
                        this.garantirCursorNoFinalGlobal();
                    }, 600);
                }
            });
        });
    });
}
    moverCursorParaFinalDoElemento(elemento) {
        console.log('🎯 Movendo cursor para o final do elemento...');
        
        try {
            // ✅ GARANTIR FOCO
            elemento.focus();
            
            // ✅ AGUARDAR FOCO SER APLICADO
            setTimeout(() => {
                const selection = window.getSelection();
                const range = document.createRange();
                
                // ✅ PEGAR ÚLTIMO NÓ DE TEXTO
                const walker = document.createTreeWalker(
                    elemento,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let ultimoTextoNode = null;
                while (walker.nextNode()) {
                    ultimoTextoNode = walker.currentNode;
                }
                
                if (ultimoTextoNode) {
                    // ✅ POSICIONAR NO FINAL DO ÚLTIMO NÓ DE TEXTO
                    const tamanho = ultimoTextoNode.length;
                    range.setStart(ultimoTextoNode, tamanho);
                    range.setEnd(ultimoTextoNode, tamanho);
                    
                    console.log(`✅ Cursor posicionado no caractere ${tamanho}`);
                    console.log(`   Últimos 30 caracteres: "...${ultimoTextoNode.textContent.substring(tamanho - 30, tamanho)}"`);
                } else {
                    // ✅ FALLBACK: Usar selectNodeContents + collapse(false)
                    range.selectNodeContents(elemento);
                    range.collapse(false); // false = FINAL
                    
                    console.log('⚠️ Usado fallback (collapse no final)');
                }
                
                // ✅ APLICAR RANGE
                selection.removeAllRanges();
                selection.addRange(range);
                
                console.log('✅ Cursor movido com sucesso!');
                
                // ✅ HIGHLIGHT VISUAL VERDE
                elemento.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
                elemento.style.transition = 'background-color 0.6s ease';
                
                setTimeout(() => {
                    elemento.style.backgroundColor = '';
                }, 1000);
                
            }, 30);
            
        } catch (error) {
            console.error('❌ Erro ao mover cursor:', error);
            
            // ✅ FALLBACK SIMPLES
            try {
                elemento.focus();
                document.execCommand('selectAll', false, null);
                window.getSelection().collapseToEnd();
                console.log('✅ Fallback aplicado');
            } catch (e) {
                console.error('❌ Fallback falhou:', e);
            }
        }
    }

    garantirCursorNoFinalGlobal() {
        console.log('🌍 Garantindo cursor no final global...');
        
        // ✅ PEGAR TODAS AS PÁGINAS
        const paginas = document.querySelectorAll('.page-content:not(.page-cover)');
        
        if (paginas.length === 0) {
            console.warn('⚠️ Nenhuma página encontrada');
            return;
        }
        
        // ✅ PEGAR ÚLTIMA PÁGINA
        const ultimaPagina = paginas[paginas.length - 1];
        
        // ✅ PEGAR TODOS OS PARÁGRAFOS DA ÚLTIMA PÁGINA
        const paragrafos = ultimaPagina.querySelectorAll('.smart-paragraph-content');
        
        if (paragrafos.length === 0) {
            console.warn('⚠️ Nenhum parágrafo na última página');
            return;
        }
        
        // ✅ PEGAR ÚLTIMO PARÁGRAFO
        const ultimoParagrafo = paragrafos[paragrafos.length - 1];
        
        console.log(`✅ Último parágrafo encontrado (${ultimoParagrafo.textContent.length} caracteres)`);
        console.log(`   Final: "...${ultimoParagrafo.textContent.substring(ultimoParagrafo.textContent.length - 40)}"`);
        
        // ✅ MOVER CURSOR PARA O FINAL DESTE PARÁGRAFO
        this.moverCursorParaFinalDoElemento(ultimoParagrafo);
        
        // ✅ SCROLL PARA MOSTRAR
        setTimeout(() => {
            ultimoParagrafo.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
}

// ✅ INSTANCIAR IMEDIATAMENTE
let gerenciadorColagem;

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        gerenciadorColagem = new GerenciadorDeColagem();
        console.log('✅ Gerenciador de Colagem Ativado!');
    }, 1000);
});
// ==================== CORREÇÃO CRÍTICA: SISTEMA DE SALVAMENTO ====================
// COLE ISTO NO INÍCIO DO SEU script.js, SUBSTITUINDO A CLASSE FileManager EXISTENTE

class FileManager {
    constructor() {
        this.fileHandle = null;
        this.currentFilePath = null;
        this.autoSaveInterval = null;
        this.hasUnsavedChanges = false;
        this.isInitialized = false;
        this.ultimosDados = null; // Cache dos últimos dados salvos
    }

    async init() {
        console.log('🗂️ Inicializando FileManager...');
        
        // Verificar suporte da API
        if (!('showSaveFilePicker' in window)) {
            alert('⚠️ Seu navegador não suporta salvamento local.\n\nUse Chrome 86+, Edge 86+ ou Opera 72+');
            return;
        }

        this.isInitialized = true;

        // Aguardar DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Adicionar botões
        this.addToolbarButtons();

        // Tentar carregar último arquivo
        setTimeout(() => {
            this.loadLastFile();
        }, 1000);

        // ✅ AUTO-SAVE A CADA 30 SEGUNDOS (MAIS FREQUENTE)
        this.startAutoSave();

        // Prevenir fechamento sem salvar
window.addEventListener('beforeunload', (e) => {
    if (this.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '⚠️ Você tem alterações não salvas!';
        // ❌ REMOVA ISTO:
        // this.saveDocument();
        return e.returnValue;
    }
});
        // ✅ DETECTAR MUDANÇAS NO DOCUMENTO
        this.setupChangeDetection();

        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey) {
                e.preventDefault();
                this.saveDocument();
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.saveAsNewFile();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                this.openDocument();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.newDocument();
            }
        });

        console.log('✅ FileManager inicializado!');
    }

    // ==================== DETECTAR MUDANÇAS NO DOCUMENTO ====================
    setupChangeDetection() {
        console.log('🔍 Configurando detecção de mudanças...');

        // Detectar digitação
        document.addEventListener('input', (e) => {
            if (e.target.isContentEditable || e.target.contentEditable === 'true') {
                this.markAsUnsaved();
            }
        });

        // Detectar mudanças no DOM (inserção/remoção de elementos)
        const observer = new MutationObserver((mutations) => {
            let houveMudanca = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && 
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    houveMudanca = true;
                }
            });

            if (houveMudanca) {
                this.markAsUnsaved();
            }
        });

        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            observer.observe(previewContainer, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }

        console.log('✅ Detecção de mudanças ativa');
    }

    // ==================== ADICIONAR BOTÕES NA TOOLBAR ====================
    addToolbarButtons() {
        const quickActions = document.querySelector('.quick-actions');
        if (!quickActions) {
            console.warn('⚠️ Quick actions não encontrada');
            return;
        }

        // Limpar botões antigos
        quickActions.querySelectorAll('.file-manager-btn').forEach(btn => btn.remove());

        // BOTÃO NOVO
        const btnNovo = this.criarBotao('file', 'Novo', 'Novo Documento (Ctrl+N)', () => this.newDocument());
        quickActions.insertBefore(btnNovo, quickActions.firstChild);

        // BOTÃO SALVAR
        const btnSalvar = this.criarBotao('save', 'Salvar', 'Salvar (Ctrl+S)', () => {
            console.log('💾 Botão SALVAR clicado');
            this.saveDocument();
        });
        btnSalvar.id = 'btnSalvarArquivo';
        quickActions.insertBefore(btnSalvar, quickActions.childNodes[1]);

        // BOTÃO ABRIR
        const btnAbrir = this.criarBotao('folder-open', 'Abrir', 'Abrir Documento (Ctrl+O)', () => this.openDocument());
        quickActions.insertBefore(btnAbrir, quickActions.childNodes[2]);

        console.log('✅ Botões adicionados');
    }

    criarBotao(icone, label, title, onClick) {
        const container = document.createElement('div');
        container.className = 'file-manager-btn';
        container.style.cssText = 'display: flex; flex-direction: column; align-items: center; cursor: pointer;';
        
        const btn = document.createElement('button');
        btn.className = 'btn-icon';
        btn.innerHTML = `<i class="fas fa-${icone}"></i>`;
        btn.title = title;
        btn.onclick = onClick;
        
        const lbl = document.createElement('span');
        lbl.textContent = label;
        lbl.style.cssText = 'font-size: 0.7rem; margin-top: 0.25rem;';
        
        container.appendChild(btn);
        container.appendChild(lbl);
        
        return container;
    }

    // ==================== SALVAR DOCUMENTO ====================
    async saveDocument(forceNewFile = false) {
        console.log('\n💾 ===== SALVAR DOCUMENTO =====');
        console.log('forceNewFile:', forceNewFile);
        console.log('fileHandle existe:', !!this.fileHandle);
        console.log('currentFilePath:', this.currentFilePath);

        if (!this.isInitialized) {
            console.error('❌ FileManager não inicializado');
            this.showToast('⚠️ Sistema não está pronto', 'warning');
            return;
        }

        try {
            // Se não tem arquivo OU quer "Salvar Como"
            if (!this.fileHandle || forceNewFile) {
                console.log('📂 Abrindo diálogo "Salvar Como"...');
                await this.saveAsNewFile();
                return;
            }

            // ✅ SALVAR NO ARQUIVO EXISTENTE
            console.log('💾 Salvando no arquivo:', this.currentFilePath);
            await this.writeToFile();
            
            console.log('✅ Salvamento concluído!');
            this.showToast('💾 Salvo: ' + this.currentFilePath, 'success');

        } catch (error) {
            console.error('❌ ERRO AO SALVAR:', error);
            
            if (error.name === 'AbortError') {
                console.log('ℹ️ Usuário cancelou');
                return;
            }

            alert('❌ ERRO AO SALVAR:\n\n' + error.message + '\n\nTente "Salvar Como" (Ctrl+Shift+S)');
        }
    }

    // ==================== SALVAR COMO (NOVA PASTA) ====================
    async saveAsNewFile() {
        console.log('\n📂 ===== SALVAR COMO =====');
        
        try {
            // Nome sugerido
            const dataAtual = new Date();
            const nomeArquivo = `Relatorio_${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}_${String(dataAtual.getHours()).padStart(2, '0')}h${String(dataAtual.getMinutes()).padStart(2, '0')}.nnr`;

            console.log('📝 Nome sugerido:', nomeArquivo);

            // Abrir diálogo
            this.fileHandle = await window.showSaveFilePicker({
                suggestedName: nomeArquivo,
                types: [{
                    description: 'Relatório Novo Nordisk',
                    accept: { 'application/json': ['.nnr'] }
                }],
                excludeAcceptAllOption: false
            });

            this.currentFilePath = this.fileHandle.name;
            localStorage.setItem('lastFilePath', this.currentFilePath);

            console.log('✅ Arquivo selecionado:', this.currentFilePath);

            // Escrever dados
            await this.writeToFile();

            // Fechar modal de boas-vindas
            this.closeWelcomeModal();

            this.showToast('✅ Salvo: ' + this.currentFilePath, 'success');

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('❌ Erro em saveAsNewFile:', error);
                alert('❌ Erro ao salvar:\n' + error.message);
            } else {
                console.log('ℹ️ Usuário cancelou');
            }
        }
    }

    // ==================== ESCREVER DADOS NO ARQUIVO ====================
    async writeToFile() {
        if (!this.fileHandle) {
            throw new Error('❌ fileHandle não existe! Use "Salvar Como" primeiro.');
        }

        console.log('\n✍️ ===== ESCREVENDO NO ARQUIVO =====');

        try {
            // ✅ COLETAR DADOS
            const documentData = this.collectDocumentData();
            
            // ✅ CONVERTER PARA JSON
            const jsonData = JSON.stringify(documentData, null, 2);
            
            console.log('📊 Dados coletados:');
            console.log('   Tamanho:', (jsonData.length / 1024).toFixed(2), 'KB');
            console.log('   Figuras:', documentData.counters.figureCounter);
            console.log('   Tabelas:', documentData.counters.tableCounter);
            console.log('   Páginas:', document.querySelectorAll('.page-content').length);

            // ✅ VERIFICAR SE HÁ MUDANÇAS
            if (jsonData === this.ultimosDados) {
                console.log('ℹ️ Nenhuma mudança desde último salvamento');
                this.hasUnsavedChanges = false;
                this.updateTitle();
                return;
            }

            // ✅ CRIAR STREAM DE ESCRITA
            console.log('📝 Criando stream de escrita...');
            const writable = await this.fileHandle.createWritable();
            
            // ✅ ESCREVER DADOS
            console.log('💾 Escrevendo dados...');
            await writable.write(jsonData);
            
            // ✅ FECHAR ARQUIVO
            console.log('🔒 Fechando arquivo...');
            await writable.close();

            // ✅ ATUALIZAR CACHE
            this.ultimosDados = jsonData;
            this.hasUnsavedChanges = false;
            this.updateTitle();

            console.log('✅ ARQUIVO SALVO COM SUCESSO!');
            console.log('   Local:', this.currentFilePath);
            console.log('═════════════════════════════════\n');

        } catch (error) {
            console.error('❌ ERRO AO ESCREVER:', error);
            throw error;
        }
    }

collectDocumentData() {
    console.log('📦 Coletando dados do documento...');
    
    const data = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        filename: this.currentFilePath || 'sem_nome.nnr',
        
        // HTML completo do preview
        htmlContent: document.getElementById('previewContainer')?.innerHTML || '',
        
        // ✅ DADOS DA CAPA CANVAS - SALVAMENTO COMPLETO
        coverData: {
            // Salvar HTML dos elementos do canvas
            canvasHTML: document.getElementById('coverCanvas')?.innerHTML || '',
            // Salvar estilo do background
            backgroundStyle: document.getElementById('coverBackground')?.style.cssText || '',
            // Salvar background completo (incluindo imagens)
            backgroundImage: document.getElementById('coverBackground')?.style.backgroundImage || '',
            backgroundColor: document.getElementById('coverBackground')?.style.backgroundColor || '',
            backgroundSize: document.getElementById('coverBackground')?.style.backgroundSize || '',
            backgroundPosition: document.getElementById('coverBackground')?.style.backgroundPosition || '',
            opacity: document.getElementById('coverBackground')?.style.opacity || '1'
        },
        
        // Contadores
        counters: {
            figureCounter: window.sistema?.figureCounter || 1,
            tableCounter: window.sistema?.tableCounter || 1
        },
        
        // Configurações
        settings: {
            zoomLevel: window.sistema?.zoomLevel || 1,
            theme: document.body.classList.contains('light-mode') ? 'light' : 'dark'
        },
        
        // Imagens em Base64
        images: this.extractAllImages()
    };

    console.log('✅ Dados coletados:', {
        tamanhoHTML: (data.htmlContent.length / 1024).toFixed(2) + ' KB',
        quantidadeImagens: data.images.length,
        figuras: data.counters.figureCounter,
        tabelas: data.counters.tableCounter,
        temCanvasHTML: !!data.coverData.canvasHTML,
        temBackgroundStyle: !!data.coverData.backgroundStyle
    });
    
    return data;
}

    // ==================== EXTRAIR TODAS AS IMAGENS ====================
    extractAllImages() {
        const images = [];
        const imgElements = document.querySelectorAll('#previewContainer img, #coverCanvas img');
        
        imgElements.forEach((img, index) => {
            if (img.src && img.src.startsWith('data:image')) {
                images.push({
                    id: `img_${index}`,
                    src: img.src,
                    alt: img.alt || '',
                    className: img.className || '',
                    width: img.style.width || 'auto',
                    height: img.style.height || 'auto'
                });
            }
        });

        console.log(`📸 ${images.length} imagens extraídas`);
        return images;
    }

    // ==================== CARREGAR ÚLTIMO ARQUIVO ====================
    async loadLastFile() {
        try {
            const lastPath = localStorage.getItem('lastFilePath');
            
            if (!lastPath) {
                console.log('ℹ️ Nenhum arquivo anterior');
                this.showWelcomeModal();
                return;
            }

            console.log('🔍 Último arquivo:', lastPath);
            console.log('📂 Tentando abrir automaticamente...');

            // Solicitar acesso
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Relatório Novo Nordisk',
                    accept: { 'application/json': ['.nnr'] }
                }],
                multiple: false
            });

            this.fileHandle = fileHandle;
            this.currentFilePath = fileHandle.name;
            localStorage.setItem('lastFilePath', this.currentFilePath);

            // Ler arquivo
            const file = await fileHandle.getFile();
            const content = await file.text();
            const data = JSON.parse(content);

            // Restaurar
            this.restoreDocument(data);
            this.closeWelcomeModal();

            console.log('✅ Documento carregado:', this.currentFilePath);
            this.showToast('✅ Documento restaurado!', 'success');

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('ℹ️ Usuário cancelou abertura');
                this.showWelcomeModal();
            } else {
                console.warn('⚠️ Erro ao carregar:', error.message);
                this.showWelcomeModal();
            }
        }
    }

restoreDocument(data) {
    console.log('📂 Restaurando documento...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
        // ✅ RESTAURAR HTML DO PREVIEW
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer && data.htmlContent) {
            previewContainer.innerHTML = data.htmlContent;
            console.log('✅ HTML do preview restaurado');
        }

        // ✅ ✅ ✅ RESTAURAR CAPA CANVAS - CORREÇÃO CRÍTICA
        if (data.coverData) {
            console.log('🎨 Restaurando capa canvas...');
            
            const coverCanvas = document.getElementById('coverCanvas');
            const coverBackground = document.getElementById('coverBackground');
            
            // ✅ 1. RESTAURAR HTML DO CANVAS (elementos arrastáveis)
            if (coverCanvas && data.coverData.canvasHTML) {
                coverCanvas.innerHTML = data.coverData.canvasHTML;
                console.log('✅ Canvas HTML restaurado');
                console.log('   Elementos:', coverCanvas.children.length);
            }
            
            // ✅ 2. RESTAURAR BACKGROUND COMPLETO
            if (coverBackground) {
                // Método 1: Restaurar cssText completo
                if (data.coverData.backgroundStyle) {
                    coverBackground.style.cssText = data.coverData.backgroundStyle;
                    console.log('✅ Background style restaurado');
                }
                
                // Método 2: Garantir propriedades individuais (fallback)
                if (data.coverData.backgroundImage) {
                    coverBackground.style.backgroundImage = data.coverData.backgroundImage;
                    console.log('✅ Background image restaurada');
                }
                if (data.coverData.backgroundColor) {
                    coverBackground.style.backgroundColor = data.coverData.backgroundColor;
                }
                if (data.coverData.backgroundSize) {
                    coverBackground.style.backgroundSize = data.coverData.backgroundSize;
                }
                if (data.coverData.backgroundPosition) {
                    coverBackground.style.backgroundPosition = data.coverData.backgroundPosition;
                }
                if (data.coverData.opacity) {
                    coverBackground.style.opacity = data.coverData.opacity;
                }
                
                console.log('✅ Background properties restauradas');
            }
            
            // ✅ 3. ATUALIZAR INDICADOR DO EDITOR DE CAPA
            if (window.editorCapa && editorCapa.atualizarIndicador) {
                setTimeout(() => {
                    editorCapa.atualizarIndicador();
                    console.log('✅ Indicador da capa atualizado');
                }, 300);
            }
        }

        // Restaurar contadores
        if (data.counters && window.sistema) {
            window.sistema.figureCounter = data.counters.figureCounter || 1;
            window.sistema.tableCounter = data.counters.tableCounter || 1;
            console.log('✅ Contadores restaurados');
        }

        // Restaurar tema
        if (data.settings?.theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        console.log('✅ Tema restaurado');

        // Re-aplicar listeners e botões
        setTimeout(() => {
            if (typeof adicionarBotoesEntrePaginas === 'function') {
                adicionarBotoesEntrePaginas();
            }
            if (typeof adicionarBotoesDeletarPagina === 'function') {
                adicionarBotoesDeletarPagina();
            }
            if (typeof renumerarPaginas === 'function') {
                renumerarPaginas();
            }
        }, 500);

        this.hasUnsavedChanges = false;
        this.updateTitle();
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Documento restaurado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao restaurar documento:', error);
        alert('❌ Erro ao restaurar documento. Iniciando novo documento.');
        this.showWelcomeModal();
    }
}
    // ==================== AUTO-SAVE ====================
    startAutoSave() {
        // ✅ AUTO-SAVE A CADA 30 SEGUNDOS
        this.autoSaveInterval = setInterval(() => {
            if (this.hasUnsavedChanges && this.fileHandle) {
                console.log('⏰ Auto-save disparado');
                this.saveDocument();
            }
        }, 30000); // 30 segundos

        console.log('✅ Auto-save ativado (30 segundos)');
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            console.log('⏸️ Auto-save desativado');
        }
    }

    // ==================== MARCAR COMO NÃO SALVO ====================
    markAsUnsaved() {
        if (!this.hasUnsavedChanges) {
            this.hasUnsavedChanges = true;
            this.updateTitle();
            console.log('📝 Documento marcado como não salvo');
        }
    }

    // ==================== ATUALIZAR TÍTULO DA PÁGINA ====================
    updateTitle() {
        const baseTitle = 'Sistema Universal de Relatórios - Novo Nordisk';
        const fileName = this.currentFilePath || 'Novo Documento';
        const unsavedMark = this.hasUnsavedChanges ? ' •' : '';
        document.title = `${fileName}${unsavedMark} - ${baseTitle}`;
    }

    // ==================== ABRIR DOCUMENTO ====================
    async openDocument() {
        try {
            if (this.hasUnsavedChanges) {
                const confirmar = confirm('⚠️ Você tem alterações não salvas.\n\nDeseja continuar e abrir outro documento?');
                if (!confirmar) return;
            }

            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Relatório Novo Nordisk',
                    accept: { 'application/json': ['.nnr'] }
                }],
                multiple: false
            });

            this.fileHandle = fileHandle;
            this.currentFilePath = fileHandle.name;
            localStorage.setItem('lastFilePath', this.currentFilePath);

            const file = await fileHandle.getFile();
            const content = await file.text();
            const data = JSON.parse(content);

            this.restoreDocument(data);
            this.showToast('✅ Documento aberto!', 'success');

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('❌ Erro ao abrir:', error);
                alert('❌ Erro ao abrir documento:\n' + error.message);
            }
        }
    }

async newDocument() {
    try {
        if (this.hasUnsavedChanges) {
            const confirm = window.confirm(
                '⚠️ Você tem alterações não salvas.\n\n' +
                'Deseja continuar e criar um novo documento?'
            );
            if (!confirm) return;
        }

        console.log('📄 Criando novo documento...');

        // ✅ SALVAR ESTADO DA CAPA ATUAL (PARA NÃO PERDER TEMPLATES)
        const capaAtual = {
            canvasHTML: document.getElementById('coverCanvas')?.innerHTML || '',
            backgroundStyle: document.getElementById('coverBackground')?.style.cssText || ''
        };

        // Limpar preview (mas MANTER capa e sumário)
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            const pageCover = document.getElementById('pageCover');
            const pageSumario = document.getElementById('pageSumario');
            
            const novaCapa = pageCover ? pageCover.cloneNode(true) : null;
            const novoSumario = pageSumario ? pageSumario.cloneNode(true) : null;
            
            previewContainer.innerHTML = '';
            
            if (novaCapa) previewContainer.appendChild(novaCapa);
            if (novoSumario) previewContainer.appendChild(novoSumario);
        }

        // ✅ RESTAURAR CAPA (NÃO LIMPAR!)
        const coverCanvas = document.getElementById('coverCanvas');
        const coverBackground = document.getElementById('coverBackground');
        
        if (coverCanvas && capaAtual.canvasHTML) {
            coverCanvas.innerHTML = capaAtual.canvasHTML;
            console.log('✅ Canvas da capa preservado');
        }
        
        if (coverBackground && capaAtual.backgroundStyle) {
            coverBackground.style.cssText = capaAtual.backgroundStyle;
            console.log('✅ Background da capa preservado');
        }

        // Resetar fileHandle
        this.fileHandle = null;
        this.currentFilePath = null;
        this.hasUnsavedChanges = false;
        localStorage.removeItem('lastFilePath');

        // Resetar contadores
        if (window.sistema) {
            window.sistema.figureCounter = 1;
            window.sistema.tableCounter = 1;
        }

        this.updateTitle();
        this.showToast('✅ Novo documento criado! (Capa preservada)', 'success');

        // Forçar salvamento
        setTimeout(() => {
            this.showWelcomeModal();
        }, 500);
        
        console.log('✅ Novo documento criado (capa intacta)');
        
    } catch (error) {
        console.error('❌ Erro ao criar novo documento:', error);
    }
}

    // ==================== MODAL DE BOAS-VINDAS ====================
    showWelcomeModal() {
        const existingModal = document.querySelector('.welcome-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'welcome-modal';
        modal.innerHTML = `
            <div class="welcome-modal-content">
                <div class="welcome-header">
                    <i class="fas fa-file-alt"></i>
                    <h2>Bem-vindo ao Sistema Universal de Relatórios</h2>
                </div>
                <div class="welcome-body">
                    <p>Para começar, escolha uma das opções:</p>
                    <div class="welcome-options">
                        <div class="welcome-option">
                            <i class="fas fa-file-plus"></i>
                            <h3>Criar Novo Documento</h3>
                            <ul>
                                <li>✅ Escolha uma pasta no seu computador</li>
                                <li>✅ Defina um nome para o arquivo</li>
                                <li>✅ Salvamento automático a cada 30 segundos</li>
                            </ul>
                            <button class="btn btn-primary btn-lg" id="btnSalvarModal">
                                <i class="fas fa-save me-2"></i>Escolher Local e Salvar
                            </button>
                        </div>
                        
                        <div class="welcome-divider">
                            <span>OU</span>
                        </div>
                        
                        <div class="welcome-option">
                            <i class="fas fa-folder-open"></i>
                            <h3>Abrir Documento Existente</h3>
                            <ul>
                                <li>✅ Abra um arquivo .nnr salvo anteriormente</li>
                                <li>✅ Continue editando de onde parou</li>
                                <li>✅ Todos os dados serão restaurados</li>
                            </ul>
                            <button class="btn btn-success btn-lg" id="btnAbrirModal">
                                <i class="fas fa-folder-open me-2"></i>Abrir Arquivo
                            </button>
                        </div>
                    </div>
                    
                    <div class="welcome-info">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Formato:</strong> Os arquivos são salvos como <code>.nnr</code> (Novo Nordisk Report)<br>
                            <strong>Conteúdo:</strong> Textos, imagens, tabelas e formatação completa
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const btnSalvar = document.getElementById('btnSalvarModal');
        const btnAbrir = document.getElementById('btnAbrirModal');
        
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => this.saveAsNewFile());
        }

        if (btnAbrir) {
            btnAbrir.addEventListener('click', async () => {
                try {
                    await this.openDocument();
                    this.closeWelcomeModal();
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Erro:', error);
                    }
                }
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                e.preventDefault();
                this.showToast('⚠️ Escolha uma opção para continuar!', 'warning');
            }
        });

        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        console.log('📋 Modal de boas-vindas exibido');
    }

    closeWelcomeModal() {
        const modal = document.querySelector('.welcome-modal');
        if (modal) {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                console.log('✅ Modal fechado');
            }, 300);
        }
    }

    // ==================== TOAST ====================
    showToast(mensagem, tipo = 'info') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        toast.style.borderLeftColor = colors[tipo] || colors.info;
        toast.innerHTML = `
            <i class="fas ${icons[tipo] || icons.info}"></i>
            <span>${mensagem}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ==================== INSTÂNCIA GLOBAL ====================
let fileManager;

// ==================== INICIALIZAÇÃO ====================
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Sistema...');
    
    // Aguardar 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Inicializar FileManager
    fileManager = new FileManager();
    await fileManager.init();
    
    console.log('✅ Sistema completo inicializado!');
});

// Exportar
window.fileManager = fileManager;

class SistemaRelatorios {
    constructor() {
        this.editableContent = document.getElementById('editableContent');
        this.contextMenu = document.getElementById('contextMenu');
        this.clickPosition = { x: 0, y: 0, element: null, elementoParaExcluir: null, paginaClicada: null, clickY: 0 };
        this.figureCounter = 1;
        this.tableCounter = 1;
        this.zoomLevel = 1;
        this.init();
            // Iniciar monitoramento
    setTimeout(() => {
        this.iniciarMonitoramentoGlobal();
    }, 2000);
        setTimeout(() => {
        if (!window.sistemaExclusao) {
            window.sistemaExclusao = new SistemaExclusaoUniversal();
        }
    }, 2000);
    }

    init() {
        this.setupContextMenu();
        this.setupDragAndDrop();
        this.setupKeyboardShortcuts();
        this.setupAutoSave();
        this.setupEditableElements();
        this.carregarDados();
        setTimeout(() => {
            adicionarBotoesEntrePaginas();
            adicionarBotoesDeletarPagina();
        }, 500);
        console.log('✅ Sistema 100% Funcional - Inserção Exata + Divisão Automática!');
    }

    // ==================== MENU DE CONTEXTO ====================
    
    setupContextMenu() {
        document.getElementById('previewContainer').addEventListener('contextmenu', (e) => {
            const target = e.target;
            
            if (target.closest('.editable-content') || target.closest('.page-content')) {
                e.preventDefault();
                e.stopPropagation();
                
                const elementoClicado = this.detectarElementoClicado(target, e.clientY);
                let paginaClicada = target.closest('.page-content');
                
                this.clickPosition = {
                    x: e.clientX,
                    y: e.clientY,
                    clickY: e.clientY,
                    element: elementoClicado.insertPoint,
                    elementoParaExcluir: elementoClicado.elementoExcluivel,
                    paginaClicada: paginaClicada,
                    inserirAntes: elementoClicado.inserirAntes
                };
                
                // Mostrar indicador visual
                if (elementoClicado.insertPoint && elementoClicado.insertPoint.tagName) {
                    this.mostrarIndicadorInsercao(elementoClicado.insertPoint, elementoClicado.inserirAntes);
                }
                
                this.configurarMenuContexto(elementoClicado.elementoExcluivel);
                this.showContextMenu(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
                this.removerSelecaoExclusao();
                this.removerIndicadorInsercao();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideContextMenu();
                this.removerSelecaoExclusao();
                this.removerIndicadorInsercao();
            }
        });
    }

    detectarElementoClicado(target, clickY) {
        console.log('\n🔍 DETECTAR ELEMENTO CLICADO');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Target:', target.tagName, target.className);
        console.log('Click Y:', clickY);
        
        const elementosExcluiveis = [
            '.photo-group-container',
            '.editable-table',
            'table',
            '.editable-list',
            'ul', 'ol',
            '.photo-item',
            '.editable-photo',
            'blockquote',
            'h2', 'h3', 'h4',
            'p',
            '.editable-text'
        ];
        
        // Tentar encontrar elemento específico
        for (let selector of elementosExcluiveis) {
            const elemento = target.closest(selector);
            
            if (elemento && 
                !elemento.classList.contains('page-footer') &&
                !elemento.closest('.page-footer') &&
                !elemento.closest('.cover-content')) {
                
                const rect = elemento.getBoundingClientRect();
                const metadeElemento = rect.top + (rect.height / 2);
                const inserirAntes = clickY < metadeElemento;
                
                console.log('✅ Elemento ESPECÍFICO detectado:', selector);
                console.log('   Tag:', elemento.tagName);
                console.log('   Metade:', metadeElemento);
                console.log('   Inserir ANTES?', inserirAntes);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                
                return {
                    elementoExcluivel: elemento,
                    insertPoint: elemento,
                    inserirAntes: inserirAntes
                };
            }
        }
        
        // Se não encontrou elemento específico, procurar o mais próximo
        const editableContent = target.closest('.editable-content');
        
        if (editableContent) {
            const filhos = Array.from(editableContent.children).filter(el => 
                el.tagName && !el.classList.contains('page-footer')
            );
            
            if (filhos.length > 0) {
                // Encontrar elemento mais próximo do clique
                let elementoMaisProximo = null;
                let menorDistancia = Infinity;
                
                filhos.forEach(filho => {
                    const rect = filho.getBoundingClientRect();
                    const centro = rect.top + (rect.height / 2);
                    const distancia = Math.abs(clickY - centro);
                    
                    if (distancia < menorDistancia) {
                        menorDistancia = distancia;
                        elementoMaisProximo = filho;
                    }
                });
                
                if (elementoMaisProximo) {
                    const rect = elementoMaisProximo.getBoundingClientRect();
                    const metade = rect.top + (rect.height / 2);
                    const inserirAntes = clickY < metade;
                    
                    console.log('✅ Elemento MAIS PRÓXIMO detectado:', elementoMaisProximo.tagName);
                    console.log('   Distância:', menorDistancia.toFixed(2), 'px');
                    console.log('   Inserir ANTES?', inserirAntes);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                    
                    return {
                        elementoExcluivel: null,
                        insertPoint: elementoMaisProximo,
                        inserirAntes: inserirAntes
                    };
                }
            }
            
            // Área vazia - inserir no final
            console.log('⚠️ Área VAZIA - inserir no final');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            
            return {
                elementoExcluivel: null,
                insertPoint: editableContent,
                inserirAntes: false
            };
        }
        
        console.warn('⚠️ Nenhuma área editável encontrada');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        return {
            elementoExcluivel: null,
            insertPoint: null,
            inserirAntes: false
        };
    }

mostrarIndicadorInsercao(elemento, inserirAntes) {
    this.removerIndicadorInsercao();
    
    if (!elemento || !elemento.getBoundingClientRect) return;
    
    const rect = elemento.getBoundingClientRect();
    
    // ✅ USAR O PREVIEW CONTAINER COMO REFERÊNCIA
    const previewContainer = document.getElementById('previewContainer');
    
    if (!previewContainer) return;
    
    // ✅ CALCULAR POSIÇÃO RELATIVA AO SCROLL DO CONTAINER
    const scrollTop = previewContainer.scrollTop;
    const scrollLeft = previewContainer.scrollLeft;
    
    // ✅ POSIÇÃO ABSOLUTA DENTRO DO PREVIEW CONTAINER
    const topPosition = rect.top + scrollTop - previewContainer.getBoundingClientRect().top + (inserirAntes ? 0 : rect.height);
    const leftPosition = rect.left + scrollLeft - previewContainer.getBoundingClientRect().left;
    
    // Criar linha indicadora
    const indicator = document.createElement('div');
    indicator.className = 'insert-indicator';
    indicator.style.cssText = `
        position: absolute;
        left: ${leftPosition}px;
        top: ${topPosition}px;
        width: ${rect.width}px;
        height: 4px;
        background: linear-gradient(90deg, #10b981, #059669);
        z-index: 10000;
        pointer-events: none;
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
    `;
    
    // Criar label
    const label = document.createElement('div');
    label.className = 'insert-indicator-label';
    label.textContent = inserirAntes ? '⬆️ INSERIR ANTES' : '⬇️ INSERIR DEPOIS';
    label.style.cssText = `
        position: absolute;
        left: ${leftPosition + 10}px;
        top: ${inserirAntes ? topPosition - 30 : topPosition + 5}px;
        background: rgba(16, 185, 129, 0.95);
        color: white;
        padding: 6px 15px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        z-index: 10001;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        white-space: nowrap;
    `;
    
    // ✅ ADICIONAR DENTRO DO PREVIEW CONTAINER
    previewContainer.appendChild(indicator);
    previewContainer.appendChild(label);
    
    console.log('✅ Indicador criado:', {
        elemento: elemento.tagName,
        inserirAntes: inserirAntes,
        top: topPosition,
        left: leftPosition,
        width: rect.width
    });
}
    removerIndicadorInsercao() {
        document.querySelectorAll('.insert-indicator, .insert-indicator-label').forEach(el => el.remove());
    }

    configurarMenuContexto(elementoExcluivel) {
        const menuExcluir = document.getElementById('menuExcluir');
        const dividerExcluir = document.getElementById('dividerExcluir');
        const menuTitle = document.getElementById('contextMenuTitle');
        
        if (elementoExcluivel) {
            menuExcluir.style.display = 'flex';
            dividerExcluir.style.display = 'block';
            menuTitle.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Elemento';
            
            this.removerSelecaoExclusao();
            elementoExcluivel.classList.add('selected-for-delete');
            
            const tipoElemento = this.getNomeElemento(elementoExcluivel);
            menuExcluir.querySelector('span').textContent = `Excluir ${tipoElemento}`;
            
        } else {
            menuExcluir.style.display = 'none';
            dividerExcluir.style.display = 'none';
            menuTitle.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Inserir Novo Elemento';
        }
    }
    
    getNomeElemento(elemento) {
        if (elemento.classList && elemento.classList.contains('photo-group-container')) {
            const numFotos = elemento.querySelectorAll('.photo-item').length;
            return `Grupo de ${numFotos} foto${numFotos > 1 ? 's' : ''}`;
        }
        if (elemento.tagName === 'H2') return 'Título Principal';
        if (elemento.tagName === 'H3') return 'Subtítulo';
        if (elemento.tagName === 'H4') return 'Título Nível 3';
        if (elemento.tagName === 'P') return 'Parágrafo';
        if (elemento.tagName === 'TABLE' || elemento.classList.contains('editable-table')) return 'Tabela';
        if (elemento.classList.contains('photo-item') || elemento.classList.contains('editable-photo')) return 'Imagem';
        if (elemento.tagName === 'UL' || elemento.tagName === 'OL') return 'Lista';
        if (elemento.tagName === 'BLOCKQUOTE') return 'Citação';
        return 'Este Elemento';
    }
    
    removerSelecaoExclusao() {
        document.querySelectorAll('.selected-for-delete').forEach(el => {
            el.classList.remove('selected-for-delete');
        });
    }
    
    showContextMenu(x, y) {
        this.contextMenu.style.display = 'block';
        
        const menuRect = this.contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let posX = x;
        let posY = y;
        
        if (x + menuRect.width > viewportWidth) {
            posX = viewportWidth - menuRect.width - 10;
        }
        
        if (y + menuRect.height > viewportHeight) {
            posY = viewportHeight - menuRect.height - 10;
        }
        
        this.contextMenu.style.left = posX + 'px';
        this.contextMenu.style.top = posY + 'px';
    }
    
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }
    
    // ==================== INSERIR ELEMENTOS ====================
    
inserirElemento(tipo) {
    let elemento;
    const insertPoint = this.clickPosition.element;
    
    switch(tipo) {
        case 'titulo1':
            elemento = this.criarTitulo('h2', 'Título Nível 1');
            break;
        case 'titulo2':
            elemento = this.criarTitulo('h3', 'Título Nível 2');
            break;
        case 'titulo3':
            elemento = this.criarTitulo('h4', 'Título Nível 3');
            break;
        case 'paragrafo':
            elemento = this.criarParagrafo();
            break;
        case 'lista':
            elemento = this.criarLista(false);
            break;
        case 'lista-numerada':
            elemento = this.criarLista(true);
            break;
        case 'tabela':
            // ✅ CHAMAR FUNÇÃO GLOBAL (não método da classe)
            mostrarModalTabela();
            this.hideContextMenu();
            this.removerIndicadorInsercao();
            return; // ✅ IMPORTANTE: RETORNAR AQUI
        case 'imagem':
            // ✅ CHAMAR FUNÇÃO GLOBAL (não método da classe)
            mostrarModalImagem();
            this.hideContextMenu();
            this.removerIndicadorInsercao();
            return; // ✅ IMPORTANTE: RETORNAR AQUI
        case 'citacao':
            elemento = this.criarCitacao();
            break;
        case 'quebra-pagina':
            this.inserirQuebraPagina();
            this.hideContextMenu();
            this.removerIndicadorInsercao();
            return;
    }
    
    if (elemento) {
        this.inserirElementoNoLocalExato(elemento, insertPoint);
        this.hideContextMenu();
        this.removerIndicadorInsercao();
        this.salvarDados();
        this.mostrarToast('✅ Elemento inserido no local exato!', 'success');
    }
}

    // ==================== ✅ INSERÇÃO NO LOCAL EXATO DO CLIQUE ====================
    
    inserirElementoNoLocalExato(elemento, insertPoint) {
        console.log('\n═══════════════════════════════════');
        console.log('🎯 INSERÇÃO NO LOCAL EXATO DO CLIQUE');
        console.log('═══════════════════════════════════');
        
        // PASSO 1: Encontrar página
        let paginaAtual = this.clickPosition.paginaClicada;
        
        if (!paginaAtual) {
            paginaAtual = insertPoint?.closest('.page-content');
        }
        
        if (!paginaAtual) {
            const todasPaginas = document.querySelectorAll('.page-content:not(.page-cover)');
            paginaAtual = todasPaginas[todasPaginas.length - 1];
        }
        
        console.log('📍 Página:', paginaAtual ? 'Encontrada' : 'Não encontrada');
        
        if (!paginaAtual) {
            console.error('❌ Nenhuma página encontrada!');
            return;
        }
        
        const editableContent = paginaAtual.querySelector('.editable-content');
        
        if (!editableContent) {
            console.error('❌ .editable-content não encontrado!');
            return;
        }
        
        // PASSO 2: Determinar posição de inserção
        const inserirAntes = this.clickPosition.inserirAntes;
        
        console.log('📍 Inserir ANTES?', inserirAntes);
        console.log('📍 Elemento alvo:', insertPoint?.tagName || 'Container');
        
        // PASSO 3: INSERIR NO LOCAL EXATO (independente de espaço)
        if (insertPoint && insertPoint !== editableContent && insertPoint.tagName) {
            if (inserirAntes) {
                // Inserir ANTES
                insertPoint.parentNode.insertBefore(elemento, insertPoint);
                console.log('✅ Inserido ANTES de:', insertPoint.tagName);
            } else {
                // Inserir DEPOIS
                if (insertPoint.nextSibling) {
                    insertPoint.parentNode.insertBefore(elemento, insertPoint.nextSibling);
                } else {
                    insertPoint.parentNode.appendChild(elemento);
                }
                console.log('✅ Inserido DEPOIS de:', insertPoint.tagName);
            }
        } else {
            // Inserir no final
            editableContent.appendChild(elemento);
            console.log('✅ Inserido no FINAL (área vazia)');
        }
        
        console.log('═══════════════════════════════════\n');
        
        // PASSO 4: Animação
        elemento.classList.add('inserting');
        setTimeout(() => {
            elemento.classList.remove('inserting');
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
// PASSO 4: Animação
elemento.classList.add('inserting');
setTimeout(() => {
    elemento.classList.remove('inserting');
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, 100);
        }, 100);
        
        // PASSO 5: Verificar overflow e reprocessar
        if (divisorDeElementos) {
            setTimeout(() => {
                divisorDeElementos.reprocessarPaginaCompleta(paginaAtual);
            }, 300);
        }
    }

    calcularEspacoDisponivel(pagina) {
        const editableContent = pagina.querySelector('.editable-content');
        const rodape = pagina.querySelector('.page-footer');
        
        if (!editableContent || !rodape) return 999999;
        
        const rodapeRect = rodape.getBoundingClientRect();
        const ultimoElemento = editableContent.lastElementChild;
        
        if (!ultimoElemento) {
            const contentRect = editableContent.getBoundingClientRect();
            return rodapeRect.top - contentRect.top - 20;
        }
        
        const ultimoRect = ultimoElemento.getBoundingClientRect();
        return rodapeRect.top - ultimoRect.bottom - 20;
    }

    estimarAlturaElemento(elemento) {
        const clone = elemento.cloneNode(true);
        clone.style.cssText = `
            position: absolute;
            visibility: hidden;
            left: -9999px;
            width: ${elemento.offsetWidth || 600}px;
        `;
        
        document.body.appendChild(clone);
        const altura = clone.offsetHeight || 60;
        clone.remove();
        
        return altura;
    }
    
criarTitulo(tag, texto) {
    const titulo = document.createElement(tag);
    titulo.className = 'editable-text';
    titulo.contentEditable = true;
    titulo.textContent = texto;
    titulo.title = 'Duplo clique para editar';
    titulo.style.position = 'relative'; // ✅ ADICIONAR
    
    // ✅ ADICIONAR BOTÃO DE EXCLUSÃO
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-element-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('🗑️ Excluir este título?')) {
            titulo.style.transition = 'all 0.3s ease';
            titulo.style.opacity = '0';
            titulo.style.transform = 'scale(0.8)';
            setTimeout(() => {
                titulo.remove();
                if (this.salvarDados) this.salvarDados();
                if (this.mostrarToast) this.mostrarToast('🗑️ Título excluído!', 'success');
            }, 300);
        }
    };
    
    titulo.appendChild(deleteBtn);
    return titulo;
}

criarLista(numerada = false) {
    const lista = document.createElement(numerada ? 'ol' : 'ul');
    lista.className = 'editable-list';
    lista.style.position = 'relative'; // ✅ ADICIONAR
    
    // Criar 3 itens padrão
    for (let i = 1; i <= 3; i++) {
        const li = document.createElement('li');
        li.className = 'editable-text';
        li.contentEditable = true;
        li.textContent = `Item ${i}`;
        lista.appendChild(li);
    }
    
    // ✅ ADICIONAR BOTÃO DE EXCLUSÃO
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-element-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('🗑️ Excluir esta lista?')) {
            lista.style.transition = 'all 0.3s ease';
            lista.style.opacity = '0';
            lista.style.transform = 'scale(0.8)';
            setTimeout(() => {
                lista.remove();
                if (this.salvarDados) this.salvarDados();
                if (this.mostrarToast) this.mostrarToast('🗑️ Lista excluída!', 'success');
            }, 300);
        }
    };
    
    lista.appendChild(deleteBtn);
    return lista;
}
// Substitua a função criarParagrafo no sistema:
debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Substitua a função criarParagrafo existente:

criarParagrafo() {
    const container = document.createElement('div');
    container.className = 'smart-paragraph';
    container.dataset.tipo = 'smart-paragraph';
    
    // ✅ IMPORTANTE: position relative para o botão funcionar
    container.style.position = 'relative';
    
    const content = document.createElement('div');
    content.className = 'smart-paragraph-content';
    content.contentEditable = true;
    content.textContent = 'Digite seu texto aqui...';
    
    container.appendChild(content);
    
    // ✅ ADICIONAR BOTÃO DE EXCLUSÃO
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-element-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = 'Excluir parágrafo';
    
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('🗑️ Excluir este parágrafo?')) {
            container.style.transition = 'all 0.3s ease';
            container.style.opacity = '0';
            container.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                container.remove();
                if (this.salvarDados) this.salvarDados();
                if (this.mostrarToast) this.mostrarToast('🗑️ Parágrafo excluído!', 'success');
            }, 300);
        }
    };
    
    container.appendChild(deleteBtn);
    
    // ✅ Listener com debounce para quebra automática
    const debouncedCheck = this.debounce(() => {
        this.verificarQuebraAutomatica(content);
    }, 500);
    
    content.addEventListener('input', debouncedCheck);
    
    // ✅ Verificar ao perder foco
    content.addEventListener('blur', () => {
        setTimeout(() => {
            this.verificarQuebraAutomatica(content);
        }, 100);
    });
    
    return container;
}
// Adicione estas funções no SistemaRelatorios:

verificarQuebraAutomatica(content) {
    const pagina = content.closest('.page-content');
    if (!pagina) return;
    
    // Forçar reflow
    content.offsetHeight;
    
    const paginaRect = pagina.getBoundingClientRect();
    const rodape = pagina.querySelector('.page-footer');
    
    if (!rodape) return;
    
    const rodapeRect = rodape.getBoundingClientRect();
    const limiteSeguro = rodapeRect.top - paginaRect.top - 30; // 30px de margem
    
    // Quebrar por linhas visíveis
    this.quebrarPorLinhas(content, limiteSeguro, paginaRect, pagina);
}

// ✅ NOVA FUNÇÃO: Quebra por Linhas Individuais
quebrarPorLinhas(content, limiteSeguro, paginaRect, pagina) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✂️ INICIANDO QUEBRA POR LINHAS');
    console.log(`📏 Limite seguro: ${limiteSeguro.toFixed(0)}px`);
    
    const texto = content.textContent;
    const palavras = texto.split(/\s+/).filter(p => p.length > 0);
    
    if (palavras.length === 0) return;
    
    // Descobrir quantas palavras cabem
    let palavrasQueCabem = this.calcularPalavrasQueCabem(content, palavras, limiteSeguro, paginaRect);
    
    console.log(`✅ Palavras que cabem: ${palavrasQueCabem} de ${palavras.length}`);
    
    if (palavrasQueCabem === palavras.length) {
        console.log('✅ Todo texto cabe na página atual');
        return; // Todo texto cabe
    }
    
    if (palavrasQueCabem === 0) {
        console.log('⚠️ Nenhuma palavra cabe - movendo parágrafo inteiro');
        this.moverParagrafoCompleto(content);
        return;
    }
    
    // Separar texto
    const textoAtual = palavras.slice(0, palavrasQueCabem).join(' ');
    const textoProximaPagina = palavras.slice(palavrasQueCabem).join(' ');
    
    console.log(`📄 Texto atual: "${textoAtual.substring(0, 50)}..."`);
    console.log(`📄 Próxima página: "${textoProximaPagina.substring(0, 50)}..."`);
    
    // Aplicar quebra
    this.executarQuebra(content, textoAtual, textoProximaPagina, pagina);
}

// ✅ Calcular quantas palavras cabem (algoritmo otimizado)
calcularPalavrasQueCabem(content, palavras, limiteSeguro, paginaRect) {
    const textoOriginal = content.textContent;
    let palavrasQueCabem = 0;
    
    // Algoritmo binário para performance
    let inicio = 0;
    let fim = palavras.length;
    let melhorResultado = 0;
    
    while (inicio <= fim) {
        const meio = Math.floor((inicio + fim) / 2);
        const teste = palavras.slice(0, meio).join(' ');
        
        content.textContent = teste;
        content.offsetHeight; // Forçar reflow
        
        const contentRect = content.getBoundingClientRect();
        const contentBottom = contentRect.bottom - paginaRect.top;
        
        console.log(`🔍 Testando ${meio} palavras: ${contentBottom.toFixed(0)}px`);
        
        if (contentBottom <= limiteSeguro) {
            melhorResultado = meio;
            inicio = meio + 1;
        } else {
            fim = meio - 1;
        }
    }
    
    // Restaurar texto original temporariamente
    content.textContent = textoOriginal;
    
    return melhorResultado;
}

executarQuebra(content, textoAtual, textoProximaPagina, paginaAtual) {
    console.log('✂️ EXECUTANDO QUEBRA...');
    
    // Adicionar classe de animação
    content.classList.add('breaking');
    
    // Atualizar texto atual
    content.textContent = textoAtual;
    
    // Obter ou criar próxima página
    let proximaPagina = this.obterOuCriarProximaPagina(paginaAtual);
    
    const proximoConteudo = proximaPagina.querySelector('.editable-content');
    
    if (!proximoConteudo) {
        console.error('❌ Erro: editable-content não encontrado na próxima página');
        return;
    }
    
    // Criar novo parágrafo com texto restante
    const novoParagrafo = this.criarParagrafoComTexto(textoProximaPagina);
    const novoContent = novoParagrafo.querySelector('.smart-paragraph-content');
    
    // Inserir no INÍCIO da próxima página
    proximoConteudo.insertBefore(novoParagrafo, proximoConteudo.firstChild);
    
    console.log('✅ Quebra concluída com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Remover animação
    setTimeout(() => {
        content.classList.remove('breaking');
    }, 500);
    
    // ✅ MOVER CURSOR PARA O FINAL DO NOVO PARÁGRAFO
    setTimeout(() => {
        this.moverCursorParaFinal(novoContent);
        console.log('🎯 Cursor movido automaticamente para o final');
    }, 600);
    
    // Salvar e notificar
    this.salvarDados();
    this.mostrarToast('✂️ Texto quebrado - cursor no final', 'success');
    
    // Scroll suave para mostrar onde o cursor está
    setTimeout(() => {
        proximaPagina.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Garantir que o elemento fique visível
        novoContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 800);
}

// ==================== CORREÇÃO: MOVER CURSOR PARA O FINAL (ÚLTIMA LETRA) ====================

moverCursorParaFinal(elemento) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 MOVENDO CURSOR PARA O FINAL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
        // ✅ GARANTIR QUE ELEMENTO ESTÁ VISÍVEL E RENDERIZADO
        elemento.offsetHeight;
        
        // ✅ REMOVER QUALQUER SELEÇÃO ANTERIOR
        window.getSelection().removeAllRanges();
        
        // ✅ FOCAR NO ELEMENTO PRIMEIRO
        elemento.focus();
        
        // Aguardar foco ser aplicado
        setTimeout(() => {
            const selection = window.getSelection();
            const range = document.createRange();
            
            // ✅ MÉTODO 1: Usar lastChild ou textNode
            let targetNode = elemento;
            
            // Se tem nós filhos, pegar o último nó de texto
            if (elemento.childNodes.length > 0) {
                // Percorrer até encontrar o último nó de texto
                const walker = document.createTreeWalker(
                    elemento,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let lastTextNode = null;
                while (walker.nextNode()) {
                    lastTextNode = walker.currentNode;
                }
                
                if (lastTextNode) {
                    targetNode = lastTextNode;
                    console.log(`📍 Último nó de texto encontrado: "${lastTextNode.textContent.substring(lastTextNode.textContent.length - 20)}"`);
                }
            }
            
            // ✅ POSICIONAR NO FINAL DO NÓ
            if (targetNode.nodeType === Node.TEXT_NODE) {
                // É um nó de texto - usar length
                range.setStart(targetNode, targetNode.length);
                range.setEnd(targetNode, targetNode.length);
            } else {
                // É um elemento - selecionar conteúdo e colapsar no final
                range.selectNodeContents(targetNode);
                range.collapse(false); // ✅ FALSE = FINAL (não início)
            }
            
            // ✅ APLICAR SELEÇÃO
            selection.removeAllRanges();
            selection.addRange(range);
            
            console.log('✅ CURSOR POSICIONADO NO FINAL');
            console.log(`   Offset: ${range.endOffset}`);
            console.log(`   Texto total: ${elemento.textContent.length} caracteres`);
            
            // ✅ GARANTIR VISIBILIDADE
            elemento.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
            
            // ✅ HIGHLIGHT VISUAL
            elemento.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
            elemento.style.transition = 'background-color 0.8s ease';
            
            setTimeout(() => {
                elemento.style.backgroundColor = '';
            }, 1500);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            
            return true;
            
        }, 50); // Aguardar 50ms após foco
        
    } catch (error) {
        console.error('❌ ERRO AO MOVER CURSOR:', error);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // ✅ FALLBACK 1: Método alternativo com setStart/setEnd
        try {
            console.log('🔄 Tentando fallback 1...');
            
            elemento.focus();
            
            const sel = window.getSelection();
            const range = document.createRange();
            
            // Pegar todo o texto
            const textoCompleto = elemento.textContent;
            const tamanhoTexto = textoCompleto.length;
            
            console.log(`   Tamanho do texto: ${tamanhoTexto}`);
            
            // Se tem texto, posicionar no final
            if (tamanhoTexto > 0 && elemento.firstChild) {
                let ultimoNo = elemento.firstChild;
                
                // Se o primeiro filho é texto
                if (ultimoNo.nodeType === Node.TEXT_NODE) {
                    range.setStart(ultimoNo, ultimoNo.length);
                    range.setEnd(ultimoNo, ultimoNo.length);
                } else {
                    range.selectNodeContents(elemento);
                    range.collapse(false);
                }
                
                sel.removeAllRanges();
                sel.addRange(range);
                
                console.log('✅ Fallback 1 funcionou!');
                return true;
            }
            
        } catch (e) {
            console.warn('⚠️ Fallback 1 falhou:', e);
        }
        
        // ✅ FALLBACK 2: Usar execCommand
        try {
            console.log('🔄 Tentando fallback 2 (execCommand)...');
            
            elemento.focus();
            
            // Selecionar tudo
            document.execCommand('selectAll', false, null);
            
            // Colapsar no final
            const sel = window.getSelection();
            sel.collapseToEnd(); // ✅ COLAPSAR NO FINAL
            
            console.log('✅ Fallback 2 funcionou!');
            return true;
            
        } catch (e) {
            console.warn('⚠️ Fallback 2 falhou:', e);
        }
        
        // ✅ FALLBACK 3: Inserir zero-width space no final
        try {
            console.log('🔄 Tentando fallback 3 (zero-width space)...');
            
            elemento.focus();
            
            // Adicionar caractere invisível no final
            const textoAtual = elemento.textContent;
            elemento.textContent = textoAtual + '\u200B'; // Zero-width space
            
            // Selecionar até o final
            const range = document.createRange();
            const sel = window.getSelection();
            
            range.selectNodeContents(elemento);
            range.collapse(false);
            
            sel.removeAllRanges();
            sel.addRange(range);
            
            console.log('✅ Fallback 3 funcionou!');
            return true;
            
        } catch (e) {
            console.warn('⚠️ Fallback 3 falhou:', e);
        }
        
        // ✅ FALLBACK 4: Apenas focar (último recurso)
        try {
            console.log('🔄 Fallback 4: apenas focando...');
            elemento.focus();
            console.log('⚠️ Apenas focado (sem posicionamento garantido)');
            return false;
        } catch (e) {
            console.error('❌ Impossível focar elemento:', e);
            return false;
        }
    }
}


// ✅ Obter ou Criar Próxima Página
obterOuCriarProximaPagina(paginaAtual) {
    let proximaPagina = paginaAtual.nextElementSibling;
    
    // Procurar próxima página válida
    while (proximaPagina && !proximaPagina.classList.contains('page-content')) {
        proximaPagina = proximaPagina.nextElementSibling;
    }
    
    // Se não existe, criar
    if (!proximaPagina) {
        console.log('📄 Próxima página não existe - criando...');
        proximaPagina = this.criarNovaPaginaAposAtual(paginaAtual);
        console.log('✅ Nova página criada');
    } else {
        console.log('✅ Próxima página já existe');
    }
    
    return proximaPagina;
}

// ✅ Criar Nova Página Após a Atual
criarNovaPaginaAposAtual(paginaReferencia) {
    const todasPaginas = document.querySelectorAll('.page-content');
    const numPaginaAtual = todasPaginas.length;
    
    const novaPage = document.createElement('div');
    novaPage.className = 'page-content editable-page';
    novaPage.style.opacity = '0';
    novaPage.style.transform = 'translateY(20px)';
    
    novaPage.innerHTML = `
        <div class="editable-content"></div>
        <div class="page-footer editable-footer">
            <p class="footer-text editable-text" contenteditable="true">
                <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
            </p>
            <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
        </div>
    `;

    // Inserir após página atual
    paginaReferencia.parentNode.insertBefore(novaPage, paginaReferencia.nextSibling);
    
    // Animação de entrada
    setTimeout(() => {
        novaPage.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        novaPage.style.opacity = '1';
        novaPage.style.transform = 'translateY(0)';
    }, 50);
    
    // Atualizar interface
    setTimeout(() => {
        if (typeof adicionarBotoesDeletarPagina === 'function') {
            adicionarBotoesDeletarPagina();
        }
        if (typeof adicionarBotoesEntrePaginas === 'function') {
            adicionarBotoesEntrePaginas();
        }
        if (typeof renumerarPaginas === 'function') {
            renumerarPaginas();
        }
    }, 100);
    
    return novaPage;
}

// ✅ Criar Parágrafo com Texto Específico
criarParagrafoComTexto(texto) {
    const container = document.createElement('div');
    container.className = 'smart-paragraph';
    container.dataset.tipo = 'smart-paragraph';
    
    const content = document.createElement('div');
    content.className = 'smart-paragraph-content';
    content.contentEditable = true;
    content.textContent = texto;
    
    container.appendChild(content);
    
    // Adicionar listener com debounce
    const debouncedCheck = this.debounce(() => {
        this.verificarQuebraAutomatica(content);
    }, 500);
    
    content.addEventListener('input', debouncedCheck);
    
    return container;
}

// ✅ Mover Parágrafo Completo (quando nenhuma palavra cabe)
moverParagrafoCompleto(content) {
    console.log('📦 Movendo parágrafo completo para próxima página');
    
    const container = content.closest('.smart-paragraph');
    const paginaAtual = container.closest('.page-content');
    
    if (!paginaAtual) {
        console.error('❌ Página atual não encontrada');
        return;
    }
    
    // Obter ou criar próxima página
    const proximaPagina = this.obterOuCriarProximaPagina(paginaAtual);
    const proximoConteudo = proximaPagina.querySelector('.editable-content');
    
    if (!proximoConteudo) {
        console.error('❌ Conteúdo da próxima página não encontrado');
        return;
    }
    
    // Mover container inteiro
    proximoConteudo.insertBefore(container, proximoConteudo.firstChild);
    
    console.log('✅ Parágrafo movido com sucesso');
    
    this.salvarDados();
    this.mostrarToast('📄 Parágrafo movido para próxima página', 'info');
}

// ✅ Debounce para Performance
debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Quebra Inteligente (Como se fosse tabela)
aplicarQuebraInteligente(content, limiteSeguro, paginaRect) {
    console.log('✂️ Aplicando quebra inteligente...');
    
    // Desabilitar temporariamente para evitar loop
    content.removeEventListener('input', this.verificarQuebraAutomatica);
    
    const texto = content.textContent;
    const palavras = texto.split(' ');
    
    // Algoritmo binário para encontrar ponto de corte
    let textoQueCabe = '';
    let palavrasQueCabem = 0;
    
    for (let i = 0; i < palavras.length; i++) {
        const teste = palavras.slice(0, i + 1).join(' ');
        content.textContent = teste;
        
        // Forçar reflow
        content.offsetHeight;
        
        const testeRect = content.getBoundingClientRect();
        const testeBottom = testeRect.bottom - paginaRect.top;
        
        if (testeBottom > limiteSeguro) {
            break;
        }
        
        textoQueCabe = teste;
        palavrasQueCabem = i + 1;
    }
    
    if (palavrasQueCabem === 0) {
        // Nenhuma palavra cabe - mover parágrafo inteiro
        this.moverParagrafoCompleto(content);
        return;
    }
    
    // Separar texto
    const textoAtual = palavras.slice(0, palavrasQueCabem).join(' ');
    const textoProximaPagina = palavras.slice(palavrasQueCabem).join(' ');
    
    if (!textoProximaPagina.trim()) {
        // Tudo coube
        content.textContent = texto;
        
        // Reativar listener
        setTimeout(() => {
            content.addEventListener('input', () => this.verificarQuebraAutomatica(content));
        }, 100);
        return;
    }
    
    // Atualizar texto atual
    content.textContent = textoAtual;
    
    // Criar novo parágrafo na próxima página
    const paginaAtual = content.closest('.page-content');
    let proximaPagina = paginaAtual.nextElementSibling;
    
    while (proximaPagina && !proximaPagina.classList.contains('page-content')) {
        proximaPagina = proximaPagina.nextElementSibling;
    }
    
    if (!proximaPagina) {
        proximaPagina = this.criarNovaPagina(paginaAtual);
    }
    
    const proximoConteudo = proximaPagina.querySelector('.editable-content');
    
    // Criar novo parágrafo com texto restante
    const novoParagrafo = this.criarParagrafo();
    const novoContent = novoParagrafo.querySelector('.smart-paragraph-content');
    novoContent.textContent = textoProximaPagina;
    
    // Inserir no início da próxima página
    proximoConteudo.insertBefore(novoParagrafo, proximoConteudo.firstChild);
    
    this.salvarDados();
    this.mostrarToast(`✂️ Parágrafo quebrado automaticamente`, 'success');
    
    // Reativar listener
    setTimeout(() => {
        content.addEventListener('input', () => this.verificarQuebraAutomatica(content));
    }, 100);
}
iniciarMonitoramentoGlobal() {
    console.log('🔍 Iniciando monitoramento global de parágrafos');
    
    setInterval(() => {
        const paragrafos = document.querySelectorAll('.smart-paragraph-content');
        
        paragrafos.forEach(content => {
            // Verificar se está visível
            if (content.offsetParent !== null) {
                this.verificarQuebraAutomatica(content);
            }
        });
    }, 3000); // Verifica a cada 3 segundos
}
moverParagrafoCompleto(content) {
    const container = content.closest('.smart-paragraph');
    const paginaAtual = container.closest('.page-content');
    
    let proximaPagina = paginaAtual.nextElementSibling;
    
    while (proximaPagina && !proximaPagina.classList.contains('page-content')) {
        proximaPagina = proximaPagina.nextElementSibling;
    }
    
    if (!proximaPagina) {
        proximaPagina = this.criarNovaPagina(paginaAtual);
    }
    
    const proximoConteudo = proximaPagina.querySelector('.editable-content');
    proximoConteudo.insertBefore(container, proximoConteudo.firstChild);
    
    this.salvarDados();
    this.mostrarToast('📄 Parágrafo movido para próxima página', 'info');
}

// Atualizar criarNovaPagina se não existir
criarNovaPagina(paginaReferencia) {
    const numPaginaAtual = document.querySelectorAll('.page-content').length;
    const novaPage = document.createElement('div');
    novaPage.className = 'page-content editable-page';
    novaPage.innerHTML = `
        <div class="editable-content"></div>
        <div class="page-footer editable-footer">
            <p class="footer-text editable-text" contenteditable="true">
                <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
            </p>
            <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
        </div>
    `;

    paginaReferencia.parentNode.insertBefore(novaPage, paginaReferencia.nextSibling);
    
    setTimeout(() => {
        if (typeof adicionarBotoesDeletarPagina === 'function') {
            adicionarBotoesDeletarPagina();
        }
        if (typeof adicionarBotoesEntrePaginas === 'function') {
            adicionarBotoesEntrePaginas();
        }
        if (typeof renumerarPaginas === 'function') {
            renumerarPaginas();
        }
    }, 100);
    
    return novaPage;
}
    
    criarLista(numerada) {
        const lista = document.createElement(numerada ? 'ol' : 'ul');
        lista.className = 'editable-list';
        lista.innerHTML = `
            <li class="editable-text" contenteditable="true">Item 1</li>
            <li class="editable-text" contenteditable="true">Item 2</li>
            <li class="editable-text" contenteditable="true">Item 3</li>
        `;
        return lista;
    }
    
    criarCitacao() {
        const citacao = document.createElement('blockquote');
        citacao.className = 'editable-text';
        citacao.contentEditable = true;
        citacao.style.cssText = `
            border-left: 5px solid var(--novo-nordisk-blue);
            padding-left: 1rem;
            font-style: italic;
            color: #2c3e50;
            margin: 1.5rem 0;
        `;
        citacao.textContent = 'Digite a citação aqui...';
        citacao.title = 'Duplo clique para editar';
        return citacao;
    }

    inserirQuebraPagina() {
        const numPaginaAtual = this.contarPaginas();
        
        const novaPage = document.createElement('div');
        novaPage.className = 'page-content editable-page';
        novaPage.innerHTML = `
            <div class="editable-content">
                <h2 class="editable-text" contenteditable="true" title="Duplo clique para editar">Nova Seção</h2>
                <p class="editable-text" contenteditable="true" title="Duplo clique para editar">Conteúdo da nova página...</p>
            </div>
            <div class="page-footer editable-footer">
                <p class="footer-text editable-text" contenteditable="true">
                    <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                    <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                    <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com e ivqc@novonordisk.com
                </p>
                <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
            </div>
        `;
        
        document.getElementById('previewContainer').appendChild(novaPage);
        
        setTimeout(() => {
            adicionarBotoesEntrePaginas();
            adicionarBotoesDeletarPagina();
            renumerarPaginas();
        }, 100);
        
        this.salvarDados();
        this.mostrarToast('✅ Nova página adicionada!', 'success');
    }
    
    contarPaginas() {
        return document.querySelectorAll('.page-content').length;
    }

    // ==================== DRAG AND DROP ====================
    
    setupDragAndDrop() {
        let draggedElement = null;
        
        document.addEventListener('mousedown', (e) => {
            const element = e.target.closest('.editable-text, .editable-photo');
            if (element && e.target.contentEditable !== 'true') {
                element.draggable = true;
                
                element.addEventListener('dragstart', (e) => {
                    draggedElement = element;
                    element.style.opacity = '0.5';
                    e.dataTransfer.effectAllowed = 'move';
                });
                
                element.addEventListener('dragend', () => {
                    element.style.opacity = '1';
                    element.draggable = false;
                });
            }
        });
    }

    // ==================== ELEMENTOS EDITÁVEIS ====================
    
    setupEditableElements() {
        document.addEventListener('input', (e) => {
            if (e.target.contentEditable === 'true' || e.target.isContentEditable) {
                clearTimeout(this.saveTimeout);
                this.saveTimeout = setTimeout(() => {
                    this.salvarDados();
                }, 2000);
            }
        });
    }
    
    // ==================== ZOOM ====================
    
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
        this.applyZoom();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
        this.applyZoom();
    }
    
    applyZoom() {
        const container = document.getElementById('previewContainer');
        container.style.transform = `scale(${this.zoomLevel})`;
        container.style.transformOrigin = 'top center';
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
    
    // ==================== ATALHOS DE TECLADO ====================
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.salvarDados();
                this.mostrarToast('💾 Dados salvos!', 'success');
            }
            
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.exportarPDF();
            }
        });
    }
    
    // ==================== SALVAR/CARREGAR ====================
    
    salvarDados() {
        const dados = {
            timestamp: Date.now(),
            html: document.getElementById('previewContainer').innerHTML,
            figureCounter: this.figureCounter,
            tableCounter: this.tableCounter
        };
        
        try {
            localStorage.setItem('relatorio-universal-v2', JSON.stringify(dados));
            console.log('✅ Dados salvos:', new Date().toLocaleTimeString());
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            if (error.name === 'QuotaExceededError') {
                this.mostrarToast('⚠️ Muitas imagens! Tente reduzir a qualidade.', 'warning');
            }
        }
    }
    
    carregarDados() {
        try {
            const dados = JSON.parse(localStorage.getItem('relatorio-universal-v2'));
            
            if (dados) {
                if (dados.html) {
                    document.getElementById('previewContainer').innerHTML = dados.html;
                }
                
                if (dados.figureCounter) this.figureCounter = dados.figureCounter;
                if (dados.tableCounter) this.tableCounter = dados.tableCounter;
                
                this.reAplicarListeners();
                
                setTimeout(() => {
                    adicionarBotoesEntrePaginas();
                    adicionarBotoesDeletarPagina();
                    renumerarPaginas();
                }, 300);
                
                console.log('✅ Dados restaurados:', new Date(dados.timestamp).toLocaleString());
                this.mostrarToast('✅ Dados anteriores restaurados!', 'info');
            } else {
                setTimeout(() => {
                    adicionarBotoesEntrePaginas();
                    adicionarBotoesDeletarPagina();
                }, 300);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar:', error);
            setTimeout(() => {
                adicionarBotoesEntrePaginas();
                adicionarBotoesDeletarPagina();
            }, 300);
        }
    }

    reAplicarListeners() {
        document.querySelectorAll('.editable-photo img, .photo-item img').forEach(img => {
            img.onclick = function() { trocarImagem(this); };
        });
    }
    
    setupAutoSave() {
        setInterval(() => {
            this.salvarDados();
            console.log('🔄 Auto-save executado');
        }, 30000);
    }
    
async exportarPDF() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 EXPORTAÇÃO PDF - QUALIDADE MÁXIMA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    this.mostrarToast('📄 Preparando exportação em SUPER qualidade...', 'info');
    
    try {
        const { jsPDF } = window.jspdf;
        
        if (!jsPDF) {
            throw new Error('Biblioteca jsPDF não carregada!');
        }
        
        // ✅ STEP 1: PREPARAR AMBIENTE
        document.body.classList.add('exporting-pdf');
        
        // ✅ STEP 2: ESTILO TEMPORÁRIO (FORÇAR QUALIDADE)
        const style = document.createElement('style');
        style.id = 'export-temp-style';
        style.textContent = `
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            .page-cover, .page-content {
                box-shadow: none !important;
                margin: 0 !important;
                transform: none !important;
                page-break-after: always;
                page-break-inside: avoid;
            }
            .alert, .page-counter-badge, .delete-page-button, 
            .add-page-button, .no-print {
                display: none !important;
            }
            .cover-blue-band, table th {
                background-color: #003087 !important;
            }
        `;
        document.head.appendChild(style);
        
        // ✅ STEP 3: OCULTAR ELEMENTOS DA INTERFACE
        const elementosOcultar = [
            '.word-style-header',
            '.left-sidebar',
            '.right-sidebar',
            '.preview-toolbar',
            '.sidebar-toggle-left',
            '.sidebar-toggle-right',
            '.context-menu',
            '.toast-notification',
            '.multi-selection-toolbar',
            '.selection-mode-indicator'
        ];
        
        const elementosOcultados = [];
        elementosOcultar.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                elementosOcultados.push({ el, display: el.style.display });
                el.style.display = 'none';
            });
        });
        
        // ✅ STEP 4: REMOVER ALERTAS FISICAMENTE
        const alertasRemovidos = [];
        document.querySelectorAll('.alert, .page-counter-badge, .delete-page-button').forEach(alerta => {
            alertasRemovidos.push({
                elemento: alerta,
                parent: alerta.parentNode,
                nextSibling: alerta.nextSibling
            });
            alerta.remove();
        });
        
        // ✅ STEP 5: PREPARAR PÁGINAS
        const pages = document.querySelectorAll('.page-cover, .page-content');
        const estilosOriginais = [];
        
        pages.forEach(page => {
            estilosOriginais.push({
                boxShadow: page.style.boxShadow,
                margin: page.style.margin,
                transform: page.style.transform,
                display: page.style.display
            });
            
            page.style.boxShadow = 'none';
            page.style.margin = '0';
            page.style.transform = 'none';
            page.style.display = 'block';
            page.style.visibility = 'visible';
        });
        
        const totalPaginas = pages.length;
        console.log(`📚 Total de páginas: ${totalPaginas}`);
        
        // ✅ STEP 6: CRIAR PDF COM MÁXIMA QUALIDADE
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: false,
            precision: 16,
            putOnlyUsedFonts: true,
            floatPrecision: 16
        });
        
        // ✅ STEP 7: CAPTURAR CADA PÁGINA EM ALTÍSSIMA QUALIDADE
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            
            console.log(`📸 Capturando página ${i + 1}/${totalPaginas}...`);
            this.mostrarToast(`📄 Exportando ${i + 1}/${totalPaginas} (alta qualidade)...`, 'info');
            
            // ✅ AGUARDAR RENDERIZAÇÃO
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // ✅ FORÇAR VISIBILIDADE
            page.scrollIntoView({ behavior: 'instant', block: 'start' });
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // ✅ CONFIGURAÇÕES MÁXIMAS DE QUALIDADE
            const canvas = await html2canvas(page, {
                scale: 4,              // ✅ 4x = 384 DPI (MÁXIMA QUALIDADE)
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 794,           // A4 @ 96 DPI
                height: 1123,
                windowWidth: 794,
                windowHeight: 1123,
                letterRendering: true,
                imageTimeout: 15000,   // ✅ 15 segundos para carregar imagens
                removeContainer: false,
                foreignObjectRendering: false,
                onclone: (clonedDoc) => {
                    // ✅ FORÇAR ESTILOS NO CLONE
                    const clonedPages = clonedDoc.querySelectorAll('.page-cover, .page-content');
                    clonedPages.forEach(clonedPage => {
                        clonedPage.style.boxShadow = 'none';
                        clonedPage.style.margin = '0';
                        clonedPage.style.transform = 'none';
                        clonedPage.style.display = 'block';
                        clonedPage.style.visibility = 'visible';
                    });
                    
                    // ✅ REMOVER ELEMENTOS INDESEJADOS DO CLONE
                    clonedDoc.querySelectorAll('.alert, .page-counter-badge, .delete-page-button, .add-page-button').forEach(el => {
                        el.remove();
                    });
                    
                    // ✅ FORÇAR CORES NO CLONE
                    const blueElements = clonedDoc.querySelectorAll('.cover-blue-band, table th, .cover-background');
                    blueElements.forEach(el => {
                        el.style.webkitPrintColorAdjust = 'exact';
                        el.style.printColorAdjust = 'exact';
                        el.style.colorAdjust = 'exact';
                        
                        // ✅ Se for fundo da capa, forçar background
                        if (el.classList.contains('cover-background')) {
                            const bgStyle = window.getComputedStyle(el);
                            el.style.background = bgStyle.background;
                            el.style.backgroundImage = bgStyle.backgroundImage;
                        }
                    });
                    
                    // ✅ FORÇAR ELEMENTOS DO CANVAS DA CAPA
                    const canvasElements = clonedDoc.querySelectorAll('.canvas-element');
                    canvasElements.forEach(el => {
                        el.style.display = 'block';
                        el.style.visibility = 'visible';
                        el.style.opacity = '1';
                    });
                }
            });
            
            console.log(`✅ Canvas capturado: ${canvas.width}x${canvas.height}px`);
            
            // ✅ CONVERTER PARA PNG (MELHOR QUALIDADE QUE JPEG)
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            if (i > 0) {
                pdf.addPage('a4', 'portrait');
            }
            
            // ✅ ADICIONAR IMAGEM COM MÉTODO DE ALTA QUALIDADE
            pdf.addImage(
                imgData,
                'PNG',
                0,
                0,
                210,
                297,
                `page-${i}`,
                'SLOW'
            );
            
            console.log(`✅ Página ${i + 1} adicionada ao PDF`);
            
            // ✅ LIMPAR CANVAS DA MEMÓRIA
            canvas.width = 0;
            canvas.height = 0;
            
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // ✅ STEP 8: SALVAR PDF
        const dataAtual = new Date();
        const nomeArquivo = `Relatorio_NovoNordisk_${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}_${dataAtual.getHours()}h${dataAtual.getMinutes()}m.pdf`;
        
        pdf.save(nomeArquivo);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ PDF EXPORTADO EM QUALIDADE MÁXIMA!');
        console.log(`   Arquivo: ${nomeArquivo}`);
        console.log(`   Páginas: ${totalPaginas}`);
        console.log(`   Resolução: 384 DPI (4x scale)`);
        console.log(`   Formato: PNG (máxima qualidade)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        this.mostrarToast('✅ PDF exportado em SUPER QUALIDADE!', 'success');
        
    } catch (error) {
        console.error('❌ ERRO AO EXPORTAR:', error);
        this.mostrarToast('❌ Erro ao gerar PDF!', 'error');
        alert(`❌ Erro ao exportar PDF:\n\n${error.message}\n\nSoluções:\n1. Reduza o número de imagens\n2. Use Ctrl+P para impressão nativa\n3. Tente em outro navegador`);
    } finally {
        // ✅ STEP 9: RESTAURAR TUDO
        
        const tempStyle = document.getElementById('export-temp-style');
        if (tempStyle) tempStyle.remove();
        
        document.body.classList.remove('exporting-pdf');
        
        // Restaurar elementos ocultos
        elementosOcultados.forEach(({ el, display }) => {
            el.style.display = display || '';
        });
        
        // Restaurar estilos das páginas
        const pages = document.querySelectorAll('.page-cover, .page-content');
        pages.forEach((page, i) => {
            if (estilosOriginais[i]) {
                page.style.boxShadow = estilosOriginais[i].boxShadow || '';
                page.style.margin = estilosOriginais[i].margin || '';
                page.style.transform = estilosOriginais[i].transform || '';
                page.style.display = estilosOriginais[i].display || '';
            }
        });
        
        // Restaurar alertas
        alertasRemovidos.forEach(({ elemento, parent, nextSibling }) => {
            if (parent && parent.isConnected) {
                if (nextSibling && nextSibling.parentNode === parent) {
                    parent.insertBefore(elemento, nextSibling);
                } else {
                    parent.appendChild(elemento);
                }
            }
        });
        
        console.log('✅ Interface restaurada completamente');
    }
}
    // ==================== TOAST ====================
    
    mostrarToast(mensagem, tipo = 'info') {
        const oldToast = document.querySelector('.toast-notification');
        if (oldToast) oldToast.remove();
        
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${tipo}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            border-left: 5px solid ${colors[tipo]};
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-weight: 600;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 1.3rem;">${icons[tipo]}</span>
            <span>${mensagem}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}

// ==================== DIVISOR COM CÁLCULO CORRETO DO LIMITE ====================

class DivisorDeElementos {
    constructor() {
        this.MARGEM_SEGURANCA = 30; // Margem generosa
        this.processando = false;
        
        console.log('✅ DivisorDeElementos inicializado');
    }

    // ==================== ✅ VERIFICAR OVERFLOW CORRETAMENTE ====================
    
    verificarOverflow(elemento) {
        const pagina = elemento.closest('.page-content');
        if (!pagina) return { overflow: false };

        const rodape = pagina.querySelector('.page-footer');
        if (!rodape) return { overflow: false };

        // ✅ FORÇAR REFLOW
        elemento.offsetHeight;
        rodape.offsetTop;

        // ✅ OBTER POSIÇÕES ABSOLUTAS
        const paginaRect = pagina.getBoundingClientRect();
        const elementoRect = elemento.getBoundingClientRect();
        const rodapeRect = rodape.getBoundingClientRect();

        // ✅ CALCULAR POSIÇÕES RELATIVAS À PÁGINA
        const elementoTop = elementoRect.top - paginaRect.top;
        const elementoBottom = elementoRect.bottom - paginaRect.top;
        const rodapeTop = rodapeRect.top - paginaRect.top;

        // ✅ LIMITE REAL = Topo do rodapé - margem de segurança
        const limiteReal = rodapeTop - this.MARGEM_SEGURANCA;

        // ✅ VERIFICAR SE ULTRAPASSA
        const ultrapassou = elementoBottom > limiteReal;

        if (ultrapassou) {
            console.log(`⚠️ OVERFLOW:`);
            console.log(`   Elemento bottom: ${elementoBottom.toFixed(0)}px`);
            console.log(`   Rodapé top: ${rodapeTop.toFixed(0)}px`);
            console.log(`   Limite real: ${limiteReal.toFixed(0)}px`);
            console.log(`   Ultrapassa: ${(elementoBottom - limiteReal).toFixed(0)}px`);
        }

        return {
            overflow: ultrapassou,
            elementoTop: elementoTop,
            elementoBottom: elementoBottom,
            rodapeTop: rodapeTop,
            limiteReal: limiteReal,
            espacoDisponivel: limiteReal - elementoTop,
            pagina: pagina,
            paginaRect: paginaRect
        };
    }

    // ==================== DIVISÃO AUTOMÁTICA ====================
    
    async dividirAutomaticamente() {
        if (this.processando) {
            console.log('⏸️ Já processando...');
            return;
        }

        this.processando = true;
        console.log('\n🚀 INICIANDO DIVISÃO AUTOMÁTICA');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const todasPaginas = Array.from(
            document.querySelectorAll('.page-content:not(.page-cover)')
        );

        for (let i = 0; i < todasPaginas.length; i++) {
            const pagina = todasPaginas[i];
            console.log(`\n📄 Processando Página ${i + 1}/${todasPaginas.length}`);
            await this.reprocessarPaginaCompleta(pagina);
        }

        this.excluirPaginasEmBranco();

        setTimeout(() => {
            if (typeof renumerarPaginas === 'function') renumerarPaginas();
            if (typeof adicionarBotoesEntrePaginas === 'function') adicionarBotoesEntrePaginas();
            if (typeof adicionarBotoesDeletarPagina === 'function') adicionarBotoesDeletarPagina();
        }, 300);

        this.processando = false;
        console.log('\n✅ DIVISÃO CONCLUÍDA!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    // ==================== REPROCESSAR PÁGINA ====================
    
async reprocessarPaginaCompleta(pagina) {
    if (!pagina || pagina.classList.contains('page-cover')) return;

    const editableContent = pagina.querySelector('.editable-content');
    if (!editableContent) return;

    let tentativas = 0;
    const maxTentativas = 15; // ✅ AUMENTADO para processar mais iterações

    while (tentativas < maxTentativas) {
        tentativas++;
        
        console.log(`\n🔄 Tentativa ${tentativas}/${maxTentativas}`);

        // ✅ VERIFICAR CONFLITOS COM RODAPÉ PRIMEIRO
        const houveCorrecaoRodape = this.verificarConflitosComRodape(pagina);
        
        if (houveCorrecaoRodape) {
            console.log(`   ✅ Conflito com rodapé corrigido`);
            await new Promise(resolve => setTimeout(resolve, 100));
            continue; // Reiniciar verificação
        }

        // ✅ VERIFICAR OVERFLOW NORMAL
        const elementos = Array.from(editableContent.children).filter(el => {
            return el.tagName && 
                   !el.classList.contains('page-footer') &&
                   !el.classList.contains('delete-page-button') &&
                   !el.classList.contains('page-counter-badge');
        });

        let houveModificacao = false;

        for (const elemento of elementos) {
            elemento.offsetHeight; // Force reflow

            const info = this.verificarOverflow(elemento);

            if (info.overflow) {
                console.log(`   ⚠️ ${elemento.tagName}: overflow detectado`);
                const resultado = await this.processarElementoComOverflow(elemento, info);
                
                if (resultado && resultado.sucesso) {
                    houveModificacao = true;
                    break; // Reiniciar loop
                }
            }
        }

        // Se não houve modificação, página está OK
        if (!houveModificacao) {
            console.log(`   ✅ Página processada (${tentativas} tentativas)`);
            break;
        }

        // Delay entre tentativas
        await new Promise(resolve => setTimeout(resolve, 80));
    }

    if (tentativas >= maxTentativas) {
        console.warn(`   ⚠️ Limite de tentativas atingido`);
    }
}

    // ==================== PROCESSAR ELEMENTO COM OVERFLOW ====================
    // ✅ NOVO MÉTODO: DIVIDIR GRUPO DE FOTOS LINHA POR LINHA
async dividirGrupoDeFotos(groupContainer, info) {
    console.log('📸 Dividindo grupo de fotos...');
    
    const photoGrid = groupContainer.querySelector('.photo-grid');
    if (!photoGrid) {
        console.warn('⚠️ Grid não encontrado, movendo grupo completo');
        return this.moverElementoCompleto(groupContainer, info);
    }
    
    const photoItems = Array.from(photoGrid.querySelectorAll('.photo-item'));
    const totalFotos = photoItems.length;
    
    console.log(`   Total de fotos no grupo: ${totalFotos}`);
    
    if (totalFotos <= 2) {
        // Se tem 2 ou menos fotos, mover o grupo inteiro
        console.log('   → Poucas fotos, movendo grupo completo');
        return this.moverElementoCompleto(groupContainer, info);
    }
    
    // ✅ CALCULAR QUANTAS LINHAS (PARES DE FOTOS) CABEM
    const ALTURA_LINHA_FOTOS = 280; // Altura de 1 linha (2 fotos)
    const espacoDisponivel = info.espacoDisponivel;
    const linhasQueCabem = Math.max(0, Math.floor(espacoDisponivel / ALTURA_LINHA_FOTOS));
    const fotosQueCabem = linhasQueCabem * 2; // 2 fotos por linha
    
    console.log(`   Espaço disponível: ${espacoDisponivel.toFixed(0)}px`);
    console.log(`   Linhas que cabem: ${linhasQueCabem}`);
    console.log(`   Fotos que cabem: ${fotosQueCabem}`);
    
    if (fotosQueCabem === 0 || fotosQueCabem >= totalFotos) {
        // Não cabe nada OU cabe tudo
        if (fotosQueCabem === 0) {
            console.log('   → Não cabe nenhuma linha, movendo grupo completo');
            return this.moverElementoCompleto(groupContainer, info);
        } else {
            console.log('   → Cabem todas as fotos, mantendo grupo na página');
            return { sucesso: false }; // Não precisa dividir
        }
    }
    
    // ✅ DIVIDIR O GRUPO
    console.log(`   ✂️ DIVIDINDO: ${fotosQueCabem} fotos ficam, ${totalFotos - fotosQueCabem} vão para próxima`);
    
    // Fotos que vão para a próxima página
    const fotosParaMover = photoItems.slice(fotosQueCabem);
    
    // ✅ CRIAR NOVO GRUPO PARA A PRÓXIMA PÁGINA
    const novoGrupoContainer = document.createElement('div');
    novoGrupoContainer.className = 'photo-group-container';
    novoGrupoContainer.dataset.groupId = `${Date.now()}-continuacao`;
    
    // Badge
    const badge = document.createElement('div');
    badge.className = 'photo-group-badge';
    badge.innerHTML = `<i class="fas fa-images"></i> ${fotosParaMover.length} fotos (Continuação)`;
    novoGrupoContainer.appendChild(badge);
    
    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-group-button';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = 'Excluir todas as fotos deste grupo';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (typeof excluirGrupoDeFotos === 'function') {
            excluirGrupoDeFotos(novoGrupoContainer, fotosParaMover.length);
        }
    };
    novoGrupoContainer.appendChild(deleteBtn);
    
    // Grid
    const isImpar = fotosParaMover.length % 2 !== 0;
    const novoGrid = document.createElement('div');
    novoGrid.className = `photo-grid editable-grid ${isImpar ? 'photo-grid-impar' : ''}`;
    novoGrid.style.cssText = `
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 20px !important;
        margin: 0 !important;
    `;
    
    // ✅ MOVER FOTOS PARA O NOVO GRID
    fotosParaMover.forEach((foto, index) => {
        const isUltimaImpar = isImpar && (index === fotosParaMover.length - 1);
        
        if (isUltimaImpar) {
            foto.style.gridColumn = '1 / -1';
            foto.classList.add('photo-item-centered');
        } else {
            foto.style.gridColumn = '';
            foto.classList.remove('photo-item-centered');
        }
        
        novoGrid.appendChild(foto);
    });
    
    novoGrupoContainer.appendChild(novoGrid);
    
    // ✅ AJUSTAR GRUPO ORIGINAL (remover fotos que foram movidas)
    // As fotos já foram removidas do DOM ao fazer appendChild no novo grid
    
    // ✅ VERIFICAR SE GRUPO ORIGINAL FICOU COM NÚMERO ÍMPAR
    const fotosRestantes = photoGrid.querySelectorAll('.photo-item').length;
    if (fotosRestantes % 2 !== 0) {
        photoGrid.classList.add('photo-grid-impar');
        const ultimaFoto = photoGrid.querySelector('.photo-item:last-child');
        if (ultimaFoto) {
            ultimaFoto.style.gridColumn = '1 / -1';
            ultimaFoto.classList.add('photo-item-centered');
        }
    } else {
        photoGrid.classList.remove('photo-grid-impar');
    }
    
    // ✅ ATUALIZAR BADGE DO GRUPO ORIGINAL
    const badgeOriginal = groupContainer.querySelector('.photo-group-badge');
    if (badgeOriginal) {
        badgeOriginal.innerHTML = `<i class="fas fa-images"></i> ${fotosRestantes} fotos`;
    }
    
    console.log(`   ✅ Grupo dividido: ${fotosRestantes} fotos ficam, ${fotosParaMover.length} movidas`);
    
    // ✅ INSERIR NOVO GRUPO NA PRÓXIMA PÁGINA
    return this.inserirNaProximaPagina(novoGrupoContainer, info.pagina);
}
// ✅ NOVO MÉTODO: VERIFICAR E CORRIGIR CONFLITOS COM RODAPÉ
verificarConflitosComRodape(pagina) {
    if (!pagina || pagina.classList.contains('page-cover')) return;
    
    const editableContent = pagina.querySelector('.editable-content');
    const rodape = pagina.querySelector('.page-footer');
    
    if (!editableContent || !rodape) return;
    
    // Forçar reflow
    editableContent.offsetHeight;
    rodape.offsetTop;
    
    const paginaRect = pagina.getBoundingClientRect();
    const rodapeRect = rodape.getBoundingClientRect();
    const limiteReal = rodapeRect.top - paginaRect.top - 30; // 30px de margem
    
    // ✅ OBTER TODOS OS ELEMENTOS (incluindo fotos individuais em grids)
    const elementos = Array.from(editableContent.children).filter(el => {
        return el.tagName && 
               !el.classList.contains('page-footer') &&
               !el.classList.contains('delete-page-button') &&
               !el.classList.contains('page-counter-badge');
    });
    
    console.log(`🔍 Verificando ${elementos.length} elementos na página`);
    
    let houveCorrecao = false;
    
    for (const elemento of elementos) {
        // ✅ TRATAMENTO ESPECIAL PARA GRUPOS DE FOTOS
        if (elemento.classList.contains('photo-group-container')) {
            const resultado = this.verificarGrupoDeFotosConflito(elemento, pagina, limiteReal, paginaRect);
            if (resultado) {
                houveCorrecao = true;
                break; // Reiniciar verificação após correção
            }
            continue;
        }
        
        // ✅ VERIFICAR ELEMENTOS NORMAIS
        elemento.offsetHeight; // Force reflow
        const elementoRect = elemento.getBoundingClientRect();
        const elementoBottom = elementoRect.bottom - paginaRect.top;
        
        if (elementoBottom > limiteReal) {
            console.log(`⚠️ Conflito detectado: ${elemento.tagName}`);
            console.log(`   Bottom: ${elementoBottom.toFixed(0)}px > Limite: ${limiteReal.toFixed(0)}px`);
            
            // Mover elemento completo para próxima página
            const proximaPagina = this.obterOuCriarProximaPagina(pagina);
            const proximoConteudo = proximaPagina.querySelector('.editable-content');
            
            if (proximoConteudo) {
                const clone = elemento.cloneNode(true);
                elemento.remove();
                proximoConteudo.insertBefore(clone, proximoConteudo.firstChild);
                
                console.log(`   ✅ Elemento movido para próxima página`);
                houveCorrecao = true;
                break; // Reiniciar verificação
            }
        }
    }
    
    return houveCorrecao;
}

// ✅ MÉTODO AUXILIAR: VERIFICAR CONFLITO EM GRUPO DE FOTOS (LINHA POR LINHA)
verificarGrupoDeFotosConflito(groupContainer, pagina, limiteReal, paginaRect) {
    const photoGrid = groupContainer.querySelector('.photo-grid');
    if (!photoGrid) return false;
    
    const photoItems = Array.from(photoGrid.querySelectorAll('.photo-item'));
    
    console.log(`   📸 Verificando grupo com ${photoItems.length} fotos`);
    
    // ✅ VERIFICAR FOTO POR FOTO
    let primeiraFotoConflito = -1;
    
    for (let i = 0; i < photoItems.length; i++) {
        const foto = photoItems[i];
        foto.offsetHeight; // Force reflow
        
        const fotoRect = foto.getBoundingClientRect();
        const fotoBottom = fotoRect.bottom - paginaRect.top;
        
        if (fotoBottom > limiteReal) {
            primeiraFotoConflito = i;
            console.log(`   ⚠️ Foto ${i + 1} em conflito (bottom: ${fotoBottom.toFixed(0)}px)`);
            break;
        }
    }
    
    if (primeiraFotoConflito === -1) {
        // Nenhuma foto em conflito
        return false;
    }
    
    // ✅ DETERMINAR LINHA DA PRIMEIRA FOTO EM CONFLITO
    // Grid 2x2: linha 0 = fotos 0-1, linha 1 = fotos 2-3, linha 2 = fotos 4-5
    const linhaConflito = Math.floor(primeiraFotoConflito / 2);
    const primeiraFotoDaLinha = linhaConflito * 2;
    
    console.log(`   ✂️ Conflito na linha ${linhaConflito} (fotos a partir de ${primeiraFotoDaLinha})`);
    
    // ✅ FOTOS QUE DEVEM SER MOVIDAS (da linha em conflito em diante)
    const fotosParaMover = photoItems.slice(primeiraFotoDaLinha);
    
    if (fotosParaMover.length === 0) return false;
    
    console.log(`   📦 Movendo ${fotosParaMover.length} fotos para próxima página`);
    
    // ✅ CRIAR NOVO GRUPO PARA PRÓXIMA PÁGINA
    const proximaPagina = this.obterOuCriarProximaPagina(pagina);
    const proximoConteudo = proximaPagina.querySelector('.editable-content');
    
    if (!proximoConteudo) {
        console.error('   ❌ Próximo conteúdo não encontrado');
        return false;
    }
    
    const novoGrupoContainer = document.createElement('div');
    novoGrupoContainer.className = 'photo-group-container';
    novoGrupoContainer.dataset.groupId = `${Date.now()}-overflow`;
    
    // Badge
    const badge = document.createElement('div');
    badge.className = 'photo-group-badge';
    badge.innerHTML = `<i class="fas fa-images"></i> ${fotosParaMover.length} fotos`;
    novoGrupoContainer.appendChild(badge);
    
    // Botão deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-group-button';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (typeof excluirGrupoDeFotos === 'function') {
            excluirGrupoDeFotos(novoGrupoContainer, fotosParaMover.length);
        }
    };
    novoGrupoContainer.appendChild(deleteBtn);
    
    // Grid
    const isImpar = fotosParaMover.length % 2 !== 0;
    const novoGrid = document.createElement('div');
    novoGrid.className = `photo-grid editable-grid ${isImpar ? 'photo-grid-impar' : ''}`;
    novoGrid.style.cssText = `
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 20px !important;
        margin: 0 !important;
    `;
    
    // ✅ MOVER FOTOS
    fotosParaMover.forEach((foto, index) => {
        const isUltimaImpar = isImpar && (index === fotosParaMover.length - 1);
        
        if (isUltimaImpar) {
            foto.style.gridColumn = '1 / -1';
            foto.classList.add('photo-item-centered');
        } else {
            foto.style.gridColumn = '';
            foto.classList.remove('photo-item-centered');
        }
        
        novoGrid.appendChild(foto);
    });
    
    novoGrupoContainer.appendChild(novoGrid);
    proximoConteudo.insertBefore(novoGrupoContainer, proximoConteudo.firstChild);
    
    // ✅ ATUALIZAR GRUPO ORIGINAL
    const fotosRestantes = photoGrid.querySelectorAll('.photo-item').length;
    
    if (fotosRestantes === 0) {
        // Grupo ficou vazio, remover
        groupContainer.remove();
        console.log(`   🗑️ Grupo original removido (vazio)`);
    } else {
        // Atualizar badge e verificar se ficou ímpar
        const badgeOriginal = groupContainer.querySelector('.photo-group-badge');
        if (badgeOriginal) {
            badgeOriginal.innerHTML = `<i class="fas fa-images"></i> ${fotosRestantes} fotos`;
        }
        
        if (fotosRestantes % 2 !== 0) {
            photoGrid.classList.add('photo-grid-impar');
            const ultimaFoto = photoGrid.querySelector('.photo-item:last-child');
            if (ultimaFoto) {
                ultimaFoto.style.gridColumn = '1 / -1';
                ultimaFoto.classList.add('photo-item-centered');
            }
        }
        
        console.log(`   ✅ Grupo original mantido com ${fotosRestantes} fotos`);
    }
    
    return true; // Houve correção
}
    async processarElementoComOverflow(elemento, info) {
        // ✅ VERIFICAR SE É PARÁGRAFO/TEXTO

    // ✅ VERIFICAR SE É UM GRUPO DE FOTOS
    if (elemento.classList.contains('photo-group-container')) {
        console.log('   📸 Detectado grupo de fotos');
        return await this.dividirGrupoDeFotos(elemento, info);
    }
    
    const ehParagrafo = 
        elemento.tagName === 'P' || 
        (elemento.tagName === 'DIV' && elemento.classList.contains('editable-text')) ||
        (elemento.classList.contains('editable-element') && !elemento.querySelector('img, table, ul, ol'));

    if (ehParagrafo) {
        return await this.dividirTextoOtimizado(elemento, info);
    }
        // ✅ LISTAS
        if (elemento.tagName === 'UL' || elemento.tagName === 'OL') {
            return await this.dividirLista(elemento, info);
        }

        // ✅ ELEMENTOS INDIVISÍVEIS
        const tiposIndivisiveis = ['IMG', 'TABLE', 'FIGURE', 'IFRAME', 'VIDEO', 'AUDIO'];
        const classeIndivisivel = [
            'photo-group-container', 'photo-grid', 'photo-item', 'editable-table'
        ];

        const ehIndivisivel = 
            tiposIndivisiveis.includes(elemento.tagName) ||
            classeIndivisivel.some(cls => elemento.classList.contains(cls)) ||
            elemento.querySelector('img, table, .photo-grid');

        if (ehIndivisivel) {
            return this.moverElementoCompleto(elemento, info);
        }

        return await this.dividirTextoOtimizado(elemento, info);
    }

    // ==================== ✅ DIVIDIR TEXTO OTIMIZADO ====================
    
    async dividirTextoOtimizado(elemento, info) {
        console.log(`      🔍 Dividindo texto`);

        const espacoDisponivel = info.espacoDisponivel;

        console.log(`      Espaço disponível: ${espacoDisponivel.toFixed(0)}px`);

        // ✅ SE ESPAÇO MUITO PEQUENO, MOVER TUDO
        if (espacoDisponivel < 50) {
            console.log(`      → Espaço insuficiente, mover completo`);
            return this.moverElementoCompleto(elemento, info);
        }

        // ✅ OBTER TEXTO E HTML
        const htmlOriginal = elemento.innerHTML;
        const textoOriginal = elemento.textContent || '';
        const palavras = textoOriginal.trim().split(/\s+/);

        if (palavras.length <= 2) {
            console.log(`      → Texto muito curto, mover completo`);
            return this.moverElementoCompleto(elemento, info);
        }

        // ✅ CRIAR CLONE PARA MEDIÇÃO
        const temp = elemento.cloneNode(false);
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        temp.style.top = '-9999px';
        temp.style.left = '-9999px';
        temp.style.width = elemento.offsetWidth + 'px';
        
        // ✅ COPIAR ESTILOS COMPUTADOS
        const estilos = window.getComputedStyle(elemento);
        temp.style.fontFamily = estilos.fontFamily;
        temp.style.fontSize = estilos.fontSize;
        temp.style.lineHeight = estilos.lineHeight;
        temp.style.fontWeight = estilos.fontWeight;
        temp.style.letterSpacing = estilos.letterSpacing;
        temp.style.textAlign = estilos.textAlign;
        temp.style.padding = estilos.padding;
        temp.style.margin = '0';

        document.body.appendChild(temp);

        // ✅ BUSCA BINÁRIA PARA ENCONTRAR PONTO DE CORTE
        let palavrasQueCabem = 0;
        let inicio = 0;
        let fim = palavras.length;

        while (inicio <= fim) {
            const meio = Math.floor((inicio + fim) / 2);
            const textoTeste = palavras.slice(0, meio).join(' ');
            
            temp.textContent = textoTeste;
            
            // ✅ FORÇAR RECALCULO
            temp.offsetHeight;
            
            const alturaTeste = temp.offsetHeight;

            // ✅ ADICIONAR MARGEM EXTRA DE SEGURANÇA
            if (alturaTeste <= (espacoDisponivel - 10)) {
                palavrasQueCabem = meio;
                inicio = meio + 1;
            } else {
                fim = meio - 1;
            }
        }

        document.body.removeChild(temp);

        console.log(`      ✅ Cabem ${palavrasQueCabem}/${palavras.length} palavras`);

        // ✅ PROTEÇÕES
        if (palavrasQueCabem === 0) {
            console.log(`      → Nenhuma palavra cabe, mover completo`);
            return this.moverElementoCompleto(elemento, info);
        }

        if (palavrasQueCabem >= palavras.length) {
            console.log(`      → Texto completo cabe (falso positivo)`);
            return { sucesso: false };
        }

        // ✅ DIVIDIR PRESERVANDO HTML (se houver)
        let parte1, parte2;

        if (htmlOriginal.includes('<') && htmlOriginal.includes('>')) {
            // Tem formatação HTML, dividir pelo texto puro
            const textoP1 = palavras.slice(0, palavrasQueCabem).join(' ');
            const textoP2 = palavras.slice(palavrasQueCabem).join(' ');
            
            parte1 = textoP1;
            parte2 = textoP2;
        } else {
            // Texto puro
            parte1 = palavras.slice(0, palavrasQueCabem).join(' ');
            parte2 = palavras.slice(palavrasQueCabem).join(' ');
        }

        console.log(`      ✂️ DIVIDINDO:`);
        console.log(`         Parte 1: "${parte1.substring(0, 50)}..."`);
        console.log(`         Parte 2: "${parte2.substring(0, 50)}..."`);

        // ✅ ATUALIZAR ELEMENTO ATUAL
        if (htmlOriginal.includes('<') && htmlOriginal.includes('>')) {
            elemento.innerHTML = parte1.trim();
        } else {
            elemento.textContent = parte1.trim();
        }

        // ✅ CRIAR ELEMENTO PARA PRÓXIMA PÁGINA
        const elementoNovo = elemento.cloneNode(false);
        if (htmlOriginal.includes('<') && htmlOriginal.includes('>')) {
            elementoNovo.innerHTML = parte2.trim();
        } else {
            elementoNovo.textContent = parte2.trim();
        }

        return this.inserirNaProximaPagina(elementoNovo, info.pagina);
    }

    // ==================== DIVIDIR LISTA ====================
    
    async dividirLista(elemento, info) {
        const itens = Array.from(elemento.children);
        
        if (itens.length <= 1) {
            return this.moverElementoCompleto(elemento, info);
        }
        
        const paginaRect = info.paginaRect;
        const limiteReal = info.limiteReal;
        
        let itensQueCabem = 0;
        
        for (let i = 0; i < itens.length; i++) {
            const itemRect = itens[i].getBoundingClientRect();
            const itemBottomRelativo = itemRect.bottom - paginaRect.top;
            
            if (itemBottomRelativo > limiteReal) {
                break;
            }
            
            itensQueCabem++;
        }
        
        if (itensQueCabem === 0) {
            return this.moverElementoCompleto(elemento, info);
        }
        
        if (itensQueCabem >= itens.length) {
            return { sucesso: false };
        }
        
        const listaNova = elemento.cloneNode(false);
        
        const itensParaMover = itens.slice(itensQueCabem);
        itensParaMover.forEach(item => {
            listaNova.appendChild(item.cloneNode(true));
            item.remove();
        });
        
        return this.inserirNaProximaPagina(listaNova, info.pagina);
    }

    // ==================== MOVER ELEMENTO COMPLETO ====================
    
    moverElementoCompleto(elemento, info) {
        console.log(`      → Movendo elemento completo`);
        
        const proximaPagina = this.obterOuCriarProximaPagina(info.pagina);
        const proximoConteudo = proximaPagina.querySelector('.editable-content');
        
        if (!proximoConteudo) {
            console.error('❌ Próximo conteúdo não encontrado');
            return { sucesso: false };
        }
        
        const clone = elemento.cloneNode(true);
        elemento.remove();
        
        proximoConteudo.insertBefore(clone, proximoConteudo.firstChild);
        
        return { sucesso: true, movido: true };
    }

    // ==================== INSERIR NA PRÓXIMA PÁGINA ====================
    
    inserirNaProximaPagina(elementoNovo, paginaAtual) {
        const proximaPagina = this.obterOuCriarProximaPagina(paginaAtual);
        const proximoConteudo = proximaPagina.querySelector('.editable-content');
        
        if (!proximoConteudo) {
            console.error('❌ Próximo conteúdo não encontrado');
            return { sucesso: false };
        }
        
        proximoConteudo.insertBefore(elementoNovo, proximoConteudo.firstChild);
        
        return { sucesso: true };
    }

    // ==================== OBTER OU CRIAR PRÓXIMA PÁGINA ====================
    
    obterOuCriarProximaPagina(paginaAtual) {
        const todasPaginas = Array.from(
            document.querySelectorAll('.page-content:not(.page-cover)')
        );
        
        const indiceAtual = todasPaginas.indexOf(paginaAtual);
        
        if (indiceAtual !== -1 && indiceAtual + 1 < todasPaginas.length) {
            return todasPaginas[indiceAtual + 1];
        }
        
        return this.criarNovaPagina(paginaAtual);
    }

    // ==================== CRIAR NOVA PÁGINA ====================
    
// ==================== CRIAR NOVA PÁGINA ====================
criarNovaPagina(paginaReferencia) {
    const numPaginaAtual = document.querySelectorAll('.page-content').length;
    const novaPage = document.createElement('div');
    novaPage.className = 'page-content editable-page';
    novaPage.innerHTML = `
        <div class="editable-content"></div>
        <div class="page-footer editable-footer">
            <p class="footer-text editable-text" contenteditable="true">
                <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
            </p>
            <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
        </div>
    `;

    paginaReferencia.parentNode.insertBefore(novaPage, paginaReferencia.nextSibling);
    
    console.log(`   📄 Nova página ${numPaginaAtual + 1} criada`);
    
    // ✅ ADICIONAR BOTÕES IMEDIATAMENTE APÓS CRIAR
    setTimeout(() => {
        // Adicionar botão de deletar
        if (typeof adicionarBotoesDeletarPagina === 'function') {
            adicionarBotoesDeletarPagina();
            console.log('   ✅ Botão de exclusão adicionado');
        }
        
        // Adicionar botões entre páginas
        if (typeof adicionarBotoesEntrePaginas === 'function') {
            adicionarBotoesEntrePaginas();
        }
        
        // Renumerar páginas
        if (typeof renumerarPaginas === 'function') {
            renumerarPaginas();
        }
    }, 100);
    
    return novaPage;
}

    // ==================== EXCLUIR PÁGINAS EM BRANCO ====================
    
    excluirPaginasEmBranco() {
        const todasPaginas = Array.from(
            document.querySelectorAll('.page-content:not(.page-cover):not(#pageSumario)')
        );
        
        let paginasExcluidas = 0;
        
        todasPaginas.forEach((pagina) => {
            const editableContent = pagina.querySelector('.editable-content');
            
            if (!editableContent) return;
            
            const temConteudoReal = Array.from(editableContent.children).some(el => {
                if (el.classList.contains('page-footer')) return false;
                
                const texto = (el.textContent || '').trim();
                const temImagem = el.querySelector('img') !== null;
                const temTabela = el.querySelector('table') !== null;
                
                return texto.length > 5 || temImagem || temTabela;
            });
            
            if (!temConteudoReal) {
                pagina.remove();
                paginasExcluidas++;
            }
        });
        
        if (paginasExcluidas > 0) {
            console.log(`   ✅ ${paginasExcluidas} página(s) vazia(s) excluída(s)`);
        }
    }
}

// ==================== INSTANCIAR ====================

// ==================== MONITORAMENTO AUTOMÁTICO DE CONFLITOS ====================

// ✅ FUNÇÃO: VERIFICAR TODAS AS PÁGINAS PERIODICAMENTE
function verificarTodasPaginasConflitos() {
    if (!divisorDeElementos || divisorDeElementos.processando) return;
    
    const todasPaginas = Array.from(
        document.querySelectorAll('.page-content:not(.page-cover)')
    );
    
    todasPaginas.forEach(pagina => {
        if (divisorDeElementos.verificarConflitosComRodape) {
            divisorDeElementos.verificarConflitosComRodape(pagina);
        }
    });
}

// ✅ EXECUTAR VERIFICAÇÃO A CADA 3 SEGUNDOS (quando usuário está editando)
let verificacaoInterval = null;

document.addEventListener('input', (e) => {
    if (e.target.contentEditable === 'true' || e.target.isContentEditable) {
        // Limpar timeout anterior
        clearTimeout(verificacaoInterval);
        
        // Agendar verificação
        verificacaoInterval = setTimeout(() => {
            console.log('🔍 Verificação automática de conflitos...');
            verificarTodasPaginasConflitos();
        }, 2000); // 2 segundos após parar de digitar
    }
});

// ✅ VERIFICAR APÓS INSERIR ELEMENTOS
const observador = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
            // Verificar se foi adicionado um grupo de fotos ou elemento grande
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList) {
                    if (node.classList.contains('photo-group-container') || 
                        node.classList.contains('editable-table') ||
                        node.tagName === 'TABLE') {
                        
                        setTimeout(() => {
                            console.log('🔍 Elemento grande inserido, verificando conflitos...');
                            verificarTodasPaginasConflitos();
                        }, 500);
                    }
                }
            });
        }
    });
});

// Observar mudanças no preview container
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            observador.observe(previewContainer, {
                childList: true,
                subtree: true
            });
            console.log('✅ Monitoramento automático de conflitos ativado');
        }
    }, 2000);
});

console.log('✅ Sistema de verificação automática de conflitos carregado');
// ==================== MONITORAR EDIÇÕES ====================

document.addEventListener('input', (e) => {
    if (e.target.contentEditable === 'true' && divisorDeElementos && !divisorDeElementos.processando) {
        clearTimeout(window.divisaoTimeout);
        window.divisaoTimeout = setTimeout(() => {
            const pagina = e.target.closest('.page-content');
            if (pagina && !pagina.classList.contains('page-cover')) {
                divisorDeElementos.reprocessarPaginaCompleta(pagina);
            }
        }, 2000); // 2 segundos de delay
    }
});

console.log('✅ Sistema de Divisão carregado!');


// ==================== INSTANCIAR SISTEMA ====================



window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        divisorDeElementos = new DivisorDeElementos();
        console.log('✅ Divisor de Elementos pronto!');
    }, 1000);
});
window.addEventListener('DOMContentLoaded', () => {
    sistema = new SistemaRelatorios();
    divisorDeElementos = new DivisorDeElementos();
    
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    const dataRapidaInput = document.getElementById('dataRapida');
    if (dataRapidaInput) {
        dataRapidaInput.value = mesAtual;
    }
    
    console.log('🚀 Sistema Carregado - Inserção Exata + Divisão Automática!');
});

// ==================== MONITORAR EDIÇÕES ====================

document.addEventListener('input', (e) => {
    if (e.target.contentEditable === 'true' && divisorDeElementos && !divisorDeElementos.processando) {
        clearTimeout(window.divisaoTimeout);
        window.divisaoTimeout = setTimeout(() => {
            const elemento = e.target.closest('p, h2, h3, h4, ul, ol, table, blockquote');
            if (elemento) {
                const pagina = elemento.closest('.page-content');
                if (pagina) {
                    divisorDeElementos.reprocessarPaginaCompleta(pagina);
                }
            }
        }, 1500);
    }
});

// ==================== FUNÇÕES GLOBAIS ====================

function inserirElemento(tipo) {
    sistema.inserirElemento(tipo);
}


function confirmarImagem() {
    sistema.confirmarImagem();
}

function zoomIn() {
    sistema.zoomIn();
}

function zoomOut() {
    sistema.zoomOut();
}

function exportarPDF() {
    sistema.exportarPDF();
}

function novoRelatorio() {
    if (confirm('⚠️ Criar novo relatório?\n\nTodos os dados serão perdidos!\n\nDeseja continuar?')) {
        localStorage.removeItem('relatorio-universal-v2');
        location.reload();
    }
}

function salvarRascunho() {
    sistema.salvarDados();
    sistema.mostrarToast('💾 Rascunho salvo com sucesso!', 'success');
}


function trocarImagem(imgElement) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imgElement.src = event.target.result;
                sistema.salvarDados();
                sistema.mostrarToast('✅ Imagem atualizada e salva!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function atualizarLogo() {
    const fileInput = document.getElementById('logoEmpresa');
    if (fileInput.files.length === 0) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const coverLogo = document.getElementById('coverLogo');
        coverLogo.innerHTML = `<img src="${e.target.result}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">`;
        sistema.salvarDados();
        sistema.mostrarToast('✅ Logo atualizado e salvo!', 'success');
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function atualizarCapa() {
    if (sistema) {
        sistema.salvarDados();
    }
}

function atualizarRodape() {
    if (sistema) {
        sistema.salvarDados();
    }
}

function atualizarDataRapida() {
    const dataRapida = document.getElementById('dataRapida').value;
    if (dataRapida) {
        const [ano, mes] = dataRapida.split('-');
        const mesNome = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        });
        const mesCapitalizado = mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
        
        const locationElement = document.getElementById('coverLocation');
        if (locationElement) {
            const cidadeAtual = locationElement.textContent.split(',')[0] || 'Montes Claros';
            locationElement.textContent = `${cidadeAtual}, ${mesCapitalizado}`;
        }
        
        sistema.salvarDados();
        sistema.mostrarToast('📅 Data atualizada!', 'success');
    }
}

function excluirElementoContexto() {
    const elementoParaExcluir = sistema.clickPosition.elementoParaExcluir;
    
    if (!elementoParaExcluir) {
        sistema.mostrarToast('⚠️ Nenhum elemento selecionado!', 'warning');
        return;
    }
    
    const tipoElemento = sistema.getNomeElemento(elementoParaExcluir);
    const textoPreview = elementoParaExcluir.textContent.substring(0, 50).trim();
    
    const confirmacao = confirm(
        `🗑️ CONFIRMAR EXCLUSÃO\n\n` +
        `Tipo: ${tipoElemento}\n` +
        `Conteúdo: "${textoPreview}..."\n\n` +
        `Deseja realmente excluir este elemento?`
    );
    
    if (confirmacao) {
        elementoParaExcluir.style.transition = 'all 0.4s ease-out';
        elementoParaExcluir.style.opacity = '0';
        elementoParaExcluir.style.transform = 'scale(0.8) translateX(-50px)';
        
        setTimeout(() => {
            elementoParaExcluir.remove();
            sistema.salvarDados();
            sistema.hideContextMenu();
            sistema.removerSelecaoExclusao();
            sistema.mostrarToast(`🗑️ ${tipoElemento} excluído!`, 'success');
        }, 400);
    } else {
        sistema.removerSelecaoExclusao();
        sistema.hideContextMenu();
    }
}

window.addEventListener('beforeunload', () => {
    if (sistema) {
        sistema.salvarDados();
    }
});

// ==================== BOTÕES + ENTRE PÁGINAS ====================

function adicionarBotoesEntrePaginas() {
    const container = document.getElementById('previewContainer');
    const pages = container.querySelectorAll('.page-content, .page-cover');
    
    container.querySelectorAll('.add-page-button').forEach(btn => btn.remove());
    
    pages.forEach((page, index) => {
        if (index === pages.length - 1) {
            const btnFinal = criarBotaoAdicionarPagina(index + 1);
            container.appendChild(btnFinal);
        } else {
            const btn = criarBotaoAdicionarPagina(index + 1);
            page.parentNode.insertBefore(btn, page.nextSibling);
        }
    });
}

function adicionarBotoesDeletarPagina() {
    const pages = document.querySelectorAll('.page-content');
    
    document.querySelectorAll('.delete-page-button').forEach(btn => btn.remove());
    document.querySelectorAll('.page-counter-badge').forEach(badge => badge.remove());
    
    pages.forEach((page, index) => {
        if (page.id === 'pageSumario') {
            const badge = criarBadgeContador(index + 2);
            page.appendChild(badge);
            return;
        }
        
        const btnDelete = criarBotaoDeletarPagina(page, index);
        page.appendChild(btnDelete);
        
        const badge = criarBadgeContador(index + 2);
        page.appendChild(badge);
    });
}

function criarBotaoDeletarPagina(page, index) {
    const btn = document.createElement('button');
    btn.className = 'delete-page-button';
    btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    btn.title = 'Excluir esta página';
    btn.onclick = (e) => {
        e.stopPropagation();
        confirmarExclusaoPagina(page, index);
    };
    return btn;
}

function criarBadgeContador(numeroPagina) {
    const badge = document.createElement('div');
    badge.className = 'page-counter-badge';
    badge.innerHTML = `📄 Página ${numeroPagina}`;
    return badge;
}

function confirmarExclusaoPagina(page, index) {
    const totalPaginas = document.querySelectorAll('.page-content').length;
    const primeiroTitulo = page.querySelector('h2, h3')?.textContent || 'Sem título';
    const numeroPagina = index + 2;
    
    const confirmacao = confirm(
        `🗑️ CONFIRMAR EXCLUSÃO DE PÁGINA\n\n` +
        `Página: ${numeroPagina} de ${totalPaginas + 1}\n` +
        `Conteúdo: "${primeiroTitulo}"\n\n` +
        `⚠️ Esta ação NÃO pode ser desfeita!\n\n` +
        `Deseja realmente excluir esta página?`
    );
    
    if (confirmacao) {
        page.classList.add('deleting-page');
        
        setTimeout(() => {
            page.remove();
            renumerarPaginas();
            adicionarBotoesEntrePaginas();
            adicionarBotoesDeletarPagina();
            sistema.salvarDados();
            sistema.mostrarToast('🗑️ Página excluída com sucesso!', 'success');
        }, 600);
    }
}

function criarBotaoAdicionarPagina(posicao) {
    const btnContainer = document.createElement('div');
    btnContainer.className = 'add-page-button';
    btnContainer.dataset.posicao = posicao;
    
    const btn = document.createElement('button');
    btn.className = 'add-page-btn';
    btn.innerHTML = '+';
    btn.onclick = () => adicionarPaginaNaPosicao(posicao);
    
    btnContainer.appendChild(btn);
    return btnContainer;
}

function adicionarPaginaNaPosicao(posicao) {
    const container = document.getElementById('previewContainer');
    const pages = container.querySelectorAll('.page-content, .page-cover');
    const numPaginaAtual = pages.length;
    
    const novaPage = document.createElement('div');
    novaPage.className = 'page-content editable-page';
    novaPage.innerHTML = `
        <div class="editable-content">
            <h2 class="editable-text" contenteditable="true" title="Duplo clique para editar">Nova Seção</h2>
            <p class="editable-text" contenteditable="true" title="Duplo clique para editar">Clique com botão direito para inserir elementos...</p>
        </div>
        <div class="page-footer editable-footer">
            <p class="footer-text editable-text" contenteditable="true">
                <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com e ivqc@novonordisk.com
            </p>
            <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
        </div>
    `;
    
    if (posicao >= pages.length) {
        container.appendChild(novaPage);
    } else {
        const paginaReferencia = pages[posicao];
        if (paginaReferencia) {
            paginaReferencia.parentNode.insertBefore(novaPage, paginaReferencia.nextSibling);
        } else {
            container.appendChild(novaPage);
        }
    }
    
    novaPage.style.opacity = '0';
    novaPage.style.transform = 'translateY(30px) scale(0.95)';
    
    setTimeout(() => {
        novaPage.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        novaPage.style.opacity = '1';
        novaPage.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    setTimeout(() => {
        adicionarBotoesEntrePaginas();
        adicionarBotoesDeletarPagina();
        renumerarPaginas();
        sistema.salvarDados();
    }, 500);
    
    setTimeout(() => {
        novaPage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 600);
    
    sistema.mostrarToast('✅ Nova página adicionada!', 'success');
}

function renumerarPaginas() {
    const pages = document.querySelectorAll('.page-content .page-number');
    pages.forEach((span, index) => {
        span.textContent = index + 2;
    });
}

// ==================== UPLOAD MÚLTIPLO ====================

let fotosMultiplas = [];

function mostrarModalUploadMultiplo() {
    console.log('📸 Abrindo modal de upload múltiplo...');
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalUploadMultiploOverlay';
    
    overlay.innerHTML = `
        <div class="modal-container" style="max-width: 800px;">
            <div class="modal-header" style="background: linear-gradient(135deg, var(--accent-green), #059669);">
                <h3>
                    <i class="fas fa-images"></i>
                    Upload Múltiplo de Fotos
                </h3>
                <button class="modal-close" onclick="fecharModalUploadMultiplo()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>Como funciona:</strong> Selecione várias imagens. Grid 2x2 automático. Máximo 8 fotos.
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Prefixo da Legenda</label>
                    <input type="text" class="form-input" id="prefixoLegenda" value="Figura" placeholder="Ex: Umectação de vias">
                </div>
                
                <div class="form-group">
                    <label>Selecione as Imagens (máx. 8)</label>
                    <input type="file" class="form-input" id="uploadMultiplo" accept="image/*" multiple>
                </div>
                
                <div id="previewMultiplas" style="display: none; margin-top: 1rem;">
                    <strong style="color: var(--text-light); display: block; margin-bottom: 1rem;">Preview:</strong>
                    <div id="gridPreview" class="grid-preview-mini"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModalUploadMultiplo()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn btn-success" onclick="confirmarUploadMultiplo()">
                    <i class="fas fa-check"></i>
                    Inserir Fotos
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // ✅ AGUARDAR MODAL SER RENDERIZADO
    setTimeout(() => {
        const uploadInput = document.getElementById('uploadMultiplo');
        
        if (uploadInput) {
            console.log('✅ Input de upload encontrado');
            
            // ✅ ADICIONAR EVENT LISTENER CORRETO
            uploadInput.addEventListener('change', previewFotosMultiplas);
            
            // Focar no input
            uploadInput.focus();
        } else {
            console.error('❌ Input #uploadMultiplo não encontrado após renderização!');
        }
    }, 100);
    
    // Fechar com ESC
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModalUploadMultiplo();
    });
}

// ==================== PREVIEW DE FOTOS MÚLTIPLAS - CORRIGIDO ====================
function previewFotosMultiplas(e) {
    console.log('🔍 Preview de fotos múltiplas iniciado');
    
    const files = e.target.files;
    
    if (!files || files.length === 0) {
        console.log('ℹ️ Nenhum arquivo selecionado');
        document.getElementById('previewMultiplas').style.display = 'none';
        return;
    }
    
    console.log(`📸 ${files.length} arquivo(s) selecionado(s)`);
    
    if (files.length > 8) {
        alert('⚠️ Máximo de 8 fotos por vez!');
        e.target.value = '';
        document.getElementById('previewMultiplas').style.display = 'none';
        return;
    }
    
    const gridPreview = document.getElementById('gridPreview');
    gridPreview.innerHTML = '';
    
    let loadedCount = 0;
    
    Array.from(files).forEach((file, index) => {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            console.warn(`⚠️ Arquivo ${file.name} não é uma imagem válida`);
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const miniItem = document.createElement('div');
            miniItem.className = 'preview-mini-item';
            miniItem.innerHTML = `
                <img src="${event.target.result}" alt="Foto ${index + 1}">
                <span class="badge">${index + 1}</span>
            `;
            gridPreview.appendChild(miniItem);
            
            loadedCount++;
            
            if (loadedCount === files.length) {
                document.getElementById('previewMultiplas').style.display = 'block';
                console.log(`✅ Preview de ${loadedCount} foto(s) carregado`);
            }
        };
        
        reader.onerror = (error) => {
            console.error(`❌ Erro ao carregar ${file.name}:`, error);
            loadedCount++;
            
            if (loadedCount === files.length) {
                document.getElementById('previewMultiplas').style.display = 'block';
            }
        };
        
        reader.readAsDataURL(file);
    });
}

// ==================== GARANTIR clickPosition EXISTE ====================
function garantirClickPosition() {
    if (!sistema || !sistema.clickPosition) {
        console.warn('⚠️ clickPosition não existe, criando automaticamente...');
        
        // Buscar última página de conteúdo
        const todasPaginas = document.querySelectorAll('.page-content:not(.page-cover)');
        const ultimaPagina = todasPaginas[todasPaginas.length - 1];
        
        if (!ultimaPagina) {
            console.error('❌ Nenhuma página encontrada!');
            return false;
        }
        
        const editableContent = ultimaPagina.querySelector('.editable-content');
        
        if (!editableContent) {
            console.error('❌ .editable-content não encontrado!');
            return false;
        }
        
        // Criar clickPosition padrão (final da última página)
        sistema.clickPosition = {
            x: 0,
            y: 0,
            element: editableContent,
            paginaClicada: ultimaPagina,
            inserirAntes: false,
            elementoParaExcluir: null
        };
        
        console.log('✅ clickPosition criado automaticamente:', sistema.clickPosition);
        return true;
    }
    
    return true; // Já existe
}
function confirmarUploadMultiplo() {
    console.log('📸 CONFIRMAR UPLOAD MÚLTIPLO INICIADO');
    if (window.divisorDeElementos) {
        divisorDeElementos.processando = true;
        console.log('⏸️ Divisão automática pausada');
    }
        // ✅ GARANTIR clickPosition EXISTE (CORREÇÃO PRINCIPAL)
    if (!garantirClickPosition()) {
        alert('❌ Erro: Sistema não está pronto.\n\nClique com botão direito em uma página primeiro.');
        return;
    }
    
    // BUSCA MAIS ROBUSTA DO INPUT
    const modalOverlay = document.getElementById('modalUploadMultiploOverlay');
    let uploadInput = null;
    
    if (modalOverlay) {
        uploadInput = modalOverlay.querySelector('#uploadMultiplo');
    }
    
    if (!uploadInput) {
        uploadInput = document.getElementById('uploadMultiplo');
    }
    
    if (!uploadInput) {
        console.error('❌ Input não encontrado');
        alert('❌ Erro: Campo de upload não encontrado. Recarregue a página (F5).');
        return;
    }
    
    console.log('✅ Input encontrado:', uploadInput);
    
    // VALIDAÇÃO DOS ARQUIVOS
    const files = uploadInput.files;
    
    if (!files) {
        console.error('❌ Objeto files é null');
        alert('❌ Erro ao acessar arquivos. Tente novamente.');
        return;
    }
    
    const numArquivos = files.length;
    console.log(`📊 Arquivos detectados: ${numArquivos}`);
    
    // VALIDAÇÃO CORRETA
    if (numArquivos === 0) {
        alert('⚠️ Selecione ao menos uma foto!');
        return;
    }
    
    if (numArquivos > 8) {
        alert(`⚠️ Máximo de 8 fotos por vez!\n\nVocê selecionou: ${numArquivos}`);
        return; // NÃO limpar o input aqui
    }
    
    // Restante do código...
    const prefixo = document.getElementById('prefixoLegenda')?.value.trim() || 'Figura';
    
    const imagensProcessadas = [];
    let contadorProcessadas = 0;
    
    for (let i = 0; i < numArquivos; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagensProcessadas.push({
                src: e.target.result,
                nome: file.name,
                index: i
            });
            
            contadorProcessadas++;
            
            if (contadorProcessadas === numArquivos) {
                inserirGrupoDeFotos(imagensProcessadas, prefixo);
            }
        };
        
        reader.onerror = () => {
            contadorProcessadas++;
            if (contadorProcessadas === numArquivos && imagensProcessadas.length > 0) {
                inserirGrupoDeFotos(imagensProcessadas, prefixo);
            }
        };
        
        reader.readAsDataURL(file);
    }
}
async function inserirGrupoDeFotos(imagens, prefixo) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📸 INSERÇÃO INTELIGENTE LINHA A LINHA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Total de imagens:', imagens.length);
    console.log('🏷️ Prefixo:', prefixo);
    
    if (!imagens || imagens.length === 0) {
        console.error('❌ Array de imagens vazio!');
        alert('❌ Erro: Nenhuma imagem para inserir!');
        return;
    }
    
    // ✅ VALIDAR SISTEMA
    if (!window.sistema) {
        try {
            window.sistema = new SistemaRelatorios();
        } catch (error) {
            console.error('❌ Falha ao criar sistema:', error);
            alert('❌ Erro crítico: Recarregue a página (F5)');
            return;
        }
    }
    
    // ✅ PAUSAR DIVISÃO AUTOMÁTICA
    if (window.divisorDeElementos) {
        divisorDeElementos.processando = true;
        console.log('⏸️ Divisão automática pausada');
    }
    
    // ✅ CONSTANTES
    const ALTURA_LINHA_FOTOS = 280; // Altura aproximada de 1 linha (2 fotos) em pixels
    const MARGEM_SEGURANCA = 50;    // Margem extra de segurança
    
    // ✅ OBTER PÁGINA ATUAL
    let paginaAtual = sistema.clickPosition?.paginaClicada;
    if (!paginaAtual) {
        paginaAtual = document.querySelector('.page-content:not(.page-cover):last-of-type');
    }
    
    if (!paginaAtual) {
        console.error('❌ Nenhuma página encontrada!');
        alert('❌ Erro: Página não encontrada!');
        return;
    }
    
    console.log('📄 Página atual encontrada');
    
    // ✅ FUNÇÃO: CALCULAR ESPAÇO DISPONÍVEL NA PÁGINA
    function calcularEspacoDisponivel(pagina) {
        const editableContent = pagina.querySelector('.editable-content');
        const rodape = pagina.querySelector('.page-footer');
        
        if (!editableContent || !rodape) {
            console.warn('⚠️ Elementos não encontrados, assumindo página vazia');
            return 800; // Altura padrão para página vazia
        }
        
        // Forçar reflow
        editableContent.offsetHeight;
        rodape.offsetTop;
        
        const paginaRect = pagina.getBoundingClientRect();
        const rodapeRect = rodape.getBoundingClientRect();
        
        // Calcular posição do último elemento
        const ultimoElemento = editableContent.lastElementChild;
        let bottomConteudo;
        
        if (ultimoElemento) {
            const ultimoRect = ultimoElemento.getBoundingClientRect();
            bottomConteudo = ultimoRect.bottom - paginaRect.top;
        } else {
            const contentRect = editableContent.getBoundingClientRect();
            bottomConteudo = contentRect.top - paginaRect.top + 50; // Padding inicial
        }
        
        const topRodape = rodapeRect.top - paginaRect.top;
        const espacoDisponivel = topRodape - bottomConteudo - MARGEM_SEGURANCA;
        
        console.log(`📏 Espaço disponível: ${espacoDisponivel.toFixed(0)}px`);
        console.log(`   Bottom conteúdo: ${bottomConteudo.toFixed(0)}px`);
        console.log(`   Top rodapé: ${topRodape.toFixed(0)}px`);
        
        return Math.max(0, espacoDisponivel);
    }
    
    // ✅ FUNÇÃO: CRIAR NOVA PÁGINA
    function criarNovaPagina() {
        const numPaginaAtual = document.querySelectorAll('.page-content').length;
        
        const novaPage = document.createElement('div');
        novaPage.className = 'page-content editable-page';
        novaPage.innerHTML = `
            <div class="editable-content"></div>
            <div class="page-footer editable-footer">
                <p class="footer-text editable-text" contenteditable="true">
                    <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                    <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                    <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
                </p>
                <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
            </div>
        `;
        
        document.getElementById('previewContainer').appendChild(novaPage);
        console.log(`📄 Nova página ${numPaginaAtual + 1} criada`);
        
        return novaPage;
    }
    
    // ✅ FUNÇÃO: CRIAR GRUPO DE FOTOS
    function criarGrupoFotos(imagensGrupo, figuraInicial, grupoNum, totalGrupos) {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'photo-group-container';
        groupContainer.dataset.groupId = `${Date.now()}-${grupoNum}`;
        
        // Badge
        const badge = document.createElement('div');
        badge.className = 'photo-group-badge';
        if (totalGrupos > 1) {
            badge.innerHTML = `<i class="fas fa-images"></i> ${imagensGrupo.length} fotos (Parte ${grupoNum}/${totalGrupos})`;
        } else {
            badge.innerHTML = `<i class="fas fa-images"></i> ${imagensGrupo.length} ${imagensGrupo.length > 1 ? 'fotos' : 'foto'}`;
        }
        groupContainer.appendChild(badge);
        
        // Botão deletar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-group-button';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Excluir todas as fotos deste grupo';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            excluirGrupoDeFotos(groupContainer, imagensGrupo.length);
        };
        groupContainer.appendChild(deleteBtn);
        
        // Grid
        const isImpar = imagensGrupo.length % 2 !== 0;
        const gridContainer = document.createElement('div');
        gridContainer.className = `photo-grid editable-grid ${isImpar ? 'photo-grid-impar' : ''}`;
        gridContainer.style.cssText = `
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            margin: 0 !important;
        `;
        
        // Adicionar fotos
        imagensGrupo.forEach((foto, index) => {
            const figuraNum = figuraInicial + index;
            const isUltimaImpar = isImpar && (index === imagensGrupo.length - 1);
            
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item editable-photo';
            photoItem.style.margin = '0';
            photoItem.style.padding = '0';
            
            if (isUltimaImpar) {
                photoItem.style.gridColumn = '1 / -1';
                photoItem.classList.add('photo-item-centered');
            }
            
            const img = document.createElement('img');
            img.src = foto.src;
            img.alt = `${prefixo} ${figuraNum}`;
            img.onclick = function() { 
                if (typeof trocarImagem === 'function') {
                    trocarImagem(this);
                }
            };
            img.title = 'Clique para trocar imagem';
            
            const caption = document.createElement('div');
            caption.className = 'photo-caption editable-text';
            caption.contentEditable = true;
            caption.textContent = `Figura ${figuraNum} - ${prefixo}`;
            
            photoItem.appendChild(img);
            photoItem.appendChild(caption);
            gridContainer.appendChild(photoItem);
        });
        
        groupContainer.appendChild(gridContainer);
        return groupContainer;
    }
    
    // ✅ LÓGICA PRINCIPAL: INSERÇÃO LINHA A LINHA
    let figuraAtual = sistema?.figureCounter || 1;
    let imagensRestantes = [...imagens];
    let grupoNum = 1;
    let totalGruposEstimado = Math.ceil(imagens.length / 6); // Estimativa inicial
    
while (imagensRestantes.length > 0) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 ITERAÇÃO ${grupoNum}: ${imagensRestantes.length} fotos restantes`);
    
    // ✅ VERIFICAR SE PÁGINA ESTÁ VAZIA
    const editableContent = paginaAtual.querySelector('.editable-content');
    const temConteudo = editableContent && Array.from(editableContent.children).some(el => {
        if (el.classList.contains('page-footer')) return false;
        const texto = (el.textContent || '').trim();
        const temImagem = el.querySelector('img') !== null;
        const temTabela = el.querySelector('table') !== null;
        return texto.length > 10 || temImagem || temTabela;
    });
    
    let imagensParaInserir;
    
    if (!temConteudo) {
        // ✅ PÁGINA VAZIA: SEMPRE INSERIR ATÉ 6 FOTOS
        imagensParaInserir = imagensRestantes.splice(0, Math.min(6, imagensRestantes.length));
        console.log(`📄 PÁGINA VAZIA DETECTADA`);
        console.log(`   ✅ Inserindo ${imagensParaInserir.length} fotos (máx: 6)`);
        
    } else {
        // ✅ PÁGINA COM CONTEÚDO: CALCULAR ESPAÇO
        const espacoDisponivel = calcularEspacoDisponivel(paginaAtual);
        const linhasQueCabem = Math.floor(espacoDisponivel / ALTURA_LINHA_FOTOS);
        const fotosQueCabem = Math.max(0, Math.min(linhasQueCabem * 2, 6)); // Máximo 6
        
        console.log(`📐 Análise da página com conteúdo:`);
        console.log(`   Espaço: ${espacoDisponivel.toFixed(0)}px`);
        console.log(`   Linhas que cabem: ${linhasQueCabem}`);
        console.log(`   Fotos que cabem: ${fotosQueCabem}`);
        
        if (fotosQueCabem >= 2) {
            // Cabe pelo menos 1 linha (2 fotos)
            imagensParaInserir = imagensRestantes.splice(0, fotosQueCabem);
            console.log(`   ✅ Inserindo ${imagensParaInserir.length} fotos na página atual`);
        } else {
            // Não cabe nada, criar nova página
            console.log(`   ⚠️ Espaço insuficiente, criando nova página...`);
            paginaAtual = criarNovaPagina();
            
            // Nova página sempre aceita até 6 fotos
            imagensParaInserir = imagensRestantes.splice(0, Math.min(6, imagensRestantes.length));
            console.log(`   ✅ Nova página criada, inserindo ${imagensParaInserir.length} fotos`);
        }
    }
    
    // ✅ VALIDAÇÃO DE SEGURANÇA
    if (!imagensParaInserir || imagensParaInserir.length === 0) {
        console.error('❌ Nenhuma imagem para inserir nesta iteração!');
        break;
    }
    
    // Criar e inserir grupo
    const grupo = criarGrupoFotos(
        imagensParaInserir, 
        figuraAtual, 
        grupoNum, 
        totalGruposEstimado
    );
    
    const editableContentFinal = paginaAtual.querySelector('.editable-content');
    if (editableContentFinal) {
        editableContentFinal.appendChild(grupo);
        console.log(`   ✅ Grupo ${grupoNum} com ${imagensParaInserir.length} fotos inserido`);
    } else {
        console.error('❌ Erro: editable-content não encontrado!');
        break;
    }
    
    // Atualizar contadores
    figuraAtual += imagensParaInserir.length;
    grupoNum++;
    
    // Se ainda restam imagens, criar nova página para próxima iteração
    if (imagensRestantes.length > 0) {
        console.log(`   📄 Restam ${imagensRestantes.length} fotos, criando nova página...`);
        paginaAtual = criarNovaPagina();
    }
    
    // ✅ AGUARDAR RENDERIZAÇÃO
    await new Promise(resolve => setTimeout(resolve, 150));
    
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}
    // ✅ ATUALIZAR CONTADOR GLOBAL
    if (sistema && sistema.figureCounter !== undefined) {
        sistema.figureCounter = figuraAtual;
        console.log('📊 Contador de figuras atualizado para:', sistema.figureCounter);
    }
    
    // ✅ ATUALIZAR INTERFACE
    setTimeout(() => {
        if (typeof adicionarBotoesEntrePaginas === 'function') {
            adicionarBotoesEntrePaginas();
        }
        if (typeof adicionarBotoesDeletarPagina === 'function') {
            adicionarBotoesDeletarPagina();
        }
        if (typeof renumerarPaginas === 'function') {
            renumerarPaginas();
        }
    }, 500);
    
    // Fechar modal
    fecharModalUploadMultiplo();
    
    // Salvar
    if (sistema && sistema.salvarDados) {
        sistema.salvarDados();
    }
    
    // Notificar
    if (sistema && sistema.mostrarToast) {
        sistema.mostrarToast(`✅ ${imagens.length} foto(s) inserida(s) inteligentemente!`, 'success');
    }
    
    // ✅ REATIVAR DIVISÃO
    setTimeout(() => {
        if (window.divisorDeElementos) {
            divisorDeElementos.processando = false;
            console.log('▶️ Divisão automática reativada');
        }
    }, 300);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ INSERÇÃO INTELIGENTE CONCLUÍDA');
    console.log(`   Total: ${imagens.length} fotos`);
    console.log(`   Grupos criados: ${grupoNum - 1}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
function excluirGrupoDeFotos(groupContainer, numFotos) {
    const primeiraLegenda = groupContainer.querySelector('.photo-caption')?.textContent || 'Grupo de fotos';
    
    const confirmacao = confirm(
        `🗑️ CONFIRMAR EXCLUSÃO DE GRUPO\n\n` +
        `📸 Total de fotos: ${numFotos}\n` +
        `🏷️ ${primeiraLegenda}\n\n` +
        `⚠️ Esta ação NÃO pode ser desfeita!\n\n` +
        `Deseja realmente excluir TODAS as fotos deste grupo?`
    );
    
    if (confirmacao) {
        groupContainer.classList.add('deleting-group');
        
        setTimeout(() => {
            groupContainer.remove();
            sistema.salvarDados();
            sistema.mostrarToast(`🗑️ ${numFotos} fotos excluídas com sucesso!`, 'success');
        }, 600);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('uploadMultiplo');
    if (uploadInput) {
        uploadInput.addEventListener('change', previewFotosMultiplas);
    }
});

console.log('✅ Sistema COMPLETO Carregado!');
console.log('📊 Total de linhas: ~1600');
console.log('🎯 Funcionalidades:');
console.log('  ✅ Inserção EXATA onde usuário clicou');
console.log('  ✅ Indicador visual verde de inserção');
console.log('  ✅ Divisão automática de elementos (texto, listas, tabelas)');
console.log('  ✅ Reprocessamento recursivo de overflow');
console.log('  ✅ Upload múltiplo de fotos');
console.log('  ✅ Edição 100% (capa, sumário, rodapés)');
console.log('  ✅ Auto-save e persistência completa');

// ==================== SISTEMA DE JUNTAR PDFs - VERSÃO CORRIGIDA ====================

class JuntadorPDF {
    constructor() {
        this.pdfsCarregados = [];
        this.pdfLib = null;
        this.carregarPDFLib();
    }

    async carregarPDFLib() {
        if (typeof pdfjsLib === 'undefined') {
            console.log('📚 Carregando PDF.js...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                console.log('✅ PDF.js carregado!');
                this.pdfLib = pdfjsLib;
            };
            document.head.appendChild(script);
        } else {
            this.pdfLib = pdfjsLib;
            console.log('✅ PDF.js já estava carregado');
        }
    }

async processarPDFs(files) {
    console.log('📋 processarPDFs chamado com', files.length, 'arquivo(s)');
    
    this.pdfsCarregados = [];
    const pdfList = document.getElementById('pdfList');
    
    if (pdfList) {
        pdfList.innerHTML = '';
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        console.log(`📄 Processando arquivo ${i + 1}/${files.length}:`, file.name);

        const pdfURL = await this.lerArquivoComoURL(file);
        const numPaginas = await this.contarPaginasURL(pdfURL);

        const pdfInfo = {
            nome: file.name,
            tamanho: this.formatarTamanho(file.size),
            numPaginas: numPaginas,
            url: pdfURL,
            file: file
        };

        this.pdfsCarregados.push(pdfInfo);

        if (pdfList) {
            const item = document.createElement('div');
            item.className = 'pdf-item';
            item.innerHTML = `
                <div class="pdf-item-info">
                    <div class="pdf-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="pdf-details">
                        <div class="pdf-name">${pdfInfo.nome}</div>
                        <div class="pdf-size">${pdfInfo.tamanho}</div>
                    </div>
                </div>
                <span class="pdf-pages">${numPaginas} página${numPaginas > 1 ? 's' : ''}</span>
            `;
            pdfList.appendChild(item);
        }
    }

    const pdfPreviewArea = document.getElementById('pdfPreviewArea');
    if (pdfPreviewArea) {
        pdfPreviewArea.style.display = 'block';
    }

    console.log(`✅ ${this.pdfsCarregados.length} PDF(s) carregado(s) com sucesso`);
}

    // ✅ LER ARQUIVO COMO URL (CORRIGIDO)
    lerArquivoComoURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file); // ✅ Data URL ao invés de ArrayBuffer
        });
    }

    // ✅ CONTAR PÁGINAS USANDO URL
    async contarPaginasURL(pdfURL) {
        try {
            const loadingTask = this.pdfLib.getDocument(pdfURL);
            const pdf = await loadingTask.promise;
            return pdf.numPages;
        } catch (error) {
            console.error('❌ Erro ao contar páginas:', error);
            return 0;
        }
    }

async juntarPDFsAoRelatorio() {
    console.log('📄 juntarPDFsAoRelatorio chamado');
    console.log('📋 PDFs carregados:', this.pdfsCarregados.length);
    
    if (this.pdfsCarregados.length === 0) {
        alert('⚠️ Nenhum PDF foi carregado!\n\nClique em "Escolher Arquivos" primeiro.');
        return;
    }

    const btnJuntar = document.getElementById('btnJuntarPDF');
    if (btnJuntar) {
        btnJuntar.disabled = true;
        btnJuntar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';
    }

    const progressoDiv = document.getElementById('progressoPDF');
    const barra = document.getElementById('barraProgresso');
    
    if (progressoDiv) {
        progressoDiv.style.display = 'block';
    }

    let totalPaginas = 0;
    this.pdfsCarregados.forEach(pdf => totalPaginas += pdf.numPaginas);

    console.log(`📄 Processando ${totalPaginas} páginas de ${this.pdfsCarregados.length} PDF(s)`);

    let paginasProcessadas = 0;

    for (let pdfInfo of this.pdfsCarregados) {
        try {
            const loadingTask = this.pdfLib.getDocument(pdfInfo.url);
            const pdf = await loadingTask.promise;

            console.log(`📄 Processando: ${pdfInfo.nome} (${pdf.numPages} páginas)`);

            for (let numPagina = 1; numPagina <= pdf.numPages; numPagina++) {
                try {
                    const imagemBase64 = await this.converterPaginaParaImagem(pdf, numPagina);
                    this.adicionarPaginaPDF(imagemBase64, pdfInfo.nome, numPagina);

                    paginasProcessadas++;
                    const progresso = Math.round((paginasProcessadas / totalPaginas) * 100);
                    
                    if (barra) {
                        barra.style.width = progresso + '%';
                        barra.textContent = progresso + '%';
                    }

                    console.log(`✅ Página ${numPagina}/${pdf.numPages} processada`);

                    await new Promise(resolve => setTimeout(resolve, 150));
                } catch (error) {
                    console.error(`❌ Erro na página ${numPagina}:`, error);
                }
            }
        } catch (error) {
            console.error(`❌ Erro ao processar PDF ${pdfInfo.nome}:`, error);
            alert(`⚠️ Erro ao processar ${pdfInfo.nome}. Tentando próximo...`);
        }
    }

    if (progressoDiv) {
        progressoDiv.style.display = 'none';
    }
    
    if (btnJuntar) {
        btnJuntar.disabled = false;
        btnJuntar.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Juntar PDF(s) ao Final';
    }

    setTimeout(() => {
        if (typeof adicionarBotoesEntrePaginas === 'function') adicionarBotoesEntrePaginas();
        if (typeof adicionarBotoesDeletarPagina === 'function') adicionarBotoesDeletarPagina();
        if (typeof renumerarPaginas === 'function') renumerarPaginas();
    }, 500);

    if (sistema) {
        sistema.salvarDados();
    }

    if (sistema) {
        sistema.mostrarToast(`✅ ${paginasProcessadas} página(s) de PDF adicionadas!`, 'success');
    }

    setTimeout(() => {
        const ultimaPagina = document.querySelector('.page-content:last-of-type');
        if (ultimaPagina) {
            ultimaPagina.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 1000);

    console.log('✅ Processamento de PDFs concluído');
}
    // ✅ CONVERTER PÁGINA EM IMAGEM (CORRIGIDO)
    async converterPaginaParaImagem(pdf, numPagina) {
        try {
            const page = await pdf.getPage(numPagina);
            
            // Escala 2x para alta qualidade
            const scale = 2;
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // ✅ Converter para Base64 com qualidade otimizada
            const imagemBase64 = canvas.toDataURL('image/jpeg', 0.92);
            
            // Limpar canvas
            canvas.width = 0;
            canvas.height = 0;
            
            return imagemBase64;
            
        } catch (error) {
            console.error(`❌ Erro ao converter página ${numPagina}:`, error);
            throw error;
        }
    }

adicionarPaginaPDF(imagemBase64, nomePDF, numPagina) {
    const totalPaginas = document.querySelectorAll('.page-content').length;
    
    const novaPage = document.createElement('div');
    novaPage.className = 'page-content editable-page page-pdf-converted';
    novaPage.dataset.pdfOrigem = nomePDF;
    novaPage.dataset.pdfPagina = numPagina;
    
    // ✅ SEM RODAPÉ - Página do PDF ocupa altura total
    novaPage.innerHTML = `
        <div class="editable-content pdf-content-full" style="padding: 0; margin: 0; min-height: 297mm; height: 297mm; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <img src="${imagemBase64}" 
                 alt="PDF: ${nomePDF} - Página ${numPagina}" 
                 class="pdf-page-image"
                 style="max-width: 100%; max-height: 100%; width: auto; height: auto; display: block; margin: 0; object-fit: contain;">
        </div>
    `;
    
    // ✅ NOTA: Sem <div class="page-footer"> aqui!

    document.getElementById('previewContainer').appendChild(novaPage);
    
    console.log(`✅ Página PDF adicionada SEM rodapé`);
}

    formatarTamanho(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

let juntadorPDF;

// ✅ INICIALIZAR IMEDIATAMENTE (NÃO ESPERAR DOMContentLoaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        juntadorPDF = new JuntadorPDF();
        console.log('✅ Sistema de Juntar PDFs ativado!');
    });
} else {
    juntadorPDF = new JuntadorPDF();
    console.log('✅ Sistema de Juntar PDFs ativado (imediato)!');
}

// ==================== FUNÇÕES GLOBAIS PARA PDF ====================

function mostrarModalJuntarPDF() {
    console.log('📄 Abrindo modal de PDF...');
    
    // ✅ REMOVER MODAL ANTERIOR SE EXISTIR
    const modalAntigo = document.getElementById('modalJuntarPDFOverlay');
    if (modalAntigo) {
        modalAntigo.remove();
    }
    
    // ✅ CRIAR MODAL
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'modalJuntarPDFOverlay';
    
    modalOverlay.innerHTML = `
        <div class="modal-container" style="max-width: 700px;">
            <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <h3>
                    <i class="fas fa-file-pdf"></i>
                    Juntar PDFs ao Relatório
                </h3>
                <button class="modal-close" onclick="fecharModalJuntarPDF()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>Como funciona:</strong>
                        Selecione um ou mais arquivos PDF. Cada página será convertida em imagem e adicionada ao final do relatório.
                    </div>
                </div>
                
                <div class="form-group">
                    <label>
                        <i class="fas fa-upload"></i>
                        Selecione os PDFs
                    </label>
                    <input 
                        type="file" 
                        class="form-input" 
                        id="pdfInput" 
                        accept=".pdf,application/pdf" 
                        multiple
                    >
                </div>
                
                <!-- Preview dos PDFs -->
                <div id="pdfPreviewArea" style="display: none; margin-top: 1.5rem;">
                    <strong style="display: block; margin-bottom: 1rem; color: var(--text-light);">
                        <i class="fas fa-eye"></i> PDFs Selecionados:
                    </strong>
                    <div id="pdfList" class="pdf-list"></div>
                </div>
                
                <!-- Barra de progresso -->
                <div id="progressoPDF" style="display: none; margin-top: 1.5rem;">
                    <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-light);">
                        Processando...
                    </strong>
                    <div style="background: #e5e7eb; border-radius: 8px; height: 30px; overflow: hidden;">
                        <div 
                            id="barraProgresso" 
                            style="
                                height: 100%; 
                                background: linear-gradient(90deg, #10b981, #059669); 
                                width: 0%; 
                                transition: width 0.3s ease;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: 600;
                                font-size: 0.9rem;
                            "
                        >
                            0%
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModalJuntarPDF()">
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button class="btn btn-success" id="btnJuntarPDF" onclick="confirmarJuntarPDF()">
                    <i class="fas fa-plus-circle"></i>
                    Juntar PDF(s) ao Final
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // ✅ ANIMAÇÃO
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
    }, 10);
    
    // ✅ CONFIGURAR INPUT IMEDIATAMENTE
    setTimeout(() => {
        const pdfInput = document.getElementById('pdfInput');
        
        if (!pdfInput) {
            console.error('❌ Input não encontrado!');
            return;
        }
        
        console.log('✅ Input encontrado, adicionando event listener');
        
        // ✅ LISTENER PARA DETECTAR SELEÇÃO DE ARQUIVO
        pdfInput.addEventListener('change', async function(e) {
            console.log('📋 Evento change disparado');
            console.log('📋 Arquivos no input:', e.target.files.length);
            
            const files = Array.from(e.target.files);
            
            if (files.length === 0) {
                console.warn('⚠️ Nenhum arquivo selecionado');
                return;
            }
            
            console.log('📄 Arquivos para processar:', files.map(f => f.name));
            
            // ✅ VERIFICAR SE JUNTADOR EXISTE
            if (!juntadorPDF) {
                console.error('❌ juntadorPDF não existe!');
                alert('❌ Erro: Sistema de PDF não carregado. Recarregue a página (F5).');
                return;
            }
            
            try {
                console.log('✅ Chamando processarPDFs...');
                await juntadorPDF.processarPDFs(files);
                console.log('✅ processarPDFs concluído');
                console.log('📋 PDFs carregados agora:', juntadorPDF.pdfsCarregados.length);
            } catch (error) {
                console.error('❌ Erro ao processar PDFs:', error);
                alert('❌ Erro ao ler PDF:\n\n' + error.message);
            }
        });
        
        console.log('✅ Event listener adicionado ao input');
        
    }, 200); // ✅ AGUARDAR 200ms para garantir que DOM está pronto
    
    // Fechar com ESC
    modalOverlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModalJuntarPDF();
    });
    
    // Fechar clicando fora
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            fecharModalJuntarPDF();
        }
    });
}
function fecharModalJuntarPDF() {
    const modal = document.getElementById('modalJuntarPDFOverlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            console.log('✅ Modal de PDF fechado');
        }, 300);
    }
}
async function confirmarJuntarPDF() {
    console.log('🔍 Tentando juntar PDFs...');
    
    // ✅ VERIFICAR SE JUNTADOR EXISTE
    if (!juntadorPDF) {
        console.error('❌ juntadorPDF não existe');
        alert('❌ Erro: Sistema de PDF não carregado. Recarregue a página (F5).');
        return;
    }
    
    console.log('📋 PDFs carregados no juntador:', juntadorPDF.pdfsCarregados.length);
    
    // ✅ VERIFICAR SE ARQUIVOS FORAM PROCESSADOS
    if (juntadorPDF.pdfsCarregados.length === 0) {
        alert('⚠️ Nenhum PDF foi carregado!\n\nClique em "Escolher Arquivos" primeiro.');
        return;
    }

    try {
        console.log('✅ Iniciando juntarPDFsAoRelatorio...');
        await juntadorPDF.juntarPDFsAoRelatorio();
        
        // ✅ FECHAR MODAL
        fecharModalJuntarPDF();
        
    } catch (error) {
        console.error('❌ Erro ao juntar PDFs:', error);
        alert('❌ Erro ao processar PDF:\n\n' + error.message + '\n\nVerifique o console.');
    }
}

// ✅ Listener para preview de PDFs
window.addEventListener('DOMContentLoaded', () => {
    const pdfInput = document.getElementById('pdfInput');
    if (pdfInput) {
        pdfInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                try {
                    await juntadorPDF.processarPDFs(files);
                } catch (error) {
                    console.error('❌ Erro ao processar PDFs:', error);
                    alert('❌ Erro ao ler PDF. Tente outro arquivo.');
                }
            }
        });
    }
});


// ==================== FERRAMENTAS DO RIBBON ====================

// ✅ TROCAR ABAS
function trocarAba(abaId) {
    // Desativar todas as abas
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.ribbon-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativar aba clicada
    document.querySelector(`.tab-item[data-tab="${abaId}"]`).classList.add('active');
    document.getElementById(`ribbon-${abaId}`).classList.add('active');
}

// ✅ INSERIR ELEMENTO RÁPIDO (sem menu contextual)
function inserirElementoRapido(tipo) {
    // Usar última posição conhecida ou final do documento
    if (!sistema.clickPosition.paginaClicada) {
        const ultimaPagina = document.querySelector('.page-content:last-of-type');
        const ultimoConteudo = ultimaPagina?.querySelector('.editable-content');
        
        if (ultimoConteudo) {
            sistema.clickPosition = {
                element: ultimoConteudo,
                paginaClicada: ultimaPagina,
                inserirAntes: false
            };
        }
    }
    
    sistema.inserirElemento(tipo);
}

// ✅ FORMATAÇÃO DE TEXTO
function aplicarNegrito() {
    document.execCommand('bold');
}

function aplicarItalico() {
    document.execCommand('italic');
}

function aplicarSublinhado() {
    document.execCommand('underline');
}

function aplicarEstilo(tipo) {
    switch(tipo) {
        case 'negrito':
            document.execCommand('bold');
            break;
        case 'italico':
            document.execCommand('italic');
            break;
        case 'sublinhado':
            document.execCommand('underline');
            break;
        case 'tachado':
            document.execCommand('strikeThrough');
            break;
        case 'sobrescrito':
            document.execCommand('superscript');
            break;
        case 'subscrito':
            document.execCommand('subscript');
            break;
    }
}

function aplicarFonte() {
    const fonte = document.getElementById('fontFamily').value;
    document.execCommand('fontName', false, fonte);
}

function aplicarTamanhoFonte() {
    const tamanho = document.getElementById('fontSize').value;
    document.execCommand('fontSize', false, tamanho);
}

function aplicarCorTexto() {
    const cor = document.getElementById('textColor')?.value || document.getElementById('textColorFormat')?.value;
    document.execCommand('foreColor', false, cor);
}

function aplicarCorFundo() {
    const cor = document.getElementById('bgColor').value;
    document.execCommand('backColor', false, cor);
}

function limparFormatacao() {
    document.execCommand('removeFormat');
    sistema.mostrarToast('✅ Formatação removida!', 'success');
}

// ✅ ALINHAMENTO
function alinharEsquerda() {
    document.execCommand('justifyLeft');
}

function alinharCentro() {
    document.execCommand('justifyCenter');
}

function alinharDireita() {
    document.execCommand('justifyRight');
}

function justificar() {
    document.execCommand('justifyFull');
}

function aumentarRecuo() {
    document.execCommand('indent');
}

function diminuirRecuo() {
    document.execCommand('outdent');
}

// ✅ COPIAR/COLAR/RECORTAR
function copiar() {
    document.execCommand('copy');
    sistema.mostrarToast('📋 Copiado!', 'success');
}

function colar() {
    document.execCommand('paste');
}

function recortar() {
    document.execCommand('cut');
    sistema.mostrarToast('✂️ Recortado!', 'success');
}

// ✅ DESFAZER/REFAZER
let historicoAcoes = [];
let indiceHistorico = -1;

function desfazer() {
    document.execCommand('undo');
    sistema.mostrarToast('↩️ Desfeito!', 'info');
}

function refazer() {
    document.execCommand('redo');
    sistema.mostrarToast('↪️ Refeito!', 'info');
}

// ✅ MARGENS
function ajustarMargem(tipo) {
    const pages = document.querySelectorAll('.page-content');
    
    const margens = {
        'normal': '30mm',
        'estreita': '15mm',
        'larga': '40mm'
    };
    
    pages.forEach(page => {
        page.style.padding = margens[tipo];
    });
    
    sistema.salvarDados();
    sistema.mostrarToast(`✅ Margem ${tipo} aplicada!`, 'success');
}

// ✅ ORIENTAÇÃO
function orientacaoRetrato() {
    const pages = document.querySelectorAll('.page-content, .page-cover');
    pages.forEach(page => {
        page.style.width = '210mm';
        page.style.height = '297mm';
    });
    sistema.mostrarToast('✅ Orientação retrato aplicada!', 'success');
}

function orientacaoPaisagem() {
    const pages = document.querySelectorAll('.page-content, .page-cover');
    pages.forEach(page => {
        page.style.width = '297mm';
        page.style.height = '210mm';
    });
    sistema.mostrarToast('✅ Orientação paisagem aplicada!', 'success');
}

// ✅ EDITAR CAPA
function editarCapa() {
    const capa = document.getElementById('pageCover');
    if (capa) {
        capa.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sistema.mostrarToast('📄 Role para editar a capa!', 'info');
    }
}
function mostrarModalTabela() {
    console.log('📋 Abrindo modal de tabela (versão customizada)...');
    
    // ✅ REMOVER MODAL ANTERIOR
    const modalAntigo = document.getElementById('modalTabelaOverlay');
    if (modalAntigo) {
        modalAntigo.remove();
        console.log('🗑️ Modal antigo removido');
    }
    
    // ✅ PAUSAR SISTEMAS
    if (window.monitorQuebraAutomatica) {
        window.monitorQuebraAutomatica.processando = true;
    }
    if (window.gerenciadorColagem) {
        window.gerenciadorColagem.processando = true;
    }
    
    // ✅ CRIAR OVERLAY
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalTabelaOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // ✅ CRIAR MODAL
    overlay.innerHTML = `
        <div class="modal-container" style="
            background: var(--dark-bg, #1F2937);
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        ">
            <div class="modal-header" style="
                background: linear-gradient(135deg, #3B82F6, #6366F1);
                padding: 1.5rem;
                border-radius: 16px 16px 0 0;
            ">
                <h3 style="margin: 0; color: white; font-size: 1.3rem;">
                    <i class="fas fa-table"></i>
                    Inserir Tabela
                </h3>
            </div>
            
            <div class="modal-body" style="padding: 1.5rem;">
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-light, #E5E7EB); font-weight: 600;">
                        Número de Linhas
                    </label>
                    <input 
                        type="number" 
                        class="form-input" 
                        id="tabelaLinhas" 
                        value="3" 
                        min="1" 
                        max="50"
                        style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--sidebar-bg, #111827);
                            border: 1px solid var(--border-dark, #374151);
                            border-radius: 8px;
                            color: white;
                            font-size: 1rem;
                        "
                        placeholder="Digite o número de linhas"
                    >
                </div>
                
                <div class="form-group">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-light, #E5E7EB); font-weight: 600;">
                        Número de Colunas
                    </label>
                    <input 
                        type="number" 
                        class="form-input" 
                        id="tabelaColunas" 
                        value="2" 
                        min="1" 
                        max="20"
                        style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--sidebar-bg, #111827);
                            border: 1px solid var(--border-dark, #374151);
                            border-radius: 8px;
                            color: white;
                            font-size: 1rem;
                        "
                        placeholder="Digite o número de colunas"
                    >
                </div>
            </div>
            
            <div class="modal-footer" style="
                padding: 1rem 1.5rem;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                border-top: 1px solid var(--border-dark, #374151);
            ">
                <button 
                    class="btn btn-secondary" 
                    id="btnCancelarTabela"
                    style="
                        padding: 0.75rem 1.5rem;
                        background: var(--sidebar-bg, #374151);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    "
                >
                    <i class="fas fa-times"></i>
                    Cancelar
                </button>
                <button 
                    class="btn btn-primary" 
                    id="btnConfirmarTabela"
                    style="
                        padding: 0.75rem 1.5rem;
                        background: linear-gradient(135deg, #3B82F6, #6366F1);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    "
                >
                    <i class="fas fa-check"></i>
                    Inserir Tabela
                </button>
            </div>
        </div>
    `;
    
    // ✅ ADICIONAR AO BODY
    document.body.appendChild(overlay);
    
    // ✅ ANIMAÇÃO DE ENTRADA
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // ✅ EVENT LISTENERS
    const btnCancelar = document.getElementById('btnCancelarTabela');
    const btnConfirmar = document.getElementById('btnConfirmarTabela');
    
    btnCancelar.onclick = function() {
        fecharModalTabelaSeguro();
    };
    
    btnConfirmar.onclick = function() {
        confirmarTabela();
    };
    
    // ✅ FECHAR COM ESC
    overlay.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModalTabelaSeguro();
        }
    });
    
    // ✅ FOCAR NO PRIMEIRO INPUT
    setTimeout(() => {
        const inputLinhas = document.getElementById('tabelaLinhas');
        if (inputLinhas) {
            inputLinhas.focus();
            inputLinhas.select();
        }
    }, 100);
    
    console.log('✅ Modal de tabela criado com IDs corretos');
}

// ✅ FUNÇÃO PARA FECHAR MODAL
function fecharModalTabelaSeguro() {
    console.log('🔒 Fechando modal de tabela (seguro)...');
    const overlay = document.getElementById('modalTabelaOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            console.log('✅ Modal removido');
            // ✅ RETOMAR SISTEMAS
            if (window.monitorQuebraAutomatica) {
                window.monitorQuebraAutomatica.processando = false;
            }
            if (window.gerenciadorColagem) {
                window.gerenciadorColagem.processando = false;
            }
        }, 300);
    }
}
// ✅ FUNÇÃO LOCAL DE FECHAR
function fecharModalTabelaSeguro() {
    console.log('🔒 Fechando modal de tabela (seguro)...');
    const overlay = document.getElementById('modalTabelaOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            console.log('✅ Modal removido');
            // ✅ RETOMAR SISTEMAS
            if (window.monitorQuebraAutomatica) {
                window.monitorQuebraAutomatica.processando = false;
            }
            if (window.gerenciadorColagem) {
                window.gerenciadorColagem.processando = false;
            }
        }, 300);
    }
}

function confirmarTabelaSeguro() {
    console.log('📋 Confirmando tabela...');
    
    try {
        const linhas = parseInt(document.getElementById('tabelaLinhas').value);
        const colunas = parseInt(document.getElementById('tabelaColunas').value);
        
        if (isNaN(linhas) || isNaN(colunas) || linhas < 1 || colunas < 1) {
            alert('⚠️ Valores inválidos!');
            return;
        }
        
        console.log(`📊 Criando tabela ${linhas}x${colunas}`);
        
        // Criar tabela
        const tabela = document.createElement('table');
        tabela.className = 'editable-table';
        
        const caption = document.createElement('caption');
        caption.className = 'editable-text';
        caption.contentEditable = true;
        caption.textContent = `Tabela ${sistema?.tableCounter || 1} - Título da Tabela`;
        if (sistema) sistema.tableCounter++;
        tabela.appendChild(caption);
        
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        for (let j = 0; j < colunas; j++) {
            const th = document.createElement('th');
            th.contentEditable = true;
            th.textContent = `Coluna ${j + 1}`;
            trHead.appendChild(th);
        }
        thead.appendChild(trHead);
        tabela.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        for (let i = 0; i < linhas; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < colunas; j++) {
                const td = document.createElement('td');
                td.contentEditable = true;
                td.textContent = 'Dado';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        tabela.appendChild(tbody);
        
        // ✅ BUSCA INTELIGENTE DE PÁGINA VÁLIDA
        console.log('🔍 Procurando página válida para inserção...');
        
        // 1️⃣ Tentar usar clickPosition (se disponível)
        let editableContent = null;
        if (sistema?.clickPosition?.paginaClicada) {
            editableContent = sistema.clickPosition.paginaClicada.querySelector('.editable-content');
            console.log('   Tentativa 1: clickPosition ->', editableContent ? '✅ OK' : '❌ FALHOU');
        }
        
        // 2️⃣ Buscar última página válida (não-capa, não-PDF)
        if (!editableContent) {
            const todasPaginas = Array.from(document.querySelectorAll('.page-content'));
            console.log(`   Total de páginas: ${todasPaginas.length}`);
            
            // Filtrar páginas válidas (não-capa, não-PDF sem editable-content)
            const paginasValidas = todasPaginas.filter(p => {
                const ehCapa = p.classList.contains('page-cover') || p.id === 'pageCover';
                const temConteudo = p.querySelector('.editable-content') !== null;
                const ehPDF = p.classList.contains('page-pdf-converted');
                return !ehCapa && temConteudo && !ehPDF;
            });
            
            console.log(`   Páginas válidas: ${paginasValidas.length}`);
            
            if (paginasValidas.length > 0) {
                const ultimaPaginaValida = paginasValidas[paginasValidas.length - 1];
                editableContent = ultimaPaginaValida.querySelector('.editable-content');
                console.log('   Tentativa 2: última página válida ->', editableContent ? '✅ OK' : '❌ FALHOU');
            }
        }
        
        // 3️⃣ Criar nova página se necessário
        if (!editableContent) {
            console.log('   ⚠️ Nenhuma página válida encontrada, criando nova...');
            const novaPagina = criarNovaPaginaParaTabela();
            editableContent = novaPagina.querySelector('.editable-content');
            console.log('   Tentativa 3: nova página ->', editableContent ? '✅ OK' : '❌ FALHOU');
        }
        
        // 4️⃣ ÚLTIMA VERIFICAÇÃO
        if (!editableContent) {
            console.error('❌ ERRO CRÍTICO: Impossível encontrar ou criar editable-content');
            alert('❌ Erro ao encontrar local para inserir tabela.\n\nTente:\n1. Criar uma página nova primeiro\n2. Clicar com botão direito em uma página existente\n3. Recarregar a página (F5)');
            return;
        }
        
        // ✅ INSERIR TABELA
        console.log('✅ Local encontrado, inserindo tabela...');
        editableContent.appendChild(tabela);
        console.log('✅ Tabela inserida com sucesso!');
        
        // Fechar modal
        fecharModalTabelaSeguro();
        
        // Salvar
        if (sistema?.salvarDados) {
            setTimeout(() => sistema.salvarDados(), 500);
        }
        
        // Toast
        if (sistema?.mostrarToast) {
            sistema.mostrarToast('✅ Tabela inserida!', 'success');
        }
        
        // Scroll para tabela
        setTimeout(() => {
            tabela.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('❌ Erro ao inserir tabela: ' + error.message);
    }
}

// ✅ FUNÇÃO AUXILIAR: CRIAR NOVA PÁGINA PARA TABELA
function criarNovaPaginaParaTabela() {
    console.log('📄 Criando nova página para tabela...');
    
    const previewContainer = document.getElementById('previewContainer');
    if (!previewContainer) {
        throw new Error('Preview container não encontrado');
    }
    
    const numPaginaAtual = document.querySelectorAll('.page-content').length;
    
    const novaPage = document.createElement('div');
    novaPage.className = 'page-content editable-page';
    novaPage.innerHTML = `
        <div class="editable-content"></div>
        <div class="page-footer editable-footer">
            <p class="footer-text editable-text" contenteditable="true">
                <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
            </p>
            <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
        </div>
    `;
    
    previewContainer.appendChild(novaPage);
    
    // Atualizar interface
    setTimeout(() => {
        if (typeof adicionarBotoesEntrePaginas === 'function') {
            adicionarBotoesEntrePaginas();
        }
        if (typeof adicionarBotoesDeletarPagina === 'function') {
            adicionarBotoesDeletarPagina();
        }
        if (typeof renumerarPaginas === 'function') {
            renumerarPaginas();
        }
    }, 100);
    
    console.log(`✅ Nova página ${numPaginaAtual + 1} criada`);
    
    return novaPage;
}
// ✅ BUSCAR TEXTO
function buscarTexto() {
    const texto = document.getElementById('searchText').value;
    
    if (!texto) {
        alert('⚠️ Digite algo para buscar!');
        return;
    }
    
    if (window.find) {
        const encontrado = window.find(texto);
        if (encontrado) {
            sistema.mostrarToast(`✅ Texto encontrado: "${texto}"`, 'success');
        } else {
            sistema.mostrarToast(`❌ Texto não encontrado: "${texto}"`, 'error');
        }
    } else {
        alert('⚠️ Busca não suportada neste navegador. Use Ctrl+F');
    }
}

// ✅ CONTAR PALAVRAS
function contarPalavras() {
    const conteudo = document.getElementById('previewContainer').textContent;
    const palavras = conteudo.trim().split(/\s+/).length;
    const caracteres = conteudo.length;
    const semEspacos = conteudo.replace(/\s/g, '').length;
    
    alert(
        `📊 ESTATÍSTICAS DO DOCUMENTO\n\n` +
        `📝 Palavras: ${palavras.toLocaleString()}\n` +
        `🔤 Caracteres: ${caracteres.toLocaleString()}\n` +
        `🔡 Sem espaços: ${semEspacos.toLocaleString()}\n` +
        `📄 Páginas: ${document.querySelectorAll('.page-content').length}`
    );
}

// ✅ VERIFICAR ORTOGRAFIA (placeholder)
function verificarOrtografia() {
    alert('🔤 Verificação Ortográfica\n\nRecurso em desenvolvimento!\n\nUse o corretor do navegador por enquanto (clique direito no texto).');
}

// ✅ EXPORTAR WORD (placeholder)
function exportarWord() {
    alert('📄 Exportar para Word\n\nRecurso em desenvolvimento!\n\nPor enquanto, use "Exportar PDF".');
}

// ✅ EXPORTAR HTML
function exportarHTML() {
    const html = document.getElementById('previewContainer').innerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${Date.now()}.html`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    sistema.mostrarToast('✅ HTML exportado!', 'success');
}

// ✅ IMPRIMIR
function imprimirDocumento() {
    window.print();
}

// ==================== SISTEMA DE SELEÇÃO MÚLTIPLA ====================

class SistemaSelecaoMultipla {
    constructor() {
        this.elementosSelecionados = new Set();
        this.modoSelecao = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.marcarElementosSelecionaveis();
        
        // Tecla Ctrl mantém modo de seleção ativo
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.ativarModoSelecao();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (!e.ctrlKey && !e.metaKey) {
                this.desativarModoSelecao();
            }
        });

        // Atalho Ctrl+A para selecionar tudo
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                const target = e.target;
                if (!target.isContentEditable && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.selecionarTodos();
                }
            }
        });

        // Atalho Delete para excluir selecionados
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.elementosSelecionados.size > 0) {
                const target = e.target;
                if (!target.isContentEditable && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.excluirSelecionados();
                }
            }
        });
    }

    marcarElementosSelecionaveis() {
        const seletores = [
            '.editable-text',
            '.editable-table',
            'table',
            '.editable-list',
            'ul',
            'ol',
            '.photo-item',
            '.photo-group-container',
            'h2', 'h3', 'h4',
            'p',
            'blockquote'
        ];

        seletores.forEach(seletor => {
            document.querySelectorAll(seletor).forEach(elemento => {
                // Não marcar elementos do rodapé e capa
                if (!elemento.closest('.page-footer') && 
                    !elemento.closest('.cover-content') &&
                    !elemento.closest('.page-counter-badge') &&
                    !elemento.closest('.delete-page-button')) {
                    
                    elemento.classList.add('multi-selectable');
                }
            });
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const elemento = e.target.closest('.multi-selectable');
            
            if (elemento && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSelecao(elemento);
            }
        });
    }

    ativarModoSelecao() {
        this.modoSelecao = true;
        document.getElementById('selectionModeIndicator').classList.add('active');
    }

    desativarModoSelecao() {
        this.modoSelecao = false;
        document.getElementById('selectionModeIndicator').classList.remove('active');
    }

    toggleSelecao(elemento) {
        if (this.elementosSelecionados.has(elemento)) {
            this.removerSelecao(elemento);
        } else {
            this.adicionarSelecao(elemento);
        }
    }

    adicionarSelecao(elemento) {
        this.elementosSelecionados.add(elemento);
        elemento.classList.add('multi-selected');
        this.atualizarToolbar();
        
        // Feedback sonoro (opcional)
        this.playFeedbackSound('select');
    }

    removerSelecao(elemento) {
        this.elementosSelecionados.delete(elemento);
        elemento.classList.remove('multi-selected');
        this.atualizarToolbar();
    }

    selecionarTodos() {
        document.querySelectorAll('.multi-selectable').forEach(elemento => {
            if (!elemento.closest('.page-footer') && !elemento.closest('.cover-content')) {
                this.adicionarSelecao(elemento);
            }
        });
        
        sistema.mostrarToast(`✅ ${this.elementosSelecionados.size} elementos selecionados!`, 'success');
    }

    desselecionarTodos() {
        this.elementosSelecionados.forEach(elemento => {
            elemento.classList.remove('multi-selected');
        });
        this.elementosSelecionados.clear();
        this.atualizarToolbar();
        
        sistema.mostrarToast('🔄 Seleção limpa!', 'info');
    }

    atualizarToolbar() {
        const toolbar = document.getElementById('multiSelectionToolbar');
        const count = document.getElementById('selectionCount');
        
        count.textContent = this.elementosSelecionados.size;
        
        if (this.elementosSelecionados.size > 0) {
            toolbar.classList.add('active');
        } else {
            toolbar.classList.remove('active');
        }
    }

    excluirSelecionados() {
        const total = this.elementosSelecionados.size;
        
        if (total === 0) {
            sistema.mostrarToast('⚠️ Nenhum elemento selecionado!', 'warning');
            return;
        }

        const confirmacao = confirm(
            `🗑️ CONFIRMAR EXCLUSÃO MÚLTIPLA\n\n` +
            `Total de elementos: ${total}\n\n` +
            `⚠️ Esta ação NÃO pode ser desfeita!\n\n` +
            `Deseja realmente excluir ${total} elemento${total > 1 ? 's' : ''}?`
        );

        if (confirmacao) {
            // Animação de exclusão
            this.elementosSelecionados.forEach((elemento, index) => {
                setTimeout(() => {
                    elemento.style.transition = 'all 0.5s ease-out';
                    elemento.style.opacity = '0';
                    elemento.style.transform = 'scale(0.8) translateX(-50px)';
                    
                    setTimeout(() => {
                        elemento.remove();
                        
                        // Após remover o último, atualizar
                        if (index === total - 1) {
                            this.elementosSelecionados.clear();
                            this.atualizarToolbar();
                            this.marcarElementosSelecionaveis();
                            
                            if (sistema) {
                                sistema.salvarDados();
                            }
                            
                            sistema.mostrarToast(`🗑️ ${total} elemento${total > 1 ? 's' : ''} excluído${total > 1 ? 's' : ''}!`, 'success');
                        }
                    }, 500);
                }, index * 80); // Delay escalonado para efeito cascata
            });
        }
    }

    playFeedbackSound(tipo) {
        // Feedback visual ao invés de sonoro
        if (tipo === 'select') {
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(16, 185, 129, 0.1);
                pointer-events: none;
                z-index: 99999;
                animation: flashFeedback 0.3s ease-out;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes flashFeedback {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(flash);
            
            setTimeout(() => {
                flash.remove();
                style.remove();
            }, 300);
        }
    }
}

// ==================== FUNÇÕES GLOBAIS ====================

let selecaoMultipla;

window.addEventListener('DOMContentLoaded', () => {
    selecaoMultipla = new SistemaSelecaoMultipla();
    console.log('✅ Sistema de Seleção Múltipla Ativado!');
});

function selecionarTodos() {
    selecaoMultipla.selecionarTodos();
}

function desselecionarTodos() {
    selecaoMultipla.desselecionarTodos();
}

function excluirSelecionados() {
    selecaoMultipla.excluirSelecionados();
}


class SidebarController {
    constructor() {
        this.leftSidebar = null;
        this.rightSidebar = null;
        this.toggleLeft = null;
        this.toggleRight = null;
        this.init();


    }

    init() {
        // ✅ Aguardar DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.inicializarElementos());
        } else {
            this.inicializarElementos();
        }
    }

    inicializarElementos() {
        this.leftSidebar = document.getElementById('leftSidebar');
        this.rightSidebar = document.getElementById('rightSidebar');
        this.toggleLeft = document.getElementById('toggleLeftSidebar');
        this.toggleRight = document.getElementById('toggleRightSidebar');

        if (!this.leftSidebar || !this.rightSidebar) {
            console.warn('⚠️ Sidebars não encontradas, tentando novamente...');
            setTimeout(() => this.inicializarElementos(), 500);
            return;
        }

        console.log('✅ SidebarController inicializado!');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle Sidebar Esquerda
        if (this.toggleLeft) {
            this.toggleLeft.addEventListener('click', () => {
                this.toggleSidebar('left');
            });
        }

        // Toggle Sidebar Direita
        if (this.toggleRight) {
            this.toggleRight.addEventListener('click', () => {
                this.toggleSidebar('right');
            });
        }

        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.toggleSidebar('left');
            }
            if (e.key === 'F2') {
                e.preventDefault();
                this.toggleSidebar('right');
            }
            if (e.key === 'F3') {
                e.preventDefault();
                this.abrirAmbas();
            }
        });
    }

    toggleSidebar(lado) {
        if (lado === 'left' && this.leftSidebar && this.toggleLeft) {
            const isActive = this.leftSidebar.classList.toggle('active');
            this.toggleLeft.classList.toggle('active');
            console.log('Sidebar Esquerda:', isActive ? 'ABERTA ✅' : 'FECHADA ❌');
        } else if (lado === 'right' && this.rightSidebar && this.toggleRight) {
            const isActive = this.rightSidebar.classList.toggle('active');
            this.toggleRight.classList.toggle('active');
            console.log('Sidebar Direita:', isActive ? 'ABERTA ✅' : 'FECHADA ❌');
        }
        
        // ✅ NÃO chamar atualizarOverlay (não existe mais)
    }

    fecharSidebar(lado) {
        if (lado === 'left' && this.leftSidebar && this.toggleLeft) {
            this.leftSidebar.classList.remove('active');
            this.toggleLeft.classList.remove('active');
            console.log('✅ Sidebar Esquerda FECHADA');
        } else if (lado === 'right' && this.rightSidebar && this.toggleRight) {
            this.rightSidebar.classList.remove('active');
            this.toggleRight.classList.remove('active');
            console.log('✅ Sidebar Direita FECHADA');
        }
    }

    fecharTodasSidebars() {
        if (this.leftSidebar) this.leftSidebar.classList.remove('active');
        if (this.rightSidebar) this.rightSidebar.classList.remove('active');
        if (this.toggleLeft) this.toggleLeft.classList.remove('active');
        if (this.toggleRight) this.toggleRight.classList.remove('active');
        console.log('✅ Todas as sidebars FECHADAS');
    }

    abrirAmbas() {
        if (this.leftSidebar) this.leftSidebar.classList.add('active');
        if (this.rightSidebar) this.rightSidebar.classList.add('active');
        if (this.toggleLeft) this.toggleLeft.classList.add('active');
        if (this.toggleRight) this.toggleRight.classList.add('active');
        console.log('✅ AMBAS SIDEBARS ABERTAS');
    }

    getEstado() {
        return {
            esquerdaAberta: this.leftSidebar?.classList.contains('active') || false,
            direitaAberta: this.rightSidebar?.classList.contains('active') || false
        };
    }
}

// ==================== EDITOR DE CAPA CANVAS ====================

class EditorCapaCanvas {
    constructor() {
        this.coverCanvas = null;
        this.coverBackground = null;
        this.pageCover = null;
        this.dropIndicator = null;
        
        this.elementos = [];
        this.elementoSelecionado = null;
        this.historico = [];
        this.indiceHistorico = -1;
        this.elementIdCounter = 0;
        
        this.isDragging = false;
        this.isResizing = false;
        this.inicializado = false;
        this.tentativas = 0;
        this.maxTentativas = 5;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.inicializarElementos());
        } else {
            this.inicializarElementos();
        }
            // ✅ ADICIONAR PROTEÇÃO
    setTimeout(() => {
        this.protegerCapa();
    }, 2000);
    }

    inicializarElementos() {
        this.tentativas++;
        
        this.coverCanvas = document.getElementById('coverCanvas');
        this.coverBackground = document.getElementById('coverBackground');
        this.pageCover = document.getElementById('pageCover');
        this.dropIndicator = document.getElementById('dropIndicator');
        
        if (!this.coverCanvas || !this.coverBackground || !this.pageCover) {
            console.warn(`⚠️ Tentativa ${this.tentativas}/${this.maxTentativas} - Elementos não encontrados`);
            
            if (this.tentativas < this.maxTentativas) {
                setTimeout(() => this.inicializarElementos(), 1000);
            } else {
                console.error('❌ FALHA: Elementos da capa não existem no HTML!');
                console.log('📝 Verifique se o HTML contém:');
                console.log('   <div id="coverCanvas">');
                console.log('   <div id="coverBackground">');
                console.log('   <div id="pageCover">');
            }
            return;
        }
        
        console.log('✅ Editor de Capa Canvas Inicializado!');
        this.inicializado = true;
        
        this.setupEventListeners();
        this.carregarCapaSalva();
    }

    verificarInicializado() {
        if (!this.inicializado || !this.coverCanvas || !this.coverBackground) {
            console.warn('⚠️ Editor ainda não inicializado');
            return false;
        }
        return true;
    }

    setupEventListeners() {
        if (!this.verificarInicializado()) return;
        
        this.pageCover.addEventListener('click', (e) => {
            if (e.target === this.pageCover || e.target === this.coverCanvas || e.target === this.coverBackground) {
                this.desselecionarTodos();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.elementoSelecionado) {
                if (e.key === 'Delete') {
                    e.preventDefault();
                    this.excluirElemento(this.elementoSelecionado);
                }
                if (e.key.startsWith('Arrow')) {
                    e.preventDefault();
                    this.moverElementoTeclado(e.key);
                }
                if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                    e.preventDefault();
                    this.duplicarElemento(this.elementoSelecionado);
                }
            }
        });
    }
protegerCapa() {
    console.log('🛡️ Protegendo capa de limpezas acidentais...');
    
    // Observar mudanças no coverCanvas
    if (!this.coverCanvas || !this.coverBackground) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && 
                mutation.removedNodes.length > 0 && 
                mutation.addedNodes.length === 0) {
                // Alguém removeu elementos sem adicionar nada
                console.warn('⚠️ Tentativa de limpar canvas detectada!');
                
                // Tentar restaurar do localStorage
                const capaSalva = localStorage.getItem('capa-canvas-editor');
                if (capaSalva) {
                    const dados = JSON.parse(capaSalva);
                    if (dados.elementos && this.coverCanvas.children.length === 0) {
                        console.log('🔄 Restaurando capa do localStorage...');
                        this.coverCanvas.innerHTML = dados.elementos;
                        this.coverBackground.style.cssText = dados.background;
                        this.showToast('✅ Capa restaurada automaticamente!', 'success');
                    }
                }
            }
        });
    });
    
    observer.observe(this.coverCanvas, {
        childList: true,
        subtree: false
    });
    
    console.log('✅ Proteção da capa ativada');
}
    adicionarElemento(tipo, x = null, y = null) {
        if (!this.verificarInicializado()) {
            console.warn('⚠️ Aguarde o editor carregar...');
            return null;
        }
        
        const elemento = this.criarElemento(tipo);
        
        if (x === null || y === null) {
            const rect = this.pageCover.getBoundingClientRect();
            x = (rect.width / 2) - 100;
            y = (rect.height / 2) - 50;
        }
        
        elemento.style.left = x + 'px';
        elemento.style.top = y + 'px';
        
        this.coverCanvas.appendChild(elemento);
        this.elementos.push({
            id: elemento.dataset.elementId,
            tipo: tipo,
            elemento: elemento
        });
        
        this.selecionarElemento(elemento);
        this.salvarEstado();
        this.atualizarIndicador();
        
        console.log(`✅ Elemento "${tipo}" adicionado`);
        return elemento;
    }

    criarElemento(tipo) {
        const id = `element-${this.elementIdCounter++}`;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.dataset.elementId = id;
        div.dataset.tipo = tipo;
        
        switch(tipo) {
            case 'titulo':
                div.classList.add('texto');
                div.innerHTML = `<div contenteditable="true" class="element-content" style="font-size: 2.5rem; font-weight: bold; color: #003087; font-family: 'Times New Roman', serif;">TÍTULO PRINCIPAL</div>`;
                break;
                
            case 'subtitulo':
                div.classList.add('texto');
                div.innerHTML = `<div contenteditable="true" class="element-content" style="font-size: 1.5rem; font-weight: 600; color: #0056b3; font-family: 'Times New Roman', serif;">Subtítulo do Documento</div>`;
                break;
                
            case 'paragrafo':
                div.classList.add('texto');
                div.innerHTML = `<div contenteditable="true" class="element-content" style="font-size: 1rem; color: #1e293b; font-family: 'Times New Roman', serif;">Digite seu texto aqui...</div>`;
                break;
                
            case 'retangulo':
                div.classList.add('forma');
                div.innerHTML = `<div class="element-content" style="width: 200px; height: 100px; background: #0056b3; border-radius: 8px;"></div>`;
                break;
                
            case 'circulo':
                div.classList.add('forma');
                div.innerHTML = `<div class="element-content" style="width: 150px; height: 150px; background: #10b981; border-radius: 50%;"></div>`;
                break;
                
            case 'linha':
                div.classList.add('forma');
                div.innerHTML = `<div class="element-content" style="width: 300px; height: 4px; background: #003087;"></div>`;
                break;
                
            case 'triangulo':
                div.classList.add('forma');
                div.innerHTML = `<div class="element-content" style="width: 0; height: 0; border-left: 75px solid transparent; border-right: 75px solid transparent; border-bottom: 130px solid #ef4444;"></div>`;
                break;
                
            case 'icone-medicamento':
            case 'icone-fabrica':
            case 'icone-certificado':
            case 'icone-dna':
                div.classList.add('icone');
                const icones = {
                    'icone-medicamento': 'fa-pills',
                    'icone-fabrica': 'fa-industry',
                    'icone-certificado': 'fa-certificate',
                    'icone-dna': 'fa-dna'
                };
                div.innerHTML = `<i class="fas ${icones[tipo]} element-content"></i>`;
                break;
                
            case 'imagem':
            case 'logo':
                div.classList.add('imagem');
                div.innerHTML = `<div class="element-content" style="width: 200px; height: 200px;"><img src="" style="width: 100%; height: 100%; object-fit: contain;"></div>`;
                break;
        }
        
        div.innerHTML += `
            <div class="element-toolbar">
                <button class="toolbar-btn" onclick="editorCapa.duplicarElemento('${id}')" title="Duplicar">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="toolbar-btn" onclick="editorCapa.enviarFrente('${id}')" title="Frente">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="toolbar-btn" onclick="editorCapa.enviarFundo('${id}')" title="Trás">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="toolbar-btn" onclick="editorCapa.excluirElemento('${id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        if (tipo === 'retangulo' || tipo === 'circulo' || tipo === 'linha') {
            div.innerHTML += `
                <div class="resize-handle nw"></div>
                <div class="resize-handle ne"></div>
                <div class="resize-handle sw"></div>
                <div class="resize-handle se"></div>
            `;
        }
        
        div.addEventListener('mousedown', (e) => {
            if (e.target === div || e.target.classList.contains('element-content')) {
                this.iniciarArrastar(e, id);
            }
        });
        
        return div;
    }


    limparCanvas() {
    if (!this.verificarInicializado()) return;
    
    // Limpar todos os elementos do canvas
    this.coverCanvas.innerHTML = '';
    
    // Resetar array de elementos
    this.elementos = [];
    
    // Resetar background para branco
    if (this.coverBackground) {
        this.coverBackground.style.background = '#ffffff';
        this.coverBackground.style.backgroundImage = 'none';
        this.coverBackground.style.opacity = '1';
    }
    
    // Resetar seleção
    this.elementoSelecionado = null;
    
    // Salvar estado
    this.salvarEstado();
    
    console.log('🧹 Canvas limpo completamente');
}
// ==================== TEMPLATE 1: NOVO NORDISK CLÁSSICO (PRINT 1) ====================
templateNovoNordiskClassico() {
    console.log('🎨 Aplicando Template: Novo Nordisk Clássico');
    
    // Background branco puro
    this.aplicarCorFundo('#ffffff');
     this.limparCanvas();
    // Logo no canto superior ESQUERDO (pequeno)
    const logo = this.adicionarElemento('imagem', 60, 30);
    if (logo) {
        const content = logo.querySelector('.element-content');
        content.style.width = '100px';
        content.style.height = '50px';
        // Usuário fará upload do logo depois
    }
    
    // Texto "NOVO NORDISK PRODUÇÃO..." logo abaixo do logo
    const textoEmpresa = this.adicionarElemento('paragrafo', 60, 100);
    if (textoEmpresa) {
        const content = textoEmpresa.querySelector('.element-content');
        content.textContent = 'NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL';
        content.style.fontSize = '11pt';
        content.style.fontWeight = 'bold';
        content.style.color = '#003087';
        content.style.textAlign = 'left';
        content.style.width = '600px';
        content.style.lineHeight = '1.2';
    }
    
    // FAIXA AZUL ESCURA HORIZONTAL (meio da página)
    const faixaAzul = this.adicionarElemento('retangulo', 0, 470);
    if (faixaAzul) {
        const content = faixaAzul.querySelector('.element-content');
        content.style.width = '794px'; // Largura total da página A4
        content.style.height = '160px';
        content.style.background = '#001F54'; // Azul escuro Novo Nordisk
        content.style.borderRadius = '0';
    }
    
    // TÍTULO dentro da faixa azul
    const titulo = this.adicionarElemento('titulo', 100, 490);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'TÍTULO AQUI';
        content.style.color = 'white';
        content.style.fontSize = '2rem';
        content.style.fontWeight = 'bold';
        content.style.textAlign = 'center';
        content.style.width = '600px';
        content.style.letterSpacing = '2px';
    }
    
    // SUBTÍTULO dentro da faixa azul
    const subtitulo = this.adicionarElemento('subtitulo', 100, 555);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'Subtítulo aqui';
        content.style.color = 'white';
        content.style.fontSize = '1.2rem';
        content.style.fontWeight = 'normal';
        content.style.textAlign = 'center';
        content.style.width = '600px';
    }
    
    // DATA no rodapé
    const data = this.adicionarElemento('paragrafo', 250, 950);
    if (data) {
        const content = data.querySelector('.element-content');
        content.textContent = 'Montes Claros, Setembro de 2025';
        content.style.fontSize = '12pt';
        content.style.color = '#003087';
        content.style.textAlign = 'center';
        content.style.fontWeight = 'bold';
        content.style.width = '300px';
    }
    
    // LINHA SUPERIOR no rodapé
    const linhaRodape = this.adicionarElemento('linha', 80, 1010);
    if (linhaRodape) {
        const content = linhaRodape.querySelector('.element-content');
        content.style.width = '630px';
        content.style.height = '1px';
        content.style.background = '#000000';
    }
    
    // DADOS DA EMPRESA (rodapé)
    const dadosEmpresa = this.adicionarElemento('paragrafo', 80, 1020);
    if (dadosEmpresa) {
        const content = dadosEmpresa.querySelector('.element-content');
        content.innerHTML = '<strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br><strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG - CEP 39.404-004.<br>Fone: 38-3229-6200 – E-mail: azla@novonordisk.com e ivqc@novonordisk.com';
        content.style.fontSize = '8pt';
        content.style.color = '#000000';
        content.style.textAlign = 'center';
        content.style.width = '630px';
        content.style.lineHeight = '1.3';
    }
    
    console.log('✅ Template Novo Nordisk Clássico aplicado!');
}

// ==================== TEMPLATE 2: NOVO NORDISK GEOMÉTRICO (PRINT 3) ====================
// ==================== TEMPLATE 2: NOVO NORDISK GEOMÉTRICO - REDESIGN ELEGANTE ====================
templateNovoNordiskGeometrico() {
    console.log('🎨 Aplicando Template: Novo Nordisk Geométrico (Redesign)');
     this.limparCanvas();
    // Background branco puro
    this.aplicarCorFundo('#ffffff');
    
    // ===== DESIGN DE ONDAS DIAGONAIS ELEGANTES =====
    
    // Onda 1 - Azul claro muito sutil (fundo)
    const onda1 = this.adicionarElemento('retangulo', -100, 100);
    if (onda1) {
        const content = onda1.querySelector('.element-content');
        content.style.width = '400px';
        content.style.height = '600px';
        content.style.background = 'linear-gradient(135deg, rgba(180, 207, 232, 0.3) 0%, rgba(180, 207, 232, 0.1) 100%)';
        content.style.borderRadius = '0 200px 200px 0';
        content.style.transform = 'skewY(-3deg)';
        content.style.boxShadow = 'none';
    }
    
    // Onda 2 - Azul médio (meio)
    const onda2 = this.adicionarElemento('retangulo', -50, 250);
    if (onda2) {
        const content = onda2.querySelector('.element-content');
        content.style.width = '350px';
        content.style.height = '500px';
        content.style.background = 'linear-gradient(135deg, rgba(127, 168, 209, 0.4) 0%, rgba(127, 168, 209, 0.15) 100%)';
        content.style.borderRadius = '0 180px 180px 0';
        content.style.transform = 'skewY(-3deg)';
    }
    
    // Onda 3 - Azul Novo Nordisk (frente - destaque)
    const onda3 = this.adicionarElemento('retangulo', 0, 400);
    if (onda3) {
        const content = onda3.querySelector('.element-content');
        content.style.width = '300px';
        content.style.height = '400px';
        content.style.background = 'linear-gradient(135deg, rgba(0, 48, 135, 0.6) 0%, rgba(0, 86, 179, 0.3) 100%)';
        content.style.borderRadius = '0 150px 150px 0';
        content.style.transform = 'skewY(-3deg)';
    }
    
    // ===== LADO DIREITO - ONDAS INVERTIDAS =====
    
    // Onda direita 1 - Azul claro sutil
    const ondaDir1 = this.adicionarElemento('retangulo', 494, 200);
    if (ondaDir1) {
        const content = ondaDir1.querySelector('.element-content');
        content.style.width = '400px';
        content.style.height = '600px';
        content.style.background = 'linear-gradient(225deg, rgba(180, 207, 232, 0.3) 0%, rgba(180, 207, 232, 0.1) 100%)';
        content.style.borderRadius = '200px 0 0 200px';
        content.style.transform = 'skewY(3deg)';
    }
    
    // Onda direita 2 - Azul médio
    const ondaDir2 = this.adicionarElemento('retangulo', 544, 350);
    if (ondaDir2) {
        const content = ondaDir2.querySelector('.element-content');
        content.style.width = '350px';
        content.style.height = '500px';
        content.style.background = 'linear-gradient(225deg, rgba(127, 168, 209, 0.4) 0%, rgba(127, 168, 209, 0.15) 100%)';
        content.style.borderRadius = '180px 0 0 180px';
        content.style.transform = 'skewY(3deg)';
    }
    
    // Onda direita 3 - Azul escuro (destaque)
    const ondaDir3 = this.adicionarElemento('retangulo', 594, 500);
    if (ondaDir3) {
        const content = ondaDir3.querySelector('.element-content');
        content.style.width = '300px';
        content.style.height = '400px';
        content.style.background = 'linear-gradient(225deg, rgba(0, 48, 135, 0.6) 0%, rgba(0, 86, 179, 0.3) 100%)';
        content.style.borderRadius = '150px 0 0 150px';
        content.style.transform = 'skewY(3deg)';
    }
    
    // ===== CÍRCULO DECORATIVO CENTRAL =====
    const circuloDetalhe = this.adicionarElemento('circulo', 650, 80);
    if (circuloDetalhe) {
        const content = circuloDetalhe.querySelector('.element-content');
        content.style.width = '120px';
        content.style.height = '120px';
        content.style.background = 'radial-gradient(circle, rgba(0, 86, 179, 0.15), transparent)';
    }
    
    // ===== LOGO NOVO NORDISK - CENTRALIZADO NO TOPO =====
    const logo = this.adicionarElemento('imagem', 310, 50);
    if (logo) {
        const content = logo.querySelector('.element-content');
        content.style.width = '170px';
        content.style.height = '85px';
        content.style.zIndex = '100';
    }
    
    // ===== TEXTO EMPRESA - LOGO ABAIXO DO LOGO =====
    const textoEmpresa = this.adicionarElemento('paragrafo', 150, 160);
    if (textoEmpresa) {
        const content = textoEmpresa.querySelector('.element-content');
        content.textContent = 'NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL';
        content.style.fontSize = '11pt';
        content.style.fontWeight = 'bold';
        content.style.color = '#003087';
        content.style.textAlign = 'center';
        content.style.width = '500px';
        content.style.letterSpacing = '0.5px';
        content.style.zIndex = '100';
    }
    
    // ===== CAIXA DE TÍTULO MODERNA - COM SOMBRA E GRADIENTE SUTIL =====
    const caixaTitulo = this.adicionarElemento('retangulo', 120, 500);
    if (caixaTitulo) {
        const content = caixaTitulo.querySelector('.element-content');
        content.style.width = '550px';
        content.style.height = '140px';
        content.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%)';
        content.style.borderRadius = '16px';
        content.style.boxShadow = '0 10px 40px rgba(0, 48, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
        content.style.border = '2px solid rgba(0, 86, 179, 0.2)';
        content.style.backdropFilter = 'blur(10px)';
        content.style.zIndex = '100';
    }
    
    // ===== TÍTULO DENTRO DA CAIXA =====
    const titulo = this.adicionarElemento('titulo', 160, 525);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'RELATÓRIO DE QUALIDADE';
        content.style.color = '#003087';
        content.style.fontSize = '1.8rem';
        content.style.fontWeight = 'bold';
        content.style.textAlign = 'center';
        content.style.width = '470px';
        content.style.letterSpacing = '1px';
        content.style.zIndex = '101';
    }
    
    // ===== SUBTÍTULO DENTRO DA CAIXA =====
    const subtitulo = this.adicionarElemento('subtitulo', 160, 585);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'Produção Industrial e Controle';
        content.style.color = '#0056b3';
        content.style.fontSize = '1.1rem';
        content.style.textAlign = 'center';
        content.style.width = '470px';
        content.style.fontWeight = '500';
        content.style.zIndex = '101';
    }
    
    // ===== LINHA DECORATIVA ACIMA DO TÍTULO =====
    const linhaDetalhe = this.adicionarElemento('linha', 320, 510);
    if (linhaDetalhe) {
        const content = linhaDetalhe.querySelector('.element-content');
        content.style.width = '150px';
        content.style.height = '3px';
        content.style.background = 'linear-gradient(90deg, transparent, #0056b3, transparent)';
        content.style.zIndex = '101';
    }
    
    // ===== DATA - ELEGANTE =====
    const data = this.adicionarElemento('paragrafo', 280, 970);
    if (data) {
        const content = data.querySelector('.element-content');
        content.textContent = 'Montes Claros, Setembro de 2025';
        content.style.fontSize = '11pt';
        content.style.color = '#64748b';
        content.style.textAlign = 'center';
        content.style.fontWeight = '500';
        content.style.width = '240px';
        content.style.zIndex = '100';
    }
    
    // ===== RODAPÉ DISCRETO - SEM FAIXA AZUL =====
    const rodapeTexto = this.adicionarElemento('paragrafo', 100, 1020);
    if (rodapeTexto) {
        const content = rodapeTexto.querySelector('.element-content');
        content.innerHTML = '<strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>Fone: 38-3229-6200 – E-mail: azla@novonordisk.com';
        content.style.fontSize = '7.5pt';
        content.style.color = '#64748b';
        content.style.textAlign = 'center';
        content.style.width = '600px';
        content.style.lineHeight = '1.4';
        content.style.zIndex = '100';
    }
    
    console.log('✅ Template Novo Nordisk Geométrico REDESENHADO aplicado!');
}

// ==================== TEMPLATE: NOVO NORDISK DIAGONAL ELEGANTE ====================
templateNovoNordiskDiagonal() {
    console.log('🎨 Aplicando Template: Novo Nordisk Diagonal Elegante');
     this.limparCanvas();
    // Background branco puro
    this.aplicarCorFundo('#ffffff');
    
    // ===== LOGO NO TOPO ESQUERDO =====
    const logo = this.adicionarElemento('imagem', 50, 50);
    if (logo) {
        const content = logo.querySelector('.element-content');
        content.style.width = '160px';
        content.style.height = '80px';
        content.style.zIndex = '100';
    }
    
    // ===== TEXTO ABAIXO DO LOGO =====
    const textoEmpresa = this.adicionarElemento('paragrafo', 50, 145);
    if (textoEmpresa) {
        const content = textoEmpresa.querySelector('.element-content');
        content.innerHTML = '<span style="font-size: 9pt; color: #003087; font-weight: 600; letter-spacing: 0.5px;">PRODUÇÃO FARMACÊUTICA DO BRASIL</span>';
        content.style.textAlign = 'left';
        content.style.width = '250px';
    }
    
    // ===== LINHAS DIAGONAIS CANHO INFERIOR ESQUERDO =====
    // Linha 1 - Cinza clara
    const linha1 = this.adicionarElemento('linha', 0, 550);
    if (linha1) {
        const content = linha1.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#E5E7EB';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // Linha 2
    const linha2 = this.adicionarElemento('linha', 0, 565);
    if (linha2) {
        const content = linha2.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#D1D5DB';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // Linha 3
    const linha3 = this.adicionarElemento('linha', 0, 580);
    if (linha3) {
        const content = linha3.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#9CA3AF';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // Linha 4
    const linha4 = this.adicionarElemento('linha', 0, 595);
    if (linha4) {
        const content = linha4.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#6B7280';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // ===== GRADIENTE AZUL CLARO CANTO SUPERIOR DIREITO =====
    const gradienteTopo = this.adicionarElemento('circulo', 650, -50);
    if (gradienteTopo) {
        const content = gradienteTopo.querySelector('.element-content');
        content.style.width = '300px';
        content.style.height = '300px';
        content.style.background = 'radial-gradient(circle, rgba(180, 207, 232, 0.4) 0%, rgba(180, 207, 232, 0) 70%)';
        content.style.zIndex = '1';
    }
    
    // ===== FAIXA AZUL ESCURA CENTRAL =====
    const faixaCentral = this.adicionarElemento('retangulo', 0, 370);
    if (faixaCentral) {
        const content = faixaCentral.querySelector('.element-content');
        content.style.width = '794px';
        content.style.height = '150px';
        content.style.background = 'linear-gradient(90deg, #003087 0%, #00458F 100%)';
        content.style.borderRadius = '0';
        content.style.zIndex = '50';
    }
    
    // ===== TÍTULO DENTRO DA FAIXA =====
    const titulo = this.adicionarElemento('titulo', 50, 390);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'TÍTULO AQUI';
        content.style.color = 'white';
        content.style.fontSize = '2.8rem';
        content.style.fontWeight = 'bold';
        content.style.textAlign = 'left';
        content.style.width = '700px';
        content.style.letterSpacing = '1px';
        content.style.zIndex = '51';
    }
    
    // ===== SUBTÍTULO DENTRO DA FAIXA =====
    const subtitulo = this.adicionarElemento('subtitulo', 50, 465);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'Subtítulo aqui';
        content.style.color = 'white';
        content.style.fontSize = '1.3rem';
        content.style.textAlign = 'left';
        content.style.width = '700px';
        content.style.fontWeight = '400';
        content.style.zIndex = '51';
    }
    
    // ===== LINHAS DIAGONAIS CANTO INFERIOR DIREITO =====
    // Linha inferior 1
    const linhaInf1 = this.adicionarElemento('linha', 544, 900);
    if (linhaInf1) {
        const content = linhaInf1.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#E5E7EB';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // Linha inferior 2
    const linhaInf2 = this.adicionarElemento('linha', 544, 915);
    if (linhaInf2) {
        const content = linhaInf2.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#D1D5DB';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // Linha inferior 3
    const linhaInf3 = this.adicionarElemento('linha', 544, 930);
    if (linhaInf3) {
        const content = linhaInf3.querySelector('.element-content');
        content.style.width = '250px';
        content.style.height = '1px';
        content.style.background = '#9CA3AF';
        content.style.transform = 'rotate(-45deg)';
        content.style.transformOrigin = 'left center';
    }
    
    // ===== DATA =====
    const data = this.adicionarElemento('paragrafo', 480, 955);
    if (data) {
        const content = data.querySelector('.element-content');
        content.textContent = 'Montes Claros, Setembro de 2025';
        content.style.fontSize = '10pt';
        content.style.color = '#64748b';
        content.style.textAlign = 'right';
        content.style.width = '280px';
    }
    
    // ===== RODAPÉ =====
    const rodape = this.adicionarElemento('paragrafo', 40, 1010);
    if (rodape) {
        const content = rodape.querySelector('.element-content');
        content.innerHTML = '<strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>Endereço: AV. PROPRIEDADE, Nº 1413, DISTRITO INDUSTRIAL, Montes Claros - MG - CEP 39.404-0104<br>Fone: 38-3229-6200 - E-mails: azla@novonordisk.com, ivqc@novonordisk.com';
        content.style.fontSize = '7pt';
        content.style.color = '#000000';
        content.style.textAlign = 'left';
        content.style.width = '710px';
        content.style.lineHeight = '1.3';
    }
    
    console.log('✅ Template Novo Nordisk Diagonal aplicado!');
}
// ==================== TEMPLATE: DOCUMENTAÇÃO MINIMALISTA ====================
// ==================== TEMPLATE: DOCUMENTAÇÃO (EXATO DA IMAGEM) ====================
templateDocumentacaoMinimalista() {
    console.log('🎨 Aplicando Template: Documentação Minimalista');
    
    // ✅ Limpar canvas primeiro
    this.limparCanvas();
    
    // Background branco puro
    this.aplicarCorFundo('#ffffff');
    
    // ===== BARRA VERTICAL AZUL ESCURA (L invertido) =====
    const barraVertical = this.adicionarElemento('retangulo', 0, 0);
    if (barraVertical) {
        const content = barraVertical.querySelector('.element-content');
        content.style.width = '45px';
        content.style.height = '1123px';
        content.style.background = '#001F54';
        content.style.borderRadius = '0';
    }
    
    // ===== BARRA HORIZONTAL (parte do L) =====
    const barraHorizontal = this.adicionarElemento('retangulo', 45, 150);
    if (barraHorizontal) {
        const content = barraHorizontal.querySelector('.element-content');
        content.style.width = '170px';
        content.style.height = '45px';
        content.style.background = '#001F54';
        content.style.borderRadius = '0';
    }
    
    // ===== SETA AZUL COM DATA =====
    const setaData = this.adicionarElemento('retangulo', 105, 158);
    if (setaData) {
        const content = setaData.querySelector('.element-content');
        content.style.width = '140px';
        content.style.height = '30px';
        content.style.background = '#003087';
        content.style.borderRadius = '0';
        content.style.clipPath = 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)';
    }
    
    // ===== DATA DENTRO DA SETA =====
    const textoData = this.adicionarElemento('paragrafo', 122, 164);
    if (textoData) {
        const content = textoData.querySelector('.element-content');
        content.textContent = '8/12/2025';
        content.style.fontSize = '11pt';
        content.style.fontWeight = 'bold';
        content.style.color = 'white';
        content.style.textAlign = 'left';
        content.style.width = '100px';
        content.style.zIndex = '100';
        content.style.fontFamily = '"Arial", sans-serif';
    }
    
    // ===== TÍTULO "DOCUMENTAÇÃO" =====
    const titulo = this.adicionarElemento('titulo', 240, 155);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'DOCUMENTAÇÃO';
        content.style.fontSize = '3rem';
        content.style.fontWeight = '400';
        content.style.color = '#2c3e50';
        content.style.textAlign = 'left';
        content.style.width = '500px';
        content.style.letterSpacing = '2px';
        content.style.fontFamily = '"Arial", sans-serif';
        content.style.lineHeight = '1';
    }
    
    // ===== SUBTÍTULO "KPI de IUS Natura" =====
    const subtitulo = this.adicionarElemento('paragrafo', 280, 215);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'KPI de IUS Natura';
        content.style.fontSize = '13pt';
        content.style.color = '#5a6c7d';
        content.style.textAlign = 'left';
        content.style.width = '400px';
        content.style.fontWeight = 'normal';
        content.style.fontFamily = '"Arial", sans-serif';
    }
    
    // ===== CURVAS DECORATIVAS (canto inferior esquerdo) =====
    
    // Curva 1 - Azul escuro (mais grossa e curva)
    const curva1 = this.adicionarElemento('retangulo', 52, 700);
    if (curva1) {
        const content = curva1.querySelector('.element-content');
        content.style.width = '5px';
        content.style.height = '200px';
        content.style.background = '#001F54';
        content.style.borderRadius = '50px';
        content.style.transform = 'rotate(-25deg)';
        content.style.transformOrigin = 'bottom left';
    }
    
    // Curva 2 - Azul médio
    const curva2 = this.adicionarElemento('retangulo', 75, 720);
    if (curva2) {
        const content = curva2.querySelector('.element-content');
        content.style.width = '3px';
        content.style.height = '170px';
        content.style.background = '#003087';
        content.style.borderRadius = '50px';
        content.style.transform = 'rotate(-15deg)';
        content.style.transformOrigin = 'bottom left';
    }
    
    // Curva 3 - Cinza médio
    const curva3 = this.adicionarElemento('retangulo', 105, 745);
    if (curva3) {
        const content = curva3.querySelector('.element-content');
        content.style.width = '2px';
        content.style.height = '140px';
        content.style.background = '#b0b8c1';
        content.style.borderRadius = '50px';
        content.style.transform = 'rotate(-8deg)';
        content.style.transformOrigin = 'bottom left';
    }
    
    // Curva 4 - Cinza claro
    const curva4 = this.adicionarElemento('retangulo', 135, 765);
    if (curva4) {
        const content = curva4.querySelector('.element-content');
        content.style.width = '2px';
        content.style.height = '120px';
        content.style.background = '#d1d5db';
        content.style.borderRadius = '50px';
        content.style.transform = 'rotate(-3deg)';
        content.style.transformOrigin = 'bottom left';
    }
    
    // Curva 5 - Cinza muito claro
    const curva5 = this.adicionarElemento('retangulo', 165, 780);
    if (curva5) {
        const content = curva5.querySelector('.element-content');
        content.style.width = '1.5px';
        content.style.height = '105px';
        content.style.background = '#e5e7eb';
        content.style.borderRadius = '50px';
        content.style.transform = 'rotate(0deg)';
        content.style.transformOrigin = 'bottom left';
    }
    
    // ===== ASSINATURA (canto inferior direito) =====
    const nomeAutor = this.adicionarElemento('paragrafo', 450, 990);
    if (nomeAutor) {
        const content = nomeAutor.querySelector('.element-content');
        content.innerHTML = '<strong style="font-size: 10pt; color: #2c3e50; font-family: Arial, sans-serif;">EJCM (Emanuel Jose Maria do Carmo)</strong>';
        content.style.textAlign = 'right';
        content.style.width = '280px';
    }
    
    const cargoAutor = this.adicionarElemento('paragrafo', 450, 1013);
    if (cargoAutor) {
        const content = cargoAutor.querySelector('.element-content');
        content.innerHTML = '<span style="font-size: 9pt; color: #5a6c7d; font-family: Arial, sans-serif;">Aprendiz – EHS</span>';
        content.style.textAlign = 'right';
        content.style.width = '280px';
    }
    

}
// ==================== TEMPLATE 3: NOVO NORDISK EMPRESARIAL (baseado no Afya) ====================
templateAfyaRosa() {
    console.log('🎨 Aplicando Template: Novo Nordisk Empresarial');
     this.limparCanvas();
    // Background branco
    this.aplicarCorFundo('#ffffff');
    
    // ===== BARRA AZUL SUPERIOR =====
    const barraAzulSuperior = this.adicionarElemento('retangulo', 0, 0);
    if (barraAzulSuperior) {
        const content = barraAzulSuperior.querySelector('.element-content');
        content.style.width = '794px';
        content.style.height = '25px';
        content.style.background = 'linear-gradient(90deg, #003087 0%, #0056b3 100%)';
        content.style.borderRadius = '0';
    }
    
    // ===== LOGO NOVO NORDISK =====
    const logoNovoNordisk = this.adicionarElemento('imagem', 40, 60);
    if (logoNovoNordisk) {
        const content = logoNovoNordisk.querySelector('.element-content');
        content.style.width = '90px';
        content.style.height = '45px';
    }
    
    // ===== TEXTO DEPARTAMENTO =====
    const departamentoTexto = this.adicionarElemento('paragrafo', 145, 58);
    if (departamentoTexto) {
        const content = departamentoTexto.querySelector('.element-content');
        content.innerHTML = '<span style="font-size: 11pt; color: #003087; font-weight: 700; font-style: italic;">DEPARTAMENTO</span><br><span style="font-size: 11pt; color: #003087; font-weight: 700; font-style: italic;">DE QUALIDADE</span><br><span style="font-size: 11pt; color: #003087; font-weight: 700; font-style: italic;">E PRODUÇÃO</span><br><span style="font-size: 8pt; color: #000000; font-weight: 600;">MONTES CLAROS - MG</span>';
        content.style.textAlign = 'left';
        content.style.lineHeight = '1.2';
        content.style.width = '180px';
    }
    
    // ===== FORMA DIAGONAL AZUL CLARA (grande no canto direito) =====
    const formaAzulGrande = this.adicionarElemento('circulo', 600, 250);
    if (formaAzulGrande) {
        const content = formaAzulGrande.querySelector('.element-content');
        content.style.width = '450px';
        content.style.height = '450px';
        content.style.background = 'rgba(0, 48, 135, 0.12)';
        content.style.transform = 'translateX(100px)';
    }
    
    // ===== TÍTULO PRINCIPAL =====
    const titulo = this.adicionarElemento('titulo', 100, 370);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'RELATÓRIO DE GESTÃO E CONTROLE DE QUALIDADE';
        content.style.fontSize = '1.4rem';
        content.style.fontWeight = 'bold';
        content.style.color = '#000000';
        content.style.textAlign = 'left';
        content.style.width = '420px';
        content.style.lineHeight = '1.5';
    }
    
    // ===== SUBTÍTULO =====
    const subtitulo = this.adicionarElemento('paragrafo', 100, 500);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'PRODUÇÃO FARMACÊUTICA';
        content.style.fontSize = '1.1rem';
        content.style.fontWeight = 'bold';
        content.style.color = '#000000';
        content.style.textAlign = 'left';
    }
    
    // ===== CAMPOS ALINHADOS À DIREITA =====
    const campos = [
        { texto: 'Responsável:', y: 600 },
        { texto: 'Supervisor:', y: 640 },
        { texto: 'Período:', y: 680 },
        { texto: 'Turno:', y: 720 },
        { texto: 'Ano: 2025', y: 760 },
        { texto: 'Setor: Produção Industrial', y: 800 },
        { texto: 'Coordenador: [Nome do Coordenador]', y: 840 }
    ];
    
    campos.forEach(campo => {
        const elem = this.adicionarElemento('paragrafo', 380, campo.y);
        if (elem) {
            const content = elem.querySelector('.element-content');
            content.textContent = campo.texto;
            content.style.fontSize = '9pt';
            content.style.color = '#000000';
            content.style.textAlign = 'right';
            content.style.width = '350px';
        }
    });
    
    // ===== DATA RODAPÉ =====
    const dataLocal = this.adicionarElemento('paragrafo', 280, 940);
    if (dataLocal) {
        const content = dataLocal.querySelector('.element-content');
        content.textContent = 'Montes Claros / MG';
        content.style.fontSize = '10pt';
        content.style.color = '#000000';
        content.style.textAlign = 'center';
        content.style.fontWeight = 'normal';
    }
    
    const dataMes = this.adicionarElemento('paragrafo', 280, 970);
    if (dataMes) {
        const content = dataMes.querySelector('.element-content');
        content.textContent = 'Janeiro / 2025';
        content.style.fontSize = '10pt';
        content.style.color = '#000000';
        content.style.textAlign = 'center';
        content.style.fontWeight = 'normal';
    }
    
    // ===== LOGO NOVO NORDISK RODAPÉ =====
    const logoRodape = this.adicionarElemento('imagem', 40, 1025);
    if (logoRodape) {
        const content = logoRodape.querySelector('.element-content');
        content.style.width = '80px';
        content.style.height = '40px';
    }
    
    // ===== TEXTO PRODUÇÃO FARMACÊUTICA RODAPÉ =====
    const producaoFarma = this.adicionarElemento('paragrafo', 130, 1030);
    if (producaoFarma) {
        const content = producaoFarma.querySelector('.element-content');
        content.innerHTML = '<span style="color: #003087; font-weight: 700; font-style: italic;">NOVO</span><br><span style="color: #003087; font-weight: 700; font-style: italic;">NORDISK</span><br><span style="font-size: 7pt;">MONTES CLAROS - MG</span>';
        content.style.fontSize = '9pt';
        content.style.lineHeight = '1.1';
        content.style.textAlign = 'left';
    }
    
    // ===== ENDEREÇO RODAPÉ =====
    const endereco = this.adicionarElemento('paragrafo', 520, 1025);
    if (endereco) {
        const content = endereco.querySelector('.element-content');
        content.innerHTML = 'Avenida "C", nº 1.413<br>Distrito Industrial<br>CEP 39.404-004<br>Montes Claros - MG<br><br>☎ (38) 3229-6200';
        content.style.fontSize = '7pt';
        content.style.color = '#000000';
        content.style.textAlign = 'left';
        content.style.lineHeight = '1.4';
        content.style.width = '200px';
    }
    
    // ===== BARRA AZUL INFERIOR =====
    const barraAzulInferior = this.adicionarElemento('retangulo', 0, 1098);
    if (barraAzulInferior) {
        const content = barraAzulInferior.querySelector('.element-content');
        content.style.width = '794px';
        content.style.height = '25px';
        content.style.background = 'linear-gradient(90deg, #003087 0%, #0056b3 100%)';
        content.style.borderRadius = '0';
    }
    
    console.log('✅ Template Novo Nordisk Empresarial aplicado!');
}

// ==================== TEMPLATES AUXILIARES ====================

// ==================== TEMPLATE: CORPORATIVO COMPLETO ====================
templateCorporativo() {
    console.log('🎨 Aplicando Template: Corporativo');
     this.limparCanvas();
    // Gradiente azul corporativo
    this.aplicarGradiente('linear-gradient(135deg, #003087 0%, #0056b3 100%)');
    
    // ===== LOGO CENTRALIZADO NO TOPO =====
    const logo = this.adicionarElemento('imagem', 310, 100);
    if (logo) {
        const content = logo.querySelector('.element-content');
        content.style.width = '170px';
        content.style.height = '85px';
        content.style.zIndex = '100';
    }
    
    // ===== LINHA DECORATIVA DOURADA =====
    const linhaDourada = this.adicionarElemento('linha', 250, 220);
    if (linhaDourada) {
        const content = linhaDourada.querySelector('.element-content');
        content.style.width = '290px';
        content.style.height = '3px';
        content.style.background = 'linear-gradient(90deg, transparent, #FFD700, transparent)';
    }
    
    // ===== TÍTULO PRINCIPAL =====
    const titulo = this.adicionarElemento('titulo', 150, 450);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'RELATÓRIO EXECUTIVO';
        content.style.color = 'white';
        content.style.fontSize = '2.5rem';
        content.style.fontWeight = 'bold';
        content.style.textAlign = 'center';
        content.style.width = '500px';
        content.style.letterSpacing = '3px';
        content.style.textShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    }
    
    // ===== SUBTÍTULO =====
    const subtitulo = this.adicionarElemento('subtitulo', 150, 530);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'Gestão de Qualidade e Produção';
        content.style.color = 'rgba(255, 255, 255, 0.9)';
        content.style.fontSize = '1.2rem';
        content.style.textAlign = 'center';
        content.style.width = '500px';
        content.style.fontWeight = '400';
        content.style.letterSpacing = '1px';
    }
    
    // ===== LINHA DECORATIVA INFERIOR =====
    const linhaInferior = this.adicionarElemento('linha', 250, 600);
    if (linhaInferior) {
        const content = linhaInferior.querySelector('.element-content');
        content.style.width = '290px';
        content.style.height = '2px';
        content.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)';
    }
    
    // ===== RETÂNGULO DECORATIVO CANTO SUPERIOR ESQUERDO =====
    const detalheTopLeft = this.adicionarElemento('retangulo', 0, 0);
    if (detalheTopLeft) {
        const content = detalheTopLeft.querySelector('.element-content');
        content.style.width = '150px';
        content.style.height = '150px';
        content.style.background = 'rgba(255, 255, 255, 0.05)';
        content.style.borderRadius = '0 0 100px 0';
    }
    
    // ===== RETÂNGULO DECORATIVO CANTO INFERIOR DIREITO =====
    const detalheBottomRight = this.adicionarElemento('retangulo', 644, 973);
    if (detalheBottomRight) {
        const content = detalheBottomRight.querySelector('.element-content');
        content.style.width = '150px';
        content.style.height = '150px';
        content.style.background = 'rgba(255, 255, 255, 0.05)';
        content.style.borderRadius = '100px 0 0 0';
    }
    
    // ===== DATA =====
    const data = this.adicionarElemento('paragrafo', 280, 900);
    if (data) {
        const content = data.querySelector('.element-content');
        content.textContent = 'Montes Claros, 2025';
        content.style.fontSize = '12pt';
        content.style.color = 'rgba(255, 255, 255, 0.8)';
        content.style.textAlign = 'center';
        content.style.width = '240px';
        content.style.fontWeight = '500';
        content.style.letterSpacing = '1px';
    }
    
    // ===== TEXTO EMPRESA RODAPÉ =====
    const rodape = this.adicionarElemento('paragrafo', 150, 1000);
    if (rodape) {
        const content = rodape.querySelector('.element-content');
        content.innerHTML = '<strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong>';
        content.style.fontSize = '9pt';
        content.style.color = 'rgba(255, 255, 255, 0.7)';
        content.style.textAlign = 'center';
        content.style.width = '500px';
        content.style.letterSpacing = '0.5px';
    }
    
    console.log('✅ Template Corporativo aplicado!');
}

// ==================== TEMPLATE: MINIMALISTA COMPLETO ====================
templateMinimalista() {
    console.log('🎨 Aplicando Template: Minimalista');
     this.limparCanvas();
    // Background branco puro
    this.aplicarCorFundo('#ffffff');
    
    // ===== LINHA FINA NO TOPO =====
    const linhaTopoDireita = this.adicionarElemento('linha', 594, 80);
    if (linhaTopoDireita) {
        const content = linhaTopoDireita.querySelector('.element-content');
        content.style.width = '150px';
        content.style.height = '2px';
        content.style.background = '#003087';
    }
    
    // ===== PEQUENO QUADRADO DECORATIVO =====
    const quadradoDetalhe = this.adicionarElemento('retangulo', 554, 100);
    if (quadradoDetalhe) {
        const content = quadradoDetalhe.querySelector('.element-content');
        content.style.width = '30px';
        content.style.height = '30px';
        content.style.background = '#003087';
        content.style.borderRadius = '0';
    }
    
    // ===== TÍTULO MINIMALISTA CENTRALIZADO =====
    const titulo = this.adicionarElemento('titulo', 100, 450);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'RELATÓRIO';
        content.style.color = '#000000';
        content.style.fontSize = '4rem';
        content.style.fontWeight = '300';
        content.style.textAlign = 'center';
        content.style.width = '600px';
        content.style.letterSpacing = '15px';
        content.style.fontFamily = '"Helvetica Neue", Arial, sans-serif';
    }
    
    // ===== LINHA FINA ABAIXO DO TÍTULO =====
    const linhaAbaixoTitulo = this.adicionarElemento('linha', 320, 560);
    if (linhaAbaixoTitulo) {
        const content = linhaAbaixoTitulo.querySelector('.element-content');
        content.style.width = '150px';
        content.style.height = '1px';
        content.style.background = '#64748b';
    }
    
    // ===== SUBTÍTULO =====
    const subtitulo = this.adicionarElemento('paragrafo', 100, 600);
    if (subtitulo) {
        const content = subtitulo.querySelector('.element-content');
        content.textContent = 'Produção Farmacêutica';
        content.style.fontSize = '1rem';
        content.style.color = '#64748b';
        content.style.textAlign = 'center';
        content.style.width = '600px';
        content.style.fontWeight = '400';
        content.style.letterSpacing = '3px';
        content.style.textTransform = 'uppercase';
    }
    
    // ===== LOGO PEQUENO CENTRALIZADO =====
    const logo = this.adicionarElemento('imagem', 340, 220);
    if (logo) {
        const content = logo.querySelector('.element-content');
        content.style.width = '110px';
        content.style.height = '55px';
    }
    
    // ===== DATA MINIMALISTA =====
    const data = this.adicionarElemento('paragrafo', 280, 850);
    if (data) {
        const content = data.querySelector('.element-content');
        content.textContent = '2025';
        content.style.fontSize = '11pt';
        content.style.color = '#94a3b8';
        content.style.textAlign = 'center';
        content.style.width = '240px';
        content.style.fontWeight = '300';
        content.style.letterSpacing = '5px';
    }
    
    // ===== PEQUENO DETALHE INFERIOR ESQUERDO =====
    const detalheInferior = this.adicionarElemento('retangulo', 50, 1050);
    if (detalheInferior) {
        const content = detalheInferior.querySelector('.element-content');
        content.style.width = '60px';
        content.style.height = '2px';
        content.style.background = '#003087';
    }
    
    // ===== TEXTO EMPRESA (DISCRETO) =====
    const textoEmpresa = this.adicionarElemento('paragrafo', 50, 1060);
    if (textoEmpresa) {
        const content = textoEmpresa.querySelector('.element-content');
        content.textContent = 'Novo Nordisk';
        content.style.fontSize = '8pt';
        content.style.color = '#94a3b8';
        content.style.textAlign = 'left';
        content.style.fontWeight = '400';
        content.style.letterSpacing = '1px';
    }
    
    console.log('✅ Template Minimalista aplicado!');
}

templateMinimalista() {
     this.limparCanvas();
    this.aplicarCorFundo('#ffffff');
    
    const titulo = this.adicionarElemento('titulo', 100, 450);
    if (titulo) {
        const content = titulo.querySelector('.element-content');
        content.textContent = 'RELATÓRIO';
        content.style.color = '#000000';
        content.style.fontSize = '3.5rem';
        content.style.fontWeight = '300';
        content.style.letterSpacing = '10px';
    }
}
    iniciarArrastar(e, elementId) {
        if (e.button !== 0) return;
        
        const elemento = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!elemento) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.elementoSelecionado = elementId;
        this.selecionarElemento(elemento);
        elemento.classList.add('dragging');
        
        const rect = elemento.getBoundingClientRect();
        const parentRect = this.pageCover.getBoundingClientRect();
        
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.elementStartX = rect.left - parentRect.left;
        this.elementStartY = rect.top - parentRect.top;
        
        const onMouseMove = (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.dragStartX;
            const deltaY = e.clientY - this.dragStartY;
            
            let newX = this.elementStartX + deltaX;
            let newY = this.elementStartY + deltaY;
            
            newX = Math.max(0, Math.min(newX, parentRect.width - rect.width));
            newY = Math.max(0, Math.min(newY, parentRect.height - rect.height));
            
            elemento.style.left = newX + 'px';
            elemento.style.top = newY + 'px';
        };
        
        const onMouseUp = () => {
            this.isDragging = false;
            elemento.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.salvarEstado();
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    selecionarElemento(elemento) {
        this.desselecionarTodos();
        
        if (typeof elemento === 'string') {
            elemento = document.querySelector(`[data-element-id="${elemento}"]`);
        }
        
        if (elemento) {
            elemento.classList.add('selected');
            this.elementoSelecionado = elemento.dataset.elementId;
        }
    }

    desselecionarTodos() {
        document.querySelectorAll('.canvas-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.elementoSelecionado = null;
    }

    excluirElemento(elementId) {
        const elemento = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!elemento) return;
        
        elemento.style.transition = 'all 0.4s ease-out';
        elemento.style.opacity = '0';
        elemento.style.transform = 'scale(0.5) rotate(15deg)';
        
        setTimeout(() => {
            elemento.remove();
            this.elementos = this.elementos.filter(e => e.id !== elementId);
            this.elementoSelecionado = null;
            this.salvarEstado();
            this.atualizarIndicador();
        }, 400);
    }

    duplicarElemento(elementId) {
        if (!this.verificarInicializado()) return;
        
        const elemento = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!elemento) return;
        
        const tipo = elemento.dataset.tipo;
        const x = parseInt(elemento.style.left || 0) + 20;
        const y = parseInt(elemento.style.top || 0) + 20;
        
        const novoElemento = this.adicionarElemento(tipo, x, y);
        
        if (novoElemento) {
            const contentOriginal = elemento.querySelector('.element-content');
            const contentNovo = novoElemento.querySelector('.element-content');
            if (contentOriginal && contentNovo) {
                contentNovo.innerHTML = contentOriginal.innerHTML;
                contentNovo.style.cssText = contentOriginal.style.cssText;
            }
        }
    }

    enviarFrente(elementId) {
        const elemento = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!elemento) return;
        
        const zIndex = parseInt(elemento.style.zIndex || 10);
        elemento.style.zIndex = zIndex + 1;
        this.salvarEstado();
    }

    enviarFundo(elementId) {
        const elemento = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!elemento) return;
        
        const zIndex = parseInt(elemento.style.zIndex || 10);
        elemento.style.zIndex = Math.max(1, zIndex - 1);
        this.salvarEstado();
    }

    moverElementoTeclado(tecla) {
        const elemento = document.querySelector(`[data-element-id="${this.elementoSelecionado}"]`);
        if (!elemento) return;
        
        const step = 5;
        let left = parseInt(elemento.style.left) || 0;
        let top = parseInt(elemento.style.top) || 0;
        
        switch(tecla) {
            case 'ArrowLeft': left -= step; break;
            case 'ArrowRight': left += step; break;
            case 'ArrowUp': top -= step; break;
            case 'ArrowDown': top += step; break;
        }
        
        elemento.style.left = left + 'px';
        elemento.style.top = top + 'px';
        this.salvarEstado();
    }

    aplicarCorFundo(cor) {
        if (!this.verificarInicializado()) return;
        
        this.coverBackground.style.background = cor;
        this.coverBackground.style.backgroundImage = 'none';
        this.salvarEstado();
    }

    aplicarGradiente(gradiente) {
        if (!this.verificarInicializado()) return;
        
        this.coverBackground.style.background = gradiente;
        this.coverBackground.style.backgroundImage = gradiente;
        this.salvarEstado();
    }

    aplicarImagemFundo(imagemSrc) {
        if (!this.verificarInicializado()) return;
        
        this.coverBackground.style.backgroundImage = `url(${imagemSrc})`;
        this.coverBackground.style.backgroundSize = 'cover';
        this.coverBackground.style.backgroundPosition = 'center';
        this.salvarEstado();
    }

    ajustarOpacidadeFundo(valor) {
        if (!this.verificarInicializado()) return;
        
        this.coverBackground.style.opacity = valor / 100;
        const opacidadeValor = document.getElementById('opacidadeValor');
        if (opacidadeValor) opacidadeValor.textContent = valor + '%';
        this.salvarEstado();
    }

// ==================== CORRIGIR MÉTODO limparTudo ====================
limparTudo(semConfirmacao = false) {
    if (!this.verificarInicializado()) return;
    
    if (!semConfirmacao && !confirm('⚠️ Limpar capa?')) return;
    
    // ✅ LIMPAR COMPLETAMENTE O CANVAS
    this.coverCanvas.innerHTML = '';
    
    // ✅ LIMPAR BACKGROUND
    this.limparFundo();
    
    // ✅ RESETAR ARRAYS E CONTADORES
    this.elementos = [];
    this.elementoSelecionado = null;
    this.elementIdCounter = 0;
    
    // ✅ FORÇAR ATUALIZAÇÃO VISUAL
    this.atualizarIndicador();
    
    console.log('✅ Capa completamente limpa');
}

// ==================== CORRIGIR MÉTODO limparFundo ====================
limparFundo() {
    if (!this.verificarInicializado()) return;
    
    // ✅ RESETAR COMPLETAMENTE O BACKGROUND
    this.coverBackground.style.cssText = '';
    this.coverBackground.style.background = 'white';
    this.coverBackground.style.backgroundImage = 'none';
    this.coverBackground.style.opacity = '1';
    
    console.log('✅ Background resetado');
}

// ==================== CORREÇÃO DEFINITIVA: TEMPLATES DE CAPA ====================

// 1️⃣ Localize a função aplicarTemplate() no EditorCapaCanvas e SUBSTITUA por esta:

aplicarTemplate(nome) {
    if (!this.verificarInicializado()) {
        console.warn('⚠️ Editor não inicializado');
        return;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎨 APLICANDO TEMPLATE: ${nome}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ✅ PASSO 1: LIMPAR COMPLETAMENTE (SEM CONFIRMAÇÃO)
    console.log('🧹 Limpando capa...');
    this.limparTudo(true); // true = sem confirmação
    
    // ✅ PASSO 2: LIMPAR HTML PADRÃO DA CAPA
    this.limparHTMLPadraoDaCapa();
    
    // ✅ PASSO 3: AGUARDAR LIMPEZA COMPLETA
    setTimeout(() => {
        console.log('✅ Limpeza concluída, criando template...');
        
        // Aplicar template específico
        switch(nome) {
            case 'novo-nordisk-classico':
                this.templateNovoNordiskClassico();
                break;
            case 'novo-nordisk-geometrico':
                this.templateNovoNordiskGeometrico();
                break;
            case 'novo-nordisk-diagonal':
                this.templateNovoNordiskDiagonal();
                break;
            case 'documentacao-minimalista':
                this.templateDocumentacaoMinimalista();
                break;
            case 'afya-rosa':
                this.templateAfyaRosa();
                break;
            case 'corporativo':
                this.templateCorporativo();
                break;
            case 'minimalista':
                this.templateMinimalista();
                break;
            case 'vazio':
                console.log('✅ Template vazio aplicado');
                break;
            default:
                console.warn(`⚠️ Template desconhecido: ${nome}`);
        }
        
        // ✅ PASSO 4: SALVAR ESTADO
        this.salvarEstado();
        
        // ✅ PASSO 5: FORÇAR VISIBILIDADE DO CANVAS
        setTimeout(() => {
            this.forcarVisibilidadeCanvas();
        }, 200);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ TEMPLATE "${nome}" APLICADO!`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (sistema && sistema.mostrarToast) {
            sistema.mostrarToast('✅ Template aplicado com sucesso!', 'success');
        }
        
    }, 300);
}

// 2️⃣ ADICIONE ESTA NOVA FUNÇÃO para limpar o HTML padrão:

limparHTMLPadraoDaCapa() {
    console.log('🧹 Limpando HTML padrão da capa...');
    
    const pageCover = document.getElementById('pageCover');
    if (!pageCover) return;
    
    // ✅ REMOVER ELEMENTOS HTML ANTIGOS (que não sejam canvas)
    const elementosParaRemover = pageCover.querySelectorAll(
        'img:not(.canvas-element img), ' +
        'p:not(.canvas-element p), ' +
        'h1:not(.canvas-element h1), ' +
        'h2:not(.canvas-element h2), ' +
        'h3:not(.canvas-element h3), ' +
        'div.cover-content, ' +
        'div.cover-logo, ' +
        'div.cover-title, ' +
        'div.cover-subtitle, ' +
        'div.cover-info, ' +
        'div.cover-blue-band'
    );
    
    elementosParaRemover.forEach(el => {
        // Verificar se NÃO está dentro do canvas
        if (!el.closest('.cover-canvas') && !el.closest('#coverCanvas')) {
            console.log('   🗑️ Removendo:', el.className || el.tagName);
            el.remove();
        }
    });
    
    console.log('✅ HTML padrão removido');
}

// 3️⃣ ADICIONE ESTA FUNÇÃO para forçar visibilidade:

forcarVisibilidadeCanvas() {
    console.log('👁️ Forçando visibilidade do canvas...');
    
    if (!this.coverCanvas || !this.coverBackground) return;
    
    // ✅ GARANTIR Z-INDEX ALTO
    this.coverCanvas.style.position = 'absolute';
    this.coverCanvas.style.top = '0';
    this.coverCanvas.style.left = '0';
    this.coverCanvas.style.width = '100%';
    this.coverCanvas.style.height = '100%';
    this.coverCanvas.style.zIndex = '10';
    this.coverCanvas.style.pointerEvents = 'auto';
    
    this.coverBackground.style.position = 'absolute';
    this.coverBackground.style.top = '0';
    this.coverBackground.style.left = '0';
    this.coverBackground.style.width = '100%';
    this.coverBackground.style.height = '100%';
    this.coverBackground.style.zIndex = '5';
    
    // ✅ GARANTIR QUE ELEMENTOS CANVAS ESTEJAM VISÍVEIS
    const elementosCanvas = this.coverCanvas.querySelectorAll('.canvas-element');
    elementosCanvas.forEach(el => {
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
    });
    
    console.log(`✅ Canvas forçado (${elementosCanvas.length} elementos visíveis)`);
}

// 4️⃣ CORRIGIR A FUNÇÃO limparTudo():

limparTudo(semConfirmacao = false) {
    if (!this.verificarInicializado()) return;
    
    if (!semConfirmacao && !confirm('⚠️ Limpar capa?')) return;
    
    console.log('🧹 Limpando canvas completamente...');
    
    // ✅ LIMPAR COMPLETAMENTE O CANVAS
    this.coverCanvas.innerHTML = '';
    
    // ✅ RESETAR BACKGROUND
    this.coverBackground.style.cssText = '';
    this.coverBackground.style.background = 'white';
    this.coverBackground.style.backgroundImage = 'none';
    this.coverBackground.style.opacity = '1';
    
    // ✅ RESETAR ARRAYS E CONTADORES
    this.elementos = [];
    this.elementoSelecionado = null;
    this.elementIdCounter = 0;
    
    // ✅ FORÇAR ATUALIZAÇÃO VISUAL
    this.atualizarIndicador();
    
    console.log('✅ Canvas limpo completamente');
}

// ==================== ADICIONAR MÉTODO DE DEBUG ====================
verificarEstadoCapa() {
    console.log('🔍 DIAGNÓSTICO DA CAPA:');
    console.log('  Canvas HTML:', this.coverCanvas?.innerHTML?.length || 0, 'caracteres');
    console.log('  Elementos array:', this.elementos?.length || 0);
    console.log('  Background style:', this.coverBackground?.style?.cssText || 'vazio');
    console.log('  Elementos DOM:', this.coverCanvas?.children?.length || 0);
}

    salvarEstado() {
        if (!this.verificarInicializado()) return;
        
        const estado = {
            elementos: this.coverCanvas.innerHTML,
            background: this.coverBackground.style.cssText
        };
        
        this.historico = this.historico.slice(0, this.indiceHistorico + 1);
        this.historico.push(estado);
        this.indiceHistorico++;
        
        if (this.historico.length > 50) {
            this.historico.shift();
            this.indiceHistorico--;
        }
        
        this.salvarCapaLocalStorage();
    }

    salvarCapaLocalStorage() {
        if (!this.verificarInicializado()) return;
        
        try {
            const dados = {
                elementos: this.coverCanvas.innerHTML,
                background: this.coverBackground.style.cssText,
                timestamp: Date.now()
            };
            localStorage.setItem('capa-canvas-editor', JSON.stringify(dados));
        } catch (error) {
            console.warn('⚠️ Erro ao salvar:', error);
        }
    }

    carregarCapaSalva() {
        if (!this.verificarInicializado()) return;
        
        try {
            const dados = JSON.parse(localStorage.getItem('capa-canvas-editor'));
            if (dados) {
                this.coverCanvas.innerHTML = dados.elementos;
                this.coverBackground.style.cssText = dados.background;
                this.atualizarIndicador();
                console.log('✅ Capa restaurada');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar:', error);
        }
    }


    atualizarIndicador() {
        if (!this.verificarInicializado()) return;
        
        const temElementos = this.coverCanvas.children.length > 0;
        this.pageCover.classList.toggle('has-elements', temElementos);
    }

    desfazer() {
        if (this.indiceHistorico > 0) {
            this.indiceHistorico--;
            this.restaurarEstado(this.historico[this.indiceHistorico]);
        }
    }

    refazer() {
        if (this.indiceHistorico < this.historico.length - 1) {
            this.indiceHistorico++;
            this.restaurarEstado(this.historico[this.indiceHistorico]);
        }
    }

    restaurarEstado(estado) {
        if (!this.verificarInicializado()) return;
        this.coverCanvas.innerHTML = estado.elementos;
        this.coverBackground.style.cssText = estado.background;
        this.atualizarIndicador();
    }
}
// ==================== FUNÇÕES GLOBAIS ====================

let sidebarController;
let editorCapa;

window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando sistema...');
    
    sidebarController = new SidebarController();
    
    setTimeout(() => {
        editorCapa = new EditorCapaCanvas();
    }, 1000);
});

function fecharSidebar(lado) {
    if (sidebarController) sidebarController.fecharSidebar(lado);
}

function abrirAmbasSidebars() {
    if (sidebarController) sidebarController.abrirAmbas();
}

function adicionarElementoCapa(tipo) {
    if (editorCapa?.inicializado) {
        editorCapa.adicionarElemento(tipo);
    } else {
        console.warn('⚠️ Aguarde o editor carregar');
    }
}

function aplicarCorFundoCapa(cor) {
    if (editorCapa?.inicializado) editorCapa.aplicarCorFundo(cor);
}

function aplicarGradienteCapa(gradiente) {
    if (editorCapa?.inicializado) editorCapa.aplicarGradiente(gradiente);
}

function ajustarOpacidadeFundo(valor) {
    if (editorCapa?.inicializado) editorCapa.ajustarOpacidadeFundo(valor);
}

function limparFundoCapa() {
    if (editorCapa?.inicializado) editorCapa.limparFundo();
}

function aplicarTemplate(nome) {
    if (editorCapa?.inicializado) editorCapa.aplicarTemplate(nome);
}

function desfazerCapa() {
    if (editorCapa?.inicializado) editorCapa.desfazer();
}

function refazerCapa() {
    if (editorCapa?.inicializado) editorCapa.refazer();
}

function limparTudoCapa() {
    if (editorCapa?.inicializado) editorCapa.limparTudo();
}

function aplicarImagemFundoCapa() {
    if (!editorCapa?.inicializado) return;
    const input = document.getElementById('uploadBackgroundCapa');
    const file = input?.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => editorCapa.aplicarImagemFundo(e.target.result);
        reader.readAsDataURL(file);
    }
}

function adicionarImagemCapa() {
    if (!editorCapa?.inicializado) return;
    const input = document.getElementById('uploadImagemCapa');
    const file = input?.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const elemento = editorCapa.adicionarElemento('imagem');
            if (elemento) {
                const img = elemento.querySelector('img');
                if (img) img.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function adicionarLogoCapa() {
    if (!editorCapa?.inicializado) return;
    const input = document.getElementById('uploadLogoCapa');
    const file = input?.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const elemento = editorCapa.adicionarElemento('logo');
            if (elemento) {
                const img = elemento.querySelector('img');
                if (img) img.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function iniciarArrastar(event, tipo) {
    event.dataTransfer.setData('tipo', tipo);
}

function permitirSoltar(event) {
    event.preventDefault();
    const pageCover = document.getElementById('pageCover');
    if (pageCover) pageCover.classList.add('drag-over');
}

function removerDragOver(event) {
    const pageCover = document.getElementById('pageCover');
    if (pageCover) pageCover.classList.remove('drag-over');
}

function soltarElementoCapa(event) {
    event.preventDefault();
    removerDragOver(event);
    
    if (!editorCapa?.inicializado) return;
    
    const tipo = event.dataTransfer.getData('tipo');
    if (tipo) {
        const rect = document.getElementById('pageCover').getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        editorCapa.adicionarElemento(tipo, x, y);
    }
}

console.log('✅ Sistema carregado - Aguarde inicialização...');

// ==================== AUTO-CORREÇÃO DE ESTRUTURA ====================

(function autoCorrigirEstrutura() {
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const pageCover = document.getElementById('pageCover');
            
            if (!pageCover) {
                console.error('❌ pageCover não existe!');
                return;
            }
            
            // Verificar se já tem a estrutura canvas
            let coverCanvas = document.getElementById('coverCanvas');
            let coverBackground = document.getElementById('coverBackground');
            
            if (!coverCanvas || !coverBackground) {
                console.log('🔧 Criando estrutura canvas automaticamente...');
                
                // Salvar conteúdo antigo (se houver)
                const conteudoAntigo = pageCover.innerHTML;
                
                // Limpar
                pageCover.innerHTML = '';
                
                // Adicionar classes
                pageCover.classList.add('canvas-cover');
                
                // Criar background
                coverBackground = document.createElement('div');
                coverBackground.className = 'cover-background';
                coverBackground.id = 'coverBackground';
                pageCover.appendChild(coverBackground);
                
                // Criar canvas
                coverCanvas = document.createElement('div');
                coverCanvas.className = 'cover-canvas';
                coverCanvas.id = 'coverCanvas';
                pageCover.appendChild(coverCanvas);
                
                // Criar indicador
                const dropIndicator = document.createElement('div');
                dropIndicator.className = 'drop-indicator';
                dropIndicator.id = 'dropIndicator';
                dropIndicator.innerHTML = `
                    <i class="fas fa-hand-pointer"></i>
                    <p>🎨 Arraste elementos da sidebar</p>
                    <small style="display: block; margin-top: 0.5rem;">Pressione F1 para abrir o Editor</small>
                `;
                pageCover.appendChild(dropIndicator);
                
                // Adicionar eventos
                pageCover.ondrop = soltarElementoCapa;
                pageCover.ondragover = permitirSoltar;
                pageCover.ondragleave = removerDragOver;
                
                console.log('✅ Estrutura canvas criada!');
                console.log('✅ coverBackground:', document.getElementById('coverBackground'));
                console.log('✅ coverCanvas:', document.getElementById('coverCanvas'));
            }
        }, 500);
    });
})();


// ==================== SISTEMA DE ESCOLHA DE TEMA ==================== 

class GerenciadorDeTemas {
    constructor() {
        this.temaAtual = null;
        this.primeiroAcesso = !localStorage.getItem('tema-escolhido');
        this.init();
    }

    init() {
        if (this.primeiroAcesso) {
            this.mostrarModalEscolha();
        } else {
            this.carregarTemaArmazenado();
            this.criarBotaoTrocarTema();
        }
    }

    mostrarModalEscolha() {
        const modal = document.createElement('div');
        modal.className = 'theme-selector-modal';
        modal.innerHTML = `
            <div class="theme-selector-content">
                <div class="theme-selector-header">
                    <h2>
                        <i class="fas fa-palette"></i>
                        Bem-vindo!
                    </h2>
                    <p>Escolha o tema de sua preferência</p>
                </div>
                
                <div class="theme-options">
                    <div class="theme-option theme-option-dark" onclick="gerenciadorTemas.escolherTema('dark')">
                        <div class="theme-icon">
                            <i class="fas fa-moon"></i>
                        </div>
                        <div class="theme-name">Tema Escuro</div>
                        <div class="theme-description">
                            Ideal para trabalhar à noite<br>
                            Reduz cansaço visual
                        </div>
                        <span class="theme-badge">Recomendado</span>
                    </div>
                    
                    <div class="theme-option theme-option-light" onclick="gerenciadorTemas.escolherTema('light')">
                        <div class="theme-icon">
                            <i class="fas fa-sun"></i>
                        </div>
                        <div class="theme-name">Tema Claro</div>
                        <div class="theme-description">
                            Melhor visibilidade diurna<br>
                            Aparência tradicional
                        </div>
                    </div>
                </div>
                
                <div class="theme-selector-footer">
                    <p>
                        💡 <strong>Dica:</strong> Você pode trocar o tema a qualquer momento clicando no ícone 
                        <i class="fas fa-palette"></i> no canto superior direito
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animação de entrada
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    escolherTema(tema) {
        console.log(`🎨 Tema escolhido: ${tema}`);
        
        this.aplicarTema(tema);
        localStorage.setItem('tema-escolhido', tema);
        
        // Fechar modal com animação
        const modal = document.querySelector('.theme-selector-modal');
        if (modal) {
            modal.style.animation = 'fadeOutModal 0.4s ease-out';
            setTimeout(() => {
                modal.remove();
                this.criarBotaoTrocarTema();
                this.mostrarToastBoasVindas(tema);
            }, 400);
        }
    }

    aplicarTema(tema) {
        this.temaAtual = tema;
        
        if (tema === 'dark') {
            document.body.classList.remove('light-mode');
            console.log('🌙 Tema Escuro Ativado');
        } else {
            document.body.classList.add('light-mode');
            console.log('☀️ Tema Claro Ativado');
        }
    }

    carregarTemaArmazenado() {
        const temaSalvo = localStorage.getItem('tema-escolhido') || 'dark';
        this.aplicarTema(temaSalvo);
        console.log(`✅ Tema carregado: ${temaSalvo}`);
    }

    trocarTema() {
        const novoTema = this.temaAtual === 'dark' ? 'light' : 'dark';
        this.aplicarTema(novoTema);
        localStorage.setItem('tema-escolhido', novoTema);
        
        const emoji = novoTema === 'dark' ? '🌙' : '☀️';
        const nome = novoTema === 'dark' ? 'Escuro' : 'Claro';
        
        if (sistema) {
            sistema.mostrarToast(`${emoji} Tema ${nome} ativado!`, 'success');
        }
        
        console.log(`🔄 Tema trocado para: ${novoTema}`);
    }

    criarBotaoTrocarTema() {
        // Remover botão antigo se existir
        const btnAntigo = document.getElementById('themToggleBtn');
        if (btnAntigo) btnAntigo.remove();
        
        const btn = document.createElement('button');
        btn.id = 'themToggleBtn';
        btn.className = 'theme-toggle-btn';
        btn.innerHTML = '<i class="fas fa-palette"></i>';
        btn.onclick = () => this.trocarTema();
        btn.title = 'Trocar Tema (Claro/Escuro)';
        
        document.body.appendChild(btn);
    }

    mostrarToastBoasVindas(tema) {
        const emoji = tema === 'dark' ? '🌙' : '☀️';
        const nome = tema === 'dark' ? 'Escuro' : 'Claro';
        
        setTimeout(() => {
            if (sistema) {
                sistema.mostrarToast(`${emoji} Tema ${nome} ativado! Bem-vindo ao Sistema Universal de Relatórios!`, 'success');
            }
        }, 500);
    }

    resetarPreferencia() {
        localStorage.removeItem('tema-escolhido');
        location.reload();
    }
}

// ==================== INSTANCIAR GERENCIADOR ==================== 

let gerenciadorTemas;

window.addEventListener('DOMContentLoaded', () => {
    // Inicializar gerenciador de temas ANTES de tudo
    gerenciadorTemas = new GerenciadorDeTemas();
    console.log('🎨 Gerenciador de Temas Inicializado!');
});

// ==================== FUNÇÃO GLOBAL PARA RESETAR (OPCIONAL) ==================== 

function resetarTema() {
    if (confirm('🔄 Resetar preferência de tema?\n\nIsso fará o modal de escolha aparecer novamente.')) {
        localStorage.removeItem('tema-escolhido');
        location.reload();
    }
}

// ==================== SISTEMA DE MOVER ELEMENTOS NO DOCUMENTO ====================

class SistemaMoverElementos {
    constructor() {
        this.elementoAtual = null;
        this.controles = null;
        this.init();
    }

    init() {
        console.log('🎯 Sistema de Mover Elementos Inicializado');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Detectar clique em elementos editáveis
        document.addEventListener('click', (e) => {
            // Ignorar cliques nos controles
            if (e.target.closest('.element-move-controls')) {
                return;
            }

            // Elementos que podem ser movidos
            const elemento = e.target.closest(
                '.editable-text, .editable-table, table, .editable-list, ul, ol, ' +
                '.photo-item, .photo-group-container, .editable-photo, blockquote, ' +
                'h2, h3, h4, p'
            );

            // Verificar se está dentro de uma página de conteúdo
            const dentroDeConteudo = elemento?.closest('.editable-content');
            const naoCapa = !elemento?.closest('.page-cover, .cover-canvas');

            if (elemento && dentroDeConteudo && naoCapa) {
                e.stopPropagation();
                this.selecionarElemento(elemento);
            } else {
                this.desselecionarElemento();
            }
        });

        // Fechar seleção ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.element-selected') && 
                !e.target.closest('.element-move-controls')) {
                this.desselecionarElemento();
            }
        });

        // Atalho ESC para desselecionar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.desselecionarElemento();
            }
        });
    }

    selecionarElemento(elemento) {
        // Remover seleção anterior
        this.desselecionarElemento();

        // Adicionar classe de seleção
        elemento.classList.add('element-selected');
        this.elementoAtual = elemento;

        // Criar controles se não existirem
        if (!this.controles) {
            this.criarControles();
        }

        // Adicionar controles ao elemento
        elemento.appendChild(this.controles);

        // Atualizar estado dos botões
        this.atualizarBotoes();

        console.log('✅ Elemento selecionado:', elemento.tagName);
    }

    desselecionarElemento() {
        if (this.elementoAtual) {
            this.elementoAtual.classList.remove('element-selected');
            
            // Remover controles
            if (this.controles && this.controles.parentNode) {
                this.controles.remove();
            }
            
            this.elementoAtual = null;
        }
    }

    criarControles() {
        const div = document.createElement('div');
        div.className = 'element-move-controls';
        div.innerHTML = `
            <button class="move-btn move-up-btn" data-tooltip="Mover para Cima">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="move-btn move-down-btn" data-tooltip="Mover para Baixo">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button class="close-selection-btn" data-tooltip="Fechar">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Event Listeners
        div.querySelector('.move-up-btn').addEventListener('click', () => this.moverParaCima());
        div.querySelector('.move-down-btn').addEventListener('click', () => this.moverParaBaixo());
        div.querySelector('.close-selection-btn').addEventListener('click', () => this.desselecionarElemento());

        this.controles = div;
    }

    atualizarBotoes() {
        if (!this.elementoAtual || !this.controles) return;

        const btnCima = this.controles.querySelector('.move-up-btn');
        const btnBaixo = this.controles.querySelector('.move-down-btn');

        // Verificar se pode mover para cima
        const anterior = this.getElementoAnterior();
        btnCima.disabled = !anterior;

        // Verificar se pode mover para baixo
        const proximo = this.getProximoElemento();
        btnBaixo.disabled = !proximo;
    }

    getElementoAnterior() {
        if (!this.elementoAtual) return null;

        let anterior = this.elementoAtual.previousElementSibling;
        
        // Pular elementos do rodapé
        while (anterior && 
               (anterior.classList.contains('page-footer') || 
                anterior.classList.contains('page-counter-badge') ||
                anterior.classList.contains('delete-page-button'))) {
            anterior = anterior.previousElementSibling;
        }

        return anterior;
    }

    getProximoElemento() {
        if (!this.elementoAtual) return null;

        let proximo = this.elementoAtual.nextElementSibling;
        
        // Pular elementos do rodapé
        while (proximo && 
               (proximo.classList.contains('page-footer') || 
                proximo.classList.contains('page-counter-badge') ||
                proximo.classList.contains('delete-page-button'))) {
            proximo = proximo.nextElementSibling;
        }

        return proximo;
    }

    moverParaCima() {
        const anterior = this.getElementoAnterior();
        
        if (!anterior) {
            sistema.mostrarToast('⚠️ Já está no topo!', 'warning');
            return;
        }

        // Animação
        this.elementoAtual.classList.add('moving-animation');

        // Mover elemento
        anterior.parentNode.insertBefore(this.elementoAtual, anterior);

        // Atualizar botões
        setTimeout(() => {
            this.atualizarBotoes();
            this.elementoAtual.classList.remove('moving-animation');
            
            // Scroll suave
            this.elementoAtual.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);

        // Salvar alterações
        if (sistema) {
            sistema.salvarDados();
        }

        sistema.mostrarToast('⬆️ Elemento movido para cima!', 'success');
        console.log('⬆️ Elemento movido para cima');
    }

    moverParaBaixo() {
        const proximo = this.getProximoElemento();
        
        if (!proximo) {
            sistema.mostrarToast('⚠️ Já está no final!', 'warning');
            return;
        }

        // Animação
        this.elementoAtual.classList.add('moving-animation');

        // Mover elemento
        if (proximo.nextSibling) {
            proximo.parentNode.insertBefore(this.elementoAtual, proximo.nextSibling);
        } else {
            proximo.parentNode.appendChild(this.elementoAtual);
        }

        // Atualizar botões
        setTimeout(() => {
            this.atualizarBotoes();
            this.elementoAtual.classList.remove('moving-animation');
            
            // Scroll suave
            this.elementoAtual.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);

        // Salvar alterações
        if (sistema) {
            sistema.salvarDados();
        }

        sistema.mostrarToast('⬇️ Elemento movido para baixo!', 'success');
        console.log('⬇️ Elemento movido para baixo');
    }
}

// ==================== INICIALIZAR SISTEMA ====================
let sistemaMover;

window.addEventListener('DOMContentLoaded', () => {
    sistemaMover = new SistemaMoverElementos();
    console.log('✅ Sistema de Mover Elementos Ativado!');
});

console.log('📄 Script de Mover Elementos Carregado!');

// ==================== CORREÇÃO: INICIALIZAÇÃO SEGURA ====================

(function inicializacaoSegura() {
    // 1️⃣ Verificar se DOM está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarSistema);
    } else {
        iniciarSistema();
    }
    
    function iniciarSistema() {
        console.log('🚀 Iniciando Sistema Universal de Relatórios...');
        
        // 2️⃣ Verificar elementos críticos
        const elementosCriticos = [
            'previewContainer',
            'pageCover',
            'coverCanvas',
            'coverBackground'
        ];
        
        let tentativas = 0;
        const maxTentativas = 10;
        
        function verificarElementos() {
            tentativas++;
            
            const todosPresentes = elementosCriticos.every(id => {
                const elemento = document.getElementById(id);
                if (!elemento) {
                    console.warn(`⚠️ Elemento "${id}" não encontrado (tentativa ${tentativas}/${maxTentativas})`);
                    return false;
                }
                return true;
            });
            
            if (todosPresentes) {
                console.log('✅ Todos os elementos críticos encontrados!');
                inicializarSistemas();
            } else if (tentativas < maxTentativas) {
                console.log(`⏳ Aguardando elementos... (${tentativas}/${maxTentativas})`);
                setTimeout(verificarElementos, 500);
            } else {
                console.error('❌ ERRO CRÍTICO: Elementos não encontrados após 10 tentativas!');
                mostrarErroInicial();
            }
        }
        
        verificarElementos();
    }
    
    function inicializarSistemas() {
        // 3️⃣ Fechar modais abertos
        fecharTodosModais();
        
        // 4️⃣ Limpar seleções
        limparSelecoes();
        
        // 5️⃣ Resetar estado visual
        resetarEstadoVisual();
        
        // 6️⃣ Carregar dados salvos ou criar estrutura padrão
        setTimeout(() => {
if (typeof SistemaRelatorios !== 'undefined') {
    const originalSalvarDados = SistemaRelatorios.prototype.salvarDados;
    
    SistemaRelatorios.prototype.salvarDados = function() {
        // Não salvar no localStorage
        if (fileManager && fileManager.isInitialized) {
            fileManager.markAsUnsaved();
            console.log('💾 Documento marcado como não salvo');
        } else {
            // Fallback para localStorage se FileManager não estiver pronto
            originalSalvarDados.call(this);
        }
    };
    
    SistemaRelatorios.prototype.carregarDadosSalvos = function() {
        // Não carregar do localStorage
        console.log('ℹ️ Carregamento via FileManager (não usa localStorage)');
        return false;
    };
}

        }, 1000);
        
        console.log('✅ Sistema inicializado com sucesso!');
    }

    
    
    function fecharTodosModais() {
        // Fechar todos os modais Bootstrap abertos
        const modaisAbertos = document.querySelectorAll('.modal.show');
        modaisAbertos.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        
        // Remover backdrops órfãos
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.remove();
        });
        
        // Remover classe do body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        console.log('✅ Modais fechados');
    }
    
    function limparSelecoes() {
        // Limpar seleções múltiplas
        document.querySelectorAll('.multi-selected').forEach(el => {
            el.classList.remove('multi-selected');
        });
        
        // Limpar elementos selecionados
        document.querySelectorAll('.element-selected').forEach(el => {
            el.classList.remove('element-selected');
        });
        
        // Limpar seleção de exclusão
        document.querySelectorAll('.selected-for-delete').forEach(el => {
            el.classList.remove('selected-for-delete');
        });
        
        console.log('✅ Seleções limpas');
    }
    
    function resetarEstadoVisual() {
        // Fechar sidebars
        const leftSidebar = document.getElementById('leftSidebar');
        const rightSidebar = document.getElementById('rightSidebar');
        
        if (leftSidebar) leftSidebar.classList.remove('active');
        if (rightSidebar) rightSidebar.classList.remove('active');
        
        // Remover overlay
        document.querySelectorAll('.sidebar-overlay').forEach(overlay => {
            overlay.remove();
        });
        
        // Resetar toolbar de seleção múltipla
        const toolbar = document.getElementById('multiSelectionToolbar');
        if (toolbar) toolbar.classList.remove('active');
        
        // Resetar indicador de modo seleção
        const indicator = document.getElementById('selectionModeIndicator');
        if (indicator) indicator.classList.remove('active');
        
        console.log('✅ Estado visual resetado');
    }
    
    function criarEstruturaInicial() {
        const previewContainer = document.getElementById('previewContainer');
        if (!previewContainer) return;
        
        // Verificar se já tem conteúdo
        const paginasExistentes = previewContainer.querySelectorAll('.page-content');
        if (paginasExistentes.length > 2) {
            console.log('✅ Estrutura já existe');
            return;
        }
        
        // Garantir que capa e sumário existem
        const pageCover = document.getElementById('pageCover');
        const pageSumario = document.getElementById('pageSumario');
        
        if (!pageCover || !pageSumario) {
            console.error('❌ Capa ou Sumário não encontrados!');
            location.reload(); // Recarregar se estrutura crítica está faltando
            return;
        }
        
        console.log('✅ Estrutura inicial validada');
    }
    
function mostrarErroInicial() {
    // ✅ VERIFICAR SE JÁ TENTOU RECARREGAR
    const tentativasReload = parseInt(sessionStorage.getItem('reloadAttempts') || '0');
    
    if (tentativasReload >= 3) {
        // Parar de tentar após 3 reloads
        alert('❌ Erro crítico: Sistema não consegue carregar. Entre em contato com o suporte.');
        sessionStorage.removeItem('reloadAttempts');
        return; // ⚠️ NÃO RECARREGAR MAIS
    }
    
    sessionStorage.setItem('reloadAttempts', (tentativasReload + 1).toString());
    
    // Agora sim, recarregar
    setTimeout(() => {
        location.reload();
    }, 1000);
}
})();

function fecharModalTabela() {
    const overlay = document.getElementById('modalTabelaOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}
function fecharModalImagem() {
    const overlay = document.getElementById('modalImagemOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}
function fecharModalUploadMultiplo() {
    const overlay = document.getElementById('modalUploadMultiploOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}
function confirmarTabelaSeguro() {
    console.log('📋 Confirmando tabela...');
    
    try {
        const linhas = parseInt(document.getElementById('tabelaLinhas').value);
        const colunas = parseInt(document.getElementById('tabelaColunas').value);
        
        if (isNaN(linhas) || isNaN(colunas) || linhas < 1 || colunas < 1) {
            alert('⚠️ Valores inválidos!');
            return;
        }
        
        console.log(`📊 Criando tabela ${linhas}x${colunas}`);
        
        // ✅ CRIAR WRAPPER (para isolar a tabela)
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.margin = '1.5rem 0';
        
        // ✅ CRIAR TABELA
        const tabela = document.createElement('table');
        tabela.className = 'editable-table';
        
        // ✅ CAPTION (LEGENDA) - FORA DA ESTRUTURA DA TABELA
        const caption = document.createElement('caption');
        caption.className = 'editable-text';
        caption.contentEditable = true;
        caption.textContent = `Tabela ${sistema?.tableCounter || 1} - Título da Tabela`;
        caption.style.captionSide = 'top'; // ✅ FORÇAR ACIMA
        caption.style.marginBottom = '0.75rem'; // ✅ ESPAÇO
        
        tabela.appendChild(caption);
        
        if (sistema) sistema.tableCounter++;
        
        // ✅ THEAD (CABEÇALHO AZUL)
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        for (let j = 0; j < colunas; j++) {
            const th = document.createElement('th');
            th.contentEditable = true;
            th.textContent = `Coluna ${j + 1}`;
            trHead.appendChild(th);
        }
        
        thead.appendChild(trHead);
        tabela.appendChild(thead);
        
        // ✅ TBODY (DADOS) - CORRIGIDO: USAR O NÚMERO CORRETO DE LINHAS
        const tbody = document.createElement('tbody');
        
        // ✅ PROBLEMA ENCONTRADO: Loop deve ser até "linhas", não hardcoded
        for (let i = 0; i < linhas; i++) { // ✅ USAR A VARIÁVEL "linhas"
            const tr = document.createElement('tr');
            
            for (let j = 0; j < colunas; j++) {
                const td = document.createElement('td');
                td.contentEditable = true;
                td.textContent = 'Dado';
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        }
        
        tabela.appendChild(tbody);
        
        // ✅ ADICIONAR BOTÃO DE EXCLUSÃO NO WRAPPER
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-element-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Excluir tabela';
        
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('🗑️ Excluir esta tabela?')) {
                wrapper.style.transition = 'all 0.3s ease';
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    wrapper.remove();
                    if (sistema?.salvarDados) sistema.salvarDados();
                    if (sistema?.mostrarToast) sistema.mostrarToast('🗑️ Tabela excluída!', 'success');
                }, 300);
            }
        };
        
        wrapper.appendChild(deleteBtn);
        
        // ✅ ADICIONAR TABELA AO WRAPPER
        wrapper.appendChild(tabela);
        
        // ✅ INSERIR NO DOCUMENTO
        let editableContent = null;
        
        // Buscar local correto
        if (sistema?.clickPosition?.paginaClicada) {
            editableContent = sistema.clickPosition.paginaClicada.querySelector('.editable-content');
        }
        
        if (!editableContent) {
            const ultimaPagina = document.querySelector('.page-content:last-of-type');
            editableContent = ultimaPagina?.querySelector('.editable-content');
        }
        
        if (!editableContent) {
            console.error('❌ Local de inserção não encontrado');
            alert('❌ Erro: Não foi possível encontrar onde inserir a tabela.');
            return;
        }
        
        // ✅ INSERIR WRAPPER
        if (sistema?.clickPosition?.element && sistema.clickPosition.inserirAntes) {
            editableContent.insertBefore(wrapper, sistema.clickPosition.element);
        } else {
            editableContent.appendChild(wrapper);
        }
        
        console.log('✅ Tabela inserida com sucesso');
        
        // ✅ FECHAR MODAL
        fecharModalTabelaSeguro();
        
        // ✅ SALVAR
        if (sistema?.salvarDados) {
            setTimeout(() => sistema.salvarDados(), 500);
        }
        
        // ✅ TOAST
        if (sistema?.mostrarToast) {
            sistema.mostrarToast(`✅ Tabela ${linhas}x${colunas} inserida!`, 'success');
        }
        
        // ✅ SCROLL SUAVE
        setTimeout(() => {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('❌ Erro ao inserir tabela: ' + error.message);
    }
}

// ==================== INICIALIZAÇÃO ====================
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Sistema Universal de Relatórios...');
    
    // Aguardar 500ms para garantir que todo DOM está pronto
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Inicializar FileManager
    fileManager = new FileManager();
    await fileManager.init();
    
    console.log('✅ Sistema completo inicializado!');
});

// Exportar para uso global
window.fileManager = fileManager;


let sistema;
let divisorDeElementos;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistema);
} else {
    inicializarSistema();
}

function inicializarSistema() {
    console.log('🚀 Inicializando Sistema...');
    
    try {
        sistema = new SistemaRelatorios();
        console.log('✅ Sistema inicializado:', sistema);
    } catch (error) {
        console.error('❌ Erro ao criar SistemaRelatorios:', error);
    }
    
    try {
        divisorDeElementos = new DivisorDeElementos();
        console.log('✅ Divisor inicializado');
    } catch (error) {
        console.error('❌ Erro ao criar DivisorDeElementos:', error);
    }
}

// ==================== SISTEMA DE ABAS MANUAL (SEM BOOTSTRAP) ====================

function trocarAbaEditor(abaId) {
    console.log(`🔄 Trocando para aba: ${abaId}`);
    
    // 1️⃣ Desativar TODOS os botões
    document.querySelectorAll('#editorTabs .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 2️⃣ Ocultar TODOS os painéis
    document.querySelectorAll('#editorTabContent .tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });
    
    // 3️⃣ Ativar APENAS o botão clicado
    const btnAtivo = document.querySelector(`#editorTabs button[data-bs-target="#${abaId}"]`);
    if (btnAtivo) {
        btnAtivo.classList.add('active');
        console.log(`✅ Botão "${abaId}" ativado`);
    } else {
        console.error(`❌ Botão para "${abaId}" não encontrado!`);
    }
    
    // 4️⃣ Mostrar APENAS o painel correspondente
    const paneAtivo = document.getElementById(abaId);
    if (paneAtivo) {
        // Forçar reflow para animação funcionar
        void paneAtivo.offsetWidth;
        
        paneAtivo.classList.add('show', 'active');
        console.log(`✅ Painel "${abaId}" exibido`);
    } else {
        console.error(`❌ Painel "${abaId}" não encontrado!`);
    }
}

// ==================== INICIALIZAÇÃO ====================

window.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Inicializando sistema de abas manual...');
    
    // Aguardar 300ms para garantir que DOM está pronto
    setTimeout(() => {
        const botoes = document.querySelectorAll('#editorTabs button[data-bs-toggle="tab"]');
        
        if (botoes.length === 0) {
            console.error('❌ Nenhum botão de aba encontrado!');
            return;
        }
        
        console.log(`📋 ${botoes.length} botões de aba encontrados`);
        
        // Adicionar event listener em cada botão
        botoes.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Pegar o ID do painel (remover o #)
                const targetId = btn.getAttribute('data-bs-target').replace('#', '');
                trocarAbaEditor(targetId);
            });
            
            console.log(`✅ Listener adicionado: ${btn.textContent.trim()}`);
        });
        
        // 🎯 GARANTIR que apenas "Elementos" está visível inicialmente
        trocarAbaEditor('elementos');
        
        console.log('✅ Sistema de abas ativado com sucesso!');
        
    }, 300);
});

// ==================== MONITORAMENTO AUTOMÁTICO SEM BLOQUEIOS ====================

class MonitorQuebraAutomatica {
    constructor() {
        this.processando = false;
        this.intervalo = null;
        this.iniciar();
    }

    iniciar() {
        console.log('🚀 Monitor de Quebra Automática ATIVADO (sem bloqueios)');
        
        // Monitorar digitação
        document.addEventListener('input', (e) => {
            if (e.target.contentEditable === 'true' || e.target.isContentEditable) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.verificarTodasPaginas();
                }, 800); // 800ms após parar de digitar
            }
        });
        
        // Verificação periódica (a cada 5 segundos)
        this.intervalo = setInterval(() => {
            if (!this.processando) {
                this.verificarTodasPaginas();
            }
        }, 5000);
        
        console.log('✅ Monitoramento iniciado (verifica a cada 5s + após digitação)');
    }

    verificarTodasPaginas() {
        if (this.processando) return;
        
        const paginas = document.querySelectorAll('.page-content:not(.page-cover)');
        
        paginas.forEach(pagina => {
            this.verificarPagina(pagina);
        });
    }

    verificarPagina(pagina) {
        const editableContent = pagina.querySelector('.editable-content');
        const rodape = pagina.querySelector('.page-footer');
        
        if (!editableContent || !rodape) return;
        
        // Forçar reflow
        editableContent.offsetHeight;
        rodape.offsetTop;
        
        const paginaRect = pagina.getBoundingClientRect();
        const rodapeRect = rodape.getBoundingClientRect();
        const limiteSeguro = rodapeRect.top - paginaRect.top - 40; // 40px margem
        
        // Verificar cada elemento
        const elementos = Array.from(editableContent.children).filter(el => {
            return el.tagName && 
                   !el.classList.contains('page-footer') &&
                   !el.classList.contains('delete-page-button') &&
                   !el.classList.contains('page-counter-badge');
        });
        
        elementos.forEach(elemento => {
            this.verificarElemento(elemento, limiteSeguro, paginaRect, pagina);
        });
    }

    verificarElemento(elemento, limiteSeguro, paginaRect, pagina) {
        elemento.offsetHeight; // Force reflow
        
        const elementoRect = elemento.getBoundingClientRect();
        const elementoBottom = elementoRect.bottom - paginaRect.top;
        
        if (elementoBottom > limiteSeguro) {
            console.log(`⚠️ Elemento ultrapassou limite: ${elemento.className}`);
            console.log(`   Bottom: ${elementoBottom.toFixed(0)}px > Limite: ${limiteSeguro.toFixed(0)}px`);
            
            this.quebrarElementoAutomaticamente(elemento, limiteSeguro, paginaRect, pagina);
        }
    }

    quebrarElementoAutomaticamente(elemento, limiteSeguro, paginaRect, pagina) {
        this.processando = true;
        
        // ✅ SMART PARAGRAPH (novo sistema)
        if (elemento.classList.contains('smart-paragraph')) {
            this.quebrarSmartParagraph(elemento, limiteSeguro, paginaRect, pagina);
        }
        // ✅ PARÁGRAFO NORMAL (antigo)
        else if (elemento.tagName === 'P') {
            this.quebrarParagrafoNormal(elemento, limiteSeguro, paginaRect, pagina);
        }
        // ✅ GRUPO DE FOTOS
        else if (elemento.classList.contains('photo-group-container')) {
            this.quebrarGrupoDeFotos(elemento, pagina);
        }
        // ✅ LISTA
        else if (elemento.tagName === 'UL' || elemento.tagName === 'OL') {
            this.quebrarLista(elemento, limiteSeguro, paginaRect, pagina);
        }
        // ✅ TABELA ou ELEMENTO INDIVISÍVEL
        else {
            this.moverElementoCompleto(elemento, pagina);
        }
        
        setTimeout(() => {
            this.processando = false;
        }, 300);
    }

quebrarSmartParagraph(elemento, limiteSeguro, paginaRect, pagina) {
    const content = elemento.querySelector('.smart-paragraph-content');
    if (!content) return;
    
    const texto = content.textContent.trim();
    const palavras = texto.split(/\s+/).filter(p => p.length > 0);
    
    if (palavras.length === 0) return;
    
    console.log(`✂️ Quebrando smart paragraph (${palavras.length} palavras)`);
    
    // ✅ SALVAR POSIÇÃO DO CURSOR ANTES DA QUEBRA
    const selection = window.getSelection();
    const cursorNoFinal = selection.rangeCount > 0 && 
                          selection.getRangeAt(0).endOffset === content.textContent.length;
    
    console.log(`📍 Cursor estava no final? ${cursorNoFinal ? 'SIM' : 'NÃO'}`);
    
    // Descobrir quantas palavras cabem
    let palavrasQueCabem = 0;
    
    for (let i = 1; i <= palavras.length; i++) {
        const teste = palavras.slice(0, i).join(' ');
        content.textContent = teste;
        content.offsetHeight;
        
        const testeRect = content.getBoundingClientRect();
        const testeBottom = testeRect.bottom - paginaRect.top;
        
        if (testeBottom > limiteSeguro) {
            break;
        }
        
        palavrasQueCabem = i;
    }
    
    console.log(`   Cabem: ${palavrasQueCabem} palavras`);
    
    if (palavrasQueCabem === 0) {
        content.textContent = texto;
        this.moverElementoCompleto(elemento, pagina);
        return;
    }
    
    if (palavrasQueCabem >= palavras.length) {
        content.textContent = texto;
        return; // Tudo cabe
    }
    
    // Separar texto
    const textoAtual = palavras.slice(0, palavrasQueCabem).join(' ');
    const textoProximo = palavras.slice(palavrasQueCabem).join(' ');
    
    // Atualizar texto atual
    content.textContent = textoAtual;
    
    // Criar próxima página se necessário
    let proximaPagina = this.obterOuCriarProximaPagina(pagina);
    const proximoConteudo = proximaPagina.querySelector('.editable-content');
    
    if (!proximoConteudo) {
        console.error('❌ Erro ao obter próximo conteúdo');
        return;
    }
    
    // Criar novo parágrafo com texto restante
    const novoParagrafo = document.createElement('div');
    novoParagrafo.className = 'smart-paragraph';
    novoParagrafo.dataset.tipo = 'smart-paragraph';
    
    const novoContent = document.createElement('div');
    novoContent.className = 'smart-paragraph-content';
    novoContent.contentEditable = true;
    novoContent.textContent = textoProximo;
    
    novoParagrafo.appendChild(novoContent);
    
    // Inserir no início
    proximoConteudo.insertBefore(novoParagrafo, proximoConteudo.firstChild);
    
    console.log(`✅ Parágrafo quebrado`);
    
    // ✅ SE CURSOR ESTAVA NO FINAL, MOVER PARA O NOVO PARÁGRAFO
    if (cursorNoFinal) {
        console.log('🎯 Movendo cursor para o novo parágrafo...');
        
        setTimeout(() => {
            if (gerenciadorColagem) {
                gerenciadorColagem.moverCursorParaFinalDoElemento(novoContent);
            }
        }, 200);
    }
    
    if (sistema && sistema.salvarDados) {
        sistema.salvarDados();
    }
}
moverCursorParaFinalDoElemento(elemento) {
    console.log('🎯 Movendo cursor DIRETAMENTE para o final...');
    
    // ✅ USAR requestAnimationFrame para sincronizar com renderização
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            try {
                // ✅ NÃO FOCAR AINDA - isso causa o "pulo"
                // elemento.focus(); // ❌ REMOVER ISTO
                
                const selection = window.getSelection();
                const range = document.createRange();
                
                // ✅ LIMPAR SELEÇÃO IMEDIATAMENTE
                selection.removeAllRanges();
                
                // ✅ PEGAR ÚLTIMO NÓ DE TEXTO
                const walker = document.createTreeWalker(
                    elemento,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let ultimoTextoNode = null;
                while (walker.nextNode()) {
                    ultimoTextoNode = walker.currentNode;
                }
                
                if (ultimoTextoNode) {
                    // ✅ POSICIONAR NO FINAL DO ÚLTIMO NÓ
                    const tamanho = ultimoTextoNode.length;
                    range.setStart(ultimoTextoNode, tamanho);
                    range.setEnd(ultimoTextoNode, tamanho);
                    
                    console.log(`✅ Range criado: posição ${tamanho}`);
                } else {
                    // ✅ FALLBACK: collapse no final
                    range.selectNodeContents(elemento);
                    range.collapse(false); // false = FINAL
                    
                    console.log('⚠️ Usado fallback (collapse)');
                }
                
                // ✅ APLICAR RANGE ANTES DE FOCAR
                selection.addRange(range);
                
                // ✅ AGORA SIM, FOCAR (cursor já está no lugar)
                elemento.focus();
                
                console.log('✅ Cursor movido SEM pulo!');
                
                // ✅ HIGHLIGHT VISUAL DISCRETO
                elemento.classList.add('just-pasted');
                
                setTimeout(() => {
                    elemento.classList.remove('just-pasted');
                }, 1200);
                
            } catch (error) {
                console.error('❌ Erro ao mover cursor:', error);
                this.fallbackCursorFinal(elemento);
            }
        });
    });
}
fallbackCursorFinal(elemento) {
    console.log('🔄 Usando método fallback...');
    
    try {
        // Método 1: execCommand
        elemento.focus();
        
        // Aguardar foco
        setTimeout(() => {
            document.execCommand('selectAll', false, null);
            
            const sel = window.getSelection();
            
            // ✅ COLAPSAR NO FINAL (não no início)
            sel.collapseToEnd();
            
            console.log('✅ Fallback aplicado: collapseToEnd()');
            
        }, 10);
        
    } catch (e) {
        console.error('❌ Fallback falhou:', e);
        
        // Último recurso: apenas focar
        elemento.focus();
    }
}
    // ✅ QUEBRAR PARÁGRAFO NORMAL (antigo)
    quebrarParagrafoNormal(elemento, limiteSeguro, paginaRect, pagina) {
        const texto = elemento.textContent.trim();
        const palavras = texto.split(/\s+/).filter(p => p.length > 0);
        
        if (palavras.length === 0) return;
        
        console.log(`✂️ Quebrando parágrafo normal (${palavras.length} palavras)`);
        
        let palavrasQueCabem = 0;
        const textoOriginal = elemento.textContent;
        
        for (let i = 1; i <= palavras.length; i++) {
            const teste = palavras.slice(0, i).join(' ');
            elemento.textContent = teste;
            elemento.offsetHeight;
            
            const testeRect = elemento.getBoundingClientRect();
            const testeBottom = testeRect.bottom - paginaRect.top;
            
            if (testeBottom > limiteSeguro) {
                break;
            }
            
            palavrasQueCabem = i;
        }
        
        if (palavrasQueCabem === 0) {
            elemento.textContent = textoOriginal;
            this.moverElementoCompleto(elemento, pagina);
            return;
        }
        
        const textoAtual = palavras.slice(0, palavrasQueCabem).join(' ');
        const textoProximo = palavras.slice(palavrasQueCabem).join(' ');
        
        elemento.textContent = textoAtual;
        
        let proximaPagina = this.obterOuCriarProximaPagina(pagina);
        const proximoConteudo = proximaPagina.querySelector('.editable-content');
        
        const novoP = document.createElement('p');
        novoP.className = elemento.className;
        novoP.contentEditable = true;
        novoP.textContent = textoProximo;
        
        proximoConteudo.insertBefore(novoP, proximoConteudo.firstChild);
        
        console.log(`✅ Parágrafo normal quebrado`);
        
        if (sistema && sistema.salvarDados) {
            sistema.salvarDados();
        }
    }

    // ✅ QUEBRAR LISTA
    quebrarLista(elemento, limiteSeguro, paginaRect, pagina) {
        const itens = Array.from(elemento.children);
        
        if (itens.length === 0) return;
        
        let itensQueCabem = 0;
        
        for (let i = 0; i < itens.length; i++) {
            const itemRect = itens[i].getBoundingClientRect();
            const itemBottom = itemRect.bottom - paginaRect.top;
            
            if (itemBottom > limiteSeguro) {
                break;
            }
            
            itensQueCabem++;
        }
        
        if (itensQueCabem === 0) {
            this.moverElementoCompleto(elemento, pagina);
            return;
        }
        
        if (itensQueCabem >= itens.length) {
            return; // Tudo cabe
        }
        
        const itensParaMover = itens.slice(itensQueCabem);
        
        const novaLista = elemento.cloneNode(false);
        itensParaMover.forEach(item => {
            novaLista.appendChild(item.cloneNode(true));
            item.remove();
        });
        
        let proximaPagina = this.obterOuCriarProximaPagina(pagina);
        const proximoConteudo = proximaPagina.querySelector('.editable-content');
        
        proximoConteudo.insertBefore(novaLista, proximoConteudo.firstChild);
        
        console.log(`✅ Lista quebrada: ${itensQueCabem} itens ficam`);
    }

    // ✅ QUEBRAR GRUPO DE FOTOS
    quebrarGrupoDeFotos(elemento, pagina) {
        const photoGrid = elemento.querySelector('.photo-grid');
        if (!photoGrid) return;
        
        const fotos = Array.from(photoGrid.querySelectorAll('.photo-item'));
        const totalFotos = fotos.length;
        
        if (totalFotos <= 2) {
            this.moverElementoCompleto(elemento, pagina);
            return;
        }
        
        // Mover última linha (2 fotos)
        const fotosParaMover = fotos.slice(-2);
        
        const novoGrupo = document.createElement('div');
        novoGrupo.className = 'photo-group-container';
        
        const badge = document.createElement('div');
        badge.className = 'photo-group-badge';
        badge.innerHTML = `<i class="fas fa-images"></i> ${fotosParaMover.length} fotos (Continuação)`;
        novoGrupo.appendChild(badge);
        
        const novoGrid = document.createElement('div');
        novoGrid.className = 'photo-grid editable-grid';
        
        fotosParaMover.forEach(foto => {
            novoGrid.appendChild(foto.cloneNode(true));
            foto.remove();
        });
        
        novoGrupo.appendChild(novoGrid);
        
        let proximaPagina = this.obterOuCriarProximaPagina(pagina);
        const proximoConteudo = proximaPagina.querySelector('.editable-content');
        
        proximoConteudo.insertBefore(novoGrupo, proximoConteudo.firstChild);
        
        console.log(`✅ Grupo de fotos quebrado`);
    }

    // ✅ MOVER ELEMENTO COMPLETO
    moverElementoCompleto(elemento, pagina) {
        console.log(`📦 Movendo elemento completo: ${elemento.className}`);
        
        let proximaPagina = this.obterOuCriarProximaPagina(pagina);
        const proximoConteudo = proximaPagina.querySelector('.editable-content');
        
        if (!proximoConteudo) {
            console.error('❌ Erro ao obter próximo conteúdo');
            return;
        }
        
        const clone = elemento.cloneNode(true);
        elemento.remove();
        
        proximoConteudo.insertBefore(clone, proximoConteudo.firstChild);
        
        console.log(`✅ Elemento movido para próxima página`);
        
        if (sistema && sistema.salvarDados) {
            sistema.salvarDados();
        }
    }

    // ✅ OBTER OU CRIAR PRÓXIMA PÁGINA
    obterOuCriarProximaPagina(paginaAtual) {
        let proximaPagina = paginaAtual.nextElementSibling;
        
        while (proximaPagina && !proximaPagina.classList.contains('page-content')) {
            proximaPagina = proximaPagina.nextElementSibling;
        }
        
        if (!proximaPagina) {
            console.log('📄 Criando nova página automaticamente...');
            proximaPagina = this.criarNovaPagina(paginaAtual);
        }
        
        return proximaPagina;
    }

    // ✅ CRIAR NOVA PÁGINA
    criarNovaPagina(paginaReferencia) {
        const numPaginaAtual = document.querySelectorAll('.page-content').length;
        
        const novaPage = document.createElement('div');
        novaPage.className = 'page-content editable-page';
        novaPage.style.opacity = '0';
        novaPage.style.transform = 'translateY(30px)';
        
        novaPage.innerHTML = `
            <div class="editable-content"></div>
            <div class="page-footer editable-footer">
                <p class="footer-text editable-text" contenteditable="true">
                    <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                    <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                    <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
                </p>
                <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
            </div>
        `;

        paginaReferencia.parentNode.insertBefore(novaPage, paginaReferencia.nextSibling);
        
        // Animação
        setTimeout(() => {
            novaPage.style.transition = 'all 0.5s ease';
            novaPage.style.opacity = '1';
            novaPage.style.transform = 'translateY(0)';
        }, 50);
        
        // Atualizar interface
        setTimeout(() => {
            if (typeof adicionarBotoesDeletarPagina === 'function') {
                adicionarBotoesDeletarPagina();
            }
            if (typeof adicionarBotoesEntrePaginas === 'function') {
                adicionarBotoesEntrePaginas();
            }
            if (typeof renumerarPaginas === 'function') {
                renumerarPaginas();
            }
        }, 100);
        
        console.log(`✅ Nova página ${numPaginaAtual + 1} criada automaticamente`);
        
        return novaPage;
    }

    parar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        clearTimeout(this.timeout);
        console.log('⏹️ Monitor de quebra automática PARADO');
    }
}

// ==================== PAUSAR/RETOMAR MONITORAMENTO ====================
window.pausarMonitoramento = function() {
    if (monitorQuebraAutomatica) {
        clearInterval(monitorQuebraAutomatica.intervalo);
        clearTimeout(monitorQuebraAutomatica.timeout);
        monitorQuebraAutomatica.processando = true;
        console.log('⏸️ Monitoramento PAUSADO');
    }
    if (gerenciadorColagem) {
        gerenciadorColagem.processando = true;
        console.log('⏸️ Gerenciador de Colagem PAUSADO');
    }
};

window.retomarMonitoramento = function() {
    if (monitorQuebraAutomatica) {
        monitorQuebraAutomatica.processando = false;
        // Reiniciar intervalo
        if (!monitorQuebraAutomatica.intervalo) {
            monitorQuebraAutomatica.intervalo = setInterval(() => {
                if (!monitorQuebraAutomatica.processando) {
                    monitorQuebraAutomatica.verificarTodasPaginas();
                }
            }, 5000);
        }
        console.log('▶️ Monitoramento RETOMADO');
    }
    if (gerenciadorColagem) {
        gerenciadorColagem.processando = false;
        console.log('▶️ Gerenciador de Colagem RETOMADO');
    }
};
// ==================== INSTANCIAR MONITOR ====================
let monitorQuebraAutomatica;

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        monitorQuebraAutomatica = new MonitorQuebraAutomatica();
        console.log('✅ Monitor de Quebra Automática ATIVO');
    }, 2000);
});

// ==================== INSTANCIAR BLOQUEADOR ====================
let bloqueadorDigitacao;

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        bloqueadorDigitacao = new BloqueadorDeDigitacao();
        console.log('✅ Bloqueador de Digitação Ativado!');
    }, 1000);
});
// ==================== LIMPEZA AUTOMÁTICA DE AVISOS ====================
// Limpar avisos ao rolar a página
let timeoutLimpeza;
document.getElementById('previewContainer')?.addEventListener('scroll', () => {
    clearTimeout(timeoutLimpeza);
    timeoutLimpeza = setTimeout(() => {
        if (bloqueadorDigitacao) {
            bloqueadorDigitacao.removerAviso();
            console.log('🧹 Avisos limpos ao rolar');
        }
    }, 2000);
});

// Limpar avisos ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.editable-text') && 
        !e.target.closest('.aviso-limite-discreto')) {
        if (bloqueadorDigitacao) {
            bloqueadorDigitacao.removerAviso();
        }
    }
});

// Limpar avisos ao mudar de página
const observer = new MutationObserver(() => {
    // Remover avisos órfãos (sem elemento pai válido)
    document.querySelectorAll('.aviso-limite-discreto').forEach(aviso => {
        const elementoAnterior = aviso.previousElementSibling;
        if (!elementoAnterior || 
            !elementoAnterior.classList.contains('editable-text')) {
            aviso.remove();
            console.log('🗑️ Aviso órfão removido');
        }
    });
});

// Observar mudanças no container
const previewContainer = document.getElementById('previewContainer');
if (previewContainer) {
    observer.observe(previewContainer, {
        childList: true,
        subtree: true
    });
}
// ==================== SISTEMA DE IMPORTAÇÃO DE PDF - VERSÃO DEFINITIVA ==================== 
class SistemaPDF {
    constructor() {
        this.pdfLib = null;
        this.arquivosPDF = []; // Array para armazenar os arquivos selecionados
        this.init();
    }

    async init() {
        // Carregar PDF.js
        if (typeof pdfjsLib === 'undefined') {
            console.log('📚 Carregando PDF.js...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                this.pdfLib = pdfjsLib;
                console.log('✅ PDF.js carregado!');
            };
            document.head.appendChild(script);
        } else {
            this.pdfLib = pdfjsLib;
            console.log('✅ PDF.js já estava carregado');
        }
    }

    abrirModal() {
        console.log('📄 Abrindo modal de PDF...');
        
        // Limpar arquivos anteriores
        this.arquivosPDF = [];
        
        // Remover modal anterior
        const modalAntigo = document.getElementById('modalPDFOverlay');
        if (modalAntigo) modalAntigo.remove();
        
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'modalPDFOverlay';
        modal.style.opacity = '0';
        
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 700px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                    <h3>
                        <i class="fas fa-file-pdf"></i>
                        Importar PDFs
                    </h3>
                    <button class="modal-close" onclick="sistemaPDF.fecharModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Como funciona:</strong>
                            Cada página do PDF será convertida em imagem e adicionada ao final do relatório.
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <i class="fas fa-upload"></i>
                            Selecione um ou mais PDFs
                        </label>
                        <input 
                            type="file" 
                            class="form-input" 
                            id="inputPDF" 
                            accept=".pdf" 
                            multiple
                            onchange="sistemaPDF.arquivosSelecionados(this.files)"
                        >
                    </div>
                    
                    <div id="listaPDFs" style="display: none; margin-top: 1rem;">
                        <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-light);">
                            <i class="fas fa-check-circle" style="color: #10b981;"></i>
                            Arquivos selecionados:
                        </strong>
                        <div id="listaConteudo" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
                    </div>
                    
                    <div id="progressoPDF" style="display: none; margin-top: 1rem;">
                        <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-light);">
                            Processando...
                        </strong>
                        <div style="background: #e5e7eb; border-radius: 8px; height: 30px; overflow: hidden;">
                            <div id="barraPDF" style="height: 100%; background: linear-gradient(90deg, #10b981, #059669); width: 0%; transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                0%
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="sistemaPDF.fecharModal()">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                    <button class="btn btn-success" id="btnProcessarPDF" onclick="sistemaPDF.processar()" disabled>
                        <i class="fas fa-plus-circle"></i>
                        Adicionar ao Relatório
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animação
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
        
        // Fechar com ESC
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharModal();
        });
    }

    arquivosSelecionados(files) {
        console.log('📋 Arquivos selecionados:', files.length);
        
        if (!files || files.length === 0) {
            console.warn('⚠️ Nenhum arquivo');
            return;
        }
        
        // Armazenar arquivos
        this.arquivosPDF = Array.from(files);
        
        console.log('✅ Arquivos armazenados:', this.arquivosPDF.map(f => f.name));
        
        // Mostrar lista
        const lista = document.getElementById('listaPDFs');
        const conteudo = document.getElementById('listaConteudo');
        const btnProcessar = document.getElementById('btnProcessarPDF');
        
        if (lista && conteudo) {
            conteudo.innerHTML = '';
            
            this.arquivosPDF.forEach(file => {
                const item = document.createElement('div');
                item.style.cssText = 'padding: 0.5rem 1rem; background: var(--sidebar-bg); border-radius: 6px; display: flex; align-items: center; gap: 0.5rem;';
                item.innerHTML = `
                    <i class="fas fa-file-pdf" style="color: #ef4444; font-size: 1.2rem;"></i>
                    <span style="color: var(--text-light); font-size: 0.9rem;">${file.name}</span>
                    <span style="margin-left: auto; color: var(--text-muted); font-size: 0.85rem;">${this.formatarTamanho(file.size)}</span>
                `;
                conteudo.appendChild(item);
            });
            
            lista.style.display = 'block';
        }
        
        // Habilitar botão
        if (btnProcessar) {
            btnProcessar.disabled = false;
            console.log('✅ Botão habilitado');
        }
    }

    async processar() {
        console.log('🚀 INICIANDO PROCESSAMENTO');
        console.log('📋 Arquivos para processar:', this.arquivosPDF.length);
        
        if (this.arquivosPDF.length === 0) {
            alert('⚠️ Nenhum arquivo selecionado!');
            return;
        }
        
        if (!this.pdfLib) {
            alert('❌ PDF.js não carregado. Aguarde alguns segundos e tente novamente.');
            return;
        }
        
        // Desabilitar botão
        const btnProcessar = document.getElementById('btnProcessarPDF');
        if (btnProcessar) {
            btnProcessar.disabled = true;
            btnProcessar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        }
        
        // Mostrar barra
        const progressoDiv = document.getElementById('progressoPDF');
        const barra = document.getElementById('barraPDF');
        if (progressoDiv) progressoDiv.style.display = 'block';
        
        let totalPaginas = 0;
        let paginasProcessadas = 0;
        
        try {
            // Processar cada arquivo
            for (let i = 0; i < this.arquivosPDF.length; i++) {
                const file = this.arquivosPDF[i];
                console.log(`\n📄 Processando arquivo ${i + 1}/${this.arquivosPDF.length}: ${file.name}`);
                
                // Ler arquivo
                const arrayBuffer = await this.lerArquivo(file);
                
                // Carregar PDF
                const loadingTask = this.pdfLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                
                console.log(`   Páginas: ${pdf.numPages}`);
                totalPaginas += pdf.numPages;
                
                // Processar cada página
                for (let numPagina = 1; numPagina <= pdf.numPages; numPagina++) {
                    const page = await pdf.getPage(numPagina);
                    
                    // Renderizar como imagem
                    const scale = 2;
                    const viewport = page.getViewport({ scale });
                    
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    
                    // Converter para imagem
                    const imgBase64 = canvas.toDataURL('image/jpeg', 0.92);
                    
                    // Adicionar página
                    this.adicionarPagina(imgBase64, file.name, numPagina);
                    
                    paginasProcessadas++;
                    const progresso = Math.round((paginasProcessadas / totalPaginas) * 100);
                    
                    if (barra) {
                        barra.style.width = progresso + '%';
                        barra.textContent = progresso + '%';
                    }
                    
                    console.log(`   ✅ Página ${numPagina}/${pdf.numPages} processada`);
                    
                    // Delay
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            console.log(`\n✅ PROCESSAMENTO CONCLUÍDO: ${paginasProcessadas} páginas`);
            
            // Atualizar interface
            setTimeout(() => {
                if (typeof adicionarBotoesEntrePaginas === 'function') adicionarBotoesEntrePaginas();
                if (typeof adicionarBotoesDeletarPagina === 'function') adicionarBotoesDeletarPagina();
                if (typeof renumerarPaginas === 'function') renumerarPaginas();
            }, 500);
            
            // Salvar
            if (sistema) sistema.salvarDados();
            
            // Toast
            if (sistema) {
                sistema.mostrarToast(`✅ ${paginasProcessadas} página(s) adicionadas!`, 'success');
            }
            
            // Fechar modal
            this.fecharModal();
            
            // Scroll para última página
            setTimeout(() => {
                const ultimaPagina = document.querySelector('.page-content:last-of-type');
                if (ultimaPagina) {
                    ultimaPagina.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ ERRO:', error);
            alert('❌ Erro ao processar PDF:\n\n' + error.message);
        }
    }

    adicionarPagina(imgBase64, nomePDF, numPagina) {
        const totalPaginas = document.querySelectorAll('.page-content').length;
        const novaPage = document.createElement('div');
        novaPage.className = 'page-content editable-page page-pdf-converted';
        novaPage.dataset.pdfOrigem = nomePDF;
        novaPage.dataset.pdfPagina = numPagina;
        
        novaPage.innerHTML = `
            <div class="editable-content pdf-content-full" style="padding: 0; margin: 0; min-height: 297mm; height: 297mm; display: flex; justify-content: center; align-items: center;">
                <img src="${imgBase64}" alt="PDF: ${nomePDF} - Página ${numPagina}" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;">
            </div>
        `;
        
        document.getElementById('previewContainer').appendChild(novaPage);
    }

    lerArquivo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    formatarTamanho(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    fecharModal() {
        const modal = document.getElementById('modalPDFOverlay');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                console.log('✅ Modal fechado');
            }, 300);
        }
    }
}

// ==================== INSTANCIAR E EXPOR GLOBALMENTE ====================
let sistemaPDF;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sistemaPDF = new SistemaPDF();
        console.log('✅ Sistema de PDF ativado!');
    });
} else {
    sistemaPDF = new SistemaPDF();
    console.log('✅ Sistema de PDF ativado (imediato)!');
}

// ==================== FUNÇÃO GLOBAL PARA ABRIR MODAL ====================
function mostrarModalJuntarPDF() {
    if (sistemaPDF) {
        sistemaPDF.abrirModal();
    } else {
        alert('❌ Sistema de PDF ainda não foi carregado. Aguarde e tente novamente.');
    }
}

// ==================== SISTEMA DE IMPORTAÇÃO DE WORD (.DOCX) ====================
class ImportadorWord {
    constructor() {
        this.mammoth = window.mammoth; // Biblioteca já carregada no HTML [1]
        this.divisorElementos = window.divisorDeElementos; // Sistema de divisão existente [2]
        this.figureCounter = 1;
        this.tableCounter = 1;
        console.log('✅ Importador de Word inicializado');
    }

    // ==================== ABRIR MODAL DE IMPORTAÇÃO ====================
    abrirModal() {
        console.log('📄 Abrindo modal de importação Word...');
        
        // Remover modal anterior se existir
        const modalAntigo = document.getElementById('modalImportWordOverlay');
        if (modalAntigo) modalAntigo.remove();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'modalImportWordOverlay';
        modal.style.opacity = '0';
        
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 700px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #0056b3, #003087);">
                    <h3>
                        <i class="fas fa-file-word"></i>
                        Importar Documento Word
                    </h3>
                    <button class="modal-close" onclick="importadorWord.fecharModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Importação Inteligente:</strong>
                            <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.9rem;">
                                <li>✅ Títulos (Heading 1, 2, 3) → Formatação automática</li>
                                <li>✅ Tabelas → Preservam estrutura e cores</li>
                                <li>✅ Imagens → Legendas automáticas</li>
                                <li>✅ Listas → Numeradas e com marcadores</li>
                                <li>✅ <strong>ZERO conflitos com rodapé</strong> (divisão automática)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <i class="fas fa-upload"></i>
                            Selecione o arquivo Word (.docx)
                        </label>
                        <input 
                            type="file" 
                            class="form-input" 
                            id="inputWordFile" 
                            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        >
                    </div>
                    
                    <div id="wordPreviewArea" style="display: none; margin-top: 1.5rem;">
                        <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-light);">
                            <i class="fas fa-eye"></i> Arquivo Selecionado:
                        </strong>
                        <div id="wordFileInfo" style="background: var(--dark-bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-dark);"></div>
                    </div>
                    
                    <div id="progressoWord" style="display: none; margin-top: 1.5rem;">
                        <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-light);">
                            Processando documento...
                        </strong>
                        <div style="background: #e5e7eb; border-radius: 8px; height: 30px; overflow: hidden;">
                            <div 
                                id="barraProgressoWord" 
                                style="
                                    height: 100%; 
                                    background: linear-gradient(90deg, #0056b3, #003087); 
                                    width: 0%; 
                                    transition: width 0.3s;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: white;
                                    font-weight: 600;
                                    font-size: 0.9rem;
                                "
                            >
                                0%
                            </div>
                        </div>
                        <div id="statusImportacao" style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);"></div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="importadorWord.fecharModal()">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                    <button class="btn btn-primary" id="btnImportarWord" onclick="importadorWord.processar()" disabled>
                        <i class="fas fa-file-import"></i>
                        Importar Documento
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animação
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
        
        // Configurar input
        setTimeout(() => {
            const inputFile = document.getElementById('inputWordFile');
            if (inputFile) {
                inputFile.addEventListener('change', (e) => this.arquivoSelecionado(e.target.files[0]));
            }
        }, 100);
        
        // Fechar com ESC
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharModal();
        });
    }

    // ==================== ARQUIVO SELECIONADO ====================
    arquivoSelecionado(file) {
        if (!file) {
            console.warn('⚠️ Nenhum arquivo selecionado');
            return;
        }
        
        console.log('📋 Arquivo selecionado:', file.name);
        
        const previewArea = document.getElementById('wordPreviewArea');
        const fileInfo = document.getElementById('wordFileInfo');
        const btnImportar = document.getElementById('btnImportarWord');
        
        if (previewArea && fileInfo) {
            fileInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #0056b3, #003087); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                        <i class="fas fa-file-word"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-light); margin-bottom: 0.25rem;">${file.name}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">${this.formatarTamanho(file.size)}</div>
                    </div>
                </div>
            `;
            previewArea.style.display = 'block';
        }
        
        if (btnImportar) {
            btnImportar.disabled = false;
        }
        
        this.arquivoAtual = file;
    }
// ==================== IDENTIFICAR TIPO DE TABELA ====================
identificarTipoTabela(tabelaElement) {
    const temImagens = tabelaElement.querySelectorAll('img').length > 0;
    const linhas = tabelaElement.querySelectorAll('tr').length;
    const primeiraLinha = tabelaElement.querySelector('tr');
    const colunas = primeiraLinha?.querySelectorAll('td, th').length || 0;
    
    // ✅ TABELA COM FOTOS (GRID 2x2 TÍPICO)
    if (temImagens && linhas >= 2 && colunas >= 2) {
        const imagens = Array.from(tabelaElement.querySelectorAll('img'));
        
        // Verificar se é um grid de fotos (cada célula com 1 imagem)
        const celulasComImagem = Array.from(tabelaElement.querySelectorAll('td, th'))
            .filter(cel => cel.querySelector('img'));
        
        if (celulasComImagem.length === imagens.length) {
            return {
                tipo: 'tabela-fotos',
                grid: `${linhas}x${colunas}`,
                imagens: imagens.map(img => ({
                    src: img.src,
                    alt: img.alt || ''
                }))
            };
        }
    }
    
    // ✅ TABELA DE DADOS NORMAL
    return {
        tipo: 'tabela-dados',
        linhas: linhas,
        colunas: colunas
    };
}
    // ==================== PROCESSAR DOCUMENTO ====================
    async processar() {
        if (!this.arquivoAtual) {
            alert('⚠️ Selecione um arquivo primeiro!');
            return;
        }
        
        console.log('🚀 INICIANDO IMPORTAÇÃO DE WORD');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const btnImportar = document.getElementById('btnImportarWord');
        const progressoDiv = document.getElementById('progressoWord');
        const barra = document.getElementById('barraProgressoWord');
        const status = document.getElementById('statusImportacao');
        
        if (btnImportar) {
            btnImportar.disabled = true;
            btnImportar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        }
        
        if (progressoDiv) progressoDiv.style.display = 'block';
        
        try {
            // ✅ ETAPA 1: Ler arquivo (10%)
            this.atualizarProgresso(10, 'Lendo arquivo Word...', barra, status);
            const arrayBuffer = await this.lerArquivo(this.arquivoAtual);
            
            // ✅ ETAPA 2: Converter com Mammoth (30%)
            this.atualizarProgresso(30, 'Convertendo documento...', barra, status);
            const resultado = await this.mammoth.convertToHtml(
                { arrayBuffer: arrayBuffer },
                {
                    styleMap: [
                        "p[style-name='Heading 1'] => h2.titulo-principal",
                        "p[style-name='Heading 2'] => h3.subtitulo",
                        "p[style-name='Heading 3'] => h4.titulo-nivel-3",
                        "p[style-name='Title'] => h2.titulo-principal"
                    ]
                }
            );
            
            console.log('✅ Conversão Mammoth concluída');
            console.log('   HTML bruto:', resultado.value.substring(0, 200) + '...');
            
            // ✅ ETAPA 3: Parsear HTML (50%)
            this.atualizarProgresso(50, 'Analisando estrutura...', barra, status);
            const parser = new DOMParser();
            const doc = parser.parseFromString(resultado.value, 'text/html');
            
            // ✅ ETAPA 4: Identificar elementos (60%)
            this.atualizarProgresso(60, 'Identificando títulos, tabelas e imagens...', barra, status);
            const elementos = await this.identificarElementos(doc.body);
            
            console.log(`✅ ${elementos.length} elementos identificados`);
            
            // ✅ ETAPA 5: Criar páginas no sistema (70%)
            this.atualizarProgresso(70, 'Criando páginas...', barra, status);
            await this.inserirNoSistema(elementos, barra, status);
            
            // ✅ ETAPA 6: Verificar conflitos com rodapé (90%)
            this.atualizarProgresso(90, 'Verificando conflitos com rodapé...', barra, status);
            await this.verificarTodosConflitos();
            
            // ✅ ETAPA 7: Finalizar (100%)
            this.atualizarProgresso(100, 'Importação concluída!', barra, status);
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('✅ IMPORTAÇÃO WORD CONCLUÍDA!');
            
            // Atualizar interface
            setTimeout(() => {
                if (typeof adicionarBotoesEntrePaginas === 'function') adicionarBotoesEntrePaginas();
                if (typeof adicionarBotoesDeletarPagina === 'function') adicionarBotoesDeletarPagina();
                if (typeof renumerarPaginas === 'function') renumerarPaginas();
            }, 500);
            
            // Salvar
            if (sistema) sistema.salvarDados();
            
            // Toast
            if (sistema) {
                sistema.mostrarToast(`✅ ${elementos.length} elementos importados com sucesso!`, 'success');
            }
            
            // Fechar modal
            setTimeout(() => this.fecharModal(), 1500);
            
            // Scroll para última página
            setTimeout(() => {
                const ultimaPagina = document.querySelector('.page-content:last-of-type');
                if (ultimaPagina) {
                    ultimaPagina.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 2000);
            
        } catch (error) {
            console.error('❌ ERRO NA IMPORTAÇÃO:', error);
            alert(`❌ Erro ao importar Word:\n\n${error.message}\n\nVerifique se o arquivo é um .docx válido.`);
            
            if (btnImportar) {
                btnImportar.disabled = false;
                btnImportar.innerHTML = '<i class="fas fa-file-import"></i> Importar Documento';
            }
        }
    }

    // ==================== IDENTIFICAR ELEMENTOS DO WORD ====================
    async identificarElementos(body) {
        const elementos = [];
        
        // Percorrer todos os filhos do body
        for (const child of body.children) {
            const tagName = child.tagName.toLowerCase();
            const className = child.className;
            const texto = child.textContent.trim();
            
            // ✅ TÍTULOS PRINCIPAIS (H1, H2, Heading 1)
            if (tagName === 'h1' || tagName === 'h2' || className.includes('titulo-principal')) {
                if (texto.length > 0) {
                    elementos.push({
                        tipo: 'titulo1',
                        conteudo: texto,
                        elemento: child
                    });
                    console.log('   📌 Título Principal:', texto.substring(0, 50));
                }
            }
            
            // ✅ SUBTÍTULOS (H3, Heading 2)
            else if (tagName === 'h3' || className.includes('subtitulo')) {
                if (texto.length > 0) {
                    elementos.push({
                        tipo: 'titulo2',
                        conteudo: texto,
                        elemento: child
                    });
                    console.log('   📌 Subtítulo:', texto.substring(0, 50));
                }
            }
            
            // ✅ TÍTULOS NÍVEL 3 (H4, Heading 3)
            else if (tagName === 'h4' || className.includes('titulo-nivel-3')) {
                if (texto.length > 0) {
                    elementos.push({
                        tipo: 'titulo3',
                        conteudo: texto,
                        elemento: child
                    });
                    console.log('   📌 Título Nível 3:', texto.substring(0, 50));
                }
            }
            
// ✅ NOVO CÓDIGO - DETECTA TIPO DE TABELA
else if (tagName === 'table') {
    const tipoTabela = this.identificarTipoTabela(child);
    
    if (tipoTabela.tipo === 'tabela-fotos') {
        // Converter tabela de fotos em grid de fotos do sistema
        elementos.push({
            tipo: 'grid-fotos',
            grid: tipoTabela.grid,
            imagens: tipoTabela.imagens,
            elemento: child
        });
        console.log(`   📸 Tabela com fotos detectada (${tipoTabela.grid})`);
    } else {
        // Tabela de dados normal
        elementos.push({
            tipo: 'tabela',
            conteudo: child.outerHTML,
            linhas: tipoTabela.linhas,
            colunas: tipoTabela.colunas,
            elemento: child
        });
        console.log(`   📊 Tabela: ${tipoTabela.linhas}x${tipoTabela.colunas}`);
    }
}
            
            // ✅ IMAGENS
            else if (tagName === 'img' || child.querySelector('img')) {
                const img = tagName === 'img' ? child : child.querySelector('img');
                if (img && img.src) {
                    elementos.push({
                        tipo: 'imagem',
                        conteudo: img.src,
                        alt: img.alt || `Figura ${this.figureCounter}`,
                        elemento: child
                    });
                    console.log(`   🖼️ Imagem: ${img.alt || 'sem legenda'}`);
                    this.figureCounter++;
                }
            }
            
            // ✅ LISTAS NUMERADAS
            else if (tagName === 'ol') {
                elementos.push({
                    tipo: 'lista-numerada',
                    conteudo: child.outerHTML,
                    elemento: child
                });
                const itens = child.querySelectorAll('li').length;
                console.log(`   🔢 Lista numerada: ${itens} itens`);
            }
            
            // ✅ LISTAS COM MARCADORES
            else if (tagName === 'ul') {
                elementos.push({
                    tipo: 'lista',
                    conteudo: child.outerHTML,
                    elemento: child
                });
                const itens = child.querySelectorAll('li').length;
                console.log(`   • Lista: ${itens} itens`);
            }
            
            // ✅ PARÁGRAFOS
            else if (tagName === 'p') {
                if (texto.length > 0) {
                    elementos.push({
                        tipo: 'paragrafo',
                        conteudo: child.innerHTML, // Preservar formatação interna
                        elemento: child
                    });
                    console.log(`   📝 Parágrafo: ${texto.substring(0, 50)}...`);
                }
            }
            
            // ✅ QUEBRAS DE LINHA MÚLTIPLAS (espaçamento)
            else if (tagName === 'br') {
                // Ignorar <br> isolados, Mammoth já os converte
            }
        }
        
        return elementos;
    }

    // ==================== INSERIR NO SISTEMA ====================
    async inserirNoSistema(elementos, barra, status) {
        // Obter última página ou criar primeira
        let paginaAtual = document.querySelector('.page-content:last-of-type');
        
        if (!paginaAtual || paginaAtual.classList.contains('page-cover')) {
            paginaAtual = this.criarNovaPagina();
        }
        
        let editableContent = paginaAtual.querySelector('.editable-content');
        
        const totalElementos = elementos.length;
        
        for (let i = 0; i < elementos.length; i++) {
            const elem = elementos[i];
            
            // Atualizar progresso (70% a 90%)
            const progressoAtual = 70 + ((i / totalElementos) * 20);
            this.atualizarProgresso(
                progressoAtual, 
                `Inserindo elemento ${i + 1}/${totalElementos} (${elem.tipo})...`, 
                barra, 
                status
            );
            
            let novoElemento;
            
            switch (elem.tipo) {
                case 'titulo1':
                    novoElemento = document.createElement('h2');
                    novoElemento.className = 'editable-text';
                    novoElemento.contentEditable = true;
                    novoElemento.textContent = elem.conteudo;
                    break;
                    
                case 'titulo2':
                    novoElemento = document.createElement('h3');
                    novoElemento.className = 'editable-text';
                    novoElemento.contentEditable = true;
                    novoElemento.textContent = elem.conteudo;
                    break;
                    
                case 'titulo3':
                    novoElemento = document.createElement('h4');
                    novoElemento.className = 'editable-text';
                    novoElemento.contentEditable = true;
                    novoElemento.textContent = elem.conteudo;
                    break;
                    
                case 'paragrafo':
                    novoElemento = document.createElement('p');
                    novoElemento.className = 'editable-text';
                    novoElemento.contentEditable = true;
                    novoElemento.innerHTML = elem.conteudo; // Preservar formatação
                    break;
                    
                case 'tabela':
                    novoElemento = document.createElement('div');
                    novoElemento.innerHTML = elem.conteudo;
                    const tabela = novoElemento.querySelector('table');
                    if (tabela) {
                        tabela.className = 'editable-table';
                        
                        // Tornar células editáveis
                        tabela.querySelectorAll('td, th').forEach(celula => {
                            celula.contentEditable = true;
                        });
                        
                        // Adicionar legenda se não existir
                        if (!tabela.querySelector('caption')) {
                            const caption = document.createElement('caption');
                            caption.textContent = `Tabela ${this.tableCounter} - Dados importados`;
                            caption.contentEditable = true;
                            tabela.insertBefore(caption, tabela.firstChild);
                            this.tableCounter++;
                        }
                    }
                    break;
                    
                case 'imagem':
                    novoElemento = document.createElement('div');
                    novoElemento.className = 'photo-item editable-photo';
                    novoElemento.innerHTML = `
                        <img src="${elem.conteudo}" alt="${elem.alt}">
                        <div class="photo-caption editable-text" contenteditable="true">${elem.alt}</div>
                    `;
                    break;
                    
                case 'lista':
                case 'lista-numerada':
                    novoElemento = document.createElement('div');
                    novoElemento.innerHTML = elem.conteudo;
                    const lista = novoElemento.querySelector('ul, ol');
                    if (lista) {
                        lista.className = 'editable-list';
                        lista.querySelectorAll('li').forEach(li => {
                            li.className = 'editable-text';
                            li.contentEditable = true;
                        });
                    }
                    break;
            }
            
            if (novoElemento) {
                editableContent.appendChild(novoElemento);
                
                // ✅ AGUARDAR RENDERIZAÇÃO
                await new Promise(resolve => setTimeout(resolve, 50));
                
                // ✅ VERIFICAR CONFLITO COM RODAPÉ IMEDIATAMENTE
                const conflito = this.verificarConflitoComRodape(novoElemento, paginaAtual);
                
                if (conflito) {
                    console.log(`   ⚠️ Conflito detectado com ${elem.tipo}, movendo para próxima página`);
                    
                    // Remover da página atual
                    novoElemento.remove();
                    
                    // Criar nova página
                    paginaAtual = this.criarNovaPagina();
                    editableContent = paginaAtual.querySelector('.editable-content');
                    
                    // Adicionar na nova página
                    editableContent.appendChild(novoElemento);
                    
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }
    }

    // ==================== VERIFICAR CONFLITO COM RODAPÉ ====================
    verificarConflitoComRodape(elemento, pagina) {
        if (!elemento || !pagina) return false;
        
        const rodape = pagina.querySelector('.page-footer');
        if (!rodape) return false;
        
        // Forçar reflow
        elemento.offsetHeight;
        rodape.offsetTop;
        
        const paginaRect = pagina.getBoundingClientRect();
        const elementoRect = elemento.getBoundingClientRect();
        const rodapeRect = rodape.getBoundingClientRect();
        
        const elementoBottom = elementoRect.bottom - paginaRect.top;
        const rodapeTop = rodapeRect.top - paginaRect.top;
        const MARGEM_SEGURANCA = 40; // 40px de margem
        
        const limiteSeguro = rodapeTop - MARGEM_SEGURANCA;
        
        return elementoBottom > limiteSeguro;
    }

    // ==================== VERIFICAR TODOS OS CONFLITOS ====================
    async verificarTodosConflitos() {
        console.log('🔍 Verificação final de conflitos com rodapé...');
        
        if (!this.divisorElementos) {
            console.warn('⚠️ Sistema de divisão não disponível, pulando verificação');
            return;
        }
        
        const todasPaginas = Array.from(
            document.querySelectorAll('.page-content:not(.page-cover)')
        );
        
        for (const pagina of todasPaginas) {
            await this.divisorElementos.reprocessarPaginaCompleta(pagina);
        }
        
        console.log('✅ Verificação de conflitos concluída');
    }

    // ==================== CRIAR NOVA PÁGINA ====================
    criarNovaPagina() {
        const numPaginaAtual = document.querySelectorAll('.page-content').length;
        
        const novaPage = document.createElement('div');
        novaPage.className = 'page-content editable-page';
        novaPage.innerHTML = `
            <div class="editable-content"></div>
            <div class="page-footer editable-footer">
                <p class="footer-text editable-text" contenteditable="true">
                    <strong>NOVO NORDISK PRODUÇÃO FARMACÊUTICA DO BRASIL LTDA.</strong><br>
                    <strong>FÁBRICA</strong> – Avenida "C", nº 1.413 - Distrito Industrial - Montes Claros - MG<br>
                    <strong>Fone:</strong> 38-3229-6200 – <strong>E-mail:</strong> azla@novonordisk.com
                </p>
                <span class="page-number editable-text" contenteditable="true">${numPaginaAtual + 1}</span>
            </div>
        `;
        
        document.getElementById('previewContainer').appendChild(novaPage);
        console.log(`📄 Nova página ${numPaginaAtual + 1} criada`);
        
        return novaPage;
    }

    // ==================== UTILITÁRIOS ====================
    lerArquivo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    formatarTamanho(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    atualizarProgresso(porcentagem, mensagem, barra, status) {
        if (barra) {
            barra.style.width = porcentagem + '%';
            barra.textContent = Math.round(porcentagem) + '%';
        }
        if (status) {
            status.textContent = mensagem;
        }
    }

    fecharModal() {
        const modal = document.getElementById('modalImportWordOverlay');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                console.log('✅ Modal fechado');
            }, 300);
        }
    }
}

// ==================== INSTANCIAR E EXPOR GLOBALMENTE ====================
let importadorWord;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        importadorWord = new ImportadorWord();
        console.log('✅ Sistema de Importação Word ativado!');
    });
} else {
    importadorWord = new ImportadorWord();
    console.log('✅ Sistema de Importação Word ativado (imediato)!');
}

// ==================== FUNÇÃO GLOBAL PARA ABRIR MODAL ====================
function mostrarModalImportarWord() {
    if (importadorWord) {
        importadorWord.abrirModal();
    } else {
        alert('❌ Sistema de importação ainda não foi carregado. Aguarde e tente novamente.');
    }
}

// Adicione esta função global que será chamada após QUALQUER quebra:

window.garantirCursorNoFinal = function() {
    console.log('🔍 Procurando último parágrafo...');
    
    // Pegar todas as páginas
    const paginas = document.querySelectorAll('.page-content:not(.page-cover)');
    const ultimaPagina = paginas[paginas.length - 1];
    
    if (!ultimaPagina) {
        console.warn('⚠️ Nenhuma página encontrada');
        return;
    }
    
    // Pegar último parágrafo da última página
    const paragrafos = ultimaPagina.querySelectorAll('.smart-paragraph-content');
    const ultimoParagrafo = paragrafos[paragrafos.length - 1];
    
    if (!ultimoParagrafo) {
        console.warn('⚠️ Nenhum parágrafo encontrado na última página');
        return;
    }
    
    console.log('✅ Último parágrafo encontrado');
    
    // Mover cursor
    if (sistema && sistema.moverCursorParaFinal) {
        sistema.moverCursorParaFinal(ultimoParagrafo);
    }
};

// Chamar após qualquer operação de quebra:
setTimeout(() => {
    window.garantirCursorNoFinal();
}, 1000);
// Adicione esta função para FORÇAR cursor no final após colagem:

function forcarCursorNoFinalAposColagem(elemento) {
    console.log('🔒 FORÇANDO cursor no final após colagem...');
    
    // Aguardar a colagem ser processada completamente
    setTimeout(() => {
        const sel = window.getSelection();
        const range = document.createRange();
        
        // ✅ MÉTODO MAIS DIRETO: Usar endContainer e endOffset
        try {
            // Pegar último nó de texto
            const walker = document.createTreeWalker(
                elemento,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let ultimoTexto = null;
            while (walker.nextNode()) {
                ultimoTexto = walker.currentNode;
            }
            
            if (ultimoTexto) {
                // Posicionar no final do último nó de texto
                range.setStart(ultimoTexto, ultimoTexto.length);
                range.setEnd(ultimoTexto, ultimoTexto.length);
                
                sel.removeAllRanges();
                sel.addRange(range);
                
                console.log(`✅ Cursor forçado no final: posição ${ultimoTexto.length}`);
                
                // Scroll para garantir visibilidade
                elemento.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        } catch (error) {
            console.error('❌ Erro ao forçar cursor:', error);
        }
    }, 100);
}
// Adicione esta função global que pode ser chamada manualmente:

window.irParaUltimaLetra = function() {
    console.log('\n🚀 FUNÇÃO EMERGENCIAL: IR PARA ÚLTIMA LETRA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Pegar todas as páginas
    const paginas = document.querySelectorAll('.page-content:not(.page-cover)');
    console.log(`📄 Total de páginas: ${paginas.length}`);
    
    if (paginas.length === 0) {
        console.error('❌ Nenhuma página encontrada!');
        return;
    }
    
    const ultimaPagina = paginas[paginas.length - 1];
    console.log(`✅ Última página encontrada (página ${paginas.length})`);
    
    // Pegar todos os parágrafos da última página
    const paragrafos = ultimaPagina.querySelectorAll('.smart-paragraph-content');
    console.log(`📝 Total de parágrafos na última página: ${paragrafos.length}`);
    
    if (paragrafos.length === 0) {
        console.error('❌ Nenhum parágrafo na última página!');
        return;
    }
    
    const ultimoParagrafo = paragrafos[paragrafos.length - 1];
    const textoCompleto = ultimoParagrafo.textContent;
    console.log(`✅ Último parágrafo encontrado`);
    console.log(`   Tamanho: ${textoCompleto.length} caracteres`);
    console.log(`   Final: "...${textoCompleto.substring(textoCompleto.length - 30)}"`);
    
    // Focar e mover cursor
    ultimoParagrafo.focus();
    
    setTimeout(() => {
        const sel = window.getSelection();
        const range = document.createRange();
        
        // Pegar último nó de texto
        const walker = document.createTreeWalker(
            ultimoParagrafo,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let ultimoTexto = null;
        while (walker.nextNode()) {
            ultimoTexto = walker.currentNode;
        }
        
        if (ultimoTexto) {
            console.log(`📍 Último nó de texto: ${ultimoTexto.length} caracteres`);
            
            // Posicionar NO FINAL
            range.setStart(ultimoTexto, ultimoTexto.length);
            range.setEnd(ultimoTexto, ultimoTexto.length);
            
            sel.removeAllRanges();
            sel.addRange(range);
            
            console.log('✅ CURSOR MOVIDO PARA ÚLTIMA LETRA!');
            console.log(`   Posição final: ${ultimoTexto.length}`);
            
            // Highlight visual
            ultimoParagrafo.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
            ultimoParagrafo.style.transition = 'background-color 1s ease';
            
            setTimeout(() => {
                ultimoParagrafo.style.backgroundColor = '';
            }, 2000);
            
            // Scroll
            ultimoParagrafo.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
        } else {
            console.error('❌ Nenhum nó de texto encontrado!');
            
            // Fallback
            range.selectNodeContents(ultimoParagrafo);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            
            console.log('⚠️ Usado método fallback');
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
    }, 100);
};

// Atalho rápido
window.ultima = window.irParaUltimaLetra;
// ==================== EXPOR FUNÇÕES GLOBALMENTE ====================

// ✅ VERSÃO DEFINITIVA - Cole no script.js
window.confirmarTabela = function() {
    console.log('🔍 ===== window.confirmarTabela INICIADA =====');
    
    // ✅ PAUSAR MONITORAMENTO
    if (window.pausarMonitoramento) {
        window.pausarMonitoramento();
    }
    
    try {
        // ✅ 1. BUSCAR OS INPUTS
        const inputLinhas = document.getElementById('tabelaLinhas');
        const inputColunas = document.getElementById('tabelaColunas');
        
        console.log('📋 Input Linhas:', inputLinhas);
        console.log('📋 Input Colunas:', inputColunas);
        
        if (!inputLinhas || !inputColunas) {
            console.error('❌ ERRO: Inputs não encontrados!');
            alert('❌ ERRO: Não foi possível encontrar os campos do formulário.');
            return;
        }
        
        // ✅ 2. LER E CONVERTER VALORES
        const linhasStr = inputLinhas.value;
        const colunasStr = inputColunas.value;
        
        console.log('📊 Valor STRING Linhas:', linhasStr);
        console.log('📊 Valor STRING Colunas:', colunasStr);
        
        const linhas = parseInt(linhasStr, 10);
        const colunas = parseInt(colunasStr, 10);
        
        console.log('🔢 Valor NÚMERO Linhas:', linhas, typeof linhas);
        console.log('🔢 Valor NÚMERO Colunas:', colunas, typeof colunas);
        
        // ✅ 3. VALIDAÇÃO
        if (isNaN(linhas) || isNaN(colunas)) {
            console.error('❌ Valores inválidos (NaN)');
            alert('⚠️ Por favor, digite números válidos!');
            return;
        }
        
        if (linhas < 1 || colunas < 1) {
            console.error('❌ Valores menores que 1');
            alert('⚠️ O mínimo é 1 linha e 1 coluna!');
            return;
        }
        
        if (linhas > 50 || colunas > 20) {
            console.error('❌ Valores muito grandes');
            alert('⚠️ Máximo: 50 linhas e 20 colunas!');
            return;
        }
        
        console.log(`✅ VALIDAÇÃO OK: Criando tabela ${linhas}x${colunas}`);
        
        // ✅ 4. CRIAR WRAPPER
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.margin = '1.5rem 0';
        
        // ✅ 5. CRIAR TABELA
        const tabela = document.createElement('table');
        tabela.className = 'editable-table';
        
        // ✅ 6. CAPTION
        const caption = document.createElement('caption');
        caption.className = 'editable-text';
        caption.contentEditable = true;
        caption.textContent = `Tabela ${sistema?.tableCounter || 1} - Título da Tabela`;
        tabela.appendChild(caption);
        
        if (sistema) sistema.tableCounter++;
        
        // ✅ 7. THEAD (CABEÇALHO)
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        
        console.log(`🔄 Criando ${colunas} colunas...`);
        for (let j = 0; j < colunas; j++) {
            const th = document.createElement('th');
            th.contentEditable = true;
            th.textContent = `Coluna ${j + 1}`;
            trHead.appendChild(th);
        }
        
        thead.appendChild(trHead);
        tabela.appendChild(thead);
        
        // ✅ 8. TBODY (DADOS) - USAR AS VARIÁVEIS CORRETAS!
        const tbody = document.createElement('tbody');
        
        console.log(`🔄 Criando ${linhas} linhas...`);
        for (let i = 0; i < linhas; i++) {
            const tr = document.createElement('tr');
            
            for (let j = 0; j < colunas; j++) {
                const td = document.createElement('td');
                td.contentEditable = true;
                td.textContent = 'Dado';
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
            console.log(`  ✓ Linha ${i + 1}/${linhas} criada`);
        }
        
        tabela.appendChild(tbody);
        
        // ✅ 9. VERIFICAÇÃO FINAL
        const totalLinhas = tbody.querySelectorAll('tr').length;
        const totalColunas = thead.querySelectorAll('th').length;
        
        console.log(`📊 VERIFICAÇÃO:`);
        console.log(`   Linhas: ${totalLinhas} (esperado: ${linhas})`);
        console.log(`   Colunas: ${totalColunas} (esperado: ${colunas})`);
        
        if (totalLinhas !== linhas || totalColunas !== colunas) {
            console.error('❌ ERRO: Dimensões incorretas!');
            alert(`❌ Erro na criação!\n\nEsperado: ${linhas}x${colunas}\nObtido: ${totalLinhas}x${totalColunas}`);
            return;
        }
        
        // ✅ 10. ADICIONAR TABELA AO WRAPPER
        wrapper.appendChild(tabela);
        
        // ✅ 11. BOTÃO DE EXCLUSÃO
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-element-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Excluir tabela';
        
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('🗑️ Excluir esta tabela?')) {
                wrapper.style.transition = 'all 0.3s ease';
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    wrapper.remove();
                    if (sistema?.salvarDados) sistema.salvarDados();
                    if (sistema?.mostrarToast) {
                        sistema.mostrarToast('🗑️ Tabela excluída!', 'success');
                    }
                }, 300);
            }
        };
        
        wrapper.appendChild(deleteBtn);
        
        // ✅ 12. BUSCAR LOCAL DE INSERÇÃO
        let editableContent = null;
        
        if (sistema?.clickPosition?.paginaClicada) {
            editableContent = sistema.clickPosition.paginaClicada.querySelector('.editable-content');
            console.log('📍 Usando clickPosition');
        }
        
        if (!editableContent) {
            const todasPaginas = Array.from(document.querySelectorAll('.page-content:not(.page-cover)'));
            const paginasValidas = todasPaginas.filter(p => p.querySelector('.editable-content'));
            
            if (paginasValidas.length > 0) {
                editableContent = paginasValidas[paginasValidas.length - 1].querySelector('.editable-content');
                console.log('📍 Usando última página válida');
            }
        }
        
        if (!editableContent) {
            console.error('❌ Local de inserção não encontrado');
            alert('❌ Erro: Não foi possível encontrar onde inserir a tabela.');
            return;
        }
        
        // ✅ 13. INSERIR
        if (sistema?.clickPosition?.element && sistema.inserirElementoNoLocalExato) {
            sistema.inserirElementoNoLocalExato(wrapper, sistema.clickPosition.element);
            console.log('✅ Inserido usando inserirElementoNoLocalExato');
        } else {
            editableContent.appendChild(wrapper);
            console.log('✅ Inserido usando appendChild');
        }
        
        // ✅ 14. FECHAR MODAL
        if (typeof fecharModalTabela === 'function') {
            fecharModalTabela();
        } else if (typeof fecharModalTabelaSeguro === 'function') {
            fecharModalTabelaSeguro();
        } else {
            const modal = document.getElementById('modalTabelaOverlay');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        }
        
        console.log('✅ Modal fechado');
        
        // ✅ 15. SALVAR
        if (sistema?.salvarDados) {
            setTimeout(() => sistema.salvarDados(), 500);
        }
        
        // ✅ 16. TOAST COM VALORES DINÂMICOS
        if (sistema?.mostrarToast) {
            sistema.mostrarToast(`✅ Tabela ${linhas}x${colunas} inserida!`, 'success');
        }
        
        // ✅ 17. SCROLL
        setTimeout(() => {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        console.log(`🎉 ===== SUCESSO: Tabela ${linhas}x${colunas} criada! =====`);
        
    } catch (error) {
        console.error('❌ ERRO CRÍTICO:', error);
        alert('❌ Erro ao criar tabela:\n\n' + error.message);
    } finally {
        // ✅ 18. RETOMAR MONITORAMENTO
        setTimeout(() => {
            if (window.retomarMonitoramento) {
                window.retomarMonitoramento();
            }
        }, 1000);
    }
};

// ✅ CRIAR TAMBÉM COMO FUNÇÃO NORMAL (para compatibilidade)
function confirmarTabela() {
    window.confirmarTabela();
}
window.confirmarImagem = function() {
    console.log('🖼️ confirmarImagem chamada');
    
    // ✅ PAUSAR MONITORAMENTO
    window.pausarMonitoramento();
    
    try {
        const fileInput = document.getElementById('imagemInput');
        const legenda = document.getElementById('legendaImagem').value;
        
        if (!fileInput || fileInput.files.length === 0) {
            alert('⚠️ Selecione uma imagem!');
            return;
        }
        
        const file = fileInput.files[0];
        console.log('📸 Processando imagem:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imagemSrc = e.target.result;
                
                const container = document.createElement('div');
                container.className = 'photo-item editable-photo';
                
                const img = document.createElement('img');
                img.src = imagemSrc;
                img.alt = legenda;
                img.onclick = function() { trocarImagem(this); };
                img.title = 'Clique para trocar imagem';
                
                const caption = document.createElement('div');
                caption.className = 'photo-caption editable-text';
                caption.contentEditable = true;
                caption.textContent = legenda || `Figura ${sistema.figureCounter++} - Nova imagem`;
                
                container.appendChild(img);
                container.appendChild(caption);
                
                // Inserir no documento
                if (sistema && sistema.clickPosition && sistema.clickPosition.element) {
                    sistema.inserirElementoNoLocalExato(container, sistema.clickPosition.element);
                } else {
                    // Fallback: inserir na última página
                    const ultimaPagina = document.querySelector('.page-content:last-of-type');
                    const editableContent = ultimaPagina?.querySelector('.editable-content');
                    if (editableContent) {
                        editableContent.appendChild(container);
                    }
                }
                
                // Fechar modal
                fecharModalImagem();
                
                // Salvar
                if (sistema && sistema.salvarDados) {
                    sistema.salvarDados();
                }
                
                // Toast
                if (sistema && sistema.mostrarToast) {
                    sistema.mostrarToast('✅ Imagem inserida!', 'success');
                }
                
                console.log('✅ Imagem inserida com sucesso');
                
            } catch (error) {
                console.error('❌ Erro ao processar imagem:', error);
                alert('❌ Erro ao processar imagem: ' + error.message);
            } finally {
                // ✅ RETOMAR MONITORAMENTO APÓS 1 SEGUNDO
                setTimeout(() => {
                    window.retomarMonitoramento();
                }, 1000);
            }
        };
        
        reader.onerror = (error) => {
            console.error('❌ Erro ao ler arquivo:', error);
            alert('❌ Erro ao ler arquivo de imagem');
            window.retomarMonitoramento();
        };
        
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error('❌ Erro ao confirmar imagem:', error);
        alert('❌ Erro ao inserir imagem: ' + error.message);
        window.retomarMonitoramento();
    }
};



window.fecharModalTabela = function() {
    console.log('🔒 Fechando modal de tabela...');
    const overlay = document.getElementById('modalTabelaOverlay');
    if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            console.log('✅ Modal de tabela removido');
        }, 300);
    }
    // Remover qualquer backdrop órfão
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
};

window.fecharModalImagem = function() {
    console.log('🔒 Fechando modal de imagem...');
    const overlay = document.getElementById('modalImagemOverlay');
    if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            console.log('✅ Modal de imagem removido');
        }, 300);
    }
    // Remover qualquer backdrop órfão
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
};

// ==================== CORREÇÃO: NÃO INTERFERIR NOS MODAIS ====================

class ControladorDeColagemManual {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎮 Controlador Manual de Colagem ATIVO');
        
        document.addEventListener('paste', (e) => {
            const target = e.target;
            
            // ✅ VERIFICAÇÕES DE SEGURANÇA
            // 1. Deve ser contentEditable
            // 2. Deve ser smart-paragraph-content
            // 3. NÃO deve estar dentro de modal
            // 4. NÃO deve ser input/textarea
            
            const dentroDeModal = target.closest('.modal, .modal-overlay, .modal-container');
            const ehInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
            const ehSmartParagraph = target.classList.contains('smart-paragraph-content');
            const dentroDeConteudo = target.closest('.editable-content');
            
            // ✅ APENAS processar se for smart-paragraph E não estiver em modal
            if (ehSmartParagraph && 
                dentroDeConteudo && 
                !dentroDeModal && 
                !ehInput &&
                target.isContentEditable) {
                
                console.log('✅ Colagem válida em parágrafo - processando');
                
                // Prevenir colagem padrão
                e.preventDefault();
                e.stopPropagation();
                
                // Obter texto
                const texto = e.clipboardData.getData('text/plain');
                
                if (!texto) {
                    console.warn('⚠️ Clipboard vazio');
                    return;
                }
                
                console.log(`📋 Texto: ${texto.length} caracteres`);
                
                // Inserir texto no final
                this.inserirTextoNoFinal(target, texto);
                
            } else {
                console.log('ℹ️ Colagem em outro elemento - ignorando');
                console.log(`   Elemento: ${target.tagName}`);
                console.log(`   Dentro de modal: ${!!dentroDeModal}`);
                console.log(`   É input: ${ehInput}`);
                console.log(`   É smart-paragraph: ${ehSmartParagraph}`);
            }
        }, true); // useCapture = true
    }

    inserirTextoNoFinal(elemento, texto) {
        console.log('✍️ Inserindo texto no final...');
        
        // Flag para prevenir outros listeners
        elemento.dataset.colando = 'true';
        elemento.classList.add('pasting');
        
        // Obter texto atual
        const textoAtual = elemento.textContent;
        
        // Concatenar no final
        const textoNovo = textoAtual + texto;
        
        // Aplicar
        elemento.textContent = textoNovo;
        
        console.log(`✅ Texto inserido (total: ${textoNovo.length})`);
        
        // ✅ POSICIONAR CURSOR NO FINAL IMEDIATAMENTE
        this.posicionarCursorFinal(elemento);
        
        // Remover flags
        setTimeout(() => {
            elemento.classList.remove('pasting');
            delete elemento.dataset.colando;
        }, 100);
        
        // Highlight
        elemento.classList.add('just-pasted');
        setTimeout(() => {
            elemento.classList.remove('just-pasted');
        }, 1000);
        
        // Verificar quebra depois
        setTimeout(() => {
            if (sistema && sistema.verificarQuebraAutomatica) {
                sistema.verificarQuebraAutomatica(elemento);
                
                // Garantir cursor no final após quebra
                setTimeout(() => {
                    this.garantirCursorNoFinalGlobal();
                }, 800);
            }
        }, 300);
    }

    posicionarCursorFinal(elemento) {
        elemento.focus();
        
        const sel = window.getSelection();
        const range = document.createRange();
        
        sel.removeAllRanges();
        
        // Pegar último nó de texto
        const walker = document.createTreeWalker(
            elemento,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let ultimoTexto = null;
        while (walker.nextNode()) {
            ultimoTexto = walker.currentNode;
        }
        
        if (ultimoTexto) {
            const tamanho = ultimoTexto.length;
            range.setStart(ultimoTexto, tamanho);
            range.setEnd(ultimoTexto, tamanho);
            sel.addRange(range);
            
            console.log(`🎯 Cursor: posição ${tamanho} (final)`);
        } else {
            range.selectNodeContents(elemento);
            range.collapse(false);
            sel.addRange(range);
        }
    }

    garantirCursorNoFinalGlobal() {
        console.log('🌍 Garantindo cursor no final global...');
        
        const paginas = document.querySelectorAll('.page-content:not(.page-cover)');
        
        if (paginas.length === 0) return;
        
        const ultimaPagina = paginas[paginas.length - 1];
        const paragrafos = ultimaPagina.querySelectorAll('.smart-paragraph-content');
        
        if (paragrafos.length === 0) return;
        
        const ultimoParagrafo = paragrafos[paragrafos.length - 1];
        
        console.log(`✅ Reposicionando cursor no último parágrafo`);
        
        this.posicionarCursorFinal(ultimoParagrafo);
        
        // Scroll suave
        setTimeout(() => {
            ultimoParagrafo.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

// ✅ INSTANCIAR (substituindo o antigo)
let controladorColagem;

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        controladorColagem = new ControladorDeColagemManual();
        console.log('✅ Controlador de Colagem ATIVO');
    }, 1000);
});