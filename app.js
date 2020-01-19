/*----require packages and create initial variables----- */
const inq = require("inquirer");
const Employee = require("./lib/Employee")
const Engineer = require("./lib/Engineer")
const Intern = require("./lib/Intern")
const Manager = require("./lib/Manager")
const fs = require("fs")
const cheerio = require("cheerio")
const open = require("open")
const path = require("path")
let employee_list = []
let id = 1


/*----create array of questions for inquirer----- */

const questions = [
    {
        name: "role",
        message: "Select Role",
        type: "list",
        choices: ["employee", "intern", "manager", "engineer"]

    },
    {
        name: "employee_name",
        message: "Enter your name",
        type: "input",
        default: "Michael"
    },
    {
        name: "email",
        message: "Enter email adress",
        type: "input",
        default: "drone@corporate.com"

    },
    {
        name: "school",
        message: "Enter the name of your school",
        type: "input",
        default: "JHU",
        when: function (answers) {
            return answers.role === "intern"

        }

    },
    {
        name: "office",
        message: "Enter your office number",
        type: "input",
        default: "1",
        when: function (answers) {
            return answers.role === "manager"
        },
    },
    {
        name: "github",
        message: "Enter your github username",
        type: "input",
        default: "codeMAN77",
        when: function (answers) {
            return answers.role === "engineer"
        }

    }];
/*----function to start the questions using inquirer----- */

function startQuestion() {
    inq.prompt(questions)
        .then(function (res) {
            console.log(res)
            let employee

            switch (res.role) {
                case "engineer":
                    employee = new Engineer(res.employee_name, id, res.email, res.github);
                    break;
                case "manager":
                    employee = new Manager(res.employee_name, id, res.email, res.office);
                    break;
                case "intern":
                    employee = new Intern(res.employee_name, id, res.email, res.school);
                    break;
                case "employee":
                    employee = new Employee(res.employee_name, id, res.email);
                    break;
                default:
                    console.log("error occured");




            };
/*----add the user's responses to the employee_list array----- */
            employee_list.push(employee)

/*----increment the id variable to create id number for each employee----- */

            id++
/*----use inquirer to ask the user if they are done adding employees----- */

            inq.prompt([
                {
                    name: "repeat",
                    type: "confirm",
                    message: "Add a new person?",
                    default: false

                }
            ]).then(function (res) {
/*----if user selects Y repeat questions----- */
                if (res.repeat === true) {
                    startQuestion()
                }
 /*----if user selects N, add the existing info the user entered the the template html file ----- */
                else {
                    fs.readFile(path.join(__dirname, "output/template.html"), "utf8", function (err, text) {
                        if (err) {
                            console.log(err);
                            console.log("cannot read template");

                        }
                        console.log(text)
                        const $ = cheerio.load(text)
                        employee_list.forEach(emp => {
                            let employees = $("#employees")

                            let employee = $("<div>").addClass("card");
                            let name = $("<p>").text("Name: " + emp.getName());
                            let emp_id = $("<p>").text("Employee ID: " + emp.getId());
                            let role = $("<p>").text("Role: " + emp.getRole());

                            let email = $("<p>").text("Email: " + emp.getEmail());


                            name.appendTo(employee)
                            emp_id.appendTo(employee)
                            role.appendTo(employee)
                            email.appendTo(employee)
                            employee.appendTo(employees)

                            
                            switch (emp.getRole()) {
                                case "Engineer":
                                    let github = $("<p>").text("Github Username: " + emp.getGithub());
                                    let eng_icon = $("<i class='fas fa-glasses'></i>");

                                    github.appendTo(employee)
                                    eng_icon.appendTo(employee)

                                    break;
                                case "Manager":
                                    let officeNumber = $("<p>").text("Office Number: " + emp.getOfficeNumber());
                                    let manager_icon =$("<i class='fas fa-coffee'></i>");
                                    officeNumber.appendTo(employee);
                                    
                                    manager_icon.appendTo(employee)

                                    break;
                                case "Intern":

                                    let school = $("<p>").text("School Name: " + emp.getSchool());
                                    let intern_icon = $("<i class='fas fa-graduation-cap'></i>");
                                    school.appendTo(employee)
                                    intern_icon.appendTo(employee)

                                    break;
                            }








                        });
                        
                        console.log($.html())
 /*----write the html file and open it :)----- */
                        
                        
                        fs.writeFile("./output/employeelist.html", $.html(), (err) => {
                            open("./output/employeelist.html");
                        })

                    })

                }
            })

        })
};
 /*----make it start----- */
startQuestion();








