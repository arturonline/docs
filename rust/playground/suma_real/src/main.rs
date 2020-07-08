use std::io;

fn main() {
    let mut num1 = String::new();
    let mut num2 = String::new();
    let mut num3 = String::new();
    let mut num4 = String::new();


    println!("dona'm el primer nombre: ");
    io::stdin()
            .read_line(&mut num1)
            .expect("failed to read input.");
        let new_a: f32 = num1.trim().parse().expect("invalid input");

        println!("dona'm el segon nombre: ");
        io::stdin()
                .read_line(&mut num2)
                .expect("failed to read input.");
            let new_b: f32 = num2.trim().parse().expect("invalid input");

        println!("dona'm el tercer nombre: ");
        io::stdin()
                .read_line(&mut num3)
                .expect("failed to read input.");
            let new_c: f32 = num3.trim().parse().expect("invalid input");

        println!("dona'm el quart nombre: ");
        io::stdin()
                .read_line(&mut num4)
                .expect("failed to read input.");
            let new_d: f32 = num4.trim().parse().expect("invalid input");

        println!("la suma es {suma:.*}", 1, suma=(new_a + new_b + new_c + new_d));
}
