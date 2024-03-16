DROP TABLE IF EXISTS meal;

CREATE TABLE IF NOT EXISTS meal(
    clientid INTEGER NOT NULL,
    mealid SERIAL NOT NULL PRIMARY KEY,
    foodname TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    calories DECIMAL NOT NULL,
    carbs DECIMAL NOT NULL,
    protein DECIMAL NOT NULL,
    fat DECIMAL NOT NULL,
    date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (1, 'Chicken', 1, 30, 15, 20, 5);
INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (2, 'Chicken', 2, 60, 30, 40, 10);
INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (3, 'Chicken', 3, 90, 45, 60, 15);