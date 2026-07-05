import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to dashboard (main app entry point)
  // Public landing page is available at /pricing, /features, /contact
  redirect("/dashboard");
}
