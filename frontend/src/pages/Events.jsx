import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { parseWeddingDate } from '../lib/weddingUtils';
import { PLANNER_STORAGE_KEYS } from '../lib/plannerStorage';
import { usePlannerStorage } from '../hooks/usePlannerStorage';

export const Events = () => {
  const [events, , , { loading, syncError }] = usePlannerStorage(
    PLANNER_STORAGE_KEYS.events
  );

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'wedding': return 'bg-primary text-primary-foreground';
      case 'ceremony': return 'bg-accent/20 text-accent-foreground border border-accent/30';
      case 'celebration': return 'bg-secondary/20 text-secondary-foreground border border-secondary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen pt-mobile-header md:pt-0 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <h1 className="heading-section mb-2">Event Timeline</h1>
          <p className="text-muted-foreground">Your wedding celebration schedule</p>
          {loading && (
            <p className="text-xs text-muted-foreground mt-2">Loading events from server…</p>
          )}
          {syncError && (
            <p className="text-xs text-destructive mt-2" role="alert">{syncError}</p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {events.map((event, index) => {
            const eventDate = parseWeddingDate(event.date);
            return (
            <div key={event.id} className="relative pb-8 last:pb-0">
              {/* Timeline line */}
              {index !== events.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
              )}

              <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 min-w-0">
                {/* Date indicator */}
                <div className="relative flex flex-row xs:flex-col items-center xs:items-center gap-3 xs:gap-0 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-soft)] z-10">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="xs:mt-2 text-center">
                    <p className="text-xs font-medium">{format(eventDate, 'MMM')}</p>
                    <p className="text-lg font-semibold">{format(eventDate, 'd')}</p>
                  </div>
                </div>

                {/* Event card */}
                <Card className="flex-1 min-w-0 card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </Badge>
                    </div>
                    
                    <h3 className="text-base sm:text-xl font-semibold mb-3 break-words">{event.name}</h3>
                    
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Events;
