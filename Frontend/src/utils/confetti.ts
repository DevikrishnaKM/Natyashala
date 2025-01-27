import confetti from 'canvas-confetti';

const triggerConfetti = () => {
   confetti({
      particleCount: 100,
      spread: 100,
      angle: 45,
      origin: { x: 0, y: 1 },
      colors: ['#d2b09b', '#f5f5dc', '#4e342e'],
   });

   confetti({
      particleCount: 100,
      spread: 100,
      angle: 135,
      origin: { x: 1, y: 1 },
      colors: ['#d2b09b', '#f5f5dc', '#4e342e'],
   });
};

export default triggerConfetti;