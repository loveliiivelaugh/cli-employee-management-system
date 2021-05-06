const questions = (type, props) => {

  const { departments, employees, roles } = props && props;

  return {
    "Menu": [
      {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: [
          departments && "View departments", 
          roles && "View roles",
          employees && "View all employees", 
          ( employees && departments ) && 
          "View all employees by department",
          employees && "View all employees by manager",
          departments && "View total utilized budget by dept",
          "Add department", 
          "Add role", 
          "Add employee",
          employees && "Update Employee Role", 
          employees && "Update Employee Manager", 
          departments && "Remove department", 
          roles && "Remove role", 
          employees && "Remove employee",
          "Quit"
        ],
        default: 0
      }
    ],
    "View by Department": [
      {
        type: 'list',
        name: 'viewByDepartment',
        message: 'Which department would you like to view the employees by?',
        choices: departments,
        default: 0
      }
    ], 
    "View by Manager": [
      {
        type: 'list',
        name: 'viewByManager',
        message: 'Which manager would you like to view the employees by?',
        choices: employees,
        default: 0
      }
    ], 
    "Add department": [
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department you would like to add?',
      }
    ],
    "Add role": [
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role you would like to create?',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the employees salary?',
      },
      {
        type: 'list',
        name: 'department',
        message: 'What is the employees department?',
        choices: departments,
      }
    ],
    "Add employee": [
      {
        type: 'input',
        name: 'firstName',
        message: 'What is your first name?',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is your last name?',
      },
      {
        type: 'list',
        name: 'empRole',
        message: 'What is your employees role?',
        choices: roles,
        when: roles && roles.length > 0
      },
      {
        type: 'list',
        name: 'empManager',
        message: 'Who is your employees manager?',
        choices: employees,
        when: employees && employees.length > 0
      },
    ],
    "Update Employee Role": [
      {
        type: 'list',
        name: 'updateEmployeeRole',
        message: 'Which employees role would you like to update?',
        choices: employees,
      },
      {
        type: 'list',
        name: 'selection',
        message: 'To which role would you like to update the role?',
        choices: roles,
      }
    ],
    "Update Employee Manager": [
      {
        type: 'list',
        name: 'updateEmployeeManager',
        message: 'Which employees manager would you like to update?',
        choices: employees,
      },
      {
        type: 'list',
        name: 'selection',
        message: 'To who would you like to update the manager too?',
        choices: employees,
      },
    ],
    "Remove department": [
      {
        type: 'list',
        name: 'removeDepartment',
        message: 'Which department would you like to remove?',
        choices: departments,
        default: 0
      }
    ],
    "Remove role": [
      {
        type: 'list',
        name: 'removeRole',
        message: 'Which role would you like to remove?',
        choices: roles,
        default: 0
      }
    ],
    "Remove employee": [
      {
        type: 'list',
        name: 'removeEmployee',
        message: 'Which employee would you like to remove?',
        choices: employees,
        default: 0
      }
    ],
  }[type];
};

module.exports = questions;