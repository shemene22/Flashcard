// Merge all category arrays into ALL_CARDS and derive ALL_CATEGORIES
// When adding a new category file: define a const <NAME>_CARDS in data/<file>.js and add it to the spread below.

const ALL_CARDS = [
  ...VOCAB_CARDS,
  ...HISTORY_CARDS,
  ...SCIENCE_CARDS,
  ...ECONOMICS_CARDS,
  ...NOVELS_CARDS
];

const ALL_CATEGORIES = Array.from(new Set(ALL_CARDS.map(c => c.cat))).sort();
