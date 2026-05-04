import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ProfileSetupPage = () => {
  const [formData, setFormData] = useState({
    bio: "",
    skills: [],
    learningGoals: [],
    availability: "weekends",
  });

  const [skillInput, setSkillInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, user } = useAuth(); // ✅ get user for token

  // ================= SKILLS =================
  const addSkill = (e) => {
    if (e.type === "keydown") {
      if (e.key !== "Enter") return;
      e.preventDefault();
    }

    const trimmed = skillInput.trim();

    if (!trimmed) return;
    if (formData.skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) return;

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // ================= GOALS =================
  const addGoal = (e) => {
    if (e.type === "keydown") {
      if (e.key !== "Enter") return;
      e.preventDefault();
    }

    const trimmed = goalInput.trim();

    if (!trimmed) return;
    if (formData.learningGoals.map(g => g.toLowerCase()).includes(trimmed.toLowerCase())) return;

    setFormData((prev) => ({
      ...prev,
      learningGoals: [...prev.learningGoals, trimmed],
    }));

    setGoalInput("");
  };

  const removeGoal = (goalToRemove) => {
    setFormData((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.filter((g) => g !== goalToRemove),
    }));
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (formData.skills.length === 0 || formData.learningGoals.length === 0) {
      setError("Please add at least one skill and one learning goal.");
      setLoading(false);
      return;
    }

    try {
      console.log("USER:", user);
      console.log("TOKEN:", user?.token);
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`, // ✅ FIXED
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      login(data); // update context
      navigate("/matches");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Set up your profile</CardTitle>
            <CardDescription>
              Tell us about yourself so we can find your perfect study matches.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Bio */}
              <div className="space-y-2">
                <label className="font-medium">About you</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short bio..."
                />
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <div>
                  <label className="font-medium">What can you teach?</label>
                  <p className="text-sm text-muted-foreground">
                    Add skills you already know.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="e.g. React"
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-3">
                <div>
                  <label className="font-medium">What do you want to learn?</label>
                  <p className="text-sm text-muted-foreground">
                    Add skills you want to pick up.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={addGoal}
                    placeholder="e.g. Node.js"
                  />
                  <Button type="button" onClick={addGoal}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.learningGoals.map((goal, i) => (
                    <Badge
                      key={i}
                      className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1"
                    >
                      {goal}
                      <button onClick={() => removeGoal(goal)}>×</button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <label className="font-medium">When are you available?</label>

                <div className="flex gap-3">
                  {["weekdays", "weekends", "both"].map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={formData.availability === option ? "default" : "outline"}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availability: option,
                        }))
                      }
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetupPage;