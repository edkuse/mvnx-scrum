"use client";

import { useState, useEffect } from 'react';
import { Boxes, Layers3, ListTodo } from 'lucide-react';
import { Card  } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';
import { Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Application {
  itap_id: string;
  name: string;
  description: string;
  acronym: string;
  active: boolean;
  it_owner?: string;
  it_owner_alt?: string;
  owner_name?: string;
  owner_profile_picture?: string;
  owner_alt_name?: string;
  owner_alt_profile_picture?: string;
  business_owner_name?: string;
  business_owner_profile_picture?: string;
  install_status?: string;
  lifecycle_status?: string;
  install_type?: string;
  app_type?: string;
  business_purpose?: string;
  business_unit?: string;
  business_owner?: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'status-active' | 'status-inactive';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [epics, setEpics] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [newApp, setNewApp] = useState<Partial<Application>>({ name: '', description: '', acronym: '' });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [businessOwnerFilter, setBusinessOwnerFilter] = useState<string>('all');
  const [epicPopoverOpen, setEpicPopoverOpen] = useState<string | null>(null);
  const [taskPopoverOpen, setTaskPopoverOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchEpics();
    fetchStories();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/applications/`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }

  async function fetchEpics() {
    try {
      const response = await fetch(`${API_URL}/epics/`);
      if (!response.ok) throw new Error('Failed to fetch epics');
      const data = await response.json();
      setEpics(data);
    } catch (err) {
      console.error('Error fetching epics:', err);
    }
  }

  async function fetchStories() {
    try {
      const response = await fetch(`${API_URL}/stories/`);
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      setStories(data);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  }

  async function handleAddOrEdit() {
    if (!newApp.name?.trim() || !newApp.acronym?.trim()) return;
    try {
      if (editing !== null) {
        const response = await fetch(`${API_URL}/applications/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApp),
        });
        if (!response.ok) throw new Error('Failed to update application');
        const updatedApp = await response.json();
        setApplications(applications.map(app => app.itap_id === editing ? updatedApp : app));
      } else {
        const response = await fetch(`${API_URL}/applications/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApp),
        });
        if (!response.ok) throw new Error('Failed to create application');
        const newApplication = await response.json();
        setApplications([...applications, newApplication]);
      }
      setNewApp({ name: '', description: '', acronym: '' });
      setOpen(false);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save application');
    }
  }

  async function handleDelete(itap_id: string) {
    try {
      const response = await fetch(`${API_URL}/applications/${itap_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete application');
      setApplications(applications.filter(app => app.itap_id !== itap_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
    }
  }

  function handleEdit(app: Application) {
    setNewApp(app);
    setEditing(app.itap_id);
    setOpen(true);
  }

  function handleCardClick(app: Application) {
    setSelectedApp(app);
    setDetailsOpen(true);
  }

  const filteredAndSortedApps = applications
    .filter(app => {
      const matchesSearch = !search || 
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description?.toLowerCase().includes(search.toLowerCase()) ||
        app.acronym?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && app.active) ||
        (statusFilter === 'inactive' && !app.active);
      
      const matchesOwner = ownerFilter === 'all' || 
        app.owner_name?.toLowerCase() === ownerFilter.toLowerCase();
      
      const matchesBusinessOwner = businessOwnerFilter === 'all' ||
        app.business_owner_name?.toLowerCase() === businessOwnerFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesOwner && matchesBusinessOwner;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'status-active':
          return a.active === b.active ? 0 : a.active ? -1 : 1;
        case 'status-inactive':
          return a.active === b.active ? 0 : a.active ? 1 : -1;
        default:
          return 0;
      }
    });

  // Get unique owners for the filter dropdown
  const uniqueOwners = Array.from(new Set(applications
    .map(app => app.owner_name)
    .filter((owner): owner is string => !!owner)))
    .sort();

  // Get unique business owners for the filter dropdown
  const uniqueBusinessOwners = Array.from(new Set(applications
    .map(app => app.business_owner_name)
    .filter((owner): owner is string => !!owner)))
    .sort();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header row with filters and labels */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-primary" /> Applications
          </h1>
          <div className="flex flex-wrap gap-4 items-end justify-end">
            <div className="flex flex-col gap-1 mr-3">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input
                className="w-[180px]"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 mr-3">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as 'all' | 'active' | 'inactive')}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 mr-3">
              <Label className="text-xs text-muted-foreground">IT Owner</Label>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="IT Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueOwners.map(owner => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 mr-3">
              <Label className="text-xs text-muted-foreground">Business Owner</Label>
              <Select value={businessOwnerFilter} onValueChange={setBusinessOwnerFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Business Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueBusinessOwners.map(owner => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Sort By</Label>
              <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="status-active">Active First</SelectItem>
                  <SelectItem value="status-inactive">Inactive First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-200 mb-2" />

      {/* Card list */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {filteredAndSortedApps.map((app) => {
          // Calculate counts for this application
          const appEpics = epics.filter(epic => 
            Array.isArray(epic.application_ids) && 
            epic.application_ids.includes(app.itap_id)
          );
          const appStories = stories.filter(story => 
            appEpics.some(epic => epic.id === story.epic_id)
          );
          const completedStories = appStories.filter(story => story.status === 'Done').length;

          return (
            <Card
              key={app.itap_id}
              className="relative group transition-all duration-200 hover:shadow-lg flex flex-col gap-1.5 cursor-pointer animate-fadeIn"
              style={{ padding: 0 }}
              onClick={() => handleCardClick(app)}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 justify-between">
                  <div className="font-bold text-base text-gray-900 truncate">{app.name}</div>
                  <div className="flex items-center gap-2">
                    {/* Epics count badge with tooltip (only if > 0) */}
                    {appEpics.length > 0 && (
                      <Popover open={epicPopoverOpen === app.itap_id + '-epics'} onOpenChange={open => setEpicPopoverOpen(open ? app.itap_id + '-epics' : null)}>
                        <PopoverTrigger asChild>
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 cursor-help"
                            onMouseEnter={() => setEpicPopoverOpen(app.itap_id + '-epics')}
                            onMouseLeave={() => setEpicPopoverOpen(null)}
                          >
                            <Layers3 className="w-3 h-3" />
                            {appEpics.length}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-2 text-xs"
                          onMouseEnter={() => setEpicPopoverOpen(app.itap_id + '-epics')}
                          onMouseLeave={() => setEpicPopoverOpen(null)}
                        >
                          <div className="font-medium">Epics</div>
                          <div className="text-muted-foreground">{`${appEpics.length} epic${appEpics.length === 1 ? '' : 's'} linked to this application`}</div>
                        </PopoverContent>
                      </Popover>
                    )}
                    {/* Stories/Tasks count badge with tooltip (only if > 0) */}
                    {appStories.length > 0 && (
                      <Popover open={taskPopoverOpen === app.itap_id + '-tasks'} onOpenChange={open => setTaskPopoverOpen(open ? app.itap_id + '-tasks' : null)}>
                        <PopoverTrigger asChild>
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              completedStories === appStories.length ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            } cursor-help`}
                            onMouseEnter={() => setTaskPopoverOpen(app.itap_id + '-tasks')}
                            onMouseLeave={() => setTaskPopoverOpen(null)}
                          >
                            {completedStories === appStories.length ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <ListTodo className="w-3 h-3" />
                            )}
                            {completedStories}/{appStories.length}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-2 text-xs"
                          onMouseEnter={() => setTaskPopoverOpen(app.itap_id + '-tasks')}
                          onMouseLeave={() => setTaskPopoverOpen(null)}
                        >
                          <div className="font-medium">Stories/Tasks</div>
                          <div className="text-muted-foreground">
                            {`${completedStories} completed out of ${appStories.length} total tasks`}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
                <div className="text-gray-700 text-sm line-clamp-5 my-4">{app.description || 'No description provided'}</div>
                <div className="flex items-center justify-between mt-1 border-t border-gray-200 pt-2">
                  {/* IT Owner (left) */}
                  {app.owner_name && (
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-muted-foreground font-medium mb-1">IT Owner</span>
                      <div className="flex items-center gap-2">
                        {app.owner_profile_picture ? (
                          <img
                            src={`data:image/jpeg;base64,${app.owner_profile_picture}`}
                            alt={app.owner_name}
                            className="w-7 h-7 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border">
                            {app.owner_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                          </div>
                        )}
                        <span className="text-xs text-gray-700 font-medium">{app.owner_name}</span>
                      </div>
                    </div>
                  )}
                  {/* Business Owner (right) */}
                  {app.business_owner_name && (
                    <div className="flex flex-col ml-auto">
                      <span className="text-[10px] text-muted-foreground font-medium mb-1">Business Owner</span>
                      <div className="flex items-center gap-2">
                        {app.business_owner_profile_picture ? (
                          <img
                            src={`data:image/jpeg;base64,${app.business_owner_profile_picture}`}
                            alt={app.business_owner_name}
                            className="w-7 h-7 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border">
                            {app.business_owner_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                          </div>
                        )}
                        <span className="text-xs text-gray-700 font-medium">{app.business_owner_name}</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Acronym and ITAP ID row at bottom */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span className="font-medium">ACRONYM:</span> <span className="ml-1">{app.acronym}</span>
                  <span className="ml-auto">
                    <span className="font-medium">ITAP:</span>{' '}
                    <a
                      href={`https://example.com/app/${app.itap_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-800 transition-colors ml-1"
                      onClick={e => e.stopPropagation()}
                    >
                      {app.itap_id}
                    </a>
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
        {filteredAndSortedApps.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            {search || statusFilter !== 'all' 
              ? 'No applications match your filters.' 
              : 'No applications found.'}
          </div>
        )}
      </div>
      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={v => { setDetailsOpen(v); if (!v) setSelectedApp(null); }}>
        <DialogContent className="max-w-xl [&>button]:hidden">
          {selectedApp && (
            <div>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedApp.name}</DialogTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedApp.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedApp.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                <span className="font-medium">ITAP ID:</span> {selectedApp.itap_id}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900">{selectedApp.description || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">IT Owner</h3>
                    <div className="flex items-center gap-2">
                      {selectedApp.owner_profile_picture ? (
                        <img
                          src={`data:image/jpeg;base64,${selectedApp.owner_profile_picture}`}
                          alt={selectedApp.owner_name}
                          className="w-7 h-7 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border">
                          {selectedApp.owner_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                        </div>
                      )}
                      <span className="text-gray-900">{selectedApp.owner_name || 'Not specified'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">IT Owner Alt</h3>
                    <div className="flex items-center gap-2">
                      {selectedApp.owner_alt_profile_picture ? (
                        <img
                          src={`data:image/jpeg;base64,${selectedApp.owner_alt_profile_picture}`}
                          alt={selectedApp.owner_alt_name}
                          className="w-7 h-7 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border">
                          {selectedApp.owner_alt_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                        </div>
                      )}
                      <span className="text-gray-900">{selectedApp.owner_alt_name || 'Not specified'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Install Status</h3>
                    <p className="text-gray-900">{selectedApp.install_status || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Lifecycle Status</h3>
                    <p className="text-gray-900">{selectedApp.lifecycle_status || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Install Type</h3>
                    <p className="text-gray-900">{selectedApp.install_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Application Type</h3>
                    <p className="text-gray-900">{selectedApp.app_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Business Unit</h3>
                    <p className="text-gray-900">{selectedApp.business_unit || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Business Owner</h3>
                    <div className="flex items-center gap-2">
                      {selectedApp.business_owner_profile_picture ? (
                        <img
                          src={`data:image/jpeg;,${selectedApp.business_owner_profile_picture}`}
                          alt={selectedApp.business_owner_name}
                          className="w-7 h-7 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 border">
                          {selectedApp.business_owner_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                        </div>
                      )}
                      <span className="text-gray-900">{selectedApp.business_owner_name || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Business Purpose</h3>
                  <p className="text-gray-900">{selectedApp.business_purpose || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <style jsx>{`
        .animate-fadeIn { animation: fadeIn 0.3s; }
        .animate-fadeInUp { animation: fadeInUp 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
} 