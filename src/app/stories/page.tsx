"use client";
import { useState, useEffect } from 'react';
import { Plus, ListTodo, MessageCircle, Edit2, Star, Paperclip, Layers3, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Loader } from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { showToast } from '@/lib/showToast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const typeColors: Record<string, string> = {
  'Story': 'bg-purple-100 text-purple-700',
  'Task': 'bg-yellow-100 text-yellow-700',
  'Bug': 'bg-red-100 text-red-700',
};

// Add statusStyles for unique colors per column
const statusStyles: Record<string, { color: string; border: string; badge: string; badgeText: string }> = {
  'To Do': { color: 'text-blue-700', border: 'border-blue-400', badge: 'bg-blue-100', badgeText: 'text-blue-700' },
  'In Progress': { color: 'text-yellow-700', border: 'border-yellow-400', badge: 'bg-yellow-100', badgeText: 'text-yellow-800' },
  'Done': { color: 'text-green-700', border: 'border-green-400', badge: 'bg-green-100', badgeText: 'text-green-700' },
};

function getInitials(name: string | undefined | null) {
  if (!name || typeof name !== 'string') return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// Replace storiesApi with fetch-based functions
async function fetchStories() {
  try {
    console.log('Fetching stories from:', `${API_URL}/stories/`);
    const res = await fetch(`${API_URL}/stories/`);
    if (!res.ok) {
      console.error('Failed to fetch stories:', res.status, res.statusText);
      return [];
    }
    const data = await res.json();
    console.log('Fetched stories:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

async function createStory(story: any) {
  try {
    console.log('Creating story with data:', story);
    const res = await fetch(`${API_URL}/stories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error creating story:', errorData);
      throw new Error(errorData.detail || 'Failed to create story');
    }
    return res.json();
  } catch (error) {
    console.error('Error in createStory:', error);
    throw error;
  }
}

async function updateStory(id: number, story: any) {
  const res = await fetch(`${API_URL}/stories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story),
  });
  if (!res.ok) throw new Error('Failed to update story');
  return res.json();
}

// Add fetchEpics function after fetchStories
async function fetchEpics() {
  const res = await fetch(`${API_URL}/epics/`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [epics, setEpics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpics, setLoadingEpics] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStory, setNewStory] = useState({
    epic_id: 0,
    title: '',
    description: '',
    type: 'Story',
    status: 'To Do',
    priority: 'Medium',
    assignee_ids: [],
    progress: 0,
    tags: '',
    start_date: '',
    due_date: '',
    story_points: 0,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [assignLoading, setAssignLoading] = useState<{[storyId: number]: boolean}>({});
  const [assigneePicker, setAssigneePicker] = useState<number | null>(null); // storyId for open picker

  // Fetch stories
  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const data = await fetchStories();
        console.log('Setting stories state:', data);
        setStories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error in loadStories:', err);
        setError('Failed to fetch stories');
        showToast({
          title: 'Error',
          description: 'Failed to fetch stories',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [toast]);

  // Update useEffect for fetching epics
  useEffect(() => {
    const loadEpics = async () => {
      try {
        setLoadingEpics(true);
        const data = await fetchEpics();
        setEpics(data);
      } catch (err) {
        showToast({
          title: 'Error',
          description: 'Failed to fetch epics',
          variant: 'destructive',
        });
      } finally {
        setLoadingEpics(false);
      }
    };

    loadEpics();
  }, [toast]);

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const attuids = ['ek2842', 'jt2152', 'wt8193', 'jb3634', 'cm8789', 'sp507x'];
        const res = await fetch(`${API_URL}/users/`);
        if (!res.ok) return;
        const data = await res.json();
        const filtered = Array.isArray(data)
          ? data.filter((u) => attuids.includes(u.attuid))
          : [];
        filtered.sort((a, b) => (a.last_nm || '').localeCompare(b.last_nm || ''));
        setUsers(filtered);
      } catch (e) {
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  async function handleAddOrEdit() {
    try {
      const storyData = {
        ...newStory,
        tags: newStory.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      console.log('handleAddOrEdit called. editing:', editing, 'storyData:', storyData);

      if (editing !== null) {
        const updated = await updateStory(editing, storyData);
        console.log('updateStory response:', updated);
        setStories(stories.map(s => s.id === editing ? updated : s));
        showToast({
          title: 'Success',
          description: 'Story updated successfully'
        });
        console.log('Toast: Story updated successfully');
      } else {
        const created = await createStory(storyData);
        console.log('createStory response:', created);
        setStories([...stories, created]);
        showToast({
          title: 'Success',
          description: 'Story created successfully',
        });
        console.log('Toast: Story created successfully');
      }
      setNewStory({
        epic_id: 0,
        title: '',
        description: '',
        type: 'Story',
        status: 'To Do',
        priority: 'Medium',
        assignee_ids: [],
        progress: 0,
        tags: '',
        start_date: '',
        due_date: '',
        story_points: 0,
      });
      setOpen(false);
      setEditing(null);
      console.log('Dialog closed, form reset');
    } catch (err) {
      console.error('Error in handleAddOrEdit:', err);
      showToast({
        title: 'Error',
        description: editing ? 'Failed to update story' : 'Failed to create story',
        variant: 'destructive',
      });
      console.log('Toast: Error shown');
    }
  }

  function handleEdit(story: any) {
    setNewStory({
      epic_id: story.epic_id,
      title: story.title,
      description: story.description || '',
      type: story.type,
      status: story.status,
      priority: story.priority,
      assignee_ids: story.assignee_ids,
      start_date: story.start_date || '',
      due_date: story.due_date || '',
      story_points: story.story_points || 0,
      progress: story.progress,
      tags: story.tags ? story.tags.join(',') : '',
    });
    setEditing(story.id);
    setOpen(true);
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const storyId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    const story = stories.find(s => s.id === storyId);

    if (!story) return;

    // Optimistically update local state
    const prevStories = [...stories];
    const updatedStories = stories.map(s =>
      s.id === storyId ? { ...s, status: newStatus } : s
    );
    setStories(updatedStories);

    try {
      const updatedStory = await updateStory(storyId, { ...story, status: newStatus });
      setStories(stories => stories.map(s => s.id === storyId ? updatedStory : s));
      showToast({
        title: 'Success',
        description: 'Story status updated successfully',
      });
    } catch (err) {
      // Revert to previous state if backend call fails
      setStories(prevStories);
      showToast({
        title: 'Error',
        description: 'Failed to update story status',
        variant: 'destructive',
      });
    }
  };

  const columns = {
    'To Do': stories.filter(story => story.status === 'To Do'),
    'In Progress': stories.filter(story => story.status === 'In Progress'),
    'Done': stories.filter(story => story.status === 'Done'),
  };

  // Assign/unassign user
  async function toggleAssignee(story: any, user: any) {
    setAssignLoading(l => ({ ...l, [story.id]: true }));
    const isAssigned = story.assignee_ids.includes(user.attuid);
    const newAssignees = isAssigned
      ? story.assignee_ids.filter((id: string) => id !== user.attuid)
      : [...story.assignee_ids, user.attuid];
    // Optimistically update UI
    setStories(stories => stories.map(s => s.id === story.id ? { ...s, assignee_ids: newAssignees } : s));
    try {
      await updateStory(story.id, { ...story, assignee_ids: newAssignees });

    } catch (e) {
      // Revert on error
      setStories(stories => stories.map(s => s.id === story.id ? { ...s, assignee_ids: story.assignee_ids } : s));
      showToast({
        title: 'Error',
        description: 'Failed to update assignees',
        variant: 'destructive'
      });

    } finally {
      setAssignLoading(l => ({ ...l, [story.id]: false }));
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-2">
      {/* Sticky header with search/filter */}
      <div className="sticky top-0 z-10 backdrop-blur mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-primary" /> Stories / Tasks
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            className="w-[180px]"
            placeholder="Search stories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columns).map(([status, stories]) => (
            <div key={status} className={`flex flex-col`}>
              <div className={`flex items-center justify-between mt-2 mb-4 border-t-4 pt-2 ${statusStyles[status]?.border || 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <h2 className={`text-base font-bold text-gray-900`}>{status.toUpperCase()}</h2>
                  <span className={`inline-block text-sm font-bold rounded-full px-3 py-1 ml-1 min-w-[2em] text-center ${statusStyles[status]?.badge || 'bg-gray-100'} ${statusStyles[status]?.badgeText || 'text-gray-700'}`}>{stories.length}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`ml-auto ${statusStyles[status]?.color || 'text-gray-700'}`}
                  title={`Add to ${status}`}
                  onClick={() => {
                    setOpen(true);
                    setEditing(null);
                    setNewStory({
                      epic_id: 0,
                      title: '',
                      description: '',
                      type: 'Story',
                      status: status,
                      priority: 'Medium',
                      assignee_ids: [],
                      progress: 0,
                      tags: '',
                      start_date: '',
                      due_date: '',
                      story_points: 0,
                    });
                  }}
                >
                  <Plus className="w-8 h-8 font-extrabold" strokeWidth={4} />
                </Button>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 min-h-[500px] bg-gray-50 rounded-lg p-4"
                  >
                    {stories
                      .filter(story => !search || story.title.toLowerCase().includes(search.toLowerCase()))
                      .map((story, index) => (
                        <Draggable key={story.id} draggableId={String(story.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 cursor-move hover:shadow-lg transition-all group flex flex-col min-h-[160px]"
                            >
                              {/* Title, edit button, and points at the top */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center min-w-0">
                                  <div className="font-bold text-base text-gray-900 line-clamp-2">{story.title}</div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Edit"
                                    onClick={() => handleEdit(story)}
                                  >
                                    <Edit2 className="w-5 h-5 text-blue-500" />
                                  </Button>
                                </div>
                                {story.story_points ? (
                                  <span className="flex items-center gap-1 font-semibold text-gray-400 text-xs">
                                    <Star className="w-3 h-3" fill="currentColor" />
                                    {story.story_points}
                                  </span>
                                ) : null}
                              </div>
                              {/* Top row: badges (type, status, priority) */}
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {/* Type badge (optional) */}
                                {story.type && (
                                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${typeColors[story.type]}`}>{story.type}</span>
                                )}
                                {/* Status badge */}
                                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${statusStyles[story.status]?.badge || 'bg-gray-100'} ${statusStyles[story.status]?.badgeText || 'text-gray-700'}`}>{story.status}</span>
                                {/* Priority badge */}
                                {story.priority && (
                                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                                    story.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                    story.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                    story.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>{story.priority}</span>
                                )}
                              </div>
                              {/* Description (optional, truncated to 3 lines) */}
                              {story.description && (
                                <div className="text-sm text-gray-500 mb-2 line-clamp-3">{story.description}</div>
                              )}
                              {/* Assignees row with picker below description */}
                              <div className="flex items-center gap-1 mb-4">
                                {story.assignee_ids && story.assignee_ids.slice(0, 5).map((id: string, idx: number) => {
                                  const user = users.find(u => u.attuid === id);
                                  return (
                                    <span
                                      key={id}
                                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-gray-700 font-bold text-sm shadow-sm${idx > 0 ? ' -ml-2' : ''}`}
                                      title={user ? user.last_nm + ', ' + user.preferred_nm : id}
                                    >
                                      {user && user.profile_picture ? (
                                        <img src={`data:image/jpeg;base64,${user.profile_picture}`} alt={user.last_nm + ', ' + user.preferred_nm} className="w-8 h-8 rounded-full object-cover" />
                                      ) : (
                                        user ? getInitials(user.last_nm + ', ' + user.preferred_nm) : getInitials(id)
                                      )}
                                    </span>
                                  );
                                })}
                                {story.assignee_ids && story.assignee_ids.length > 5 && (
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-gray-500 font-semibold text-xs shadow-sm">+{story.assignee_ids.length - 5}</span>
                                )}
                                {/* Assignee picker trigger */}
                                <Popover open={assigneePicker === story.id} onOpenChange={v => setAssigneePicker(v ? story.id : null)}>
                                  <PopoverTrigger asChild>
                                    <button
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-200 hover:text-primary transition-colors focus:outline-none"
                                      title="Assign user"
                                      type="button"
                                    >
                                      <UserPlus className="w-5 h-5" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-56 p-2">
                                    <div className="font-semibold text-sm mb-2">Assign User</div>
                                    <div className="flex flex-col gap-1">
                                      {users.map(user => {
                                        const assigned = story.assignee_ids.includes(user.attuid);
                                        return (
                                          <button
                                            key={user.attuid}
                                            className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors w-full text-left ${assigned ? 'bg-blue-50' : ''}`}
                                            onClick={() => toggleAssignee(story, user)}
                                            disabled={assignLoading[story.id]}
                                            type="button"
                                          >
                                            {user.profile_picture ? (
                                              <img src={`data:image/jpeg;base64,${user.profile_picture}`} alt={user.last_nm + ', ' + user.preferred_nm} className="w-6 h-6 rounded-full object-cover" />
                                            ) : (
                                              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs">{getInitials(user.full_name)}</span>
                                            )}
                                            <span className="flex-1 text-sm truncate">{user.last_nm + ', ' + user.preferred_nm}</span>
                                            {assigned && <span className="text-xs text-blue-600 font-semibold">Assigned</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              {/* Epic name, attachments, comments all on the right */}
                              <div className="flex items-center text-sm gap-4 mt-auto">
                                {/* Epic name (darker color, flex-grow) */}
                                {(() => {
                                  const epic = epics.find((e: any) => e.id === story.epic_id);
                                  return epic ? (
                                    <span className="flex items-center gap-1 text-gray-700 font-medium flex-grow min-w-0">
                                      <Layers3 className="w-4 h-4 text-gray-700 flex-shrink-0" />
                                      <span className="truncate">{epic.title}</span>
                                    </span>
                                  ) : <span className="flex-grow" />;
                                })()}
                                <span className="flex items-center gap-1 text-purple-500 flex-shrink-0"><Paperclip className="w-4 h-4" /> 0</span>
                                <span className="flex items-center gap-1 text-orange-500 flex-shrink-0"><MessageCircle className="w-4 h-4" /> 0</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing !== null ? 'Edit Story / Task' : 'Add Story / Task'}</DialogTitle>
            <DialogDescription>
              {editing !== null ? 'Update the details below and save your changes.' : 'Fill out the details below to add a new story or task.'}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => { e.preventDefault(); handleAddOrEdit(); }}
            className="space-y-3"
          >
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input
                placeholder="Title"
                value={newStory.title}
                onChange={e => setNewStory((a: any) => ({ ...a, title: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea
                placeholder="Description"
                value={newStory.description || ''}
                onChange={e => setNewStory((a: any) => ({ ...a, description: e.target.value }))}
                className="w-full min-h-[60px] text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Epic</Label>
              <Select 
                value={newStory.epic_id ? String(newStory.epic_id) : ''}
                onValueChange={v => setNewStory((a: any) => ({ ...a, epic_id: Number(v) }))}
                disabled={loadingEpics}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingEpics ? "Loading epics..." : "Select Epic"} />
                </SelectTrigger>
                <SelectContent>
                  {epics.length === 0 ? (
                    <SelectItem value="no-epics" disabled>No epics available</SelectItem>
                  ) : (
                    epics.map((epic) => (
                      <SelectItem key={epic.id} value={String(epic.id)}>
                        {epic.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Select value={newStory.type} onValueChange={v => setNewStory((a: any) => ({ ...a, type: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Story">Story</SelectItem>
                  <SelectItem value="Task">Task</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={newStory.status} onValueChange={v => setNewStory((a: any) => ({ ...a, status: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select value={newStory.priority} onValueChange={v => setNewStory((a: any) => ({ ...a, priority: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Story Points</Label>
              <Input
                type="number"
                placeholder="Story Points"
                value={newStory.story_points || ''}
                onChange={e => setNewStory((a: any) => ({ ...a, story_points: parseInt(e.target.value) || undefined }))}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tags</Label>
              <Input
                placeholder="Comma separated tags"
                value={newStory.tags}
                onChange={e => setNewStory((a: any) => ({ ...a, tags: e.target.value }))}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!newStory.title.trim() || !newStory.epic_id}
              >
                {editing !== null ? 'Save' : 'Add'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 