import React, { useState } from 'react';
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
import { parseWeddingDate } from '../lib/weddingUtils';
import { PLANNER_STORAGE_KEYS } from '../lib/plannerStorage';
import { usePlannerStorage } from '../hooks/usePlannerStorage';
import { toast } from 'sonner';

const VENDOR_CATEGORIES = [
  'Venue', 'Photography', 'Catering', 'Decoration', 'Audio/DJ', 
  'Attire', 'Jewelry', 'Ceremony', 'Transportation', 'Accommodation', 'Other'
];

const TASK_STATUSES = ['not-started', 'in-progress', 'completed'];

export const Tasks = () => {
  const [tasks, saveTasks, , { loading, syncError }] = usePlannerStorage(
    PLANNER_STORAGE_KEYS.tasks
  );
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

  const addTask = () => {
    if (!newTask.title || !newTask.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const task = {
      ...newTask,
      id: Date.now().toString(),
      dueDate: newTask.dueDate ? format(newTask.dueDate, 'yyyy-MM-dd') : null
    };

    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);
    
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

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    saveTasks(updatedTasks);
    toast.success('Task status updated!');
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const updateTask = () => {
    if (!editingTask.title || !editingTask.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    );
    saveTasks(updatedTasks);
    setIsEditDialogOpen(false);
    setEditingTask(null);
    toast.success('Task updated successfully!');
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
    toast.success('Task deleted!');
  };

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  const TaskCard = ({ task }) => (
    <Card className="mb-3 hover:shadow-[var(--shadow-medium)] transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-1 break-words">{task.title}</h4>
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
              {format(parseWeddingDate(task.dueDate), 'MMM dd')}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <User className="w-3 h-3" />
            {task.assignedTo}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {TASK_STATUSES.map(status => (
            <Button
              key={status}
              size="sm"
              variant={task.status === status ? 'default' : 'outline'}
              onClick={() => updateTaskStatus(task.id, status)}
              className="text-xs flex-1 min-h-10"
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
    <div className="min-h-screen pt-mobile-header md:pt-0 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-section mb-2">Wedding Tasks</h1>
              <p className="text-muted-foreground">Organize and track all your wedding planning tasks</p>
              {loading && (
                <p className="text-xs text-muted-foreground mt-2">Loading tasks from server…</p>
              )}
              {syncError && (
                <p className="text-xs text-destructive mt-2" role="alert">{syncError}</p>
              )}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            {editingTask.dueDate ? format(parseWeddingDate(editingTask.dueDate), 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editingTask.dueDate ? parseWeddingDate(editingTask.dueDate) : null}
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