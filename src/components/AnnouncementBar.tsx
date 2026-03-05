'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  "KOSTENLOSE STANDARDLIEFERUNG FÜR ALLE BESTELLUNGEN",
  "ABONNIEREN SIE UNSEREN NEWSLETTER"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white h-10 flex items-center justify-center overflow-hidden relative z-[60]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute text-xs font-bold tracking-widest uppercase text-center w-full px-4"
        >
          {MESSAGES[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
