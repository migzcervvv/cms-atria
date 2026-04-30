import { Skeleton } from "boneyard-js/react";

export function BoneyardPageSkeleton({
  children,
  className = "",
  fallback,
  loading,
  name,
}) {
  return (
    <Skeleton
      name={name}
      loading={loading}
      animate="shimmer"
      color="#e8edf0"
      shimmerColor="#f6f8f9"
      speed="1.35s"
      transition={240}
      stagger={35}
      className={className}
      fixture={fallback}
      fallback={fallback}
    >
      {children}
    </Skeleton>
  );
}

function SkeletonLine({ className = "" }) {
  return <div className={`rounded-full bg-neutral-200 ${className}`} />;
}

export function ArticleDocumentSkeleton() {
  return (
    <main className="min-h-screen flex-1 bg-white">
      <div className="h-14 border-b border-neutral-200 bg-white px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-neutral-200" />
            <SkeletonLine className="h-3 w-28" />
          </div>
          <SkeletonLine className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      <article className="mx-auto max-w-[740px] px-5 py-10 sm:px-6 lg:py-12">
        <div className="space-y-3">
          <SkeletonLine className="mx-auto h-9 w-11/12" />
          <SkeletonLine className="mx-auto h-9 w-8/12" />
          <SkeletonLine className="mx-auto mt-4 h-7 w-28 rounded" />
        </div>
        <div className="mt-7 aspect-[16/9] w-full bg-neutral-200" />
        <div className="mt-5 flex gap-5 border-b border-neutral-900 pb-4">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-20" />
        </div>
        <div className="mt-6 space-y-4">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-11/12" />
          <SkeletonLine className="h-4 w-10/12" />
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-8/12" />
        </div>
      </article>
    </main>
  );
}

export function ArticleEditorSkeleton() {
  return (
    <main className="min-h-screen flex-1 bg-white">
      <div className="h-14 border-b border-neutral-200 bg-white px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-neutral-200" />
            <SkeletonLine className="h-3 w-32" />
          </div>
          <div className="flex gap-2">
            <SkeletonLine className="h-9 w-24 rounded-lg" />
            <SkeletonLine className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      <section className="px-5 py-10 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-[740px]">
          <SkeletonLine className="mx-auto h-10 w-10/12" />
          <SkeletonLine className="mx-auto mt-4 h-7 w-28 rounded" />
          <div className="mt-7 aspect-[16/9] w-full bg-neutral-200" />
          <div className="mt-8 space-y-4">
            <SkeletonLine className="h-4 w-7/12" />
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-11/12" />
            <SkeletonLine className="h-4 w-9/12" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function DashboardArticlesSkeleton({ view = "grid" }) {
  const items = Array.from({ length: view === "list" ? 5 : 6 });

  if (view === "list") {
    return (
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((_, index) => (
          <div key={index} className="flex items-center gap-4 py-4">
            <div className="h-[60px] w-20 shrink-0 rounded-md bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-4 w-2/3" />
              <SkeletonLine className="h-6 w-24" />
            </div>
            <div className="hidden w-44 space-y-2 md:block">
              <SkeletonLine className="h-3 w-full" />
              <SkeletonLine className="h-3 w-24" />
            </div>
            <div className="h-8 w-8 rounded-md bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((_, index) => (
        <article key={index} className="rounded-xl border border-neutral-200 bg-white p-3">
          <div className="aspect-video rounded-md bg-neutral-200" />
          <div className="mt-4 space-y-3">
            <SkeletonLine className="h-5 w-4/5" />
            <SkeletonLine className="h-5 w-3/5" />
            <SkeletonLine className="h-6 w-24" />
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <SkeletonLine className="h-3 w-36" />
                <SkeletonLine className="h-3 w-44" />
              </div>
              <div className="h-8 w-8 rounded-md bg-neutral-200" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <article key={index} className="w-full max-w-sm rounded-lg border border-neutral-200 p-3">
          <div className="h-56 rounded-md bg-neutral-200" />
          <div className="mt-4 space-y-3">
            <SkeletonLine className="h-5 w-4/5" />
            <SkeletonLine className="h-4 w-32" />
            <SkeletonLine className="h-9 w-28 rounded-lg" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function CategoryTableSkeleton() {
  return (
    <div className="w-full max-w-3xl space-y-4 p-6">
      <SkeletonLine className="h-8 w-40" />
      <div className="flex gap-2">
        <SkeletonLine className="h-10 flex-1 rounded" />
        <SkeletonLine className="h-10 w-32 rounded" />
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 border-b border-neutral-100 p-4 last:border-b-0">
            <SkeletonLine className="h-4 w-32" />
            <div className="flex justify-end gap-2">
              <SkeletonLine className="h-8 w-16 rounded" />
              <SkeletonLine className="h-8 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaLibrarySkeleton() {
  return (
    <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-hidden pr-1 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <article key={index} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="aspect-video bg-neutral-200" />
          <div className="space-y-2 p-2">
            <SkeletonLine className="h-4 w-4/5" />
            <SkeletonLine className="h-3 w-20" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function AppBootSkeleton() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 p-8 shadow-sm">
        <div className="mx-auto h-14 w-14 rounded-full bg-neutral-200" />
        <div className="mt-8 space-y-4">
          <SkeletonLine className="mx-auto h-7 w-48" />
          <SkeletonLine className="mx-auto h-4 w-64" />
          <SkeletonLine className="h-11 w-full rounded-lg" />
          <SkeletonLine className="h-11 w-full rounded-lg" />
          <SkeletonLine className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </main>
  );
}
