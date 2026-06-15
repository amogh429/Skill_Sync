// import React from "react";

const MatchCard = ({ match, onConnect, onViewProfile, connectionStatus }) => {
  const user = match.user || match;

  // Score color
  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-400";
  };

  // Score background
  const getScoreBg = (score) => {
    if (score >= 70) return "bg-emerald-50 border-emerald-100";
    if (score >= 40) return "bg-amber-50 border-amber-100";
    return "bg-red-50 border-red-100";
  };

  // Connect button
  const renderConnectButton = () => {
    if (connectionStatus === "connected") {
      return (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full py-2.5 text-center text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100"
        >
          ✓ Connected
        </div>
      );
    }

    if (connectionStatus === "pending") {
      return (
        <button
          disabled
          onClick={(e) => e.stopPropagation()}
          className="w-full py-2.5 text-sm font-medium text-slate-400 bg-slate-50 rounded-xl border border-slate-200 cursor-not-allowed"
        >
          Request Sent
        </button>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onConnect(user._id);
        }}
        className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
      >
        Connect
      </button>
    );
  };

  return (
    <div
      onClick={() => onViewProfile(user._id)}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          {/* User info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-lg leading-tight truncate">
              {user.name}
            </h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">
              {user.bio || "No bio available"}
            </p>
          </div>

          {/* Compatibility score */}
          <div
            className={`flex-shrink-0 px-3 py-2 rounded-xl border text-center ${getScoreBg(match.compatibilityPercent)}`}
          >
            <p
              className={`text-2xl font-bold leading-none ${getScoreColor(match.compatibilityPercent)}`}
            >
              {match.compatibilityPercent}%
            </p>
            <p className="text-xs text-slate-400 mt-0.5">match</p>
          </div>
        </div>

        {/* Availability badge */}
        <span className="inline-block mt-3 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
          📅 {user.availability}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 mx-5" />

      {/* Skills section */}
      <div className="p-5 pt-4 space-y-3">
        {/* Can teach */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Can teach you
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.skills?.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
              >
                {skill}
              </span>
            ))}
            {user.skills?.length > 3 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                +{user.skills.length - 3} more
              </span>
            )}
            {(!user.skills || user.skills.length === 0) && (
              <span className="text-xs text-slate-400">None listed</span>
            )}
          </div>
        </div>

        {/* Wants to learn */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Wants to learn
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.learningGoals?.slice(0, 3).map((goal, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-100"
              >
                {goal}
              </span>
            ))}
            {user.learningGoals?.length > 3 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                +{user.learningGoals.length - 3} more
              </span>
            )}
            {(!user.learningGoals || user.learningGoals.length === 0) && (
              <span className="text-xs text-slate-400">None listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5">{renderConnectButton()}</div>
    </div>
  );
};

export default MatchCard;
