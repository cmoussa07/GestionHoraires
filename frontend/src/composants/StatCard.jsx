import React from "react";

export function StatCard({ label, value, icon: Icon, gradient, color }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 p-5 bg-gradient-to-br ${gradient} shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
            {label}
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${color}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {value}
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow">
          <Icon className="h-5 w-5 text-amber-400" />
        </div>
      </div>
    </div>
  );
}
