import type { SVGProps } from "react";
import type { ServiceId } from "../data/services";
import {
  AlbumIcon,
  DecorationIcon,
  EditingIcon,
  FoodIcon,
  PhotoEditingIcon,
  PhotographyIcon,
  TourIcon,
  VideographyIcon,
} from "./icons";

/* Kept out of icons.tsx so that file exports only components, which is
   what React Fast Refresh needs to hot-reload it. */
type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

export const serviceIcons: Partial<Record<string, IconComponent>> = {
  decoration: DecorationIcon,
  food: FoodIcon,
  "photography-videography": PhotographyIcon,
  "tour-planning-organizing": TourIcon,

  /* The individual services inside Photography & Videography. Ids from the
     content, like the four above; anything the map does not know falls back
     to the neutral mark. */
  "candid-photography": PhotographyIcon,
  "traditional-photography": PhotographyIcon,
  "pre-wedding-photography": PhotographyIcon,
  "cinematic-videography": VideographyIcon,
  "traditional-videography": VideographyIcon,
  "album-design": AlbumIcon,
  "video-editing": EditingIcon,
  "photo-editing": PhotoEditingIcon,
};

/* Services added through the content manager get a generated id, which has no
   entry above. Rendering `serviceIcons[id]` directly would evaluate to
   undefined and throw "Element type is invalid", taking the whole page down,
   so fall back to a neutral mark instead. */
export function iconFor(id: ServiceId | string): IconComponent {
  return serviceIcons[id] ?? DecorationIcon;
}
