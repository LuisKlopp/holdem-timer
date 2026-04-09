"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

import {
  appendPodiumRecord,
  clearPodiumRecords,
  type PodiumRecord,
  readPodiumRecords,
} from "@/lib/podiumStorage";

type PodiumForm = {
  firstPlace: string;
  secondPlace: string;
};

const INITIAL_FORM: PodiumForm = {
  firstPlace: "",
  secondPlace: "",
};

export default function PodiumPage() {
  const [form, setForm] = useState<PodiumForm>(INITIAL_FORM);
  const [isHydrated, setIsHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [records, setRecords] = useState<PodiumRecord[]>([]);

  useEffect(() => {
    const nextRecords = readPodiumRecords();

    setRecords(nextRecords);
    setSavedAt(nextRecords[nextRecords.length - 1]?.createdAt ?? null);
    setIsHydrated(true);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const savedRecord = appendPodiumRecord(form);

    if (!savedRecord) {
      return;
    }

    setRecords((previousRecords) => [...previousRecords, savedRecord]);
    setSavedAt(savedRecord.createdAt);
    setForm(INITIAL_FORM);
  };

  const handleClearInputs = () => {
    setForm(INITIAL_FORM);
  };

  const handleReset = () => {
    const shouldReset = window.confirm(
      "누적된 경기 기록이 모두 삭제됩니다. 계속하시겠습니까?"
    );

    if (!shouldReset) {
      return;
    }

    clearPodiumRecords();
    setSavedAt(null);
    setRecords([]);
    setForm(INITIAL_FORM);
  };

  const formattedSavedAt = savedAt
    ? new Date(savedAt).toLocaleString("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050816] px-3 py-4 text-white sm:px-4 sm:py-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-5xl flex-col gap-5">
        <header className="mt-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-amber-200/60 uppercase">
              Podium Entry
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[0.08em] text-white sm:text-4xl">
              1등 / 2등 닉네임 입력
            </h1>
            <p className="mt-2 text-sm text-white/55 sm:text-base">
              게임이 끝날 때마다 누적 저장됩니다. 브라우저에만 남고 다른 곳으로
              전송되지는 않습니다.
            </p>
          </div>

          <Link
            className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
            href="/"
          >
            메인으로
          </Link>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
          <form
            className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
                  Local Form
                </p>
                <p className="mt-2 text-sm text-white/55">
                  저장할 때마다 기록이 하나씩 누적됩니다.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                {records.length}경기
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="rounded-[1.5rem] border border-amber-300/16 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-[0.18em] text-amber-200 uppercase">
                    1st Place
                  </span>
                  <span className="rounded-full bg-amber-300/14 px-2.5 py-1 text-xs font-semibold text-amber-100">
                    Winner
                  </span>
                </div>
                <input
                  className="mt-3 w-full border-none bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/28"
                  maxLength={24}
                  onChange={(event) =>
                    setForm((previousForm) => ({
                      ...previousForm,
                      firstPlace: event.target.value,
                    }))
                  }
                  placeholder="1등 닉네임"
                  required
                  value={form.firstPlace}
                />
              </label>

              <label className="rounded-[1.5rem] border border-sky-300/16 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-[0.18em] text-sky-200 uppercase">
                    2nd Place
                  </span>
                  <span className="rounded-full bg-sky-300/14 px-2.5 py-1 text-xs font-semibold text-sky-100">
                    Runner-up
                  </span>
                </div>
                <input
                  className="mt-3 w-full border-none bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/28"
                  maxLength={24}
                  onChange={(event) =>
                    setForm((previousForm) => ({
                      ...previousForm,
                      secondPlace: event.target.value,
                    }))
                  }
                  placeholder="2등 닉네임"
                  required
                  value={form.secondPlace}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="btn-press-in rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 px-5 py-3 text-sm font-bold text-slate-900"
                type="submit"
              >
                기록 추가
              </button>
              <button
                className="btn-press-in rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white/82"
                onClick={handleClearInputs}
                type="button"
              >
                입력 비우기
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-xs text-white/42">
                {formattedSavedAt
                  ? `마지막 기록: ${formattedSavedAt}`
                  : "아직 저장된 경기 결과가 없습니다."}
              </p>

              <button
                className="btn-press-in rounded-full border border-white/8 bg-transparent px-2.5 py-1 text-[11px] font-medium text-white/28 transition hover:border-rose-300/20 hover:text-rose-100"
                onClick={handleReset}
                type="button"
              >
                기록 전체 삭제
              </button>
            </div>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
              Live Preview
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              시상대 미리보기
            </h2>

            <div className="mt-5 grid gap-4">
              <article className="relative overflow-hidden rounded-[1.75rem] border border-amber-200/15 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),rgba(255,255,255,0.04))] p-5">
                <div className="absolute -top-6 right-4 h-20 w-20 rounded-full bg-amber-200/14 blur-2xl" />
                <p className="text-xs font-semibold tracking-[0.24em] text-amber-100/75 uppercase">
                  1st
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {isHydrated && form.firstPlace
                    ? form.firstPlace
                    : "우승 닉네임"}
                </p>
                <p className="mt-2 text-sm text-amber-50/70">
                  가장 높은 자리의 닉네임이 이 카드에 표시됩니다.
                </p>
              </article>

              <article className="relative overflow-hidden rounded-[1.75rem] border border-sky-200/15 bg-[linear-gradient(135deg,rgba(56,189,248,0.2),rgba(255,255,255,0.04))] p-5">
                <div className="absolute -top-6 right-4 h-20 w-20 rounded-full bg-sky-200/14 blur-2xl" />
                <p className="text-xs font-semibold tracking-[0.24em] text-sky-100/75 uppercase">
                  2nd
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {isHydrated && form.secondPlace
                    ? form.secondPlace
                    : "준우승 닉네임"}
                </p>
                <p className="mt-2 text-sm text-sky-50/70">
                  두 번째 자리의 닉네임이 이 카드에 표시됩니다.
                </p>
              </article>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-[0.18em] text-white/82 uppercase">
                  Recent Results
                </p>
                <span className="text-xs text-white/45">최신순</span>
              </div>

              <div className="mt-4 space-y-2">
                {isHydrated && records.length > 0 ? (
                  records
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between rounded-[1.1rem] border border-white/8 bg-white/5 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {record.firstPlace}
                          </p>
                          <p className="truncate text-xs text-white/45">
                            2등 {record.secondPlace}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-white/40">
                          {new Date(record.createdAt).toLocaleDateString(
                            "ko-KR",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-white/45">
                    아직 누적된 경기 결과가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
