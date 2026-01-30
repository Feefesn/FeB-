// ⚠️ ALTERE ESTA DATA PARA O DIA QUE VOCÊS COMEÇARAM A NAMORAR
// Formato: Ano, Mês (0-11, onde 0 = Janeiro), Dia, Hora, Minuto
const startDate = new Date(2025, 5, 10, 20, 2);

// ==================== UTILITÁRIOS ====================
const $ = id => document.getElementById(id);

// ==================== CONTEÚDOS ====================
const romanticQuotes = [
    "Você é a razão do meu sorriso todos os dias 💕",
    "Você é o au do do meu tismo 💖",
    "Meu amor por você cresce a cada segundo ⏰",
    "Você é meu lugar favorito no mundo 🌍",
    "Tu é a tampa eu a panela! ✨",
    "Você é a melhor coisa que já me aconteceu 🫶",
    "Fica com eu pra sempre 😎",
    "Ja falei que seu olhar e lindu? 🧩",
    "Naum preciso ir para o espaço ver as estrelas, a mais perfeita e bilhosa me chama de momo 🚀",
    "Você é meu sonho que virou realidade 💫"
];

const loveLetterTemplates = [
    `Meu amor,\n\nCada dia ao seu lado é uma bênção. Você ilumina minha vida...\n\nCom todo meu amor,\n[Seu nome]`,
    `Amor da minha vida,\n\nQuando penso em tudo que vivemos juntos...\n\nPara sempre seu(sua),\n[Seu nome]`
];



// ==================== CORAÇÕES DE FUNDO ====================
function createHeart() {
    const container = document.querySelector('.heart-background');
    if (!container) return;
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(heart);
    setTimeout(() => { if (heart && heart.parentNode) heart.remove(); }, 20000);
}

// ==================== ANIMAÇÃO DE BEIJO ====================
function createKissAnimation(anchorEl) {
    try {
        const container = document.querySelector('.container') || document.body;
        const kiss = document.createElement('div');
        kiss.className = 'kiss-bubble';
        kiss.innerText = '💋';
        kiss.style.position = 'absolute';
        kiss.style.fontSize = '28px';
        kiss.style.pointerEvents = 'none';
        kiss.style.transition = 'transform 800ms ease, opacity 800ms ease';
        const rect = anchorEl.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        kiss.style.left = (rect.left + rect.width / 2 - contRect.left - 14) + 'px';
        kiss.style.top = (rect.top - contRect.top - 10) + 'px';
        container.appendChild(kiss);
        requestAnimationFrame(() => {
            kiss.style.transform = 'translateY(-120px) scale(1.6)';
            kiss.style.opacity = '0';
        });
        setTimeout(() => { if (kiss && kiss.parentNode) kiss.remove(); }, 900);
    } catch (e) {
        console.warn('Erro criando animação de beijo', e);
    }
}

// ==================== FRASES ALEATÓRIAS ====================
function showRandomQuote() {
    const el = $('randomQuote');
    if (!el) return;
    el.textContent = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];
}

// (legacy/duplicate gallery implementation removed)
function deletePhoto(index) {
    const photos = JSON.parse(localStorage.getItem('lovePhotos') || '[]');
    if (index < photos.length) {
        photos.splice(index, 1);
        localStorage.setItem('lovePhotos', JSON.stringify(photos));
        loadPhotos();
    } else {
        showToast('Foto vem da pasta pública. Remova ela de /photos e atualize photos/list.json');
    }
}

// File selector removed: adding photos via file input has been disabled per user request.

// Playlist removed: background music is handled separately

// ==================== CONTADOR DE BEIJOS ====================
function loadKissCount() {
    const count = localStorage.getItem('kissCount') || 0;
    const el = document.getElementById('kissCount');
    if (el) el.textContent = count;
}

document.getElementById('kissBtn')?.addEventListener('click', function() {
    const countEl = document.getElementById('kissCount');
    const current = parseInt(countEl?.textContent) || 0;
    const count = current + 1;
    if (countEl) countEl.textContent = count;
    localStorage.setItem('kissCount', count.toString());
    createKissAnimation(this);
});

// ==================== CARTA DE AMOR (open-only)
// The letter text is taken from localStorage key 'predefinedLetter'.
function getPredefinedLetter() {
    return localStorage.getItem('predefinedLetter') || '';
}

window._loveApp = window._loveApp || {};
window._loveApp.setLetterText = function(text) {
    localStorage.setItem('predefinedLetter', text);
};

// Abrir carta em overlay (full-screen)
function createLetterOverlay(text) {
    // remove previous overlay if exists
    const prev = document.querySelector('.letter-overlay');
    if (prev) prev.remove();

    const overlay = document.createElement('div');
    overlay.className = 'letter-overlay';
    overlay.innerHTML = `
        <div class="letter-modal" role="dialog" aria-modal="true">
            <button class="letter-close" aria-label="Fechar">✕</button>
            <pre class="letter-full" style="white-space: pre-wrap;">${text}</pre>
        </div>
    `;
    document.body.appendChild(overlay);

    // prevent background scroll
    document.body.classList.add('no-scroll');

    const closeOverlay = () => {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => { if (e.key === 'Escape') closeOverlay(); };
    document.addEventListener('keydown', onKeyDown);

    overlay.querySelector('.letter-close').addEventListener('click', closeOverlay);

    // click outside the modal closes it
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
}

$('openLetterBtn')?.addEventListener('click', () => {
    const text = getPredefinedLetter() || (document.getElementById('letterContent')?.innerText) || loveLetterTemplates[Math.floor(Math.random() * loveLetterTemplates.length)];
    createLetterOverlay(text);
});

// ==================== CLIMA DO RELACIONAMENTO ====================
// (legacy textual mood renderer removed; using emoji-only renderer below)

const moodMap = {
    amazing: { emoji: '🥰', label: 'Incrível' },
    happy: { emoji: '😊', label: 'Feliz' },
    normal: { emoji: '😌', label: 'Normal' },
    sad: { emoji: '😢', label: 'Triste' }
};

function updateMood(moodKey) {
    const map = moodMap[moodKey] || { emoji: '💗' };
    // show current mood emoji only
    const curr = document.getElementById('currentMood');
    if (curr) {
        curr.innerHTML = `<div class="current-mood-emoji">${map.emoji}</div>`;
        curr.classList.remove('pulse');
        // trigger animation
        void curr.offsetWidth;
        curr.classList.add('pulse');
    }

    // store emoji only in history
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    history.push(map.emoji);
    localStorage.setItem('moodHistory', JSON.stringify(history));
    loadMoodHistory();
}

document.querySelectorAll('.mood-btn').forEach(btn => btn.addEventListener('click', () => updateMood(btn.dataset.mood)));

function loadMoodHistory() {
    const container = document.getElementById('moodHistory');
    if (!container) return;
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    container.innerHTML = '';
    history.slice().reverse().forEach(m => {
        const span = document.createElement('span');
        span.className = 'mood-history-item';
        span.textContent = m;
        container.appendChild(span);
    });
}

// ==================== DATES / UI ====================
function loadDateInfo() {
    if ($('startDate')) $('startDate').textContent = formatDate(startDate);
    if ($('nextAnniversary')) $('nextAnniversary').textContent = calculateNextMesversary();
}

$('clearDataBtn')?.addEventListener('click', function () {
    // remove only app keys to be safer
    ['lovePhotos', 'kissCount', 'moodHistory', 'musicPlaying'].forEach(k => localStorage.removeItem(k));
    loadDateInfo(); loadPhotos(); loadKissCount(); loadMoodHistory();
});

function updateUI() {
    updateCounter();
    loadPhotos();
    loadKissCount();
    loadMoodHistory();
    // set current mood from last history entry (emoji-only)
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    if (history && history.length) {
        const last = history[history.length - 1];
        const curr = document.getElementById('currentMood');
        if (curr) {
            curr.innerHTML = `<div class="current-mood-emoji">${last}</div>`;
            curr.classList.remove('pulse'); void curr.offsetWidth; curr.classList.add('pulse');
        }
    }
    loadDateInfo();
}

// ==================== TIMERS / INIT ====================
function ensurePredefinedLetter() {
    const key = 'predefinedLetter';
    if (!localStorage.getItem(key)) {
        const text = `Pequenina, não é aniversário de namoro, não é data especial. Para ti não é necessário ter explicação pra te presentear, pra te deixar feliz, pra te amar de verdade. Do dia 1 a dia 30/31 tu merece tudo de bom!

Na contagem acima mostra quanto tempo temos juntos, mas já parece anos e anos por quanto tu esteve comigo... e sinceramente quero ficar até Cristo voltar, ninguém sabe o dia e a hora então vou aproveitar contigo ao seu lado sempre, carregando o evangelho que Jeová deixou para nos. Sempre amando a menina que Ele me deu, pra através de você Ele me dar força, animo, coragem...

Lembro-me de quando te vi pela primeira vez, mas principalmente do teu olhar... Um olhar que cativa, que transmite tanta força e doçura ao mesmo tempo. E o teu jeito, tão único e especial, me encanta a cada dia. Tua força, menina, é inspiradora, a forma como enfrentas os desafios me motiva a ser um homem melhor.

Tenho tantas lembranças guardadas de nós... como esquecer de quando você no aniversário da Carol, tu foi la sem nem disfarçar tirou aquela foto eu e tu tu e eu.

Meu sonho contigo é construir um lar, uma casa comprada com nossas mãos e cheia de amor. Quero formar uma família abençoada, ter tudo o que Deus tem reservado para nós, lado a lado, enfrentando os desafios e celebrando cada vitória.

Cristo nos ensina sobre a força da união, a importância de estarmos juntos, como uma corda com três dobras. É muito mais forte do que sozinha, e é assim que sinto nosso amor, uma força que nos sustenta e nos impulsiona.

Enquanto eu amar Cristo, sempre te amarei, e isso é... SEMPRE. Meu humor pode falhar, minha mente pode se perder, mas meu amor por você é constante

Você é única, meu amor. Nada se compara à beleza que reside em teu ser. Deus fez você com tanto capricho, com tanto amor, que nada neste mundo se compara à sua essência.

Eu te amo, hoje e para sempre.`;
        localStorage.setItem(key, text);
    }
}

function initApp() {
    ensurePredefinedLetter();
    updateUI();
    setInterval(updateCounter, 1000);
    setInterval(createHeart, 1500);
    showRandomQuote();
    setInterval(showRandomQuote, 4000); // atualizar frases a cada 4s
    // atualizar mesversário a cada minuto
    setInterval(loadDateInfo, 60 * 1000);

    // music setup
    setupMusic();
}

// ==================== MÚSICA DE FUNDO (YOUTUBE EMBED) ====================
const YT_ID = 'I7nxU_S3How';
// Arquivo MP3 local padrão (colocado em pasta "music")
const DEFAULT_LOCAL_MP3 = 'music/Best Part - Daniel Caesar ft. H.E.R. (Acoustic Instrumental) - JustAcoustic (youtube).mp3';
function ensureMusicFrame() {
    let f = document.getElementById('bgMusicFrame');
    if (!f) {
        f = document.createElement('iframe');
        f.id = 'bgMusicFrame';
        f.width = 0; f.height = 0; f.style.border = '0'; f.style.position = 'fixed'; f.style.left = '-9999px';
        // allow autoplay and encrypted-media for better compatibility
        f.allow = 'autoplay; encrypted-media';
        f.setAttribute('allowfullscreen', '');
        f.title = 'Music embed';
        document.body.appendChild(f);
    }
    return f;
}

// MP3 upload/persistência removida: o player agora tenta usar um MP3 padrão colocado na pasta `music/` (definido em `DEFAULT_LOCAL_MP3`) ou usa o embed do YouTube como fallback.
// Para colocar músicas manualmente, copie um arquivo para a pasta `music/` e atualize o nome em `DEFAULT_LOCAL_MP3` se necessário.



function startMusic() {
    const audio = document.getElementById('bgAudio');
    const btn = $('musicBtn');
    if (!audio) {
        showToast('Elemento de áudio não encontrado');
        return;
    }

    // Ensure the audio element points to the local MP3 first
    if (!audio.src || audio.dataset.tried !== '1') {
        try {
            audio.src = encodeURI(DEFAULT_LOCAL_MP3);
            audio.load();
            audio.dataset.tried = '1';
        } catch (e) {
            console.warn('Erro atribuindo src do MP3:', e);
        }
    }

    // Try to play the local MP3. If it fails, inform the user (no automatic YouTube fallback — mp3 preferred)
    audio.play().then(() => {
        btn?.classList.add('playing');
        localStorage.setItem('musicPlaying', '1');
        showToast('Tocando MP3 local');
    }).catch((err) => {
        console.warn('Falha ao tocar MP3 local:', err);
        try { audio.removeAttribute('src'); } catch (e) {}
        btn?.classList.remove('playing');
        localStorage.setItem('musicPlaying', '0');
        showToast('Não foi possível tocar o MP3 local. Verifique se o arquivo existe em /music e clique novamente');
    });
}

function stopMusic() {
    const audio = document.getElementById('bgAudio');
    try {
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    } catch (e) { /* ignore */ }

    const f = document.getElementById('bgMusicFrame');
    if (f && f.parentNode) {
        f.src = '';
    }

    const btn = $('musicBtn');
    btn?.classList.remove('playing');
    localStorage.setItem('musicPlaying', '0');
}

function showToast(msg, duration = 2000) {
    let t = document.querySelector('.app-toast');
    if (!t) {
        t = document.createElement('div');
        t.className = 'app-toast';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), duration);
}

async function setupMusic() {
    const musicBtn = $('musicBtn');
    const audio = $('bgAudio');
    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
        const isPlaying = musicBtn.classList.contains('playing');
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });

    // Tentativa simples de carregar o MP3 padrão se o arquivo estiver na pasta 'music'.
    // Usamos atribuição direta (sem HEAD), para funcionar também quando o arquivo está acessível via file://
    if (audio && !audio.src) {
        try {
            audio.src = encodeURI(DEFAULT_LOCAL_MP3);
            audio.volume = 0.8;
            audio.addEventListener('canplay', function onCan() {
                // pronto — não tocar automaticamente sem gesto
                audio.removeEventListener('canplay', onCan);
            });
            audio.addEventListener('error', function onErr() {
                // Falha ao carregar: limpa a src para não interferir e será feito fallback ao tentar tocar
                audio.removeEventListener('error', onErr);
                audio.removeAttribute('src');
                showToast('MP3 local não encontrado na pasta "music" — usando YouTube');
            });
        } catch (e) {
            // silencioso
        }
    }

    // Restaurar estado (tocar automaticamente se estava tocando antes)
    if (localStorage.getItem('musicPlaying') === '1') {
        startMusic();
    }
}


// expose small helper for debugging
window._loveApp = Object.assign(window._loveApp || {}, { updateUI, startMusic, stopMusic, createKissAnimation, setLetterText: window._loveApp.setLetterText, getPredefinedLetter });

// DOM ready init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


// ==================== FUNÇÕES DE DATA E CONTADOR (MESVERSÁRIO) ====================
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
}

function calculateNextMesversary() {
    const now = new Date();
    // Próximo dia do mês igual ao startDate.getDate()
    let candidate = new Date(now.getFullYear(), now.getMonth(), startDate.getDate());
    if (candidate <= now) candidate = new Date(now.getFullYear(), now.getMonth() + 1, startDate.getDate());
    const daysUntil = Math.ceil((candidate - now) / (1000 * 60 * 60 * 24));
    return `${daysUntil} dias (${formatDate(candidate)})`;
}

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const el = id => document.getElementById(id);
    if (el('days')) el('days').textContent = days;
    if (el('hours')) el('hours').textContent = hours;
    if (el('minutes')) el('minutes').textContent = minutes;
    if (el('seconds')) el('seconds').textContent = seconds;
    if (el('weeks')) el('weeks').textContent = Math.floor(days / 7);
    if (el('months')) el('months').textContent = Math.floor(days / 30);
    if (el('totalHours')) el('totalHours').textContent = Math.floor(days * 24 + hours);
}

// ==================== CORAÇÕES ANIMADOS ====================
function createHeart() {
    const container = document.querySelector('.heart-background');
    if (!container) return;
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(heart);
    setTimeout(() => { if (heart && heart.parentNode) heart.remove(); }, 20000);
}

// ==================== ANIMAÇÃO DE BEIJO ====================
function createKissAnimation(anchorEl) {
    const container = document.querySelector('.container') || document.body;
    const kiss = document.createElement('div');
    kiss.className = 'kiss-bubble';
    kiss.innerText = '💋';
    kiss.style.position = 'absolute';
    kiss.style.fontSize = '28px';
    kiss.style.pointerEvents = 'none';
    kiss.style.transition = 'transform 800ms ease, opacity 800ms ease';
    const rect = anchorEl.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    kiss.style.left = (rect.left + rect.width / 2 - contRect.left - 14) + 'px';
    kiss.style.top = (rect.top - contRect.top - 10) + 'px';
    container.appendChild(kiss);
    requestAnimationFrame(() => {
        kiss.style.transform = 'translateY(-120px) scale(1.6)';
        kiss.style.opacity = '0';
    });
    setTimeout(() => { if (kiss && kiss.parentNode) kiss.remove(); }, 900);
}

// (duplicate showRandomQuote removed — single implementation kept above)

// Gallery implementation consolidated below. Duplicate removed to avoid multiple definitions.




// Playlist removed — music will be background-only via YouTube embed

// (Letter generator removed — open-only flow uses predefined text via window._loveApp.setLetterText)

// (reserved space for mood functions; emoji-only renderer defined earlier)

// (duplicate date/contador block removed)

// (duplicate showRandomQuote removed — single implementation kept above)

// ==================== GALERIA DE FOTOS ====================
async function loadPhotosLegacy() {
    const gallery = $('photoGallery');
    if (!gallery) return;

    // start with photos from localStorage
    const stored = JSON.parse(localStorage.getItem('lovePhotos') || '[]');
    const photos = stored.slice();

    // try to load a photos/list.json manifest from the /photos folder
    try {
        const resp = await fetch('photos/list.json', { cache: 'no-cache' });
        if (resp.ok) {
            const list = await resp.json();
            if (Array.isArray(list)) {
                list.forEach(p => {
                    // if the entry is a full URL or data URI, use as-is; otherwise prefix with photos/
                    if (/^(https?:|data:)/i.test(p)) photos.push(p);
                    else photos.push('photos/' + p);
                });
            }
        }
    } catch (e) {
        // ignore if not present
    }

    // if no photos at all, show instructions to add photos to the folder (read-only gallery)
    if (!photos.length) {
        gallery.innerHTML = '<div style="color:#bbb; max-width:460px; text-align:center;">\n            <p style="margin-bottom:6px;">Nenhuma foto encontrada.</p>\n            <p style="font-size:0.9rem; color:#ccc;">Coloque imagens em <code>photos/</code> e liste os nomes em <code>photos/list.json</code>. Recarregue a página.</p>\n        </div>';
        return;
    }

    // build carousel
    gallery.innerHTML = '';
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    carousel.tabIndex = 0;

    const leftBtn = document.createElement('button');
    leftBtn.className = 'carousel-btn left';
    leftBtn.setAttribute('aria-label', 'Anterior');
    leftBtn.textContent = '◀';

    const rightBtn = document.createElement('button');
    rightBtn.className = 'carousel-btn right';
    rightBtn.setAttribute('aria-label', 'Próxima');
    rightBtn.textContent = '▶';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    photos.forEach((photo, idx) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const img = document.createElement('img');
        img.src = photo;
        img.alt = 'Momento ' + (idx + 1);
        slide.appendChild(img);

        // only allow deleting if the image is from localStorage (stored array)
        if (idx < stored.length) {
            const del = document.createElement('button');
            del.className = 'delete-photo';
            del.title = 'Remover foto';
            del.textContent = '✖';
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                const arr = JSON.parse(localStorage.getItem('lovePhotos') || '[]');
                arr.splice(idx, 1);
                localStorage.setItem('lovePhotos', JSON.stringify(arr));
                showToast('Foto removida');
                loadPhotos();
            });
            slide.appendChild(del);
        }

        track.appendChild(slide);
    });

    carousel.appendChild(leftBtn);
    carousel.appendChild(track);
    carousel.appendChild(rightBtn);


    gallery.appendChild(carousel);

    const slides = Array.from(track.children);
    let current = 0;

    function show(i) {
        current = (i + slides.length) % slides.length;
        slides.forEach((s, idx) => {
            s.classList.remove('active', 'prev', 'next');
            if (idx === current) s.classList.add('active');
            else if (idx === (current - 1 + slides.length) % slides.length) s.classList.add('prev');
            else if (idx === (current + 1) % slides.length) s.classList.add('next');
        });
    }

    show(0);

    leftBtn.addEventListener('click', () => show(current - 1));
    rightBtn.addEventListener('click', () => show(current + 1));

    // allow keyboard navigation when carousel focused
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') leftBtn.click();
        if (e.key === 'ArrowRight') rightBtn.click();
    });

    // clicking a non-active slide will jump to it
    slides.forEach((s, idx) => s.addEventListener('click', () => { if (idx !== current) show(idx); }));
}

// Enhanced gallery loader: shows status and per-image load/error diagnostics
async function loadPhotos() {
    const gallery = $('photoGallery');
    if (!gallery) return;

    gallery.innerHTML = '';
    const status = document.createElement('div');
    status.className = 'photo-status';
    status.style.color = '#ddd';
    status.style.fontSize = '0.95rem';
    status.style.textAlign = 'center';
    status.style.marginBottom = '8px';
    status.textContent = 'Tentando carregar fotos...';
    gallery.appendChild(status);

    const stored = JSON.parse(localStorage.getItem('lovePhotos') || '[]');
    const photos = stored.slice();

    try {
        const resp = await fetch('photos/list.json', { cache: 'no-cache' });
        if (resp.ok) {
            const list = await resp.json();
            if (Array.isArray(list)) {
                list.forEach(p => {
                    if (/^(https?:|data:)/i.test(p)) photos.push(p);
                    else photos.push('photos/' + p);
                });
            }
        } else {
            status.textContent = `Não foi possível ler photos/list.json (status ${resp.status}). Tentando carregar imagens listadas...`;
        }
    } catch (e) {
        status.textContent = 'Erro ao carregar photos/list.json (modo file:// pode bloquear fetch). Tentando carregar imagens listadas mesmo assim...';
    }

    // Fallback probe for local files (useful when opened via file://)
    if (!photos.length) {
        status.textContent = 'Procurando por arquivos em photos/ (foto1..foto10, img1..), aguarde...';
        const probes = [];
        for (let i = 1; i <= 10; i++) {
            probes.push(`photos/foto${i}.jpg`);
            probes.push(`photos/foto${i}.jpg`);
            probes.push(`photos/foto${i}.png`);
            probes.push(`photos/img${i}.jpg`);
            probes.push(`photos/image${i}.jpg`);
        }
        probes.forEach(p => { if (!photos.includes(p)) photos.push(p); });

        const p1 = document.createElement('p');
        p1.style.marginBottom = '6px';
        p1.textContent = 'Nenhuma foto encontrada.';

        const p2 = document.createElement('p');
        p2.style.fontSize = '0.9rem';
        p2.style.color = '#ccc';
        p2.innerHTML = 'Coloque imagens em <code>photos/</code> e liste os nomes em <code>photos/list.json</code>.';

        const btn = document.createElement('button');
        btn.textContent = 'Atualizar';
        btn.style.cssText = 'margin-left:6px; padding:6px 8px; border-radius:6px; border:none; background:#ff7bb3; color:white; cursor:pointer;';
        btn.addEventListener('click', () => loadPhotos());

        const wrapper = document.createElement('div');
        p2.appendChild(btn);
        wrapper.appendChild(p1);
        wrapper.appendChild(p2);
        gallery.appendChild(wrapper);
        return;
    }

    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    carousel.tabIndex = 0;

    const leftBtn = document.createElement('button');
    leftBtn.className = 'carousel-btn left';
    leftBtn.setAttribute('aria-label', 'Anterior');
    leftBtn.textContent = '◀';

    const rightBtn = document.createElement('button');
    rightBtn.className = 'carousel-btn right';
    rightBtn.setAttribute('aria-label', 'Próxima');
    rightBtn.textContent = '▶';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    let total = photos.length;
    let loadedCount = 0;

    photos.forEach((photo, idx) => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const img = document.createElement('img');
        img.alt = 'Momento ' + (idx + 1);

        img.addEventListener('load', () => {
            loadedCount++;
            status.textContent = `Fotos carregadas: ${loadedCount}/${total}`;
            if (loadedCount === 1) show(0);
        });
        img.addEventListener('error', () => {
            img.classList.add('img-error');
            status.textContent = `Fotos carregadas: ${loadedCount}/${total} (algumas falharam)`;
        });

        img.src = photo;

        slide.appendChild(img);

        if (idx < stored.length) {
            const del = document.createElement('button');
            del.className = 'delete-photo';
            del.title = 'Remover foto';
            del.textContent = '✖';
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                const arr = JSON.parse(localStorage.getItem('lovePhotos') || '[]');
                arr.splice(idx, 1);
                localStorage.setItem('lovePhotos', JSON.stringify(arr));
                showToast('Foto removida');
                loadPhotos();
            });
            slide.appendChild(del);
        }

        track.appendChild(slide);
    });

    carousel.appendChild(leftBtn);
    carousel.appendChild(track);
    carousel.appendChild(rightBtn);

    gallery.appendChild(carousel);

    const slides = Array.from(track.children);
    let current = 0;

    function show(i) {
        if (!slides.length) return;
        current = (i + slides.length) % slides.length;
        slides.forEach((s, idx) => {
            s.classList.remove('active', 'prev', 'next');
            if (idx === current) s.classList.add('active');
            else if (idx === (current - 1 + slides.length) % slides.length) s.classList.add('prev');
            else if (idx === (current + 1) % slides.length) s.classList.add('next');
        });
    }

    setTimeout(() => {
        if (loadedCount === 0) {
            status.textContent = 'Nenhuma imagem carregou. Se estiver abrindo o arquivo localmente (file://), experimente rodar um servidor local (ex: npx http-server) e recarregue a página. Depois clique em Atualizar.';
            show(0);
        }
    }, 700);

    leftBtn.addEventListener('click', () => show(current - 1));
    rightBtn.addEventListener('click', () => show(current + 1));

    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') leftBtn.click();
        if (e.key === 'ArrowRight') rightBtn.click();
    });

    slides.forEach((s, idx) => s.addEventListener('click', () => { if (idx !== current) show(idx); }));
}

function deletePhoto(index) {
    const photos = JSON.parse(localStorage.getItem('lovePhotos') || '[]');
    if (index < photos.length) {
        photos.splice(index, 1);
        localStorage.setItem('lovePhotos', JSON.stringify(photos));
        loadPhotos();
    } else {
        showToast('Foto vem da pasta pública. Remova ela de /photos e atualize photos/list.json');
    }
}
// Motivos/Memórias removidos — funcionalidades obsoletas removidas para simplificar o site.

/* EOF */