# KartuWords Technical Specification

## 1. Data Architecture (Nested Arrays)
The application uses a 5-element nested array structure across all levels to maintain consistent indexing for translations.



### Word Item Array
`[emoji, georgian, audio_url, english, russian]`
* **Index 3**: English Translation.
* **Index 4**: Russian Translation.

### Subcategory Array
`[emoji, georgian, word_list, english, russian]`
* **Index 2**: The array of Word Items.
* **Index 3**: English Label.
* **Index 4**: Russian Label.

### Category Array
`[emoji, georgian, subcategory_list, english, russian]`
* **Index 2**: The array of Subcategory Arrays.
* **Index 3**: English Label.
* **Index 4**: Russian Label.

---

## 2. Dynamic Card Display Logic
Cards in all grids (Categories, Subcategories, and Study Answers) dynamically update based on the **Settings**:
* **Mode: "No Words"**: Display only index 0 (Emoji).
* **Mode: "English"**: Display index 0 (Emoji) + index 3 (English).
* **Mode: "Russian"**: Display index 0 (Emoji) + index 4 (Russian).

---

## 3. View States & Transitions
* **Layout**: All selection screens use a 2x3 grid (max 6 items).
* **Navigation**:
    * **Forward**: Slide current view left; slide next view in from the right.
    * **Backward**: Slide current view right; slide previous view in from the left.

---

## 4. Study Mode Logic
* **Prompt**: Display Georgian word (Index 1) and Audio button (Index 2).
* **Selection**: Choose a random item from the subcategory.
* **Distractors**: 5 random items are pulled from the same subcategory to fill the 6-slot grid.
* **Validation**: Immediate color feedback (Green/Red). Advance after a short delay on success.
* **Optimization**: Preload the next audio link while the user is on the current word.

---

## 5. Header & Settings
* **Breadcrumbs**: Left-aligned icons for Home > Category > Subcategory.
* **Settings**: Right-aligned settings icon.
* **Audio Toggle**: Controls both auto-play and data fetching (don't load if off). (in settings)
* **Language Selection**: Inline radio buttons for translation display (None, English, Russian). (in settings)
