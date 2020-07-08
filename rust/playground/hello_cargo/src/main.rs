use std::io;

fn main() {
    let mut num = String::new();
    let mut num2 = String::new();

    println!("Dona'm el primer nombre: ");

    io::stdin()
        .read_line(&mut num)
        .expect("failed to read input.");
    let n1: i32 = num.trim().parse().expect("invalid input");

    println!("Dona'm el segon nombre: ");

    io::stdin()
        .read_line(&mut num2)
        .expect("failed to read input.");
    println!("{}", num2);
    let n2: i32 = num2.trim().parse().expect("invalid input");

    println!("Resultado: {}", n1 + n2);
}

