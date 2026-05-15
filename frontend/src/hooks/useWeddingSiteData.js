import { useState, useEffect } from 'react';
import { parseWeddingDate, formatWeddingDateLong } from '../lib/weddingUtils';
import { format } from 'date-fns';

const DEFAULT_SITE = {
  couple: {
    bride: 'Jahnavi',
    groom: 'Jayadeep',
    brideFullName: 'Jahnavi Chintakindi',
    groomFullName: 'Jayadeep Ram Guttikonda',
    groomParents: 'S/o Venugopal Rao Guttikonda & Satyavalli Misala',
    brideParents: 'D/o Sanjay and Jyothi Chintakindi',
    weddingDate: '2026-08-16',
    location: 'Boyds, MD',
  },
  venue: {
    time: '11:40 AM',
    name: 'Wedding Ceremony',
    address: '14700 Bubbling Spring Road, Boyds, MD, 20841',
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
          brideFullName: data.couple?.brideFullName || data.couple?.bride || DEFAULT_SITE.couple.brideFullName,
          groomFullName: data.couple?.groomFullName || data.couple?.groom || DEFAULT_SITE.couple.groomFullName,
          groomParents: data.couple?.groomParents || DEFAULT_SITE.couple.groomParents,
          brideParents: data.couple?.brideParents || DEFAULT_SITE.couple.brideParents,
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
