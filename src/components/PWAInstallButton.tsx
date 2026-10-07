import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Smartphone,
  X,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

const PUBLIC_WEBAPP_URL =
  'https://ais-pre-wzsxn2j6o4de5imamzahdw-800185784124.europe-west2.run.app';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // If browser blocks fullscreen (e.g. inside restricted iframe), open guide modal
      setShowGuideModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(PUBLIC_WEBAPP_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Direct 1-tap Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Esci da schermo intero' : 'Attiva schermo intero'}
          className="min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="hidden sm:inline">Esci Schermo Intero</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Schermo Intero</span>
            </>
          )}
        </button>

        {!isInstalled && isInstallable && (
          <button
            onClick={install}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Installa Ora</span>
          </button>
        )}

        {!isInstalled && (
          <button
            onClick={() => setShowGuideModal(true)}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Usa su Smartphone</span>
          </button>
        )}
      </div>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Come aprire CronoTri a Schermo Intero su Smartphone
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-sm text-slate-300 leading-relaxed">
              {/* Step 1: Copy Link */}
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <p className="text-xs font-semibold text-white">
                  1. Apri questo link diretto sul browser Chrome del tuo smartphone:
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={PUBLIC_WEBAPP_URL}
                    className="flex-1 min-h-[40px] px-3 py-1.5 text-xs font-mono-tabular bg-slate-950 border border-slate-700 rounded-lg text-slate-200 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copiato!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copia Link</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Ricorda di attivare la condivisione pubblica dal tasto Condividi in alto a destra.
                  </span>
                </p>
              </div>

              {/* Two Fullscreen Methods */}
              <div className="space-y-3">
                <p className="font-semibold text-white">
                  2. Due modi per usarla a tutto schermo:
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm">
                  <p className="font-semibold text-orange-400">
                    Metodo A — Pulsante &quot;Schermo Intero&quot; immediato
                  </p>
                  <p>
                    Una volta aperto il link su Chrome Android, tocca il pulsante <strong>Schermo Intero</strong> in alto a destra nella barra dell&apos;app: la barra degli indirizzi scomparirà subito.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm">
                  <p className="font-semibold text-emerald-400">
                    Metodo B — Installa su Schermata Home (Consigliato)
                  </p>
                  {isIOS ? (
                    <p>
                      Su Safari tocca <strong>Condividi</strong> → <strong>Aggiungi alla schermata Home</strong>. L&apos;app si aprirà sempre a schermo intero.
                    </p>
                  ) : (
                    <p>
                      Su Chrome Android tocca i <strong>tre puntini (⋮)</strong> in alto a destra e seleziona <strong>Installa app</strong> (o <strong>Aggiungi a schermata Home</strong>). Aprendola dall&apos;icona sul telefono partirà sempre automaticamente in <strong>modalità Fullscreen nativa</strong>.
                    </p>
                  )}
                </div>
              </div>

              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full min-h-[44px] rounded-xl bg-orange-600 hover:bg-orange-500 text-white py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Installa Direttamente su questo Dispositivo</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-6 w-full min-h-[44px] rounded-xl bg-white text-slate-900 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>Modalità Offline — Database locale IndexedDB attivo</span>
    </div>
  );
};
