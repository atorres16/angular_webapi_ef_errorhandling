import { EmployeesService } from './../../services/employees.service';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  Employees: Employee[];
  headers: any;
  constructor(private employeeService: EmployeesService) { }

  ngOnInit(): void {
    this.employeeService.getEmployees()
      .subscribe((emps: Employee[]) => {
        this.Employees = emps;
      }
      );
  }
}
