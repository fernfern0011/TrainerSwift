DROP TABLE IF EXISTS calculator;

CREATE TABLE IF NOT EXISTS calculator(
    traineeid INTEGER NOT NULL PRIMARY KEY,
    current_calories DECIMAL NOT NULL,
    current_carbs DECIMAL NOT NULL,
    current_protein DECIMAL NOT NULL,
    current_fat DECIMAL NOT NULL,
    target_calories_bulk DECIMAL NOT NULL,
    target_carbs_bulk DECIMAL NOT NULL,
    target_protein_bulk DECIMAL NOT NULL,
    target_fat_bulk DECIMAL NOT NULL,
    target_calories_cut DECIMAL NOT NULL,
    target_carbs_cut DECIMAL NOT NULL,
    target_protein_cut DECIMAL NOT NULL,
    target_fat_cut DECIMAL NOT NULL
);