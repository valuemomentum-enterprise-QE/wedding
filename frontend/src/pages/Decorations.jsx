import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Heart, ExternalLink, Download, Sparkles } from 'lucide-react';
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
    // Curated decoration images from vision_expert_agent
    const decorImages = [
      { id: '1', url: 'https://images.unsplash.com/photo-1587271636175-90d58cdad458', category: 'Mandap', title: 'Traditional Mandap Setup' },
      { id: '2', url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2', category: 'Mandap', title: 'Elegant Stage Decoration' },
      { id: '3', url: 'https://images.pexels.com/photos/36782322/pexels-photo-36782322.jpeg', category: 'Stage', title: 'Grand Stage Design' },
      { id: '4', url: 'https://images.unsplash.com/photo-1661142175513-a5f0871f1ad1', category: 'Marigold', title: 'Marigold Garlands' },
      { id: '5', url: 'https://images.pexels.com/photos/35249981/pexels-photo-35249981.jpeg', category: 'Marigold', title: 'Marigold Decor' },
      { id: '6', url: 'https://images.pexels.com/photos/35868454/pexels-photo-35868454.jpeg', category: 'Marigold', title: 'Traditional Marigold' },
      { id: '7', url: 'https://images.unsplash.com/photo-1612380635121-411eda9ecbb9', category: 'Jasmine', title: 'Jasmine Arrangements' },
      { id: '8', url: 'https://images.unsplash.com/photo-1623171404570-1d196759fe20', category: 'Jasmine', title: 'Fresh Jasmine Decor' },
      { id: '9', url: 'https://images.pexels.com/photos/35827217/pexels-photo-35827217.jpeg', category: 'Jasmine', title: 'Jasmine Garlands' },
      { id: '10', url: 'https://images.unsplash.com/photo-1603026198288-6a94fa57e2af', category: 'Jasmine', title: 'Jasmine Flowers' },
      { id: '11', url: 'https://images.unsplash.com/photo-1710587385309-f264b4d503cd', category: 'Floral', title: 'Floral Arrangements' },
      { id: '12', url: 'https://images.unsplash.com/photo-1714631780604-506c00511ec3', category: 'Floral', title: 'Modern Floral Design' },
      { id: '13', url: 'https://images.unsplash.com/photo-1717980651512-6470dba293a1', category: 'Floral', title: 'Elegant Flowers' },
      { id: '14', url: 'https://images.pexels.com/photos/35546896/pexels-photo-35546896.jpeg', category: 'Floral', title: 'Floral Centerpieces' },
      { id: '15', url: 'https://images.unsplash.com/photo-1597157639073-69284dc0fdaf', category: 'Entrance', title: 'Entrance Decoration' },
    ];
    setDecorations(decorImages);
  };

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteDecor', JSON.stringify(newFavorites));
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const getRowSpan = (index) => {
    // Vary heights for masonry effect
    const heights = [20, 25, 30, 22, 28, 26];
    return heights[index % heights.length];
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

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {filteredDecorations.map((decor, index) => (
            <div
              key={decor.id}
              className="group relative overflow-hidden rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer animate-fade-in"
              style={{ gridRowEnd: `span ${getRowSpan(index)}` }}
            >
              {/* Image */}
              <img
                src={decor.url}
                alt={decor.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  {/* Top Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleFavorite(decor.id)}
                      className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
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

                  {/* Bottom Info */}
                  <div>
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {decor.category}
                    </Badge>
                    <h4 className="font-semibold text-foreground mb-3">{decor.title}</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => window.open(decor.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = decor.url;
                          link.download = `${decor.title}.jpg`;
                          link.click();
                          toast.success('Download started');
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {decorations
                .filter(d => favorites.includes(d.id))
                .map(decor => (
                  <div
                    key={decor.id}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer"
                  >
                    <img
                      src={decor.url}
                      alt={decor.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(decor.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 fill-primary text-primary" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Decorations;
