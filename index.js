//Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
const questions = require("./data/questions");

const { Employee, Department, Role, Db } = require("./lib/classes.js");

const db = new Db();

const useInquirer = (type, props) =>
  inquirer
    .prompt(questions(type, props))
    .then(answers => answers)
    .catch(error => error.isTtyError ? console.error(error.isTtyError) : console.error(error));


const dataHandler = async (type, props) => {

  const response = await useInquirer(type, props);

  const { 
    menu, departmentName, roleName, 
    salary, empDept, firstName,
    lastName, empRole, empManager,
    viewByDepartment,
    viewByManager, selection,
    updateEmployeeRole,
    updateEmployeeManager,
    department, removeDepartment,
    removeRole, removeEmployee
  } = response;

  const menuOptions = {
    departments: await db.getDepartments(),
    roles: await db.getRoles(),
    employees: await db.getEmployees(),
  };

  // console.log(response);
  const formatResults = data => {
    let arr = [];
    data.forEach(item => arr.push(
      item.name || 
      item.title || 
      item.first_name + ' ' + item.last_name
      ));
    return arr;
  };

  const randomId = () => Math.floor(Math.random() * 100) + 1;

  const handleMenu = {

    "View departments": async () => {
      console.log("Departments: ", console.table(await db.getDepartments()));
      dataHandler("Menu", menuOptions);
    }, 

    "View roles": async () => {
      console.log("Roles: ", console.table(await db.getRoles()));
      dataHandler("Menu", menuOptions);
    }, 

    "View all employees": async () => {
      console.log("Employees: ", console.table(await db.getEmployees()));
      dataHandler("Menu", menuOptions);
    }, 

    "View all employees by department": async () => dataHandler("View by Department", { departments: await db.getDepartments() }),

    "viewByDepartment": async () => {
      const dept = await db.getDepartmentId(viewByDepartment);

      console.log("Employees by Department: ", 
        await db.getEmployeesByDepartment(dept[0].id));

      dataHandler("Menu", menuOptions);
    },

    "View all employees by manager": async () => { 
      const employees = await db.getEmployees();
      const employeeChoices = [];
      employees.forEach(employee => employeeChoices.push(employee.first_name + ' ' + employee.last_name));

      dataHandler("View by Manager", { employees: employeeChoices })
    },

    "viewByManager": async () => {
      const employee = {
        first: viewByManager.split(" ")[0],
        last: viewByManager.split(" ")[1]
      };
      const mgr = await db.getEmployeeId(employee);

      console.log("Employees by Manager: ") 
      console.table(await db.getEmployeesByManager(mgr[0].id));

      dataHandler("Menu", menuOptions);
    },

    "View total utilized budget by dept": async department => {
      console.log("Total Utilized Budget: ", await db.getUtilizedBudget(department));
      dataHandler("Menu", menuOptions);
    },

    "Add department": () => dataHandler("Add department", { departments: '' }),

    "Add role": async () => {
      const departments = await db.getDepartments();
      const deptChoices = [];
      departments.forEach(dept => deptChoices.push(dept.name));

      console.log(deptChoices);

      dataHandler("Add role", { departments: deptChoices });
    }, 

    "Add employee": async () => {
      const roles = await db.getRoles();
      const roleChoices = [];
      roles.forEach(role => roleChoices.push(role.title));

      const employees = await db.getEmployees();
      const employeeChoices = [];
      employees.forEach(employee => employeeChoices.push(employee.first_name + ' ' + employee.last_name));

      dataHandler("Add employee", { roles: roleChoices, employees: employeeChoices });
    },

    "Update Employee Role": async () => {
      const roles = await db.getRoles();
      const roleChoices = [];
      roles.forEach(role => roleChoices.push(role.title));

      const employees = await db.getEmployees();
      const employeeChoices = [];
      employees.forEach(employee => employeeChoices.push(employee.first_name + ' ' + employee.last_name));

      dataHandler("Update Employee Role", { roles: roleChoices, employees: employeeChoices });
    }, 

    "Update Employee Manager": async () => {
      const employees = await db.getEmployees();
      const employeeChoices = [];
      employees.forEach(employee => employeeChoices.push(employee.first_name + ' ' + employee.last_name));

      dataHandler("Update Employee Manager", { employees: employeeChoices });
    },  

    "Remove department": async () => {
      const departments = await db.getDepartments();
      const deptChoices = [];
      departments.forEach(dept => deptChoices.push(dept.name));

      dataHandler("Remove department", { departments: deptChoices });
    },  

    "Remove role": async () => {
      const roles = await db.getRoles();
      const roleChoices = [];
      roles.forEach(role => roleChoices.push(role.title));

      dataHandler("Remove role", { roles: roleChoices })
    },  
      
    "Remove employee": async () => {
      const employees = await db.getEmployees();
      const employeeChoices = [];
      employees.forEach(employee => employeeChoices.push(employee.first_name + ' ' + employee.last_name));

      dataHandler("Remove employee", { employees: employeeChoices })
    },

    "firstName": async () => {
      const roleId = await db.getRoleId(empRole);
      empId = empManager && {
        first: empManager.split(" ")[0],
        last: empManager.split(" ")[1]
      };
      const employeeId = await db.getEmployeeId(empId);

      db.addEmployee(new Employee(
        randomId(), firstName, lastName, roleId[0].id, employeeId[0].id || 0));
      dataHandler("Menu", menuOptions);
    },

    "roleName": async () => {
      console.log(await db.getDepartmentId(department));
      const deptId = await db.getDepartmentId(department);
      db.addRole(new Role(
        randomId(), roleName, salary, deptId[0].id));
      dataHandler("Menu", menuOptions);
    },

    "departmentName": async () => {
      console.log("Adding department: " + departmentName);
      db.addDepartment(new Department(randomId(), departmentName));
      return dataHandler("Menu", menuOptions);
    },

    "updateEmployeeRole": async () => {
      const employee = updateEmployeeRole.split(" ");
      console.log("Updating employee role: ", 
        employee, 
        await db.getRoleId(selection)
      );
      const id = await db.getRoleId(selection);
      const emp = {
        first: employee[0],
        last: employee[1],
      }
      
      db.updateRole(emp, id[0].id);
      dataHandler("Menu", menuOptions);
    },

    "updateEmployeeManager": async () => {
      const employee = updateEmployeeManager.split(" ");

      console.log(
        "Updating employee manager: ", 
        employee, 
      );

      const manager = {
        first: selection.split(" ")[0],
        last: selection.split(" ")[1]
      };

      const id = await db.getEmployeeId(manager);

      const emp = {
        first: employee[0],
        last: employee[1],
      }
      
      db.updateManager(emp, id[0].id);
      dataHandler("Menu", menuOptions);
    },

    "removeDepartment": async () => {
      const departments = await db.getDepartments();
      let department = {};
      departments.forEach(dept => {
        if (dept.name == removeDepartment) {
            department = dept;
          }
      });

      console.log("removing department: ", department);

      db.removeDepartment(department);
      dataHandler("Menu", menuOptions);
    },

    "removeRole": async () => {
      const roles = await db.getRoles();
      let role = {};
      roles.forEach(r => {
        if (r.title == removeRole) {
            role = r;
          }
      });

      console.log("removing role: ", role);

      db.removeRole(role);
      dataHandler("Menu", menuOptions);
    },

    "removeEmployee": async () => {
      const employees = await db.getEmployees();
      let employee = {};
      employees.forEach(emp => {
        if (emp.first_name + ' ' + emp.last_name == removeEmployee) {
            employee = emp;
          }
      });

      console.log("removing employee: ", employee);

      db.removeEmployee(employee);
      dataHandler("Menu", menuOptions);
    },

    "Quit": () => db.quit()
  };

  return menu ? handleMenu[menu]() :
    departmentName ? handleMenu["departmentName"]() :
    roleName ? handleMenu["roleName"]() : 
    empDept ? handleMenu["empDept"]() :
    viewByDepartment ? handleMenu["viewByDepartment"]() :
    viewByManager ? handleMenu["viewByManager"]() :
    firstName ? handleMenu["firstName"]() : 
    updateEmployeeRole ? handleMenu["updateEmployeeRole"]() : 
    updateEmployeeManager ? handleMenu["updateEmployeeManager"]() : 
    removeDepartment ? handleMenu["removeDepartment"]() : 
    removeRole ? handleMenu["removeRole"]() : 
    removeEmployee && handleMenu["removeEmployee"]();
};

//initialize app 
const init = async () => 
  await dataHandler("Menu", {
    departments: await db.getDepartments(),
    roles: await db.getRoles(),
    employees: await db.getEmployees(),
  });

init();