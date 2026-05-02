import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Heart, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const DECOR_CATEGORIES = [
  'All', 'Mandap', 'Floral', 'Marigold', 'Jasmine', 'Stage', 'Entrance'
];

export const Decorations = () => {
  const [decorations, setDecorations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadDecorations();
    const saved = localStorage.getItem('favoriteDecor');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const loadDecorations = () => {
    // Text-based decoration ideas for South Indian wedding
    const decorIdeas = [
      { id: '1', category: 'Mandap', title: 'Traditional Mandap Setup', description: 'Four-pillar mandap with floral decorations, silk drapes in red and gold' },
      { id: '2', category: 'Mandap', title: 'Elegant Stage Decoration', description: 'Raised platform with backdrop, chandelier, and flower arrangements' },
      { id: '3', category: 'Stage', title: 'Grand Stage Design', description: 'Multi-level stage with LED lighting, cascading flowers, and traditional elements' },
      { id: '4', category: 'Marigold', title: 'Marigold Garlands', description: 'Fresh marigold string decorations for entrance and mandap pillars' },
      { id: '5', category: 'Marigold', title: 'Marigold Decor', description: 'Marigold flower arrangements in brass urns, traditional kolam patterns' },
      { id: '6', category: 'Marigold', title: 'Traditional Marigold', description: 'Orange and yellow marigold torans for doorways and arches' },
      { id: '7', category: 'Jasmine', title: 'Jasmine Arrangements', description: 'White jasmine strings for hair decoration and venue ambiance' },
      { id: '8', category: 'Jasmine', title: 'Fresh Jasmine Decor', description: 'Jasmine garlands and vases for fragrance and elegance' },
      { id: '9', category: 'Jasmine', title: 'Jasmine Garlands', description: 'Traditional gajra and malai for bride, groom, and guests' },
      { id: '10', category: 'Jasmine', title: 'Jasmine Flowers', description: 'Loose jasmine petals for rangoli and table decorations' },
      { id: '11', category: 'Floral', title: 'Floral Arrangements', description: 'Mixed flower bouquets with roses, lilies, and orchids' },
      { id: '12', category: 'Floral', title: 'Modern Floral Design', description: 'Contemporary flower installations with tropical elements' },
      { id: '13', category: 'Floral', title: 'Elegant Flowers', description: 'White and pastel flower combinations for sophisticated look' },
      { id: '14', category: 'Floral', title: 'Floral Centerpieces', description: 'Table centerpieces with seasonal flowers and candles' },
      { id: '15', category: 'Entrance', title: 'Entrance Decoration', description: 'Grand entrance arch with flowers, lights, and traditional lamps' },
      { id: '16', category: 'Entrance', title: 'Welcome Gate', description: 'Decorated entrance with banana leaves and coconut arrangements' },
      { id: '17', category: 'Stage', title: 'Photo Backdrop', description: 'Customized backdrop for photography with couple names and date' },
      { id: '18', category: 'Mandap', title: 'Temple-style Mandap', description: 'Traditional South Indian temple-inspired mandap design' },
    ];
    setDecorations(decorIdeas);
  };

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteDecor', JSON.stringify(newFavorites));
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const filteredDecorations = decorations.filter(decor => {
    const matchesCategory = selectedCategory === 'All' || decor.category === selectedCategory;
    const matchesSearch = decor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          decor.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-secondary" />
            <h1 className="heading-section">Decoration Gallery</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Browse curated South Indian wedding decoration ideas for each event
          </p>
          
          {/* Search */}
          <div className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search decorations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {/* Category Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex-wrap h-auto gap-2">
            {DECOR_CATEGORIES.map(category => {
              const count = category === 'All' 
                ? decorations.length 
                : decorations.filter(d => d.category === category).length;
              return (
                <TabsTrigger key={category} value={category}>
                  {category} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecorations.map((decor) => (
            <Card
              key={decor.id}
              className="card-elegant hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer animate-fade-in"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {decor.category}
                  </Badge>
                  <button
                    onClick={() => toggleFavorite(decor.id)}
                    className="transition-transform hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(decor.id)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>

                <h4 className="font-semibold text-lg mb-2">{decor.title}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {decor.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => toast.info('Add to Pinterest board or save for reference')}
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDecorations.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No decorations found. Try a different search or category.</p>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-12 pt-12 border-t border-border">
            <h2 className="heading-card mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              Your Favorites ({favorites.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decorations
                .filter(d => favorites.includes(d.id))
                .map(decor => (
                  <Card
                    key={decor.id}
                    className="card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">{decor.category}</Badge>
                        <button
                          onClick={() => toggleFavorite(decor.id)}
                        >
                          <Heart className="w-4 h-4 fill-primary text-primary" />
                        </button>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{decor.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{decor.description}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Decorations;
