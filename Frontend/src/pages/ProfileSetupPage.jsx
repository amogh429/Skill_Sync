import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios_api from "../api/axios";

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
  const [extractText, setExtractText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState(false);
  const [extractError, setExtractError] = useState("");

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

  const handleExtract = async () => {
    // console.log("Axios Base URL:", axios_api.defaults.baseURL);
    if (!extractText.trim()) {
      setExtractError("Please paste some text first");
      return;
    }

    setExtracting(true);
    setExtractError("");
    setExtractSuccess(false);

    try {
      const response = await axios_api.post("/api/ai/extract-skills", {
        text: extractText,
      });

      const { skills,learningGoals  } = response.data;

      // Deduplicate and merge skills (case-insensitive)
      const existingSkillsLower = formData.skills.map((s) => s.toLowerCase());
      const newSkills = skills.filter(
        (skill) => !existingSkillsLower.includes(skill.toLowerCase()),
      );

      // Deduplicate and merge learning goals (case-insensitive)
      const existingGoalsLower = formData.learningGoals.map((g) =>
        g.toLowerCase(),
      );
      const newGoals = learningGoals.filter(
        (goal) => !existingGoalsLower.includes(goal.toLowerCase()),
      );

      // Update form data with merged arrays
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, ...newSkills],
        learningGoals: [...prev.learningGoals, ...newGoals],
      }));

      // Show success message
      setExtractSuccess(true);
      setExtractText(""); // Clear the textarea

      // Hide success message after 4 seconds
      setTimeout(() => setExtractSuccess(false), 4000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to extract skills. Please try again.";
      setExtractError(errorMessage);
    } finally {
      setExtracting(false);
    }
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

      if (!user?.token) {
        throw new Error("User token not found. Please login again.");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        },
      );

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

            {/* ── AI Skill Extraction Section ────────────────────── */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Extract skills automatically
                </label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste your resume, LinkedIn summary or bio — AI will extract
                  your skills
                </p>
              </div>

              {/* Extract text area */}
              <textarea
                value={extractText}
                onChange={(e) => setExtractText(e.target.value)}
                rows={3}
                placeholder="Paste your resume, LinkedIn summary or any text about your experience..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />

              {/* Extract button */}
              <button
                type="button"
                onClick={handleExtract}
                disabled={extracting || !extractText.trim()}
                className={`w-full h-11 rounded-xl font-medium text-sm transition-colors ${
                  extracting || !extractText.trim()
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                }`}
              >
                {extracting ? (
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
                    Extracting skills...
                  </span>
                ) : (
                  "Extract with AI"
                )}
              </button>

              {/* Success message */}
              {extractSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      Skills extracted successfully!
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Review and edit before saving
                    </p>
                  </div>
                </div>
              )}

              {/* Error message */}
              {extractError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Failed to extract skills
                    </p>
                    <p className="text-xs text-red-700 mt-0.5">
                      {extractError}
                    </p>
                  </div>
                </div>
              )}

              {/* Info box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-xs text-indigo-700">
                  💡 <span className="font-medium">Tip:</span> You can still
                  manually add or remove skills below after extraction.
                </p>
              </div>
            </div>

            {/* ── Divider ──────────────────────────────────────────── */}
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
