import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ConnectionCard = ({
  otherUser,
  onViewProfile,
  connectedSince,
}) => {
  // Format date nicely
  const formattedDate = new Date(
    connectedSince
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Skills preview
  const skills = otherUser?.skills || [];
  const previewSkills = skills.slice(0, 3);
  const remainingSkills = skills.length - 3;

  return (
    <Card
      onClick={onViewProfile}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <CardContent className="p-5 space-y-4">

        {/* User Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {otherUser?.name}
          </h2>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {otherUser?.bio || "No bio available"}
          </p>

          <Badge variant="secondary">
            {otherUser?.availability || "Not specified"}
          </Badge>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Knows
          </p>

          <div className="flex flex-wrap gap-2">
            {previewSkills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}

            {remainingSkills > 0 && (
              <Badge variant="outline">
                +{remainingSkills} more
              </Badge>
            )}
          </div>
        </div>

        {/* Connected Since */}
        <p className="text-xs text-muted-foreground">
          Connected since {formattedDate}
        </p>

        {/* Button */}
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
        >
          View Profile
        </Button>

      </CardContent>
    </Card>
  );
};

export default ConnectionCard;