import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, UserCheck, UserX, Clock, Mail, Phone, Trash2, Link as LinkIcon, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'pending',
    guestType: 'primary',
    plusOne: false
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = () => {
    const saved = localStorage.getItem('guests');
    if (saved) {
      setGuests(JSON.parse(saved));
    } else {
      // Sample guests
      const sampleGuests = [
        { id: '1', name: 'Anna Family', email: '', phone: '', rsvpStatus: 'yes', guestType: 'primary', plusOne: false },
        { id: '2', name: 'Uncle', email: '', phone: '', rsvpStatus: 'yes', guestType: 'primary', plusOne: false },
        { id: '3', name: 'JC DIL', email: '', phone: '', rsvpStatus: 'pending', guestType: 'primary', plusOne: false },
        { id: '4', name: 'Parents', email: '', phone: '', rsvpStatus: 'yes', guestType: 'primary', plusOne: false },
      ];
      setGuests(sampleGuests);
      localStorage.setItem('guests', JSON.stringify(sampleGuests));
    }
  };

  const saveGuests = (updatedGuests) => {
    setGuests(updatedGuests);
    localStorage.setItem('guests', JSON.stringify(updatedGuests));
  };

  const addGuest = () => {
    if (!newGuest.name) {
      toast.error('Please enter guest name');
      return;
    }

    const guest = {
      ...newGuest,
      id: Date.now().toString()
    };

    saveGuests([...guests, guest]);
    setNewGuest({
      name: '',
      email: '',
      phone: '',
      rsvpStatus: 'pending',
      guestType: 'primary',
      plusOne: false
    });
    setIsAddDialogOpen(false);
    toast.success('Guest added successfully!');
  };

  const updateRSVP = (guestId, status) => {
    const updated = guests.map(guest =>
      guest.id === guestId ? { ...guest, rsvpStatus: status } : guest
    );
    saveGuests(updated);
    toast.success('RSVP status updated!');
  };

  const deleteGuest = (guestId) => {
    saveGuests(guests.filter(g => g.id !== guestId));
    toast.success('Guest removed!');
  };

  const generateRSVPLink = async () => {
    const baseUrl = window.location.origin;
    const rsvpLink = `${baseUrl}/rsvp?wedding=jd-jc-2026`;
    
    try {
      await navigator.clipboard.writeText(rsvpLink);
      toast.success('RSVP link copied to clipboard!');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = rsvpLink;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('RSVP link copied to clipboard!');
      } catch (e) {
        toast.error('Could not copy link. Please copy manually: ' + rsvpLink);
      }
      document.body.removeChild(textArea);
    }
  };

  const stats = {
    total: guests.length,
    yes: guests.filter(g => g.rsvpStatus === 'yes').length,
    no: guests.filter(g => g.rsvpStatus === 'no').length,
    pending: guests.filter(g => g.rsvpStatus === 'pending').length
  };

  const filteredGuests = filterStatus === 'all'
    ? guests
    : guests.filter(g => g.rsvpStatus === filterStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'yes': return <UserCheck className="w-4 h-4 text-success" />;
      case 'no': return <UserX className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'yes': return <Badge className="bg-success/20 text-success-foreground border border-success/30">Accepted</Badge>;
      case 'no': return <Badge variant="destructive">Declined</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-section mb-2">Guest List & RSVP</h1>
              <p className="text-muted-foreground">Manage your wedding guest list and track responses</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={generateRSVPLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy RSVP Link
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Guest</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={newGuest.name}
                        onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                        placeholder="Guest name"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                        placeholder="guest@email.com"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={newGuest.phone}
                        onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <Label>Guest Type</Label>
                      <Select
                        value={newGuest.guestType}
                        onValueChange={(v) => setNewGuest({ ...newGuest, guestType: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addGuest} className="flex-1">Add Guest</Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-elegant">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-semibold mb-1">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Guests</p>
            </CardContent>
          </Card>
          <Card className="card-elegant">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-semibold text-success mb-1">{stats.yes}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
          <Card className="card-elegant">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-semibold text-destructive mb-1">{stats.no}</p>
              <p className="text-sm text-muted-foreground">Declined</p>
            </CardContent>
          </Card>
          <Card className="card-elegant">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-semibold text-muted-foreground mb-1">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All ({guests.length})
          </Button>
          <Button
            variant={filterStatus === 'yes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('yes')}
          >
            Accepted ({stats.yes})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filterStatus === 'no' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('no')}
          >
            Declined ({stats.no})
          </Button>
        </div>

        {/* Guest List */}
        <Card className="card-elegant">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {filteredGuests.map(guest => (
                <div
                  key={guest.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{guest.name}</h4>
                      {getStatusBadge(guest.rsvpStatus)}
                      <Badge variant="outline" className="text-xs">{guest.guestType}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {guest.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {guest.email}
                        </span>
                      )}
                      {guest.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={guest.rsvpStatus === 'yes' ? 'default' : 'outline'}
                      onClick={() => updateRSVP(guest.id, 'yes')}
                    >
                      <UserCheck className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={guest.rsvpStatus === 'no' ? 'destructive' : 'outline'}
                      onClick={() => updateRSVP(guest.id, 'no')}
                    >
                      <UserX className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGuest(guest.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredGuests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No guests found for this filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guests;