'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { DeleteModal } from '@/components/DeleteModal';
import { CheckCircle, XCircle, Trash2, Clock, Shield } from 'lucide-react';
import type { Submission } from '@/types/database';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);
  const supabase = createClient();

  const fetchSubmissions = useCallback(async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load submissions');
      return;
    }
    setSubmissions((data as Submission[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to ${status} submission`);
      return;
    }

    // If approved, create the card in the cards table
    if (status === 'approved') {
      const submission = submissions.find((s) => s.id === id);
      if (submission) {
        const { error: cardErr } = await supabase.from('cards').insert({
          name: submission.name,
          title: submission.title,
          company: submission.company,
          email: submission.email,
          phone: submission.phone,
          website: submission.website,
          category_id: submission.category_id,
          avatar_seed: submission.name.toLowerCase().replace(/\s+/g, '-'),
          photo_url: submission.photo_url,
        });
        if (cardErr) console.error('Error creating card:', cardErr);
      }
    }

    toast.success(`Submission ${status}!`);
    fetchSubmissions();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      toast.error('Failed to delete submission');
    } else {
      toast.success('Submission deleted permanently');
      fetchSubmissions();
    }
    setDeleteTarget(null);
  };

  const statusCounts = {
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-7 h-7 text-brand-400" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-5 text-center">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{statusCounts.pending}</p>
            <p className="text-xs text-surface-400">Pending</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{statusCounts.approved}</p>
            <p className="text-xs text-surface-400">Approved</p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <XCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{statusCounts.rejected}</p>
            <p className="text-xs text-surface-400">Rejected</p>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-20 text-surface-400">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-surface-400">No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="glass-card rounded-xl p-5 flex items-center gap-4">
                {/* Photo / Avatar */}
                <div className="w-12 h-12 rounded-xl bg-surface-800/50 overflow-hidden flex-shrink-0">
                  {sub.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sub.photo_url} alt={sub.name} className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(sub.name)}`}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{sub.name}</h3>
                  <p className="text-sm text-surface-400 truncate">
                    {sub.title} at {sub.company}
                  </p>
                  <p className="text-xs text-surface-500">{sub.email}</p>
                </div>

                {/* Status badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sub.status === 'pending'
                      ? 'bg-amber-500/15 text-amber-300'
                      : sub.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-red-500/15 text-red-300'
                  }`}
                >
                  {sub.status}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  {sub.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(sub.id, 'approved')}
                        className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, 'rejected')}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setDeleteTarget(sub)}
                    className="p-2 rounded-lg bg-surface-800/50 text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DeleteModal
          isOpen={!!deleteTarget}
          title="Delete Submission"
          description={`This will permanently delete "${deleteTarget?.name}"'s submission. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </div>
  );
}
