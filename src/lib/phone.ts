export function digits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function telHref(phone: string) {
  return `tel:+${digits(phone)}`;
}

export function waHref(phone: string, text: string) {
  return `https://wa.me/${digits(phone)}?text=${encodeURIComponent(text)}`;
}
