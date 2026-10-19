(function() {
  const banner = document.getElementById('pwa-install-banner');
  const installBtn = document.getElementById('btn-pwa-install');
  const closeBtn = document.getElementById('btn-close-pwa-banner');

  // 1. Si la App ya está instalada o el usuario ya la cerró previamente, no se muestra nada
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone || localStorage.getItem('pwa_installed') === 'true') {
    if (banner) banner.classList.add('hidden');
    return;
  }

  // 2. Registrar el Service Worker externo (sw.js)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registrado correctamente:', reg.scope))
      .catch((err) => console.error('Error registrando Service Worker:', err));
  }

  // 3. Capturar el evento nativo de descarga
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Solo revela el banner si el navegador confirma capacidad de descarga
    if (banner) banner.classList.remove('hidden');
  });

  // 4. Lógica de los botones
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (banner) banner.classList.add('hidden');
          localStorage.setItem('pwa_installed', 'true');
        }
        deferredPrompt = null;
      } else {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS) {
          alert("Para instalar en iPhone:\n1. Presiona el botón 'Compartir' en Safari.\n2. Selecciona 'Agregar a inicio'.");
        } else {
          alert("Abre el menú de tu navegador (⋮) y selecciona 'Instalar aplicación' o 'Agregar a la pantalla principal'.");
        }
        if (banner) banner.classList.add('hidden');
        localStorage.setItem('pwa_installed', 'true');
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (banner) banner.classList.add('hidden');
      localStorage.setItem('pwa_installed', 'true');
    });
  }

  window.addEventListener('appinstalled', () => {
    if (banner) banner.classList.add('hidden');
    localStorage.setItem('pwa_installed', 'true');
  });
})();