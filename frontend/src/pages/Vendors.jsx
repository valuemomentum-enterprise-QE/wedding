import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Phone, Mail, MapPin, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react';

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
        {
          id: '1',
          name: 'Martinsville Venue',
          category: 'Venue',
          status: 'contacted',
          phone: '',
          email: '',
          cost: '$6,737',
          notes: 'Over budget. 70 people. Includes cleaning fee, tax, gratuity',
          rating: 4
        },
        {
          id: '2',
          name: 'Razberry',
          category: 'Venue',
          status: 'visited',
          phone: '',
          email: '',
          cost: '$6,737',
          notes: 'Next week visit planned',
          rating: 0
        },
        {
          id: '3',
          name: 'Perona Farms',
          category: 'Venue',
          status: 'contacted',
          phone: '',
          email: '',
          cost: '$50-55/person',
          notes: 'Plus tax, cleaning fee, and gratuity',
          rating: 5
        },
        {
          id: '4',
          name: 'Bridgewater Temple',
          category: 'Ceremony',
          status: 'contacted',
          phone: '',
          email: '',
          cost: '$1,200',
          notes: 'Temple ceremony venue',
          rating: 5
        },
        {
          id: '5',
          name: 'Guru Palace',
          category: 'Venue',
          status: 'contacted',
          phone: '',
          email: '',
          cost: '$3,180',
          notes: '70 people, 6 hours',
          rating: 4
        }
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
