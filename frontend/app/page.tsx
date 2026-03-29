"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import type { Task } from "@/types";

import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { AgentsBar } from "@/components/dashboard/AgentsBar";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { tasks, fetchTasks } = useStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const total = tasks.length;
  const done = tasks.filter((t: Task) => t.status === "done").length;
  const progress = tasks.filter((t: Task) => t.status === "in-progress").length;
  const todo = tasks.filter((t: Task) => t.status === "todo").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Projects summary
  const projects = Array.from(new Set(tasks.map((t: Task) => t.project)));

  return (
    <div>
      <PageHeader
        title="Mission Control"
        subtitle="// AUTONOMOUS MULTI-AGENT OVERVIEW"
        badge="LIVE"
      />

      <AgentsBar />

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total Tasks"
          value={total}
          desc="across all projects"
          icon="◈"
          color="cyan"
        />
        <StatCard
          label="Completed"
          value={done}
          desc={`${pct}% completion rate`}
          icon="✓"
          color="green"
        />
        <StatCard
          label="In Progress"
          value={progress}
          desc="active assignments"
          icon="⚡"
          color="yellow"
        />
        <StatCard
          label="Pending"
          value={todo}
          desc="awaiting assignment"
          icon="⏳"
          color="red"
        />
        <StatCard
          label="AI Decisions"
          value={47}
          desc="logged this session"
          icon="◉"
          color="purple"
        />
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Link href="/project">
          <Button variant="primary">＋ Create Project</Button>
        </Link>
        <Link href="/tasks">
          <Button variant="ghost">◈ View All Tasks</Button>
        </Link>
        <Link href="/logs">
          <Button variant="ghost">◉ Audit Logs</Button>
        </Link>
      </div>

      {/* Two-col */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* AI Decisions */}
        <Card>
          <CardHeader
            title="⚡ Latest AI Decisions"
            action={
              <Link
                href="/logs"
                style={{
                  fontSize: 10,
                  color: "var(--cyan)",
                  fontFamily: "var(--font-mono)",
                  textDecoration: "none",
                }}
              >
                VIEW ALL →
              </Link>
            }
          />
          <AIInsightPanel agent="ORCHESTRATOR">
            Sample decision log (replace with backend later)
          </AIInsightPanel>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader title="📁 Active Projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {projects.map((proj) => {
              const projTasks = tasks.filter((t: Task) => t.project === proj);
              const projDone = projTasks.filter((t: Task) => t.status === "done").length;
              const projPct = projTasks.length
                ? Math.round((projDone / projTasks.length) * 100)
                : 0;

              return (
                <div key={proj}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {proj}
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontFamily: "var(--font-mono)",
                        background: "var(--cyan-glow)",
                        color: "var(--cyan)",
                        border: "1px solid rgba(0,212,255,0.3)",
                      }}
                    >
                      {projPct}%
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      marginBottom: 6,
                    }}
                  >
                    {projTasks.length} tasks · {projDone} done
                  </div>

                  <div
                    style={{
                      height: 6,
                      background: "var(--border)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${projPct}%`,
                        background:
                          "linear-gradient(90deg, var(--cyan), var(--green))",
                        borderRadius: 3,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}