import { Waypoints } from "lucide-react";

import { VlanTable } from "@/components/network-tables/vlan-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { VlanMembership } from "./data-link-types";

export type VlanMembershipViewProps = {
  memberships: VlanMembership[];
  className?: string;
};

export function VlanMembershipView({ memberships, className }: VlanMembershipViewProps) {
  return (
    <section className={cn("rounded-lg border bg-card p-3 text-card-foreground", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Waypoints aria-hidden className="size-4" />
          VLAN 成员关系
        </div>
        <Badge variant="secondary">{memberships.length} 个 VLAN</Badge>
      </div>
      <VlanTable
        entries={memberships.map((membership) => ({
          id: `vlan-${membership.vlanId}`,
          vlanId: membership.vlanId,
          name: membership.name,
          ports: [
            ...membership.accessInterfaceIds,
            ...membership.trunkInterfaceIds,
            ...(membership.nativeInterfaceIds ?? []),
          ],
          taggedPorts: membership.trunkInterfaceIds,
          untaggedPorts: membership.accessInterfaceIds,
          nativeVlanPorts: membership.nativeInterfaceIds,
          state: "active",
        }))}
      />
    </section>
  );
}
