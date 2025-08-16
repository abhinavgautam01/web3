use std::f32::consts::PI;

#[derive(Debug)]
enum Directions {
    North, 
    South, 
    West, 
    East,
}

enum Shape {
    Square(f32),
    Rectangle(f32, f32),
    Circle(f32)
}

impl Shape {
    fn area(&self) -> f32 {
        return match self {
            Shape::Square(side) => side * side,
            Shape::Rectangle(length, width) => length * width,
            Shape::Circle(radius) => PI * radius * radius,
        };
    }
}

struct Rect {
    width: f32,
    height: f32,
}

impl Rect {
    fn area(&self)->f32 {
        return self.height * self.width;
    }

    fn perimeter(&self)->f32 {
        return 2.0 * (self.width + self.height);
    }

    fn print_something(_num: usize) {
        println!("This is a Static Function. {}", _num);
    }
}

fn main() {
    println!("Hello, world!");
    let mut name = String::from("Abhinav Gautam");
    let result = get_len(&name);
    println!("{}", name);
    println!("{}", result);
    let name2 = &mut name; 
    println!("{}", name2);
    println!("{}", name); // this will work...
    
    
    // println!("{}", name); // this will not work...
    // println!("{}", name2);

    let r = Rect{
        width: 10.0,
        height: 10.0,
    };

    println!("{}, {}", r.width, r.height);
    println!("{}", r.area());
    println!("{}", r.perimeter());
    Rect::print_something(10);

    let direction1 = Directions::North;
    let direction2 = Directions::South;
    let direction3 = Directions::East;
    let direction4 = Directions::West;

    steer(direction1);
    steer(direction2);
    steer(direction3);
    steer(direction4);

    // binarySearch
    let arr = vec![-2, 3, 4, 7, 11];
    let result = binary_search(&arr, -2);
    match result {
        Some(index)=> println!("Value found at index {}", index),
        None=> println!("Value not found")
    }

    let shape_square = Shape::Square(10.0);
    let shape_rectangle = Shape::Rectangle(20.0, 10.0);
    let shape_circle = Shape::Circle(7.0);

    let area_square = shape_square.area();
    let area_rectangle = calculate_area(&shape_rectangle);
    let area_circle = calculate_area(&shape_circle);
    let perimeter_square = calculate_perimeter(&shape_square);
    let perimeter_rectangle = calculate_perimeter(&shape_rectangle);
    let perimeter_circle = calculate_perimeter(&shape_circle);

    println!("Area of Square is {}", area_square);
    println!("Area of Rectangle is {}", area_rectangle);
    println!("Area of Circle is {}", area_circle);
    println!("Perimeter of Square is {}", perimeter_square);
    println!("Perimeter of Rectangle is {}", perimeter_rectangle);
    println!("Perimeter of Circle is {}", perimeter_circle);


}

fn steer(_direction: Directions){
    // println!("Player moved to {:?}", _direction);

    match _direction {
        Directions::North=> println!("Player moved to North"),
        Directions::South=> println!("Player moved to South"),
        _=> println!("Player moved to Horizontal"),
    }
}

fn get_len(s: &String)-> usize{
    return s.len();
}

fn binary_search(arr: &Vec<i32>, target: i32)-> Option<usize> {
    let mut left = 0;
    let mut right = (arr.len() as i32) - 1;

    while left <= right {
        let mid = left + (right - left) / 2;
        let mid_val = arr[mid as usize];

        if mid_val == target {
            return Some(mid as usize);
        }else if mid_val < target {
            left = mid + 1;
        }else {
            right = mid - 1;
        }
    }
    None
}

fn calculate_area(_shape: &Shape)-> f32 {
    return match _shape {
        Shape::Square(side) => side * side,
        Shape::Rectangle(length, width) => length * width,
        Shape::Circle(radius) => PI * radius * radius,
    };
}

fn calculate_perimeter(_shape: &Shape)-> f32 {
    return match _shape{
        Shape::Square(side) => side * side,
        Shape::Rectangle(length, width) => length * width,
        Shape::Circle(radius) => 2.0 * PI * radius,
    };
}