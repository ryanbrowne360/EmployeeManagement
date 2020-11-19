const inquirer = require('inquirer');
const mysql = require('mysql');

require('dotenv').config()
require('console.table')



class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

//Creating initial db
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "dbEmployees"
});


// Primary prompts in command line begins here
async function main() {

    menuOptions = await inquirer.prompt([
        {
            name: 'options',
            type: 'list',
            message: 'Please choose from the following selection?',
            choices: [ "View departments", "Add department", "View roles", "Add role", "View employees", "Add employee", "Remove role", "Update employee role", "Remove employee", "Remove department"]
        }
    ])
    choice = menuOptions.options

    if(choice == "Add department") {
        promptAnswers = await inquirer.prompt([
            {
                name: 'department',
                message: 'please assign a name to the new department?'
            }
        ])

    
        //Inserting into db and notifying user
        await db.query('INSERT INTO departments (department) VALUES (?)', [promptAnswers.department])

        console.log(`\n Added the new department called: ${promptAnswers.department} \n`)
    }

    if(choice == "Add role") {
        const showDepartments = await db.query('SELECT department FROM departments')
        
        promptAnswers = await inquirer.prompt([
            {
                name: 'role',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                message: 'Please provide a starting salary?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Please assign a department to this role?',
                choices: showDepartments.map(departments => departments.department)
            }
        ])
        // Get department and insert then notify user 
        const departmentId = await db.query('SELECT department_id FROM departments WHERE department = ?', [promptAnswers.department])
        await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)', [promptAnswers.role, promptAnswers.salary, departmentId[0].department_id])
        console.log(`\n Added the new role with these properties: \n Role name: ${promptAnswers.role} \n Salary: ${promptAnswers.salary} \n Department: ${promptAnswers.department} \n`)
    }

    if(choice == "Add employee") {

        const displayManagers = await db.query('SELECT first_name, last_name FROM managers')
        const displayRoles = await db.query('SELECT title FROM roles ')

        promptAnswers = await inquirer.prompt([
            {
                name: 'firstName',
                message: "Please enter the employees first name."
            },
            {
                name: 'lastName',
                message: "Please enter the employees last name."
            },
            {
                name: 'role',
                type: 'list',
                message: "Please enter a role for the employee.",
                choices: displayRoles.map(roles => roles.title)
            },
            {
                name: 'manager',
                type: 'list',
                message: "Please select a manager for this employee",
                choices: displayManagers.map(managers => managers.first_name)
            },
        ])

        // Getting correct role id and manager id from database
        const roleId = await db.query('SELECT role_id FROM roles WHERE title = ?', [promptAnswers.role])
        const managerId = await db.query('SELECT manager_id FROM managers WHERE first_name = ?', [promptAnswers.manager])

        // Inserting new employee into database
        await db.query( 
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [promptAnswers.firstName, promptAnswers.lastName, roleId[0].role_id, managerId[0].manager_id]
        )
        
        // Feedback to user
        console.log(`\n Added ${promptAnswers.firstName} ${promptAnswers.lastName} to employee list. \n`)
    }
    
    if(choice == "View departments") {

        // Getting all departments from database to show user
        const showDepartments = await db.query('SELECT department FROM departments')
        console.table(showDepartments)
    }

    if(choice == "View roles") {

        // Getting role info and the departments they belongs in for all roles to show user
        const displayRoles = await db.query(
            'SELECT roles.title, roles.salary, departments.department FROM roles, departments WHERE roles.department_id = departments.department_id ORDER BY departments.department'
            )
        console.table(displayRoles)
    }

    if(choice == "View employees") {

        // Getting all employees with their role info to show user
        const displayEmployees = await db.query(
            'SELECT employees.first_name, employees.last_name, roles.title, roles.salary FROM employees, roles WHERE employees.role_id = roles.role_id ORDER BY roles.title'
            )
        console.table(displayEmployees)
    }

    if(choice == "Update employee role") {

        // Getting roles and employees for user selection
        const displayRoles = await db.query('SELECT title FROM roles ')
        const displayEmployees = await db.query('SELECT first_name FROM employees')

        promptAnswers = await inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: 'Please select an employee to update',
                choices: displayEmployees.map(employees => employees.first_name)
            },
            {
                name: 'role',
                type: 'list',
                message: 'Please provide a new role for this employee', 
                choices: displayRoles.map(roles => roles.title)
            }
        ])

        // Get role id, update, and display execution feedback to user
        const roleId = await db.query('SELECT role_id FROM roles WHERE title = ?', [promptAnswers.role])

        await db.query('UPDATE employees SET role_id = ? WHERE first_name = ?', [roleId[0].role_id, promptAnswers.employeeName])

        console.log(`\n Updated ${promptAnswers.employeeName}'s role to ${promptAnswers.role}. \n`)
    }

    if(choice == "Remove employee") {

        // Getting employee names for user selection
        const displayEmployees = await db.query('SELECT first_name FROM employees')

        promptAnswers = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: displayEmployees.map(employees => employees.first_name)
            }
        ])

        // Deleting employee from db and displaying feedback for user
        await db.query('DELETE FROM employees WHERE first_name = ?', [promptAnswers.employee])

        console.log(`\n You have just fired ${promptAnswers.employee}. I hope you feel good about yourself. \n`)
    }

    if(choice == "Remove role") {

        // Getting employee names for user selection
        const displayRoles = await db.query('SELECT title FROM roles ')

        promptAnswers = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                message: 'What role are you removing?',
                choices: displayRoles.map(roles => roles.title)
            }
        ])
        role = promptAnswers.role

        // Delete role from db and provide feedback to user
        await db.query('DELETE FROM roles WHERE title = ?', [role])

        console.log(`\n Removed role: ${role}. \n`)

    }   
    
    if(choice == "Remove department") {

        // Getting department names for user selection
        const showDepartments = await db.query('SELECT department FROM departments')

        promptAnswers = await inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                message: 'Which department do you want to remove?',
                choices: showDepartments.map(department => department.department)
            }
        ])

        // Deleting department and notifying user
        await db.query('DELETE FROM departments WHERE department = ?', [promptAnswers.department])
        console.log(`\n Removed department: ${promptAnswers.department} \n`)
    }
    main()
}
main()

