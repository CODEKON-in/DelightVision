import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";

/* The site is a shop window with a phone number on it. If a page ever
   throws — a broken link someone pasted, a typo in the content — a blank
   white screen is the one outcome that costs a booking, so the error is
   caught here and the visitor still gets the number to call. */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("[page]", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <h1 className="type-heading text-3xl text-charcoal sm:text-4xl">
          {ui.somethingWentWrongTitle}
        </h1>
        <p className="mt-4 text-lg text-muted">{ui.somethingWentWrong}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            href={telHref}
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-56"
            icon={<PhoneIcon className="size-6" />}
          >
            {ui.callNow}
          </Button>

          <Button
            href={whatsappHrefFor(business.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-56"
            icon={<WhatsAppIcon className="size-6" />}
          >
            {ui.whatsapp}
          </Button>
        </div>
      </div>
    );
  }
}
