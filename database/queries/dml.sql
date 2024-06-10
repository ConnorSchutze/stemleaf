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

-- get data for all staff (pretty print)
SELECT 
Staff.staff_id AS id,   
COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff_name, 
Staff.start_date AS start_date, 
Staff.chg_hour AS chg_hour 
FROM Staff 
LEFT JOIN Users ON Staff.user_id = Users.user_id 
ORDER BY id; 

-- create a new staff member
INSERT INTO Staff (start_date, chg_hour, user_id)
VALUES (:start_date_data, :chg_hour_input, :user_id_data);

-- get data for a particular staff memeber
SELECT * FROM Staff WHERE staff_id = :staff_id_key;

--get data for a particular staff member (pretty print)
SELECT 
Staff.staff_id AS id,   
COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff_name, 
Staff.start_date AS start_date, 
Staff.chg_hour AS chg_hour 
FROM Staff 
LEFT JOIN Users ON Staff.user_id = Users.user_id 
WHERE CONCAT(Users.first_name, ' ', Users.last_name) LIKE :staff_name%
ORDER BY id; 

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

-- get data for all Instructors (pretty print)
SELECT 
Instructors.instructor_id AS  id, 
COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff, 
Courses.name AS course, 
Instructors.staff_bio AS bio 
FROM Instructors 
INNER JOIN Courses ON Instructors.course_id = Courses.course_id 
INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id 
LEFT JOIN Users ON Staff.user_id = Users.user_id 
ORDER BY id; 

-- create a new Instructor
INSERT INTO Instructors (staff_id, course_id, staff_bio)
VALUES (:staff_id_key, :course_id_key, :staff_bio_input);

-- get data for a particular Instructor
SELECT * FROM Instructors 
WHERE staff_id = :staff_id_key;

-- get data for a particular Instructor course
SELECT * FROM Instructors 
WHERE instructor_id = :instructor_id_key;

-- get data for a particular Instructor's course (pretty print)
SELECT 
Instructors.instructor_id AS  id, 
COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff, 
Courses.name AS course, 
Instructors.staff_bio AS bio 
FROM Instructors 
INNER JOIN Courses ON Instructors.course_id = Courses.course_id 
INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id 
LEFT JOIN Users ON Staff.user_id = Users.user_id 
WHERE Courses.name LIKE :course_name% 
ORDER BY id; 

-- update an Instructor's information
UPDATE Instructors
SET staff_id = :staff_id_key, course_id = :course_id_key, staff_bio = :staff_bio_input;
WHERE instructor_id = :instructor_id_key;

-- delete an Instructor
DELETE FROM Instructors WHERE instructor_id = :instructor_id_key;

-- -----------------------------------------------------
-- Courses
-- -----------------------------------------------------
-- get data for all Courses
SELECT * FROM Courses ORDER BY course_id;

-- create a new Course
INSERT INTO Courses (course_name, subject, description)
VALUES (:course_name_input, :subject_input, :description_input);

-- get data for a particular Course
SELECT * FROM Courses WHERE course_id = :course_id_key ORDER BY course_id;

-- update Course information
UPDATE Courses
SET course_name = :course_name_input, subject = :subject_input, description = :description_input
WHERE course_id = :course_id_key;

-- delete a Course
DELETE FROM Courses WHERE course_id = :course_id_key;

-- -----------------------------------------------------
-- Enrollments
-- -----------------------------------------------------
-- get data for all enrollments
SELECT * FROM Enrollments

-- get data for all enrollments (pretty print)
SELECT 
Enrollments.enrollment_id AS id, 
Enrollments.status AS status, 
Enrollments.grade AS grade, 
CONCAT(Users.first_name, ' ', Users.last_name) AS user, 
Courses.name AS course 
FROM Enrollments 
INNER JOIN Courses ON Enrollments.course_id = Courses.course_id 
INNER JOIN Users ON Enrollments.user_id = Users.user_id 
ORDER BY id; 

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

-- get data for a particular enrollment for a user (pretty print)
SELECT 
Enrollments.enrollment_id AS  id, 
Enrollments.status AS status, 
Enrollments.grade AS grade, 
CONCAT(Users.first_name, ' ', Users.last_name) AS user, 
Courses.name AS course 
FROM Enrollments 
INNER JOIN Courses ON Enrollments.course_id = Courses.course_id 
INNER JOIN Users ON Enrollments.user_id = Users.user_id 
WHERE Users.last_name LIKE :last_name% 
ORDER BY id; 

-- update Enrollment information
UPDATE Enrollments
SET stauts = :status_data, grade = :grade_input, user_id = :user_id_key, course_id = :course_id_key
WHERE user_id = :user_id_key AND course_id = :course_id_key;

-- delete an Enrollment
DELETE FROM Enrollments
WHERE user_id = :user_id_key AND course_id = :course_id_key;
