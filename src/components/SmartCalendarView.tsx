import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Bell,
  Scale,
  Video,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck,
} from 'lucide-react';
import { CalendarEvent, LegalCase } from '../types/legal';

interface SmartCalendarViewProps {
  events: CalendarEvent[];
  cases: LegalCase[];
  onAddEvent: (newEvent: Omit<CalendarEvent, 'id' | 'isCompleted'>) => void;
  onToggleComplete: (eventId: string) => void;
  currentUserRole: string;
}

export const SmartCalendarView: React.FC<SmartCalendarViewProps> = ({
  events,
  cases,
  onAddEvent,
  onToggleComplete,
  currentUserRole,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('۱۴۰۳/۰۸/۲۸');
  const [newTime, setNewTime] = useState('۰۹:۳۰');
  const [newType, setNewType] = useState<CalendarEvent['type']>('جلسه دادگاه');
  const [newLocation, setNewLocation] = useState('مجتمع قضایی شهید بهشتی، شعبه ۱۰۵');
  const [selectedCaseNumber, setSelectedCaseNumber] = useState(cases[0]?.caseNumber || '');
  const [reminderMinutes, setReminderMinutes] = useState(1440);
  const [newNotes, setNewNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddEvent({
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      type: newType,
      location: newLocation,
      caseNumber: selectedCaseNumber,
      reminderMinutesBefore: reminderMinutes,
      notes: newNotes,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewNotes('');
  };

  const getEventTypeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'جلسه دادگاه':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: Scale,
        };
      case 'مهلت تجدیدنظر':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
        };
      case 'مشاوره آنلاین':
        return {
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          icon: Video,
        };
      case 'تحویل لایحه':
        return {
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
          icon: FileCheck,
        };
    }
  };

  // Mock Shamsi month calendar days
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              تقویم هوشمند اوقات دادرسی، جلسات دادگاه و مواعد قانونی
            </h2>
            <p className="text-xs text-slate-400">
              مدیریت هوشمند مهلت ۲۰ روزه تجدیدنظرخواهی، واخواهی، نظارت کارشناسی و هشدار پیامکی
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت جلسه یا موعد قانونی جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shamsi Month View */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">آبان ماه ۱۴۰۳</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                ماه جاری
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 pb-2">
            <div>ش</div>
            <div>ی</div>
            <div>د</div>
            <div>س</div>
            <div>چ</div>
            <div>پ</div>
            <div className="text-rose-400">ج</div>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const formattedDate = `۱۴۰۳/۰۸/${day.toString().padStart(2, '۰')}`;
              const dayEvents = events.filter((e) => e.date.includes(String(day)));
              const isToday = day === 15;

              return (
                <div
                  key={day}
                  className={`min-h-[75px] p-1.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      {day.toLocaleString('fa-IR')}
                    </span>
                    {day % 7 === 0 && <span className="text-[9px] text-rose-500">جمعه</span>}
                  </div>

                  <div className="space-y-1 my-1">
                    {dayEvents.map((ev) => {
                      const style = getEventTypeStyle(ev.type);
                      return (
                        <div
                          key={ev.id}
                          className={`text-[9px] truncate px-1 py-0.5 rounded border ${style.bg}`}
                          title={`${ev.time} - ${ev.title}`}
                        >
                          {ev.time} {ev.title.slice(0, 14)}...
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Court & Legal Deadlines List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                جلسات دادگاه و اوقات نظارت پیش‌رو:
              </h3>
              <span className="text-xs text-amber-400 font-bold">{events.length} موعد ثبت شده</span>
            </div>

            <div className="space-y-3">
              {events.map((ev) => {
                const style = getEventTypeStyle(ev.type);
                const Icon = style.icon;

                return (
                  <div
                    key={ev.id}
                    className={`bg-slate-950/80 border rounded-2xl p-4 space-y-2 transition-all ${
                      ev.isCompleted ? 'border-slate-800/50 opacity-60' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${style.bg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${ev.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {ev.title}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full border ${style.bg}`}>
                            {ev.type}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleComplete(ev.id)}
                        className={`text-xs p-1 rounded-lg transition-colors cursor-pointer ${
                          ev.isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="تغییر وضعیت انجام"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>تاریخ: {ev.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ساعت: {ev.time}</span>
                      </div>
                    </div>

                    {ev.location && (
                      <div className="text-[11px] text-slate-400 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{ev.location}</span>
                      </div>
                    )}

                    {ev.notes && (
                      <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-xl border border-slate-800">
                        {ev.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Court Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span>ثبت جلسه دادگاه یا مهلت قانونی جدید</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">عنوان جلسه / موعد قانونی:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: جلسه رسیدگی شعبه ۱۰۵، یا مهلت تجدیدنظرخواهی"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">نوع رویداد:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="جلسه دادگاه">جلسه دادگاه</option>
                    <option value="مهلت تجدیدنظر">مهلت قانونی تجدیدنظر / واخواهی</option>
                    <option value="مشاوره آنلاین">مشاوره آنلاین با وکیل</option>
                    <option value="تحویل لایحه">تحویل لایحه یا اسناد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">پرونده مربوطه:</label>
                  <select
                    value={selectedCaseNumber}
                    onChange={(e) => setSelectedCaseNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.caseNumber}>
                        {c.caseNumber} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">تاریخ (شمسی):</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">ساعت حضور:</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">نشانی مجتمع قضایی / شعبه:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="مثال: مجتمع شهید بهشتی، طبقه سوم، شعبه ۱۰۵"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">یادآوری خودکار پیامکی:</label>
                <select
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value={120}>۲ ساعت قبل از جلسه</option>
                  <option value={1440}>۲۴ ساعت (یک روز) قبل از جلسه</option>
                  <option value={2880}>۴۸ ساعت (دو روز) قبل از جلسه</option>
                  <option value={7200}>۵ روز قبل (برای مواعد قانونی)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">توضیحات و مدارک همراه:</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="مدارکی که باید همراه داشته باشید یا نکاتی که وکیل تاکید کرده..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  افزودن و فعال‌سازی یادآور پیامکی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
