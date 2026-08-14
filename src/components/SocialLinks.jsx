import { Facebook, Instagram } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import TikTokIcon from "./icons/TikTokIcon";
import { socialItems } from "../data/socialLinks";

const ICONS = {
  whatsapp: WhatsAppIcon,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: TikTokIcon,
};

export default function SocialLinks({
  className,
  itemClassName,
  iconClassName,
}) {
  return (
    <div className={className}>
      {socialItems.map(({ id, label, href }) => {
        const Icon = ICONS[id];
        return (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={itemClassName}
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
}
