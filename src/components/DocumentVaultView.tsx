import React, { useState } from 'react';
import {
  FolderLock,
  Upload,
  Download,
  Eye,
  ShieldCheck,
  FileText,
  FileCheck2,
  Trash2,
  CheckCircle2,
  Lock,
  Plus,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { CaseDocument, LegalCase } from '../types/legal';

interface DocumentVaultViewProps {
  documents: CaseDocument[];
  cases: LegalCase[];
  onUploadDocument: (doc: Omit<CaseDocument, 'id' | 'uploadDate'>) => void;
  currentUserRole: string;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  cases,
  onUploadDocument,
  currentUserRole,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [previewDoc, setPreviewDoc] = useState<CaseDocument | null>(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CaseDocument['category']>('قرارداد');
  const [caseId, setCaseId] = useState(cases[0]?.id || '');
  const [fileSize, setFileSize] = useState('۱.۹ مگابایت');

  const filteredDocs = documents.filter((doc) => {
    const matchesQuery = !searchDocQuery.trim() || doc.title.includes(searchDocQuery);
    const matchesCat = selectedCategory === 'همه' || doc.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sha256 = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    onUploadDocument({
      caseId,
      title: title.trim(),
      category,
      fileSize,
      status: 'در انتظار بررسی',
      uploaderRole: currentUserRole as any,
      isEncrypted: true,
      sha256Hash: sha256,
      fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    });

    setShowUploadModal(false);
    setTitle('');
  };

  const categoriesList = ['همه', 'هویتی', 'دادخواست', 'قرارداد', 'سند مالکیت', 'ادله اثبات', 'پروانه وکالت'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <FolderLock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                گاوصندوق امن اسناد و اوراق قضایی (Legal Vault)
              </h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                رمزنگاری AES-256
              </span>
            </div>
            <p className="text-xs text-slate-400">
              بارگذاری امن اسناد مالکیت، دادخواست‌ها، قراردادها و مدارک هویتی با درج هش تغییرناپذیر SHA-256
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>بارگذاری مدرک رمزنگاری‌شده جدید</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchDocQuery}
            onChange={(e) => setSearchDocQuery(e.target.value)}
            placeholder="جستجو در عنوان مدارک..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                  {doc.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === 'تایید شده'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="flex items-start gap-3 mt-3">
                <div className="p-3 rounded-2xl bg-slate-950 text-amber-400 border border-slate-800 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>حجم فایل: {doc.fileSize}</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>

              {/* SHA256 integrity indicator */}
              <div className="mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  SHA-256:
                </span>
                <span className="truncate max-w-[150px]">{doc.sha256Hash}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>مشاهده پیش‌نمایش</span>
              </button>

              <button
                onClick={() => alert(`دانلود سند رسمی رمزگشایی شده: ${doc.title}`)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود امن</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{previewDoc.title}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock document viewer with watermark */}
            <div className="relative aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {previewDoc.fileUrl ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="w-full h-full object-contain opacity-90"
                />
              ) : (
                <div className="text-center text-slate-500 space-y-2">
                  <FileText className="w-16 h-16 mx-auto text-slate-600" />
                  <p className="text-xs">سند متنی اسکن شده با امضای الکترونیک</p>
                </div>
              )}

              {/* Watermark security overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="transform -rotate-45 border-4 border-amber-500/20 px-8 py-3 rounded-2xl text-amber-500/25 font-black text-xl select-none">
                  مستند رسمی سامانه حقوقی دادگستر • غیرقابل جعل
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>کد هش اثر انگشت دیجیتال:</span>
              <span className="font-mono text-cyan-400">{previewDoc.sha256Hash}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>بارگذاری سند جدید در گاوصندوق پرونده</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">عنوان سند یا مدرک:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: اصل سند مالکیت، تصویر چک صیادی، مبایعه‌نامه شماره..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">دسته‌بندی مدرک:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="قرارداد">قرارداد و مبایعه‌نامه</option>
                    <option value="دادخواست">دادخواست و شکواییه</option>
                    <option value="سند مالکیت">سند مالکیت و تک‌برگ</option>
                    <option value="هویتی">مدارک هویتی (شناسنامه / ملی)</option>
                    <option value="ادله اثبات">ادله اثبات و پرینت حساب</option>
                    <option value="پروانه وکالت">پروانه وکالت رسمی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">پرونده هدف:</label>
                  <select
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} ({c.title.slice(0, 20)}...)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Drop Zone Simulation */}
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl p-6 text-center space-y-2 bg-slate-950/60 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-200">فایل را بکشید یا اینجا کلیک کنید</div>
                <div className="text-[10px] text-slate-500">پشتیبانی از PDF، JPG، PNG تا حجم ۵۰ مگابایت</div>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-2 rounded-xl text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>رمزنگاری خودکار با کلید اختصاصی پرونده قبل از ذخیره‌سازی</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  تایید و بارگذاری در گاوصندوق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
