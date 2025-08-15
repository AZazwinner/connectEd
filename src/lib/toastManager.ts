import type { Achievement } from './achievements';

// The name of our custom event. Must be unique.
export const SHOW_ACHIEVEMENT_TOAST_EVENT = 'showachievementtoast';

/**
 * A global function to dispatch the achievement toast event.
 * Any component can call this function to trigger the notification.
 * @param achievement The achievement object to display.
 */
export function showAchievementToast(achievement: Achievement) {
  // Create a new custom event with the achievement data in the 'detail' property
  const event = new CustomEvent(SHOW_ACHIEVEMENT_TOAST_EVENT, {
    detail: { achievement },
  });
  // Dispatch the event on the window, making it available globally
  window.dispatchEvent(event);
}