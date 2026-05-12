import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Settings as SettingsIcon, Calendar as CalendarIcon, DollarSign, Mail, Save, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const Settings = ({ weddingData, updateWeddingData }) => {
  const [settings, setSettings] = useState({
    bride: '',
    groom: '',
    weddingDate: new Date(),
    location: '',
    primaryCurrency: 'USD',
    secondaryCurrency: 'INR',
    exchangeRate: 83.5,
    emails: '',
  });

  useEffect(() => {
    if (weddingData) {
      setSettings({
        bride: weddingData.couple?.bride || 'JC',
        groom: weddingData.couple?.groom || 'JD',
        weddingDate: new Date(weddingData.couple?.weddingDate || '2026-08-16'),
        location: weddingData.couple?.location || 'USA',
        primaryCurrency: weddingData.settings?.primaryCurrency || 'USD',
        secondaryCurrency: weddingData.settings?.secondaryCurrency || 'INR',
        exchangeRate: weddingData.settings?.exchangeRate || 83.5,
        emails: weddingData.settings?.emails?.join(', ') || '',
      });
    }
  }, [weddingData]);

  const handleSave = () => {
    const emailList = settings.emails
      .split(',')
      .map(e => e.trim())
      .filter(e => e);

    const updatedData = {
      couple: {
        bride: settings.bride,
        groom: settings.groom,
        weddingDate: format(settings.weddingDate, 'yyyy-MM-dd'),
        location: settings.location
      },
      settings: {
        primaryCurrency: settings.primaryCurrency,
        secondaryCurrency: settings.secondaryCurrency,
        exchangeRate: parseFloat(settings.exchangeRate),
        emails: emailList,
        theme: weddingData?.settings?.theme || 'light'
      }
    };

    updateWeddingData(updatedData);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="heading-section">Settings</h1>
              <p className="text-muted-foreground">Configure your wedding planner preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Wedding Details */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Wedding Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bride">Bride</Label>
                  <Input
                    id="bride"
                    value={settings.bride}
                    onChange={(e) => setSettings({ ...settings, bride: e.target.value })}
                    placeholder="Bride's name or initials"
                  />
                </div>
                <div>
                  <Label htmlFor="groom">Groom</Label>
                  <Input
                    id="groom"
                    value={settings.groom}
                    onChange={(e) => setSettings({ ...settings, groom: e.target.value })}
                    placeholder="Groom's name or initials"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Wedding Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(settings.weddingDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={settings.weddingDate}
                        onSelect={(date) => setSettings({ ...settings, weddingDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                    placeholder="Wedding location"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                Currency Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Primary Currency</Label>
                  <Select
                    value={settings.primaryCurrency}
                    onValueChange={(v) => setSettings({ ...settings, primaryCurrency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Secondary Currency</Label>
                  <Select
                    value={settings.secondaryCurrency}
                    onValueChange={(v) => setSettings({ ...settings, secondaryCurrency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exchangeRate">Exchange Rate (USD to INR)</Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.01"
                    value={settings.exchangeRate}
                    onChange={(e) => setSettings({ ...settings, exchangeRate: e.target.value })}
                    placeholder="83.5"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                1 {settings.primaryCurrency} = {settings.exchangeRate} {settings.secondaryCurrency}
              </p>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                Email Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emails">Email Addresses</Label>
                <Input
                  id="emails"
                  value={settings.emails}
                  onChange={(e) => setSettings({ ...settings, emails: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Separate multiple email addresses with commas. These emails will receive task reminders.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  Reminder Schedule
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Daily digest at 6 PM with priority tasks</li>
                  <li>• Weekend reminders on Friday evenings</li>
                  <li>• Event reminders 7 days, 3 days, and 1 day before</li>
                  <li>• Overdue task notifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={handleSave} className="btn-glow">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed">
            <CardContent className="pt-6">
              <h4 className="font-medium text-sm mb-2">About This App</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your wedding planner data is stored locally on your device using browser storage. 
                To access from multiple devices, share the app link and manually sync your data. 
                Remember to export your data regularly as backup.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;