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

const SECTION_1_BG = `${process.env.PUBLIC_URL}/landing/section-1-bg.png`;
const SECTION_3_BG = `${process.env.PUBLIC_URL}/landing/section-3-bg.png`;

const PHOTOS = {
  romance1:
    'https://images.unsplash.com/photo-1606800052052-a08af8348e18?w=600&q=80&auto=format&fit=crop',
  romance2:
    'https://images.unsplash.com/photo-1522673607200-83627fc837ce?w=600&q=80&auto=format&fit=crop',
  ceremony:
    'https://images.unsplash.com/photo-1654156577076-e0350ba86cc1?w=800&q=85&auto=format&fit=crop',
};

const frameContentClass = `relative z-10 flex flex-col items-center justify-center w-full ${landingFrameMinHeightClass()}`;

export const Landing = () => {
  const { couple, venue, story, rsvp } = useWeddingSiteData();
  const weddingDate = parseWeddingDate(couple.weddingDate);

  const scrollToRsvp = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page min-h-screen text-foreground font-body">
      <LandingSideNav groom={couple.groom} bride={couple.bride} />

      {/* Section 1 — floral frame + invitation text (same frame scale as section 4) */}
      <section className="relative overflow-hidden bg-cream">
        <LandingFrameBackground imageUrl={SECTION_1_BG} />
        <div className={`${frameContentClass} px-4 sm:px-6 py-10 sm:py-12`}>
          <div className="w-full max-w-lg mx-auto animate-fade-in text-center">
            <p className="text-[0.7rem] sm:text-xs tracking-[0.22em] uppercase text-primary mb-5">
              You&apos;re cordially invited to the wedding of
            </p>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-sage leading-snug mb-1">
              {couple.groomFullName}
            </h1>
            {couple.groomParents && (
              <p className="text-xs sm:text-sm text-foreground/80 mb-4">{couple.groomParents}</p>
            )}

            <p className="font-display text-xl text-primary my-2">&amp;</p>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-sage leading-snug mb-1">
              {couple.brideFullName}
            </h1>
            {couple.brideParents && (
              <p className="text-xs sm:text-sm text-foreground/80 mb-8">{couple.brideParents}</p>
            )}

            <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8">
              <p className="text-sm font-medium text-sage tracking-widest">
                {format(weddingDate, 'MMM').toUpperCase()}
              </p>
              <div className="text-center">
                <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-primary border-y border-sage/40 py-1 px-3">
                  {format(weddingDate, 'EEEE').toUpperCase()}
                </p>
                <p className="font-display text-5xl sm:text-6xl text-primary leading-none my-1">
                  {format(weddingDate, 'd')}
                </p>
                <p className="text-[0.65rem] sm:text-xs tracking-[0.15em] uppercase text-primary border-y border-sage/40 py-1 px-3">
                  AT {venue.time?.toUpperCase() || '11:40 AM'}
                </p>
              </div>
              <p className="text-sm font-medium text-sage tracking-widest">
                {format(weddingDate, 'yyyy')}
              </p>
            </div>

            <div className="mb-10">
              <p className="text-xs tracking-[0.2em] uppercase text-sage mb-1">At</p>
              <p className="text-sm sm:text-base text-primary leading-relaxed">{venue.address}</p>
            </div>

            <LandingButton onClick={scrollToRsvp}>RSVP Here</LandingButton>
          </div>
        </div>
      </section>

      {/* Section 2 — peach romance (placeholder couple photos) */}
      <section className="landing-section-peach relative py-16 md:py-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="flex gap-3 sm:gap-4 justify-center md:justify-end order-2 md:order-1">
            <div className="relative w-[42%] sm:w-[38%] max-w-[200px]">
              <img
                src={PHOTOS.romance1}
                alt="Couple portrait — photo coming soon"
                className="w-full aspect-[3/4] object-cover rounded-sm shadow-md"
              />
              <FloralDecoration size="sm" className="-bottom-4 -left-8 z-10" />
            </div>
            <img
              src={PHOTOS.romance2}
              alt="Couple celebration — photo coming soon"
              className="w-[42%] sm:w-[38%] max-w-[200px] aspect-[3/4] object-cover rounded-sm shadow-md mt-8"
            />
          </div>
          <div className="order-1 md:order-2 text-center md:text-left px-2">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.15em] mb-6 md:mb-8">
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
      <section className="landing-section-cream relative py-16 md:py-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="text-center md:text-left px-2 order-2 md:order-1">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.12em] mb-8 md:mb-10 leading-snug">
              JOIN THEIR<br />INTIMATE CEREMONY.
            </h2>
            <ul className="space-y-2 text-sm sm:text-base tracking-wide text-foreground/90 font-light">
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
          <div className="relative order-1 md:order-2 flex justify-center">
            <img
              src={PHOTOS.ceremony}
              alt="Wedding ceremony"
              className="w-full max-w-sm md:max-w-md aspect-[3/4] object-cover rounded-sm shadow-lg relative z-0"
            />
            <FloralDecoration
              size="md"
              className="bottom-0 right-0 sm:-right-6 translate-x-2 translate-y-2 z-10"
            />
          </div>
        </div>
      </section>

      {/* Section 4 — RSVP footer (same frame scale as section 1) */}
      <section id="rsvp" className="relative overflow-hidden bg-peach">
        <LandingFrameBackground imageUrl={SECTION_3_BG} />
        <div className={`${frameContentClass} px-6 py-20 md:py-28 text-center`}>
          <div className="max-w-xl mx-auto">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.18em] mb-6">
              THEY&apos;RE EXCITED<br />TO SEE YOU THERE!
            </h2>
            <ChevronDown className="w-5 h-5 mx-auto mb-8 text-foreground/50" strokeWidth={1} />
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
