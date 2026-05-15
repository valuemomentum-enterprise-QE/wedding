import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FloralDecoration } from '../components/landing/FloralDecoration';
import { LandingButton } from '../components/landing/LandingButton';
import { LandingSideNav } from '../components/landing/LandingSideNav';
import {
  LandingFrameBackground,
  landingFrameMinHeightClass,
} from '../components/landing/LandingFrameBackground';
import { useWeddingSiteData } from '../hooks/useWeddingSiteData';
import { parseWeddingDate } from '../lib/weddingUtils';
import { format } from 'date-fns';

const HERO_BG = 'rgb(254, 250, 238)';
const FLOWER_2 = `${process.env.PUBLIC_URL}/landing/flower2.png`;

const nameDisplayStyle = {
  fontSize: '1em',
  fontWeight: 400,
  fontStyle: 'normal',
  color: 'rgb(51, 61, 35)',
  fontKerning: 'none',
  textDecorationLine: 'none',
  textDecorationThickness: 'initial',
  textDecorationStyle: 'initial',
};

const SECTION_3_BG = `${process.env.PUBLIC_URL}/landing/section-3-bg.png`;

const PHOTOS = {
  romance1:
    'https://images.unsplash.com/photo-1606800052052-a08af8348e18?w=600&q=80&auto=format&fit=crop',
  romance2:
    'https://images.unsplash.com/photo-1522673607200-83627fc837ce?w=600&q=80&auto=format&fit=crop',
  ceremony:
    'https://images.unsplash.com/photo-1654156577076-e0350ba86cc1?w=800&q=85&auto=format&fit=crop',
};

const frameContentClass = `relative z-10 flex flex-col items-center justify-center w-full max-w-full ${landingFrameMinHeightClass()}`;

export const Landing = () => {
  const { couple, venue, story, rsvp } = useWeddingSiteData();
  const weddingDate = parseWeddingDate(couple.weddingDate);

  const scrollToRsvp = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page min-h-screen text-foreground font-body overflow-x-hidden max-w-[100vw]">
      <LandingSideNav groom={couple.groom} bride={couple.bride} />

      {/* Section 1 — cream hero, botanical left, names right */}
      <section className="relative overflow-hidden" style={{ background: HERO_BG }}>
        <div
          className={`relative z-10 flex w-full max-w-full items-stretch ${landingFrameMinHeightClass()}`}
        >
          <div className="flex w-full flex-col md:flex-row md:items-center">
            <div className="flex w-full shrink-0 items-center justify-center px-6 pb-6 pt-10 md:w-[42%] md:justify-start md:px-6 md:pb-0 md:pl-10 md:pr-4 md:pt-0 lg:w-[40%] lg:pl-14">
              <img
                src={FLOWER_2}
                alt=""
                className="h-auto w-[78%] max-w-[min(400px,88vw)] object-contain object-center md:h-[min(78vh,720px)] md:max-h-none md:w-auto md:max-w-[92%] md:object-left"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-14 pt-2 text-center md:items-center md:px-10 md:pb-12 md:pt-0">
              <div className="animate-fade-in flex flex-col gap-3 sm:gap-4">
                <p style={nameDisplayStyle}>{couple.groom}</p>
                <p style={nameDisplayStyle}>{couple.bride}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — peach romance */}
      <section className="landing-section-peach relative py-12 sm:py-16 md:py-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="flex gap-2 sm:gap-4 justify-center md:justify-end order-2 md:order-1 max-w-full">
            <div className="relative w-[44%] sm:w-[38%] max-w-[180px] sm:max-w-[200px] shrink-0">
              <img
                src={PHOTOS.romance1}
                alt="Couple portrait — photo coming soon"
                className="w-full aspect-[3/4] object-cover rounded-sm shadow-md"
              />
              <FloralDecoration size="sm" className="-bottom-2 -left-4 sm:-bottom-4 sm:-left-8 z-10" />
            </div>
            <img
              src={PHOTOS.romance2}
              alt="Couple celebration — photo coming soon"
              className="w-[44%] sm:w-[38%] max-w-[180px] sm:max-w-[200px] aspect-[3/4] object-cover rounded-sm shadow-md mt-6 sm:mt-8 shrink-0"
            />
          </div>
          <div className="order-1 md:order-2 text-center md:text-left px-1 min-w-0">
            <h2 className="font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl tracking-[0.1em] sm:tracking-[0.15em] mb-5 sm:mb-8 leading-snug">
              A WHIRLWIND ROMANCE
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/85 mb-4 max-w-md mx-auto md:mx-0">
              {story.paragraph1}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/85 max-w-md mx-auto md:mx-0">
              {story.paragraph2}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — cream ceremony */}
      <section className="landing-section-cream relative py-12 sm:py-16 md:py-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center md:text-left px-1 order-2 md:order-1 min-w-0">
            <h2 className="font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] sm:tracking-[0.12em] mb-6 sm:mb-10 leading-snug">
              JOIN THEIR<br />INTIMATE CEREMONY.
            </h2>
            <ul className="space-y-2 text-sm sm:text-base tracking-wide text-foreground/90 font-light break-words">
              <li>{venue.time}</li>
              <li>{venue.dateDisplay || format(weddingDate, 'EEEE, MMMM do, yyyy')}</li>
              <li className="font-medium pt-1">{venue.name}</li>
              <li>{venue.address}</li>
              <li className="text-foreground/60 text-xs sm:text-sm pt-2 italic">
                South Indian Wedding · {couple.location || 'USA'}
              </li>
              {venue.accessible && (
                <li className="text-foreground/50 text-xs pt-1">The venue is wheelchair accessible.</li>
              )}
            </ul>
          </div>
          <div className="relative order-1 md:order-2 flex justify-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto overflow-hidden">
            <img
              src={PHOTOS.ceremony}
              alt="Wedding ceremony"
              className="w-full aspect-[3/4] object-cover rounded-sm shadow-lg relative z-0"
            />
            <FloralDecoration
              size="md"
              className="bottom-0 right-0 translate-x-1 translate-y-1 sm:translate-x-2 sm:translate-y-2 sm:-right-6 z-10"
            />
          </div>
        </div>
      </section>

      {/* Section 4 — RSVP footer */}
      <section id="rsvp" className="relative overflow-hidden bg-peach">
        <LandingFrameBackground imageUrl={SECTION_3_BG} />
        <div className={`${frameContentClass} px-4 sm:px-6 py-14 sm:py-20 md:py-28 text-center`}>
          <div className="max-w-xl mx-auto min-w-0 px-1">
            <h2 className="font-display text-lg xs:text-xl sm:text-2xl md:text-3xl tracking-[0.12em] sm:tracking-[0.18em] mb-5 sm:mb-6 leading-snug">
              THEY&apos;RE EXCITED<br />TO SEE YOU THERE!
            </h2>
            <ChevronDown className="w-5 h-5 mx-auto mb-6 sm:mb-8 text-foreground/50" strokeWidth={1} />
            <LandingButton variant="filled" onClick={scrollToRsvp}>
              {rsvp.label || 'RSVP'}
            </LandingButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
