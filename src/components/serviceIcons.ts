import type { SVGProps } from "react";
import type { ServiceId } from "../data/services";
import { DecorationIcon, FoodIcon, PhotographyIcon } from "./icons";

/* Kept out of icons.tsx so that file exports only components, which is
   what React Fast Refresh needs to hot-reload it. */
type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

export const serviceIcons: Partial<Record<string, IconComponent>> = {
  decoration: DecorationIcon,
  food: FoodIcon,
  "photography-videography": PhotographyIcon,
};

/* Services added through the content manager get a generated id, which has no
   entry above. Rendering `serviceIcons[id]` directly would evaluate to
   undefined and throw "Element type is invalid", taking the whole page down,
   so fall back to a neutral mark instead. */
export function iconFor(id: ServiceId | string): IconComponent {
  return serviceIcons[id] ?? DecorationIcon;
}
