import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import SelectionDrawer from "@/components/SelectionDrawer";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SelectionProvider } from "@/context/Selection";
import { BRAND } from "@/lib/brand";

/** Everything shared by every page: cart state, nav, drawer, footer, WhatsApp button. */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SelectionProvider>
      <SmoothScroll />
      <Reveal />
      <Nav />
      {children}
      <footer className="foot-wrap dark">
        <div className="foot wrap">
        <div className="logo">
          {BRAND.name}
          <span>{BRAND.suffix}</span>
        </div>
        <p>{BRAND.tagline}</p>
        <p>WhatsApp {BRAND.whatsappDisplay}</p>
        <small>© {new Date().getFullYear()} MORSH Atelier</small>
        </div>
      </footer>
      <WhatsAppFab />
      <SelectionDrawer />
    </SelectionProvider>
  );
}
