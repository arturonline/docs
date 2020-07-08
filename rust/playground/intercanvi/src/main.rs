use std::io;

fn main() {
    let mut varA = String::new();
    let mut varB = String::new();

    println!("Dona'm new_A: ");

    io::stdin()
        .read_line(&mut varA)
        .expect("failed to read input.");
    let mut new_a: i32 = varA.trim().parse().expect("invalid input");

    println!("Dona'm new_B: ");

    io::stdin()
        .read_line(&mut varB)
        .expect("failed to read input.");
    let mut new_b: i32 = varB.trim().parse().expect("invalid input");

    let var_c: i32;
    var_c = new_a;
    new_a = new_b;
    new_b = var_c;


    println!("new_A = {}",new_a);
    println!("new_B = {}",new_b);
}


