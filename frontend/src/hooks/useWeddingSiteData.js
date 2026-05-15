import { useState, useEffect } from 'react';
import { parseWeddingDate, formatWeddingDateLong } from '../lib/weddingUtils';
import { format } from 'date-fns';

const DEFAULT_SITE = {
  couple: {
    bride: 'JC',
    groom: 'JD',
    brideFullName: 'JC',
    groomFullName: 'JD',
    weddingDate: '2026-08-16',
    location: 'USA',
  },
  venue: {
    time: '3:00 PM onwards',
    name: 'Ceremony Venue',
    address: 'Details coming soon',
    accessible: true,
  },
  story: {
    paragraph1:
      'What began as a chance meeting blossomed into a partnership built on laughter, tradition, and shared dreams. From late-night planning calls to family celebrations, every moment has led here.',
    paragraph2:
      'They invite you to witness their South Indian wedding in the USA — a celebration where heritage meets home, surrounded by the people they love most.',
  },
  registry: {
    url: 'https://www.example.com/registry',
    label: 'www.example.com/registry',
  },
  rsvp: {
    deadline: '2026-07-01',
    label: 'RSVP by 1 July',
  },
};

export function useWeddingSiteData() {
  const [siteData, setSiteData] = useState(DEFAULT_SITE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('weddingPlannerData');
      if (!raw) return;
      const data = JSON.parse(raw);
      const weddingDate = parseWeddingDate(data.couple?.weddingDate);
      setSiteData({
        couple: {
          ...DEFAULT_SITE.couple,
          ...data.couple,
          brideFullName: data.couple?.brideFullName || data.couple?.bride || 'JC',
          groomFullName: data.couple?.groomFullName || data.couple?.groom || 'JD',
        },
        venue: {
          ...DEFAULT_SITE.venue,
          ...(data.venue || {}),
          dateDisplay: format(weddingDate, 'd MMMM, yyyy'),
          weekdayDisplay: formatWeddingDateLong(weddingDate),
        },
        story: { ...DEFAULT_SITE.story, ...(data.story || {}) },
        registry: { ...DEFAULT_SITE.registry, ...(data.registry || {}) },
        rsvp: { ...DEFAULT_SITE.rsvp, ...(data.rsvp || {}) },
      });
    } catch {
      /* keep defaults */
    }
  }, []);

  return siteData;
}
