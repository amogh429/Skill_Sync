import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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
    if (
      formData.skills
        .map((s) => s.toLowerCase())
        .includes(trimmed.toLowerCase())
    )
      return;

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
    if (
      formData.learningGoals
        .map((g) => g.toLowerCase())
        .includes(trimmed.toLowerCase())
    )
      return;

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
      setLoading(true);
      setError(null);

      console.log("USER:", user);
      console.log("TOKEN:", user?.token);

      if (!user?.token) {
        throw new Error("User token not found. Please login again.");
      }

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      // Preserve token while updating user data
      login({
        ...data,
        token: user.token,
      });
      console.log(data);

      navigate("/matches");
    } catch (err) {
      console.error(err);

      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className=" bg-gradient-to-br from-slate-50 to indigo-50 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight leading-none text-slate-800">
            Skill<span className="text-indigo-600">Sync</span>
          </h1>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Set up your profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tell us about yourself so we can find your perfect study matches
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Bio ─────────────────────────────────────── */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                About you
              </label>
              <p className="text-xs text-slate-400">
                Write a short bio so others know who you are
              </p>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Second year CS student who loves building things and learning new tech..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-slate-400 text-right">
                {formData.bio.length} / 200
              </p>
            </div>

            {/* ── Divider ──────────────────────────────────── */}
            <div className="border-t border-slate-100" />

            {/* ── Skills ───────────────────────────────────── */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  What can you teach?
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add skills you already know — press Enter or click Add
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="e.g. React, Node.js, Python..."
                  className="flex-1 h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Skill badges */}
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 min-h-[48px]">
                  {formData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-700 font-bold leading-none transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {formData.skills.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No skills added yet
                </p>
              )}
            </div>

            {/* ── Divider ──────────────────────────────────── */}
            <div className="border-t border-slate-100" />

            {/* ── Learning Goals ────────────────────────────── */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  What do you want to learn?
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add skills you want to pick up — press Enter or click Add
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={addGoal}
                  placeholder="e.g. Machine Learning, TypeScript..."
                  className="flex-1 h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={addGoal}
                  className="px-4 h-11 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Goal badges */}
              {formData.learningGoals.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 min-h-[48px]">
                  {formData.learningGoals.map((goal, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 text-sm font-medium rounded-full border border-violet-100"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => removeGoal(goal)}
                        className="text-violet-400 hover:text-violet-700 font-bold leading-none transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {formData.learningGoals.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No goals added yet
                </p>
              )}
            </div>

            {/* ── Divider ──────────────────────────────────── */}
            <div className="border-t border-slate-100" />

            {/* ── Availability ─────────────────────────────── */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  When are you available?
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  This helps match you with compatible study partners
                </p>
              </div>

              <div className="flex gap-3">
                {["weekdays", "weekends", "both"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, availability: option }))
                    }
                    className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                      formData.availability === option
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Error ────────────────────────────────────── */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* ── Submit ───────────────────────────────────── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Saving profile...
                </span>
              ) : (
                "Save Profile"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          You can update your profile anytime from settings
        </p>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
