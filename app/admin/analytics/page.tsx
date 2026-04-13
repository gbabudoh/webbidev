'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { BarChart3, Globe, Users, TrendingUp, Award, MapPin, DollarSign, Download } from 'lucide-react';

interface AnalyticsData {
  developersByCountry: { location: string; count: number }[];
  clientsByCountry: { country: string; count: number }[];
  developerPerformance: { name: string; location: string; country: string | null; totalProjects: number; completedProjects: number; completionRate: number; totalEarnings: number }[];
  monthlyRegistrations: { month: string; developers: number; clients: number; total: number }[];
  monthlyRevenue: { month: string; total: number; fees: number; payouts: number }[];
  jobsByLocation: { location: string; count: number; value: number }[];
  summary: { totalDevelopers: number; totalClients: number; verifiedDevelopers: number };
}

// SVG Bar Chart Component
const BarChart = ({ data, maxValue, label, color }: { data: { label: string; value: number }[]; maxValue: number; label: string; color: string }) => {
  const barWidth = Math.max(16, Math.floor(600 / Math.max(data.length, 1)) - 8);
  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(data.length * (barWidth + 8), 200)} height="200" className="min-w-full">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <g key={p}>
            <line x1="0" y1={180 - 160 * p} x2="100%" y2={180 - 160 * p} stroke="#e2e8f0" strokeWidth="1" />
            <text x="0" y={180 - 160 * p - 4} fontSize="10" fill="#94a3b8">{Math.round(maxValue * p)}</text>
          </g>
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? (d.value / maxValue) * 160 : 0;
          return (
            <g key={i}>
              <rect
                x={i * (barWidth + 8) + 30}
                y={180 - barHeight}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={color}
                opacity="0.8"
                className="hover:opacity-100 transition-opacity"
              />
              <text
                x={i * (barWidth + 8) + 30 + barWidth / 2}
                y={195}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
              >
                {d.label.length > 5 ? d.label.slice(0, 5) : d.label}
              </text>
              <text
                x={i * (barWidth + 8) + 30 + barWidth / 2}
                y={180 - barHeight - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#334155"
                fontWeight="600"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <Typography variant="p" size="lg" color="muted">Loading analytics...</Typography>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  const maxReg = Math.max(...(data.monthlyRegistrations.map((m) => m.total) || [1]), 1);
  const maxDevCountry = Math.max(...(data.developersByCountry.map((d) => d.count) || [1]), 1);
  const maxClientCountry = Math.max(...(data.clientsByCountry.map((c) => c.count) || [1]), 1);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 border border-indigo-100 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="relative flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <Typography variant="h1" size="3xl" weight="bold" className="mb-2">Platform Analytics</Typography>
              <Typography variant="p" size="lg" color="muted">
                Track registrations, performance, and economic insights for business growth
              </Typography>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Developers', value: data.summary.totalDevelopers, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Clients', value: data.summary.totalClients, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'Verified Developers', value: data.summary.verifiedDevelopers, icon: Award, color: 'from-green-500 to-emerald-500' },
          ].map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="p" size="sm" color="muted">{s.label}</Typography>
                    <Typography variant="h2" size="3xl" weight="bold">{s.value}</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Trends Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <CardTitle>Registration Trends (Last 12 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {data.monthlyRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="p" color="muted">No registration data available yet</Typography>
              </div>
            ) : (
              <BarChart
                data={data.monthlyRegistrations.map((m) => ({ label: m.month.slice(5), value: m.total }))}
                maxValue={maxReg}
                label="Registrations"
                color="#6366f1"
              />
            )}
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <Typography variant="p" size="xs" color="muted">Total Registrations</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer & Client by Country */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500" />
                <CardTitle>Developers by Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {data.developersByCountry.length === 0 ? (
                <Typography variant="p" color="muted" className="text-center py-8">No location data</Typography>
              ) : (
                <div className="space-y-3">
                  {data.developersByCountry.slice(0, 10).map((d) => (
                    <div key={d.location} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="p" size="sm" weight="medium">{d.location || 'Unknown'}</Typography>
                          <Typography variant="p" size="sm" weight="bold">{d.count}</Typography>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${(d.count / maxDevCountry) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-500" />
                <CardTitle>Clients by Country</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {data.clientsByCountry.length === 0 ? (
                <Typography variant="p" color="muted" className="text-center py-8">No location data</Typography>
              ) : (
                <div className="space-y-3">
                  {data.clientsByCountry.slice(0, 10).map((c) => (
                    <div key={c.country} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="p" size="sm" weight="medium">{c.country || 'Unknown'}</Typography>
                          <Typography variant="p" size="sm" weight="bold">{c.count}</Typography>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${(c.count / maxClientCountry) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Developer Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500" />
                <CardTitle>Developer Performance Rankings</CardTitle>
              </div>
              <Badge variant="secondary" size="sm">{data.developerPerformance.length} developers</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            {data.developerPerformance.length === 0 ? (
              <div className="text-center py-12 px-6">
                <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <Typography variant="p" color="muted">No completed projects yet</Typography>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">#</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Developer</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 uppercase">Location</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Projects</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Completed</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase">Rate</th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase">Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.developerPerformance.map((dev, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                            i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          )}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Typography variant="p" size="sm" weight="medium">{dev.name}</Typography>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <Typography variant="p" size="sm" color="muted">{dev.location || dev.country || 'N/A'}</Typography>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Typography variant="p" size="sm">{dev.totalProjects}</Typography>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Typography variant="p" size="sm" weight="bold" className="text-green-600">{dev.completedProjects}</Typography>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant={dev.completionRate >= 80 ? 'success' : dev.completionRate >= 50 ? 'warning' : 'danger'} size="sm">
                            {dev.completionRate}%
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Typography variant="p" size="sm" weight="bold">${dev.totalEarnings.toLocaleString()}</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs by Location — Economic Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-teal-500" />
              <div>
                <CardTitle>Job Opportunities by Location</CardTitle>
                <Typography variant="p" size="sm" color="muted" className="mt-1">
                  Economic growth data — jobs completed and revenue by developer location
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {data.jobsByLocation.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="p" color="muted">No job location data available yet</Typography>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.jobsByLocation.map((j) => (
                  <div key={j.location} className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      <Typography variant="p" size="sm" weight="bold">{j.location}</Typography>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Typography variant="p" size="xs" color="muted">Jobs</Typography>
                        <Typography variant="h3" size="xl" weight="bold" className="text-teal-700">{j.count}</Typography>
                      </div>
                      <div>
                        <Typography variant="p" size="xs" color="muted">Value</Typography>
                        <Typography variant="h3" size="xl" weight="bold" className="text-teal-700">${j.value.toLocaleString()}</Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
