"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { getHeroData } from "@/app/actions/hero";
import PublicLayout from "@/components/layouts/PublicLayout";
import Link from "next/link";
import Image from "next/image";
import {
  MessageSquare,
  ArrowRight,
  Shield,
  BarChart3,
  CheckCircle2,
  Users,
  Briefcase,
  ClipboardList,
  CreditCard,
  Star,
  Lock,
} from "lucide-react";

interface HeroContent {
  id?: string;
  badgeText?: string;
  headingPart1?: string;
  headingPart2?: string;
  description?: string;
  updatedAt?: Date;
}

interface FloatingAsset {
  id?: string;
  type: string;
  src?: string | null;
  iconName?: string | null;
  alt?: string | null;
  color?: string | null;
  size: number;
  posX: string;
  posY: string;
  duration: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const waveVariants = {
  animate: {
    x: [0, -100, 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear" as const,
    },
  },
};

interface Feature {
  title: string;
  icon: React.ReactNode;
  desc: string;
  color: string;
}

const features: Feature[] = [
  {
    title: "Scope-First Projects",
    icon: <ClipboardList className="w-8 h-8 stroke-[2.5]" />,
    desc: "Every project starts with a defined scope — no surprises, no scope creep, no disputes.",
    color: "bg-[#F3C36C]/30 text-[#D9A341]",
  },
  {
    title: "Vetted Developer Network",
    icon: <Users className="w-8 h-8 stroke-[2.5]" />,
    desc: "Browse skilled frontend, backend, and UI/UX developers ready to work.",
    color: "bg-[#BCEACF]/30 text-[#4D8C6D]",
  },
  {
    title: "Real-Time Progress Tracking",
    icon: <BarChart3 className="w-8 h-8 stroke-[2.5]" />,
    desc: "Watch your project evolve milestone by milestone with full visibility.",
    color: "bg-[#AC9898]/30 text-[#735D5D]",
  },
  {
    title: "Secure Escrow Payments",
    icon: <Shield className="w-8 h-8 stroke-[2.5]" />,
    desc: "Funds are held safely until you confirm delivery. Zero payment risk.",
    color: "bg-[#60A5FA]/20 text-[#2563EB]",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Post Your Project",
    desc: "Describe what you need. Set your budget and timeline. It takes under 5 minutes.",
    icon: <Briefcase className="w-6 h-6" />,
    color: "bg-[#F3C36C]",
  },
  {
    step: "02",
    title: "Match with a Developer",
    desc: "Browse profiles or receive proposals from vetted developers in your stack.",
    icon: <Users className="w-6 h-6" />,
    color: "bg-[#BCEACF]",
  },
  {
    step: "03",
    title: "Define the Scope",
    desc: "Lock in deliverables, milestones, and pricing before a single line of code is written.",
    icon: <ClipboardList className="w-6 h-6" />,
    color: "bg-[#AC9898]/60",
  },
  {
    step: "04",
    title: "Build, Track & Pay",
    desc: "Track progress in real time. Release payment only when milestones are confirmed complete.",
    icon: <CreditCard className="w-6 h-6" />,
    color: "bg-[#60A5FA]/60",
  },
];

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "200+", label: "Vetted Developers" },
  { value: "90%", label: "Client Satisfaction" },
  { value: "$0", label: "Platform Setup Fee" },
];

const defaultFloatingImages: FloatingAsset[] = [
  { type: "IMAGE", src: "/images/react.png", alt: "React", size: 48, duration: 12, posX: "32%", posY: "35%" },
  { type: "IMAGE", src: "/images/js.png", alt: "JS", size: 46, duration: 14, posX: "62%", posY: "35%" },
  { type: "IMAGE", src: "/images/python.png", alt: "Python", size: 50, duration: 13, posX: "32%", posY: "60%" },
  { type: "IMAGE", src: "/images/java.png", alt: "Java", size: 44, duration: 15, posX: "62%", posY: "60%" },
  { type: "IMAGE", src: "/images/mysql.png", alt: "MySQL", size: 46, duration: 11, posX: "48%", posY: "25%" },
  { type: "IMAGE", src: "/images/postgresql.png", alt: "PostgreSQL", size: 42, duration: 16, posX: "48%", posY: "72%" },
  { type: "IMAGE", src: "/images/database-storage.png", alt: "DB", size: 40, duration: 14, posX: "48%", posY: "45%" },
  { type: "IMAGE", src: "/images/android.png", alt: "Android", size: 44, duration: 13, posX: "25%", posY: "48%" },
  { type: "IMAGE", src: "/images/apple.png", alt: "Apple", size: 42, duration: 15, posX: "75%", posY: "48%" },
  { type: "IMAGE", src: "/images/c-.png", alt: "C#", size: 46, duration: 12, posX: "20%", posY: "30%" },
  { type: "IMAGE", src: "/images/css-3.png", alt: "CSS3", size: 44, duration: 14, posX: "80%", posY: "30%" },
  { type: "IMAGE", src: "/images/html-5.png", alt: "HTML5", size: 46, duration: 11, posX: "20%", posY: "65%" },
  { type: "IMAGE", src: "/images/dev.png", alt: "Dev", size: 40, duration: 16, posX: "80%", posY: "65%" },
  { type: "IMAGE", src: "/images/folder.png", alt: "Folder", size: 38, duration: 13, posX: "50%", posY: "80%" },
];

const defaultFloatingIcons: FloatingAsset[] = [
  { type: "ICON", iconName: "Code2", color: "#60A5FA", size: 34, duration: 11, posX: "35%", posY: "40%" },
  { type: "ICON", iconName: "Terminal", color: "#34D399", size: 38, duration: 13, posX: "65%", posY: "40%" },
  { type: "ICON", iconName: "Cpu", color: "#F87171", size: 36, duration: 12, posX: "35%", posY: "60%" },
  { type: "ICON", iconName: "Globe", color: "#FB923C", size: 32, duration: 14, posX: "65%", posY: "60%" },
  { type: "ICON", iconName: "Layers", color: "#A78BFA", size: 40, duration: 15, posX: "50%", posY: "55%" },
  { type: "ICON", iconName: "Zap", color: "#FACC15", size: 30, duration: 10, posX: "50%", posY: "35%" },
];

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  const [heroData, setHeroData] = useState<{
    content: HeroContent | null;
    assets: FloatingAsset[];
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getHeroData();
        setHeroData(data);
      } catch (err) {
        console.error("Failed to load hero data", err);
      }
    };
    loadData();
  }, []);

  const dbAssets = heroData?.assets || [];
  const displayImages = dbAssets.length > 0
    ? dbAssets.filter((a: FloatingAsset) => a.type === "IMAGE")
    : defaultFloatingImages;
  const displayIcons = dbAssets.length > 0
    ? dbAssets.filter((a: FloatingAsset) => a.type === "ICON")
    : defaultFloatingIcons;

  return (
    <PublicLayout>
      <div className="relative min-h-screen bg-[#ECE6E6] overflow-hidden">
        {/* Background Waves */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={waveVariants}
              animate="animate"
              className="absolute w-[200%] h-[400px] bg-gradient-to-r from-transparent via-[#F3C36C]/30 to-transparent"
              style={{
                top: `${i * 25}%`,
                left: "-50%",
                rotate: i % 2 === 0 ? "15deg" : "-15deg",
                filter: "blur(80px)",
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: y1, rotate }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[80%] bg-[#BCEACF]/30 shape-blob blur-3xl -z-10"
        />
        <motion.div
          style={{ y: y2, rotate: -rotate }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-[#F3C36C]/20 shape-blob blur-3xl -z-10"
        />

        {/* ── HERO SECTION ── */}
        <section className="relative pt-0 pb-0 px-4 flex items-start overflow-visible">
          <div className="max-w-[1920px] mx-auto w-full relative z-10 pt-12 md:pt-16">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0 items-start">

              {/* Left: Laptop Visual */}
              <div className="relative h-[350px] lg:h-[750px] flex items-start justify-center overflow-visible">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 0 }}
                  animate={{ opacity: 1, scale: 1.05, y: -40 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="relative w-full h-full flex items-start justify-center origin-top"
                >
                  <div className="relative w-full h-full transform translate-y-[-15%] lg:translate-y-[-10%] lg:translate-x-[5%]">
                    <Image
                      src="/images/laptop1.png"
                      alt="Webbidev Platform"
                      fill
                      className="object-contain relative z-10 drop-shadow-[0_40px_100px_rgba(0,0,0,0.3)]"
                      priority
                    />

                    <div className="absolute top-[34%] bottom-[42%] left-[16%] right-[16%] lg:top-[20%] lg:bottom-[32%] z-20 pointer-events-none overflow-hidden rounded-md">
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              rotate: 360,
                              scale: [1, 1.1, 1],
                              opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                              duration: 5 + i * 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute border-2 border-[#F3C36C]/20 rounded-full"
                            style={{
                              width: `${20 + i * 25}%`,
                              height: `${20 + i * 25}%`,
                            }}
                          />
                        ))}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.5, 0.2],
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="w-1/4 h-1/4 bg-gradient-to-tr from-[#F3C36C]/10 via-[#BCEACF]/10 to-[#AC9898]/10 blur-2xl rounded-full"
                        />
                      </div>

                      {displayImages.map((item: FloatingAsset, idx: number) => {
                        if (!item.src) return null;
                        return (
                          <motion.div
                            key={`img-${idx}`}
                            animate={{
                              x: [0, 20 + (idx % 3) * 10, -15 - (idx % 2) * 10, 10 + (idx % 4) * 5, -20, 0],
                              y: [0, -15 - (idx % 3) * 8, 20 + (idx % 2) * 8, -10, 15 + (idx % 4) * 4, 0],
                              rotate: [0, 8 + (idx % 2) * 4, -8 - (idx % 3) * 4, 4, -4, 0],
                            }}
                            transition={{
                              duration: (item.duration || 12) * 0.4 + (idx % 3),
                              delay: -(idx * 2.5),
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute scale-50 lg:scale-100 origin-center"
                            style={{
                              left: item.posX,
                              top: item.posY,
                              width: item.size,
                              height: item.size,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <Image
                              src={item.src}
                              alt={item.alt || "Logo"}
                              width={item.size}
                              height={item.size}
                              className="filter drop-shadow-xl"
                              priority
                            />
                          </motion.div>
                        );
                      })}

                      {displayIcons.map((item: FloatingAsset, idx: number) => {
                        const iconKey = (item.iconName || "Code2") as keyof typeof LucideIcons;
                        const Icon = (LucideIcons[iconKey] as LucideIcons.LucideIcon) || LucideIcons.Code2;
                        return (
                          <motion.div
                            key={`icon-${idx}`}
                            animate={{
                              x: [0, 15 + (idx % 3) * 8, -12 - (idx % 2) * 8, 8 + (idx % 4) * 4, -15, 0],
                              y: [0, -12 - (idx % 3) * 6, 18 + (idx % 2) * 6, -8, 12 + (idx % 4) * 3, 0],
                              rotate: [0, 10 + (idx % 2) * 5, -10 - (idx % 3) * 5, 5, -5, 0],
                              scale: [0.95, 1.1 + (idx % 2) * 0.1, 0.9, 1.05, 0.95],
                            }}
                            transition={{
                              duration: (item.duration || 11) * 0.4 + (idx % 4),
                              delay: -(idx * 1.7),
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute scale-50 lg:scale-100 origin-center"
                            style={{
                              left: item.posX,
                              top: item.posY,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <Icon
                              size={item.size}
                              style={{ color: item.color ?? undefined, marginTop: "20px" }}
                              className="filter drop-shadow-xl"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="absolute -inset-20 bg-gradient-to-tr from-[#60A5FA]/20 via-[#34D399]/20 to-[#A78BFA]/20 blur-[100px] -z-10 animate-pulse" />
                </motion.div>
              </div>

              {/* Right: Hero Text */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-left pt-2 lg:pt-0 lg:pl-12 relative z-30 -mt-36 lg:mt-0"
              >
                <Badge className="bg-[#747373] text-[#F1EFEF] border-none px-4 py-1.5 mb-4 rounded-full font-black tracking-widest uppercase text-[10px]">
                  {heroData?.content?.badgeText || "The Developer Marketplace"}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#747373] leading-[1.1] mb-4">
                  {heroData?.content?.headingPart1 || "Hire Expert Developers."} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    {heroData?.content?.headingPart2 || "Ship with Confidence."}
                  </span>
                </h1>
                <p className="text-base md:text-lg text-[#171717]/60 max-w-xl mb-6 font-medium leading-relaxed">
                  {heroData?.content?.description ||
                    "Webbidev connects clients with vetted web developers. Define your scope upfront, track every milestone, and pay only when the work is done — guaranteed."}
                </p>

                {/* Trust signals */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {["Scope defined upfront", "Secure escrow payments", "Free to get started"].map((point) => (
                    <span key={point} className="flex items-center gap-1.5 text-sm font-semibold text-[#171717]/70">
                      <CheckCircle2 className="w-4 h-4 text-[#4D8C6D]" />
                      {point}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-8 py-6 text-lg rounded-2xl shadow-xl flex items-center gap-4 group cursor-pointer">
                      Post a Project
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/talent">
                    <Button
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-2xl font-bold bg-white/80 backdrop-blur cursor-pointer"
                    >
                      Browse Talent
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── AUDIENCE SPLIT ── */}
        <section className="mt-4 lg:mt-0 pb-8 px-4 relative z-40">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Link href="/signup">
                  <div className="group bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-[#171717] mb-2">I&apos;m a Client</h3>
                    <p className="text-[#171717]/60 text-sm font-medium leading-relaxed mb-4">
                      Post your project, define the scope, and hire a vetted developer. Track every milestone in your personal project dashboard.
                    </p>
                    <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Get started free <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/signup">
                  <div className="group bg-white/70 backdrop-blur border border-white/60 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="w-12 h-12 bg-[#F3C36C] rounded-2xl flex items-center justify-center mb-4">
                      <LucideIcons.Code2 className="w-6 h-6 text-[#171717]" />
                    </div>
                    <h3 className="text-xl font-black text-[#171717] mb-2">I&apos;m a Developer</h3>
                    <p className="text-[#171717]/60 text-sm font-medium leading-relaxed mb-4">
                      Create your free developer profile, set your rates, and manage your entire project lifecycle — invoices, milestones, and payments in one place.
                    </p>
                    <span className="text-[#D9A341] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Join for free <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PLATFORM FEATURES ── */}
        <section className="py-16 px-4 relative z-40">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-[#747373]/10 text-[#747373] border-none px-4 py-1.5 mb-4 rounded-full font-bold tracking-widest uppercase text-[10px]">
                Why Webbidev
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-[#171717] mb-4">
                Built to eliminate the guesswork
              </h2>
              <p className="text-[#171717]/60 max-w-xl mx-auto font-medium">
                Most freelance platforms leave you guessing about scope, timelines, and payment. Webbidev locks all of that down before work begins.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="glass border-none h-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="pt-8 p-6">
                      <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[#171717]">{feature.title}</h3>
                      <p className="text-[#171717]/60 leading-relaxed font-medium text-sm">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-16 px-4 bg-white/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-[#BCEACF] text-[#4D8C6D] border-none px-4 py-1.5 mb-4 rounded-full font-bold tracking-widest uppercase text-[10px]">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-[#171717] mb-4">
                From idea to shipped — in 4 steps
              </h2>
              <p className="text-[#171717]/60 max-w-xl mx-auto font-medium">
                No long contracts. No payment surprises. Just a clear process that keeps both sides protected.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {idx < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%-12px)] w-6 h-0.5 bg-[#171717]/10 z-10" />
                  )}
                  <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                    <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center mb-4 text-[#171717]`}>
                      {step.icon}
                    </div>
                    <div className="text-4xl font-black text-[#171717]/5 mb-2 leading-none">{step.step}</div>
                    <h3 className="text-lg font-bold text-[#171717] mb-2">{step.title}</h3>
                    <p className="text-[#171717]/60 text-sm font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/how-it-works">
                <Button variant="outline" className="border-2 border-[#171717]/20 text-[#171717] hover:bg-[#171717]/5 px-6 py-3 rounded-xl font-bold cursor-pointer">
                  Learn more about the process <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS / SOCIAL PROOF ── */}
        <section className="py-16 px-4 relative z-40">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-[#454141] to-[#2a2828] rounded-[3rem] p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Trusted by clients and developers
                </h2>
                <p className="text-white/50 font-medium">
                  A growing community built on scope, trust, and quality delivery.
                </p>
              </motion.div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-black text-[#F3C36C] mb-2">{stat.value}</div>
                    <div className="text-white/50 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DEVELOPER SECTION ── */}
        <section className="py-8 pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#454141] rounded-[4rem] p-12 lg:p-24 overflow-hidden relative shadow-3xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3C36C]/20 blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#BCEACF]/10 blur-[100px] -ml-48 -mb-48" />

              <div className="relative z-10 lg:flex items-center gap-16">
                <div className="lg:w-1/2">
                  <Badge className="bg-[#F3C36C] text-[#171717] mb-6">For Developers</Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                    Your dev business, <br />
                    fully managed.
                  </h2>
                  <p className="text-white/60 text-lg mb-10 font-medium leading-relaxed">
                    Set your rates, receive scoped projects, generate invoices, and track every milestone — all from your personal devBucket dashboard. We handle the platform, you own the work.
                  </p>
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <h4 className="text-[#F3C36C] text-3xl font-black mb-1">90%</h4>
                      <p className="text-white/40 text-sm font-medium">Earnings kept by you</p>
                    </div>
                    <div>
                      <h4 className="text-[#BCEACF] text-3xl font-black mb-1">$0</h4>
                      <p className="text-white/40 text-sm font-medium">Setup or monthly fees</p>
                    </div>
                  </div>
                  <Link href="/signup">
                    <Button className="bg-[#F3C36C] text-[#171717] hover:bg-[#e0b460] px-8 py-6 text-lg rounded-xl font-bold cursor-pointer">
                      Create Your Developer Profile
                    </Button>
                  </Link>
                </div>

                {/* Developer dashboard preview */}
                <div className="lg:w-1/2 mt-16 lg:mt-0">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                    {/* Profile row */}
                    <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#F3C36C] to-[#e0b460] rounded-full flex items-center justify-center text-[#171717] font-black text-lg">
                        A
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">Alex Johnson</div>
                        <div className="text-white/40 text-xs">Full-Stack Developer · React, Node.js</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-[#F3C36C] text-xs font-bold">
                        <Star className="w-3 h-3 fill-[#F3C36C]" />
                        4.9
                      </div>
                    </div>

                    {/* Active project */}
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Active Project</span>
                        <span className="text-[#BCEACF] text-xs font-bold bg-[#BCEACF]/10 px-2 py-0.5 rounded-full">In Progress</span>
                      </div>
                      <div className="text-white font-bold text-sm mb-1">E-commerce Dashboard Redesign</div>
                      <div className="text-white/40 text-xs mb-3">Milestone 2 of 4 · Due in 5 days</div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-[#F3C36C] to-[#BCEACF] h-1.5 rounded-full w-[48%]" />
                      </div>
                    </div>

                    {/* Earnings row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-2xl p-4">
                        <div className="text-white/40 text-xs mb-1">This month</div>
                        <div className="text-white font-black text-lg">$2,340</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4">
                        <div className="text-white/40 text-xs mb-1">Pending</div>
                        <div className="text-[#F3C36C] font-black text-lg">$800</div>
                      </div>
                    </div>

                    {/* Message preview */}
                    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-white/40 flex-shrink-0" />
                      <div>
                        <div className="text-white/70 text-xs font-semibold">New message from client</div>
                        <div className="text-white/30 text-xs truncate">&quot;Can we schedule a quick review call?&quot;</div>
                      </div>
                      <div className="ml-auto w-2 h-2 bg-[#BCEACF] rounded-full flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CLIENT SECTION ── */}
        <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-[#60A5FA]/20 text-[#2563EB] border-none px-4 py-1.5 mb-4 rounded-full font-bold tracking-widest uppercase text-[10px]">
                For Clients
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-[#171717] mb-4">
                Stay in control of every project
              </h2>
              <p className="text-[#171717]/60 max-w-2xl mx-auto font-medium">
                Your project dashboard gives you full visibility — from accepting quotes to releasing final payment. No chasing developers. No payment anxiety.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Review & Accept Quotes",
                  desc: "Developers submit scoped proposals. You review, compare, and accept — no negotiation back-and-forth.",
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  color: "bg-[#BCEACF]",
                },
                {
                  title: "Track Every Milestone",
                  desc: "Watch your project evolve step by step with real-time updates from your developer.",
                  icon: <BarChart3 className="w-6 h-6" />,
                  color: "bg-[#F3C36C]",
                },
                {
                  title: "Pay When It's Done",
                  desc: "Funds are held securely in escrow and released only after you confirm each milestone is complete.",
                  icon: <Lock className="w-6 h-6" />,
                  color: "bg-[#60A5FA]/60",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                    <div className={`w-12 h-12 ${item.color} text-[#171717] rounded-2xl flex items-center justify-center mb-6`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#171717]">{item.title}</h3>
                    <p className="text-[#171717]/60 font-medium leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-8 py-5 text-lg rounded-2xl shadow-xl flex items-center gap-3 mx-auto cursor-pointer">
                  Post Your First Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-[#747373]/10 text-[#747373] border-none px-4 py-1.5 mb-6 rounded-full font-bold tracking-widest uppercase text-[10px]">
                Get Started Today
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black text-[#171717] mb-6 leading-tight">
                Ready to build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  something great?
                </span>
              </h2>
              <p className="text-lg text-[#171717]/60 max-w-xl mx-auto mb-10 font-medium">
                Whether you&apos;re a client with a vision or a developer ready to take on scoped work — Webbidev is free to join and built for both sides.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-10 py-6 text-lg rounded-2xl shadow-xl flex items-center gap-3 group cursor-pointer">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="border-2 border-[#171717]/20 text-[#171717] hover:bg-[#171717]/5 px-10 py-6 text-lg rounded-2xl font-bold cursor-pointer">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
