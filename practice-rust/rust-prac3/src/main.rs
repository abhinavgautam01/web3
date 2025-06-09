use std::{fmt::Display, sync::mpsc, thread::{self, spawn}, vec};

fn main() {
    // let _user;
    // let first_name = String::from("Abhinav");
    
    // let last_name = String::from("Gautam");

    // _user = _User{ _first_name: &&first_name[0..7], _last_name: &&last_name[0..6]};
    // // println!("User's name is {} {}", _user._first_name, _user._last_name);
    
    // let result = _longest_with_announcement(&first_name, &last_name, String::from("Larger string is displayed below..!"));
    // println!("result: {}", result)

    // // println!("User's name is {}", _user.first_name);
    // // println!("User's name is {}", user.name)
    // let x = 1;
    // {
    //     let vec = vec![1, 2, 3, 4];
    //     thread::spawn(move || {
    //         println!("Vecotr is {:?}", vec);
    //     });
    // }
    // println!("{}", x);

    // let (tx, rx) = mpsc::channel();
    
    // spawn(move || {
    //     tx.send(String::from("Golu"))
    // });

    // let value = rx.recv();

    // match value{
    //     Ok(value)=>println!("The value is {}", value),
    //     Err(error)=>println!("Recieving value resulted in error : {}", error),
    // };

    let (tx, rx) = mpsc::channel();

    for i in 0..10{
        let producer = tx.clone();
        spawn(move || {
            let mut sum: u64 = 0;
            for j in (i * 10_000_000)..((i + 1) * 10_000_000) {
                sum = sum + j;
            }
            producer.send(sum).unwrap();
        });
    }
    drop(tx);

    let mut final_sum: u64 = 0;
    print!("values received: ");
    for val in rx {
        print!("{} ", val);
        final_sum = final_sum + val;
    }

    println!("Result is : {}", final_sum);

}
// 4999999950000000
// 49999985000001

struct _User<'a, 'b> {
    _first_name: &'a str,
    _last_name: &'b str
}

fn _longest_with_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
)->&'a str where T: Display{
    println!("Announcement {ann}");
    if x.len() > y.len(){
        return x;
    }else{
        return  y;
    }
}