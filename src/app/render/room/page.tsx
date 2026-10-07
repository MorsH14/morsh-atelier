import { notFound } from "next/navigation";
import RenderRoom from "@/components/RenderRoom";

/** Dev-only: the styled living room that scripts/room.mjs photographs. */
export default function RoomRenderPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RenderRoom />;
}
