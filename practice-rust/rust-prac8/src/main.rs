use dotenv::dotenv;
use std::{env, fmt::Display};
use chrono::{Utc, Local};
use uuid::Uuid;

use std::ops::{Add, Mul};

struct User {
    _username: String
}

impl Display for User {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        return write!(f, "Username is {}", self._username);
    }
}

struct Rect<T> {
    height: T,
    width: T,
}

impl <T: Mul<Output = T> + Copy> Rect<T> {
    fn area(&self)->T{
        return self.height * self.width;
    }
}

fn main() {
    dotenv().ok();
    println!("Hello, world!");

    let utc = Utc::now();
    let local_time = Local::now();
    println!("{}", utc);
    println!("{}", local_time);
    
    let my_uuid = Uuid::new_v4();
    println!("New uuid generated: {}", my_uuid);

    let var = env::var("UUID");
    match var {
        Ok(str) => println!("This is env stored uuid: {}", str),
        Err(_err) => println!("Error while reading Variable"),
    }

    let sum_result = sum(3, 4);

    println!("{}", sum_result);

    let _user = User {
        _username: String::from("Abhinav Gautam")
    };

    print_variable(1);
    print_variable(String::from("Hello"));
    print_variable(_user);


    let r1 = Rect {
        height: 10,
        width: 10
    };
    
    let r2 = Rect {
        height: 10.0,
        width: 10.0,
    };
    println!("{}", r1.area());
    println!("{}", r2.area());

    println!("!..Linear Search..!");
    let arr = vec![2, 3, 4, 5, 8, -4, -2, 9];
    _linear_search(&arr, 2);
    _linear_search(&arr, -2);
    _linear_search(&arr, 10);


}

fn sum<T: Add<Output = T>>(num1: T, num2: T) -> T {
    return num1 + num2;
}

fn print_variable<T: Display>(var: T){
    println!("{}", var);
}

fn _linear_search(arr: &Vec<i32>, target: i32) {
    for (index, &value) in arr.iter().enumerate() {
        if value == target {
            println!("{} is found at index {}", target, index);
            return; 
        }
    }
    println!("{} is not found in the array.", target);
}