use std::collections::HashMap;

fn main() {
    // let mut vec = Vec::new();
    // vec.push(1);
    // vec.push(2);
    // vec.push(3);
    // vec.push(4);
    // println!("{:?}", _even_vec_filter(&vec));

    // println!("{:?}", vec);

    // let mut users : HashMap<String, i32> = HashMap::new();
    // users.insert(String::from("Golu"), 3);
    // users.insert(String::from("Abhinav"), 4);

    // let user1 = users.get("Golu");

    // match user1 {
    //     Some(val)=>println!("Value you for the key is {}", val),
    //     None=>println!("No Value for the key..!"),
    // }

    // println!("{}", user1.unwrap())

    // let input_vec = vec![(String::from("Golu"), 21), (String::from("Abhinav"), 20)];
    // let hashmap = _group_values_by_key(&input_vec);

    // println!("Printing the inputVector:");
    // println!("{:?}", input_vec);
    // println!("Printing the HashMap:");
    // println!("{:?}", hashmap);

    let nums = vec![1, 2, 3, 4, 5];
    let iter_num = nums.iter();

    let v2_iter_num = iter_num.map(|x| x+1);

    for val in v2_iter_num {
        print!("{}, ", val)
    }
    let filter_and_map_vec_var = _filter_and_map(nums);

    let iter3 = filter_and_map_vec_var.iter();
    println!("...");

    for val in iter3{
        print!("{}, ", val)
    }
    
    // for val in iter_num{         it is consumed..!
    //     print!("{}, ", val)
    // }
    println!("...");

    // while let Some(val) = iter_num.next(){
    //     print!("{}, ", val);
    // }

}

fn _even_vec_filter(vec: & Vec<i32>)->Vec<i32>{
    let mut new_vec = Vec::new();
    for val in vec {
        if val % 2 == 0{
            new_vec.push(*val);  
        }
    };
    return new_vec;
}

fn _group_values_by_key(vec: &Vec<(String, i32)>)->HashMap<String, i32>{
    let mut hm = HashMap::new();
    for (key, value) in vec{
        hm.insert(key.to_string(), *value);
    };
    return hm;
}

fn _filter_and_map (vec: Vec<i32>)->Vec<i32>{
    let new_iter = vec.iter().filter(|x| *x%2==1).map(|x| x*2);
    let new_vec = new_iter.collect();
    return new_vec;
}