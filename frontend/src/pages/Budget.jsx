import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Plus, DollarSign, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const BUDGET_CATEGORIES = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Decoration', 'Audio/DJ',
  'Attire', 'Jewelry', 'Ceremony', 'Transportation', 'Accommodation', 'Return Gifts', 'Sweets', 'Other'
];

export const Budget = ({ weddingData }) => {
  const [budgetItems, setBudgetItems] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    estimatedCost: '',
    actualCost: '',
    currency: 'USD',
    paidBy: '',
    notes: ''
  });

  const exchangeRate = weddingData?.settings?.exchangeRate || 83.5;

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = () => {
    const saved = localStorage.getItem('budgetItems');
    if (saved) {
      setBudgetItems(JSON.parse(saved));
    } else {
      // Sample budget items from Excel
      const sampleItems = [
        { id: '1', category: 'Venue', description: 'Wedding hall + dining + changing rooms (8 hours)', estimatedCost: 5000, actualCost: 4500, currency: 'USD', paidBy: 'Split' },
        { id: '2', category: 'Catering', description: 'Food for 70 guests', estimatedCost: 3500, actualCost: 0, currency: 'USD', paidBy: 'JD' },
        { id: '3', category: 'Photography', description: 'Wedding photography package', estimatedCost: 2500, actualCost: 0, currency: 'USD', paidBy: 'JC' },
        { id: '4', category: 'Videography', description: 'Wedding videography', estimatedCost: 2000, actualCost: 0, currency: 'USD', paidBy: 'JD' },
        { id: '5', category: 'Decoration', description: 'Event decorations (all events)', estimatedCost: 3000, actualCost: 0, currency: 'USD', paidBy: 'Split' },
        { id: '6', category: 'Ceremony', description: 'Priest fee (wedding + vratham)', estimatedCost: 2000, actualCost: 0, currency: 'USD', paidBy: 'JD' },
        { id: '7', category: 'Attire', description: 'Bride dress', estimatedCost: 50000, actualCost: 0, currency: 'INR', paidBy: 'Parents' },
        { id: '8', category: 'Attire', description: 'Groom dress', estimatedCost: 30000, actualCost: 0, currency: 'INR', paidBy: 'Parents' },
      ];
      setBudgetItems(sampleItems);
      localStorage.setItem('budgetItems', JSON.stringify(sampleItems));
    }
  };

  const saveBudget = (items) => {
    setBudgetItems(items);
    localStorage.setItem('budgetItems', JSON.stringify(items));
  };

  const addItem = () => {
    if (!newItem.category || !newItem.description || !newItem.estimatedCost) {
      toast.error('Please fill in required fields');
      return;
    }

    const item = {
      ...newItem,
      id: Date.now().toString(),
      estimatedCost: parseFloat(newItem.estimatedCost),
      actualCost: newItem.actualCost ? parseFloat(newItem.actualCost) : 0
    };

    saveBudget([...budgetItems, item]);
    setNewItem({
      category: '',
      description: '',
      estimatedCost: '',
      actualCost: '',
      currency: 'USD',
      paidBy: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Budget item added!');
  };

  const deleteItem = (id) => {
    saveBudget(budgetItems.filter(item => item.id !== id));
    toast.success('Item deleted!');
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'USD' && toCurrency === 'INR') return amount * exchangeRate;
    if (fromCurrency === 'INR' && toCurrency === 'USD') return amount / exchangeRate;
    return amount;
  };

  const getTotals = (filterCurrency = null) => {
    let items = budgetItems;
    if (filterCurrency) {
      items = items.filter(item => item.currency === filterCurrency);
    }

    const totalEstimated = items.reduce((sum, item) => {
      const amount = filterCurrency
        ? item.estimatedCost
        : convertCurrency(item.estimatedCost, item.currency, currency);
      return sum + amount;
    }, 0);

    const totalActual = items.reduce((sum, item) => {
      const amount = filterCurrency
        ? item.actualCost
        : convertCurrency(item.actualCost, item.currency, currency);
      return sum + amount;
    }, 0);

    return { totalEstimated, totalActual, remaining: totalEstimated - totalActual };
  };

  const allTotals = getTotals();
  const usdTotals = getTotals('USD');
  const inrTotals = getTotals('INR');
  const spentPercentage = allTotals.totalEstimated > 0
    ? (allTotals.totalActual / allTotals.totalEstimated) * 100
    : 0;

  const displayItems = budgetItems.map(item => ({
    ...item,
    displayEstimated: convertCurrency(item.estimatedCost, item.currency, currency),
    displayActual: convertCurrency(item.actualCost, item.currency, currency)
  }));

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-section mb-2">Budget Tracker</h1>
              <p className="text-muted-foreground">Track expenses in both USD and INR</p>
            </div>
            <div className="flex gap-3">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Budget Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Category *</Label>
                      <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGET_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description *</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Estimated Cost *</Label>
                        <Input
                          type="number"
                          value={newItem.estimatedCost}
                          onChange={(e) => setNewItem({ ...newItem, estimatedCost: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Actual Cost</Label>
                        <Input
                          type="number"
                          value={newItem.actualCost}
                          onChange={(e) => setNewItem({ ...newItem, actualCost: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Currency</Label>
                        <Select value={newItem.currency} onValueChange={(v) => setNewItem({ ...newItem, currency: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Paid By</Label>
                        <Input
                          value={newItem.paidBy}
                          onChange={(e) => setNewItem({ ...newItem, paidBy: e.target.value })}
                          placeholder="e.g., JD, Split"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addItem} className="flex-1">Add Item</Button>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-premium">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">
                {currency === 'USD' ? '$' : '₹'}{allTotals.totalEstimated.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">USD:</span>
                  <span className="font-medium">${usdTotals.totalEstimated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">INR:</span>
                  <span className="font-medium">₹{inrTotals.totalEstimated.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Spent</p>
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">
                {currency === 'USD' ? '$' : '₹'}{allTotals.totalActual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              <Progress value={spentPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{spentPercentage.toFixed(1)}% of budget</p>
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">
                {currency === 'USD' ? '$' : '₹'}{allTotals.remaining.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-success-foreground">
                {((allTotals.remaining / allTotals.totalEstimated) * 100).toFixed(1)}% available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Items Table */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-medium text-sm mb-1">{item.description}</h4>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          <Badge variant="outline" className="text-xs">{item.currency}</Badge>
                          {item.paidBy && <span className="text-xs text-muted-foreground">Paid by: {item.paidBy}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Estimated</p>
                        <p className="font-medium">
                          {currency === 'USD' ? '$' : '₹'}{item.displayEstimated.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Actual</p>
                        <p className="font-medium">
                          {currency === 'USD' ? '$' : '₹'}{item.displayActual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Difference</p>
                        <p className={`font-medium ${
                          item.displayActual > item.displayEstimated ? 'text-destructive' : 'text-success'
                        }`}>
                          {currency === 'USD' ? '$' : '₹'}{Math.abs(item.displayEstimated - item.displayActual).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {budgetItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No budget items yet. Add your first item to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rate Info */}
        <Card className="mt-6 bg-gradient-to-br from-muted/30 to-muted/10 border-dashed">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Exchange Rate: 1 USD = {exchangeRate} INR
              <span className="mx-2">•</span>
              Update in <a href="/settings" className="text-primary hover:underline">Settings</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Budget;