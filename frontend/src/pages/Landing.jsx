import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Leaf } from 'lucide-react';
import { FloralDecoration } from '../components/landing/FloralDecoration';
import { LandingButton } from '../components/landing/LandingButton';
import { useWeddingSiteData } from '../hooks/useWeddingSiteData';

const PHOTOS = {
  romance1:
    'https://images.unsplash.com/photo-1606800052052-a08af8348e18?w=600&q=80&auto=format&fit=crop',
  romance2:
    'https://images.unsplash.com/photo-1522673607200-83627fc837ce?w=600&q=80&auto=format&fit=crop',
  ceremony:
    'https://images.unsplash.com/photo-1654156577076-e0350ba86cc1?w=800&q=85&auto=format&fit=crop',
};

export const Landing = () => {
  const { couple, venue, story, registry, rsvp } = useWeddingSiteData();
  const groomName = (couple.groomFullName || couple.groom || 'Groom').toUpperCase();
  const brideName = (couple.brideFullName || couple.bride || 'Bride').toUpperCase();
  const initials = `${couple.groom || 'G'} & ${couple.bride || 'B'}`;

  const scrollToRsvp = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page min-h-screen bg-cream text-foreground font-body">
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden bg-cream">
        <FloralDecoration position="top-left" className="top-0 left-0" />
        <FloralDecoration position="top-right" className="top-0 right-0" />
        <FloralDecoration position="bottom-left" className="bottom-8 left-0 opacity-80" />
        <FloralDecoration position="bottom-right" className="bottom-8 right-0 opacity-80" />

        <div className="relative z-10 text-center max-w-2xl mx-auto animate-fade-in">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.12em] leading-tight">
            <span className="block">{groomName}</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl my-2 md:my-4 font-light tracking-[0.35em]">&amp;</span>
            <span className="block">{brideName}</span>
          </h1>
          <div className="mt-10 md:mt-14">
            <LandingButton onClick={scrollToRsvp}>RSVP Here</LandingButton>
          </div>
        </div>
      </section>

      <section className="relative bg-peach py-16 md:py-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="flex gap-3 sm:gap-4 justify-center md:justify-end order-2 md:order-1">
            <div className="relative w-[42%] sm:w-[38%] max-w-[200px]">
              <img src={PHOTOS.romance1} alt="Couple portrait" className="w-full aspect-[3/4] object-cover rounded-sm shadow-md" />
              <div className="absolute -bottom-3 -left-2 flex items-center gap-1.5 bg-cream/90 px-2 py-1 rounded-sm">
                <Leaf className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
                <span className="font-display text-sm tracking-widest">{initials}</span>
              </div>
            </div>
            <img src={PHOTOS.romance2} alt="Couple celebration" className="w-[42%] sm:w-[38%] max-w-[200px] aspect-[3/4] object-cover rounded-sm shadow-md mt-8" />
          </div>
          <div className="order-1 md:order-2 text-center md:text-left px-2">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.15em] mb-6 md:mb-8">A WHIRLWIND ROMANCE</h2>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/85 mb-4 max-w-md mx-auto md:mx-0">{story.paragraph1}</p>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/85 max-w-md mx-auto md:mx-0">{story.paragraph2}</p>
          </div>
        </div>
      </section>

      <section className="relative bg-cream py-16 md:py-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="text-center md:text-left px-2 order-2 md:order-1">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.12em] mb-8 md:mb-10 leading-snug">
              JOIN THEIR<br />INTIMATE CEREMONY.
            </h2>
            <ul className="space-y-2 text-sm sm:text-base tracking-wide text-foreground/90 font-light">
              <li>{venue.time}</li>
              <li>{venue.dateDisplay || venue.weekdayDisplay}</li>
              <li className="font-medium pt-1">{venue.name}</li>
              <li>{venue.address}</li>
              <li className="text-foreground/60 text-xs sm:text-sm pt-2 italic">
                {couple.location ? `South Indian Wedding · ${couple.location}` : 'South Indian Wedding'}
              </li>
              {venue.accessible && <li className="text-foreground/50 text-xs pt-1">The venue is wheelchair accessible.</li>}
            </ul>
          </div>
          <div className="relative order-1 md:order-2 flex justify-center">
            <img src={PHOTOS.ceremony} alt="Wedding ceremony" className="w-full max-w-sm md:max-w-md aspect-[3/4] object-cover rounded-sm shadow-lg" />
            <FloralDecoration position="bottom-right" className="bottom-0 right-0 sm:-right-4 translate-x-4 translate-y-4 w-32 sm:w-40" />
          </div>
        </div>
      </section>

      <section id="rsvp" className="relative bg-peach py-20 md:py-28 px-6 text-center overflow-hidden">
        <FloralDecoration position="bottom-left" className="bottom-0 left-0 opacity-70" />
        <FloralDecoration position="bottom-right" className="bottom-0 right-0 opacity-70" />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.18em] mb-6">
            THEY&apos;RE EXCITED<br />TO SEE YOU THERE!
          </h2>
          <ChevronDown className="w-5 h-5 mx-auto mb-8 text-foreground/50" strokeWidth={1} />
          <p className="text-sm text-foreground/75 mb-8">
            They are registered at{' '}
            <a href={registry.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground transition-colors">
              {registry.label}
            </a>
          </p>
          <LandingButton variant="filled" onClick={scrollToRsvp}>{rsvp.label || 'RSVP'}</LandingButton>
          <p className="mt-16 text-xs text-foreground/40 tracking-widest">
            <Link to="/login" className="hover:text-foreground/70 transition-colors">Couple login</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
