fn main() {
    // let is_male:bool = true;
    // let is_above_18: bool = true;

    // if is_male {
    //     println!("You are a male..!");
    // }else{
    //     println!("You are not a male..!");
    // }

    // if is_male && is_above_18 {
    //     println!("You are a legal male..!")
    // }

    let greeting = String::from("Hello World!");
    // println!("{}", greeting)

    let char1 = greeting.chars().nth(0);

    match char1 {
        Some(c)=>println!("{}", c),
        None =>println!("No character at this index..!")
    }
}

