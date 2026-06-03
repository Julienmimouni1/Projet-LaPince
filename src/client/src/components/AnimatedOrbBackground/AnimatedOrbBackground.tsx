import { useEffect, useState } from "react";

interface OrbPosition {
  x: number;
  y: number;
}

// on évite les bords extrêmes (> 70%) pour que l'orbe reste visible à l'écran
function randomPos(): OrbPosition {
  return {
    x: Math.random() * 70,
    y: Math.random() * 70,
  };
}

// usage : <AnimatedOrbBackground /> à poser dans n'importe quel <main> en position fixed ou relative
export function AnimatedOrbBackground() {
  const [orb1, setOrb1] = useState<OrbPosition>({ x: 5, y: 5 });
  const [orb2, setOrb2] = useState<OrbPosition>({ x: 60, y: 50 });

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    // setTimeout récursif plutôt que setInterval :
    // chaque délai est recalculé aléatoirement après chaque mouvement
    // → le timing n'est jamais régulier ni prévisible
    const moveOrb1 = () => {
      setOrb1(randomPos());
      t1 = setTimeout(moveOrb1, 2000 + Math.random() * 3000); // entre 2s et 5s
    };

    const moveOrb2 = () => {
      setOrb2(randomPos());
      t2 = setTimeout(moveOrb2, 2500 + Math.random() * 3500); // entre 2.5s et 6s
    };

    // délai initial décalé pour que les deux orbes ne bougent pas en même temps au départ
    t1 = setTimeout(moveOrb1, 1000);
    t2 = setTimeout(moveOrb2, 1800);

    // nettoyage indispensable : sans ça les timeouts continuent à tourner
    // même après que le composant a été démonté (fuite mémoire)
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    // inset-0 pour couvrir toute la page parente, pointer-events-none pour ne pas bloquer les clics
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* orbe blanc — le top/left viennent du state, la transition CSS fait le déplacement en douceur */}
      <div
        className="absolute w-[65vw] h-[65vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(200,225,245,0.6) 40%, transparent 68%)",
          filter: "blur(35px)",
          top: `${orb1.y}%`,
          left: `${orb1.x}%`,
          transition: "top 2.5s ease-in-out, left 2.5s ease-in-out",
        }}
      />

      {/* orbe bleu — durée de transition différente pour désynchroniser les deux mouvements */}
      <div
        className="absolute w-[55vw] h-[55vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(67,140,202,0.7) 0%, rgba(30,80,140,0.4) 45%, transparent 68%)",
          filter: "blur(50px)",
          top: `${orb2.y}%`,
          left: `${orb2.x}%`,
          transition: "top 3s ease-in-out, left 3s ease-in-out",
        }}
      />

    </div>
  );
}
