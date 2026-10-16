"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LeaderboardTabs({
  personal,
  campus,
}: {
  personal: React.ReactNode;
  campus: React.ReactNode;
}) {
  const [tab, setTab] = useState("personal");

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
      <TabsList className="border border-[#1f1f1f] bg-[#0f0f0f]">
        <TabsTrigger value="personal" className="text-[13px]">
          {copy.leaderboard.tabsPersonal}
        </TabsTrigger>
        <TabsTrigger value="campus" className="text-[13px]">
          {copy.leaderboard.tabsCampus}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="mt-5">
        {personal}
      </TabsContent>
      <TabsContent value="campus" className="mt-5">
        {campus}
      </TabsContent>
    </Tabs>
  );
}
