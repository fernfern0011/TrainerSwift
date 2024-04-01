DROP TABLE IF EXISTS calculator;

CREATE TABLE IF NOT EXISTS calculator(
    traineeid INTEGER NOT NULL PRIMARY KEY,
    current_calories TEXT NOT NULL,
    current_carbs INTEGER NOT NULL,
    current_protein DECIMAL NOT NULL,
    current_fat DECIMAL NOT NULL,
    target_calories_bulk TEXT NOT NULL,
    target_carbs_bulk INTEGER NOT NULL,
    target_protein_bulk DECIMAL NOT NULL,
    target_fat_bulk DECIMAL NOT NULL,
    target_calories_cut TEXT NOT NULL,
    target_carbs_cut INTEGER NOT NULL,
    target_protein_cut DECIMAL NOT NULL,
    target_fat_cut DECIMAL NOT NULL,
);