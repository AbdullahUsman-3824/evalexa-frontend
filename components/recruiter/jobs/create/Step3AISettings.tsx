"use client";

import { Plus, Sparkles, Trash2 } from "lucide-react";
import type {
  AIInterviewType,
  JobPostFormData,
  QuestionAnswerType,
  ScreeningQuestion,
  SkillWeight,
} from "./types";

interface Step3AISettingsProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

const QUESTION_TYPES: QuestionAnswerType[] = ["Text", "Yes/No", "Multiple Choice"];
const INTERVIEW_TYPES: AIInterviewType[] = ["Text-based Q&A", "Video Interview Analysis"];
const SKILL_WEIGHTS: SkillWeight[] = ["Low", "Medium", "High"];

export default function Step3AISettings({ data, onChange }: Step3AISettingsProps) {
  const scoreColor =
    data.minMatchScore < 40
      ? "text-danger"
      : data.minMatchScore < 70
        ? "text-warning"
        : "text-success";

  const addQuestion = () => {
    if (data.screeningQuestions.length >= 5) return;
    const question: ScreeningQuestion = {
      id: crypto.randomUUID(),
      text: "",
      answerType: "Text",
      required: false,
    };
    onChange("screeningQuestions", [...data.screeningQuestions, question]);
  };

  const updateQuestion = (
    id: string,
    patch: Partial<Pick<ScreeningQuestion, "text" | "answerType" | "required">>,
  ) => {
    onChange(
      "screeningQuestions",
      data.screeningQuestions.map((question) =>
        question.id === id ? { ...question, ...patch } : question,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm">
        <Sparkles className="h-6 w-6 text-cyan" />
        <div>
          <h2 className="font-syne text-xl font-semibold text-midnight">Configure AI Screening</h2>
          <p className="text-sm text-slate">
            Set how Evalexa AI should evaluate candidates
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-syne text-lg font-semibold text-midnight">AI Resume Screening</h3>
            <p className="text-sm text-slate">
              Automatically analyze and rank candidates based on their resume and your
              requirements
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("aiScreeningEnabled", !data.aiScreeningEnabled)}
            className={`relative h-8 w-14 rounded-full transition ${
              data.aiScreeningEnabled ? "bg-primary" : "bg-slate/30"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                data.aiScreeningEnabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className={data.aiScreeningEnabled ? "space-y-6" : "pointer-events-none space-y-6 opacity-50"}>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">
            Minimum Match Score
          </h3>
          <p className="mb-4 text-sm text-slate">
            Only show candidates above{" "}
            <span className={`font-semibold ${scoreColor}`}>{data.minMatchScore}%</span> match
          </p>
          <input
            type="range"
            min={0}
            max={100}
            value={data.minMatchScore}
            onChange={(e) => onChange("minMatchScore", Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="mt-2 text-xs text-slate">
            Candidates below this threshold will be filtered out.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-syne text-lg font-semibold text-midnight">Skill Weights</h3>
          <div className="space-y-3">
            {data.requiredSkills.length === 0 ? (
              <p className="text-sm text-slate">Add required skills in step 2 to configure importance.</p>
            ) : (
              data.requiredSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex flex-col gap-2 rounded-lg border border-slate/20 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-midnight">{skill}</span>
                  <div className="flex gap-2">
                    {SKILL_WEIGHTS.map((weight) => {
                      const selected = (data.skillWeights[skill] || "Medium") === weight;
                      return (
                        <button
                          key={weight}
                          type="button"
                          onClick={() =>
                            onChange("skillWeights", {
                              ...data.skillWeights,
                              [skill]: weight,
                            })
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            selected
                              ? "bg-primary text-white"
                              : "border border-slate/20 text-slate hover:bg-surface"
                          }`}
                        >
                          {weight}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-syne text-lg font-semibold text-midnight">Auto-Shortlist</h3>
              <p className="text-sm text-slate">Automatically shortlist candidates above X%</p>
            </div>
            <button
              type="button"
              onClick={() => onChange("autoShortlistEnabled", !data.autoShortlistEnabled)}
              className={`relative h-6 w-11 rounded-full transition ${
                data.autoShortlistEnabled ? "bg-primary" : "bg-slate/30"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  data.autoShortlistEnabled ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <div className="mt-3">
            <input
              type="number"
              min={0}
              max={100}
              value={data.autoShortlistThreshold}
              onChange={(e) => onChange("autoShortlistThreshold", Number(e.target.value))}
              className="h-11 w-36 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-warning">Recruiter review still required</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-syne text-lg font-semibold text-midnight">
              Screening Questions (optional)
            </h3>
            <button
              type="button"
              disabled={data.screeningQuestions.length >= 5}
              onClick={addQuestion}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add Screening Question
            </button>
          </div>
          <div className="space-y-3">
            {data.screeningQuestions.map((question) => (
              <div key={question.id} className="rounded-lg border border-slate/20 p-3">
                <div className="grid gap-3 md:grid-cols-[1fr,180px,auto,auto] md:items-center">
                  <input
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                    placeholder="Type screening question"
                    className="h-11 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <select
                    value={question.answerType}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        answerType: e.target.value as QuestionAnswerType,
                      })
                    }
                    className="h-11 rounded-lg border border-slate/25 px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-midnight">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) =>
                        updateQuestion(question.id, { required: e.target.checked })
                      }
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        "screeningQuestions",
                        data.screeningQuestions.filter((q) => q.id !== question.id),
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-syne text-lg font-semibold text-midnight">AI Interview</h3>
              <p className="text-sm text-slate">Invite top candidates for AI interview</p>
            </div>
            <button
              type="button"
              onClick={() => onChange("aiInterviewEnabled", !data.aiInterviewEnabled)}
              className={`relative h-6 w-11 rounded-full transition ${
                data.aiInterviewEnabled ? "bg-primary" : "bg-slate/30"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  data.aiInterviewEnabled ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-midnight">
              <span>Invite candidates above</span>
              <input
                type="number"
                min={0}
                max={100}
                value={data.aiInterviewThreshold}
                onChange={(e) => onChange("aiInterviewThreshold", Number(e.target.value))}
                className="h-10 w-24 rounded-lg border border-slate/25 px-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <span>% match</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {INTERVIEW_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange("aiInterviewType", type)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    data.aiInterviewType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate/20 text-midnight"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

