import { Gift, Sparkles, Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CURRENT_CUSTOMER } from "../_lib/customer";
import { PageHeader } from "../_components/page-header";
import { CopyReferral } from "./copy-referral";
import { RedeemButton } from "./redeem-button";

const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 100 },
  { name: "Gold", min: 250 },
  { name: "Platinum", min: 1000 },
] as const;

const REWARDS = [
  { id: "r1", title: "KES 500 off your next order", cost: 500, icon: Gift },
  { id: "r2", title: "Free dozen cupcakes", cost: 800, icon: Sparkles },
  { id: "r3", title: "Free cake delivery (any zone)", cost: 350, icon: Award },
  { id: "r4", title: "10% off a custom wedding cake", cost: 1500, icon: Gift },
  { id: "r5", title: "Priority production slot", cost: 600, icon: Sparkles },
];

function tierProgress(points: number) {
  const idx = [...TIERS].reverse().findIndex((t) => points >= t.min);
  const currentTierIdx = TIERS.length - 1 - idx;
  const current = TIERS[currentTierIdx];
  const next = TIERS[currentTierIdx + 1];
  if (!next) return { current, next: null, pct: 100, remaining: 0 };
  const pct = Math.round(((points - current.min) / (next.min - current.min)) * 100);
  return { current, next, pct, remaining: next.min - points };
}

export const metadata = { title: "Rewards" };

export default function RewardsPage() {
  const points = CURRENT_CUSTOMER.loyaltyPoints;
  const { current, next, pct, remaining } = tierProgress(points);

  return (
    <div>
      <PageHeader title="Rewards & Loyalty" description="Earn points with every order and redeem them for treats and discounts." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 py-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 px-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Points Balance</p>
              <p className="mt-1 font-display text-4xl font-bold text-primary">{points.toLocaleString()}</p>
            </div>
            <Badge variant="gold" className="px-3 py-1.5 text-sm">
              <Award className="size-4" /> {current.name} Tier
            </Badge>
          </div>

          <div className="mt-6 px-0">
            {next ? (
              <>
                <Progress value={pct} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {remaining.toLocaleString()} points to reach {next.name}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">You've reached our highest tier — thank you for your loyalty!</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 px-0">
            {TIERS.map((t) => (
              <Badge key={t.name} variant={t.name === current.name ? "default" : "outline"}>
                {t.name}
              </Badge>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-secondary/60 p-4 px-4 text-sm text-muted-foreground">
            Earn <span className="font-semibold text-foreground">1 point for every KES 100</span> spent on
            orders. Points are credited once your order is marked Completed.
          </div>
        </Card>

        <Card className="p-6 py-6">
          <div className="flex items-center gap-2 px-0">
            <Users className="size-4.5 text-berry" />
            <h3 className="font-display text-base font-semibold">Refer a Friend</h3>
          </div>
          <p className="mt-2 px-0 text-sm text-muted-foreground">
            Share your link — you both earn 200 bonus points when they place their first order.
          </p>
          <div className="mt-4 px-0">
            <CopyReferral code={CURRENT_CUSTOMER.id.toUpperCase()} />
          </div>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold">Redeem Points</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REWARDS.map((r) => {
          const affordable = points >= r.cost;
          return (
            <Card key={r.id} className="p-5 py-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-blush text-berry">
                <r.icon className="size-5" />
              </span>
              <p className="mt-3 px-0 font-display text-base font-semibold">{r.title}</p>
              <p className="mt-1 px-0 text-sm text-muted-foreground">{r.cost.toLocaleString()} points</p>
              <RedeemButton title={r.title} affordable={affordable} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
