import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Phone, Mail, MapPin, DollarSign, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';

const VENDOR_CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Decoration', 'Audio/DJ',
  'Priest', 'Makeup Artist', 'Mehendi Artist', 'Transportation'
];

export const Vendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    const saved = localStorage.getItem('vendors');
    if (saved) {
      setVendors(JSON.parse(saved));
    } else {
      // Sample vendors from Excel
      const sampleVendors = [
        { id: '1', name: 'Martinsville Venue', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$6,737', notes: 'Over Budget. 70 ppl. Venue Cost for 70 ppl + NJ Tax+ Gratuity: 70/person =$4900, Deposit - $1000, Cleaning - $500, 6% tax + 20% Gr.', rating: 4 },
        { id: '2', name: 'Razberry', category: 'Venue', status: 'visited', phone: '', email: '', cost: '$6,737', notes: 'Next Week Visit plan/rev total', rating: 4 },
        { id: '3', name: 'Perona Farms', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$50-55/person', notes: 'Plus tax, cleaning fee, and gratuity', rating: 5 },
        { id: '4', name: 'Akbar', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '5', name: 'Greenhouse Loft', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$50-70/person', notes: '22% gratuity + 6% tax', rating: 4 },
        { id: '6', name: 'Arts Annex', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '7', name: 'Pines Manor', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '8', name: 'Born to Run Farm', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '9', name: "Johnson's Locust Hall Farm", category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '10', name: 'The Barn on South Holland', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '11', name: 'Park Chateau Estate and Ga', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '12', name: 'Sterlingbrook Farm Events', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '13', name: 'WoodsEdge Farm Wedding', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '14', name: 'Crystal Plaza', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '15', name: 'Merced Manor', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '16', name: 'Vanderhaven Farm Village', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '17', name: "Nanina's In the Park", category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '18', name: 'The Imperia by Dhaba', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$50-70/person', notes: '22% gratuity + 6% tax. $4,480/$6,272 (for 400-500 hours?), ~500-700 (Extra Hour Rental)', rating: 4 },
        { id: '19', name: 'Deewan Banquet', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$2,761', notes: 'For 70ppl +Silver, $400 for 2 dressing room, + extra hour rental rate', rating: 4 },
        { id: '20', name: 'Chamkila', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$3,358', notes: 'For 70 pp - Gold', rating: 4 },
        { id: '21', name: 'Brick house Farm', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$40/person', notes: '5 hour, 18%+6% tax + extra hour rental rate', rating: 4 },
        { id: '22', name: 'Moghul Ballroom', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$7,000', notes: 'Airbnb ~7000 + No Tax/Gratuity + Cleaning fee', rating: 4 },
        { id: '23', name: 'Lake Chateau Banquets', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$55/$66/$75+', notes: '4 hour, 22%+ 6.625% + extra hour rental rate', rating: 4 },
        { id: '24', name: 'The Park villa', category: 'Venue', status: 'contacted', phone: '', email: '', cost: 'TBD', notes: '', rating: 0 },
        { id: '25', name: 'Bridgewater Temple', category: 'Ceremony', status: 'contacted', phone: '', email: '', cost: '$1,200', notes: 'Temple ceremony venue', rating: 5 },
        { id: '26', name: 'Sai Datta Peetham', category: 'Ceremony', status: 'contacted', phone: '', email: '', cost: '$3,100', notes: 'Negotiable (6hr)', rating: 4 },
        { id: '27', name: 'Guru Palace', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$3,180', notes: '70 people, 6 hours', rating: 4 }
      ];
      setVendors(sampleVendors);
      localStorage.setItem('vendors', JSON.stringify(sampleVendors));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'visited':
        return <Clock className="w-4 h-4 text-accent" />;
      case 'contacted':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const VendorCard = ({ vendor }) => (
    <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{vendor.name}</h4>
            <Badge variant="secondary" className="text-xs">{vendor.category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(vendor.status)}
            <span className="text-xs text-muted-foreground">{getStatusLabel(vendor.status)}</span>
          </div>
        </div>

        {vendor.cost && (
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-secondary" />
            <span className="font-medium text-secondary">{vendor.cost}</span>
          </div>
        )}

        {vendor.notes && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{vendor.notes}</p>
        )}

        {vendor.rating > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < vendor.rating ? 'text-secondary' : 'text-muted-foreground'}>
                ★
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {vendor.phone && (
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-3 h-3 mr-2" />
              Call
            </Button>
          )}
          {vendor.email && (
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="w-3 h-3 mr-2" />
              Email
            </Button>
          )}
          {!vendor.phone && !vendor.email && (
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <h1 className="heading-section mb-2">Vendors</h1>
          <p className="text-muted-foreground">Manage all your wedding vendors in one place</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="flex-wrap h-auto gap-2 mb-6">
            <TabsTrigger value="All">
              All ({vendors.length})
            </TabsTrigger>
            {VENDOR_CATEGORIES.map(category => {
              const count = vendors.filter(v => v.category === category).length;
              return count > 0 ? (
                <TabsTrigger key={category} value={category}>
                  {category} ({count})
                </TabsTrigger>
              ) : null;
            })}
          </TabsList>

          <TabsContent value="All">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </TabsContent>

          {VENDOR_CATEGORIES.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors
                  .filter(v => v.category === category)
                  .map(vendor => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {vendors.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No vendors added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
