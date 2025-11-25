import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics"; 
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, runTransaction, setDoc, getDoc } from 'firebase/firestore';

// --- SENİN FIREBASE BİLGİLERİN ---
const firebaseConfig = {
  apiKey: "AIzaSyDyVMgYSwuJgsBS4DnnbdPRtzWfYMI8Pr8",
  authDomain: "worldwariii-3b734.firebaseapp.com",
  projectId: "worldwariii-3b734",
  storageBucket: "worldwariii-3b734.firebasestorage.app",
  messagingSenderId: "666707228186",
  appId: "1:666707228186:web:c607eb6cc7c8b741e843a3",
  measurementId: "G-112QRM4TNZ"
};

// Firebase'i Başlat
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'world-war-game-final-v1'; 

const DATA_COLLECTION_NAME = 'globalClickWar';
const DATA_DOC_ID = 'state';

// --- YARDIMCI FONKSİYONLAR ---
const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num);
};

// --- EFEKTLER ---
const Lightning = () => {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const loop = () => {
      const delay = Math.random() * 5000 + 2000;
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
        setTimeout(() => { if(Math.random() > 0.5) { setFlash(true); setTimeout(() => setFlash(false), 100); }}, 200);
        loop();
      }, delay);
    };
    loop();
  }, []);
  return <div className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-100 ${flash ? 'opacity-80' : 'opacity-0'}`}></div>;
};

const Rain = () => {
    const drops = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({ left: Math.random() * 100, delay: Math.random() * 2, duration: Math.random() * 1 + 0.5 })), []);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">
            {drops.map((drop, i) => (
                <div key={i} className="absolute top-[-20px] w-[1px] h-[40px] bg-slate-400/50" style={{ left: `${drop.left}%`, animation: `rain ${drop.duration}s linear infinite`, animationDelay: `-${drop.delay}s` }} />
            ))}
            <style>{`@keyframes rain { 0% { transform: translateY(-100px); } 100% { transform: translateY(110vh); } }`}</style>
        </div>
    );
};

const Steam = ({ intensity }) => {
    if (intensity <= 0.1) return null;
    return (
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="relative w-20 h-20">
          <div className="absolute w-10 h-10 bg-gray-300 rounded-full opacity-30 animate-[steam-rise_2s_ease-out_infinite]" style={{ opacity: intensity * 0.3, top: '10%', left: '10%' }}></div>
          <div className="absolute w-12 h-12 bg-gray-200 rounded-full opacity-40 animate-[steam-rise_2.5s_ease-out_infinite_0.5s]" style={{ opacity: intensity * 0.4, top: '20%', left: '30%' }}></div>
          <div className="absolute w-8 h-8 bg-white rounded-full opacity-50 animate-[steam-rise_3s_ease-out_infinite_1s]" style={{ opacity: intensity * 0.5, top: '5%', left: '50%' }}></div>
        </div>
         <style>{`@keyframes steam-rise { 0% { transform: translateY(0) scale(1); opacity: 0.5; } 50% { opacity: 0.2; } 100% { transform: translateY(-80px) scale(2); opacity: 0; } }`}</style>
      </div>
    );
};

// --- OYUN BİLEŞENLERİ ---
const CameraDrone = ({ side }) => {
    const isLeft = side === 'left';
    return (
        <div className={`absolute top-1/4 ${isLeft ? 'left-4' : 'right-4'} z-40 flex flex-col items-center animate-[bounce_3s_infinite]`}>
             <div className="w-24 h-2 bg-slate-800 rounded-full animate-[spin_0.2s_linear_infinite] mb-1 opacity-80 blur-[1px]"></div>
             <div className="relative w-20 h-14 bg-slate-800 rounded-xl border border-slate-600 shadow-2xl flex items-center justify-center">
                <div className={`absolute ${isLeft ? '-right-3' : '-left-3'} w-4 h-8 bg-slate-900 rounded-sm border border-slate-500 flex items-center justify-center`}>
                    <div className="w-3 h-6 bg-black rounded-[2px] overflow-hidden relative"><div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent to-white/30"></div></div>
                </div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]"></div>
                <div className="text-[8px] text-slate-400 font-mono tracking-tighter">NEWS</div>
                <div className="absolute bottom-[-10px] w-12 h-6 border-l-2 border-r-2 border-slate-600 rounded-b-lg"></div>
             </div>
        </div>
    );
};

const FoodItem = ({ type }) => {
    const isFastFood = type === 'fastfood';
    return (
        // Scale 80% yapıldı ve drop-shadow eklendi
        <div className="relative flex flex-col items-center filter drop-shadow-[0_0_15px_rgba(255,50,0,0.6)] scale-80">
            {isFastFood ? (
                // SAĞ: Fast Food (Xi Düşerse)
                <div className="flex">
                    <div className="relative w-20 h-16 bg-yellow-500 clip-path-pizza rotate-12 mb-[-10px] z-0 border-b-4 border-orange-700">
                        <div className="absolute top-1 left-2 w-3 h-3 bg-red-600 rounded-full"></div><div className="absolute top-4 right-4 w-3 h-3 bg-red-600 rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center z-10">
                        <div className="w-20 h-14 bg-[#b35900] rounded-t-full border-b-4 border-[#e6b800] relative"><div className="absolute top-1 left-3 w-2 h-1 bg-[#ffe680] rounded-full opacity-70"></div></div>
                        <div className="w-20 h-3 bg-[#008000] rounded-sm my-[-2px]"></div><div className="w-18 h-6 bg-[#663300] rounded-md"></div><div className="w-20 h-2 bg-[#ffcc00] rounded-sm my-[-2px]"></div><div className="w-20 h-6 bg-[#b35900] rounded-b-xl mt-[-2px]"></div>
                    </div>
                </div>
            ) : (
                // SOL: Çin Yemeği (Trump Düşerse)
                <div className="flex">
                    <div className="relative mb-[-5px] z-20"><div className="w-14 h-8 bg-[#f0e6d2] rounded-t-full border-b-2 border-[#d9c4a3] rotate-12 shadow-sm"></div></div>
                    <div className="w-16 h-20 bg-white border-2 border-red-700 flex flex-col items-center relative rounded-b-md">
                        <div className="w-full h-2 bg-red-700"></div><div className="text-xl font-bold text-red-700 mt-2">食</div>
                        <div className="absolute -top-6 w-12 h-8 flex justify-center overflow-hidden">
                            <div className="w-1 h-10 bg-[#e6c300] rounded-full mx-[2px] animate-pulse"></div><div className="w-1 h-10 bg-[#e6c300] rounded-full mx-[2px] animate-pulse delay-75"></div><div className="w-1 h-10 bg-[#e6c300] rounded-full mx-[2px] animate-pulse delay-100"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- REKLAM BİLEŞENİ (BANNER) ---
const AdBanner = () => {
    return (
        <div className="w-full h-[60px] bg-[#222] border-t-2 border-yellow-500/50 flex items-center justify-center z-50 shrink-0 overflow-hidden relative">
            {/* GOOGLE ADSENSE REKLAM KODU BURAYA EKLENECEKTİR */}
        </div>
    );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState({ trumpScore: 0, xiScore: 0, position: 0 });
  const [loading, setLoading] = useState(true);
  const [isClicking, setIsClicking] = useState(null); 

  // Platforma uygun karakter limiti (Artan platforma göre ayarlandı)
  const MAX_LIMIT = 450; 
  const MOVE_STEP = 5;

  const stressLevel = Math.min(Math.abs(gameState.position) / (MAX_LIMIT * 0.9), 0.9);
  const trumpRedness = gameState.position < 0 ? stressLevel : 0;
  const xiRedness = gameState.position > 0 ? stressLevel : 0;
  const trumpSteam = gameState.position < 0 ? stressLevel * 1.2 : 0; 
  const xiSteam = gameState.position > 0 ? stressLevel * 1.2 : 0;

  useEffect(() => {
    const initAuth = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) { console.error("Auth hatası:", error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', DATA_COLLECTION_NAME, DATA_DOC_ID);
    const checkAndCreate = async () => {
      try { const snap = await getDoc(docRef); if (!snap.exists()) { await setDoc(docRef, { trumpScore: 0, xiScore: 0, position: 0 }); } } catch (e) { console.error(e); }
    };
    checkAndCreate();
    const unsub = onSnapshot(docRef, (docSnap) => { if (docSnap.exists()) setGameState(docSnap.data()); setLoading(false); });
    return () => unsub();
  }, [user]);

  const handlePush = async (leader) => {
    if (!user) return;
    setIsClicking(leader);
    setTimeout(() => setIsClicking(null), 150);
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', DATA_COLLECTION_NAME, DATA_DOC_ID);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        if (!sfDoc.exists()) return;
        const data = sfDoc.data();
        let newPos = data.position || 0;
        let newTrumpScore = data.trumpScore || 0;
        let newXiScore = data.xiScore || 0;
        if (leader === 'trump') { newTrumpScore += 1; newPos += MOVE_STEP; } else { newXiScore += 1; newPos -= MOVE_STEP; }
        if (newPos > MAX_LIMIT) newPos = MAX_LIMIT; if (newPos < -MAX_LIMIT) newPos = -MAX_LIMIT;
        transaction.update(docRef, { trumpScore: newTrumpScore, xiScore: newXiScore, position: newPos });
      });
    } catch (e) {}
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-400 font-bold">Savaş Alanı Yükleniyor...</div>;

  return (
    // FLEX CONTAINER: OYUN VE REKLAM ALANINI DIKEY OLARAK AYIRIR
    <div className="relative w-full h-screen overflow-hidden font-sans select-none bg-slate-900 flex flex-col">
      
      {/* --- OYUN ALANI (Ekranın geri kalanı) --- */}
      <div className="relative w-full flex-1 overflow-hidden">
          <Lightning />
          <Rain />

          {/* ARKA PLAN */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-[#1a0500] z-0">
            <div className="cloud-one absolute top-10 left-[-20%] opacity-20 text-black text-9xl animate-cloud-slow blur-sm grayscale">☁️</div>
            <div className="cloud-two absolute top-32 left-[-10%] opacity-30 text-black text-8xl animate-cloud-fast delay-75 blur-md">☁️</div>
          </div>

          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-600/90 px-4 py-1 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.6)] z-50 border border-red-400/50 backdrop-blur-sm">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
            <span className="text-white font-black tracking-[0.2em] text-sm animate-pulse">LIVE</span>
          </div>

          <CameraDrone side="left" />
          <CameraDrone side="right" />

          {/* SKORLAR */}
          <div className="absolute top-6 left-0 right-0 z-50 flex justify-between px-6 md:px-24 pointer-events-none">
            {/* Trump */}
            <div className="flex flex-col items-center gap-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                <div className="w-16 h-16 rounded-full border-4 border-red-700 bg-[#f5a358] overflow-hidden relative shadow-lg flex items-center justify-center">
                    <div className="absolute top-0 w-full h-6 bg-[#ffcc00] z-10 border-b border-orange-400"></div>
                    <div className="flex gap-2 mt-2">
                        <div className="w-2 h-2 bg-black rounded-full"></div><div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                </div>
                <span className="text-4xl sm:text-5xl font-black text-red-500 font-mono tracking-tighter">{formatNumber(gameState.trumpScore)}</span>
            </div>
            {/* Xi */}
            <div className="flex flex-col items-center gap-2 drop-shadow-[0_0_10px_rgba(255,200,0,0.5)]">
                <div className="w-16 h-16 rounded-full border-4 border-yellow-700 bg-[#f5d0a9] overflow-hidden relative shadow-lg flex items-center justify-center">
                    <div className="absolute top-0 w-full h-5 bg-[#1a1a1a] z-10"></div>
                    <div className="flex gap-3 mt-3">
                        <div className="w-2 h-0.5 bg-black"></div><div className="w-2 h-0.5 bg-black"></div>
                    </div>
                </div>
                <span className="text-4xl sm:text-5xl font-black text-yellow-500 font-mono tracking-tighter">{formatNumber(gameState.xiScore)}</span>
            </div>
          </div>

          {/* KARAKTERLER VE ZEMİN */}
          <div className="absolute inset-0 flex flex-col justify-end items-center pb-8 z-10">
            <div className="relative flex items-end justify-center transition-transform duration-100 ease-linear will-change-transform" style={{ transform: `translateX(${gameState.position}px)` }}>
              <div className="absolute bottom-[90px] w-24 h-4 bg-black rounded-full z-20 shadow-lg"></div>

              {/* TRUMP */}
              <button onClick={() => handlePush('trump')} className={`relative group flex flex-col items-center justify-end w-24 h-56 mx-[-5px] cursor-pointer transition-all active:scale-95 z-30 ${isClicking === 'trump' ? 'brightness-125 -rotate-2' : ''}`}>
                 <Steam intensity={trumpSteam} />
                 <div className="absolute -top-20 w-32 h-36 bg-red-600 mix-blend-multiply transition-opacity duration-300 pointer-events-none z-50 rounded-2xl" style={{ opacity: trumpRedness * 0.8 }}></div>
                <div className="absolute -top-20 w-32 h-36 bg-[#f5a358] rounded-2xl border-2 border-black/20 shadow-2xl flex flex-col items-center overflow-hidden z-40">
                    <div className="w-[110%] h-12 bg-[#ffcc00] rounded-b-xl border-b-4 border-[#e6b800] shadow-sm z-10 transform -skew-y-3"></div>
                    <div className="mt-6 flex flex-col items-center w-full gap-3">
                        <div className="flex gap-2">
                            <div className="w-8 h-6 bg-white/40 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                            <div className="w-8 h-6 bg-white/40 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                        </div>
                        <div className="w-4 h-4 border-2 border-red-800 rounded-full bg-black/80"></div>
                    </div>
                </div>
                <div className="w-16 h-full bg-[#1e3a8a] rounded-lg flex flex-col items-center border-x-2 border-black/20 shadow-inner z-30 relative pt-2">
                    <div className="w-8 h-10 bg-white clip-path-shirt"></div>
                    <div className="absolute top-6 w-5 h-32 bg-red-600 border border-red-800 z-50 shadow-md clip-path-tie"></div>
                </div>
                <div className="absolute -bottom-4 w-full flex justify-between px-2 z-20">
                    <div className="w-5 h-8 bg-[#0f172a] rounded-sm"></div><div className="w-5 h-8 bg-[#0f172a] rounded-sm"></div>
                </div>
              </button>

              {/* XI */}
              <button onClick={() => handlePush('xi')} className={`relative group flex flex-col items-center justify-end w-24 h-56 mx-[-5px] cursor-pointer transition-all active:scale-95 z-30 ${isClicking === 'xi' ? 'brightness-125 rotate-2' : ''}`}>
                 <Steam intensity={xiSteam} />
                 <div className="absolute -top-20 w-32 h-36 bg-red-600 mix-blend-multiply transition-opacity duration-300 pointer-events-none z-50 rounded-[2rem]" style={{ opacity: xiRedness * 0.8 }}></div>
                <div className="absolute -top-20 w-32 h-36 bg-[#f5d0a9] rounded-[2rem] border-2 border-black/20 shadow-2xl flex flex-col items-center overflow-hidden z-40">
                    <div className="w-[120%] h-14 bg-[#1a1a1a] rounded-b-3xl z-10 transform rotate-1 mb-4 border-b border-black/50"></div>
                    <div className="flex flex-col items-center w-full gap-3 mt-2">
                        <div className="flex gap-5"><div className="w-4 h-0.5 bg-black/80 rounded-full"></div><div className="w-4 h-0.5 bg-black/80 rounded-full"></div></div>
                        <div className="w-3 h-1 border-t-2 border-black/10 rounded-full"></div><div className="w-8 h-3 border-b-2 border-black/40 rounded-full"></div>
                    </div>
                </div>
                <div className="w-16 h-full bg-[#334155] rounded-lg flex flex-col items-center border-x-2 border-black/20 shadow-inner z-30 relative pt-2">
                    <div className="w-6 h-8 bg-white/10 rounded-full mt-[-10px]"></div>
                    <div className="mt-4 flex flex-col gap-4">
                        <div className="w-2 h-2 bg-black/30 rounded-full"></div><div className="w-2 h-2 bg-black/30 rounded-full"></div><div className="w-2 h-2 bg-black/30 rounded-full"></div>
                    </div>
                </div>
                <div className="absolute -bottom-4 w-full flex justify-between px-2 z-20">
                    <div className="w-5 h-8 bg-[#1e293b] rounded-sm"></div><div className="w-5 h-8 bg-[#1e293b] rounded-sm"></div>
                </div>
              </button>
            </div>

            {/* UÇURUM ZEMİNİ (Yatay Genişlik 1100px) */}
            <div className="relative w-[95%] md:w-[1100px] h-56 mt-[-20px] z-20 flex justify-center drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
                
                {/* YEMEK ALANLARI: Platformun kenarlarına sabitlendi. */}
                {/* SOL YEMEK (Çin) - Platformun Sol Kenarı (Mobile ve Desktop ayarı) */}
                <div className="absolute bottom-[-20px] left-[-60px] md:left-[-150px] z-30 pointer-events-none animate-[bounce_4s_infinite]"> 
                     <FoodItem type="chinese" /> 
                </div>

                {/* SAĞ YEMEK (Fast Food) - Platformun Sağ Kenarı (Mobile ve Desktop ayarı) */}
                <div className="absolute bottom-[-20px] right-[-60px] md:right-[-150px] z-30 pointer-events-none animate-[bounce_4s_infinite]"> 
                     <FoodItem type="fastfood" /> 
                </div>

                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-red-600/20 blur-[60px] animate-pulse pointer-events-none z-0"></div>
                <div className="w-full h-full bg-[#1a1816] relative overflow-hidden [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] rounded-sm shadow-inner border-t border-stone-800">
                    {/* KIRIK KALP */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-24 z-10">
                        <svg viewBox="0 0 24 24" fill="#ff0000" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,0,0,1)] animate-pulse">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            <path d="M12 5 L10.5 8.5 L13 11.5 L10.5 15.5 L12 20" stroke="#3a0000" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none">
                         <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"> <feGaussianBlur stdDeviation="4" result="coloredBlur"/> <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge> </filter>
                            <path d="M100,0 L120,40 L90,80 L130,150" stroke="#ff4500" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-pulse" style={{animationDuration: '3s', opacity: 0.6}} />
                            <path d="M600,0 L580,50 L610,90 L560,160" stroke="#ff4500" strokeWidth="2" fill="none" filter="url(#glow)" className="animate-pulse" style={{animationDuration: '4s', opacity: 0.6}} />
                            <path d="M350,0 L370,30 L340,60 L360,100 L350,200" stroke="#ff3300" strokeWidth="3" fill="none" filter="url(#glow)" className="animate-pulse" style={{animationDuration: '2s', opacity: 0.8}} />
                         </svg>
                    </div>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMiLz4KPC9zdmc+')]"></div>
                </div>
                <div className="absolute -left-4 top-0 h-full w-12 bg-[#141210] [clip-path:polygon(100%_0,0_40%,100%_100%)] z-10"></div>
                <div className="absolute -right-4 top-0 h-full w-12 bg-[#141210] [clip-path:polygon(0_0,100%_40%,0_100%)] z-10"></div>
            </div>
          </div>

      </div>

      {/* --- DİP NOT ALANI --- */}
      <div className="w-full h-8 bg-[#0a0505] z-10 flex items-center justify-center border-t border-red-900/20 shrink-0">
          <p className="text-red-500/30 text-[10px] uppercase tracking-[0.3em] font-light animate-pulse">
              • Live Global Battle • Synced Worldwide •
          </p>
      </div>

      {/* --- REKLAM ALANI --- */}
      <AdBanner />

      <style>{`
        @keyframes cloud-move { from { transform: translateX(0); } to { transform: translateX(100vw); } }
        .animate-cloud-slow { animation: cloud-move 60s linear infinite; }
        .clip-path-shirt { clip-path: polygon(0 0, 100% 0, 50% 100%); }
        .clip-path-tie { clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%); }
        .clip-path-pizza { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
      `}</style>
    </div>
  );
}