import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {UserService } from './user.service';
import { User } from './user';

@Component({
   selector: 'app-user',
   templateUrl: './user.component.html',
   styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit { 
   //Component properties
   allUsers: User[];
   statusCode: number;
   requestProcessing = false;
   userIdToUpdate = null;
   processValidation = false;
   //Create form
   userForm = new FormGroup({
       name: new FormControl('', Validators.required),
       email: new FormControl('', Validators.required)	   
   });
   //Create constructor to get service instance
   constructor(private userService: UserService) {
   }
   //Create ngOnInit() and and load 
   ngOnInit(): void {
	   this.getAllUsers();
   }   
   //Fetch all 
   getAllUsers() {
        this.userService.getAllUsers()
		  .subscribe(
                data => this.allUsers = data,
                errorCode =>  this.statusCode = errorCode);   
   }
   //Handle create and update 
   onUserFormSubmit() {
	  this.processValidation = true;   
	  if (this.userForm.invalid) {
	       return; //Validation failed, exit from method.
	  }   
	  //Form is valid, now perform create or update
      this.preProcessConfigurations();
	  let name = this.userForm.get('name').value.trim();
      let email = this.userForm.get('email').value.trim();	  
	  if (this.userIdToUpdate === null) {  
	    //Handle create 
	    let user= new User(null, name, email);	  
	    this.userService.createUser(user)
	      .subscribe(successCode => {
		            this.statusCode = successCode;
				    this.getAllUsers();	
					this.backToCreateUser();
			    },
		        errorCode => this.statusCode = errorCode);
	  } else {  
   	    //Handle update 
	    let user= new User(this.userIdToUpdate, name, email);	  
	    this.userService.updateUser(user)
	      .subscribe(successCode => {
		            this.statusCode = successCode;
				    this.getAllUsers();	
					this.backToCreateUser();
			    },
		        errorCode => this.statusCode = errorCode);	  
	  }
   }
   //Load  by id to edit
   loadUserToEdit(userId: string) {
      this.preProcessConfigurations();
      this.userService.getUserById(userId)
	      .subscribe(user => {
		            this.userIdToUpdate = user.userId;   
		            this.userForm.setValue({ name: user.name, email: user.email });
					this.processValidation = true;
					this.requestProcessing = false;   
		        },
		        errorCode =>  this.statusCode = errorCode);   
   }
   //Delete 
   deleteUser(userId: string) {
      this.preProcessConfigurations();
      this.userService.deleteUserById(userId)
	      .subscribe(successCode => {
		            this.statusCode = successCode;
				    this.getAllUsers();	
				    this.backToCreateUser();
			    },
		        errorCode => this.statusCode = errorCode);    
   }
   //Perform preliminary processing configurations
   preProcessConfigurations() {
      this.statusCode = null;
	  this.requestProcessing = true;   
   }
   //Go back from update to create
   backToCreateUser() {
      this.userIdToUpdate = null;
      this.userForm.reset();	  
	  this.processValidation = false;
   }
}
    