import { v4 } from "uuid";
const GUEST_USER_KEY = "guestUserId";
export const getGuestUserId = (): string => {
  let userId = localStorage.getItem(GUEST_USER_KEY);
  if (!userId) {
    userId = v4();
    localStorage.setItem(GUEST_USER_KEY, userId);
  }
  return userId;
};

export const removeGuestUserId = () => {
  localStorage.removeItem(GUEST_USER_KEY);
};
