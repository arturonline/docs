# JUnit tests

⚠ <a href="https://www.javaguides.net/p/junit-5.html">Java Guides</a>

```java
import org.junit.jupiter.api.*;

// Test Class
@DisplayName("JUnit 5 Example")
class JUnit5ExampleTest {

//Teardown Methods, these methods must not return anything.

    // @BeforeAll it’s run once before any test method is run
    @BeforeAll
    static void beforeAll() {
        System.out.println("Before all test methods");
    }
    // @BeforeEach is invoked before each test method.
    @BeforeEach
    void beforeEach() {
        System.out.println("Before each test method");
    }
    //@AfterEach annotation is invoked after each test method.
    @AfterEach
    void afterEach() {
        System.out.println("After each test method");
    }
    // @AfterAll annotation must be static, and it’s run once after all test methods have been run.
    @AfterAll
    static void afterAll() {
        System.out.println("After all test methods");
    }

// Tests
    // A test method must not return anything.
    @Test
    @DisplayName("First test")
    void firstTest() {
        System.out.println("First test method");
    }

    @Test
    @DisplayName("Second test")
    void secondTest() {
        System.out.println("Second test method");
    }

    @Test
    @DisplayName("Third test")
    void thirdTest() {
        float square = 2 * 2;
        float rectangle = 2 * 2;

        assertEquals(square, rectangle);
    }
}
```