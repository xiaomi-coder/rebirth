import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseStyle = "px-8 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary hover:text-dark shadow-lg hover:shadow-primary/50",
    secondary: "bg-secondary text-dark hover:bg-white shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-[#2A2A2A] rounded-2xl p-6 shadow-xl border border-gray-800 hover:border-primary/30 transition-colors ${className}`}
  >
    {children}
  </motion.div>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-3xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);