"use client";
import { motion } from "motion/react";

export default function SectionTitle({ text }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-3xl font-bold lg:mb-8 md:mb-6 mb-4 last:mb-0">
        {text}
      </h2>
    </motion.div>
  );
}
