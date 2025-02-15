import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "../interactions";

export interface UsePageViewsOptions {
  gaMeasurementId?: string;
  ignoreHashChange?: boolean;
  disabled?: boolean;
}

export function usePageViews({
  gaMeasurementId,
  ignoreHashChange,
  disabled,
}: UsePageViewsOptions = {}): void {
  const router = useRouter();

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleRouteChange = (url: URL): void => {
      const _gaMeasurementId =
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? gaMeasurementId;

      pageView({ path: url.toString() }, _gaMeasurementId);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    if (!ignoreHashChange) {
      router.events.on("hashChangeComplete", handleRouteChange);
    }

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);

      if (!ignoreHashChange) {
        router.events.off("hashChangeComplete", handleRouteChange);
      }
    };
  }, [router.events, gaMeasurementId, ignoreHashChange]);
}
