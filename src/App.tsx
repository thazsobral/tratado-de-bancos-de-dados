import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TableOfContents } from './components/TableOfContents';
import { HeroFrontispiece } from './components/HeroFrontispiece';
import { PrologueFilesystemChaos } from './components/PrologueFilesystemChaos';
import { ChapterAcid } from './components/ChapterAcid';
import { ChapterQueryJourney } from './components/ChapterQueryJourney';
import { ChapterBPlusTree } from './components/ChapterBPlusTree';
import { ChapterDatabaseEvolution } from './components/ChapterDatabaseEvolution';
import { ChapterBigDataAndSharding } from './components/ChapterBigDataAndSharding';
import { EpilogueAndGlossary } from './components/EpilogueAndGlossary';
import { OfficialSourcesModal } from './components/OfficialSourcesModal';
import { ThemeMode } from './types';

export default function App() {
  // Theme state with local persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('db_treatise_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [activeSection, setActiveSection] = useState<string>('topo');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState<boolean>(false);
  const [focusedSourceId, setFocusedSourceId] = useState<string | null>(null);

  // Sync theme to root html element, body and browser color scheme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('db_treatise_theme', theme);
  }, [theme]);

  // Handle Reading Progress & Active Section scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setReadingProgress(Math.min(Math.max(currentProgress, 0), 100));
      }

      const sections = [
        'topo',
        'prologo',
        'capitulo-acid',
        'capitulo-query',
        'capitulo-bplus',
        'capitulo-modelos',
        'capitulo-bigdata',
        'epilogo',
      ];

      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenSource = (sourceId: string) => {
    setFocusedSourceId(sourceId);
    setIsSourcesOpen(true);
  };

  const handleOpenAllSources = () => {
    setIsSourcesOpen(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#121316] text-stone-100' : 'bg-[#FAF8F5] text-stone-900'} transition-colors duration-300 font-serif-book`}>
      {/* Top Bar Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSection={activeSection}
        onOpenToc={() => setIsTocOpen(true)}
        onOpenSources={handleOpenAllSources}
        readingProgress={readingProgress}
      />

      {/* Table of Contents Drawer */}
      <TableOfContents
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        activeSection={activeSection}
      />

      {/* Official Primary Sources Modal */}
      <OfficialSourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
        initialSourceId={focusedSourceId}
      />

      {/* Main Reading Flow */}
      <main className="w-full">
        <HeroFrontispiece onOpenSources={handleOpenAllSources} />
        <PrologueFilesystemChaos onSelectSource={handleOpenSource} />
        <ChapterAcid onSelectSource={handleOpenSource} />
        <ChapterQueryJourney onSelectSource={handleOpenSource} />
        <ChapterBPlusTree onSelectSource={handleOpenSource} />
        <ChapterDatabaseEvolution onSelectSource={handleOpenSource} />
        <ChapterBigDataAndSharding onSelectSource={handleOpenSource} />
        <EpilogueAndGlossary
          onOpenSources={handleOpenAllSources}
          onSelectSource={handleOpenSource}
        />
      </main>
    </div>
  );
}
