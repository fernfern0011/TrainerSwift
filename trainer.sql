CREATE TABLE Account (
    TrainerID varchar(50) NOT NULL,
    Email varchar(100) NOT NULL,
    Password varchar(50) NOT NULL,
    StripeID varchar(50) NOT NULL,
    PRIMARY KEY (TrainerID),
    UNIQUE (TrainerID, Email)
);

CREATE TABLE Category (
    CatID varchar(50) NOT NULL,
    CatName varchar(50) NOT NULL,
    PRIMARY KEY (CatID),
    UNIQUE (CatID, CatName)
);

CREATE TABLE Certification (
    TrainerID varchar(50) NOT NULL,
    CertID varchar(50) NOT NULL,
    CertDetail varchar(50),
    CatID varchar(50) NOT NULL,
    PRIMARY KEY (CertID),
    FOREIGN KEY (TrainerID) REFERENCES Account(TrainerID),
    FOREIGN KEY (CatID) REFERENCES Category(CatID),
    UNIQUE (CertID)
);

CREATE TABLE Info (
    TrainerID varchar(50) NOT NULL,
    Bio varchar(100),
    Img varchar(50),
    Height decimal(10,2),
    Weight decimal(10,2),
    DateOfBirth date,
    Verified boolean NOT NULL,
    Gender varchar(25),
    PRIMARY KEY (TrainerID),
    FOREIGN KEY (TrainerID) REFERENCES Account(TrainerID),
    UNIQUE (TrainerID)
);

INSERT INTO Account (TrainerID, Email, Password, StripeID) VALUES ('Sathwik123', 'Sathwik123@gmail.com', 'password123', '123412341234');
INSERT INTO Account (TrainerID, Email, Password, StripeID) VALUES ('Dylan444', 'dylan444@gmail.com', '44444444', '23423423412');
INSERT INTO Account (TrainerID, Email, Password, StripeID) VALUES ('jiaqing123', 'jiaqing123@gmail.com', 'password123', '78375235523');
INSERT INTO Account (TrainerID, Email, Password, StripeID) VALUES ('fernfernfern', 'fern@gmail.com', 'password123', '78375235523');
INSERT INTO Account (TrainerID, Email, Password, StripeID) VALUES ('marco', 'marco@gmail.com', 'password123', '78375235523');
INSERT INTO Account (TrainerID, Email, Password, StripeID) VALUES ('melody234', 'melody234@gmail.com', 'password123', '78375235523');

INSERT INTO Category (CatID, CatName) VALUES ('PCI', 'Pre-Choreographed Instructor');
INSERT INTO Category (CatID, CatName) VALUES ('FI', 'Fitness Instructor');
INSERT INTO Category (CatID, CatName) VALUES ('GEI', 'Group Exercise Instructor');
INSERT INTO Category (CatID, CatName) VALUES ('PT', 'Personal Trainer');
INSERT INTO Category (CatID, CatName) VALUES ('ES', 'Exercise Specialist');

INSERT INTO Certification (TrainerID, CertID, CertDetail, CatID) VALUES ('Sathwik123', 'PCI1322534', 'Zumba Certification', 'PCI');
INSERT INTO Certification (TrainerID, CertID, CertDetail, CatID) VALUES ('Sathwik123', 'PCI1322535', 'Zumba Certification', 'PCI');
INSERT INTO Certification (TrainerID, CertID, CertDetail, CatID) VALUES ('Sathwik123', 'PT195834', 'Personal Trainer Certification', 'PT');
INSERT INTO Certification (TrainerID, CertID, CertDetail, CatID) VALUES ('Dylan444', 'FI10582', 'Fitness Instructor Certification', 'FI');
INSERT INTO Certification (TrainerID, CertID, CertDetail, CatID) VALUES ('marco', 'GEI1383572', 'Group Exercise Instructor Certification', 'GEI');
INSERT INTO Certification (TrainerID, CertID, CertDetail, CatID) VALUES ('fernfernfern', 'ES135825', 'MSc in Physiotheraphy', 'ES');

INSERT INTO Info (TrainerID, Bio, Img, Height, Weight, DateOfBirth, Verified, Gender) VALUES ('Sathwik123', 'Sathwik is a trained personal trainer with 10 years of experience. He has been certified by... ', 'sathwik.jpg', 179.2, 70, '2000-02-09', TRUE, 'Male');
INSERT INTO Info (TrainerID, Bio, Img, Height, Weight, DateOfBirth, Verified, Gender) VALUES ('marco', 'Marco is a trained personal trainer with 10 years of experience. He has been certified by... ', 'marco.jpg', 179.2, 70, '2000-02-09', TRUE, 'Male');
INSERT INTO Info (TrainerID, Bio, Img, Height, Weight, DateOfBirth, Verified, Gender) VALUES ('Dylan444', 'Dylan is a trained personal trainer with 10 years of experience. He has been certified by... ', 'dylan444.jpg', 179.2, 70, '2000-02-09', FALSE, 'Male');
INSERT INTO Info (TrainerID, Bio, Img, Height, Weight, DateOfBirth, Verified, Gender) VALUES ('jiaqing123', 'Jia Qing is a trained personal trainer with 10 years of experience. He has been certified by... ', 'jiaqing123.jpg', 179.2, 70, '2000-02-09', FALSE, 'Male');
INSERT INTO Info (TrainerID, Bio, Img, Height, Weight, DateOfBirth, Verified, Gender) VALUES ('fernfernfern', 'Fern is a trained personal trainer with 10 years of experience. She has been certified by... ', 'fern.jpg', 179.2, 70, '2000-02-09', TRUE, 'Female');
INSERT INTO Info (TrainerID, Bio, Img, Height, Weight, DateOfBirth, Verified, Gender) VALUES ('melody234', 'Melody is a trained personal trainer with 10 years of experience. She has been certified by... ', 'melody.jpg', 179.2, 70, '2000-02-09', TRUE, 'Female');

