import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Plus, Calendar as CalendarIcon, User, Trash2, Check, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { toCamelCaseArray, toSnakeCase } from '../lib/supabaseHelpers';

const VENDOR_CATEGORIES = [
  'Venue', 'Photography', 'Catering', 'Decoration', 'Audio/DJ', 
  'Attire', 'Jewelry', 'Ceremony', 'Transportation', 'Accommodation', 'Other'
];

const TASK_STATUSES = ['not-started', 'in-progress', 'completed'];

// Default tasks sourced from Wedding Planner.pdf (To-do + dependency sheets)
const DEFAULT_TASKS = [
  // Page 1 - main "To do" sheet
  { id: '1', title: 'Finalize wedding date', category: 'Other', status: 'completed', assignedTo: 'JD and JC', dueDate: '2026-03-13', priority: 'high', description: 'August 16th 2026. Blocker: Another date discussion.' },
  { id: '2', title: 'Finalize Wedding Venue', category: 'Venue', status: 'in-progress', assignedTo: 'JD and JC', dueDate: '2026-04-12', priority: 'high', description: 'Finding venues, visit in person, budget validation, 2 venues to be decided. Estimate: $5000.' },
  { id: '3', title: 'Wedding E invite - RSVP', category: 'Other', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '4', title: 'Priest Booking for Wedding', category: 'Ceremony', status: 'completed', assignedTo: 'JD and JC', dueDate: '2026-03-18', priority: 'high', description: 'Booked for Aug 16th - Sharad pandit. Estimate: $1000.' },
  { id: '5', title: 'Indian visitor flights/Insurance for parents', category: 'Transportation', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },
  { id: '6', title: 'Credit cards - balance transfer / points / Travel Cards', category: 'Other', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'low', description: 'Blocker: Apply Travel Credit Card - Amex.' },
  { id: '7', title: 'Wedding Sign board', category: 'Decoration', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'low', description: '' },
  { id: '8', title: 'Marriage License Application', category: 'Other', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'high', description: '' },
  { id: '9', title: 'Book Photography and Videography', category: 'Photography', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: '' },
  { id: '10', title: 'Book accommodations', category: 'Accommodation', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },
  { id: '11', title: 'Event Decoration', category: 'Decoration', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '12', title: 'Return gift (from India)', category: 'Other', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },
  { id: '13', title: 'Henna/haldi activities book', category: 'Ceremony', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '14', title: 'Make-up packages book', category: 'Other', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '15', title: 'Airbnb Catering', category: 'Catering', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: '' },
  { id: '16', title: 'Cutlery/Plates/Cups', category: 'Other', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'low', description: '' },
  { id: '17', title: 'Audio/DJ', category: 'Audio/DJ', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: '' },
  { id: '18', title: "Jay's Anna Family Visa's and Uncle Visa", category: 'Other', status: 'in-progress', assignedTo: 'JD', dueDate: '2026-04-01', priority: 'high', description: 'Dubai halt, Uncle slot on April 1st.' },
  { id: '19', title: "JC's DIL Visa", category: 'Other', status: 'completed', assignedTo: 'JC', dueDate: null, priority: 'high', description: '' },
  { id: '20', title: 'Sangeeth/ Engagement', category: 'Ceremony', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },
  { id: '21', title: 'Rental Car', category: 'Transportation', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },
  { id: '22', title: 'Airbnb', category: 'Accommodation', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'high', description: 'Based on Venue.' },
  { id: '23', title: 'Wedding Costume Trial Check', category: 'Attire', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },
  { id: '24', title: 'JD Pooja & Priest', category: 'Ceremony', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: 'Blocker: Until JC Mom is in USA.' },
  { id: '25', title: 'Dress Fit Check', category: 'Attire', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'medium', description: '' },

  // Page 2 - dependency / vendor task sheet
  { id: '26', title: 'Mehendi Artist', category: 'Decoration', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '27', title: 'Hair', category: 'Other', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '28', title: 'MakeUp', category: 'Other', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '29', title: 'Saree Draping', category: 'Attire', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '30', title: 'Event Design Templates', category: 'Decoration', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'low', description: '' },
  { id: '31', title: 'Catering', category: 'Catering', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: '' },
  { id: '32', title: 'Venue Decision', category: 'Venue', status: 'not-started', assignedTo: 'JD and JC', dueDate: null, priority: 'high', description: 'Dependency: 7, 14, 9.' },
  { id: '33', title: 'Airbnb Stay', category: 'Accommodation', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: '' },
  { id: '34', title: 'Photographer/Video', category: 'Photography', status: 'not-started', assignedTo: 'JD', dueDate: null, priority: 'high', description: '' },
  { id: '35', title: 'Haldi Deco', category: 'Decoration', status: 'not-started', assignedTo: '', dueDate: null, priority: 'medium', description: '' },
  { id: '36', title: 'Car Rental', category: 'Transportation', status: 'not-started', assignedTo: '', dueDate: null, priority: 'medium', description: '' },
  { id: '37', title: 'Deco', category: 'Decoration', status: 'not-started', assignedTo: 'JC/JD', dueDate: null, priority: 'medium', description: '' },

  // Page 9 - additional tasks
  { id: '38', title: 'Open Savings Account', category: 'Other', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' },
  { id: '39', title: 'India Flight Dates confirm to Anna', category: 'Transportation', status: 'not-started', assignedTo: 'JC', dueDate: null, priority: 'medium', description: '' }
];

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    assignedTo: '',
    dueDate: null,
    status: 'not-started',
    priority: 'medium'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data } = await supabase.from('tasks').select('*');
    if (data && data.length > 0) {
      setTasks(toCamelCaseArray(data));
      return;
    }

    const snakeTasks = DEFAULT_TASKS.map((t) => toSnakeCase(t));
    await supabase.from('tasks').insert(snakeTasks);
    setTasks(DEFAULT_TASKS);
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const task = {
      ...newTask,
      id: Date.now().toString(),
      dueDate: newTask.dueDate ? format(newTask.dueDate, 'yyyy-MM-dd') : null
    };

    await supabase.from('tasks').insert(toSnakeCase(task));
    setTasks([...tasks, task]);

    setNewTask({
      title: '',
      description: '',
      category: '',
      assignedTo: '',
      dueDate: null,
      status: 'not-started',
      priority: 'medium'
    });
    
    setIsAddDialogOpen(false);
    toast.success('Task added successfully!');
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success('Task status updated!');
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const updateTask = async () => {
    if (!editingTask.title || !editingTask.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const { id, ...rest } = editingTask;
    await supabase.from('tasks').update(toSnakeCase(rest)).eq('id', id);
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setIsEditDialogOpen(false);
    setEditingTask(null);
    toast.success('Task updated successfully!');
  };

  const deleteTask = async (taskId) => {
    await supabase.from('tasks').delete().eq('id', taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted!');
  };

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  const TaskCard = ({ task }) => (
    <Card className="mb-3 hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => openEditDialog(task)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">{task.category}</Badge>
          <Badge
            variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {task.priority}
          </Badge>
          {task.dueDate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {format(new Date(task.dueDate), 'MMM dd')}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <User className="w-3 h-3" />
            {task.assignedTo}
          </div>
        )}

        <div className="flex gap-2">
          {TASK_STATUSES.map(status => (
            <Button
              key={status}
              size="sm"
              variant={task.status === status ? 'default' : 'outline'}
              onClick={() => updateTaskStatus(task.id, status)}
              className="text-xs flex-1"
            >
              {status === 'not-started' && 'To Do'}
              {status === 'in-progress' && 'In Progress'}
              {status === 'completed' && <><Check className="w-3 h-3 mr-1" />Done</>}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pt-14 md:pt-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-section mb-2">Wedding Tasks</h1>
              <p className="text-muted-foreground">Organize and track all your wedding planning tasks</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Task details..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDOR_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      placeholder="e.g., JD, JC"
                    />
                  </div>

                  <div>
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.dueDate ? format(newTask.dueDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate}
                          onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={addTask} className="flex-1">Add Task</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Task Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                {editingTask && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="edit-title">Title *</Label>
                      <Input
                        id="edit-title"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        placeholder="Task details..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-category">Category *</Label>
                        <Select
                          value={editingTask.category}
                          onValueChange={(value) => setEditingTask({ ...editingTask, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {VENDOR_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="edit-priority">Priority</Label>
                        <Select
                          value={editingTask.priority}
                          onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-assignedTo">Assigned To</Label>
                      <Input
                        id="edit-assignedTo"
                        value={editingTask.assignedTo}
                        onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
                        placeholder="e.g., JD, JC"
                      />
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editingTask.dueDate ? format(new Date(editingTask.dueDate), 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editingTask.dueDate ? new Date(editingTask.dueDate) : null}
                            onSelect={(date) => setEditingTask({ ...editingTask, dueDate: date ? format(date, 'yyyy-MM-dd') : null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={updateTask} className="flex-1">Update Task</Button>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="All">All ({tasks.length})</TabsTrigger>
            {VENDOR_CATEGORIES.map(cat => {
              const count = tasks.filter(t => t.category === cat).length;
              return count > 0 ? (
                <TabsTrigger key={cat} value={cat}>
                  {cat} ({count})
                </TabsTrigger>
              ) : null;
            })}
          </TabsList>
        </Tabs>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                To Do
                <Badge variant="secondary">
                  {filteredTasks.filter(t => t.status === 'not-started').length}
                </Badge>
              </h3>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter(task => task.status === 'not-started')
                .map(task => <TaskCard key={task.id} task={task} />)
              }
              {filteredTasks.filter(t => t.status === 'not-started').length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 pb-6 text-center text-muted-foreground text-sm">
                    No tasks to do
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                In Progress
                <Badge className="bg-accent/20 text-accent-foreground">
                  {filteredTasks.filter(t => t.status === 'in-progress').length}
                </Badge>
              </h3>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter(task => task.status === 'in-progress')
                .map(task => <TaskCard key={task.id} task={task} />)
              }
              {filteredTasks.filter(t => t.status === 'in-progress').length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 pb-6 text-center text-muted-foreground text-sm">
                    No tasks in progress
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                Completed
                <Badge className="bg-success/20 text-success-foreground">
                  {filteredTasks.filter(t => t.status === 'completed').length}
                </Badge>
              </h3>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter(task => task.status === 'completed')
                .map(task => <TaskCard key={task.id} task={task} />)
              }
              {filteredTasks.filter(t => t.status === 'completed').length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 pb-6 text-center text-muted-foreground text-sm">
                    No completed tasks
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;