import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('events');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      // Sample events from Excel
      const sampleEvents = [
        {
          id: '1',
          name: 'Airbnb Stay - All Settle',
          date: '2026-08-13',
          time: 'All Day',
          venue: 'Airbnb',
          description: 'Family and guests arrival',
          image: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2',
          type: 'preparation'
        },
        {
          id: '2',
          name: 'Engagement and Sangeet',
          date: '2026-08-14',
          time: 'Evening',
          venue: 'Outside',
          description: 'Ring ceremony and music celebration',
          image: 'https://images.pexels.com/photos/36782322/pexels-photo-36782322.jpeg',
          type: 'celebration'
        },
        {
          id: '3',
          name: 'Raata Staphana + Pooja',
          date: '2026-08-15',
          time: 'Morning',
          venue: 'Airbnb',
          description: 'Traditional pre-wedding ritual',
          image: 'https://images.unsplash.com/photo-1587271636175-90d58cdad458',
          type: 'ceremony'
        },
        {
          id: '4',
          name: 'Haldi Ceremony',
          date: '2026-08-15',
          time: 'Afternoon',
          venue: 'Airbnb',
          description: 'Turmeric ceremony for bride and groom',
          image: 'https://images.pexels.com/photos/30184716/pexels-photo-30184716.jpeg',
          type: 'ceremony'
        },
        {
          id: '5',
          name: 'Mehendi',
          date: '2026-08-15',
          time: 'Evening',
          venue: 'Airbnb',
          description: 'Henna application ceremony',
          image: 'https://images.unsplash.com/photo-1533939361134-4135bbb3658c',
          type: 'ceremony'
        },
        {
          id: '6',
          name: 'Wedding Ceremony',
          date: '2026-08-16',
          time: 'Early Morning',
          venue: 'Wedding Hall',
          description: 'Main wedding ceremony',
          image: 'https://images.unsplash.com/photo-1587271636175-90d58cdad458',
          type: 'wedding'
        },
        {
          id: '7',
          name: 'Reception',
          date: '2026-08-16',
          time: 'Evening',
          venue: 'Wedding Hall',
          description: 'Wedding reception and dinner',
          image: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2',
          type: 'celebration'
        },
        {
          id: '8',
          name: 'Vratam Pooja',
          date: '2026-08-17',
          time: 'Morning',
          venue: 'Temple/Airbnb',
          description: 'Post-wedding ritual',
          image: 'https://images.unsplash.com/photo-1587271636175-90d58cdad458',
          type: 'ceremony'
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('events', JSON.stringify(sampleEvents));
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'wedding': return 'bg-primary text-primary-foreground';
      case 'ceremony': return 'bg-accent/20 text-accent-foreground border border-accent/30';
      case 'celebration': return 'bg-secondary/20 text-secondary-foreground border border-secondary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <h1 className="heading-section mb-2">Event Timeline</h1>
          <p className="text-muted-foreground">Your wedding celebration schedule</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {events.map((event, index) => (
            <div key={event.id} className="relative pb-8 last:pb-0">
              {/* Timeline line */}
              {index !== events.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
              )}

              <div className="flex gap-6">
                {/* Date indicator */}
                <div className="relative flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-soft)] z-10">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium">{format(new Date(event.date), 'MMM')}</p>
                    <p className="text-lg font-semibold">{format(new Date(event.date), 'd')}</p>
                  </div>
                </div>

                {/* Event card */}
                <Card className="flex-1 card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
                  <div className="relative">
                    {event.image && (
                      <div className="h-48 md:h-64 rounded-t-xl overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                        <Badge className={`absolute top-4 right-4 ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-3">{event.name}</h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
