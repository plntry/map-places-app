export const getUkrainianDayWord = (days: number) => {
  return days % 10 == 1 && days !== 11
    ? "день"
    : days % 10 == 2 && days !== 12
    ? "дні"
    : days % 10 == 3 && days !== 13
    ? "дні"
    : days % 10 == 4 && days !== 14
    ? "дні"
    : "днів";
};
