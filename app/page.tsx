"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { getHeroData } from "@/app/actions/hero";
import PublicLayout from "@/components/layouts/PublicLayout";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Database, Layout, Figma, Smartphone, ArrowRight, Zap, Cpu } from "lucide-react";

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

// Complex Wave Animation for Background
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
    title: "Frontend Excellence",
    icon: <Layout className="w-8 h-8 stroke-[2.5]" />,
    desc: "Stunning, responsive interfaces built with modern frameworks.",
    color: "bg-[#F3C36C]/30 text-[#D9A341]",
  },
  {
    title: "Backend Mastery",
    icon: <Database className="w-8 h-8 stroke-[2.5]" />,
    desc: "Scalable, secure server-side logic and database architecture.",
    color: "bg-[#BCEACF]/30 text-[#4D8C6D]",
  },
  {
    title: "UI/UX Magic",
    icon: <Figma className="w-8 h-8 stroke-[2.5]" />,
    desc: "Human-centric design systems that convert and delight.",
    color: "bg-[#AC9898]/30 text-[#735D5D]",
  },
  {
    title: "Mobile First",
    icon: <Smartphone className="w-8 h-8 stroke-[2.5]" />,
    desc: "Native-feel experiences for every device and screen size.",
    color: "bg-[#171717]/10 text-[#171717]",
  },
];

const defaultFloatingImages: FloatingAsset[] = [
  { type: "IMAGE", src: "/images/react.png", alt: "React", size: 48, duration: 12, posX: "32%", posY: "35%" },
  { type: "IMAGE", src: "/images/js.png", alt: "JS", size: 46, duration: 14, posX: "62%", posY: "35%" },
  { type: "IMAGE", src: "/images/python.png", alt: "Python", size: 50, duration: 13, posX: "32%", posY: "60%" },
  { type: "IMAGE", src: "/images/java.png", alt: "Java", size: 44, duration: 15, posX: "62%", posY: "60%" },
  { type: "IMAGE", src: "/images/mysql.png", alt: "MySQL", size: 46, duration: 11, posX: "48%", posY: "25%" },
  { type: "IMAGE", src: "/images/postgresql.png", alt: "PostgreSQL", size: 42, duration: 16, posX: "48%", posY: "72%" },
  { type: "IMAGE", src: "/images/database-storage.png", alt: "DB", size: 40, duration: 14, posX: "48%", posY: "45%" },
  // New tech icons
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
    ? dbAssets.filter((a: FloatingAsset) => a.type === 'IMAGE') 
    : defaultFloatingImages;
  const displayIcons = dbAssets.length > 0 
    ? dbAssets.filter((a: FloatingAsset) => a.type === 'ICON') 
    : defaultFloatingIcons;

  return (
    <PublicLayout>
      <div className="relative min-h-screen bg-[#ECE6E6] overflow-hidden">
        {/* Complex Background Waves */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={waveVariants}
              animate="animate"
              className="absolute w-[200%] h-[400px] bg-gradient-to-r from-transparent via-[#F3C36C]/30 to-transparent"
              style={{
                top: `${i * 25}%`,
                left: '-50%',
                rotate: i % 2 === 0 ? '15deg' : '-15deg',
                filter: 'blur(80px)',
              }}
            />
          ))}
        </div>

        {/* Dynamic Asymmetric Shapes */}
        <motion.div
          style={{ y: y1, rotate }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[80%] bg-[#BCEACF]/30 shape-blob blur-3xl -z-10"
        />
        <motion.div
          style={{ y: y2, rotate: -rotate }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-[#F3C36C]/20 shape-blob blur-3xl -z-10"
        />

        {/* Hero Section */}
        <section className="relative pt-0 pb-0 px-4 flex items-start overflow-visible">
          <div className="max-w-[1920px] mx-auto w-full relative z-10 pt-12 md:pt-16">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0 items-start">
              
              {/* Left Column: The Laptop with Floating Icons Inside */}
              <div className="relative h-[350px] lg:h-[750px] flex items-start justify-center overflow-visible">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 0 }}
                  animate={{ opacity: 1, scale: 1.05, y: -40 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="relative w-full h-full flex items-start justify-center origin-top"
                >
                  <div className="relative w-full h-full transform translate-y-[-15%] lg:translate-y-[-10%] lg:translate-x-[5%]">
                    {/* The Laptop Image */}
                    <Image 
                      src="/images/laptop1.png" 
                      alt="Webbidev Laptop" 
                      fill
                      className="object-contain relative z-10 drop-shadow-[0_40px_100px_rgba(0,0,0,0.3)]" 
                      priority
                    />
                    
                    {/* Floating Icons INSIDE the laptop screen area */}
                    <div className="absolute top-[34%] bottom-[42%] left-[16%] right-[16%] lg:top-[20%] lg:bottom-[32%] z-20 pointer-events-none overflow-hidden rounded-md">
                      
                      {/* Wave Spinner Effect */}
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
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-1/4 h-1/4 bg-gradient-to-tr from-[#F3C36C]/10 via-[#BCEACF]/10 to-[#AC9898]/10 blur-2xl rounded-full"
                        />
                      </div>

                      {/* Tech Logo Images */}
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
                      
                      {/* Lucide Icons */}
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
                              style={{ color: item.color ?? undefined, marginTop: '20px' }} 
                              className="filter drop-shadow-xl"
                            />
                          </motion.div>
                        );
                      })}
                    </div>

                  </div>
                  
                  {/* Glowing background behind laptop */}
                  <div className="absolute -inset-20 bg-gradient-to-tr from-[#60A5FA]/20 via-[#34D399]/20 to-[#A78BFA]/20 blur-[100px] -z-10 animate-pulse" />
                </motion.div>
              </div>

              {/* Right Column: Text Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-left pt-2 lg:pt-0 lg:pl-12 relative z-30 -mt-36 lg:mt-0"
              >
                <Badge className="bg-[#747373] text-[#F1EFEF] border-none px-4 py-1.5 mb-4 rounded-full font-black tracking-widest uppercase text-[10px]">
                  {heroData?.content?.badgeText || "Bring Your Idea to Life"}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#747373] leading-[1.1] mb-4">
                  {heroData?.content?.headingPart1 || "Guaranteed Scope."} <br />
                  {heroData?.content?.headingPart2 || "Simplified Development."}
                </h1>
                <p className="text-base md:text-lg text-[#171717]/60 max-w-xl mb-8 font-medium leading-relaxed">
                  {heroData?.content?.description || "Connect with top developers, define your project scope, and track progress with confidence. Webbidev ensures clarity, quality, and secure payments every step of the way."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 px-8 py-6 text-lg rounded-2xl shadow-xl flex items-center gap-4 group cursor-pointer">
                      Get Started
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

        {/* Platform Features Grid */}
        <section className="mt-8 lg:mt-12 pb-24 px-4 relative z-40">
          <div className="max-w-7xl mx-auto">
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
                      <div
                        className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-[#171717]">
                        {feature.title}
                      </h3>
                      <p className="text-[#171717]/60 leading-relaxed font-medium">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Onboarding - unusual shape */}
        <section className="pt-8 pb-24 px-4">
          <div className="max-w-7xl mx-auto relative">
            <div className="bg-[#454141] rounded-[4rem] p-12 lg:p-24 overflow-hidden relative shadow-3xl">
              {/* Background gradient shapes */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3C36C]/20 blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#BCEACF]/10 blur-[100px] -ml-48 -mb-48" />

              <div className="relative z-10 lg:flex items-center gap-16">
                <div className="lg:w-1/2">
                  <Badge className="bg-[#F3C36C] text-[#171717] mb-6">
                    Developers
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                    Onboard for free. <br />
                    Get your devBucket.
                  </h2>
                  <p className="text-white/60 text-xl mb-12 font-medium">
                    Set your pricing, generate invoices, and manage your dev
                    lifecycle with precision. We handle the complexity, you
                    handle the code.
                  </p>
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                      <h4 className="text-[#F3C36C] text-3xl font-black mb-2">
                        90%
                      </h4>
                      <p className="text-white/40 font-medium">
                        Earnings kept by you
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[#BCEACF] text-3xl font-black mb-2">
                        $0
                      </h4>
                      <p className="text-white/40 font-medium">
                        Platform setup fee
                      </p>
                    </div>
                  </div>
                  <Link href="/signup">
                    <Button className="bg-[#F3C36C] text-[#171717] hover:bg-[#e0b460] px-8 py-6 text-lg rounded-xl font-bold">
                      Claim Your devBucket
                    </Button>
                  </Link>
                </div>
                <div className="lg:w-1/2 mt-16 lg:mt-0">
                  <div className="glass-dark rounded-3xl p-8 border-white/10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-[#F3C36C] rounded-full" />
                      <div>
                        <div className="h-4 w-32 bg-white/20 rounded-full mb-2" />
                        <div className="h-3 w-24 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-4">
                        <MessageSquare className="w-5 h-5 text-white/40 mr-3" />
                        <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                      </div>
                      <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5" />
                      <div className="h-32 w-full bg-white/5 rounded-xl border border-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Section */}
        <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#171717] mb-6">
                Ready to Scale?
              </h2>
              <p className="text-lg text-[#171717]/60 max-w-2xl mx-auto font-medium">
                Clients get a free userBucket to track project progress, manage
                invoices, and communicate directly with developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Accept Pricing",
                  desc: "Review and accept developer quotes instantly within your bucket.",
                  icon: <Zap />,
                },
                {
                  title: "Project Tracking",
                  desc: "Watch your project evolve step-by-step with real-time updates.",
                  icon: <ArrowRight />,
                },
                {
                  title: "Secure Payouts",
                  desc: "Funds stay in Webbidev until project completion is confirmed.",
                  icon: <Cpu />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#BCEACF] text-[#171717] rounded-xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#171717]">
                    {item.title}
                  </h3>
                  <p className="text-[#171717]/60 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


      </div>
    </PublicLayout>
  );
}
