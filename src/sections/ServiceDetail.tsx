import { useState } from "react";
import { Modal } from "../components/Modal";
import { ServiceBody } from "../components/ServiceBody";
import { type Service } from "../data/services";

type Props = {
  service: Service | null;
  onClose: () => void;
};

export function ServiceDetail({ service, onClose }: Props) {
  /* Hold on to the last service so its content stays on screen while the
     modal plays its closing animation, instead of blanking instantly.
     Derived during render, so there is no extra paint. */
  const [shown, setShown] = useState(service);
  /* One of `shown`'s individual services, opened in place of it. Cleared
     whenever a different service is opened from outside. */
  const [sub, setSub] = useState<Service | null>(null);
  if (service && service !== shown) {
    setShown(service);
    setSub(null);
  }
  /* Also on close, so reopening the same service starts at the service
     itself rather than on the individual one last looked at. */
  if (!service && sub) setSub(null);

  const open = sub ?? shown;

  return (
    <Modal
      open={service !== null}
      onClose={onClose}
      labelledBy={open ? `service-title-${open.id}` : "service-title"}
    >
      {open && (
        <ServiceBody
          /* Keyed so switching to an individual service starts the body
             afresh — it scrolls back to the top and plays its reveals. */
          key={open.id}
          service={open}
          onOpenSub={setSub}
          back={sub && shown ? { name: shown.name, onBack: () => setSub(null) } : undefined}
        />
      )}
    </Modal>
  );
}
