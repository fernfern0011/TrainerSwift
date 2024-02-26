CREATE TABLE Account(
    TrainerID varchar(50) NOT NULL,
    Email varchar(100) NOT NULL,
    Password varchar(50) NOT NULL,
    PRIMARY KEY (TrainerID),
    UNIQUE(TrainerID, Email)
    );
    
    
CREATE TABLE Category(
    CatID varchar(50) NOT NULL,
    CatName varchar(50) NOT NULL,
    PRIMARY KEY (CatID),
    UNIQUE( CatID, CatName)
	);
    
CREATE TABLE Certification(
    TrainerID varchar(50) NOT NULL,
    CertID varchar(50) NOT NULL,
    CertDetail varchar(50),
    CatID varchar(50) NOT NULL,
    PRIMARY KEY (CertID),
    FOREIGN KEY (TrainerID) REFERENCES Account(TrainerID),
    FOREIGN KEY (CatID) REFERENCES Category(CatID),
    UNIQUE(CertID)
    );
    
CREATE TABLE Info(
	TrainerID varchar(50) NOT NULL,
    StripeID varchar(50) NOT NULL,
    Bio varchar(100),
    Img varchar(50),
    Height decimal(10,2),
    Weight decimal(10,2),
    DateOfBirth date,
    Verified boolean NOT NULL,
    Gender varchar(25),
    PRIMARY KEY (TrainerID),
    FOREIGN KEY (TrainerID) REFERENCES Account(TrainerID),
    UNIQUE(TrainerID, StripeID)
    );
    
CREATE TABLE BankAccount(
    TrainerID varchar(50) NOT NULL,
    AccountNum varchar(50) NOT NULL,
    BankName varchar(50) NOT NULL,
    PRIMARY KEY (TrainerID),
    FOREIGN KEY (TrainerID) REFERENCES Account(TrainerID),
    UNIQUE(TrainerID, AccountName)
    );


INSERT INTO `account` (`TrainerID`, `Email`, `Password`) VALUES ('Sathwik123', 'Sathwik123@gmail.com', 'password123');
INSERT INTO `account` (`TrainerID`, `Email`, `Password`) VALUES ('Dylan444', 'dylan444@gmail.com', '44444444');
INSERT INTO `account` (`TrainerID`, `Email`, `Password`) VALUES ('jiaqing123', 'jiaqing123@gmail.com', 'password123');
INSERT INTO `account` (`TrainerID`, `Email`, `Password`) VALUES ('fernfernfern', 'fern@gmail.com', 'password123');
INSERT INTO `account` (`TrainerID`, `Email`, `Password`) VALUES ('marco', 'marco@gmail.com', 'password123');
INSERT INTO `account` (`TrainerID`, `Email`, `Password`) VALUES ('melody234', 'melody234@gmail.com', 'password123');

INSERT INTO `bankaccount` (`TrainerID`, `AccountNum`, `BankName`) VALUES ('Sathwik123', '123-12312-3', 'DBS Bank');
INSERT INTO `bankaccount` (`TrainerID`, `AccountNum`, `BankName`) VALUES ('marco', '098-12346-4', 'POSB Bank');
INSERT INTO `bankaccount` (`TrainerID`, `AccountNum`, `BankName`) VALUES ('jiaqing123', '3-235623-6', 'OCBC Bank');
INSERT INTO `bankaccount` (`TrainerID`, `AccountNum`, `BankName`) VALUES ('Dylan444', '1234-1237-3', 'Bank of China');
INSERT INTO `bankaccount` (`TrainerID`, `AccountNum`, `BankName`) VALUES ('fernfernfern', '5666-1223462-3', 'UOB Bank');
INSERT INTO `bankaccount` (`TrainerID`, `AccountNum`, `BankName`) VALUES ('melody234', '634-1236412-3', 'HSBC Bank');

INSERT INTO `category` (`CatID`, `CatName`) VALUES ('PCI', 'Pre-Choreographed Instructor');
INSERT INTO `category` (`CatID`, `CatName`) VALUES ('FI', 'Fitness Instructor');
INSERT INTO `category` (`CatID`, `CatName`) VALUES ('GEI', 'Group Exercise Instructor');
INSERT INTO `category` (`CatID`, `CatName`) VALUES ('PT', 'Personal Trainer');
INSERT INTO `category` (`CatID`, `CatName`) VALUES ('ES', 'Exercise Specialist');

INSERT INTO `certification` (`TrainerID`, `CertID`, `CertDetail`, `CatID`) VALUES ('Sathwik123', 'PCI1322534', 'Zumba Certification', 'PCI');
INSERT INTO `certification` (`TrainerID`, `CertID`, `CertDetail`, `CatID`) VALUES ('Sathwik123', 'PCI1322534', 'Zumba Certification', 'PCI');
INSERT INTO `certification` (`TrainerID`, `CertID`, `CertDetail`, `CatID`) VALUES ('Sathwik123', 'PT195834', 'Personal Trainer Certification', 'PT');
INSERT INTO `certification` (`TrainerID`, `CertID`, `CertDetail`, `CatID`) VALUES ('Dylan444', 'FI10582', 'Fitness Instructor Certification', 'FI');
INSERT INTO `certification` (`TrainerID`, `CertID`, `CertDetail`, `CatID`) VALUES ('marco', 'GEI1383572', 'Group Exercise Instructor Certification', 'GEI');
INSERT INTO `certification` (`TrainerID`, `CertID`, `CertDetail`, `CatID`) VALUES ('fernfernfern', 'ES135825', 'MSc in Physiotheraphy', 'ES');

INSERT INTO `info` (`TrainerID`, `StripeID`, `Bio`, `Img`, `Height`, `Weight`, `DateOfBirth`, `Verified`, `Gender`) VALUES ('Sathwik123', '123412341234', 'Sathwik is a trained personal trainer with 10 years of experience. He has been certified by... ', 'sathwik.jpg', '179.2', '70', '2000-02-09', '1', 'Male');
INSERT INTO `info` (`TrainerID`, `StripeID`, `Bio`, `Img`, `Height`, `Weight`, `DateOfBirth`, `Verified`, `Gender`) VALUES ('marco', '23423423412', 'Marco is a trained personal trainer with 10 years of experience. He has been certified by... ', 'marco.jpg', '179.2', '70', '2000-02-09', '1', 'Male');
INSERT INTO `info` (`TrainerID`, `StripeID`, `Bio`, `Img`, `Height`, `Weight`, `DateOfBirth`, `Verified`, `Gender`) VALUES ('Dylan444', '78375235523', 'Dylan is a trained personal trainer with 10 years of experience. He has been certified by... ', 'dylan444.jpg', '179.2', '70', '2000-02-09', '0', 'Male');
INSERT INTO `info` (`TrainerID`, `StripeID`, `Bio`, `Img`, `Height`, `Weight`, `DateOfBirth`, `Verified`, `Gender`) VALUES ('jiaqing123', '78375235523', 'Jia Qing is a trained personal trainer with 10 years of experience. He has been certified by... ', 'jiaqing123.jpg', '179.2', '70', '2000-02-09', '0', 'Male');
INSERT INTO `info` (`TrainerID`, `StripeID`, `Bio`, `Img`, `Height`, `Weight`, `DateOfBirth`, `Verified`, `Gender`) VALUES ('fernfernfern', '78375235523', 'Fern is a trained personal trainer with 10 years of experience. She has been certified by... ', 'fern.jpg', '179.2', '70', '2000-02-09', '1', 'Female');
INSERT INTO `info` (`TrainerID`, `StripeID`, `Bio`, `Img`, `Height`, `Weight`, `DateOfBirth`, `Verified`, `Gender`) VALUES ('melody234', '78375235523', 'Melody is a trained personal trainer with 10 years of experience. She has been certified by... ', 'melody.jpg', '179.2', '70', '2000-02-09', '1', 'Female');