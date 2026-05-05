import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Phone, Mail, MapPin, DollarSign, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toCamelCaseArray, toSnakeCase } from '../lib/supabaseHelpers';

const VENDOR_CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Decoration', 'Audio/DJ',
  'Priest', 'Makeup Artist', 'Mehendi Artist', 'Transportation'
];

export const Vendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    const { data } = await supabase.from('vendors').select('*');
    if (data && data.length > 0) {
      setVendors(toCamelCaseArray(data));
      return;
    }

    // Default vendors sourced from Wedding Planner.pdf (venue sheet + vendor task sheet)
    const defaultVendors = [
      // Venues - Page 4 of PDF
      { id: '1', name: 'Martinsville', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'Over Budget.', rating: 0 },
      { id: '2', name: 'Razberry', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$6,737', notes: 'Next Week Visit plan/review. 70/person = $4900, Deposit $1000, Cleaning $500, 6% tax + 20% gratuity. Extra hour rental: $835. Cancellation: yet to ask + extra hour rental.', rating: 0 },
      { id: '3', name: 'Perona Farms', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'Over Budget.', rating: 0 },
      { id: '4', name: 'Akbar', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '$10,000', notes: 'Visit today. ~$50/55 per person + tax + cleaning fee + gratuity. 3 event bonanza $10000. Refundable.', rating: 0 },
      { id: '5', name: 'Greenhouse Loft', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '6', name: 'Arts Annex', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '7', name: 'Pines Manor', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'Not as per tradition. Catering required.', rating: 0 },
      { id: '8', name: 'Born to Run Farm', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '9', name: "Johnson's Locust Hall Farm", category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '10', name: 'The Barn on South Holland', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '11', name: 'Park Chateau Estate and Gardens', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'Not Available.', rating: 0 },
      { id: '12', name: 'Sterlingbrook Farm Events', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '13', name: 'WoodsEdge Farm Weddings & Events, LLC', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '14', name: 'Crystal Plaza', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '15', name: 'Merced Manor', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'Not Available for Aug 16 2026.', rating: 0 },
      { id: '16', name: 'Vanderhaven Farm Village I', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'Not suitable venue.', rating: 0 },
      { id: '17', name: "Nanina's In the Park", category: 'Venue', status: 'contacted', phone: '', email: '', cost: '', notes: 'Awaiting for their call/email.', rating: 0 },
      { id: '18', name: 'The Imperia by Dhaba', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$4,480 / $6,272', notes: 'Visit today. ~$50/70 per person, 22% gratuity + 6% tax. 75 ppl capacity to pay for room rent + extra hour rental rate. Extra hour: ~$500-700. Non Refundable.', rating: 0 },
      { id: '19', name: 'Deewan Banquet', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '~$2,761 / ~$3,358', notes: 'Visit today. $32/$40 - 5 hour. ~2761 for 70ppl Silver, ~3358 for 70pp Gold. $400 for 2 dressing rooms + extra hour rental rate. Extra hour: $400-500. Non Refundable.', rating: 0 },
      { id: '20', name: 'Chamkila', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$4,472', notes: 'Visit today. ~$40/person 5 hour, 18% + 6% tax + extra hour rental rate. Extra hour: $500. Refundable. Decoration ~$1000.', rating: 0 },
      { id: '21', name: 'Brick house Farm', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '~$7,200-$7,400', notes: 'Visit today, Check Airbnb. Not available. ~7000 + no tax/gratuity + cleaning fee. Refundable.', rating: 0 },
      { id: '22', name: 'Moghul Ballroom', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$4,952 / $5,942 / $6,753', notes: 'Visit today. $55/$66/$75 + 4 hour, 22% + 6.625% + extra hour rental rate. Extra hour: $570-800. Non Refundable.', rating: 0 },
      { id: '23', name: 'Lake Chateau Banquets', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '', notes: 'Visited today / no manager to discuss.', rating: 0 },
      { id: '24', name: 'The Park villa', category: 'Venue', status: 'not-contacted', phone: '', email: '', cost: '', notes: '', rating: 0 },
      { id: '25', name: 'Bridgewater Temple', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '', notes: 'No hall available for Aug 16th vratham / excluded for wedding.', rating: 0 },
      { id: '26', name: 'Sai Datta Peetham', category: 'Venue', status: 'rejected', phone: '', email: '', cost: '$1,200', notes: 'Community hall has kitchen, last option.', rating: 0 },
      { id: '27', name: 'Imperia (Friday/Sunday option)', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '~$3,100 (negotiable)', notes: 'Visited. Friday $1900 + 350 + 6%. Sunday $1600 + 350 + 6%. Both $3105. 6hr. Audio: included.', rating: 0 },
      { id: '28', name: 'Guru Palace', category: 'Venue', status: 'contacted', phone: '', email: '', cost: '$3,180 (70 ppl) / $4,500 (100 ppl)', notes: 'Visited, no groom room. $36/person + 6% + 20% gratuity. 6hr. Photographer: Lisa. $25/person if no food * 70.', rating: 0 },

      // Other vendor categories (page 2 task list / page 1 priest booking)
      { id: '29', name: 'Sharad Pandit', category: 'Priest', status: 'booked', phone: '', email: '', cost: '$1,000', notes: 'Booked for Aug 16th wedding. Priest fee: wedding $1300 + vratham $700.', rating: 5 },
      { id: '30', name: 'Mehendi Artist (TBD)', category: 'Mehendi Artist', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JC. Mehendi artist still needs to be sourced.', rating: 0 },
      { id: '31', name: 'Makeup Artist (TBD)', category: 'Makeup Artist', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JC. Includes Bride makeup, hair, draping, artist travel expense.', rating: 0 },
      { id: '32', name: 'Hair Stylist (TBD)', category: 'Makeup Artist', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JC.', rating: 0 },
      { id: '33', name: 'Saree Draping (TBD)', category: 'Makeup Artist', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JC.', rating: 0 },
      { id: '34', name: 'Catering Vendor (TBD)', category: 'Catering', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JD. Includes Airbnb catering and main wedding catering. Dependency: 7, 14, 9.', rating: 0 },
      { id: '35', name: 'Photographer (TBD)', category: 'Photography', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JD. Lisa mentioned via Guru Palace as a contact.', rating: 0 },
      { id: '36', name: 'Videographer (TBD)', category: 'Videography', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JD. Bundled with photography in PDF.', rating: 0 },
      { id: '37', name: 'Audio/DJ (TBD)', category: 'Audio/DJ', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JD.', rating: 0 },
      { id: '38', name: 'Haldi Decoration (TBD)', category: 'Decoration', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Decoration for Haldi ceremony.', rating: 0 },
      { id: '39', name: 'Event Decoration (TBD)', category: 'Decoration', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Assigned to JC/JD. General event decoration.', rating: 0 },
      { id: '40', name: 'Car Rental (TBD)', category: 'Transportation', status: 'not-contacted', phone: '', email: '', cost: '', notes: 'Rental car for the wedding period.', rating: 0 }
    ];
    const snakeVendors = defaultVendors.map((v) => toSnakeCase(v));
    await supabase.from('vendors').insert(snakeVendors);
    setVendors(defaultVendors);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'visited':
        return <Clock className="w-4 h-4 text-accent" />;
      case 'contacted':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'not-contacted':
        return <Clock className="w-4 h-4 text-muted-foreground/60" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'not-contacted') return 'Not contacted';
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
