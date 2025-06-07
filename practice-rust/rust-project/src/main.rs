use std::fs;

fn main(){
    // let mut initial_string = String::from("Hello");
    // println!("This is the initial String: {}", initial_string);
    
    // _update_string(&mut initial_string);
    
    // println!("This is the updated String: {}", initial_string);

    // let user = _User {
    //     name: String::from("Abhinav"),
    //     age: 21,
    //     _active: true
    // };

    // println!("{} is {} years old..!",user.name, user.age );

    // let rect = _Rect {
    //     width: 20,
    //     height: 20,
    // };
    // println!("Area of rectangle is {} having Width and Height of {} and {}", rect._area(), rect.width, rect.height);

    let circle: _Shape = _Shape::Circle(14.2);
    let square: _Shape = _Shape::Square(5.0);
    let rectangle: _Shape = _Shape::Rectangle(7.2, 3.7);

    let circle_area = calculate_area(circle);
    let square_area = calculate_area(square);
    let rectangle_area = calculate_area(rectangle);


    println!("Area of the Circle is {}, Area of the Square is {} and Area of the Rectangle is {}", circle_area, square_area, rectangle_area);

    //Error Handling..!
    let res = fs::read_to_string("example.txt");

    match res {
        Ok(content)=>{
            println!("File Content : {}", content);
        },
        Err(error)=> {
            println!("Error : {}", error);
        }
    };

    println!("Execution has not be stoped/halted because of the error handling..!");

    let my_string = String::from("rectangle");

    match find_first_a(&my_string) {
        Some(index)=>{
            println!("The index of the first a is {} in {}", index, my_string);
        },
        None=>println!("a is not found")
    }


}

fn _update_string(s: &mut String){
    s.push_str("...This text is being pushed to the existing String..!");
}

struct _User {
    name: String,
    age: u8,
    _active: bool,
}

struct _Rect {
    width: u16,
    height: u16,
}

impl _Rect{
    fn _area(&self)->u16{
        return self.height * self.width;
    }
}

enum _Shape {
    Circle(f32),
    Square(f32),
    Rectangle(f32, f32)
}

fn calculate_area(shape: _Shape)->f32{
    let ans = match shape {
        _Shape::Circle(radius)=>3.14*radius*radius,
        _Shape::Square(side)=>side*side,
        _Shape::Rectangle(length, width)=>length * width,
    };
    return ans;
}

fn find_first_a (s: &String)->Option<i32> {
    for (index, character) in s.chars().enumerate(){
        if character == 'a' {
            return Some(index as i32);
        }
    }
    return  None;
}