"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Trees, DollarSign, TrendingUp, GitBranch } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import confetti from "canvas-confetti";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const addTree = useForestStore((s) => s.addTree);
  const [projectType, setProjectType] = useState<"shipping" | "revenue">("shipping");
  const [name, setName] = useState("");
  const [mrr, setMrr] = useState("29");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (projectType === "shipping") {
      addTree(name.trim(), 0, "sapling", "shipping");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#34d399", "#059669"],
      });
    } else {
      const parsedMrr = parseInt(mrr) || 29;
      addTree(name.trim(), parsedMrr, "sapling", "revenue");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#fbbf24", "#d97706"],
      });
    }

    setName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Project"
      badgeText="Manual Fallback"
      icon={Trees}
      maxWidth="sm"
      position="bottom-center"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 font-sans">
        {/* Project Type Switcher */}
        <SegmentedControl
          value={projectType}
          onChange={(val) => setProjectType(val as "shipping" | "revenue")}
          size="sm"
          options={[
            { value: "shipping", label: "Code Repo", icon: GitBranch },
            { value: "revenue", label: "Revenue", icon: TrendingUp },
          ]}
        />

        {/* Project Name Input */}
        <div>
          <label className="text-xs font-semibold text-stone-800 mb-1 block">
            {projectType === "shipping" ? "Repository or Project Name" : "Customer or Product Name"}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={projectType === "shipping" ? "e.g. Auth Engine MVP" : "e.g. Acme Pro Plan"}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:bg-white transition"
          />
          <p className="text-[11px] text-stone-500 mt-1">
            {projectType === "shipping"
              ? "Grows on the West grove as you ship commits and daily milestones."
              : "Sprouts on the East grove representing recurring revenue."}
          </p>
        </div>

        {/* MRR Input (Only for Revenue) */}
        {projectType === "revenue" && (
          <div>
            <label className="text-xs font-semibold text-stone-800 mb-1 block">
              Monthly Recurring Revenue ($/mo)
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="number"
                min="1"
                value={mrr}
                onChange={(e) => setMrr(e.target.value)}
                placeholder="29"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 font-mono font-bold outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant={projectType === "shipping" ? "emerald" : "dark"}
          size="md"
          className="w-full mt-2 justify-center font-bold text-xs"
        >
          {projectType === "shipping" ? "Add Code Project" : "Add Revenue Project"}
        </Button>
      </form>
    </Modal>
  );
}
