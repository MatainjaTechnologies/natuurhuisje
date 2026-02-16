"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  Menu,
  Search,
  User as UserIcon,
  Calendar,
  Users,
  X,
  MapPin,
  Home,
  Sparkles,
  Heart,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchDock } from "@/components/SearchDock";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

interface HeaderProps {
  user?: User | null;
}

interface Suggestion {
  id: string;
  name: string;
  type: string;
  icon: string;
}

export function Header({ user }: HeaderProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const lightpickRef = useRef<any>(null);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchDock, setShowSearchDock] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<
    "where" | "dates" | "people" | null
  >(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  // Search suggestions data
  const [suggestions, setSuggestions] = useState<{
    locations: Suggestion[];
    categories: Suggestion[];
  }>({
    locations: [],
    categories: [],
  });
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState<number | null>(null);
  const [pets, setPets] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Desktop search bar (>= 768px)
      if (window.scrollY > 500 && window.innerWidth >= 768) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
        setShowSearchDock(false);
      }

      // Mobile search bar (< 768px)
      if (window.scrollY > 100 && window.innerWidth < 768) {
        setShowMobileSearch(true);
      } else if (window.innerWidth < 768) {
        setShowMobileSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    setActiveSearchTab(null);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll on mobile when activeSearchTab is open
  useEffect(() => {
    if (activeSearchTab && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeSearchTab]);

  // Listen for custom events from SearchDock to open mobile modals
  useEffect(() => {
    const handleOpenHeaderSearch = (event: CustomEvent) => {
      const { tab } = event.detail;
      setActiveSearchTab(tab);
    };

    window.addEventListener('openHeaderSearch', handleOpenHeaderSearch as EventListener);

    return () => {
      window.removeEventListener('openHeaderSearch', handleOpenHeaderSearch as EventListener);
    };
  }, []);

  // Generate calendar months
  const generateCalendarMonths = (startMonth: Date, count: number) => {
    const months = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
      months.push(date);
    }
    return months;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const handleDateClick = (date: Date) => {
    // Prevent selecting dates before today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date < selectedStartDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(date);
      }
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "map-pin":
        return <MapPin className="h-5 w-5 text-gray-600 shrink-0" />;
      case "home":
        return <Home className="h-5 w-5 text-gray-600 shrink-0" />;
      case "sparkles":
        return <Sparkles className="h-5 w-5 text-gray-600 shrink-0" />;
      case "heart":
        return <Heart className="h-5 w-5 text-gray-600 shrink-0" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-600 shrink-0" />;
    }
  };

  return (
    <header className="w-full fixed top-0 z-50">
      {/* Top Banner - Hidden on mobile when scrolled */}
      <div
        className={`w-full bg-white border-b border-gray-200 py-2 transition-all duration-300 ${showMobileSearch ? "hidden md:block" : "block"}`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-center gap-8 text-xs">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Midden in de natuur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Weg van de massa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Draag bij aan natuuprojecten
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hoofd Header */}
      <div className="w-full py-4 bg-white border-b border-black/5 shadow-sm transition-all duration-300">
        <div className="container-custom">
          {/* Mobile Compact Search Bar - Only on mobile when scrolled */}
          {showMobileSearch ? (
            <div className="relative">
              <div className="md:hidden flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm">
                  <button
                    onClick={() => setActiveSearchTab("where")}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <Search className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700 font-medium">Where?</span>
                  </button>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <button
                    onClick={() => setActiveSearchTab("dates")}
                    className="flex items-center gap-1.5 text-sm flex-1"
                  >
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700 text-xs truncate">
                      {selectedStartDate && selectedEndDate
                        ? `${format(selectedStartDate, "MMMM d")} → ${format(selectedEndDate, "MMMM d")}`
                        : selectedStartDate
                          ? `${format(selectedStartDate, "MMMM d")} → ?`
                          : "Kies datums"}
                    </span>
                  </button>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <button
                    onClick={() => setActiveSearchTab("people")}
                    className="flex items-center gap-1.5 text-sm"
                  >
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700">...</span>
                  </button>
                </div>
                <button className="bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-colors flex-shrink-0">
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Where Dropdown */}
              {activeSearchTab == "where" && (
                <div className="fixed bottom-0 left-0 right-0 bg-white z-50 flex flex-col h-[90vh] rounded-t-2xl shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Search where or what
                    </h2>
                    <button
                      onClick={() => setActiveSearchTab(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="p-4 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="For example Amsterdam, Tiny House"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder:text-gray-400"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Suggestions List */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setLocation("Amsterdam (NL)");
                          setActiveSearchTab(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                      >
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Amsterdam (NL)
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setLocation("Veluwe (NL)");
                          setActiveSearchTab(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                      >
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Veluwe (NL)
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setLocation("Belgium");
                          setActiveSearchTab(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                      >
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Belgium
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setLocation("Tiny House");
                          setActiveSearchTab(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                      >
                        <Home className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Tiny House
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setLocation("Wellness");
                          setActiveSearchTab(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                      >
                        <Home className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Wellness
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setLocation("Romantic overnight stays");
                          setActiveSearchTab(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                      >
                        <Heart className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900 font-medium">
                          Romantic overnight stays
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Footer with Next Button */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setActiveSearchTab("dates")}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Dates Dropdown */}
              {activeSearchTab === "dates" && (
                <div className="fixed bottom-0 left-0 right-0 bg-white z-50 flex flex-col h-[90vh] rounded-t-2xl shadow-2xl">
                  {/* Header with nights count and close button */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-900">
                        {selectedStartDate && selectedEndDate
                          ? `${Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24))} nights`
                          : "Select dates"}
                      </h3>
                      {selectedStartDate && selectedEndDate && (
                        <p className="text-sm text-gray-600 mt-1">
                          from {format(selectedStartDate, "EEE d MMM")} to{" "}
                          {format(selectedEndDate, "EEE d MMM")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveSearchTab(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-900" />
                    </button>
                  </div>

                  {/* Calendar Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {generateCalendarMonths(new Date(), 6).map((monthDate, idx) => {
                      const { daysInMonth, startingDayOfWeek } = getDaysInMonth(monthDate);
                      const monthName = format(monthDate, "MMMM yyyy");
                      const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
                      const prevMonthDate = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 0);
                      const prevMonthLastDay = prevMonthDate.getDate();

                      return (
                        <div key={idx} className="mb-8 first:mt-6">
                          {/* Month Title */}
                          <h4 className="text-center font-semibold text-gray-900 mb-4 text-lg">
                            {monthName}
                          </h4>

                          {/* Day Headers */}
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {["mom", "di", "Wed", "do", "Fri", "Sat", "Like this"].map((day) => (
                              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {/* Previous month days */}
                            {Array.from({ length: prevMonthDays }).map((_, i) => (
                              <div
                                key={`prev-${i}`}
                                className="aspect-square flex items-center justify-center text-sm text-gray-400"
                              >
                                {prevMonthLastDay - prevMonthDays + i + 1}
                              </div>
                            ))}

                            {/* Current month days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const isPast = currentDate < today;
                              const inRange = isDateInRange(currentDate);
                              const isStart = selectedStartDate && currentDate.getTime() === selectedStartDate.getTime();
                              const isEnd = selectedEndDate && currentDate.getTime() === selectedEndDate.getTime();

                              return (
                                <button
                                  key={day}
                                  onClick={() => handleDateClick(currentDate)}
                                  disabled={isPast}
                                  className={`aspect-square flex items-center justify-center text-sm font-medium transition-colors
                                    ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                                    ${!isPast && inRange ? "bg-purple-600 text-white" : ""}
                                    ${!isPast && !inRange ? "text-gray-900 hover:bg-purple-50" : ""}
                                    ${isStart ? "rounded-l-full" : ""}
                                    ${isEnd ? "rounded-r-full" : ""}
                                    ${isStart && !selectedEndDate ? "bg-purple-600 text-white rounded-full" : ""}
                                  `}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Show next months button */}
                    <button className="w-full py-4 border-2 border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 transition-colors">
                      Show next months
                    </button>
                  </div>

                  {/* Footer with action buttons */}
                  <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-white">
                    <button
                      onClick={() => {
                        setSelectedStartDate(null);
                        setSelectedEndDate(null);
                      }}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg underline"
                    >
                      Clear dates
                    </button>
                    <button
                      onClick={() => setActiveSearchTab("people")}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold transition-colors text-lg"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* People Dropdown */}
              {activeSearchTab === "people" && (
                <div className="fixed bottom-0 left-0 right-0 bg-white z-50 flex flex-col h-[90vh] rounded-t-2xl shadow-2xl">
                  <div className="">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pt-6 px-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Selecteer aantal personen
                      </h3>
                      <button
                        onClick={() => setActiveSearchTab(null)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    {/* People Options */}
                    <div className="space-y-2 max-h-[65vh] overflow-y-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setGuests(num);
                            setActiveSearchTab(null);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                            guests === num
                              ? "bg-purple-50 border-b-2 border-purple-600"
                              : "hover:bg-gray-50 border-b-2 border-transparent"
                          }`}
                        >
                          <Users className="h-5 w-5 text-gray-600 shrink-0" />
                          <span className="text-gray-900 font-medium">
                            {num} {num === 1 ? "persoon" : "personen"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer with Search Button */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setActiveSearchTab(null)}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Normal Header Layout */}
          <div
            className={`flex justify-between items-center ${showMobileSearch ? "hidden md:flex" : "flex"}`}
          >
            <Logo size="md" />

            {/* Zoekbalk - Wordt getoond bij scrollen */}
            <div
              className={`hidden md:flex items-center transition-all duration-300 ${showSearchBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              {!showSearchDock ? (
                <div className="flex items-center bg-blue-50 rounded-xl overflow-hidden shadow-sm">
                  {/* Waar/Wat Input */}
                  <button
                    onClick={() => {
                      setActiveSearchTab("where");
                      setShowSearchDock(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white rounded-l-xl hover:bg-gray-50 transition-colors"
                  >
                    <Search className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      Waar of wat?
                    </span>
                  </button>

                  {/* Datum Picker */}
                  <button
                    onClick={() => {
                      setActiveSearchTab("dates");
                      setShowSearchDock(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white ml-px hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      Kies datums
                    </span>
                  </button>

                  {/* Gasten */}
                  <button
                    onClick={() => {
                      setActiveSearchTab("people");
                      setShowSearchDock(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white ml-px hover:bg-gray-50 transition-colors"
                  >
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      personen
                    </span>
                  </button>

                  {/* Zoek Knop */}
                  <button
                    onClick={() => setShowSearchDock(true)}
                    className="bg-teal-500 text-white px-6 py-3 rounded-r-xl ml-px flex items-center justify-center hover:bg-teal-600 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-3xl">
                  <SearchDock
                    variant="compact"
                    maxWidth="max-w-3xl"
                    initialTab={activeSearchTab}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/host"
                    className="hidden md:block text-sm btn-outline"
                  >
                    Beheer accommodaties
                  </Link>
                  <Link
                    href="/account"
                    className="p-2 rounded-xl text-white transition-all hover:shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #7B3FA0, #5B2D8E)",
                    }}
                  >
                    <UserIcon className="h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #7B3FA0, #5B2D8E)",
                  }}
                >
                  Inloggen
                </Link>
              )}

              <button className="p-2.5 rounded-xl hover:bg-gray-100 md:hidden transition-colors">
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
