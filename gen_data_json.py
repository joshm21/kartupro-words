import csv
import json
import sys


def convert_to_kartu_json():
    # 1. Process Words (list.csv)
    # Grouped by subcategory English name
    words_by_sub = {}
    try:
        with open('list.csv', mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Sort rows by subcat order (though they will be grouped later)
            sorted_words = sorted(reader, key=lambda x: int(x['subcat order']))

            for row in sorted_words:
                sub_key = row['subcategory']
                # Word Array: [emoji, georgian, audio, english, russian]
                word_arr = [row['emoji'], row['georgian'],
                            row['audio'], row['english'], row['russian']]

                if sub_key not in words_by_sub:
                    words_by_sub[sub_key] = []
                words_by_sub[sub_key].append(word_arr)
    except FileNotFoundError:
        print("Error: list.csv not found.")
        sys.exit(1)

    # 2. Process Subcategories (subcategories.csv)
    # Grouped by parent category English name
    subs_by_cat = {}
    try:
        with open('subcategories.csv', mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Sort by the subcat order column
            sorted_subs = sorted(reader, key=lambda x: int(x['subcat order']))

            for row in sorted_subs:
                parent_key = row['parent category']
                sub_eng_name = row['english']
                # Subcategory Array: [emoji, georgian, word_list, english, russian]
                sub_arr = [
                    row['emoji'],
                    row['georgian'],
                    words_by_sub.get(sub_eng_name, []),
                    row['english'],
                    row['russian']
                ]

                if parent_key not in subs_by_cat:
                    subs_by_cat[parent_key] = []
                subs_by_cat[parent_key].append(sub_arr)
    except FileNotFoundError:
        print("Error: subcategories.csv not found.")
        sys.exit(1)

    # 3. Process Categories (categories.csv)
    final_data = []
    try:
        with open('categories.csv', mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Sort by the category order column
            sorted_cats = sorted(reader, key=lambda x: int(x['order']))

            for row in sorted_cats:
                cat_eng_name = row['english']
                # Category Array: [emoji, georgian, sub_list, english, russian]
                cat_arr = [
                    row['emoji'],
                    row['georgian'],
                    subs_by_cat.get(cat_eng_name, []),
                    row['english'],
                    row['russian']
                ]
                final_data.append(cat_arr)
    except FileNotFoundError:
        print("Error: categories.csv not found.")
        sys.exit(1)

    # 4. Save Output
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print("Success: data.json created and sorted by order columns.")


if __name__ == "__main__":
    convert_to_kartu_json()
