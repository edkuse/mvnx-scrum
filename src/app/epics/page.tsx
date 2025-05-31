"use client";
import { useState, useEffect } from 'react';
import { ChevronsUpDown, Plus, Edit2, Layers3, Check, Boxes, ListTodo } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Loader } from '@/components/ui/loader';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { differenceInDays, differenceInWeeks, differenceInMonths, format, parseISO, isValid } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];
const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function EpicsPage() {
  const [epics, setEpics] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [newEpic, setNewEpic] = useState<any>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'low',
    owner_id: '',
    application_ids: [],
    start_date: new Date().toISOString().slice(0, 10),
    due_date: '',
    completed_date: '',
    estimated_effort: '',
    actual_effort: '',
    progress: 0,
    tags: '',
    is_active: true,
  });
  const [open, setOpen] = useState(false);
  const [editingEpic, setEditingEpic] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [applicationFilter, setApplicationFilter] = useState<string[]>([]);
  const [appFilterPopoverOpen, setAppFilterPopoverOpen] = useState(false);
  const [appFilterQuery, setAppFilterQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>('newest');
  const [leadPopoverOpen, setLeadPopoverOpen] = useState(false);
  const [ownerQuery, setOwnerQuery] = useState("");
  const [appQuery, setAppQuery] = useState("");
  const [hoveredEpicId, setHoveredEpicId] = useState<number | null>(null);

  useEffect(() => {
    fetchEpics();
    fetchApplications();
    fetchUsers();
    fetchStories();
  }, []);

  async function fetchEpics() {
    setLoading(true);
    const res = await fetch(`${API_URL}/epics/`);
    const data = await res.json();
    setEpics(data);
    setLoading(false);
  }
  async function fetchApplications() {
    const res = await fetch(`${API_URL}/applications/`);
    const data = await res.json();
    setApplications(data);
  }
  async function fetchUsers() {
    const res = await fetch(`${API_URL}/users/`);
    const data = await res.json();
    setUsers(data);
  }
  async function fetchStories() {
    try {
      const res = await fetch(`${API_URL}/stories/`);
      if (!res.ok) return;
      const data = await res.json();
      setStories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  }

  async function handleSaveEpic() {
    const payload = {
      ...newEpic,
      application_ids: newEpic.application_ids,
      estimated_effort: newEpic.estimated_effort ? Number(newEpic.estimated_effort) : null,
      actual_effort: newEpic.actual_effort ? Number(newEpic.actual_effort) : null,
      progress: newEpic.progress ? Number(newEpic.progress) : 0,
      tags: newEpic.tags ? newEpic.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      start_date: newEpic.start_date || null,
      due_date: newEpic.due_date || null,
      completed_date: newEpic.completed_date || null,
    };
    if (editingEpic) {
      await fetch(`${API_URL}/epics/${editingEpic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${API_URL}/epics/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setOpen(false);
    setEditingEpic(null);
    setNewEpic({
      title: '', description: '', status: 'backlog', priority: 'low', owner_id: '', application_ids: [], start_date: '', due_date: '', completed_date: '', estimated_effort: '', actual_effort: '', progress: 0, tags: '', is_active: true,
    });
    fetchEpics();
  }

  function handleOpenAddDialog() {
    setOpen(true);
    setEditingEpic(null);
    setNewEpic((a: any) => ({ ...a, start_date: a.start_date || new Date().toISOString().slice(0, 10) }));
  }

  function handleOpenEditDialog(epic: any) {
    setEditingEpic(epic);
    setOpen(true);
    setNewEpic({
      title: epic.title || '',
      description: epic.description || '',
      status: epic.status || 'backlog',
      priority: epic.priority || 'low',
      owner_id: epic.owner_id || '',
      application_ids: Array.isArray(epic.application_ids) ? epic.application_ids : [],
      start_date: epic.start_date || '',
      due_date: epic.due_date || '',
      completed_date: epic.completed_date || '',
      estimated_effort: epic.estimated_effort || '',
      actual_effort: epic.actual_effort || '',
      progress: epic.progress || 0,
      tags: Array.isArray(epic.tags) ? epic.tags.join(', ') : (epic.tags || ''),
      is_active: epic.is_active !== undefined ? epic.is_active : true,
    });
  }

  let filteredEpics = epics.filter(epic => {
    const matchesSearch = !search || epic.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || epic.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || epic.priority === priorityFilter;
    const matchesApplication = applicationFilter.length === 0 || (Array.isArray(epic.application_ids) && applicationFilter.some(id => epic.application_ids.includes(id)));
    return matchesSearch && matchesStatus && matchesPriority && matchesApplication;
  });

  filteredEpics = filteredEpics.sort((a, b) => {
    if (sortOption === 'title-az') return a.title.localeCompare(b.title);
    if (sortOption === 'title-za') return b.title.localeCompare(a.title);
    if (sortOption === 'newest') return (b.id || 0) - (a.id || 0);
    if (sortOption === 'oldest') return (a.id || 0) - (b.id || 0);
    if (sortOption === 'priority') return (priorityOptions.findIndex(p => p.value === a.priority) - priorityOptions.findIndex(p => p.value === b.priority));
    if (sortOption === 'status') return (statusOptions.findIndex(s => s.value === a.status) - statusOptions.findIndex(s => s.value === b.status));
    return 0;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      {/* Sticky header with search */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur py-4 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers3 className="w-6 h-6 text-primary" /> Epics
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="ml-1 h-6 w-6"
                size="icon"
                onClick={handleOpenAddDialog}
              >
                <Plus strokeWidth={3} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEpic ? 'Edit Epic' : 'Add Epic'}</DialogTitle>
                <DialogDescription>
                  {editingEpic ? 'Update the details below and save your changes.' : 'Fill out the details below to create a new epic.'}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveEpic();
                }}
                className="space-y-3"
              >
                <div>
                  <Label className="text-xs text-muted-foreground">Title</Label>
                  <Input
                    placeholder="Title"
                    value={newEpic.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEpic((a: any) => ({ ...a, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea
                    placeholder="Description"
                    value={newEpic.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewEpic((a: any) => ({ ...a, description: e.target.value }))}
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select value={newEpic.status} onValueChange={(val: string) => setNewEpic((a: any) => ({ ...a, status: val }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Select value={newEpic.priority} onValueChange={(val: string) => setNewEpic((a: any) => ({ ...a, priority: val }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Lead</Label>
                  {(() => {
                    const filteredUsers = users
                      .sort((a, b) => {
                        const nameA = (a.preferred_nm || a.first_nm || "") + " " + (a.last_nm || "");
                        const nameB = (b.preferred_nm || b.first_nm || "") + " " + (b.last_nm || "");
                        return nameA.localeCompare(nameB);
                      })
                      .filter((user) => {
                        const queryLower = ownerQuery.toLowerCase();
                        return [
                          user.first_nm,
                          user.last_nm,
                          user.preferred_nm,
                          user.attuid
                        ].filter(Boolean).some(field => field.toLowerCase().includes(queryLower));
                      });
                    return (
                      <Popover open={leadPopoverOpen} onOpenChange={setLeadPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {newEpic.owner_id
                              ? (users.find((u) => u.attuid === newEpic.owner_id)?.preferred_nm || users.find((u) => u.attuid === newEpic.owner_id)?.first_nm) + ' ' + (users.find((u) => u.attuid === newEpic.owner_id)?.last_nm)
                              : "Select lead..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search lead..." value={ownerQuery} onValueChange={setOwnerQuery} />
                            <CommandEmpty>No owner found.</CommandEmpty>
                            <CommandGroup>
                              {filteredUsers.map((user) => (
                                <CommandItem
                                  key={user.attuid}
                                  value={user.attuid}
                                  onSelect={() => {
                                    setNewEpic((a: any) => ({ ...a, owner_id: user.attuid }));
                                    setLeadPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newEpic.owner_id === user.attuid ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {user.preferred_nm || user.first_nm} {user.last_nm}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Applications</Label>
                  {(() => {
                    const filteredApps = applications
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .filter(app => app.name.toLowerCase().includes(appQuery.toLowerCase()));
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {newEpic.application_ids.length > 0
                              ? applications.filter(app => newEpic.application_ids.includes(app.itap_id)).map(app => app.name).join(", ")
                              : "Select applications..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search application..." value={appQuery} onValueChange={setAppQuery} />
                            <CommandEmpty>No application found.</CommandEmpty>
                            <CommandGroup>
                              {filteredApps.map(app => (
                                <CommandItem
                                  key={app.itap_id}
                                  onSelect={() => {
                                    setNewEpic((a: any) => {
                                      const exists = a.application_ids.includes(app.itap_id);
                                      return {
                                        ...a,
                                        application_ids: exists
                                          ? a.application_ids.filter((id: string) => id !== app.itap_id)
                                          : [...a.application_ids, app.itap_id],
                                      };
                                    });
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={newEpic.application_ids.includes(app.itap_id)}
                                    readOnly
                                    className="mr-2"
                                  />
                                  {app.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </div>
                <DatePickerField
                  label="Start Date"
                  value={newEpic.start_date}
                  onChange={val => setNewEpic((a: any) => ({ ...a, start_date: val }))}
                />
                <DatePickerField
                  label="Target Date"
                  value={newEpic.due_date}
                  onChange={val => setNewEpic((a: any) => ({ ...a, due_date: val }))}
                />
                <div>
                  <Label className="text-xs text-muted-foreground">Estimated Effort</Label>
                  <Input
                    placeholder="Estimated hours or story points"
                    type="number"
                    value={newEpic.estimated_effort}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEpic((a: any) => ({ ...a, estimated_effort: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <Input
                    placeholder="Comma separated keywords/tags"
                    value={newEpic.tags}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEpic((a: any) => ({ ...a, tags: e.target.value }))}
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={!newEpic.title.trim() || newEpic.application_ids.length === 0}
                  >
                    {editingEpic ? 'Save Changes' : 'Save'}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingEpic(null); }}>Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex">
          <div className="flex flex-col gap-1 mr-3">
            <Label className="text-xs text-muted-foreground">Search</Label>
            <Input
              className="w-full md:w-auto"
              placeholder="Search epics..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 mr-3">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 mr-3">
            <Label className="text-xs text-muted-foreground">Priority</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {priorityOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 mr-3">
            <Label className="text-xs text-muted-foreground">Applications</Label>
            <Popover open={appFilterPopoverOpen} onOpenChange={setAppFilterPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[140px] justify-between"
                >
                  {applicationFilter.length === 0
                    ? "All Apps"
                    : applications.filter(app => applicationFilter.includes(app.itap_id)).map(app => app.name).join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0 max-h-60 overflow-y-auto">
                <Command>
                  <CommandInput placeholder="Search apps..." value={appFilterQuery} onValueChange={setAppFilterQuery} />
                  <CommandEmpty>No applications found.</CommandEmpty>
                  <CommandGroup>
                    {applications
                      .filter(app => app.name.toLowerCase().includes(appFilterQuery.toLowerCase()))
                      .map(app => (
                        <CommandItem
                          key={app.itap_id}
                          onSelect={() => {
                            setApplicationFilter(prev =>
                              prev.includes(app.itap_id)
                                ? prev.filter(id => id !== app.itap_id)
                                : [...prev, app.itap_id]
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={applicationFilter.includes(app.itap_id)}
                            readOnly
                            className="mr-2"
                          />
                          {app.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Sort</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title-az">Title A-Z</SelectItem>
                <SelectItem value="title-za">Title Z-A</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Card list */}
      <div className="flex flex-wrap gap-4 mb-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">Loading Epics...</div>
        ) : filteredEpics.map((epic) => {
          // Calculate task counts for this epic
          const epicStories = stories.filter(story => story.epic_id === epic.id);
          const totalTasks = epicStories.length;
          const completedTasks = epicStories.filter(story => story.status === 'Done').length;
          const allTasksCompleted = totalTasks > 0 && totalTasks === completedTasks;

          return (
            <Card key={epic.id} className="relative group min-w-[260px] flex-1 flex flex-col gap-2 p-5 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg font-bold text-gray-900 truncate">{epic.title}</span>
                  <Button size="sm" variant="ghost" className="p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Edit" onClick={() => handleOpenEditDialog(epic)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                {/* Task count badge with hover popover */}
                <Popover open={hoveredEpicId === epic.id} onOpenChange={(open) => setHoveredEpicId(open ? epic.id : null)}>
                  <PopoverTrigger asChild>
                    <span 
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium cursor-help ${allTasksCompleted ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}
                      onMouseEnter={() => setHoveredEpicId(epic.id)}
                      onMouseLeave={() => setHoveredEpicId(null)}
                    >
                      {allTasksCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ListTodo className="w-4 h-4" />
                      )}
                      {completedTasks}/{totalTasks}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-2 text-xs"
                    onMouseEnter={() => setHoveredEpicId(epic.id)}
                    onMouseLeave={() => setHoveredEpicId(null)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">Stories/Tasks</div>
                      <div className="text-muted-foreground">
                        {totalTasks === 0 ? 'No tasks' : 
                          `${completedTasks} completed out of ${totalTasks} total tasks`
                        }
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                {/* Application badges with icon */}
                {Array.isArray(epic.application_ids) && epic.application_ids.map((id: string) => {
                  const app = applications.find(a => a.itap_id === id);
                  return (
                    <span key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-500 text-white">
                      <Boxes className="w-3 h-3 mr-1 text-white opacity-80" />
                      {app ? app.name : id}
                    </span>
                  );
                })}
                {/* Status badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                  ${epic.status === 'backlog' ? 'bg-blue-100 text-blue-700' :
                    epic.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    epic.status === 'done' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'}
                `}>
                  {epic.status.charAt(0).toUpperCase() + epic.status.slice(1).replace('_', ' ')}
                </span>
                {/* Priority badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                  ${epic.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    epic.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    epic.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-700'}
                `}>
                  {epic.priority.charAt(0).toUpperCase() + epic.priority.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-700 mt-1">{epic.description}</div>
              {/* Lead (owner) with avatar and progress percent right-aligned */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {(() => {
                    const lead = users.find(u => u.attuid === epic.owner_id);
                    if (!lead) return <span className="text-xs text-gray-400">Unassigned</span>;
                    return (
                      <>
                        {lead.profile_picture ? (
                          <img src={`data:image/jpeg;base64,${lead.profile_picture}`} alt={lead.last_nm + ', ' + lead.preferred_nm} className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border font-bold">
                            {((lead.preferred_nm || lead.first_nm || '') + ' ' + (lead.last_nm || '')).split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                          </span>
                        )}
                        <span className="text-gray-700 font-medium">{lead.preferred_nm || lead.first_nm} {lead.last_nm}</span>
                      </>
                    );
                  })()}
                </div>
                <div className="text-sm text-gray-500 font-semibold">
                  {totalTasks === 0 ? '0%' : `${Math.round((completedTasks / totalTasks) * 100)}%`}
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1 mb-1">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100}%`,
                    backgroundColor: totalTasks === completedTasks ? '#22c55e' : '#3b82f6'
                  }}
                />
              </div>
              {/* Due date countdown (centered, full width, color-coded) */}
              {epic.due_date && (() => {
                let dueDate = typeof epic.due_date === 'string' ? parseISO(epic.due_date) : epic.due_date;
                if (!isValid(dueDate)) return null;
                const now = new Date();
                const days = differenceInDays(dueDate, now);
                const weeks = differenceInWeeks(dueDate, now);
                const months = differenceInMonths(dueDate, now);
                let text = '';
                let color = '';
                if (days < 0) {
                  text = 'Past due';
                  color = 'bg-red-100 text-red-700';
                } else if (days === 0) {
                  text = 'Due today';
                  color = 'bg-red-100 text-red-700';
                } else if (days <= 7) {
                  text = days === 1 ? '1 day left' : `${days} days left`;
                  color = 'bg-red-100 text-red-700';
                } else if (days > 7 && days < 30) {
                  const weeksDisplay = Math.round(days / 7);
                  text = weeksDisplay === 1 ? '1 week left' : `${weeksDisplay} weeks left`;
                  color = 'bg-yellow-100 text-yellow-800';
                } else {
                  const monthsDisplay = Math.round(days / 30);
                  text = monthsDisplay === 1 ? '1 month left' : `${monthsDisplay} months left`;
                  color = 'bg-green-100 text-green-700';
                }
                return (
                  <div className={`w-full flex justify-center items-center ${color} rounded-full py-1 text-xs font-semibold mt-1 mb-1`}>{text}</div>
                );
              })()}
              {/* Tags and due date at bottom */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(epic.tags) && epic.tags.length > 0 && epic.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
                {epic.due_date && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{typeof epic.due_date === 'string' ? format(parseISO(epic.due_date), 'MMM dd, yyyy') : format(epic.due_date, 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {(!loading && filteredEpics.length === 0) && (
          <div className="col-span-full text-center text-gray-400 py-12">No epics found.</div>
        )}
      </div>
    </div>
  );
} 