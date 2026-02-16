import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram, CheckCircle, TrendingUp, Star, Phone, Zap, Crown, Send } from 'lucide-react';
import { Button, Card, SectionTitle } from './UI';
import { HERO_IMAGE, TRAINER_IMAGE, MOCK_TRANSFORMATIONS, CONTACT_INFO } from '../constants';

// --- Hero Section ---
export const Hero = ({ onJoin }: { onJoin: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={HERO_IMAGE} alt="Gym Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-block"
        >
          <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase border border-primary/30 backdrop-blur-sm">
            Hayotingizni o'zgartirish vaqti keldi
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-9xl font-heading font-extrabold mb-6 leading-tight"
        >
          QAYTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">TUG'ILISH</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light"
        >
          "Tanani emas, butun hayotni o'zgartiramiz." — Farrux Radjabov bilan yangi hayotni boshlang.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={onJoin} className="text-lg px-10 py-4 shadow-primary/40 shadow-2xl">
            Ariza qoldirish <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => window.open(`https://instagram.com/${CONTACT_INFO.instagram.replace('@', '')}`, '_blank')}>
            <Instagram className="w-5 h-5 mr-2" /> Natijalarni ko'rish
          </Button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [-10, 10, -10] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-10 right-10 hidden md:block"
      >
        <div className="bg-dark/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-full text-green-500"><TrendingUp /></div>
          <div>
            <p className="text-xs text-gray-400">O'rtacha natija</p>
            <p className="font-bold text-white">-12 kg / oyiga</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// --- About & Trainer Section ---
export const About = () => {
  return (
    <section className="py-20 bg-darker relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-20 blur-xl"></div>
            <img src={TRAINER_IMAGE} alt="Farrux Radjabov" className="relative rounded-2xl shadow-2xl w-full object-cover transform -rotate-2 hover:rotate-0 transition-all duration-500" />
            <div className="absolute -bottom-6 -right-6 bg-white text-dark p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
              <p className="font-heading font-bold text-lg">"Intizom – bu siz xohlagan narsa va sizga eng kerakli narsa o'rtasidagi ko'prikdir."</p>
              <p className="text-primary font-bold mt-2">- Farrux Radjabov</p>
            </div>
          </motion.div>

          <div className="md:w-1/2 space-y-6">
            <SectionTitle title="Murabbiy Haqida" />
            <p className="text-gray-300 text-lg leading-relaxed">
              Men Farrux Radjabov, "Qayta Tug'ilish" loyihasi asoschisiman. Mening maqsadim – nafaqat ortiqcha vazndan xalos bo'lishga yordam berish, balki sog'lom turmush tarzini shakllantirishdir.
            </p>
            <ul className="space-y-4">
              {[
                "1000+ muvaffaqiyatli o'zgarishlar",
                "Professional sertifikatlangan murabbiy",
                "Har bir ishtirokchiga individual yondashuv",
                "Psixologik qo'llab-quvvatlash"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-200">
                  <CheckCircle className="text-secondary w-6 h-6" /> {item}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Button onClick={() => window.open(`https://instagram.com/${CONTACT_INFO.instagram.replace('@', '')}`, '_blank')} variant="secondary">
                Instagram: {CONTACT_INFO.instagram}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Gallery Section ---
export const Gallery = () => {
  return (
    <section className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Natijalar So'zlaydi" 
          subtitle="Bizning qahramonlarimizning haqiqiy o'zgarishlari. Siz ham ular qatorida bo'lishingiz mumkin." 
        />
        
        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_TRANSFORMATIONS.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 flex">
                   <img src={item.before} alt="Before" className="w-1/2 h-full object-cover border-r border-white/10" />
                   <img src={item.after} alt="After" className="w-1/2 h-full object-cover" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-primary font-bold text-xl">{item.caption}</p>
                    <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[100%] animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Maqsadga erishildi: 100%</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <Button className="animate-pulse">Siz ham o'zgarishingiz mumkin</Button>
        </div>
      </div>
    </section>
  );
};

// --- Pricing Section ---
export const Pricing = () => {
  return (
    <section className="py-20 bg-darker relative">
       <div className="container mx-auto px-4">
          <SectionTitle 
             title="O'zingizga mos rejani tanlang" 
             subtitle="Maqsadingizga va imkoniyatingizga qarab eng qulay tarifni tanlang."
          />
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             
             {/* Plan 1: Standard */}
             <motion.div 
                whileHover={{ y: -10 }}
                className="bg-[#222] border border-gray-700 rounded-3xl p-8 flex flex-col relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={100} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Mustaqil</h3>
                <p className="text-gray-400 mb-6 text-sm">O'z intizomiga ishonganlar uchun mukammal tanlov.</p>
                <div className="mb-6">
                   <span className="text-4xl font-heading font-bold text-white">299,000</span>
                   <span className="text-gray-500 text-sm"> so'm / oy</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                   {[
                      "Mobil ilovadan foydalanish",
                      "Individual ovqatlanish rejasi",
                      "Video mashg'ulotlar to'plami",
                      "Suv va qadamlar nazorati",
                      "Umumiy Telegram guruh"
                   ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                         <div className="bg-gray-800 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-gray-400" /></div>
                         {item}
                      </li>
                   ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}>
                   Tanlash
                </Button>
             </motion.div>

             {/* Plan 2: Premium */}
             <motion.div 
                whileHover={{ y: -10 }}
                className="bg-gradient-to-b from-[#2A2A2A] to-[#1a1a1a] border-2 border-primary rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-primary/10"
             >
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                   TAVSIYA ETILADI
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Crown size={120} className="text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">Individual <Crown className="w-5 h-5 text-secondary fill-secondary" /></h3>
                <p className="text-gray-400 mb-6 text-sm">Murabbiy nazorati va kafolatlangan natija.</p>
                <div className="mb-6">
                   <span className="text-4xl font-heading font-bold text-primary">599,000</span>
                   <span className="text-gray-500 text-sm"> so'm / oy</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                   {[
                      "Barcha 'Mustaqil' imkoniyatlari",
                      "Murabbiy bilan shaxsiy chat",
                      "Haftalik video tahlil va nazorat",
                      "Ovqatlanish rasmlarini tekshirish",
                      "Individual mashg'ulot tahlili",
                      "Psixologik motivatsiya"
                   ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                         <div className="bg-primary/20 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-primary" /></div>
                         {item}
                      </li>
                   ))}
                </ul>
                <Button className="w-full py-4 text-lg" onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}>
                   Boshlash
                </Button>
             </motion.div>

          </div>
       </div>
    </section>
  );
}

// --- Form Section ---
type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  telegram: string;
  city: string;
  weight: string;
  height: string;
  age: string;
  plan: string;
  goal: string;
};

export const ApplicationForm = () => {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: FormData = {
      firstName: (fd.get('firstName') as string) || '',
      lastName: (fd.get('lastName') as string) || '',
      phone: (fd.get('phone') as string) || '',
      telegram: (fd.get('telegram') as string) || '',
      city: (fd.get('city') as string) || '',
      weight: (fd.get('weight') as string) || '',
      height: (fd.get('height') as string) || '',
      age: (fd.get('age') as string) || '',
      plan: (fd.get('plan') as string) || '',
      goal: (fd.get('goal') as string) || '',
    };
    setFormData(data);
    setSubmitted(true);
  };

  const openTelegramToAdmin = () => {
    if (!formData) return;
    const adminUsername = CONTACT_INFO.telegram || 'farruxradjabov94';
    const lines = [
      '🆕 Yangi ariza — Qayta Tug\'ilish',
      '',
      `Ism: ${formData.firstName} ${formData.lastName}`,
      `Tel: ${formData.phone}`,
      `Telegram: ${formData.telegram ? (formData.telegram.startsWith('@') ? formData.telegram : '@' + formData.telegram) : '—'}`,
      `Shahar: ${formData.city}`,
      `Vazn: ${formData.weight} kg, Bo'y: ${formData.height} sm, Yosh: ${formData.age}`,
      `Tarif: ${formData.plan}`,
      `Maqsad: ${formData.goal}`,
    ];
    const text = lines.join('\n');
    const url = `https://t.me/share/url?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    window.open(`https://t.me/${adminUsername}`, '_blank', 'noopener,noreferrer');
  };

  if (submitted) {
    return (
      <section className="py-20 bg-darker flex justify-center items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center bg-[#2A2A2A] p-10 rounded-3xl border border-primary/20 max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Ariza qabul qilindi!</h3>
          <p className="text-gray-400 mb-4">Tez orada siz bilan bog&apos;lanamiz.</p>
          <p className="text-gray-500 text-sm mb-6">
            Xabaringiz avtomatik adminimiz Telegramiga yuborilishi uchun quyidagi tugmani bosing — Telegram ochiladi, xabarni @{CONTACT_INFO.telegram} ga yuboring.
          </p>
          <Button onClick={openTelegramToAdmin} className="w-full mb-3 bg-[#0088cc] hover:bg-[#0077b5] text-white">
            <Send className="w-5 h-5 mr-2" /> Adminimizga Telegram orqali yuborish
          </Button>
          <Button onClick={() => { setSubmitted(false); setFormData(null); }} variant="outline" className="w-full">
            Yana ariza yuborish
          </Button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-20 bg-dark">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionTitle title="Hoziroq Boshlang" subtitle="Anketani to'ldiring va biz sizga mos rejani tuzib beramiz. Bog'lanish oson bo'lishi uchun Telegram username ni ham yozing." />
        
        <Card className="bg-[#222] border-none shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Ism</label>
                <input required name="firstName" type="text" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="Ismingiz" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Familiya</label>
                <input required name="lastName" type="text" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="Familiyangiz" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Telefon raqam</label>
                <input required name="phone" type="tel" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="+998 90 123 45 67" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Telegram username</label>
                <input name="telegram" type="text" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="@username yoki username" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Shahar</label>
                <input required name="city" type="text" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="Toshkent" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Hozirgi vazn (kg)</label>
                <input required name="weight" type="number" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="85" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Bo'y (sm)</label>
                <input required name="height" type="number" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="175" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Yosh</label>
                <input required name="age" type="number" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors" placeholder="25" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tarif rejasi</label>
              <select name="plan" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors">
                <option>Individual (599,000 so'm)</option>
                <option>Mustaqil (299,000 so'm)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Maqsadingiz</label>
              <select name="goal" className="w-full bg-[#333] border border-gray-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-white transition-colors">
                <option>Vazn yo'qotish</option>
                <option>Mushak yig'ish</option>
                <option>Sog'lom ovqatlanish</option>
              </select>
            </div>

            <Button type="submit" className="w-full text-lg py-4 mt-4 bg-gradient-to-r from-primary to-secondary hover:shadow-orange-500/50">
              Qayta Tug'ilishni boshlayman
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};