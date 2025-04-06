import React, { useState } from "react";
import {
  Home,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function Navbarrec() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/recuiter/dashboard">
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/30">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-white font-bold text-xl">
                    Skillo
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link href="/home">
                <div className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </div>
              </Link>

              <Link href="/jobsrec">
                <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Jobs
                </div>
              </Link>

              <Link href="/candidates">
                <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Candidates
                </div>
              </Link>

              <Link href="/interviewsrecuiter">
                <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Interviews
                </div>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-md bg-slate-800 text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search candidates..."
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none"
              >
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-700">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-white">
                      Notifications
                    </p>
                  </div>
                  <div className="py-1">
                    <a href="#" className="flex px-4 py-3 hover:bg-slate-700">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          New application
                        </p>
                        <p className="text-xs text-gray-400">
                          John Smith applied for Senior Developer
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          10 minutes ago
                        </p>
                      </div>
                    </a>
                    <a href="#" className="flex px-4 py-3 hover:bg-slate-700">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          Interview scheduled
                        </p>
                        <p className="text-xs text-gray-400">
                          Interview with Emily Chen at 2:00 PM
                        </p>
                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                      </div>
                    </a>
                  </div>
                  <div className="px-4 py-2">
                    <a
                      href="#"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                  SR
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </button>

              {/* Profile Menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-black ring-opacity-5">
                  <a
                    href="/recruiter/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/recruiter/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </div>
                  </a>
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800">
            <Link href="/recruiter/home">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 flex items-center">
                <Home className="mr-3 h-5 w-5" />
                Home
              </div>
            </Link>

            <Link href="/recruiter/jobs">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center">
                <Briefcase className="mr-3 h-5 w-5" />
                Jobs
              </div>
            </Link>

            <Link href="/recruiter/candidates">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center">
                <Users className="mr-3 h-5 w-5" />
                Candidates
              </div>
            </Link>

            <Link href="/recruiter/interviews">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center">
                <Calendar className="mr-3 h-5 w-5" />
                Interviews
              </div>
            </Link>

            <Link href="/recruiter/messages">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center">
                <MessageSquare className="mr-3 h-5 w-5" />
                Messages
              </div>
            </Link>
          </div>

          {/* Mobile profile section */}
          <div className="pt-4 pb-3 border-t border-slate-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                  SR
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  Sarah Robinson
                </div>
                <div className="text-sm font-medium text-gray-400">
                  sarah@talent.co
                </div>
              </div>
              <div className="ml-auto">
                <button className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <a
                href="/recruiter/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                Your Profile
              </a>
              <a
                href="/recruiter/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </a>
              <a
                href="/logout"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
