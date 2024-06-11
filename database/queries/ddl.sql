-- Data Definition Queries (DDL)
-- Authors: Connor Schutze, Tristan Vosburg

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

START TRANSACTION;

-- -----------------------------------------------------
-- Table Passwords
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Passwords
(
    email VARCHAR(45) UNIQUE NOT NULL,
    password_hash varchar(45) NOT NULL,
    password_update DATE NOT NULL,
    PRIMARY KEY (email)
);

-- -----------------------------------------------------
-- Table Users
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Users
(
    user_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (email) REFERENCES Passwords(email) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Staff
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Staff
(
    staff_id INT NOT NULL AUTO_INCREMENT,
    start_date DATE,
    chg_hour DECIMAL(19, 2),
    user_id INT UNIQUE,
    PRIMARY KEY (staff_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Table Enrollments
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Enrollments
(
    enrollment_id INT NOT NULL AUTO_INCREMENT,
    status TINYINT NOT NULL DEFAULT 0,
    grade VARCHAR(45),
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (enrollment_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Courses
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Courses
(
    course_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    subject VARCHAR(45) NOT NULL,
    description VARCHAR(150),
    PRIMARY KEY (course_id)
);

-- -----------------------------------------------------
-- Table Staff_has_Courses
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Instructors
(
    instructor_id INT NOT NULL AUTO_INCREMENT,
    staff_id INT NOT NULL,
    course_id INT NOT NULL,
    staff_bio VARCHAR(150),
    PRIMARY KEY (instructor_id),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE (staff_id, course_id)
);

INSERT INTO Users (first_name, last_name, email)
VALUES
('Connor', 'Schutze', 'schutzec@osu.edu'),
('Tristan', 'Vosburg', 'vosburgt@osu.edu'),
('John', 'Doe', 'johndoe@osu.edu'),
('Doe', 'John', 'opposite@osu.edu'),
('Mark', 'Ham', 'hamm@osu.edu'),
('Alice', 'Johnson', 'alice.johnson@osu.edu'),
('Bob', 'Smith', 'bob.smith@osu.edu'),
('Charlie', 'Brown', 'charlie.brown@osu.edu'),
('David', 'Wilson', 'david.wilson@osu.edu'),
('Eva', 'Green', 'eva.green@osu.edu'),
('Frank', 'Miller', 'frank.miller@osu.edu'),
('Grace', 'Lee', 'grace.lee@osu.edu'),
('Hannah', 'White', 'hannah.white@osu.edu'),
('Ian', 'Taylor', 'ian.taylor@osu.edu'),
('Jack', 'Harris', 'jack.harris@osu.edu');

INSERT INTO Passwords (email, password_hash, password_update)
VALUES
('schutzec@osu.edu', 'cs', '2024-05-01'),
('vosburgt@osu.edu', 'vs', '2024-05-01'),
('johndoe@osu.edu', 'js', '2024-05-02'),
('opposite@osu.edu', 'os', '2024-04-21'),
('hamm@osu.edu', 'hs', '2024-03-01'),
('alice.johnson@osu.edu', 'aj', '2024-06-01'),
('bob.smith@osu.edu', 'bs', '2024-06-01'),
('charlie.brown@osu.edu', 'cb', '2024-06-01'),
('david.wilson@osu.edu', 'dw', '2024-06-01'),
('eva.green@osu.edu', 'eg', '2024-06-01'),
('frank.miller@osu.edu', 'fm', '2024-06-01'),
('grace.lee@osu.edu', 'gl', '2024-06-01'),
('hannah.white@osu.edu', 'hw', '2024-06-01'),
('ian.taylor@osu.edu', 'it', '2024-06-01'),
('jack.harris@osu.edu', 'jh', '2024-06-01');

INSERT INTO Staff (start_date, chg_hour, user_id)
VALUES
('2024-05-01', 20.00, (SELECT user_id FROM Users WHERE first_name = 'Connor' AND last_name = 'Schutze')),
('2024-04-02', 22.00, (SELECT user_id FROM Users WHERE first_name = 'Tristan' AND last_name = 'Vosburg')),
('2024-03-03', 18.00, (SELECT user_id FROM Users WHERE first_name = 'Mark' AND last_name = 'Ham')),
('2024-06-01', 19.75, (SELECT user_id FROM Users WHERE first_name = 'Hannah' AND last_name = 'White')),
('2024-06-01', 24.00, (SELECT user_id FROM Users WHERE first_name = 'Jack' AND last_name = 'Harris'));

INSERT INTO Courses (name, subject, description)
VALUES
('Databases', 'CS', 'Intro to Databases'),
('Operating Systems I', 'CS', 'UNIX'),
('Differential Equations', 'MTH', 'Calculus'),
('General Physics', 'PHY', 'Math but real'),
('Business Fundamentals', 'BUS', 'Business class'),
('Numerical Analysis', 'MTH', 'Num');

INSERT INTO Enrollments (status, grade, user_id, course_id)
VALUES
(0, 'B', (SELECT user_id FROM Users WHERE first_name = 'John' AND last_name = 'Doe'), (SELECT course_id FROM Courses WHERE name = 'Operating Systems I')),
(1, 'A', (SELECT user_id FROM Users WHERE first_name = 'John' AND last_name = 'Doe'), (SELECT course_id FROM Courses WHERE name = 'Databases')),
(1, 'C', (SELECT user_id FROM Users WHERE first_name = 'Doe' AND last_name = 'John'), (SELECT course_id FROM Courses WHERE name = 'Differential Equations')),
(0, 'A', (SELECT user_id FROM Users WHERE first_name = 'Alice' AND last_name = 'Johnson'), (SELECT course_id FROM Courses WHERE name = 'General Physics')),
(1, 'B', (SELECT user_id FROM Users WHERE first_name = 'Bob' AND last_name = 'Smith'), (SELECT course_id FROM Courses WHERE name = 'Operating Systems I')),
(1, 'C', (SELECT user_id FROM Users WHERE first_name = 'Charlie' AND last_name = 'Brown'), (SELECT course_id FROM Courses WHERE name = 'Business Fundamentals')),
(0, 'B', (SELECT user_id FROM Users WHERE first_name = 'David' AND last_name = 'Wilson'), (SELECT course_id FROM Courses WHERE name = 'Differential Equations')),
(1, 'A', (SELECT user_id FROM Users WHERE first_name = 'Eva' AND last_name = 'Green'), (SELECT course_id FROM Courses WHERE name = 'Operating Systems I')),
(1, 'B', (SELECT user_id FROM Users WHERE first_name = 'Frank' AND last_name = 'Miller'), (SELECT course_id FROM Courses WHERE name = 'Numerical Analysis')),
(1, 'C', (SELECT user_id FROM Users WHERE first_name = 'Grace' AND last_name = 'Lee'), (SELECT course_id FROM Courses WHERE name = 'Databases')),
(0, 'A', (SELECT user_id FROM Users WHERE first_name = 'Ian' AND last_name = 'Taylor'), (SELECT course_id FROM Courses WHERE name = 'Business Fundamentals'));

INSERT INTO Instructors (staff_id, course_id, staff_bio)
VALUES
((SELECT staff_id FROM Staff WHERE user_id = (SELECT user_id FROM Users WHERE first_name = 'Connor' AND last_name = 'Schutze')), (SELECT course_id FROM Courses WHERE name = 'Databases'), 'hi im connor'),
((SELECT staff_id FROM Staff WHERE user_id = (SELECT user_id FROM Users WHERE first_name = 'Connor' AND last_name = 'Schutze')), (SELECT course_id FROM Courses WHERE name = 'Operating Systems I'), 'hi im connor'),
((SELECT staff_id FROM Staff WHERE user_id = (SELECT user_id FROM Users WHERE first_name = 'Tristan' AND last_name = 'Vosburg')), (SELECT course_id FROM Courses WHERE name = 'Numerical Analysis'), 'hi im tristan'),
((SELECT staff_id FROM Staff WHERE user_id = (SELECT user_id FROM Users WHERE first_name = 'Mark' AND last_name = 'Ham')), (SELECT course_id FROM Courses WHERE name = 'Operating Systems I'), 'hi im mark'),
((SELECT staff_id FROM Staff WHERE user_id = (SELECT user_id FROM Users WHERE first_name = 'Hannah' AND last_name = 'White')), (SELECT course_id FROM Courses WHERE name = 'Differential Equations'), 'i have a background in math'),
((SELECT staff_id FROM Staff WHERE user_id = (SELECT user_id FROM Users WHERE first_name = 'Jack' AND last_name = 'Harris')), (SELECT course_id FROM Courses WHERE name = 'General Physics'), 'i have a background in physics');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
