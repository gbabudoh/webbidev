'use client';

import { 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/components/ui';

export default function DonBucket() {
  const completionSteps = [
    { label: "Milestones Completed", developer: true, client: true },
    { label: "Final Review Approved", developer: true, client: true },
    { label: "Code Handover Confirmed", developer: true, client: false },
    { label: "Payment Release Authorized", developer: false, client: false },
  ];

  return (
    <div className="min-h-screen bg-[#ECE6E6] p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <Badge className="bg-[#BCEACF] text-[#171717] mb-4">Escrow & Completion Board</Badge>
          <h1 className="text-5xl font-black text-[#171717] mb-4">donBucket</h1>
          <p className="text-[#171717]/60 font-medium max-w-xl mx-auto">
            The final step in your project lifecycle. Both parties confirm completion here to trigger the automated payout.
          </p>
        </header>

        {/* Project Overview Card */}
        <Card className="glass border-none mb-12 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-[#171717] p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">Project: Enterprise SaaS Dashboard</h2>
                <p className="text-white/40 text-sm font-medium">Project ID: #WEBBI-83920</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#F3C36C]">$4,500.00</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Total Escrowed</p>
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Developer Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-[#F3C36C] rounded-full flex items-center justify-center text-[#171717] font-bold">D</div>
                  <h3 className="text-lg font-black text-[#171717]">Developer Bucket</h3>
                </div>
                <div className="space-y-4">
                  {completionSteps.map((step, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                      <span className="text-sm font-bold text-[#171717]/60">{step.label}</span>
                      {step.developer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#171717]/10" />
                      )}
                    </div>
                  ))}
                </div>
                {!completionSteps[3].developer && (
                  <Button className="w-full bg-[#171717] text-white py-6 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                    Mark as Final Complete
                  </Button>
                )}
              </div>

              {/* Client Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-[#AC9898] rounded-full flex items-center justify-center text-white font-bold">C</div>
                  <h3 className="text-lg font-black text-[#171717]">Client UserBucket</h3>
                </div>
                <div className="space-y-4">
                  {completionSteps.map((step, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                      <span className="text-sm font-bold text-[#171717]/60">{step.label}</span>
                      {step.client ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#171717]/10" />
                      )}
                    </div>
                  ))}
                </div>
                {!completionSteps[3].client && (
                  <Button variant="outline" className="w-full border-[#171717] text-[#171717] py-6 rounded-xl font-bold hover:bg-[#171717] hover:text-white transition-all">
                    Confirm Completion
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Calculation Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black text-[#171717] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#BCEACF]" />
              Payout Distribution
            </h3>
            <Card className="glass border-none">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-[#171717]/60">Project Price</span>
                  <span className="text-[#171717]">$4,500.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-red-500">
                  <div className="flex flex-col">
                    <span>Webbidev Commission</span>
                    <span className="text-xs font-medium text-red-500/60">Fixed 10% Platform Fee</span>
                  </div>
                  <span>- $450.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-[#171717]/60">
                  <span>Processing Fee (Stripe)</span>
                  <span>- $130.80</span>
                </div>
                <div className="pt-6 border-t border-[#171717]/10 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-[#171717]">Developer Payout</span>
                    <span className="text-xs font-bold text-emerald-600 uppercase">Available after both confirmations</span>
                  </div>
                  <span className="text-3xl font-black text-emerald-600">$3,919.20</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-[#171717] mb-6">Need Review?</h3>
            <Card className="bg-[#171717] text-white p-6 rounded-[2rem]">
              <AlertCircle className="w-10 h-10 text-[#F3C36C] mb-4" />
              <h4 className="text-xl font-bold mb-2">Dispute Center</h4>
              <p className="text-white/40 text-sm font-medium mb-6">
                If the deliverables do not match your expectations, you can open a dispute here for technical review.
              </p>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Open Dispute
              </Button>
            </Card>
          </div>
        </div>

        <footer className="text-center py-12">
          <div className="flex items-center justify-center gap-2 text-2xl font-black tracking-tighter text-[#171717] opacity-20">
            webbi<span className="text-[#F3C36C]">dev</span> • gbabudoh
          </div>
        </footer>
      </div>
    </div>
  );
}
