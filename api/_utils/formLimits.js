const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function trimStr(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

export function isValidEmail(value) {
  return EMAIL_RE.test(value) && value.length <= 254;
}

export const CONTACT_LIMITS = {
  name: 200,
  email: 254,
  phone: 50,
  project: 200,
  location: 200,
  area: 80,
  requirements: 5000,
};

export const CAREER_LIMITS = {
  name: 200,
  email: 254,
  phone: 50,
  position: 200,
  message: 5000,
};
