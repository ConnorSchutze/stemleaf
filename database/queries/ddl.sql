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
    staff_id INT NOT NULL,
    course_id INT NOT NULL,
    staff_bio VARCHAR(150),
    PRIMARY KEY (staff_id, course_id),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

INSERT INTO Users (first_name, last_name, email)
VALUES
('Connor', 'Schutze', 'schutzec@osu.edu'),
('Tristan', 'Vosburg', 'vosburgt@osu.edu'),
('John', 'Doe', 'johndoe@osu.edu'),
('Doe', 'John', 'opposite@osu.edu'),
('Mark', 'Ham', 'hamm@osu.edu');

INSERT INTO Passwords (email, password_hash, password_update)
VALUES
('schutzec@osu.edu', 'cs', '2024-05-01'),
('vosburgt@osu.edu', 'vs', '2024-05-01'),
('johndoe@osu.edu', 'js', '2024-05-02'),
('opposite@osu.edu', 'os', '2024-04-21'),
('hamm@osu.edu', 'hs', '2024-03-01');

INSERT INTO Staff (start_date, chg_hour, user_id)
VALUES
('2024-05-01', 20.00, 1),
('2024-04-02', 22.00, 2),
('2024-03-03', 18.00, 5);

INSERT INTO Courses (name, subject, description)
VALUES
('Databases', 'CS', 'Intro to Databases'),
('Operating Systems', 'CS', 'UNIX'),
('Numerical Analysis', 'MTH', 'Num');

INSERT INTO Enrollments (status, grade, user_id, course_id)
VALUES
(0, 'B', 3, 2),
(1, 'A', 3, 1),
(1, 'C', 4, 3);

INSERT INTO Instructors (staff_id, course_id, staff_bio)
VALUES
(1, 1, 'hi im connor'),
(1, 2, 'hi im connor'),
(2, 3, 'hi im tristan'),
(3, 2, 'hi im mark');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
