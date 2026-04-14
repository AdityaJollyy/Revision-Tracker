import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-0 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 animate-scale-in">
        <SignUp />
      </div>
    </div>
  );
}
