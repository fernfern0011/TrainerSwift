CREATE TABLE Account (
    trainerid integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    stripeid text,
    created_timestamp timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT account_pkey PRIMARY KEY (trainerid),
    CONSTRAINT account_trainerid_email_key UNIQUE (trainerid, email)
);

CREATE TABLE Category (
    catid integer NOT NULL,
    catcode text NOT NULL,
    catname text NOT NULL,
    created_timestamp timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT category_pkey PRIMARY KEY (catid),
    CONSTRAINT category_catcode UNIQUE (catcode),
    CONSTRAINT category_catname_key UNIQUE (catcode)
);

CREATE TABLE Certification (
    certid integer NOT NULL,
    certcode text NOT NULL,
    certname text NOT NULL,
    trainerid integer NOT NULL,
    catid integer NOT NULL,
    created_timestamp timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT certification_pkey PRIMARY KEY (certid),
    CONSTRAINT fk_certification_catid FOREIGN KEY (catid) REFERENCES public.category (catid)
    CONSTRAINT fk_certification_trainerid FOREIGN KEY (trainerid) REFERENCES public.account (trainerid)
);

CREATE TABLE Info (
    trainerid integer NOT NULL,
    bio text,
    image text,
    height integer,
    weight integer,
    dob date,
    gender text,
    verified boolean NOT NULL DEFAULT false,
    created_timestamp timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_info_trainerid FOREIGN KEY (trainerid) REFERENCES public.account (trainerid)
);

INSERT INTO Account (trainerid, username, email, password, stripeid) VALUES (nextval('account_id_seq'), 'Sathwik123', 'Sathwik123@gmail.com', 'password123', '123412341234');
INSERT INTO Account (trainerid, username, email, password, stripeid) VALUES (nextval('account_id_seq'), 'Dylan444', 'dylan444@gmail.com', '44444444', '23423423412');
INSERT INTO Account (trainerid, username, email, password, stripeid) VALUES (nextval('account_id_seq'), 'jiaqing123', 'jiaqing123@gmail.com', 'password123', '78375235523');
INSERT INTO Account (trainerid, username, email, password, stripeid) VALUES (nextval('account_id_seq'), 'fernfernfern', 'fern@gmail.com', 'password123', '78375235523');
INSERT INTO Account (trainerid, username, email, password, stripeid) VALUES (nextval('account_id_seq'), 'marco', 'marco@gmail.com', 'password123', '78375235523');
INSERT INTO Account (trainerid, username, email, password, stripeid) VALUES (nextval('account_id_seq'), 'melody234', 'melody234@gmail.com', 'password123', '78375235523');

INSERT INTO category (catid, catcode, catname) VALUES (nextval('category_id_seq'), 'PCI', 'Pre-Choreographed Instructor');
INSERT INTO category (catid, catcode, catname) VALUES (nextval('category_id_seq'), 'FI', 'Fitness Instructor');
INSERT INTO category (catid, catcode, catname) VALUES (nextval('category_id_seq'), 'GEI', 'Group Exercise Instructor');
INSERT INTO category (catid, catcode, catname) VALUES (nextval('category_id_seq'), 'PT', 'Personal Trainer');
INSERT INTO category (catid, catcode, catname) VALUES (nextval('category_id_seq'), 'ES', 'Exercise Specialist');

INSERT INTO Certification (CertID, certcode, certname, TrainerID, CatID) VALUES (nextval('certification_id_seq'), 'PCI1322534', 'Zumba Certification', 1, 1);
INSERT INTO Certification (CertID, certcode, certname, TrainerID, CatID) VALUES (nextval('certification_id_seq'), 'PCI1322535', 'Zumba Certification', 2, 1);
INSERT INTO Certification (CertID, certcode, certname, TrainerID, CatID) VALUES (nextval('certification_id_seq'), 'PT195834', 'Personal Trainer Certification', 3, 4);
INSERT INTO Certification (CertID, certcode, certname, TrainerID, CatID) VALUES (nextval('certification_id_seq'), 'FI10582', 'Fitness Instructor Certification', 4, 2);
INSERT INTO Certification (CertID, certcode, certname, TrainerID, CatID) VALUES (nextval('certification_id_seq'), 'GEI1383572', 'Group Exercise Instructor Certification', 5, 3);
INSERT INTO Certification (CertID, certcode, certname, TrainerID, CatID) VALUES (nextval('certification_id_seq'), 'ES135825', 'MSc in Physiotheraphy', 6, 5);

INSERT INTO Info (TrainerID, Bio, Image, Height, Weight, dob, Gender, Verified) VALUES (1, 'Sathwik is a trained personal trainer with 10 years of experience. He has been certified by... ', 'sathwik.jpg', 179.2, 70, '2000-02-09', 'Male', TRUE);
INSERT INTO Info (TrainerID, Bio, Image, Height, Weight, dob, Gender, Verified) VALUES (2, 'Dylan is a trained personal trainer with 10 years of experience. He has been certified by... ', 'dylan444.jpg', 179.2, 70, '2000-02-09', 'Male', false);
INSERT INTO Info (TrainerID, Bio, Image, Height, Weight, dob, Gender, Verified) VALUES (3, 'Jia Qing is a trained personal trainer with 10 years of experience. He has been certified by... ', 'jiaqing123.jpg', 179.2, 70, '2000-02-09', 'Male', FALSE);
INSERT INTO Info (TrainerID, Bio, Image, Height, Weight, dob, Gender, Verified) VALUES (4, 'Fern is a trained personal trainer with 10 years of experience. She has been certified by... ', 'fern.jpg', 179.2, 70, '2000-02-09', 'Female', TRUE);
INSERT INTO Info (TrainerID, Bio, Image, Height, Weight, dob, Gender, Verified) VALUES (5, 'Marco is a trained personal trainer with 10 years of experience. He has been certified by... ', 'marco.jpg', 179.2, 70, '2000-02-09', 'Male', TRUE);
INSERT INTO Info (TrainerID, Bio, Image, Height, Weight, dob, Gender, Verified) VALUES (6, 'Melody is a trained personal trainer with 10 years of experience. She has been certified by... ', 'melody.jpg', 179.2, 70, '2000-02-09', 'Female', TRUE);

