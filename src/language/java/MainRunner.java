public class MainRunner {

	public static void main(String[] args) throws Exception {

		String[] newArgs = {};

		long start = System.currentTimeMillis();

		Main.main(newArgs);

		long end = System.currentTimeMillis();

		System.out.println("^" + (end - start) + "$");
	}
}
