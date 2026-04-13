'use client';

import { useState, useRef } from 'react';
import { countries } from '@/lib/countries';
import { getDocumentOptions, type DocumentOption, type DocumentType } from '@/lib/verification-config';
import { Upload, Loader2, X, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, ShieldCheck, Camera, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationFormProps {
  onSuccess: () => void;
  apiEndpoint?: string;
}

type UploadedFiles = {
  documentFront: string;
  documentBack: string;
  selfie: string;
};

const STEPS = ['Country', 'Document', 'Upload', 'Submit'] as const;

export default function VerificationForm({ onSuccess, apiEndpoint = '/api/developer/verification' }: VerificationFormProps) {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [docType, setDocType] = useState<DocumentType | null>(null);
  const [files, setFiles] = useState<UploadedFiles>({ documentFront: '', documentBack: '', selfie: '' });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const frontRef  = useRef<HTMLInputElement>(null);
  const backRef   = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const docOptions = country ? getDocumentOptions(country) : [];
  const selectedDoc: DocumentOption | null = docType ? (docOptions.find(d => d.type === docType) ?? null) : null;
  const filteredCountries = countries.filter(c =>
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.value.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // ── File upload helper ───────────────────────────────────────────────────
  const uploadFile = async (key: keyof UploadedFiles, file: File) => {
    setUploading(p => ({ ...p, [key]: true }));
    setUploadErrors(p => ({ ...p, [key]: '' }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'verification');
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFiles(p => ({ ...p, [key]: data.url }));
    } catch (err) {
      setUploadErrors(p => ({ ...p, [key]: err instanceof Error ? err.message : 'Upload failed' }));
    } finally {
      setUploading(p => ({ ...p, [key]: false }));
    }
  };

  const handleFileChange = (key: keyof UploadedFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(key, file);
    e.target.value = '';
  };

  // ── Step validation ──────────────────────────────────────────────────────
  const canNext = () => {
    if (step === 0) return !!country;
    if (step === 1) return !!docType;
    if (step === 2) {
      if (!files.documentFront || !files.selfie) return false;
      if (selectedDoc?.requiresBack && !files.documentBack) return false;
      return true;
    }
    return true;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          documentType: docType,
          documentFrontUrl: files.documentFront,
          documentBackUrl:  files.documentBack || null,
          selfieUrl:        files.selfie,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const countryLabel = countries.find(c => c.value === country)?.label ?? '';

  // ── Shared upload zone ───────────────────────────────────────────────────
  function UploadZone({
    label, hint, fileKey, inputRef,
  }: {
    label: string;
    hint: string;
    fileKey: keyof UploadedFiles;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) {
    const url   = files[fileKey];
    const busy  = uploading[fileKey];
    const err   = uploadErrors[fileKey];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
          {url && (
            <button type="button" onClick={() => setFiles(p => ({ ...p, [fileKey]: '' }))}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-0.5">
              <X className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">{hint}</p>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={handleFileChange(fileKey)} />
        {url ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 bg-slate-50">
            <img src={url} alt={label} className="w-full h-full object-cover" />
            <button type="button" onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold hover:bg-black/80 transition-colors">
              <Upload className="w-3 h-3" /> Replace
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className={cn(
              'w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors disabled:opacity-60',
              err ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
            )}>
            {busy
              ? <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              : <Upload className="w-5 h-5 text-slate-400" />}
            <span className="text-[10px] font-semibold text-slate-500">
              {busy ? 'Uploading…' : 'Click to upload · JPEG, PNG, WebP · max 5 MB'}
            </span>
          </button>
        )}
        {err && (
          <p className="flex items-center gap-1 text-xs text-red-500 font-semibold">
            <AlertCircle className="w-3 h-3" />{err}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors shrink-0',
              i < step  ? 'bg-slate-900 text-white' :
              i === step ? 'bg-slate-900 text-white ring-4 ring-slate-200' :
                           'bg-slate-100 text-slate-400'
            )}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn('text-xs font-bold hidden sm:block', i === step ? 'text-slate-900' : 'text-slate-400')}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className={cn('flex-1 h-px', i < step ? 'bg-slate-900' : 'bg-slate-200')} />}
          </div>
        ))}
      </div>

      {/* ── Step 0: Country ── */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Where are you based?</h3>
            <p className="text-sm text-slate-500">Your location determines which ID documents we can accept.</p>
          </div>
          <input
            type="text"
            placeholder="Search country…"
            value={countrySearch}
            onChange={e => setCountrySearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredCountries.map(c => (
              <button key={c.value} type="button"
                onClick={() => { setCountry(c.value); setDocType(null); }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold text-left transition-all',
                  country === c.value
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                )}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 1: Document type ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Choose your ID document</h3>
            <p className="text-sm text-slate-500">Select the document you will use to verify your identity.</p>
          </div>
          <div className="space-y-3">
            {docOptions.map(opt => (
              <button key={opt.type} type="button"
                onClick={() => setDocType(opt.type)}
                className={cn(
                  'w-full flex items-start gap-4 p-5 rounded-2xl border text-left transition-all',
                  docType === opt.type
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                )}>
                <FileText className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-sm">{opt.label}</p>
                  <p className={cn('text-xs mt-0.5', docType === opt.type ? 'text-white/70' : 'text-slate-500')}>
                    {opt.description}
                  </p>
                  {opt.requiresBack && (
                    <p className={cn('text-[10px] font-bold mt-1 uppercase tracking-wider', docType === opt.type ? 'text-white/60' : 'text-slate-400')}>
                      Requires front + back + selfie
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Upload ── */}
      {step === 2 && selectedDoc && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Upload your documents</h3>
            <p className="text-sm text-slate-500">
              All uploads are encrypted and only viewed by our verification team.
            </p>
          </div>

          <UploadZone label="Document — front" hint={selectedDoc.frontHint}
            fileKey="documentFront" inputRef={frontRef} />

          {selectedDoc.requiresBack && (
            <UploadZone label="Document — back" hint={selectedDoc.backHint!}
              fileKey="documentBack" inputRef={backRef} />
          )}

          <UploadZone
            label="Selfie with document"
            hint="Take a clear photo of yourself holding the document next to your face. Make sure both your face and the document text are clearly visible."
            fileKey="selfie"
            inputRef={selfieRef}
          />

          {/* Tips */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Photo tips
            </p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
              <li>Ensure good lighting — no shadows or glare on the document</li>
              <li>All four corners of the document must be visible</li>
              <li>Text must be sharp and readable</li>
              <li>No black-and-white or filtered photos</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & submit ── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Review & submit</h3>
            <p className="text-sm text-slate-500">Check the details below before submitting.</p>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
            {[
              { label: 'Country',   value: countryLabel },
              { label: 'Document',  value: selectedDoc?.label ?? '' },
              { label: 'Front uploaded',  value: files.documentFront ? '✓' : '—' },
              ...(selectedDoc?.requiresBack ? [{ label: 'Back uploaded', value: files.documentBack ? '✓' : '—' }] : []),
              { label: 'Selfie uploaded',  value: files.selfie ? '✓' : '—' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3 bg-white">
                <span className="text-xs font-bold text-slate-500">{row.label}</span>
                <span className="text-xs font-black text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Privacy notice */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Your documents are encrypted in transit and at rest. They are only accessed by authorised
              Webbidev staff for the purpose of identity verification and are not shared with third parties.
              Verification typically completes within 1–2 business days.
            </p>
          </div>

          {submitError && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />{submitError}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:pointer-events-none">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < 3 ? (
          <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-40 disabled:pointer-events-none">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors disabled:opacity-50">
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              : <><ShieldCheck className="w-4 h-4" /> Submit for Review</>}
          </button>
        )}
      </div>
    </div>
  );
}
