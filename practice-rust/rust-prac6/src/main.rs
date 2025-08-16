// fn main() {
//     let result = sum(2, 2);
//     println!("{}", result);
// }

// fn sum(a: u32, b: u32)-> u32 {
//     return a+b;
// }

fn main() {
    let name = String::from("Abhinav Gautam");

    // name transffered ownership to _get_len()...and remove after the execution..!
    let (len1, name) = _get_len1(name);
    println!("TEST1: Length of {}: {}", name, len1);

    let len2 = _get_len2(name);
    println!("TEST2: Length of Abhinav Gautam: {}", len2);

    // will give error : borrow of moved value..!
    // println!("{}", name);

    // OR

}

fn _get_len1(s: String) -> (usize, String) {
    return (s.len(), s);
}

fn _get_len2(s: String) -> usize {
    return s.len();
}