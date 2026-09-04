import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/certification/TopBar";
import { AuthForm } from "@/components/auth/AuthForm";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in · TradeForge Arena" },
      {
        name: "description",
        content:
          "Create your TradeForge Arena account to save your progress, Decision Journal and certificate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Sign in · TradeForge Arena" },
      {
        property: "og:description",
        content: "Create your account to unlock the institutional certification.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="tf-grid-bg min-h-screen bg-background text-foreground">
      <TopBar />
      <div className="mx-auto max-w-md px-5 py-10 sm:py-16">
        <AuthForm
          initialMode="signin"
          onAuthenticated={() => void navigate({ to: "/certification" })}
        />
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("auth.requiredNotice")}
        </p>
      </div>
    </div>
  );
}
