// #[derive(Debug)] //custom Derive macro
// struct User{
//     name: String,
//     age: u8
// }

// impl std::fmt::Display for User {
//     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
//        write!(f, "(Name is: {}, and age is: {})", self.name, self.age)
//     }
// }

// impl std::fmt::Debug for User {
//     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
//        write!(f, "(Name is: {}, and age is: {})", self.name, self.age)
//     }
// }

// fn main() {
//     // let user = User{
//     //     name: String::from("Abhinav"),
//     //     age: 21
//     // };
//     // println!("{:?}", user) //Declarative macros

// }


trait Serialize{
    fn serialize(&self)->Vec<u8>;
}

trait Deserialize{
    fn deserialize(v: &[u8])->Result<Swap, std::fmt::Error>;
}

#[derive(Debug)]
struct Swap {
    qty1: u32,
    qty2: u32,
}

impl Serialize for Swap {
    fn serialize(&self)->Vec<u8> {
        let mut v = Vec::new();
        v.extend_from_slice(&self.qty1.to_be_bytes());
        v.extend_from_slice(&self.qty2.to_be_bytes());
        return v;
    }
}

impl Deserialize for Swap {
    fn deserialize(v: &[u8])->Result<Self, std::fmt::Error> {
        if v.len() < 8 {
            return Err(std::fmt::Error)
        }
        let qty1 = u32::from_be_bytes([v[0], v[1], v[2], v[3]]);
        let qty2 = u32::from_be_bytes([v[4], v[5], v[6], v[7]]);
        return Ok(Swap { qty1, qty2 });
    }
}

fn main(){
    let s = Swap {
        qty1: 1,
        qty2: 2
    };

    let v = s.serialize();
    println!("{:?}", v);
    let s2 = Swap::deserialize(&v).unwrap();
    println!("{:?}", s2)
}