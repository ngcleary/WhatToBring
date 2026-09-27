import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from 'common/src/constants.ts';
import { Header } from '../components/Header.tsx';
import { Calendar } from '../components/UI/calendar.tsx';
import { Button } from '../components/UI/Button.tsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/UI/card.tsx';
import {
    Plus,
    FolderOpen,
    Calendar as CalendarIcon,
    MapPin,
    Users,
    CheckSquare,
    Square,
    ChevronLeft,
    ChevronRight,
    Crown,
    ArrowRight,
    Sparkles,
    FilterX,
    Clock,
    Package,
} from 'lucide-react';

interface UserRef {
    id: number;
    username: string;
    displayName: string;
}

interface BringItem {
    id: number;
    name: string;
    count?: number | null;
    description?: string | null;
    assignedToId?: number | null;
    assignedTo?: UserRef | null;
    listName?: string;
    listDate?: string;
}

interface SuggestItem {
    id: number;
    name: string;
    count?: number | null;
    description?: string | null;
    priority?: string | null;
    approved: boolean;
    suggestedById: number;
}

interface EventList {
    id: number;
    name: string;
    description?: string | null;
    location: string;
    eventDate: string;
    ownerId: number;
    owner?: UserRef;
    members?: { id: number; role: string; user: UserRef }[];
    bringItems?: BringItem[];
    suggestItems?: SuggestItem[];
}

interface UserListsResponse {
    userId: number;
    displayName: string;
    username: string;
    ownedLists: EventList[];
    memberLists: EventList[];
    allLists: EventList[];
    myItems: BringItem[];
}

const EVENTS_PER_PAGE = 3;

const Home = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserListsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Selected calendar date filter
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    // Pagination state for active events (strictly max 3 per page)
    const [currentPage, setCurrentPage] = useState<number>(1);
    // Personal pack check status
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_ROUTES.USER + '/lists', {
                    withCredentials: true,
                });
                setUserData(response.data);
            } catch (err) {
                console.error('Failed to fetch user events', err);
                setError('Failed to fetch event data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const toggleItemCheck = (itemId: number) => {
        setCheckedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    if (loading) {
        return (
            <div className="bg-slate-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                    <p className="text-slate-600 font-medium">Loading your events...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Sign In Required</h2>
                    <p className="text-slate-500 mb-6 text-sm">
                        Please log in to manage your events and view what to bring.
                    </p>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full bg-primary hover:opacity-95"
                    >
                        Go to Sign In
                    </Button>
                </div>
            </div>
        );
    }

    // Filter lists based on selected calendar date
    const allLists = userData.allLists || [];
    const filteredLists = selectedDate
        ? allLists.filter((event) => {
              const d = new Date(event.eventDate);
              return (
                  d.getFullYear() === selectedDate.getFullYear() &&
                  d.getMonth() === selectedDate.getMonth() &&
                  d.getDate() === selectedDate.getDate()
              );
          })
        : allLists;

    // Pagination calculations
    const totalFiltered = filteredLists.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / EVENTS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedEvents = filteredLists.slice(
        (safeCurrentPage - 1) * EVENTS_PER_PAGE,
        safeCurrentPage * EVENTS_PER_PAGE
    );

    const clearDateFilter = () => {
        setSelectedDate(undefined);
        setCurrentPage(1);
    };

    return (
        <div className="bg-[#edf2f7] min-h-screen pb-16">
            <Header
                displayName={userData.displayName}
                username={userData.username}
                onCreateEvent={() => alert('Create Event modal will open here')}
                onBrowseTemplates={() => alert('Browse Templates catalog will open here')}
            />

            <main className="pt-[85px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Banner */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome back, {userData.displayName}!
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Coordinate who is bringing what, track your assignments, and organize
                            gatherings.
                        </p>
                    </div>
                </div>

                {/* Main Content Grid: Left Column (Calendar & My Items) | Right Column (Active Events) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Calendar + My Items Checklist (4 cols on lg) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Interactive Calendar Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-primary" />
                                    Event Calendar
                                </h3>
                                {selectedDate && (
                                    <button
                                        onClick={clearDateFilter}
                                        className="text-[11px] text-accent hover:underline flex items-center gap-1 font-medium"
                                    >
                                        <FilterX className="w-3 h-3" />
                                        Clear filter
                                    </button>
                                )}
                            </div>

                            <Calendar
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setCurrentPage(1);
                                }}
                                className="w-full"
                            />

                            {selectedDate && (
                                <div className="mt-3 p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-medium flex items-center justify-between">
                                    <span>
                                        Showing events on:{' '}
                                        {selectedDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span className="font-bold">({totalFiltered})</span>
                                </div>
                            )}
                        </div>

                        {/* My Items Checklist Card */}
                        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200/80">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-accent" />
                                        My Items Checklist
                                    </CardTitle>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                                        {userData.myItems?.length || 0}
                                    </span>
                                </div>
                                <CardDescription className="text-xs">
                                    Items you are responsible for bringing across all events.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {userData.myItems && userData.myItems.length > 0 ? (
                                    <ul className="divide-y divide-slate-100 text-xs">
                                        {userData.myItems.map((item) => {
                                            const isChecked = !!checkedItems[item.id];
                                            return (
                                                <li
                                                    key={item.id}
                                                    onClick={() => toggleItemCheck(item.id)}
                                                    className="py-2.5 flex items-start gap-2.5 cursor-pointer group hover:bg-slate-50/80 rounded-lg px-1.5 transition-colors"
                                                >
                                                    <button
                                                        type="button"
                                                        aria-label="Toggle pack status"
                                                        className="mt-0.5 text-slate-400 group-hover:text-primary transition-colors shrink-0"
                                                    >
                                                        {isChecked ? (
                                                            <CheckSquare className="w-4 h-4 text-primary" />
                                                        ) : (
                                                            <Square className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className={`font-semibold text-slate-800 truncate ${
                                                                    isChecked
                                                                        ? 'line-through text-slate-400'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {item.name}
                                                                {item.count
                                                                    ? ` (${item.count})`
                                                                    : ''}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                                {item.listName}
                                                            </span>
                                                        </div>
                                                        {item.description && (
                                                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="text-center py-6 text-slate-400">
                                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-xs font-medium">
                                            No items assigned yet.
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Claim items from any event's suggestions list!
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Paginated Upcoming & Active Events Feed (8 cols on lg) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Feed Header with See All Events and Pagination controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Upcoming & Active Events
                                </h2>
                                <p className="text-xs text-slate-500">
                                    {totalFiltered > 0
                                        ? `Showing ${(safeCurrentPage - 1) * EVENTS_PER_PAGE + 1} - ${Math.min(
                                              safeCurrentPage * EVENTS_PER_PAGE,
                                              totalFiltered
                                          )} of ${totalFiltered} events`
                                        : 'No events to display'}
                                </p>
                            </div>

                            {/* Right-justified: See All Events button + Pagination Controls */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <button
                                    type="button"
                                    onClick={clearDateFilter}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 shadow-sm"
                                >
                                    <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                                    <span>See All Events ({allLists.length})</span>
                                </button>

                                {/* Pagination Buttons (Prev / Next) */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={safeCurrentPage <= 1}
                                            onClick={() =>
                                                setCurrentPage((p) => Math.max(1, p - 1))
                                            }
                                            className="h-8 px-2.5 text-xs flex items-center gap-1 border-slate-300"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                            Prev
                                        </Button>
                                        <span className="text-xs font-semibold text-slate-600 px-1">
                                            {safeCurrentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={safeCurrentPage >= totalPages}
                                            onClick={() =>
                                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                                            }
                                            className="h-8 px-2.5 text-xs flex items-center gap-1 border-slate-300"
                                        >
                                            Next
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Paginated Cards Container (strictly max 3 events per page) */}
                        <div className="flex flex-col gap-4">
                            {paginatedEvents.length > 0 ? (
                                paginatedEvents.map((event) => {
                                    const isHost = event.ownerId === userData.userId;
                                    const eventDate = new Date(event.eventDate);
                                    const formattedDate = eventDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    });

                                    // Item progress calculation
                                    const bringItems = event.bringItems || [];
                                    const totalItemsCount = bringItems.length;
                                    const claimedItemsCount = bringItems.filter(
                                        (i) => !!i.assignedToId
                                    ).length;
                                    const progressPercent =
                                        totalItemsCount > 0
                                            ? Math.round(
                                                  (claimedItemsCount / totalItemsCount) * 100
                                              )
                                            : 0;

                                    // Check user's assigned item in this event
                                    const userItemsInEvent = bringItems.filter(
                                        (i) => i.assignedToId === userData.userId
                                    );

                                    return (
                                        <Card
                                            key={event.id}
                                            className="bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow overflow-hidden"
                                        >
                                            <CardContent className="p-5 sm:p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer">
                                                                {event.name}
                                                            </h3>
                                                            {isHost ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                                                    <Crown className="w-3 h-3" />
                                                                    HOST
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                                    <Users className="w-3 h-3" />
                                                                    GUEST
                                                                </span>
                                                            )}
                                                        </div>

                                                        {event.description && (
                                                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                                                {event.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Date & Location */}
                                                    <div className="text-left sm:text-right shrink-0">
                                                        <div className="flex items-center gap-1 sm:justify-end text-xs font-semibold text-slate-800">
                                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                                            {formattedDate}
                                                        </div>
                                                        <div className="flex items-center gap-1 sm:justify-end text-xs text-slate-500 mt-0.5">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Meta Info Row: Guest count & Progress Bar */}
                                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                                    <div className="flex items-center gap-4 text-slate-600">
                                                        <span className="flex items-center gap-1.5">
                                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                                            {event.members?.length || 0} Guests
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            Host:{' '}
                                                            <strong className="text-slate-800">
                                                                {event.owner?.displayName ||
                                                                    'Organizer'}
                                                            </strong>
                                                        </span>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="w-full sm:w-48">
                                                        <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                                                            <span>Items Claimed</span>
                                                            <span className="font-semibold text-primary">
                                                                {claimedItemsCount}/
                                                                {totalItemsCount} ({progressPercent}
                                                                %)
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-primary h-full rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${progressPercent}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* What You're Bringing & Action Buttons */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                                                    <div className="text-xs">
                                                        <span className="text-slate-400 font-medium">
                                                            You're Bringing:{' '}
                                                        </span>
                                                        {userItemsInEvent.length > 0 ? (
                                                            <span className="font-bold text-slate-800 bg-amber-50 text-accent px-2 py-0.5 rounded border border-amber-200/60 inline-flex items-center gap-1">
                                                                <Package className="w-3 h-3" />
                                                                {userItemsInEvent
                                                                    .map(
                                                                        (i) =>
                                                                            `${i.name}${i.count ? ` (${i.count})` : ''}`
                                                                    )
                                                                    .join(', ')}
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-700 italic font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                                                                No item assigned — claim one!
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {isHost && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    alert(
                                                                        `Invite guests modal for ${event.name}`
                                                                    )
                                                                }
                                                                className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
                                                            >
                                                                + Invite Guests
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                alert(
                                                                    `Opening event ${event.name} details (Coming in next step!)`
                                                                )
                                                            }
                                                            className="bg-primary hover:opacity-95 text-white text-xs flex items-center gap-1.5 shadow-sm"
                                                        >
                                                            See Event Details
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-sm">
                                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-700 text-sm">
                                        No Events Found
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                        {selectedDate
                                            ? 'There are no events scheduled on this selected date. Try choosing another day or clearing the filter.'
                                            : "You don't have any upcoming events yet. Create your first event to get started!"}
                                    </p>
                                    {selectedDate && (
                                        <Button
                                            onClick={clearDateFilter}
                                            variant="outline"
                                            size="sm"
                                            className="mt-4 text-xs"
                                        >
                                            View All Upcoming Events
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bottom Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-slate-500">
                                    Page {safeCurrentPage} of {totalPages}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={safeCurrentPage <= 1}
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className="h-8 px-3 text-xs border-slate-300"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={safeCurrentPage >= totalPages}
                                        onClick={() =>
                                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                                        }
                                        className="h-8 px-3 text-xs border-slate-300"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
