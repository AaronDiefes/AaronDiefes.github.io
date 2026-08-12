import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/shared/Navigation';
import SiteFooter from '../components/shared/SiteFooter';
import Hero from '../components/home/Hero';
import ProjectCard from '../components/home/ProjectCard';
import ExperienceSection from '../components/home/ExperienceSection';
import SkillsGrid from '../components/home/SkillsGrid';
import ContactBand from '../components/home/ContactBand';
import PROJECTS from '../content/projects';

/**
 * Portfolio homepage.
 *
 * Composes section components over data from src/content/. This page used to
 * carry a 268-line inline <style> block that redeclared a global `*` reset and
 * a `body` rule - both unscoped, so they leaked onto every route while the
 * homepage was mounted, and duplicated the `body.home-page` rules already in
 * global.css. Presentation now lives in src/styles/home.css.
 *
 * Section order is deliberate: hero, then the work, then experience, then
 * skills. Someone scanning for well under a minute wants evidence before
 * biography.
 */
export default function HomePage() {
  const location = useLocation();

  // Support /#projects style deep links from other routes. The element exists
  // as soon as this renders, but retry once in case paint hasn't flushed.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const tryScroll = (retries = 1) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (retries > 0) {
        requestAnimationFrame(() => tryScroll(retries - 1));
      }
    };
    tryScroll();
  }, [location.hash]);

  return (
    <>
      <Navigation />

      <div className="wrap">
        <Hero />
      </div>

      <section className="band" id="projects">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Selected projects</p>
            <h2 className="section-title">Three systems, built from the primitives up</h2>
            <p className="section-deck">
              Each has full documentation. Two run live in your browser.
            </p>
          </div>

          <div className="project-list">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.key} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ExperienceSection />
      <SkillsGrid />
      <ContactBand />
      <SiteFooter />
    </>
  );
}
