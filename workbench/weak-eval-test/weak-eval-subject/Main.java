import java.util.Scanner;

public class Main {

	public static void main(String[] args) throws Exception {

		Scanner sc = new Scanner(System.in);

		// ERROR if n is out of int range
		int n = sc.nextInt();

		switch (n) {
			case -1: // TIMEOUT without time record
				Thread.sleep(10_000);
				break;
			case 0: // TIMEOUT with time record
				Thread.sleep(2_001);
				break;
			case 1: // INCORRECT
				System.out.println("안녕, 세상!");
				break;
			default: // CORRECT
				System.out.println(n);
				break;
		}
	}
}
