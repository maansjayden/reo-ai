import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "REO — AI Workplace Productivity Assistant" },
      { name: "description", content: "REO is an AI powered workplace assistant with email drafting, meeting summaries, task planning, research and chat." },
      { property: "og:title", content: "REO — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "REO is an AI powered workplace assistant with email drafting, meeting summaries, task planning, research and chat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "REO — AI Workplace Productivity Assistant" },
      { name: "twitter:description", content: "REO is an AI powered workplace assistant with email drafting, meeting summaries, task planning, research and chat." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0ba077b9-c1fa-4b68-9af4-be5a536909a0/id-preview-0fb95be4--32384168-c52e-448e-872c-94631c4d8ae1.lovable.app-1783574394570.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0ba077b9-c1fa-4b68-9af4-be5a536909a0/id-preview-0fb95be4--32384168-c52e-448e-872c-94631c4d8ae1.lovable.app-1783574394570.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
