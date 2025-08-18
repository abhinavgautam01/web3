use serde::{ Serialize, Deserialize };
use borsh::{ BorshDeserialize, BorshSerialize };


#[derive(Serialize, Deserialize, Debug)]
struct User {
    username: String,
    password: String
}

#[derive(BorshSerialize, BorshDeserialize)]
struct Person {
    name: String,
    age: u32,
}

fn main() {
    println!("Hello, world!");

    // Serde implementation
    println!();
    println!("### Serde Implementation ###");
    let u = User {
        username: String::from("Abhinav Gautam"),
        password: String::from("1234",)
    };

    let serialized_string = serde_json::to_string(&u);

    match serialized_string {
        Ok(str)=> {
            println!("Serialized string is: {}", str);
            let deserialized_string: Result<User, _> = serde_json::from_str(&str);
            
            match deserialized_string {
                Ok(str)=> println!("DeSerialized string is: {:?}", str),
                Err(_err)=>println!("Coudn't deserialise the data..!"),
            }
        },
        Err(_err)=>println!("Coudn't serialise the data..!"),
    }

    // Borsh implementation
    println!();
    println!("### Borsh Implementation ###");
    let person1 = Person {
        name: String::from("Golu"),
        age: 21
    };
    
    let mut vector:Vec<u8> = Vec::new();
    
    let serialize_result = person1.serialize(& mut vector);
    
    match serialize_result {
        Ok(_) => println!("Serialized Result: {:?}", vector),
        Err(_) => println!("Error while Serializing the data..!")
    }
    
    let deserialize_result = Person::try_from_slice(&vector);
    
    match deserialize_result {
        Ok(person) => println!("After Deserializing Name: {}", person.name),
        Err(_) => println!("Error while Deserializing the data..!")
    }
    
    // Lifetimes...
    
    println!();
    println!("### Lifetimes ###");
    let str1 = String::from("Abhinav");
    let str2 = String::from("Gautam");
    let longest_string;
    {
        let str3 = String::from("");
        longest_string = get_longest_string(&str1, &str2, &str3);
        println!("Longest string between {} and {} is {}", str1, str2, longest_string);
    }


    println!("Longest string between {} and {} is {}", str1, str2, longest_string);

}

fn get_longest_string<'a, 'b>(str1: &'a String, str2: &'a String, _str3: &'b String) -> &'a String {
    if str1.len() > str2.len() {
        return str1;
    }else {
        return str2;
    }
}