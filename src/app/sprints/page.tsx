"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, User, Calendar, TrendingUp, ChevronsUpDown, MessageSquare, Check, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress as ShadcnProgress } from "@/components/ui/progress";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Add this color palette above the SprintsPage component
const sprintColors = [
  'border-l-blue-500',
  'border-l-yellow-400',
  'border-l-green-500',
  'border-l-purple-500',
  'border-l-pink-500',
  'border-l-orange-500',
  'border-l-cyan-500',
  'border-l-red-500',
];
const sprintTextColors = [
  'text-blue-600',
  'text-yellow-700',
  'text-green-700',
  'text-purple-700',
  'text-pink-700',
  'text-orange-700',
  'text-cyan-700',
  'text-red-700',
];

// Add this helper above the SprintsPage component
function formatDateLocal(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string | undefined | null) {
  if (!name || typeof name !== 'string') return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function SprintsPage() {
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newSprint, setNewSprint] = useState({
    title: "",
    lead_id: "",
    goal: "",
    status: "Planned",
    start_date: "",
    end_date: "",
    committed_story_points: 0,
    completed_story_points: 0,
    progress_percent: 0,
    tags: "",
    created_by: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [leadPopoverOpen, setLeadPopoverOpen] = useState(false);
  const [leadQuery, setLeadQuery] = useState("");
  const [stories, setStories] = useState<any[]>([]);
  const [epics, setEpics] = useState<any[]>([]);
  const [addTaskSprintId, setAddTaskSprintId] = useState<number | null>(null);
  const [addTaskPopoverOpen, setAddTaskPopoverOpen] = useState(false);
  const [justAddedTaskIds, setJustAddedTaskIds] = useState<number[]>([]);
  const [editingTitleSprintId, setEditingTitleSprintId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDatesSprintId, setEditingDatesSprintId] = useState<number | null>(null);
  const [editingDates, setEditingDates] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [saving, setSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const dateEditRef = useRef<HTMLDivElement>(null);
  const [editingProgressId, setEditingProgressId] = useState<number | null>(null);
  const [editingProgress, setEditingProgress] = useState<number | null>(null);
  const [editingPointsId, setEditingPointsId] = useState<number | null>(null);
  const [editingPoints, setEditingPoints] = useState<number | null>(null);

  useEffect(() => {
    fetchSprints();
    fetchUsers();
    fetchStories();
    fetchEpics();
  }, []);

  async function fetchSprints() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sprints/`);
      if (!res.ok) throw new Error("Failed to fetch sprints");
      const data = await res.json();
      // Sort sprints by start date (oldest first)
      const sortedSprints = Array.isArray(data) ? data.sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return dateA - dateB;
      }) : [];
      setSprints(sortedSprints);
    } catch (err: any) {
      setError(err.message || "Failed to fetch sprints");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch(`${API_URL}/users/`);
      if (!res.ok) return;
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setUsers([]);
    }
  }

  async function fetchStories() {
    try {
      const res = await fetch(`${API_URL}/stories/`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      const data = await res.json();
      setStories(Array.isArray(data) ? data : []);
    } catch (err) {
      // handle error
    }
  }

  async function fetchEpics() {
    try {
      const res = await fetch(`${API_URL}/epics/`);
      if (!res.ok) throw new Error("Failed to fetch epics");
      const data = await res.json();
      setEpics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching epics:', err);
    }
  }

  async function handleAddSprint() {
    if (!newSprint.title.trim() || !newSprint.start_date || !newSprint.end_date || !newSprint.created_by) return;
    try {
      const payload = {
        ...newSprint,
        tags: newSprint.tags ? newSprint.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
      };

      const res = await fetch(`${API_URL}/sprints/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create sprint");
      setNewSprint({
        title: "",
        lead_id: "",
        goal: "",
        status: "Planned",
        start_date: "",
        end_date: "",
        committed_story_points: 0,
        completed_story_points: 0,
        progress_percent: 0,
        tags: "",
        created_by: "",
      });
      setOpen(false);
      fetchSprints();
    } catch (err: any) {
      setError(err.message || "Failed to create sprint");
    }
  }

  async function assignStoryToSprint(storyId: number, sprintId: number, currentlyAssigned: boolean) {
    setStories(stories => stories.map(s =>
      s.id === storyId ? { ...s, sprint_id: currentlyAssigned ? undefined : sprintId } : s
    ));
    setJustAddedTaskIds(ids => {
      if (currentlyAssigned) {
        return ids.filter(id => id !== storyId);
      } else {
        return [...ids, storyId];
      }
    });
    try {
      await fetch(`${API_URL}/stories/${storyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprint_id: currentlyAssigned ? null : sprintId }),
      });
    } catch (err) {
      setStories(stories => stories.map(s =>
        s.id === storyId ? { ...s, sprint_id: currentlyAssigned ? sprintId : undefined } : s
      ));
      setJustAddedTaskIds(ids => {
        if (currentlyAssigned) {
          return [...ids, storyId];
        } else {
          return ids.filter(id => id !== storyId);
        }
      });
    }
  }

  async function saveSprintEdit(sprintId: number, updates: any) {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/sprints/${sprintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update sprint");
      const updated = await res.json();
      setSprints(sprints => sprints.map(s => s.id === sprintId ? { ...s, ...updated } : s));
      setEditingTitleSprintId(null);
    } catch (err) {
      // Optionally show a toast
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Sprints</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className="ml-1 h-7 w-7" onClick={() => setOpen(true)}>
              <Plus strokeWidth={3} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Sprint</DialogTitle>
              <DialogDescription>Fill out the details below to create a new sprint.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddSprint();
              }}
              className="space-y-3"
            >
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input
                  placeholder="Sprint title"
                  value={newSprint.title}
                  onChange={e => setNewSprint(a => ({ ...a, title: e.target.value }))}
                />
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
                      const queryLower = leadQuery.toLowerCase();
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
                          {newSprint.lead_id
                            ? (users.find((u) => u.attuid === newSprint.lead_id)?.preferred_nm || users.find((u) => u.attuid === newSprint.lead_id)?.first_nm) + ' ' + (users.find((u) => u.attuid === newSprint.lead_id)?.last_nm)
                            : "Select lead..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search lead..." value={leadQuery} onValueChange={setLeadQuery} />
                          <CommandEmpty>No owner found.</CommandEmpty>
                          <CommandGroup>
                            {filteredUsers.map((user) => (
                              <CommandItem
                                key={user.attuid}
                                value={user.attuid}
                                onSelect={() => {
                                  setNewSprint(a => ({ ...a, lead_id: user.attuid }));
                                  setLeadPopoverOpen(false);
                                }}
                              >
                                {user.preferred_nm || user.first_nm} {user.last_nm} ({user.attuid})
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
                <Label className="text-xs text-muted-foreground">Goal</Label>
                <Textarea
                  placeholder="Sprint goal"
                  value={newSprint.goal}
                  onChange={e => setNewSprint(a => ({ ...a, goal: e.target.value }))}
                  className="w-full min-h-[60px] text-sm"
                />
              </div>
              <div className="flex gap-2">
                <DatePickerField
                  label="Start Date"
                  value={newSprint.start_date}
                  onChange={val => setNewSprint(a => ({ ...a, start_date: val }))}
                />
                <DatePickerField
                  label="End Date"
                  value={newSprint.end_date}
                  onChange={val => setNewSprint(a => ({ ...a, end_date: val }))}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Created By (ATTUID)</Label>
                <Input
                  placeholder="Your ATTUID"
                  value={newSprint.created_by}
                  onChange={e => setNewSprint(a => ({ ...a, created_by: e.target.value }))}
                />
              </div>
              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  variant="default"
                  disabled={!newSprint.title.trim() || !newSprint.start_date || !newSprint.end_date || !newSprint.created_by}
                >
                  Save
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 p-4">Error: {error}</div>
      ) : (
        <div className="flex flex-col gap-6">
          {sprints.map((sprint, idx) => {
            const sprintStories = stories.filter((story) => story.sprint_id === sprint.id);
            const backlogStories = stories.filter((story) => story.status !== "Done" && (!story.sprint_id || story.sprint_id === sprint.id));
            const colorClass = sprintColors[idx % sprintColors.length];
            const textColorClass = sprintTextColors[idx % sprintTextColors.length];
            // Format dates
            const dateRange = sprint.start_date && sprint.end_date
              ? `${formatDateLocal(sprint.start_date)} – ${formatDateLocal(sprint.end_date)}`
              : '';
            return (
              <div key={sprint.id} className="flex flex-col gap-1 w-full">
                {editingTitleSprintId === sprint.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={titleInputRef}
                      className={`font-bold text-lg ${colorClass.replace('border-', 'text-')} bg-gray-50 rounded px-2 py-1 mb-0.5 w-full`}
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      disabled={saving}
                      onBlur={async () => {
                        await saveSprintEdit(sprint.id, { title: editingTitle });
                        setEditingTitleSprintId(null);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          await saveSprintEdit(sprint.id, { title: editingTitle });
                          setEditingTitleSprintId(null);
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          setEditingTitle(sprint.title);
                          setEditingTitleSprintId(null);
                        }
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div
                    className={`font-bold text-lg ${textColorClass}`}
                    onClick={() => {
                      setEditingTitleSprintId(sprint.id);
                      setEditingTitle(sprint.title);
                      setEditingDatesSprintId(null);
                    }}
                  >
                    {sprint.title}
                  </div>
                )}
                {editingDatesSprintId === sprint.id ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="date"
                      className="text-xs text-gray-700 border rounded px-1 py-0.5"
                      value={editingDates.start}
                      onChange={e => setEditingDates(d => ({ ...d, start: e.target.value }))}
                      disabled={saving}
                      autoFocus
                    />
                    <span className="text-xs text-gray-400">–</span>
                    <input
                      type="date"
                      className="text-xs text-gray-700 border rounded px-1 py-0.5"
                      value={editingDates.end}
                      onChange={e => setEditingDates(d => ({ ...d, end: e.target.value }))}
                      disabled={saving}
                    />
                    <button
                      className="ml-2 px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      onClick={() => saveSprintEdit(sprint.id, { start_date: editingDates.start, end_date: editingDates.end }).then(() => setEditingDatesSprintId(null))}
                      disabled={saving}
                      type="button"
                    >Save</button>
                    <button
                      className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                      onClick={() => setEditingDatesSprintId(null)}
                      disabled={saving}
                      type="button"
                    >Cancel</button>
                  </div>
                ) : (
                  <div
                    className="text-xs text-gray-500 mb-2 cursor-pointer"
                    onClick={() => {
                      setEditingDatesSprintId(sprint.id);
                      setEditingDates({ start: sprint.start_date, end: sprint.end_date });
                      setEditingTitleSprintId(null);
                    }}
                  >
                    {dateRange}
                  </div>
                )}
                <div className={`border-t border-r border-b border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white border-l-8 ${colorClass}`}>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100 hover:bg-gray-100">
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Task</TableHead>
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Description</TableHead>
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Assignee(s)</TableHead>
                          <TableHead className="text-center font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Comments</TableHead>
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Status</TableHead>
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Priority</TableHead>
                          <TableHead className="text-center font-semibold text-center text-xs text-gray-600 py-2 whitespace-nowrap">Progress</TableHead>
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Type</TableHead>
                          <TableHead className="text-center font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Est. Points</TableHead>
                          <TableHead className="text-left font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Epic</TableHead>
                          <TableHead className="text-center font-semibold text-xs text-gray-600 py-2 whitespace-nowrap">Attachments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sprintStories.map((story) => (
                          <TableRow key={story.id} className="bg-white hover:bg-gray-50">
                            <TableCell className="py-2 font-medium text-gray-900 whitespace-nowrap">{story.title}</TableCell>
                            <TableCell className="py-2 max-w-xs whitespace-nowrap">
                              <span className="truncate block text-gray-700 max-w-[200px]">{story.description || <span className="italic text-gray-400">No description</span>}</span>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center -space-x-2">
                                {story.assignee_ids && story.assignee_ids.slice(0, 3).map((id: string, idx: number) => {
                                  const user = users.find((u) => u.attuid === id);
                                  return (
                                    <span
                                      key={id}
                                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 border-2 border-white text-gray-700 font-bold text-xs shadow-sm${idx > 0 ? ' -ml-2' : ''}`}
                                      title={user ? `${user.preferred_nm || user.first_nm || ''} ${user.last_nm || ''}`.trim() : id}
                                    >
                                      {user && user.profile_picture ? (
                                        <img
                                          src={`data:image/jpeg;base64,${user.profile_picture}`}
                                          alt={user.preferred_nm || user.first_nm || id}
                                          className="w-7 h-7 rounded-full object-cover"
                                        />
                                      ) : (
                                        user ? getInitials(`${user.preferred_nm || user.first_nm || ''} ${user.last_nm || ''}`) : getInitials(id)
                                      )}
                                    </span>
                                  );
                                })}
                                {story.assignee_ids && story.assignee_ids.length > 3 && (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 border-2 border-white text-gray-500 font-semibold text-xs shadow-sm">+{story.assignee_ids.length - 3}</span>
                                )}
                                {(!story.assignee_ids || story.assignee_ids.length === 0) && (
                                  <span className="text-gray-300"><User className="w-5 h-5" /></span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              <span className="inline-flex items-center gap-1 text-gray-400">
                                <MessageSquare className="w-4 h-4" />
                                0
                              </span>
                            </TableCell>
                            <TableCell className="py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                story.status === "Done"
                                  ? "bg-green-100 text-green-700"
                                  : story.status === "Ready to start"
                                  ? "bg-blue-100 text-blue-700"
                                  : story.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {story.status}
                              </span>
                            </TableCell>
                            <TableCell className="py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                story.priority === "Critical"
                                  ? "bg-red-100 text-red-700"
                                  : story.priority === "High"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : story.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {story.priority}
                              </span>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              {editingProgressId === story.id ? (
                                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={editingProgress ?? story.progress ?? 0}
                                    onChange={e => {
                                      setEditingProgress(Number(e.target.value));
                                      setStories(stories => stories.map(s => s.id === story.id ? { ...s, progress: Number(e.target.value) } : s));
                                    }}
                                    onBlur={async () => {
                                      await fetch(`${API_URL}/stories/${story.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ progress: editingProgress }),
                                      });
                                      setEditingProgressId(null);
                                    }}
                                    onMouseUp={async () => {
                                      await fetch(`${API_URL}/stories/${story.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ progress: editingProgress }),
                                      });
                                      setEditingProgressId(null);
                                    }}
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        await fetch(`${API_URL}/stories/${story.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ progress: editingProgress }),
                                        });
                                        setEditingProgressId(null);
                                      } else if (e.key === 'Escape') {
                                        e.preventDefault();
                                        setEditingProgress(story.progress ?? 0);
                                        setEditingProgressId(null);
                                      }
                                    }}
                                    className="w-24 h-2 accent-blue-600 focus:outline-none focus:ring-0"
                                    autoFocus
                                  />
                                  <span className="text-xs text-gray-700 min-w-[3ch]">{editingProgress ?? story.progress ?? 0}%</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 cursor-pointer group whitespace-nowrap" onClick={() => {
                                  setEditingProgressId(story.id);
                                  setEditingProgress(story.progress ?? 0);
                                }} title="Click to edit progress">
                                  <ShadcnProgress value={typeof story.progress === 'number' ? story.progress : 0} className="[&>*]:bg-green-500 w-24 h-2 bg-gray-200" />
                                  <span className="text-xs text-gray-700">{typeof story.progress === 'number' ? story.progress : 0}%</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                story.type === "Task"
                                  ? "bg-green-200 text-green-800"
                                  : story.type === "Bug"
                                  ? "bg-red-100 text-red-700"
                                  : story.type === "Story"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {story.type}
                              </span>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              {editingPointsId === story.id ? (
                                <div className="flex items-center justify-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={editingPoints ?? story.story_points ?? ''}
                                    onChange={e => {
                                      const value = e.target.value === '' ? null : Number(e.target.value);
                                      setEditingPoints(value);
                                      setStories(stories => stories.map(s => s.id === story.id ? { ...s, story_points: value } : s));
                                    }}
                                    onBlur={async () => {
                                      await fetch(`${API_URL}/stories/${story.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ story_points: editingPoints }),
                                      });
                                      setEditingPointsId(null);
                                    }}
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        await fetch(`${API_URL}/stories/${story.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ story_points: editingPoints }),
                                        });
                                        setEditingPointsId(null);
                                      } else if (e.key === 'Escape') {
                                        e.preventDefault();
                                        setEditingPoints(story.story_points ?? null);
                                        setEditingPointsId(null);
                                      }
                                    }}
                                    className="w-16 h-7 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => {
                                    setEditingPointsId(story.id);
                                    setEditingPoints(story.story_points ?? null);
                                    setEditingProgressId(null);
                                  }}
                                >
                                  {typeof story.story_points === 'number' ? story.story_points : '-'}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              {story.epic_id ? (
                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                  {epics.find(e => e.id === story.epic_id)?.title || 'Loading...'}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              <span className="inline-flex items-center gap-1 text-gray-400">
                                <Paperclip className="w-4 h-4" />
                                {Array.isArray(story.attachments) ? story.attachments.length : 0}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={11} className="py-2">
                            <Popover open={addTaskPopoverOpen && addTaskSprintId === sprint.id} onOpenChange={open => { setAddTaskPopoverOpen(open); setAddTaskSprintId(open ? sprint.id : null); }}>
                              <PopoverTrigger asChild>
                                <button className="text-blue-400 hover:underline text-xs font-medium" type="button">
                                  Edit Tasks
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-0 rounded-lg shadow-lg bg-white border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50 rounded-t-lg">
                                  <div className="font-semibold text-sm text-blue-800">Add/Remove Tasks for {sprint.title}</div>
                                </div>
                                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto px-2 py-2">
                                  {backlogStories.length === 0 ? (
                                    <span className="text-xs text-gray-400 px-2 py-2">No backlog tasks available</span>
                                  ) : backlogStories.map((story, idx) => {
                                    const isAssignedToThisSprint = story.sprint_id === sprint.id;
                                    const justAdded = justAddedTaskIds.includes(story.id);
                                    return (
                                      <div key={story.id} className="w-full">
                                        <button
                                          className="flex flex-col items-start gap-1 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors w-full text-left border border-transparent hover:border-blue-200 text-xs relative"
                                          onClick={() => assignStoryToSprint(story.id, sprint.id, isAssignedToThisSprint)}
                                          type="button"
                                        >
                                          <span className="font-medium text-gray-900 mb-0.5">{story.title}</span>
                                          <div className="flex flex-row gap-1 mt-0.5">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                              story.status === "Done"
                                                ? "bg-green-100 text-green-700"
                                                : story.status === "Ready to start"
                                                ? "bg-blue-100 text-blue-700"
                                                : story.status === "In Progress"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-700"
                                            }`}>{story.status}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                              story.priority === "Critical"
                                                ? "bg-red-100 text-red-700"
                                                : story.priority === "High"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : story.priority === "Medium"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-700"
                                            }`}>{story.priority}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                              story.type === "Task"
                                                ? "bg-green-200 text-green-800"
                                                : story.type === "Bug"
                                                ? "bg-red-100 text-red-700"
                                                : story.type === "Story"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-700"
                                            }`}>{story.type}</span>
                                          </div>
                                          {(isAssignedToThisSprint || justAdded) && (
                                            <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
                                          )}
                                        </button>
                                        {idx < backlogStories.length - 1 && <div className="border-b border-gray-200 mx-2" />}
                                      </div>
                                    );
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}