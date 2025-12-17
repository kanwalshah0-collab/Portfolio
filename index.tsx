import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Linkedin, 
  Briefcase, 
  Zap, 
  Users, 
  Brain, 
  Code, 
  BarChart,
  ExternalLink,
  Github,
  Layers,
  Smartphone,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Award
} from 'lucide-react';

/* --- Main App Container --- */

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = 4;
  const touchStartY = useRef(0);

  // Debounce for wheel events
  const handleWheel = (e: React.WheelEvent) => {
    if (isAnimating) return;
    
    if (e.deltaY > 50) {
      nextSlide();
    } else if (e.deltaY < -50) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isAnimating]);

  // Touch navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAnimating) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-[#F8F7FC] text-[#2D2645] relative"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GeometricBackground />
      <Navbar currentSlide={currentSlide} goToSlide={goToSlide} />
      <NavigationDots currentSlide={currentSlide} totalSlides={totalSlides} goToSlide={goToSlide} />
      <SectionNumber currentSlide={currentSlide} />

      {/* Slider Container */}
      <div 
        className="h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1.000)]"
        style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
      >
        <Slide>
          <AboutMe isActive={currentSlide === 0} />
        </Slide>
        <Slide>
          <CoreCompetencies isActive={currentSlide === 1} />
        </Slide>
        <Slide>
          <Experience isActive={currentSlide === 2} />
        </Slide>
        <Slide>
          <Projects isActive={currentSlide === 3} />
        </Slide>
      </div>
    </div>
  );
};

/* --- Geometric Background --- */
const GeometricBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Large Outline Top Right */}
    <svg className="absolute -top-20 -right-20 w-[600px] h-[600px] text-[#6B5B9C]/5 animate-pulse" viewBox="0 0 100 100">
      <path d="M50 0 L100 100 L0 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    </svg>
    
    {/* Filled Accent Bottom Left */}
    <svg className="absolute -bottom-40 -left-40 w-[800px] h-[800px] text-[#9B8AC4]/10" viewBox="0 0 100 100">
      <path d="M50 0 L100 100 L0 100 Z" fill="currentColor" />
    </svg>

    {/* Floating Elements */}
    <div className="absolute top-1/4 left-10 w-8 h-8 border border-[#6B5B9C]/20 rotate-45"></div>
    <div className="absolute bottom-1/3 right-20 w-12 h-12 bg-[#8B7BB8]/10 rounded-full"></div>
    <div className="absolute top-1/2 right-1/4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[26px] border-b-[#6B5B9C]/10 rotate-12"></div>
  </div>
);

/* --- Layout Components --- */

const Slide = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`h-screen w-full flex items-center justify-center px-6 md:px-20 relative ${className}`}>
    <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center relative z-10">
      {children}
    </div>
  </div>
);

const Navbar = ({ currentSlide, goToSlide }: { currentSlide: number, goToSlide: (idx: number) => void }) => {
  const links = ['About Me', 'Core Competencies', 'Experience', 'Projects'];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-[#F8F7FC]/80 backdrop-blur-sm">
      <div className="text-2xl font-bold tracking-tight text-[#2D2645] font-['Space_Grotesk'] cursor-pointer group" onClick={() => goToSlide(0)}>
        SK<span className="text-[#6B5B9C] group-hover:text-[#8B7BB8] transition-colors">.</span>
      </div>
      <div className="hidden md:flex gap-10">
        {links.map((link, index) => (
          <button
            key={link}
            onClick={() => goToSlide(index)}
            className={`text-sm font-['Space_Grotesk'] font-medium tracking-wide uppercase transition-all duration-300 relative ${
              currentSlide === index ? 'text-[#6B5B9C]' : 'text-[#4A3C75] hover:text-[#6B5B9C]'
            }`}
          >
            {link}
            {currentSlide === index && (
              <motion.div 
                layoutId="nav-underline" 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#6B5B9C]" 
              />
            )}
          </button>
        ))}
      </div>
      <div className="md:hidden">
        <span className="text-[#6B5B9C] font-['Space_Grotesk'] font-bold">{links[currentSlide]}</span>
      </div>
    </nav>
  );
};

const NavigationDots = ({ currentSlide, totalSlides, goToSlide }: { currentSlide: number, totalSlides: number, goToSlide: (idx: number) => void }) => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
    {Array.from({ length: totalSlides }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => goToSlide(idx)}
        className={`w-2.5 h-2.5 rotate-45 transition-all duration-300 border border-[#6B5B9C] ${
          currentSlide === idx ? 'bg-[#6B5B9C] scale-150' : 'bg-transparent hover:bg-[#6B5B9C]/30'
        }`}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ))}
  </div>
);

const SectionNumber = ({ currentSlide }: { currentSlide: number }) => (
  <div className="fixed bottom-0 right-0 p-6 md:p-12 z-0 pointer-events-none opacity-[0.03]">
    <span className="text-[15rem] leading-none font-['Space_Grotesk'] font-bold text-[#2D2645]">
      0{currentSlide + 1}
    </span>
  </div>
);

/* --- Section Components --- */

const AboutMe = ({ isActive }: { isActive: boolean }) => (
  <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 h-full pt-20">
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex-1 space-y-8"
    >
      <div className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest text-[#6B5B9C] uppercase bg-[#6B5B9C]/10 rounded-full">
        Introduction
      </div>
      <h1 className="text-6xl md:text-8xl font-['Space_Grotesk'] font-bold text-[#2D2645] leading-[0.9]">
        About <span className="text-[#6B5B9C]">Me</span>
      </h1>
      <div className="space-y-4 text-lg leading-relaxed text-[#4A3C75]">
        <p>
          Hello! I'm <strong className="text-[#2D2645]">Samina Kanwal</strong>, a visionary Product Manager and Design Leader with over 7 years of experience bridging the gap between user insights and business growth.
        </p>
        <p>
          I specialize in transforming complex problems into intuitive digital experiences across Mobility, E-commerce, Fintech, and SaaS sectors. My approach combines data-driven strategy with creative "vibe coding" to deliver products that resonate deeply with users.
        </p>
        <p>
          Currently driving innovation at Tech Alphalogix, I'm passionate about AI integration, progressive disclosure, and building high-performing, empathetic design teams.
        </p>
      </div>
      
      <div className="flex gap-4 pt-4">
        <a href="mailto:kanwalshah0@gmail.com" className="flex items-center gap-2 px-8 py-3 bg-[#6B5B9C] hover:bg-[#4A3C75] text-white font-bold font-['Space_Grotesk'] tracking-wide rounded-lg transition-all shadow-lg shadow-[#6B5B9C]/20">
          <Mail size={18} /> Contact Me
        </a>
        <a href="https://www.linkedin.com/in/samina-kanwal/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3 border-2 border-[#6B5B9C] text-[#6B5B9C] hover:bg-[#6B5B9C] hover:text-white font-bold font-['Space_Grotesk'] tracking-wide rounded-lg transition-all">
          <Linkedin size={18} /> LinkedIn
        </a>
      </div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
      animate={isActive ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.9, rotate: -5 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="flex-1 relative w-full max-w-md aspect-square md:aspect-[3/4] hidden md:block"
    >
      {/* Decorative Triangles behind photo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 border-[3px] border-[#6B5B9C]/20 transform rotate-12"></div>
      <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-[#9B8AC4]/20 transform -rotate-12 clip-triangle"></div>
      
      <div className="absolute inset-0 border-[3px] border-[#6B5B9C] translate-x-3 translate-y-3 rounded-2xl"></div>
      <div className="absolute inset-0 bg-[#F8F7FC] rounded-2xl overflow-hidden flex items-center justify-center shadow-xl shadow-[#6B5B9C]/10 group">
         {/* Placeholder for Photo */}
         <div className="text-center p-8 group-hover:scale-105 transition-transform duration-500 z-10">
            <Users size={64} className="text-[#6B5B9C] mx-auto mb-4" />
            <p className="font-['Space_Grotesk'] font-bold text-2xl text-[#2D2645]">Samina Kanwal</p>
            <p className="text-sm text-[#8B7BB8] font-medium uppercase tracking-widest mt-2">Product & Design Lead</p>
         </div>
         <div className="absolute inset-0 bg-gradient-to-tr from-[#9B8AC4]/10 to-transparent"></div>
      </div>
    </motion.div>
  </div>
);

const CoreCompetencies = ({ isActive }: { isActive: boolean }) => {
  const skills = [
    { title: "Product Strategy", desc: "Defining vision, roadmaps, and GTM strategies that align business goals with user needs.", icon: Briefcase },
    { title: "Agile Leadership", desc: "Optimizing sprint velocities and leading cross-functional teams to efficient delivery.", icon: Zap },
    { title: "UX Research", desc: "Deep diving into user behaviors through qualitative and quantitative analysis methods.", icon: Users },
    { title: "GenAI & RAG", desc: "Implementing LLMs and Retrieval-Augmented Generation for smarter product solutions.", icon: Brain },
    { title: "Technical Tools", desc: "Proficiency in JIRA, Figma, Mixpanel, and low-code prototyping platforms.", icon: Code },
    { title: "Data Analytics", desc: "Leveraging Tableau and Heap to drive decision-making through actionable metrics.", icon: BarChart },
  ];

  return (
    <div className="h-full flex flex-col justify-center pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className="mb-10 text-center md:text-left relative"
      >
        <div className="hidden md:block absolute -left-12 top-0 bottom-0 w-1 bg-[#6B5B9C]"></div>
        <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold text-[#2D2645] mb-2">
          Core <span className="text-[#6B5B9C]">Competencies</span>
        </h2>
        <div className="h-1 w-24 bg-[#6B5B9C] md:hidden mx-auto"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
            className="glass-card p-6 rounded-2xl group cursor-default relative overflow-hidden"
          >
            {/* Corner Triangle Decoration */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-[#6B5B9C]/5 transform rotate-45 translate-x-6 -translate-y-6 group-hover:bg-[#6B5B9C]/10 transition-colors"></div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#F8F7FC] text-[#6B5B9C] rounded-xl border border-[#6B5B9C]/20 shadow-sm group-hover:scale-110 transition-transform">
                <skill.icon size={24} />
              </div>
              <h3 className="text-xl font-['Space_Grotesk'] font-bold text-[#2D2645]">{skill.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#4A3C75]">
              {skill.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Experience = ({ isActive }: { isActive: boolean }) => {
  const jobs = [
    {
      date: "2025 - Present",
      role: "Senior Product Manager",
      company: "Tech Alphalogix",
      desc: "Leading AI chatbot & LMS platform development. Improved course suggestions by 70% using RAG technology."
    },
    {
      date: "2024 - 2025",
      role: "Senior PM, Expansion",
      company: "Motive",
      desc: "Spearheaded UK & Mexico localization. Increased adoption by 27% and optimized team velocity by 49%."
    },
    {
      date: "2022 - 2024",
      role: "Compliance PM",
      company: "Royal Cyber",
      desc: "Led SOC 2, GDPR SaaS products. Automated compliance workflows reducing operational costs by 10%."
    }
  ];

  return (
    <div className="h-full flex flex-col justify-center pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        className="mb-12 text-center"
      >
        <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold text-[#2D2645]">
          Professional <span className="text-[#6B5B9C]">Journey</span>
        </h2>
      </motion.div>

      <div className="relative max-w-4xl mx-auto w-full">
        {/* Central Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6B5B9C]/20 via-[#6B5B9C] to-[#6B5B9C]/20"></div>

        <div className="space-y-12">
          {jobs.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: idx * 0.2 + 0.3 }}
              className={`flex flex-col md:flex-row gap-8 items-start ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Dot (Diamond shape) */}
              <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[#F8F7FC] border-[3px] border-[#6B5B9C] z-10 mt-1.5 rotate-45"></div>

              {/* Date (Opposite side on desktop) */}
              <div className={`hidden md:block w-1/2 text-right ${idx % 2 === 1 ? 'text-left' : ''} pt-1`}>
                <span className="text-[#6B5B9C] font-['Space_Grotesk'] font-bold text-xl tracking-wide">{job.date}</span>
              </div>

              {/* Content Card */}
              <div className="pl-12 md:pl-0 w-full md:w-1/2">
                <div className="glass-card p-6 rounded-2xl relative">
                  <span className="md:hidden text-[#6B5B9C] text-sm font-bold block mb-2">{job.date}</span>
                  <h3 className="text-2xl font-['Space_Grotesk'] font-bold text-[#2D2645] mb-1">{job.role}</h3>
                  <div className="text-[#8B7BB8] text-sm font-bold uppercase tracking-wider mb-3">{job.company}</div>
                  <p className="text-sm text-[#4A3C75]">{job.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = ({ isActive }: { isActive: boolean }) => {
  const projects = [
    {
      title: "AKF LMS Chatbot",
      desc: "LMS assistant improving course suggestions by 70% via conversational design.",
      tags: ["Python", "GenAI", "React"],
      icon: Layers
    },
    {
      title: "Bykea",
      desc: "Redesigned architecture reducing match time from 4.2m to 1m.",
      tags: [
        { name: "Figma", url: "https://play.google.com/store/apps/details?id=com.bykea.pk.partner&hl=en-US" }, 
        { name: "Mobile", url: "https://play.google.com/store/apps/details?id=com.bykea.pk.partner&hl=en-US" }, 
        "Analytics"
      ],
      icon: Smartphone
    },
    {
      title: "Secura Cloud",
      desc: "Automated workflows for SOC 2 & GDPR, saving 10% costs.",
      tags: [
        { name: "Automation", url: "https://securacloud.io/" },
        { name: "Cloud", url: "https://securacloud.io/" },
        { name: "SaaS", url: "https://securacloud.io/" }
      ],
      icon: ShieldCheck
    },
    {
      title: "Motive",
      country: "Scaled to Mexico & UK",
      desc: "Led product expansion increasing adoption by 27%.",
      tags: ["Strategy", "i18n", "Growth"],
      icon: ExternalLink
    }
  ];

  return (
    <div className="h-full flex flex-col justify-center pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        className="mb-10 flex flex-col items-center"
      >
        <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold text-[#2D2645] mb-2">
          Featured <span className="text-[#6B5B9C]">Projects</span>
        </h2>
        <div className="h-1 w-24 bg-[#6B5B9C]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
            className="group relative h-48 md:h-64 rounded-3xl overflow-hidden bg-white border border-[#6B5B9C]/10 shadow-lg shadow-[#6B5B9C]/5 hover:shadow-xl hover:shadow-[#6B5B9C]/20 hover:border-[#6B5B9C]/30 transition-all duration-300"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
               <project.icon size={120} className="text-[#6B5B9C]" />
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-['Space_Grotesk'] font-bold text-[#2D2645] mb-2 group-hover:text-[#6B5B9C] transition-colors">{project.title}</h3>
                
                {(project as any).country && (
                   <p className="text-xs font-bold text-[#6B5B9C] uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{(project as any).country}</p>
                )}

                <p className="text-sm text-[#4A3C75] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.desc}
                </p>
                <div className="flex gap-2">
                  {project.tags.map((tag, i) => {
                    const isLink = typeof tag !== 'string';
                    const tagName = isLink ? tag.name : tag;
                    const tagUrl = isLink ? tag.url : null;
                    
                    if (isLink && tagUrl) {
                      return (
                        <a 
                          key={i} 
                          href={tagUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B9C] bg-[#F8F7FC] border border-[#6B5B9C]/20 px-3 py-1 rounded-full hover:bg-[#6B5B9C] hover:text-white transition-colors relative z-20 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tagName}
                        </a>
                      );
                    }
                    
                    return (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B9C] bg-[#F8F7FC] border border-[#6B5B9C]/20 px-3 py-1 rounded-full">
                        {tagName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Corner Triangle Accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-[#6B5B9C]/10 group-hover:border-r-[#6B5B9C] transition-all duration-300"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);