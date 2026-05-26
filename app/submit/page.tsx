'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { getOrCreateSessionId } from '@/lib/session/anonymous';
import { ImageUpload } from '@/components/ImageUpload';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import type { Category } from '@/types/database';

const submissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category_id: z.string().uuid('Select a category'),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories((data as Category[]) || []);
    }
    loadCategories();
  }, [supabase]);

  const onSubmit = async (formData: SubmissionFormData) => {
    setSubmitting(true);
    try {
      let photoUrl: string | null = null;

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const filePath = `submissions/${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('card-photos')
          .upload(filePath, photoFile, { contentType: photoFile.type });

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from('card-photos')
          .getPublicUrl(filePath);
        photoUrl = publicUrl;
      }

      const sessionId = getOrCreateSessionId();

      const { error } = await supabase.from('submissions').insert({
        ...formData,
        phone: formData.phone || null,
        website: formData.website || null,
        photo_url: photoUrl,
        session_id: sessionId,
        status: 'pending',
      });

      if (error) throw error;

      // Notify admin via API route
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });

      setSubmitted(true);
      toast.success('Submission received! An admin will review it shortly.');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-10 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Submission Received!</h2>
          <p className="text-surface-400 mb-6">
            Your business card has been submitted for review. You&apos;ll be added to the directory once approved.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </a>

        <h1 className="text-3xl font-bold text-white mb-2">Submit Your Card</h1>
        <p className="text-surface-400 mb-8">
          Fill out the form below to submit your business card for the directory.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Full Name *</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Job Title *</label>
              <input
                {...register('title')}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="Software Engineer"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Company *</label>
              <input
                {...register('company')}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="Acme Inc."
              />
              {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Email *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Phone</label>
              <input
                {...register('phone')}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Website</label>
              <input
                {...register('website')}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                placeholder="https://johndoe.com"
              />
              {errors.website && <p className="text-red-400 text-xs mt-1">{errors.website.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Category *</label>
              <select
                {...register('category_id')}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-400 text-xs mt-1">{errors.category_id.message}</p>}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Profile Photo (optional)</label>
              <ImageUpload onFileSelect={setPhotoFile} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {submitting ? 'Submitting...' : 'Submit Card'}
          </button>
        </form>
      </div>
    </div>
  );
}
