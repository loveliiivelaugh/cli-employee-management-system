const db = require('../db/index.js');


const query = async sql => {

  let promise = await new Promise((resolve, reject) =>
    db.query(sql, (error, result) => 
      error ? reject(error) : resolve(result)))
        .then(data => data);

  return promise;
};


class Department {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  getId() { return this.id; }
  
  getName() { return this.name; }
}

class Role {
  constructor(id, title, salary, department_id) {
    this.id = id;
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
  }

  getId() { return this.id; }
  
  getTitle() { return this.title; }

  getSalary() { return this.salary; }

  setSalary(salary) { this.salary = salary; }

  getDepartmentId() { return this.department_id; }
}

class Employee {
  constructor(id, first_name, last_name, role_id, manager_id) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }

  getId() { return this.id; }
  
  getFirstName() { return this.name; }

  getLastName() { return this.email; }

  getRoleId() { return this.role_id; }

  setRoleId(id) { this.role_id = id; }
  
  getManagerId() { return this.manager_id; }
  
  setManagerId(id) { this.manager_id = id; }
}

class Db {
  constructor() {
    this.db = db;
  }

  //methods
  getDepartments() { return query(`SELECT * FROM department`); }

  getRoles() { return query(`SELECT * FROM role`); }

  getEmployees() {
    return query(`SELECT * FROM employee`);
  }

  getEmployeesByDepartment(department) { 
    console.log(department);
    return query(`SELECT * FROM employee WHERE department_id = '${department}'`); 
  }

  getEmployeesByManager(manager) { 
    return query(`SELECT * FROM employee WHERE manager_id = '${manager}'`); 
  }

  getUtilizedBudget(department) { 
    return query(`SELECT utilizedBudget FROM ${department}`); 
  }

  getRoleId(role) {
    console.log("getRoleId(): ", role);
    return query(`SELECT role.id FROM role WHERE role.title = '${role}'`);
  }
  
  getEmployeeId(employee) {
    console.log("getEmployeeId(): ", employee);

    if (employee) { 
      return query(`SELECT employee.id FROM employee WHERE employee.first_name = '${employee.first}' AND employee.last_name = '${employee.last}'`);
    }
    else {
      return [{ id: 0 }];
    }
  }
  
  getDepartmentId(department) {
    console.log("getDepartmentId(): ", department);
    return query(`SELECT department.id FROM department WHERE department.name = '${department}'`);
  }

  addDepartment(department) { 
    query(`
      INSERT INTO department (name) 
      values ('${department.name}');
    `); 
  }

  addRole(role) { 
    console.log("addRole(): ", role);
    query(`
      INSERT INTO role (title, salary, department_id) 
      values (
        '${role.title}', 
        '${role.salary}',
        '${role.department_id}'
        )
    `);
    return;
  }

  addEmployee(employee) { 
    console.log("Add Employee", employee);
    const {
      first_name, last_name, role_id, manager_id
    } = employee;
    query(`
      INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      values (
        '${first_name}', 
        '${last_name}',
        '${role_id}', 
        '${manager_id}'
        );
    `);
    return;
  }

  updateManager(employee, id) { 
    console.log("Update Manager", employee, id);
    return query(`
    UPDATE employee 
    SET manager_id = '${id}'
    WHERE first_name = '${employee.first}' 
    AND last_name = '${employee.last}'
  `); 
  }

  updateRole(employee, id) { 
    console.log("Update employee: ", employee, id); 
    return query(`
      UPDATE employee 
      SET role_id = '${id}' 
      WHERE first_name = '${employee.first}' 
      AND last_name = '${employee.last}'
    `);
  }

  removeRole(role) { 
    console.log("Removing Role: ", role);
    query(`DELETE FROM role WHERE id = '${role.id}'`);
    return;
  }

  removeEmployee(employee) { 
    console.log("Remove Employee: ", employee);
    query(`DELETE FROM employee WHERE id = '${employee.id}'`);
    return;
  }

  removeDepartment(department) { 
    console.log("Remove Department: ", department);
    query(`DELETE FROM department WHERE id = '${department.id}'`);
    return;
  }

  quit() { 
    db.end();
    console.log("You have terminated the app.");
    return;
  }
}

module.exports = { Employee, Role, Department, Db };