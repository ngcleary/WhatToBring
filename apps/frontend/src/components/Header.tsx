import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Bell,
    User,
    LogOut,
    CheckCircle,
    Calendar,
    Sparkles,
    Plus,
    FolderOpen,
} from 'lucide-react';
import axios from 'axios';
import { API_ROUTES } from 'common/src/constants.ts';

interface HeaderProps {
    displayName?: string;
    username?: string;
    notificationCount?: number;
    onCreateEvent?: () => void;
    onBrowseTemplates?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    displayName = 'Guest',
    username = '',
    notificationCount = 2,
    onCreateEvent,
    onBrowseTemplates,
}) => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post(API_ROUTES.LOGIN + '/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            navigate('/');
        }
    };

    return (
        <header className="h-[65px] fixed top-0 left-0 right-0 bg-primary text-primary-foreground flex items-center justify-between px-6 shadow-md z-50">
            {/* Left-justified Brand */}
            <div className="flex items-center gap-4">
                <Link
                    to="/home"
                    className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
                >
                    WhatToBring
                </Link>
            </div>

            {/* Right-justified Header Actions: Create Event, Templates, Bell, Profile */}
            <div className="flex items-center gap-3">
                {/* Create Event Button */}
                <button
                    type="button"
                    onClick={onCreateEvent || (() => alert('Create Event modal will open here'))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-primary hover:bg-slate-100 rounded-lg shadow-sm transition-all focus:outline-none"
                >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Create New Event</span>
                </button>

                {/* Browse Templates Button */}
                <button
                    type="button"
                    onClick={
                        onBrowseTemplates ||
                        (() => alert('Browse Templates catalog will open here'))
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent text-white hover:opacity-95 rounded-lg shadow-sm transition-all focus:outline-none"
                >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Browse Templates</span>
                </button>

                <div className="h-5 w-[1px] bg-white/25 mx-1" />
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        type="button"
                        aria-label="Notifications"
                        onClick={() => {
                            setIsNotificationOpen(!isNotificationOpen);
                            setIsProfileOpen(false);
                        }}
                        className="relative p-2 rounded-full hover:bg-black/15 transition-colors focus:outline-none"
                    >
                        <Bell className="w-5 h-5 text-white" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white text-gray-800 shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in">
                            <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-900">
                                    Notifications
                                </span>
                                <span className="text-xs text-primary font-medium">
                                    {notificationCount} new
                                </span>
                            </div>
                            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 text-xs">
                                <div className="p-3 hover:bg-gray-50 flex items-start gap-2.5">
                                    <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Camping Trip is coming up!
                                        </p>
                                        <p className="text-gray-500 text-[11px]">
                                            Don't forget you're bringing: Tent
                                        </p>
                                    </div>
                                </div>
                                <div className="p-3 hover:bg-gray-50 flex items-start gap-2.5">
                                    <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            New suggestion on Friends-giving
                                        </p>
                                        <p className="text-gray-500 text-[11px]">
                                            Check out items to claim.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Icon & Menu */}
                <div className="relative">
                    <button
                        type="button"
                        aria-label="User Profile"
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsNotificationOpen(false);
                        }}
                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-black/15 transition-colors focus:outline-none"
                    >
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30 font-semibold text-sm">
                            {displayName ? (
                                displayName.charAt(0).toUpperCase()
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-gray-800 shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {displayName}
                                </p>
                                {username && (
                                    <p className="text-xs text-gray-500 truncate">@{username}</p>
                                )}
                            </div>
                            <div className="py-1">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
