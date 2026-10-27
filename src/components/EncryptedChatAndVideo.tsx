import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  ShieldCheck,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MonitorUp,
  Paperclip,
  Send,
  FileText,
  User,
  KeyRound,
  FileCheck2,
  Clock,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import { ChatMessage, User as UserType, Lawyer } from '../types/legal';

interface EncryptedChatAndVideoProps {
  currentUser: UserType;
  lawyers: Lawyer[];
  initialLawyerId?: string | null;
  autoStartCall?: boolean;
}

export const EncryptedChatAndVideo: React.FC<EncryptedChatAndVideoProps> = ({
  currentUser,
  lawyers,
  initialLawyerId,
  autoStartCall = false,
}) => {
  const [selectedLawyerId, setSelectedLawyerId] = useState(initialLawyerId || lawyers[0]?.id || 'lawyer-1');
  const [isVideoCallActive, setIsVideoCallActive] = useState(autoStartCall);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [lawyerNotes, setLawyerNotes] = useState('نکات جلسه: بررسی ماده ۲۱۹ قانون مدنی و ارسال اظهارنامه رسمی تا تاریخ چهارشنبه.');
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (initialLawyerId) {
      setSelectedLawyerId(initialLawyerId);
    }
    if (autoStartCall) {
      setIsVideoCallActive(true);
    }
  }, [initialLawyerId, autoStartCall]);

  const activeLawyer = lawyers.find((l) => l.id === selectedLawyerId) || lawyers[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      senderId: activeLawyer.id,
      senderName: activeLawyer.name,
      senderRole: 'lawyer',
      text: 'سلام و وقت بخیر جناب رضایی. اسناد ارسالی شما در خصوص مبایعه‌نامه بررسی شد. شرایط فسخ به نفع شماست.',
      timestamp: '۱۰:۱۴',
      isEncrypted: true,
    },
    {
      id: 'm-2',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'client',
      text: 'سلام خانم دکتر تهرانی، ممنونم. آیا نیازی هست گواهی عدم حضور دفترخانه را هم دوباره آپلود کنم؟',
      timestamp: '۱۰:۱۶',
      isEncrypted: true,
    },
    {
      id: 'm-3',
      senderId: activeLawyer.id,
      senderName: activeLawyer.name,
      senderRole: 'lawyer',
      text: 'بله حتماً، نسخه اسکن شده را ارسال فرمایید تا لایحه اعتراضیه کارشناسی را تنظیم نماییم.',
      timestamp: '۱۰:۱۸',
      isEncrypted: true,
      attachment: {
        name: 'پیش‌نویس_لایحه_دفاعیه_شعبه_۱۰۵.pdf',
        size: '۱.۸ مگابایت',
        type: 'application/pdf',
      },
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let timer: any;
    if (isVideoCallActive) {
      timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isVideoCallActive]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulated lawyer auto-reply after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: activeLawyer.id,
        senderName: activeLawyer.name,
        senderRole: 'lawyer',
        text: 'پیام محرمانه شما دریافت شد. در حال مطابقت با آیین دادرسی مدنی هستم.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        isEncrypted: true,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleAttachMockDoc = () => {
    const attachMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: 'تصویر مدارک الحاقی با هش رمزنگاری شده آپلود گردید.',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      attachment: {
        name: 'مبایعه_نامه_پلاک_۱۲۴۸_مصدق.pdf',
        size: '۲.۴ مگابایت',
        type: 'application/pdf',
      },
    };
    setMessages((prev) => [...prev, attachMsg]);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Encryption Security Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                چت آنلاین و مشاوره تصویری امن دادگستر
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                رمزنگاری E2EE فعال
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              کلید عمومی هش شده: <span className="font-mono text-cyan-400">SHA256: 4f8b9e...2a10</span> (مکالمات صرفاً میان موکل و وکیل قابل رمزگشایی است)
            </p>
          </div>
        </div>

        {/* Lawyer Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">طرف گفتگو:</span>
          <select
            value={selectedLawyerId}
            onChange={(e) => setSelectedLawyerId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {lawyers.map((l) => (
              <option key={l.id} value={l.id} className="bg-slate-900">
                {l.name} ({l.barAssociation.split('(')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interaction Area: Video Mode vs Text Mode */}
      {isVideoCallActive ? (
        /* Video Consultation Room Screen */
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white">اتاق مشاوره تصویری محرمانه</h3>
                <p className="text-xs text-slate-400">در حال مکالمه تصویری با {activeLawyer.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatTimer(callDuration)}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg">
                کیفیت HD 1080p
              </span>
            </div>
          </div>

          {/* Video Frames Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lawyer Video Feed */}
            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-xl group">
              <img
                src={activeLawyer.avatar}
                alt={activeLawyer.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200">{activeLawyer.name} (وکیل)</span>
              </div>

              {/* Encryption badge overlay */}
              <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-[10px] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>E2EE Audio/Video</span>
              </div>
            </div>

            {/* Client (Self) Video Feed */}
            <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-xl">
              {!isCameraOff ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <VideoOff className="w-10 h-10" />
                  <span className="text-xs">دوربین شما خاموش است</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-slate-200">{currentUser.name} (شما)</span>
              </div>

              {isMicMuted && (
                <div className="absolute top-4 left-4 bg-rose-500/80 text-white px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1">
                  <MicOff className="w-3 h-3" />
                  <span>میکروفون قطع است</span>
                </div>
              )}
            </div>
          </div>

          {/* In-Call Lawyer Notes pad */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                یادداشت‌ها و تکالیف حقوقی جلسه (توسط وکیل):
              </span>
              <button
                onClick={() => alert('متن صورت‌جلسه مشاوره کپی شد.')}
                className="text-cyan-400 hover:underline cursor-pointer text-[11px]"
              >
                کپی صورت‌جلسه
              </button>
            </div>
            <textarea
              rows={2}
              value={lawyerNotes}
              onChange={(e) => setLawyerNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                isMicMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isMicMuted ? 'وصل میکروفون' : 'قطع میکروفون'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                isCameraOff
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isCameraOff ? 'روشن کردن دوربین' : 'خاموش کردن دوربین'}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                isScreenSharing
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="اشتراک‌گذاری صفحه و اسناد"
            >
              <MonitorUp className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsVideoCallActive(false)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-rose-600/25 transition-all cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>پایان مشاوره تصویری</span>
            </button>
          </div>
        </div>
      ) : (
        /* Text Chat Area */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Pane */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeLawyer.avatar}
                  alt={activeLawyer.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-amber-500/50"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{activeLawyer.name}</span>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    آنلاین در سامانه دادگستر
                  </span>
                </div>
              </div>

              {/* Start Video Call CTA */}
              <button
                onClick={() => setIsVideoCallActive(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>شروع مشاوره تصویری امن</span>
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="text-center my-2">
                <span className="text-[10px] bg-slate-950/80 text-slate-400 px-3 py-1 rounded-full border border-slate-800">
                  مکالمات این نشست حقوقی با پروتکل ۲۵۶ بیتی رمزنگاری شده است
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.attachment && (
                        <div
                          className={`mt-2.5 pt-2 border-t flex items-center justify-between gap-3 text-xs ${
                            isMe ? 'border-slate-950/20' : 'border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <div>
                              <div className="font-bold line-clamp-1">{msg.attachment.name}</div>
                              <div className="text-[10px] opacity-80">{msg.attachment.size}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`دانلود سند رمزنگاری‌شده: ${msg.attachment?.name}`)}
                            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 cursor-pointer"
                            title="دانلود مدرک"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAttachMockDoc}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                title="پیوست سند یا مدرک جدید به پرونده"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="پیام یا شرح واقعه را بنویسید (رمزنگاری خودکار)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </div>

          {/* Right Column: Confidentiality & Lawyer Card Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                مشخصات وکیل منتخب برای این جلسه:
              </h3>

              <div className="flex items-center gap-3">
                <img
                  src={activeLawyer.avatar}
                  alt={activeLawyer.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500/60"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{activeLawyer.name}</h4>
                  <p className="text-xs text-amber-400">{activeLawyer.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{activeLawyer.barAssociation}</p>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">شماره پروانه وکالت:</span>
                  <span className="font-mono text-amber-300 font-bold">{activeLawyer.licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">تلفن دفتر وکالت:</span>
                  <span className="font-mono text-slate-300">{activeLawyer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">آدرس دفتر:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{activeLawyer.city}</span>
                </div>
              </div>

              {/* Security Details */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="text-slate-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>تعهدنامه رازداری حرفه‌ای:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  طبق ماده ۶۴۸ قانون مجازات اسلامی و آیین‌نامه کانون وکلای دادگستری، اطلاعات این نشست محرمانه بوده و تخطی از آن واجد مسئولیت انتظامی و کیفری است.
                </p>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => setIsVideoCallActive(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>ورود به اتاق جلسه تصویری</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
