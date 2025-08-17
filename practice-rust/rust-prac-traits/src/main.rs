use std::f32::consts::PI;

macro_rules! say_hello {
    () => {
        println!("Heloo World from the say_hello macro..!");
    };
}

trait Shape {
    fn area(&self)-> f32;
}
struct Rect {
    width: f32,
    height: f32,
}

struct Circle {
    radius: f32,
}

impl Shape for Rect {
    fn area(&self) -> f32 {
        return self.height * self.width;
    }
}

impl Shape for Circle {
    fn area(&self) -> f32 {
        return PI * self.radius * self.radius;
    }
}


fn main() {
    println!("Hello, world!");

    let circle1 = Circle {
        radius: 7.0
    };

    let rectangle1 = Rect {
        width: 10.0,
        height: 10.0,
    };

    let area_rect = rectangle1.area();
    println!("Area of rectangle using simple impl: {}", area_rect);

    let area_circle = circle1.area();
    println!("Area of rectangle using simple impl: {}", area_circle);

    get_area_of_the_shape(&rectangle1);
    get_area_of_the_shape(&circle1);
    say_hello!();
}

fn get_area_of_the_shape<T: Shape>(_shape: &T){
    println!("Area using trait implementation: {}", _shape.area());
}