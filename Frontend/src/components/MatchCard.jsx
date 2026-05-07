
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MatchCard = ({
  match,
  onConnect,
  onViewProfile,
  status,
}) => {
  const user = match.user || match; // depending on your API shape

  // 🎨 Score color logic
  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // 🔘 Connect button logic
  const renderConnectButton = (e) => {
    e?.stopPropagation(); // 🚫 prevent card click

    if (status === "pending") {
      return (
        <Button disabled variant="secondary">
          Request Sent
        </Button>
      );
    }

    if (status === "connected") {
      return (
        <span className="text-sm font-medium text-green-600">
          Connected
        </span>
      );
    }

    return (
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onConnect(match.user._id);
        }}
      >
        Connect
      </Button>
    );
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition"
      onClick={() => onViewProfile(user._id)}
    >
      <CardContent className="p-4 space-y-4">

        {/* 🔹 User Info */}
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {user.bio || "No bio available"}
          </p>

          <Badge className="mt-2" variant="outline">
            {user.availability}
          </Badge>
        </div>

        {/* 🔹 Compatibility */}
        <div className="text-center">
          <p
            className={`text-3xl font-bold ${getScoreColor(
              match.compatibilityPercent
            )}`}
          >
            {match.compatibilityPercent}%
          </p>
          <p className="text-xs text-muted-foreground">
            compatibility
          </p>
        </div>

        {/* 🔹 Skills */}
        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Can teach you
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.skills?.slice(0, 3).map((skill, i) => (
                <Badge key={i} className="bg-blue-100 text-blue-700">
                  {skill}
                </Badge>
              ))}
              {user.skills?.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Wants to learn
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.learningGoals?.slice(0, 3).map((goal, i) => (
                <Badge key={i} className="bg-purple-100 text-purple-700">
                  {goal}
                </Badge>
              ))}
              {user.learningGoals?.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{user.learningGoals.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 🔹 Connect Button */}
        <div className="flex justify-end">
          {renderConnectButton()}
        </div>

      </CardContent>
    </Card>
  );
};

export default MatchCard;