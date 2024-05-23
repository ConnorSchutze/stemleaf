-- Data Manipulation Queries (DML)
-- Authors: Connor Schutze, Tristan Vosburg

-- -----------------------------------------------------
-- Users
-- -----------------------------------------------------
-- get data for all users
SELECT * FROM Users;

-- create a new user account
INSERT INTO Users (first_name, last_name, email)
VALUES (:first_name_input, :last_name_input, :email_input);

-- get data for a particular user
SELECT * FROM Users WHERE user_id = :user_id_key;

-- get all users names
SELECT CONCAT(Users.first_name, ' ', Users.last_name) AS first, last FROM Users;

-- update user information
UPDATE Users
SET first_name = :first_name_input, last_name = :last_name_input, email = :email_input
WHERE user_id = :user_id_key;

-- delete a user's account
DELETE FROM Users WHERE user_id = :user_id_key;

-- -----------------------------------------------------
-- Passwords
-- -----------------------------------------------------
-- get data for all passwords
SELECT * FROM Passwords;

-- add a new password for a user
INSERT INTO Passwords (email, password_hash, password_update)
VALUES (:user_email, :password_hash_data, :password_update_data);

-- get data for a particular password
SELECT * FROM Users WHERE email = :user_email;

-- update user password information
UPDATE Passwords 
SET email = :new_email, password_hash = :password_hash_data, password_update = :password_update_data
WHERE email = :user_email;

-- delete a user's password
DELETE FROM Passwords WHERE email = :user_email;

-- -----------------------------------------------------
-- Staff
-- -----------------------------------------------------
-- get data for all staff
SELECT * FROM Staff

-- create a new staff member
INSERT INTO Staff (start_date, chg_hour, user_id)
VALUES (:start_date_data, :chg_hour_input, :user_id_data);

-- get data for a particular staff memeber
SELECT * FROM Staff WHERE staff_id = :staff_id_key;

-- update staff information
UPDATE Staff
SET start_date = :start_date_data, chg_hour = :chg_hour_input, user_id = :user_id_data
WHERE staff_id = :staff_id_key;

-- delete a staff's account
DELETE FROM Staff WHERE staff_id = :staff_id_key;

-- -----------------------------------------------------
-- Instructors
-- -----------------------------------------------------
-- get data for all Instructors
SELECT * FROM Instructors

-- create a new Instructor
INSERT INTO Instructors (staff_id, course_id, staff_bio)
VALUES (:staff_id_key, :course_id_key, :staff_bio_input);

-- get data for a particular Instructor
SELECT * FROM Instructors 
WHERE staff_id = :staff_id_key;

-- get data for a particular Instructor course
SELECT * FROM Instructors 
WHERE staff_id = :staff_id_key AND course_id = :course_id_key;

-- update an Instructor's information
UPDATE Instructors
SET staff_id = :staff_id_key, course_id = :course_id_key, staff_bio = :staff_bio_input;
WHERE staff_id = :staff_id_key AND course_id = :course_id_key;

-- delete an Instructor
DELETE FROM Instructors
WHERE staff_id = :staff_id_key AND course_id = :course_id_key;

-- -----------------------------------------------------
-- Courses
-- -----------------------------------------------------
-- get data for all Courses
SELECT * FROM Courses

-- create a new Course
INSERT INTO Courses (name, subject, description)
VALUES (:name_input, :subject_input, :description_input);

-- get data for a particular Course
SELECT * FROM Courses WHERE course_id = :course_id_key;

-- update Course information
UPDATE Courses
SET name = :name_input, subject = :subject_input, description = :description_input
WHERE course_id = :course_id_key;

-- delete a Course
DELETE FROM Courses WHERE course_id = :course_id_key;

-- -----------------------------------------------------
-- Enrollments
-- -----------------------------------------------------
-- get data for all enrollments
SELECT * FROM Enrollments

-- create a new enrollment
INSERT INTO Enrollments (status, grade, user_id, course_id)
VALUES (:status_data, :grade_input, :user_id_key, :course_id_key);

-- get data for all enrollments for a specific user
SELECT * FROM Enrollments 
WHERE user_id = :user_id_key;

-- get data for a particular course's enrollments
SELECT * FROM Enrollments 
WHERE course_id = :course_id_key;

-- get data for a particular enrollment for a user
SELECT * FROM Enrollments 
WHERE user_id = :user_id_key AND course_id = :course_id_key;

-- update Enrollment information
UPDATE Enrollments
SET stauts = :status_data, grade = :grade_input, user_id = :user_id_key, course_id = :course_id_key
WHERE user_id = :user_id_key AND course_id = :course_id_key;

-- delete an Enrollment
DELETE FROM Enrollments
WHERE user_id = :user_id_key AND course_id = :course_id_key;
