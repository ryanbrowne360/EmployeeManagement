DROP TABLE IF EXISTS
CREATE DATABASE dbEmployees;
USE dbEmployees;
CREATE TABLE employees (
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
	first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
);
CREATE TABLE roles(
	role_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50),
    salary DECIMAL(6),
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
);

CREATE TABLE departments(
	department_id INTEGER PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(50)
	department VARCHAR(50)
);

CREATE TABLE managers(
	manager_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    salary DECIMAL(6)
);
INSERT INTO departments (title) VALUES ("engineer");
INSERT INTO departments (title) VALUES ("intern");
INSERT INTO departments (title) VALUES ("manager");
-- INSERT INTO departments (title) VALUES ("HR");
-- INSERT INTO departments (title) VALUES ("executive");
-- INSERT INTO departments (title) VALUES ("tech");

INSERT INTO roles (title, salary, department_id) VALUES ("Engineer", 125000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("intern", 80000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ("manager", 100000, 4);

-- INSERT INTO roles (title, salary, department_id) VALUES ("Marketing Team Member", 125000, 1);
-- INSERT INTO roles (title, salary, department_id) VALUES ("Researcher", 150000, 2);
-- INSERT INTO roles (title, salary, department_id) VALUES ("Engineer", 100000, 4);
-- INSERT INTO roles (title, salary, department_id) VALUES ("Lead generator", 60000, 1);
-- INSERT INTO roles (title, salary, department_id) VALUES ("Assembly lineman", 60000, 3);
-- INSERT INTO roles (title, salary, department_id) VALUES ("Research assistant", 80000, 2);
-- INSERT INTO roles (title, salary, department_id) VALUES ("quality tester", 70000, 3);


INSERT INTO managers (first_name, last_name, role_id, manager_id) VALUES ("John", "Smith", 1, 1);
INSERT INTO managers (first_name, last_name, role_id, manager_id) VALUES ("Jane", "Doe", 2, 2);
INSERT INTO managers (first_name, last_name, role_id, manager_id) VALUES ("Iron", "Maden", 3, 3);
INSERT INTO employees (first_name, last_name, salary) VALUES ("Sylvester", "Stalone", 40000);
INSERT INTO employees (first_name, last_name, salary) VALUES ("Arnold", "S", 60000);
INSERT INTO employees (first_name, last_name, salary) VALUES ("Nelson", "Madela", 80000);
INSERT INTO employees (first_name, last_name, salary) VALUES ("Donald", "Trump", 11000);
INSERT INTO employees (first_name, last_name, salary) VALUES ("Donald", "Duck", 175000);
INSERT INTO employees (first_name, last_name, salary) VALUES ("Stuart", "Little", 899000);
