use std::io;

fn main() {
    let mut varA = String::new();
    let mut varB = String::new();

    println!("Dona'm new_A: ");

    io::stdin()
        .read_line(&mut varA)
        .expect("failed to read input.");


    println!("Dona'm new_B: ");

    io::stdin()
        .read_line(&mut varB)
        .expect("failed to read input.");


    //let var_c = String::new();
    let var_c = varA;
    varA = varB;
    varB = var_c;


    println!("new_A = {}",varA);
    println!("new_B = {}",varB);
}


