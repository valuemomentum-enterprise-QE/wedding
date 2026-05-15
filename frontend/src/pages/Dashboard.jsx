import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight,
  Heart,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import {
  parseWeddingDate,
  getDaysUntilWedding,
  formatWeddingDateLong,
  calculateDashboardStats,
  loadLocalStorageJson,
} from '../lib/weddingUtils';

export const Dashboard = ({ weddingData, plannerPrefix = '/planner' }) => {
  const exchangeRate = weddingData?.settings?.exchangeRate || 83.5;
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0,
    totalBudget: 0,
    spent: 0,
    totalGuests: 0,
    rsvpYes: 0
  });
  const [priorityTasks, setPriorityTasks] = useState([]);

  useEffect(() => {
    const tasks = loadLocalStorageJson('tasks', []);
    const events = loadLocalStorageJson('events', []);
    const budgetItems = loadLocalStorageJson('budgetItems', []);
    const guests = loadLocalStorageJson('guests', []);

    const computed = calculateDashboardStats({
      tasks,
      events,
      budgetItems,
      guests,
      exchangeRate,
    });

    setStats({
      totalTasks: computed.totalTasks,
      completedTasks: computed.completedTasks,
      upcomingEvents: computed.upcomingEvents,
      totalBudget: computed.totalBudget,
      spent: computed.spent,
      totalGuests: computed.totalGuests,
      rsvpYes: computed.rsvpYes,
    });

    setPriorityTasks(
      tasks
        .filter((task) => task.status !== 'completed' && task.priority === 'high')
        .slice(0, 5)
    );
  }, [exchangeRate]);

  const weddingDate = parseWeddingDate(weddingData?.couple?.weddingDate);
  const daysUntilWedding = getDaysUntilWedding(weddingDate);
  const progressPercentage = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;
  const budgetPercentage = stats.totalBudget > 0
    ? Math.round((stats.spent / stats.totalBudget) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-peach/40 via-cream to-secondary/30 border-b border-border/50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1654156577076-e0350ba86cc1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxTb3V0aCUyMEluZGlhbiUyMHdlZGRpbmd8ZW58MHx8fHwxNzc3NzY0ODIxfDA&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-5" />
        <div className="relative container-custom py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                Your Dream Wedding
              </Badge>
            </div>
            <h1 className="heading-hero font-display tracking-wide text-foreground mb-4">
              {daysUntilWedding} Days Until Your Big Day
            </h1>
            <p className="body-large text-muted-foreground mb-6">
              {formatWeddingDateLong(weddingDate)} • South Indian Wedding in USA
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={`${plannerPrefix}/tasks`}>
                <Button className="btn-glow">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  View Tasks
                </Button>
              </Link>
              <Link to={`${plannerPrefix}/decorations`}>
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Decor Ideas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8 md:py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">{progressPercentage}%</Badge>
              </div>
              <h3 className="text-2xl font-semibold mb-1">{stats.completedTasks}/{stats.totalTasks}</h3>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <Progress value={progressPercentage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <Badge variant="secondary" className="text-xs">{budgetPercentage}%</Badge>
              </div>
              <h3 className="text-2xl font-semibold mb-1">${Math.round(stats.spent).toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">of ${Math.round(stats.totalBudget).toLocaleString()} budget (USD eq.)</p>
              <Progress value={budgetPercentage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-1">{stats.rsvpYes}/{stats.totalGuests}</h3>
              <p className="text-sm text-muted-foreground">Guests Confirmed</p>
              <Progress value={(stats.totalGuests > 0 ? (stats.rsvpYes / stats.totalGuests) * 100 : 0)} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-1">{stats.upcomingEvents}</h3>
              <p className="text-sm text-muted-foreground">Events Planned</p>
              <Link to={`${plannerPrefix}/events`}>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Timeline <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Priority Tasks - After Work Focus */}
          <Card className="card-premium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Priority Tasks
                </CardTitle>
                <Badge variant="outline" className="text-xs">After 5 PM</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Focus on these during evenings and weekends</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityTasks.length > 0 ? (
                priorityTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors border border-border/50"
                  >
                    <div className="mt-0.5">
                      <div className="w-5 h-5 rounded-full border-2 border-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{task.category}</Badge>
                        {task.dueDate && (
                          <span>Due: {format(parseWeddingDate(task.dueDate), 'MMM dd')}</span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">All caught up! No priority tasks.</p>
                </div>
              )}
              <Link to={`${plannerPrefix}/tasks`}>
                <Button variant="ghost" className="w-full mt-2">
                  View All Tasks <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Weekend Focus */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Weekend Planning
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Big tasks that need dedicated time</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2 text-sm">Quick Reminders</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Set aside 2-3 hours on weekends for venue visits and vendor meetings. 
                  Book appointments in advance to make the most of your time.
                </p>
              </div>

              <Link to={`${plannerPrefix}/events`}>
                <Button variant="outline" className="w-full mt-2">
                  View Event Timeline <Calendar className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to={`${plannerPrefix}/guests`}>
            <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="font-medium text-sm">Manage Guests</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`${plannerPrefix}/decorations`}>
            <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <p className="font-medium text-sm">Browse Decor</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`${plannerPrefix}/vendors`}>
            <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-accent" />
                <p className="font-medium text-sm">View Vendors</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={`${plannerPrefix}/budget`}>
            <Card className="card-elegant hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="font-medium text-sm">Track Budget</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;