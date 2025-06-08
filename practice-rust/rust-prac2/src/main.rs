fn main() {
    // let test_string = String::from ("Hello World");
    // let first_word = _find_first_word(&test_string);
    // println!("{} is the first word from {}", first_word, test_string);

    // let user: _User = _User{
    //     name: String::from("Golu"),
    //     age: 21,
    // };

    // println!("{}",_notify(user));
    
    let ans;
    let str1 = String::from ("Golu");
    {
        let str2 = String::from("Abhinav Gautam");
        
        ans = largest_string(&str1, &str2);
        println!("the largest string is {}", ans)
    }

}

fn largest_string<'a>(str1: &'a str, str2: &'a str)-> &'a str {
    if str1.len() > str2.len(){
        return str1;
    }else {
        return str2;
    }
}

trait _Summary {
    fn summarize(&self)->String{
        return format!("This is the Default Summarize trait..!");
    }
}

trait _Fix {
    fn _fix(&self)->String{
        return format!("This is the Default Fix trait..!");
    }
}

struct _User {
    name: String,
    age: u32,
}


impl _Summary for _User {
    fn summarize(&self)->String{
        return format!("{} is {} years old", self.name, self.age);
    }
}
impl _Fix for _User {
    fn _fix(&self)->String{
        return format!("This is the Fix Trait..!")
    }
}

fn _notify<T: _Summary + _Fix>(a:T)-> String{
    return format!("{}", a.summarize())
}

fn _find_first_word (arg_str: &String)->&str{
    let mut index = 0;
    for (_, i) in arg_str.chars().enumerate(){
        if i == ' '{
            break;
        }
        index = index + 1;
    }
    return &arg_str[0..index];
}
