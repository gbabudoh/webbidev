'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Typography, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Eye,
  Filter,
} from 'lucide-react';

interface Dispute {
  id: string;
  projectId: string;
  project: {
    id: string;
    title: string;
  };
  milestoneId: string;
  milestone: {
    id: string;
    title: string;
  };
  clientId: string;
  client: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  developerId: string;
  developer: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  reviewerId?: string | null;
  reviewer?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED_DEVELOPER_WINS' | 'RESOLVED_CLIENT_WINS' | 'CLOSED';
  clientStatement?: string | null;
  clientEvidence?: string[];
  developerStatement?: string | null;
  developerEvidence?: string[];
  reviewerDecision?: string | null;
  reviewerDecisionAt?: string | null;
  resolvedInFavorOf?: string | null;
  openedAt: string;
  inReviewAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [resolutionText, setResolutionText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/disputes');
      if (!response.ok) {
        throw new Error('Failed to fetch disputes');
      }

      const data = await response.json();
      setDisputes(data.disputes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId: string, resolution: string, favorOf: 'CLIENT' | 'DEVELOPER') => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution, favorOf }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve dispute');
      }

      await fetchDisputes();
      setSelectedDispute(null);
      setResolutionText('');
    } catch (err: any) {
      setError(err.message || 'Failed to resolve dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDispute = async (disputeId: string, reason: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/disputes/${disputeId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject dispute');
      }

      await fetchDisputes();
      setSelectedDispute(null);
      setResolutionText('');
    } catch (err: any) {
      setError(err.message || 'Failed to reject dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertTriangle className="w-4 h-4" />;
      case 'IN_REVIEW':
        return <Eye className="w-4 h-4" />;
      case 'RESOLVED_DEVELOPER_WINS':
      case 'RESOLVED_CLIENT_WINS':
        return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'RESOLVED_DEVELOPER_WINS':
      case 'RESOLVED_CLIENT_WINS':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Open';
      case 'IN_REVIEW':
        return 'In Review';
      case 'RESOLVED_DEVELOPER_WINS':
        return 'Resolved - Developer Wins';
      case 'RESOLVED_CLIENT_WINS':
        return 'Resolved - Client Wins';
      case 'CLOSED':
        return 'Closed';
      default:
        return status;
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'RESOLVED') {
      return dispute.status === 'RESOLVED_CLIENT_WINS' || dispute.status === 'RESOLVED_DEVELOPER_WINS';
    }
    return dispute.status === filterStatus;
  });

  const stats = {
    total: disputes.length,
    open: disputes.filter((d) => d.status === 'OPEN').length,
    inReview: disputes.filter((d) => d.status === 'IN_REVIEW').length,
    resolved: disputes.filter((d) => d.status === 'RESOLVED_CLIENT_WINS' || d.status === 'RESOLVED_DEVELOPER_WINS').length,
    closed: disputes.filter((d) => d.status === 'CLOSED').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <Typography variant="p" size="lg" color="muted">
              Loading disputes...
            </Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 border border-orange-100 dark:border-orange-900/50 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-red-400/20 rounded-full blur-3xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <Typography variant="h1" size="3xl" weight="bold" className="mb-2">
                  Dispute Management
                </Typography>
                <Typography variant="p" size="lg" color="muted">
                  Review and resolve project disputes between clients and developers
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                <FileText className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <Typography variant="p" size="sm" color="muted">
                  Total
                </Typography>
                <Typography variant="h3" size="2xl" weight="bold">
                  {stats.total}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="p" size="sm" color="muted">
                  Open
                </Typography>
                <Typography variant="h3" size="2xl" weight="bold">
                  {stats.open}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-blue-200 dark:border-blue-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="p" size="sm" color="muted">
                  In Review
                </Typography>
                <Typography variant="h3" size="2xl" weight="bold">
                  {stats.inReview}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-green-200 dark:border-green-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="p" size="sm" color="muted">
                  Resolved
                </Typography>
                <Typography variant="h3" size="2xl" weight="bold">
                  {stats.resolved}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <Typography variant="p" size="sm" color="muted">
                  Closed
                </Typography>
                <Typography variant="h3" size="2xl" weight="bold">
                  {stats.closed}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <Typography variant="p" className="text-red-600 dark:text-red-400">
                {error}
              </Typography>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-zinc-400 ml-2" />
            {[
              { value: 'all', label: 'All Disputes' },
              { value: 'OPEN', label: 'Open' },
              { value: 'IN_REVIEW', label: 'In Review' },
              { value: 'RESOLVED', label: 'Resolved' },
              { value: 'CLOSED', label: 'Closed' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  filterStatus === filter.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Disputes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDisputes.length === 0 ? (
            <div className="col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
              </div>
              <Typography variant="h3" size="xl" weight="semibold" className="mb-2">
                No disputes found
              </Typography>
              <Typography variant="p" color="muted">
                {filterStatus === 'all'
                  ? 'There are no disputes to review at this time'
                  : `No ${filterStatus.toLowerCase().replace('_', ' ')} disputes`}
              </Typography>
            </div>
          ) : (
            filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn('gap-1', getStatusColor(dispute.status))}
                        >
                          {getStatusIcon(dispute.status)}
                          {getStatusLabel(dispute.status)}
                        </Badge>
                      </div>
                      <Typography variant="h3" size="lg" weight="semibold" className="mb-1">
                        {dispute.project.title}
                      </Typography>
                      <Typography variant="p" size="sm" color="muted">
                        Milestone: {dispute.milestone.title}
                      </Typography>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div>
                      <Typography variant="p" size="xs" color="muted" className="mb-1">
                        Client
                      </Typography>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Typography variant="p" size="xs" weight="bold" className="text-white">
                            {(dispute.client.name || dispute.client.email).charAt(0).toUpperCase()}
                          </Typography>
                        </div>
                        <div className="min-w-0">
                          <Typography variant="p" size="sm" weight="medium" className="truncate">
                            {dispute.client.name || dispute.client.email}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted">
                            {dispute.client.role}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Typography variant="p" size="xs" color="muted" className="mb-1">
                        Developer
                      </Typography>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                          <Typography variant="p" size="xs" weight="bold" className="text-white">
                            {(dispute.developer.name || dispute.developer.email).charAt(0).toUpperCase()}
                          </Typography>
                        </div>
                        <div className="min-w-0">
                          <Typography variant="p" size="sm" weight="medium" className="truncate">
                            {dispute.developer.name || dispute.developer.email}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted">
                            {dispute.developer.role}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statements Preview */}
                  {(dispute.clientStatement || dispute.developerStatement) && (
                    <div>
                      <Typography variant="p" size="sm" weight="semibold" className="mb-1">
                        Statements
                      </Typography>
                      <Typography variant="p" size="sm" color="muted" className="line-clamp-2">
                        {dispute.clientStatement || dispute.developerStatement}
                      </Typography>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <Typography variant="p" size="xs">
                      Opened {new Date(dispute.openedAt).toLocaleDateString()}
                    </Typography>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {(dispute.status === 'OPEN' || dispute.status === 'IN_REVIEW') && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedDispute(dispute)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="h2" size="2xl" weight="bold" className="mb-2">
                      Dispute Details
                    </Typography>
                    <Badge
                      variant="outline"
                      className={cn('gap-1', getStatusColor(selectedDispute.status))}
                    >
                      {getStatusIcon(selectedDispute.status)}
                      {getStatusLabel(selectedDispute.status)}
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDispute(null);
                      setResolutionText('');
                    }}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">
                      Project
                    </Typography>
                    <Typography variant="p" size="lg" weight="semibold">
                      {selectedDispute.project.title}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-1">
                      Milestone
                    </Typography>
                    <Typography variant="p" size="lg" weight="semibold">
                      {selectedDispute.milestone.title}
                    </Typography>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-2">
                      Client
                    </Typography>
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Typography variant="p" size="sm" weight="bold" className="text-white">
                          {(selectedDispute.client.name || selectedDispute.client.email)
                            .charAt(0)
                            .toUpperCase()}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="p" size="sm" weight="medium">
                          {selectedDispute.client.name || selectedDispute.client.email}
                        </Typography>
                        <Typography variant="p" size="xs" color="muted">
                          {selectedDispute.client.role}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Typography variant="p" size="sm" color="muted" className="mb-2">
                      Developer
                    </Typography>
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <Typography variant="p" size="sm" weight="bold" className="text-white">
                          {(selectedDispute.developer.name || selectedDispute.developer.email)
                            .charAt(0)
                            .toUpperCase()}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="p" size="sm" weight="medium">
                          {selectedDispute.developer.name || selectedDispute.developer.email}
                        </Typography>
                        <Typography variant="p" size="xs" color="muted">
                          {selectedDispute.developer.role}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDispute.clientStatement && (
                  <div>
                    <Typography variant="p" size="sm" weight="semibold" className="mb-2">
                      Client Statement
                    </Typography>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Typography variant="p" size="sm">
                        {selectedDispute.clientStatement}
                      </Typography>
                    </div>
                  </div>
                )}

                {selectedDispute.developerStatement && (
                  <div>
                    <Typography variant="p" size="sm" weight="semibold" className="mb-2">
                      Developer Statement
                    </Typography>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <Typography variant="p" size="sm">
                        {selectedDispute.developerStatement}
                      </Typography>
                    </div>
                  </div>
                )}

                {selectedDispute.reviewerDecision && (
                  <div>
                    <Typography variant="p" size="sm" weight="semibold" className="mb-2">
                      Admin Decision
                    </Typography>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <Typography variant="p" size="sm">
                        {selectedDispute.reviewerDecision}
                      </Typography>
                      {selectedDispute.reviewer && (
                        <Typography variant="p" size="xs" color="muted" className="mt-2">
                          Decided by {selectedDispute.reviewer.name || selectedDispute.reviewer.email}
                        </Typography>
                      )}
                      {selectedDispute.resolvedInFavorOf && (
                        <Typography variant="p" size="xs" weight="semibold" className="mt-2 text-green-600 dark:text-green-400">
                          Resolved in favor of: {selectedDispute.resolvedInFavorOf}
                        </Typography>
                      )}
                    </div>
                  </div>
                )}

                {(selectedDispute.status === 'OPEN' || selectedDispute.status === 'IN_REVIEW') && (
                  <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Typography variant="p" size="sm" weight="semibold">
                      Take Action
                    </Typography>
                    <textarea
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Enter your decision and reasoning..."
                      className="w-full p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="primary"
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleResolveDispute(selectedDispute.id, resolutionText, 'CLIENT')}
                        disabled={!resolutionText.trim() || actionLoading}
                      >
                        <User className="w-4 h-4" />
                        Client Wins
                      </Button>
                      <Button
                        variant="primary"
                        className="gap-2 bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleResolveDispute(selectedDispute.id, resolutionText, 'DEVELOPER')}
                        disabled={!resolutionText.trim() || actionLoading}
                      >
                        <User className="w-4 h-4" />
                        Developer Wins
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleRejectDispute(selectedDispute.id, resolutionText)}
                        disabled={!resolutionText.trim() || actionLoading}
                      >
                        <XCircle className="w-4 h-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
