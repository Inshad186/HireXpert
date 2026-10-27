import type { ReactNode } from "react";
import authBag from "@/assets/auth_bg.jpg";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  imagePosition?: "left" | "right";
}

const ImageSection = () => {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-indigo-950"
      style={{
        backgroundImage: `url(${authBag})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for readable text */}
      <div className="absolute inset-0 bg-indigo-950/75" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-indigo-950/20 to-slate-950/70" />

      <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-lg">
            <span className="text-xl font-extrabold">H</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Hire<span className="text-indigo-400">Xpert</span>
          </h2>
        </div>

        {/* Main content */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Freelance. Connect. Grow.
          </p>

          <p className="text-4xl font-bold leading-tight text-white lg:text-5xl">
            Your Skills.
            <br />
            Your Services.
            <br />
            Your Success.
          </p>

          <p className="mt-5 max-w-md text-base leading-7 text-indigo-100/80 lg:text-lg lg:leading-8">
            Connect with clients, showcase your expertise, and turn your
            skills into opportunities. Find the right talent or grow your
            freelance career with HireXpert.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 flex flex-wrap gap-3">
            {["Find Talent", "Showcase Skills", "Grow Your Career"].map(
              (feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {feature}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div>
          <div className="h-px bg-white/20" />
          <p className="mt-5 text-sm text-indigo-100/70">
            Built for freelancers. Designed for opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export function AuthLayout({ title, subtitle, children, imagePosition = "left" }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-white to-slate-800 p-2 sm:p-6">
      <div className="relative flex h-full max-h-[900px] w-full max-w-6xl overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10 sm:rounded-[28px]">
        {/* Image panel: decorative, so screen readers skip it */}
        <div
          aria-hidden="true"
          className={`hidden h-full w-1/2 md:block ${imagePosition === "right" ? "order-2" : ""}`}
        >
          <ImageSection />
        </div>

        {/* Form panel (with the change from point 1) */}
        <div
          className="flex h-full w-full min-w-0 flex-col overflow-y-auto bg-white md:w-1/2"
          style={{
            paddingLeft: "clamp(16px, 4vw, 56px)",
            paddingRight: "clamp(16px, 4vw, 56px)",
            paddingTop: "clamp(12px, 4vh, 40px)",
            paddingBottom: "clamp(12px, 4vh, 40px)",
          }}
        >
          <div className="mx-auto my-auto w-full min-w-0 max-w-md">
            <div style={{ marginBottom: "clamp(12px, 3vh, 32px)" }}>
              <h1
                className="break-words font-bold tracking-tight text-slate-900"
                style={{ fontSize: "clamp(1.25rem, 4vh, 1.875rem)", lineHeight: 1.25 }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className="mt-2 break-words leading-relaxed text-slate-500"
                  style={{ fontSize: "clamp(0.75rem, 2vh, 1rem)" }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
