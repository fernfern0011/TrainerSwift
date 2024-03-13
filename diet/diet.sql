DROP TABLE IF EXISTS meal;

CREATE TABLE IF NOT EXISTS meal(
    clientid integer NOT NULL PRIMARY KEY
    mealid serial NOT NULL,
    foodname text NOT NULL,
    quantity integer NOT NULL,
    calories decimal NOT NULL,
    carbs decimal NOT NULL,
    protein decimal NOT NULL,
    fat decimal NOT NULL
);

INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (1, 'Chicken', 1, 30, 15, 20, 5);
INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (2, 'Chicken', 2, 60, 30, 40, 10);
INSERT INTO meal (clientid, foodname, quantity, calories, carbs, protein, fat) VALUES (3, 'Chicken', 3, 90, 45, 60, 15);