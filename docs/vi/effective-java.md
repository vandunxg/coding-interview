# 《Effective Java》

## Chương 2 Tạo và huỷ đối tượng

### Mục 1: Cân nhắc dùng static factory method thay cho constructor

So với constructor, static factory method có những ưu điểm sau:

1. Static factory method có tên, có thể mô tả chính xác hơn đối tượng đang được trả về, nên dễ đọc hơn. Tên constructor luôn cố định, chỉ có thể dùng cách thay đổi danh sách tham số để tạo các đối tượng khác nhau.
1. Không cần tạo một đối tượng mới trong mỗi lần gọi; có thể cache đối tượng trước rồi trả về trực tiếp khi cần, tránh tạo các đối tượng trùng lặp không cần thiết. Khi so sánh, có thể dùng trực tiếp toán tử `==`.
1. Có thể trả về đối tượng thuộc bất kỳ lớp con nào của kiểu trả về ban đầu, linh hoạt hơn. Cách này phù hợp với các framework dựa trên interface.
1. Khi tạo instance được parameterize, code ngắn gọn hơn.

Không cần cung cấp type parameter hai lần liên tiếp:

```java
Map<String, List<String>> m = new HashMap<String, List<String>>();
```

Chỉ cần cung cấp một static factory method:

```java
public static <K, V> Hash<K, V> newInstance() {
    return new HashMap<K, V>;
}

Map<String, List<String>> m = HashMap.newInstance();
```

Tuy nhiên, static factory method cũng có một số nhược điểm:

1. Nếu một lớp chỉ chứa private constructor thì không thể được subclass (kế thừa). Nhưng điều này cũng có thể là một lợi thế ngoài ý muốn, vì nó khuyến khích dùng composition thay vì inheritance;
1. Static factory method không khác nhiều so với các static method khác, không thể được đánh dấu rõ ràng trong tài liệu API như constructor. Tuy vậy, static factory method có một số tên gọi quen thuộc như `valueOf`, `of`, `getInstance`, `newInstance`......

### Mục 2: Khi có nhiều tham số constructor, hãy cân nhắc dùng builder

Hãy cân nhắc một lớp biểu diễn nhãn thành phần dinh dưỡng được in bên ngoài thực phẩm. Một số field trong nhãn là bắt buộc, còn có hơn 20 field tuỳ chọn. Hầu hết sản phẩm đều có giá trị khác không ở một vài field tuỳ chọn.

Với một lớp như vậy, nên viết bằng constructor hoặc static method nào?

1. Mẫu telescoping constructor

Cách thứ nhất là **mẫu telescoping constructor**. Trước tiên cung cấp một constructor chỉ có các tham số bắt buộc, sau đó cung cấp một constructor có một tham số tuỳ chọn, tiếp theo là constructor có hai tham số tuỳ chọn, cứ thế tiếp tục, cuối cùng là constructor bao gồm tất cả tham số tuỳ chọn.

```java
public class NutritionFacts {
    private final int servingSize;
    private final int servings;
    private final int calories;
    private final int fat;
    private final int sodium;
    private final int carbohydrate;

    public NutritionFacts(int servingSize, int servings) {
        this(servingSize, servings, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories) {
        this(servingSize, servings, calories, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat) {
        this(servingSize, servings, calories, fat, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium) {
        this(servingSize, servings, calories, fat, sodium, 0);
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium, int carbohydrate) {
        this.servingSize = servingSize;
        this.servings = servings;
        this.calories = calories;
        this.fat = fat;
        this.sodium = sodium;
        this.carbohydrate = carbohydrate;
    }
}
```

Khi muốn tạo instance, hãy dùng constructor có danh sách tham số ngắn nhất nhưng danh sách đó phải chứa tất cả tham số cần thiết lập:

```java
NutritionFacts cocaCola = new NutritionFacts(240, 8, 100, 0, 35, 27);
```

Constructor này thường yêu cầu nhiều tham số mà bạn vốn không muốn thiết lập, nhưng vẫn phải truyền giá trị cho chúng. Khi số lượng tham số tăng lên, mọi thứ nhanh chóng mất kiểm soát. Code phía client cũng khó viết, khả năng đọc cũng kém.

2. Mẫu JavaBean

Mẫu thứ hai là **mẫu JavaBean**. Trong mẫu này, tạo một constructor không tham số để tạo đối tượng, sau đó gọi các setter method để thiết lập từng tham số bắt buộc. Mẫu này khắc phục nhược điểm của mẫu telescoping constructor, code cũng rất dễ đọc và hẳn nhiều độc giả đã quen thuộc.


```java
NutritionFacts cocaCola = new NutritionFacts();
cocaCola.setServingSize(200);
cocaCola.setServings(8);
cocaCola.setCalories(100);
cocaCola.setSodium(35);
cocaCola.setCarbohydrate(27);
```

Đáng tiếc là bản thân mẫu JavaBean có những nhược điểm nghiêm trọng. Vì quá trình khởi tạo bị chia thành nhiều lần gọi, JavaBean có thể ở trạng thái không nhất quán trong quá trình khởi tạo. Nếu cố sử dụng một đối tượng đang ở trạng thái không nhất quán, thao tác sẽ thất bại và việc debug cũng rất khó khăn. Lập trình viên phải nỗ lực thêm để bảo đảm thread safety.

3. Mẫu Builder

Có một phương án thứ ba vừa bảo đảm tính an toàn như mẫu telescoping constructor, vừa bảo đảm khả năng đọc tốt như mẫu JavaBean: đó là **mẫu Builder**.

```java
public class NutritionFacts {
    private final int servingSize;
    private final int servings;
    private final int calories;
    private final int fat;
    private final int sodium;
    private final int carbohydrate;

    public static class Builder {
        // Required params
        private final int servingSize;
        private final int servings;

        // Optional params
        private int calories = 0;
        private int fat = 0;
        private int sodium = 0;
        private int carbohydrate = 0;

        public Builder(int servingSize, int servings) {
            this.servingSize = servingSize;
            this.servings = servings;
        }

        public Builder calories(int val) {
            this.calories = val;
            return this;
        }
        public Builder fat(int val) {
            this.fat = val;
            return this;
        }
        public Builder sodium(int val) {
            this.sodium = val;
            return this;
        }
        public Builder carbohydrate(int val) {
            this.carbohydrate = val;
            return this;
        }
        public NutritionFacts build() {
            return new NutritionFacts(this);
        }
    }

    // 私有构造器
    private NutritionFacts(Builder builder) {
        servingSize = builder.servingSize;
        servings = builder.servings;
        calories = builder.calories;
        fat = builder.fat;
        sodium = builder.sodium;
        carbohydrate = builder.carbohydrate;
    }
}
```

Code phía client lúc này dễ viết hơn và quan trọng hơn là dễ đọc.

```java
NutritionFacts cocaCola = new NutritionFacts.Builder(240, 8)
    .calories(100)
    .sodium(35)
    .carbohydrate(27)
    .build();
```

Mẫu Builder cũng có những nhược điểm riêng. Để tạo đối tượng, trước hết phải tạo builder của nó. Dù chi phí tạo builder trong thực tế có thể không đáng kể, trong một số trường hợp đặc biệt chú trọng hiệu năng, nó vẫn có thể trở thành vấn đề. Mẫu Builder cũng dài dòng hơn mẫu telescoping constructor, vì vậy chỉ nên dùng khi có nhiều tham số, chẳng hạn từ 4 tham số trở lên.

Tóm lại, nếu constructor hoặc static factory của một lớp có nhiều tham số, mẫu Builder là một lựa chọn tốt khi thiết kế lớp đó, đặc biệt khi phần lớn tham số là tuỳ chọn. So với mẫu telescoping constructor truyền thống, nó dễ đọc hơn; so với mẫu JavaBean, nó an toàn hơn.

### Mục 3: Củng cố thuộc tính Singleton bằng private constructor hoặc enum type

1. Public static member

```java
public class Singleton {
    public static final Singleton INSTANCE = new Singleton();
    private Singleton() {}
}
```

2. Static factory method

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {}

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

Cả hai cách đều bảo đảm tính duy nhất trên toàn cục của Singleton. Tuy nhiên, client có đặc quyền có thể dùng method `AccessibleObject.setAccessible` để gọi private constructor thông qua reflection. Nếu cần chống lại cuộc tấn công này, có thể sửa constructor để nó ném exception khi được yêu cầu tạo instance thứ hai.

Để biến lớp Singleton được triển khai bằng một trong hai cách này thành serializable, chỉ thêm `implements Serializable` vào khai báo là chưa đủ. Để duy trì và bảo đảm Singleton, phải khai báo mọi instance field là transient và cung cấp method `readResolve`. Nếu không, mỗi lần deserialize một instance đã serialize sẽ tạo ra một instance mới.

```java
priavte Object readResolve() {
    return INSTANCE;
}
```

3. Enum một phần tử

Từ Java 1.5, có cách thứ ba để triển khai Singleton. Chỉ cần viết một enum type chứa một phần tử:

```java
public enum Singleton {
    INSTANCE;

    public void otherMethods() {...}
}
```

Cách này ngắn gọn hơn, được cung cấp sẵn cơ chế serialization, ngăn tuyệt đối việc tạo nhiều instance, và là cách tốt nhất để triển khai Singleton.

### Mục 4: Củng cố khả năng không thể khởi tạo bằng private constructor

Trong quá trình phát triển dự án, đôi khi chúng ta chắc chắn sẽ gặp các utility class mà ta không muốn chúng được khởi tạo, vì các method của chúng có thể đều được đánh dấu bằng `static`, nên instance không có ý nghĩa gì; tuy nhiên trong lúc viết code, ta thường không chú ý khi viết utility class và không viết constructor. Khi không có constructor tường minh, compiler sẽ cung cấp một public, không tham số default constructor (`default constructor`). Với người dùng, constructor này không khác gì các constructor khác. Vì vậy trong một số API đã phát hành, ta thường thấy những lớp bị khởi tạo ngoài ý muốn.

**Cố gắng biến lớp thành abstract class để buộc lớp đó không thể được khởi tạo là không thể làm được.** Vì abstract class có thể được subclass, và subclass cũng có thể được khởi tạo. Việc đồng thời định nghĩa là abstract còn khiến người dùng hiểu lầm rằng lớp này được thiết kế riêng cho việc kế thừa. Vậy làm thế nào để bảo đảm lớp không bị khởi tạo? Vì compiler chỉ sinh default constructor khi lớp không chứa constructor tường minh, nên chỉ cần tạo private constructor cho lớp này thì nó sẽ không thể được khởi tạo:

```java
// Noninstantiable utility class
public class UtilityClass {
    // Suppress default constructor for noninstantiability
    private UtilityClass() {
        throw new AssertionError();
    }

    ... // Remainder omitted
}
```

Như trên, vì constructor tường minh là private nên không thể khởi tạo từ bên ngoài lớp. AssertionError không bắt buộc, nhưng viết như vậy có thể tránh việc gọi constructor bên trong lớp. Nó bảo đảm lớp này không thể được khởi tạo trong bất kỳ tình huống nào.

**Lưu ý** cách dùng này cũng có tác dụng phụ: nó khiến một lớp không thể được subclass. Vì mọi constructor đều phải gọi constructor của superclass một cách tường minh hoặc ngầm định, trong trường hợp trên subclass không có superclass constructor nào có thể truy cập để gọi.

### Mục 5: Tránh tạo các đối tượng không cần thiết

Nói chung, tốt nhất không nên tạo một đối tượng mới có cùng chức năng mỗi khi cần mà nên tái sử dụng đối tượng. Cách tái sử dụng vừa nhanh vừa phổ biến. Nếu đối tượng là immutable, nó luôn có thể được tái sử dụng.
Hãy xem ví dụ phản diện cực đoan sau:

```java

String s = new String("stringette");  // Don't do this!

```

Mỗi lần câu lệnh trên được thực thi, nó tạo một instance String mới, nhưng tất cả thao tác tạo đối tượng đó đều không cần thiết. Tham số truyền cho String constructor ("stringette") bản thân đã là một instance String, tương đương về mặt chức năng với mọi đối tượng do constructor tạo ra. Hãy thử nghĩ xem, nếu cách dùng này nằm trong một vòng lặp hoặc trong một method được gọi thường xuyên, nó sẽ tạo ra hàng nghìn, hàng vạn instance String không cần thiết.

Phiên bản cải tiến như sau:

```java

String s = "stringette";

```

Phiên bản trên chỉ dùng một instance String thay vì tạo một instance mới trong mỗi lần thực thi. Ngoài ra, nó còn bảo đảm rằng với mọi code chạy trong cùng một virtual machine, chỉ cần chứa cùng string literal thì đối tượng đó sẽ được tái sử dụng [JLS, 3.10.5].

Với immutable class đồng thời cung cấp static factory method (xem Mục 1) và constructor, thông thường nên dùng static factory method thay vì constructor để tránh tạo các đối tượng không cần thiết. Mỗi lần được gọi, constructor sẽ tạo một đối tượng mới, còn static factory method không bao giờ bị buộc phải làm như vậy và trên thực tế cũng không làm vậy.

Ngoài việc tái sử dụng immutable object, cũng có thể tái sử dụng các mutable object mà ta biết sẽ không bị sửa đổi. Sau đây là một ví dụ phản diện tinh tế và cụ thể hơn, dùng Date mutable quen thuộc; vì sau khi được tính toán, Date object không thay đổi nữa.

```java

public class Person {

    private final Date birthDate;

    public Person(Date birthDate) {
        this.birthDate = birthDate;
    }

    // Other fields, methods, and constructor omitted
    // Don't do this!
    public boolean isBabyBoomer() {
        // Unnecessary allocation of expensive object
        Calendar gmtCal = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
        gmtCal.set(1946, Calendar.JANUARY, 1, 0, 0, 0);
        Date boomStart = gmtCal.getTime();
        gmtCal.set(1965, Calendar.JANUARY, 1, 0, 0, 0);
        Date boomEnd = gmtCal.getTime();

        return birthDate.compareTo(boomStart) >= 0 &&
                birthDate.compareTo(boomEnd) < 0;
    }

}

```

Lớp trên xây dựng một model gồm một người và method isBabyBoomer dùng để kiểm tra người đó có phải là một “baby boomber (trẻ em sinh ra trong giai đoạn bùng nổ dân số)” hay không, tương đương với việc kiểm tra người đó có sinh trong khoảng từ năm 1946 đến năm 1964 hay không.

Từ code trên có thể thấy, mỗi lần method isBabyBoomer được gọi, nó đều tạo một Calendar, một TimeZone và hai instance Date mới; thực ra điều này không cần thiết. Sau đây ta dùng một static initializer (`initializer`) để tránh sự kém hiệu quả đó:

```java

public class Person {
    private final Date birthDate;

    public Person(Date birthDate) {
        this.birthDate = birthDate;
    }
    // Other fields, methods, and constructor omitted

    // The starting and ending dates of the baby boom
    private static final Date BOOM_START;
    private static final Date BOOM_END;

    static {
        Calendar gmtCal = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
        gmtCal.set(1946, Calendar.JANUARY, 1, 0, 0, 0);
        BOOM_START = gmtCal.getTime();
        gmtCal.set(1965, Calendar.JANUARY, 1, 0, 0, 0);
        BOOM_END = gmtCal.getTime();
    }

    public boolean isBabyBoomer() {
        return birthDate.compareTo(BOOM_START) >= 0 &&
                birthDate.compareTo(BOOM_END) < 0;
    }
}

```

Lớp Person cải tiến chỉ tạo một lần các instance Calendar, TimeZone và Date trong lúc khởi tạo, thay vì tạo chúng mỗi lần gọi isBabyBoomer. Nếu method isBabyBoomer được gọi thường xuyên, method cải tiến sẽ nâng cao hiệu năng đáng kể. Chẳng hạn, khi kiểm tra 10 triệu người có sinh trong khoảng từ năm 1946 đến năm 1964 hay không, qua kiểm thử, phiên bản cũ mất 32000ms còn phiên bản cải tiến chỉ mất 130ms, nhanh hơn khoảng 250 lần. Tuy nhiên hiệu quả của tối ưu hoá này không phải lúc nào cũng rõ rệt như vậy, vì chi phí tạo Calendar instance đặc biệt cao. Nhưng phiên bản cải tiến sẽ cải thiện hiệu năng rõ ràng khi lượng dữ liệu lớn, đồng thời code cũng rõ ràng hơn vì BOOM_START và BOOM_END rõ ràng nên được xem là constant.

Trong ví dụ ở phần trước của mục này, những đối tượng được thảo luận rõ ràng đều có thể tái sử dụng vì sau khi khởi tạo chúng không còn thay đổi. Một số trường hợp khác thì không phải lúc nào cũng rõ ràng như vậy. Hãy xét trường hợp adapter (`adapter`), đôi khi còn gọi là view (`view`). Adapter là một đối tượng uỷ quyền chức năng cho một backing object (`backing object`), nhờ đó cung cấp cho backing object một interface thay thế. Vì adapter không có thông tin state nào khác ngoài backing object, nên với một adapter cụ thể của một đối tượng cho trước, không cần tạo nhiều instance adapter.

Ví dụ, method keySet của Map interface trả về Set view của Map object đó, chứa tất cả key (`key`) trong Map. Nhìn bề ngoài, có vẻ mỗi lần gọi keySet phải tạo một Set instance mới, nhưng trên thực tế với một Map object cho trước, mỗi lần gọi method keySet đều trả về cùng một Set instance. Dù Set instance được trả về thường có thể thay đổi, mọi đối tượng được trả về đều tương đương về mặt chức năng: khi một đối tượng được trả về thay đổi, tất cả đối tượng được trả về khác cũng thay đổi, vì chúng cùng được hỗ trợ bởi một Map instance. Dù tạo nhiều instance của keySet view không gây hại, việc đó cũng không cần thiết.

Trong bản phát hành Java 1.5, có một cách mới để tạo các đối tượng dư thừa, gọi là autoboxing (`autoboxing`), cho phép lập trình viên trộn primitive type với boxed primitive type (`Boxed Primitive Type`), tự động boxing và unboxing khi cần. Autoboxing khiến khác biệt giữa primitive type và boxed primitive type trở nên mờ nhạt, nhưng không xoá bỏ hoàn toàn. Chúng khác nhau một cách tinh tế về semantics và khá rõ ràng về hiệu năng (xem Mục 49). Hãy xét chương trình sau, tính tổng mọi giá trị dương của int. Vì vậy chương trình phải dùng kiểu long, bởi int không đủ lớn để chứa tổng mọi giá trị dương của int:

```java

// Hideously slow program! Can you spot the object creation?
public static void mian(String[] args) {
    Long sum = 0L;
    for (long i = 0; i < Integer.MAX_VALUE; i++) {
        sum += i;
    }
    System.out.println(sum);
}

```

Chương trình này tính ra đáp án đúng, nhưng chậm hơn thực tế chỉ vì gõ nhầm một ký tự. Biến sum được khai báo là Long thay vì long, nghĩa là chương trình đã tạo khoảng 2^31 instance Long dư thừa (gần như mỗi lần cộng long vào Long sum là tạo một instance). Đổi khai báo sum từ Long thành long làm thời gian chạy giảm từ 43 giây xuống 6.8 giây. Kết luận rất rõ ràng: **ưu tiên primitive type thay vì boxed primitive type và cẩn thận với autoboxing vô ý.**

Tất nhiên, cũng không nên hiểu sai rằng nội dung của mục này ngụ ý “chi phí tạo đối tượng rất đắt, chúng ta nên cố gắng tránh tạo đối tượng hết mức có thể”. Ngược lại, vì constructor của các đối tượng nhỏ chỉ thực hiện rất ít công việc tường minh, việc tạo và thu hồi đối tượng nhỏ rất rẻ, đặc biệt là trên JVM hiện đại. Tạo thêm đối tượng để nâng cao tính rõ ràng, ngắn gọn và chức năng của chương trình thường là một việc tốt.

Ngược lại, dùng object pool (`object pool`) của riêng mình để tránh tạo đối tượng không phải là cách làm tốt, trừ khi các đối tượng trong pool rất nặng. Ví dụ điển hình của việc dùng object pool đúng cách là database connection pool. Chi phí thiết lập database connection rất cao, vì vậy tái sử dụng các đối tượng này là rất hợp lý. Ngoài ra, license của database có thể giới hạn bạn chỉ được dùng một số lượng connection nhất định. Nhưng nói chung, tự duy trì object pool chắc chắn làm code trở nên rối rắm, đồng thời tăng memory footprint (`footprint`) và làm giảm hiệu năng. Vì vậy cần thận trọng khi dùng object pool.

Nội dung tương ứng với mục này là phần “defensive copying (`defensive copying`)” ở Mục 39. Mục này nói “khi nên tái sử dụng đối tượng hiện có thì đừng tạo đối tượng mới”, còn Mục 39 nói “khi nên tạo đối tượng mới thì đừng tái sử dụng đối tượng hiện có”. Lưu ý rằng khi khuyến nghị dùng defensive copying, đó là vì chi phí phải trả cho việc tái sử dụng đối tượng lớn hơn rất nhiều so với chi phí tạo đối tượng. Nếu không thực hiện defensive copying khi cần, có thể dẫn đến lỗi tiềm ẩn và lỗ hổng bảo mật; còn việc tạo đối tượng không cần thiết chỉ ảnh hưởng đến phong cách và hiệu năng.

**Tóm lại, nên phân tích cụ thể theo từng tình huống để quyết định tạo hay tái sử dụng đối tượng; qua phân tích, cần nhận biết rằng việc tái sử dụng đối tượng không được bảo vệ đòi hỏi sự chú ý đặc biệt, nếu không có thể dẫn đến lỗi và lỗ hổng bảo mật.**

### Mục 6: Loại bỏ các object reference đã lỗi thời

Khi chuyển từ ngôn ngữ quản lý bộ nhớ thủ công (chẳng hạn C hoặc C++) sang ngôn ngữ có garbage collection (chẳng hạn Java hoặc Go), công việc của lập trình viên trở nên dễ dàng hơn vì sau khi dùng xong đối tượng, chúng sẽ được tự động thu hồi. Khi lần đầu chuyển từ C hoặc C++ sang Java và trải nghiệm chức năng thu hồi đối tượng, bạn có thể thấy điều đó thật kỳ diệu. Điều này dễ khiến bạn nghĩ rằng không cần tự suy nghĩ về memory management, nhưng thực ra không phải vậy.

Hãy xét ví dụ đơn giản về cách triển khai stack sau:

```java

// Can you spot the "memory leak"
public class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if (size == 0)
            throw new EmptyStackException();
        return elements[--size];
    }

    /**
     * Ensure space for at least one more element, roughly
     * doubling the capacity each time the array needs to grow.
     */
    private void ensureCapacity() {
        if (elements.length == size) {
            elements = Arrays.copyOf(elements, 2 * size + 1);
        }
    }

}

```

Trong chương trình này (phiên bản generic xem Mục 26), không có lỗi nào quá rõ ràng. Nhưng chương trình ẩn chứa một vấn đề. Nói không thật chặt chẽ, chương trình có một “memory leak”; khi hoạt động của garbage collector tăng lên hoặc memory footprint không ngừng tăng, hiệu năng chương trình giảm dần sẽ biểu hiện rõ. Trong trường hợp cực đoan, memory leak này có thể dẫn đến disk paging (`Disk Paging`), thậm chí khiến chương trình thất bại (`OutOfMemoryError`), nhưng trường hợp thất bại này tương đối hiếm.

Vậy leak xảy ra ở đâu trong chương trình? Nếu một stack trước tiên tăng lên rồi thu nhỏ lại, các đối tượng bị pop khỏi stack sẽ không được xem là rác để thu hồi; dù chương trình dùng stack không còn reference đến các đối tượng đó, chúng vẫn không được thu hồi. Đó là vì bên trong stack vẫn giữ các obsolete reference (`Obsolete refence`) đến những đối tượng này. Obsolete reference là reference sẽ không bao giờ được giải phóng. Trong ví dụ này, mọi reference nằm ngoài “`active portion`” của mảng elements đều là obsolete. Active portion là những phần tử trong elements có chỉ số nhỏ hơn size.

Trong các ngôn ngữ hỗ trợ garbage collection, memory leak rất khó nhận biết (gọi loại memory leak này là “`unintentional object retention`” sẽ chính xác hơn). Nếu một object reference bị giữ lại một cách vô ý, cơ chế garbage collection không chỉ không xử lý đối tượng đó mà còn không xử lý mọi đối tượng khác được đối tượng này tham chiếu. Dù chỉ có một số ít đối tượng bị giữ lại vô ý, vẫn có rất nhiều đối tượng bị loại khỏi cơ chế garbage collection, gây ảnh hưởng nghiêm trọng tiềm ẩn đến hiệu năng.

Cách sửa vấn đề này rất đơn giản: ngay khi object reference trở nên lỗi thời, chỉ cần xoá các reference đó. Với lớp Stack trên, ngay khi một phần tử được pop khỏi stack, reference trỏ tới nó đã lỗi thời. Phiên bản cải tiến của method pop như sau:

```java

public Object pop() {
    if (size == 0)
        throw new EmptyStackException();
        elements[size] = null; // Eliminate obsolete reference
    return elements[--size];
}

```

Xoá obsolete reference còn có một lợi ích khác: nếu sau này chúng bị dereference sai, chương trình sẽ lập tức ném NullPointerException thay vì âm thầm chạy sai. Việc phát hiện lỗi trong chương trình càng sớm càng có ích.

Khi lần đầu gặp vấn đề như vậy, lập trình viên thường trở nên quá cẩn thận: với mỗi object reference, ngay khi không còn dùng đến là xoá nó. Thực ra điều đó vừa không cần thiết vừa không được mong muốn, vì sẽ khiến chương trình trở nên rất rối. **Xoá object reference nên là một ngoại lệ, không phải một quy tắc ứng xử**. Cách tốt nhất để loại bỏ obsolete reference là để biến chứa reference đó kết thúc vòng đời. Nếu bạn định nghĩa mỗi biến trong scope gọn nhất (nhỏ nhất) có thể (xem Mục 45), trường hợp này sẽ tự nhiên xảy ra.

Vậy khi nào nên xoá reference? Đặc điểm nào của lớp Stack khiến nó dễ bị memory leak? Nói ngắn gọn, vấn đề nằm ở việc lớp Stack tự quản lý memory (`manage its own memory`). Storage pool (`storage pool`) chứa các phần tử của mảng elements (các ô chứa object reference, không phải bản thân đối tượng). Các phần tử trong vùng hoạt động của mảng (theo định nghĩa ở trên) là đã được cấp phát (`allocated`), còn các phần tử khác của mảng là tự do (`free`). Nhưng garbage collector không biết điều đó; với garbage collector, mọi object reference trong mảng elements đều có hiệu lực như nhau. Chỉ lập trình viên biết phần không hoạt động của mảng là không quan trọng. Lập trình viên có thể thông báo điều này cho garbage collector, cách làm rất đơn giản: ngay khi một phần tử mảng trở thành một phần của vùng không hoạt động, lập trình viên thủ công xoá phần tử đó.

Nói chung, **chỉ cần lớp tự quản lý memory thì lập trình viên phải cảnh giác với memory leak**. Ngay khi một phần tử được giải phóng, mọi object reference chứa trong phần tử đó cũng phải được xoá.

**Một nguồn phổ biến khác của memory leak là cache.** Khi đã đặt object reference vào cache, nó rất dễ bị quên, khiến nó vẫn nằm trong cache rất lâu sau khi không còn hữu ích. Có một số giải pháp cho vấn đề này. Nếu bạn đang triển khai một cache mà một entry chỉ có ý nghĩa khi tồn tại reference đến key của entry đó ở bên ngoài cache, có thể dùng WeakHashMap làm cache; khi entry trong cache trở nên quá hạn, chúng sẽ tự động bị xoá. Hãy nhớ rằng WeakHashMap chỉ hữu ích khi vòng đời của cache entry được quyết định bởi external reference của key chứ không phải bởi giá trị của key.

Trường hợp phổ biến hơn là “vòng đời của cache entry có còn ý nghĩa hay không” không dễ xác định; theo thời gian, giá trị của entry giảm dần. Trong tình huống này, cache nên thỉnh thoảng xoá các entry không còn hữu ích. Việc dọn dẹp có thể do một background thread (có thể là Timer hoặc ScheduledThreadPoolExecutor) thực hiện, hoặc có thể tiện thể dọn dẹp khi thêm dữ liệu mới vào cache. LinkedHashMap có thể dễ dàng triển khai cách sau bằng method removeEldestEntry. Với cache phức tạp hơn, phải dùng trực tiếp java.lang.ref.

**Nguồn phổ biến thứ ba của memory leak là listener và các callback khác.** Nếu bạn triển khai một API mà client đăng ký callback nhưng không cung cấp cách huỷ đăng ký rõ ràng, chúng sẽ tích tụ trừ khi bạn thực hiện một số hành động. Cách tốt nhất để bảo đảm callback được garbage collector thu hồi ngay là chỉ giữ weak reference (`weak reference`) đến chúng, chẳng hạn chỉ lưu chúng dưới dạng key trong WeakHashMap.

Vì memory leak thường không biểu hiện thành failure rõ ràng, chúng có thể tồn tại nhiều năm trong một hệ thống. Thường chỉ có thể phát hiện memory leak thông qua code inspection hoặc nhờ công cụ Heap Profiler (`Heap Profiler`). Vì vậy, nếu có thể biết cách dự đoán, phân tích, phòng ngừa và ngăn chặn vấn đề này trước khi memory leak xảy ra thì đó là điều tốt nhất.

### Mục 7: Tránh dùng finalizer

**Finalizer (`finalizer`) thường không thể dự đoán, cũng rất nguy hiểm và nhìn chung là không cần thiết.** Dùng finalizer có nhiều nhược điểm: gây ra hành vi không ổn định, làm giảm hiệu năng và gây vấn đề về tính portable. Tất nhiên finalizer cũng có những chỗ hữu dụng, sẽ được giới thiệu ở phần sau của mục này; nhưng theo kinh nghiệm, vẫn nên tránh dùng finalizer.

Lập trình viên C++ được nhắc rằng “đừng xem finalizer là vật tương đương với destructor (`destructors`) trong C++”. Trong C++, destructor là cách thông thường để thu hồi resource mà một đối tượng chiếm dụng và là phần tương ứng bắt buộc của constructor. Trong Java, khi một đối tượng trở nên unreachable, garbage collector sẽ thu hồi vùng nhớ liên quan đến đối tượng đó, không cần lập trình viên làm công việc đặc biệt nào. Destructor trong C++ cũng có thể được dùng để thu hồi các memory resource khác. Còn trong Java, thông thường dùng khối try-finally để hoàn thành công việc tương tự.

Nhược điểm của finalizer là không thể bảo đảm nó được thực thi kịp thời [JLS, 12.6]. Khoảng thời gian từ khi một đối tượng trở nên unreachable đến khi finalizer của nó được thực thi có thể dài tuỳ ý. Điều đó có nghĩa là không nên giao các task nhạy cảm về thời gian (`time-critical`) cho finalizer. Chẳng hạn dùng finalizer để đóng file đã mở là một sai lầm nghiêm trọng, vì file descriptor đã mở là resource hữu hạn. JVM trì hoãn việc thực thi finalizer, nên một lượng lớn file có thể vẫn ở trạng thái mở; khi chương trình không thể mở thêm file, nó có thể thất bại.

Thực thi finalizer kịp thời chính là một trong những chức năng chính của thuật toán garbage collection, và thuật toán này khác nhau rất nhiều giữa các triển khai JVM. Nếu chương trình phụ thuộc vào thời điểm finalizer được thực thi, chương trình có thể hoạt động hoàn toàn khác trên các JVM khác nhau. Một chương trình có thể chạy rất tốt trên nền tảng JVM bạn kiểm thử, nhưng hoàn toàn không chạy được trên nền tảng JVM của khách hàng quan trọng nhất. Điều này hoàn toàn có thể xảy ra.

Việc trì hoãn quá trình finalization không chỉ là vấn đề lý thuyết. Trong một số trường hợp hiếm gặp, việc cung cấp finalizer cho một lớp có thể tuỳ ý trì hoãn quá trình thu hồi các instance của lớp đó. Gần đây một đồng nghiệp đã debug một GUI application chạy lâu, ứng dụng này không hiểu vì sao chết vì lỗi OutOfMemoryError. Phân tích cho thấy khi ứng dụng chết, có hàng nghìn image object đang chờ được finalizer xử lý và thu hồi trong finalizer queue. Đáng tiếc là priority của finalizer thread thấp hơn nhiều so với các thread khác của chương trình, nên tốc độ finalization của graphic object không theo kịp tốc độ đưa object vào queue. Java Language Specification không bảo đảm thread nào sẽ thực thi finalizer, vì vậy ngoài việc không dùng finalizer, không có cách nhẹ nhàng nào để tránh vấn đề này.

Java Language Specification không chỉ không bảo đảm finalizer được thực thi kịp thời mà còn hoàn toàn không bảo đảm chúng sẽ được thực thi. Khi chương trình kết thúc, hoàn toàn có thể xảy ra việc finalizer trên một số đối tượng không còn truy cập được vẫn chưa được thực thi. Kết luận là: **không được phụ thuộc vào finalizer để cập nhật persistent state quan trọng**. Chẳng hạn phụ thuộc vào finalizer để giải phóng permanent lock trên shared resource (như database) rất dễ khiến toàn bộ distributed system sụp đổ.

Đừng bị hai method System.gc và System.runFinalization cám dỗ; chúng thực sự làm tăng cơ hội finalizer được thực thi, nhưng không bảo đảm finalizer chắc chắn được thực thi. Method duy nhất tuyên bố bảo đảm finalizer được thực thi là System.runFinalizersOnExit, cùng người anh em tai tiếng của nó là RunTime.runFinalizersOnExit. Cả hai method đều có khiếm khuyết nghiêm trọng và đã bị deprecated [ThreadStop].

Khi không chắc có nên tránh finalizer hay không, còn một tình huống đáng cân nhắc: nếu một exception không được bắt bị ném trong finalizer, exception đó có thể bị bỏ qua và quá trình finalization của đối tượng cũng kết thúc [JLS, 12.6]. Exception không được bắt sẽ khiến đối tượng ở trạng thái hỏng (a corrupt state); nếu thread khác cố sử dụng đối tượng hỏng này, bất kỳ hành vi không xác định nào cũng có thể xảy ra. Trong điều kiện bình thường, exception không được bắt khiến thread kết thúc và in stack trace (`Stack Trace`), nhưng nếu xảy ra bên trong finalizer thì không như vậy, thậm chí cũng không in ra cảnh báo.

Còn một điểm nữa: **dùng finalizer gây tổn thất hiệu năng rất nghiêm trọng (`Severe`)**. Trên máy của tôi, thời gian tạo và huỷ một đối tượng đơn giản khoảng 5.6ns; thêm finalizer làm thời gian tăng lên 2400ns. Nói cách khác, tạo hoặc huỷ đối tượng bằng finalizer chậm hơn khoảng 430 lần.

Vậy nếu resource được đóng gói trong lớp (chẳng hạn file hoặc thread) thực sự cần được kết thúc, phải làm thế nào để không viết finalizer? Chỉ cần **cung cấp một explicit termination method** và yêu cầu client của lớp gọi method này khi mỗi instance không còn hữu ích. Một chi tiết đáng nói là instance phải ghi nhận mình đã được terminate hay chưa: explicit termination method phải ghi “đối tượng này không còn hợp lệ” vào một private field. Nếu các method này được gọi sau khi đối tượng đã bị terminate, những method khác phải kiểm tra field này và ném IllegalStateException.

Ví dụ điển hình của explicit termination method là method close trên InputStream, OutputStream và java.sql.Connection. Một ví dụ khác là method cancel trên java.utils.Timer, thực hiện các thay đổi state cần thiết để thread liên kết với Timer instance kết thúc một cách nhẹ nhàng. Ví dụ trong java.awt còn có Graphics.dispose và Window.dispose. Những method này thường không được chú ý vì hiệu năng kém. Một method liên quan là Image.flush; nó giải phóng mọi resource liên quan đến Image instance, nhưng instance vẫn ở trạng thái có thể sử dụng và sẽ cấp phát lại resource nếu cần.

**Explicit termination method thường được dùng kết hợp với cấu trúc try-finally để bảo đảm kết thúc kịp thời.** Gọi explicit termination method bên trong mệnh đề finally có thể bảo đảm method đó được thực thi ngay cả khi có exception được ném ra trong lúc sử dụng đối tượng:

```java

// try-finally block guarantees execution of termination method
Foo foo = new Foo(...);
try {
    // Do what must be done with foo
    ...
} finally {
    foo.terminate(); // Explicitt termination method
}

```

Vậy finalizer có ích gì? Chúng có hai cách dùng hợp lệ. Cách thứ nhất là khi owner của đối tượng quên gọi explicit termination method được đề xuất ở đoạn trước, finalizer có thể đóng vai trò “`safety net`”. Dù điều này không bảo đảm finalizer được gọi kịp thời, trong trường hợp client không thể kết thúc thao tác bình thường bằng cách gọi explicit termination method (hy vọng trường hợp này xảy ra ít nhất có thể), giải phóng resource quan trọng muộn còn tốt hơn là không bao giờ giải phóng. Tuy nhiên nếu finalizer phát hiện resource chưa được terminate thì nên ghi một warning vào log, vì điều đó cho thấy có một bug trong code client cần được sửa. Nếu đang cân nhắc viết một safety-net finalizer như vậy, hãy suy nghĩ nghiêm túc xem lớp bảo vệ bổ sung này có đáng để trả thêm chi phí hay không.

Bốn lớp được minh hoạ trong ví dụ về mẫu explicit termination method (`FileInputStream`, `FileOutputStream`, `Timer` và `Connection`) đều có finalizer; trong trường hợp termination method của chúng không được gọi, các finalizer này đóng vai trò safety net.

Cách dùng hợp lý thứ hai của finalizer liên quan đến native peer (`native peer`) của đối tượng. Native peer là một native object (`native object`), các method thông thường uỷ quyền cho native object thông qua native method (`native method`). Vì native peer không phải object thông thường, garbage collector không biết đến nó; khi Java peer của nó được thu hồi, native peer cũng không được thu hồi. Với điều kiện native peer không sở hữu resource quan trọng, finalizer là công cụ phù hợp nhất để thực hiện công việc này. Nếu native peer sở hữu resource cần terminate kịp thời, lớp đó nên có explicit termination method như đã nói ở trên. Termination method phải hoàn thành mọi công việc cần thiết để giải phóng resource quan trọng. Termination method có thể là native method hoặc có thể gọi native method.

Điểm quan trọng nhất cần lưu ý là “finalizer chaining” (`finalizer chaining`) không được tự động thực hiện. Nếu một lớp (không phải Object) có finalizer và subclass override finalizer, finalizer của subclass phải tự gọi finalizer của superclass. Nên finalize subclass trong một khối try và gọi finalizer của superclass trong khối finally tương ứng. Cách này bảo đảm finalizer của superclass vẫn được thực thi ngay cả khi quá trình finalization của subclass ném exception. Ngược lại cũng vậy. Ví dụ code như sau. Lưu ý ví dụ này dùng annotation Override (`@Override`), được Java 1.5 thêm vào Java platform. Hiện giờ có thể bỏ qua annotation Override hoặc xem Mục 36 để biết chúng có nghĩa gì:

```java

// Manual finalizer chaining
@Override
protected void finalize() throws Throwable {
    try {
        // Finalize subclass state
    } finally {
        super.finalize();
    }
}

```

Nếu người triển khai subclass override finalizer của superclass nhưng quên tự gọi finalizer của superclass (hoặc cố ý không gọi), finalizer của superclass sẽ không bao giờ được gọi. Có thể phòng ngừa subclass cẩu thả hoặc ác ý như vậy, nhưng phải trả giá bằng việc tạo thêm một đối tượng cho mỗi đối tượng được finalize. Thay vì đặt finalizer trong lớp cần xử lý finalization, hãy đặt finalizer trong một anonymous class (xem Mục 22), anonymous class này chỉ có mục đích finalize enclosing instance (`enclosing instance`) của nó. Một instance duy nhất của anonymous class này được gọi là **`finalizer guardian`**, mỗi instance của lớp bao ngoài đều tạo một guardian như vậy. Instance bao ngoài lưu reference duy nhất tới finalizer guardian trong private instance field của nó, nhờ đó finalizer guardian và instance bao ngoài có thể bắt đầu quá trình finalization cùng nhau. Khi guardian được finalize, nó thực hiện hành vi finalization mà instance bao ngoài mong muốn, như thể finalizer của nó là một method trên đối tượng bao ngoài:

```java

// Finalizer Guardian idiom
public class Foo {
    // Sole purpose of this object is to finalize outer Foo object
    private  final object finalizerGuardian = new Object() {
        @Override
        protect void finalize() throws Throwable {
            ... // Finalize outer Foo object
        }
    };

    ... // Remainder omitted
}

```

Lưu ý public class Foo không có finalizer (ngoài một finalizer không đáng kể được kế thừa từ Object), vì vậy subclass có gọi super.finalize() trong finalizer hay không không quan trọng. Với mọi public class non-final có finalizer, nên cân nhắc dùng cách này.

Tóm lại, trừ khi dùng làm safety net hoặc để terminate native resource không quan trọng, hãy tránh dùng finalizer. Trong trường hợp hiếm hoi phải dùng finalizer, hãy nhớ gọi super.finalize. Nếu dùng finalizer làm safety net, hãy nhớ ghi log việc sử dụng finalizer trái phép. Cuối cùng, nếu cần gắn finalizer với public class non-final, hãy cân nhắc dùng finalizer guardian để bảo đảm finalizer vẫn được thực thi ngay cả khi finalizer của subclass không gọi super.finalize.

## Chương 3 Các method dùng chung cho mọi object

### Mục 8: Tuân thủ quy ước chung khi override equals

Override equals có vẻ đơn giản, nhưng nhiều cách override có thể dẫn đến lỗi với hậu quả rất nghiêm trọng. Cách dễ nhất để tránh các vấn đề này là không override equals; trong trường hợp đó, mỗi instance của lớp chỉ có thể bằng chính nó. Nếu bất kỳ điều kiện nào sau đây đúng, đây chính là kết quả được mong muốn:

- **Mỗi instance của lớp về bản chất là duy nhất.** Điều này đúng với các lớp đại diện cho entity đang hoạt động thay vì value (`value`), chẳng hạn Thread. Implemention equals do Object cung cấp chính là hành vi đúng cho những lớp này.

- **Không quan tâm lớp có cung cấp chức năng kiểm tra “logical equality (`logical equality`)” hay không.** Chẳng hạn java.util.Random override equals để kiểm tra hai Random instance tạo ra cùng một chuỗi số ngẫu nhiên, nhưng người thiết kế không cho rằng client cần hoặc mong đợi chức năng này. Trong trường hợp đó, implemention equals kế thừa từ Object đã đủ.

- **Superclass đã override equals, hành vi kế thừa từ superclass phù hợp với subclass.** Chẳng hạn hầu hết Set implementation kế thừa implementation equals từ AbstractSet, List implementation kế thừa implementation equals từ AbstractList, còn Map implementation kế thừa implementation từ AbstractMap.

- **Lớp là private hoặc package-private, và có thể chắc chắn method equals của nó sẽ không bao giờ được gọi.** Trong trường hợp này, hiển nhiên nên override equals để đề phòng việc gọi nhầm:

```java

@Override
public boolean equals(Object o) {
    throw new AssertionError(); // Method is never called
}

```

Vậy khi nào nên override Object.equals? Nếu lớp có khái niệm “logical equality” riêng (khác với khái niệm object identity), và superclass chưa override equals để triển khai hành vi mong muốn, thì đây là lúc cần override equals. Trường hợp này thường thuộc về “value class (`value class`)”. Value class chỉ là một lớp biểu diễn một value, chẳng hạn Integer hoặc Date.

Có một loại “value class” không cần override equals: đó là lớp dùng instance control (xem Mục 1) để bảo đảm “mỗi value chỉ tồn tại nhiều nhất một đối tượng”. Enum type (xem Mục 30) thuộc loại này. Với những lớp như vậy, logical equality và object identity là một, vì vậy method equals trên Object tương đương với equals theo nghĩa logic.

Khi override equals, phải tuân thủ quy ước chung của nó. Nội dung sau đây trích từ specification của Object [JavaSE6]:
equals method triển khai một equivalence relation (`equivalence relation`):

- **Tính phản xạ (`reflexive`).** Với mọi non-null reference value x, x.equals(x) phải trả về true.

- **Tính đối xứng (`symmetric`).** Với mọi non-null reference value x và y, x.equals(y) phải trả về true khi và chỉ khi y.equals(x) trả về true.

- **Tính bắc cầu (`transitive`).** Với mọi non-null reference value x, y và z, nếu x.equals(y) trả về true và y.equals(z) cũng trả về true thì x.equals(z) cũng phải trả về true.

- **Tính nhất quán (`consistent`).** Với mọi non-null reference value x và y, miễn là thông tin được dùng trong phép so sánh equals của các đối tượng không bị sửa đổi, nhiều lần gọi x.equals(y) phải luôn trả về true một cách nhất quán hoặc luôn trả về false một cách nhất quán.

- **Tính không null.** Với mọi non-null reference value x, x.equlas(null) phải trả về false.

Sau đây lần lượt xem xét 5 yêu cầu trên:

**Tính phản xạ (`reflexive`)** --- yêu cầu thứ nhất chỉ nói rằng đối tượng phải bằng chính nó. Khó hình dung việc vô tình vi phạm điều này. Nếu vi phạm và thêm instance của lớp vào một collection (`collection`), method contains của collection sẽ dứt khoát cho bạn biết collection không chứa instance mà bạn vừa thêm.

**Tính đối xứng (`symmetry`)** --- yêu cầu thứ hai nói rằng mọi đối tượng phải đưa ra cùng một câu trả lời cho câu hỏi “chúng có bằng nhau không”. Khác với yêu cầu thứ nhất, không khó hình dung trường hợp vô tình vi phạm điều này. Hãy xét lớp sau, triển khai một string không phân biệt chữ hoa chữ thường. String được lưu bằng toString, nhưng bị bỏ qua trong phép so sánh.

```java

// Broken - violates symmetry
public final class CaseInsensitiveString {
    private final String s;

    public CaseInsensitiveString(String s) {
        if (s == null) {
            throw new NullPointerException();
        }
        this.s = s;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof CaseInsensitiveString) {
            return s.equalsIgnoreCase(((CaseInsensitiveString)o).s)
        }

        // One-way interoperability
        if (o instanceof String) {
            return s.equalsIgnoreCase((String)o);
        }

        ...// Remainder ommited
    }
}

```

Trong lớp này, ý định của method equals rất tốt: nó cố gắng interoperable với các đối tượng string thông thường (String). Giả sử có một string không phân biệt chữ hoa chữ thường và một string thông thường:

```java

CaseInsensitiveString cis = new CaseInsensitiveString("TommyYang");
String s = "tommyyang";

```

Như mong đợi, cis.equals(s) trả về true. Vấn đề là method equals trong lớp CaseInsensitiveString biết về đối tượng string thông thường (String), còn method equals trong lớp String lại không biết về string không phân biệt chữ hoa chữ thường. Vì vậy, s.equals(cis) trả về false, rõ ràng vi phạm tính đối xứng. Giả sử đặt đối tượng string không phân biệt chữ hoa chữ thường vào một collection:

```java

List<CaseInsensitiveString> cisList = new ArrayList<>();
cisList.add(cis);

cisList.contains(s);

```

Lúc này cisList.contains(s) sẽ trả về kết quả gì? Không ai biết. Trong implementation hiện tại của Sun, nó trả về false, nhưng đây chỉ là kết quả của implementation cụ thể đó. Trong implementation khác, nó có thể trả về true hoặc ném runtime (`Runtime`) exception. **Một khi vi phạm quy ước euqals, hoàn toàn không biết các đối tượng khác sẽ hành xử thế nào khi gặp đối tượng của bạn.**

Để giải quyết vấn đề này, chỉ cần xoá code interoperability với đối tượng String:

```java

@Override
public boolean equals(Object o) {
    return (o instanceof CaseInsensitiveString)
         && s.equalsIgnoreCase(((CaseInsensitiveString)o).s);
}

```

**Tính bắc cầu (`transitive`)** --- yêu cầu thứ ba của quy ước euqals là nếu một đối tượng bằng đối tượng thứ hai và đối tượng thứ hai bằng đối tượng thứ ba thì đối tượng thứ nhất nhất định phải bằng đối tượng thứ ba. Tương tự, không khó hình dung việc vô tình vi phạm quy tắc này. Hãy xét trường hợp subclass thêm một value component (`value component`) mới vào superclass. Nói cách khác, thông tin được thêm ở subclass ảnh hưởng đến kết quả so sánh equals. Trước hết bắt đầu với một lớp Point bất biến hai chiều đơn giản, có số nguyên:

```java

public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point)) {
            return false;
        }

        Point p = (Point)o;
        return p.x == this.x && p.y == this.y;
    }

    ...// Remainder ommited
}

```

Giả sử muốn mở rộng lớp này để thêm thông tin màu cho một điểm:

```java

public class ColorPoint extends Point {
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        super(x, y);
        this.color = color;
    }

    ...// Remainder ommited
}

```

Method equals sẽ ra sao? Nếu không cung cấp equals mà kế thừa trực tiếp từ lớp Point, thông tin màu sẽ bị bỏ qua trong phép so sánh của equals. Dù cách này không vi phạm quy ước equals, rõ ràng nó không thể chấp nhận được. Vậy nên override equals thế nào?

```java

// Broken - violates symmetry
@Override
public boolean equals(Object o) {
    if (!(o instanceof ColorPoint)) {
        return false;
    }

    return super.equals(o) && ((ColorPoint)o).color == this.color;
}

```

Vấn đề của method này là khi so sánh điểm thường với điểm có màu, và trường hợp ngược lại, có thể nhận được kết quả khác nhau. Phép so sánh đầu tiên bỏ qua thông tin màu, còn phép so sánh sau luôn trả về false vì kiểu của tham số không đúng. Để minh hoạ trực quan vấn đề, hãy tạo một điểm thường và một điểm có màu:

```java

Point p = new Point(1, 2);
ColorPoint cp = new ColorPoint(1, 2, Color.Red);

```

Tuy nhiên, p.equals(cp) trả về true, còn cp.equals(p) trả về false. Có thể thử sửa vấn đề bằng cách để ColorPoint.equals bỏ qua thông tin màu khi thực hiện “mixed comparison”:

```java

// Broken - violates transitivity
@Override
public boolean equals(Object o) {
    if (!(o instanceof Point)) {
        return false;
    }

    // if o is a normal Point, do a color-blind comparison
    if (!o instanceof ColorPoint) {
        return o.equals(this);
    }

    // o is a ColorPoint, do a full comparison
    return super.equals(o) && ((ColorPoint)o).color == this.color;
}

```

Cách làm này thực sự cung cấp tính đối xứng, nhưng bỏ qua tính bắc cầu:

```java

ColorPoint p1 = new ColorPoint(1, 2, Color.RED);
Point p2 = new Point(1, 2);
ColorPoint p3 = new ColorPoint(1, 2, Color.BLUE);

```

Lúc này p1.equals(p2) và p2.equals(p3) đều trả về true, nhưng p1.equals(p3) trả về false, rõ ràng vi phạm tính bắc cầu. Hai phép so sánh đầu không xét thông tin màu (“color-blind”), còn phép so sánh thứ ba có xét thông tin màu.

Vậy giải quyết vấn đề trên thế nào? Thực ra đây là một vấn đề cơ bản về equivalence relation trong ngôn ngữ hướng đối tượng. **Không thể vừa mở rộng một lớp có thể khởi tạo, vừa thêm value component mới, lại vừa giữ quy ước equals**, trừ khi chấp nhận từ bỏ các lợi thế của abstraction hướng đối tượng.

Có thể bạn đã biết rằng trong method equals, dùng phép kiểm tra getClass thay cho instanceof có thể mở rộng lớp có thể khởi tạo và thêm value component mới mà vẫn giữ quy ước equals:

```java

// Broken - violates Liskov substitution principle
@Override
public boolean equals(Object o) {
    if (o == null || o.getClass() != this.getClass()) {
        return false;
    }

    Point p = (Point)o;
    return p.x == this.x && p.y == this.y;
}

```

Chương trình này chỉ xem các đối tượng là đồng nhất khi chúng có cùng implementation. Dù như vậy cũng không quá tệ, kết quả thực sự không thể chấp nhận.

Giả sử viết một method để kiểm tra một điểm số nguyên có nằm trong unit circle hay không. Sau đây là một cách có thể dùng:

```java

// Initialize UnitCircle to contain all Points on the unit circle
private static final Set<Point> unitCircle;
static {
    unitCircle = new HashSet<>();
    unitCircle.add(new Point(1, 0));
    unitCircle.add(new Point(0, 1));
    unitCircle.add(new Point(-1, 0));
    unitCircle.add(new Point(0, -1));
}

public static boolean onUnitCircle(Point p) {
    return unitCircle.contains(p);
}

```

Dù đây có thể không phải cách nhanh nhất để triển khai chức năng này, hiệu quả của nó rất tốt. Nhưng giả sử mở rộng Point theo cách không thêm value component, chẳng hạn để constructor ghi nhận số instance đã được tạo:

```java

public class CounterPoint extends Point {
    private static final AtomicInteger counter = new AtomicInteger();

    public CounterPoint(int x, int y) {
        super(x, y);
        counter.incrementAndGet();
    }

    public int numberCreated() {
        return counter.get();
    }
}

```

**Liskov substitution principle (`Liskov substitution principle`)** cho rằng mọi thuộc tính quan trọng của một type cũng áp dụng cho subtype của nó, vì vậy mọi method viết cho type đó cũng phải chạy tốt trên subtype của nó [Liskov87]. Nhưng giả sử truyền một CounterPointer instance cho method onUnitCircle. Nếu lớp Point dùng equals dựa trên getClass, bất kể giá trị x và y của CounterPoint instance là gì, onUnitCircle cũng sẽ trả về false. Khi đó equals dựa trên instanceof sẽ hoạt động tốt.

Dù không có cách thoả đáng nào vừa mở rộng một lớp có thể khởi tạo, vừa thêm value component, vẫn có một workaround tốt. Theo khuyến nghị ở Mục 16: ưu tiên composition hơn inheritance. Không để ColorPoint kế thừa Point nữa, mà thêm một private Point field vào ColorPoint, cùng một view method public (xem Mục 5) trả về một đối tượng Point thông thường ở cùng vị trí với điểm có màu:

```java

// Add a value component without violating the equals contract
public class ColorPoint {
    private final Point point;
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        if (color == null) {
            throw new NullPointerException();
        }

        this.point = new Point(x, y);
        this.color = color;
    }

    // return the point-view of this color point.
    public Point asPoint() {
        return this.point;
    }

    @Override
    public boolean equals(Object o){
        if (!(o instanceof ColorPoint)){
            return false;
        }

        ColorPoint cp = (ColorPoint)o;

        return cp.point.equals(this.point) && cp.color.equals(this.color);
    }

}

```

Điều cần nhớ là: **ưu tiên composition hơn inheritance**.

**Tính nhất quán (`consistency`)** --- điều kiện thứ tư của quy ước equals là nếu hai đối tượng bằng nhau thì chúng phải luôn duy trì trạng thái bằng nhau, trừ khi một hoặc cả hai đối tượng bị sửa đổi. Nói cách khác, mutable object có thể bằng các đối tượng khác nhau ở những thời điểm khác nhau, còn immutable object thì không như vậy. Khi viết một lớp, nên cân nhắc cẩn thận xem nó có nên immutable hay không (xem Mục 15). Nếu lớp immutable, phải bảo đảm method equals tuân theo điều kiện: các đối tượng bằng nhau luôn bằng nhau, các đối tượng không bằng nhau luôn không bằng nhau.

Bất kể có immutable hay không, **đừng để method equals phụ thuộc vào resource không đáng tin cậy**. Nếu vi phạm điều cấm này, việc đáp ứng yêu cầu nhất quán sẽ rất khó. Chẳng hạn method equals của java.net.URL phụ thuộc vào việc so sánh IP address của host trong URL. Chuyển hostname thành IP address có thể cần truy cập network và không bảo đảm cho cùng một kết quả theo thời gian. Điều này khiến method equals của URL vi phạm quy ước equals, và trên thực tế có thể gây ra một số vấn đề. (Đáng tiếc là do yêu cầu compatibility, hành vi này không thể thay đổi.) Ngoài một số ngoại lệ rất hiếm, method equals nên thực hiện phép tính xác định trên các đối tượng nằm trong memory.

**Tính không null (`Non-nullity`)** --- yêu cầu cuối cùng là mọi đối tượng đều phải khác null. Để đáp ứng yêu cầu này của method equals, có người dùng một phép kiểm tra null tường minh để ngăn tình huống đó:

```java

@Override
public boolean equals(Object o) {
    if (o == null) {
        return false;
    }
    ...
}

```

Phép kiểm tra này không cần thiết. Để kiểm tra tham số có bằng nhau hay không, method equals phải cast tham số về kiểu thích hợp để có thể gọi accessor (`accessor`) hoặc truy cập field của nó. Trước khi cast, method equals phải dùng toán tử instanceof để kiểm tra tham số có đúng kiểu hay không:

```java

@Override
public boolean equals(Object o) {
    if (!(o instanceof MyType)) {
        return false;
    }
    MyType mt = MyType(o);
    ...
}

```

Nếu bỏ qua bước kiểm tra kiểu này và tham số truyền cho method equals có kiểu sai, method equals sẽ ném ClassCastException, vi phạm quy ước equals. Do đặc tính của instanceof [JLS, 15.20.2], khi toán hạng thứ nhất là null, nó luôn trả về false bất kể toán hạng thứ hai có null hay không. Vì vậy không cần tự kiểm tra null thêm lần nữa.

Kết hợp tất cả các cách trên, ta có các bí quyết sau để triển khai method equals chất lượng cao:

1. **Dùng toán tử == để kiểm tra “tham số có phải là reference tới đối tượng này không”.** Nếu đúng thì trả về true. Đây chỉ là một tối ưu hiệu năng; nếu phép so sánh có thể tốn kém thì đáng làm.

2. **Dùng toán tử instanceof để kiểm tra “tham số có đúng kiểu không”.**

3. **Cast tham số về đúng kiểu.** Vì đã kiểm tra instanceof trước khi cast nên bảo đảm việc cast sẽ thành công.

4. **Với mỗi field “quan trọng” trong lớp, kiểm tra field tương ứng trong tham số có khớp với field trong đối tượng hay không.**

5. **Sau khi viết xong method equals, hãy tự hỏi ba câu hỏi: nó có đối xứng, bắc cầu và nhất quán không?**

- **Khi override equals, luôn override hashCode (xem Mục 9).**
- **Đừng cố làm cho method equals quá thông minh.**
- **Đừng thay Object trong khai báo equals bằng một kiểu khác.**

### Mục 9: Override equals thì luôn override hashCode

Một nguồn lỗi rất phổ biến là không override method hashCode. Trong mọi lớp override method equals, cũng phải override method hashCode. Nếu không, sẽ vi phạm quy ước chung của Object.hashCode, khiến lớp đó không thể hoạt động bình thường cùng mọi collection dựa trên hashing; các collection như vậy gồm HashMap, HashSet và HashTable.

Sau đây là nội dung quy ước, trích từ specification của Object [JavaSE6]:

- Trong suốt thời gian chương trình thực thi, miễn là thông tin được dùng trong phép so sánh của method equals của đối tượng không bị sửa đổi, nhiều lần gọi method hashCode trên cùng đối tượng đó phải luôn trả về cùng một số nguyên. Trong nhiều lần thực thi khác nhau của cùng một chương trình, số nguyên được trả về có thể không giống nhau.

- Nếu hai đối tượng bằng nhau theo method equals(Object), việc gọi method hashCode trên một trong hai đối tượng phải tạo ra cùng một kết quả số nguyên.

- Nếu hai đối tượng không bằng nhau theo method equals(Object), việc gọi method hashCode trên một trong hai đối tượng không nhất thiết phải tạo ra các số nguyên khác nhau. Tuy nhiên lập trình viên nên biết rằng tạo ra các số nguyên khác hẳn nhau cho các đối tượng không bằng nhau có thể cải thiện hiệu năng của hash table (hashTable).

**Quy ước quan trọng bị vi phạm do không override hashCode là quy ước thứ hai: các đối tượng bằng nhau phải có hash code bằng nhau.** Theo method equals của lớp, hai instance hoàn toàn khác nhau có thể bằng nhau về mặt logic, nhưng theo method hashCode của lớp Object, chúng chỉ là hai đối tượng không có điểm chung. Vì vậy method hashCode của chúng trả về hai số nguyên trông như ngẫu nhiên, thay vì trả về hai số nguyên bằng nhau như quy ước thứ hai yêu cầu.

Để minh hoạ, hãy xem lớp PhoneNumber sau, method equals của nó được xây dựng theo “bí quyết” ở Mục 8:

```java

public final class PhoneNumber {
    private final short areaCode;
    private final short prefix;
    private final short lineNumber;

    public PhoneNumber(short areaCode, short prefix, short lineNumber) {
        this.areaCode = areaCode;
        this.prefix = prefix;
        this.lineNumber = lineNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }

        if (! (o instanceof PhoneNumber)) {
            return false;
        }

        PhoneNumber pn = (PhoneNumber)o;

        return pn.areaCode = this.areaCode && pn.prefix = this.prefix
                    && pn.lineNumber = this.lineNumber;
    }

    // Broken -- no hashCode method

    ... // Remainder omitted
}

```

Giả sử cố dùng lớp này cùng HashMap:

```java

Map<PhoneNumber, String> map = new HashMap<PhoneNumber, String>();
map.put(new PhoneNumber(21, 210, 20000), "tommy");

```

Lúc này bạn mong map.get(new PhoneNumber(21, 210, 20000)) trả về "tommy", nhưng thực tế nó trả về null. Lưu ý ở đây có hai instance: instance thứ nhất được dùng để insert vào HashMap, instance thứ hai bằng instance thứ nhất và được dùng làm key để lấy dữ liệu. Vì PhoneNumber không override method hashCode, hai instance bằng nhau có hash code khác nhau, vi phạm quy ước hashCode. Vì vậy method put lưu PhoneNumber object vào một hash bucket, còn method get tìm PhoneNumber object trong một hash bucket khác. Ngay cả khi hai instance tình cờ được đặt vào cùng một hash bucket, get vẫn chắc chắn trả về null vì HashMap có một tối ưu hoá là cache hash code liên kết với từng entry; nếu hash code không khớp thì không cần kiểm tra object identity.

Sau đây nói về cách thiết kế một hash function tốt. Hash function tốt thường hướng tới việc “tạo hash code khác nhau cho các đối tượng không bằng nhau”. Đây chính là ý nghĩa của quy ước hashCode thứ ba. Trong trường hợp lý tưởng, hash function nên phân phối đều các instance không bằng nhau trong collection vào mọi giá trị hash có thể. Để đạt hoàn toàn tình huống lý tưởng này rất khó.

May mắn là không quá khó để tiến gần tương đối đến lý tưởng đó. Sau đây là một cách giải quyết đơn giản:

1. Lưu một giá trị constant khác không, chẳng hạn 17, trong một biến kiểu int tên là res.

2. Với mỗi field quan trọng f của đối tượng (tức mỗi field được dùng trong method equals), thực hiện các bước sau:

    a. Tính hash code kiểu int c cho field đó:

        i.   Nếu field là kiểu boolean, tính (f ? 1 : 0).

        ii.  Nếu field là kiểu byte, char, short hoặc int, tính (int)f.

        iii. Nếu field là kiểu long, tính (int)(f ^ (f >>> 32)).

        iv.  Nếu field là kiểu float, tính Float.floatToIntBits(f).

        v.   Nếu field là kiểu double, tính Double.doubleToLongBits(f), sau đó theo bước 2.a.iii,
             tính hash value cho giá trị kiểu long nhận được.

        vi.  Nếu field là một object reference, nếu method equals của lớp so sánh field này bằng cách
             gọi equals đệ quy, cũng gọi hashCode đệ quy cho field đó. Nếu cần phép so sánh phức tạp hơn,
             hãy tính một “canonical representation” cho field đó rồi gọi
             hashCode trên canonical representation. Nếu giá trị field là null thì trả về 0 (hoặc một
             constant khác, nhưng thông thường là 0).

        vii. Nếu field là một array, hãy xử lý mỗi phần tử như một field riêng. Nghĩa là áp dụng đệ quy
             các quy tắc trên, tính một hash code cho mỗi phần tử quan trọng rồi kết hợp các hash value
             theo cách làm ở bước 2.b. Nếu mọi phần tử trong array field đều quan trọng, có thể dùng một
             trong các method Arrays.hashCode được thêm vào bản phát hành 1.5.

    b. Kết hợp hash code c tính được ở bước 2.a vào res theo công thức sau:

        res = res * 31 + c;

3. Trả về res.

4. Sau khi viết method hashCode, hãy tự hỏi “các instance bằng nhau có luôn có cùng hash code không”. Nên viết unit test để kiểm tra suy luận. Nếu các instance bằng nhau có hash code khác nhau, hãy tìm nguyên nhân và sửa lỗi.

Trong quá trình tính hash code, có thể loại bỏ redundant field (`redundant field`). Nói cách khác, nếu giá trị của một field có thể được tính từ các giá trị field khác tham gia phép tính, có thể loại bỏ field đó. Phải loại bỏ mọi field không được dùng trong phép so sánh equals, nếu không rất dễ vi phạm quy ước hashCode thứ hai.

Bước 1 ở trên dùng một giá trị khởi tạo khác không, vì vậy các field ban đầu có hash value tính ở bước 2.a bằng 0 vẫn ảnh hưởng đến hash value. Nếu giá trị khởi tạo ở bước 1 là 0, toàn bộ hash value sẽ không bị các field ban đầu này ảnh hưởng, vì các field ban đầu đó sẽ làm tăng khả năng collision. Giá trị 17 là tuỳ ý.

Phần nhân trong bước 2.b khiến hash value phụ thuộc vào thứ tự của field; nếu một lớp chứa nhiều field tương tự nhau, phép nhân như vậy sẽ tạo ra hash function tốt hơn. Chẳng hạn nếu hash function của String bỏ qua phần nhân này, mọi string chỉ khác nhau về thứ tự chữ cái sẽ có cùng hash code. Sở dĩ chọn 31 là vì nó là một số nguyên tố lẻ. Nếu số nhân là số chẵn và phép nhân overflow thì thông tin sẽ mất. Vì nhân với 2 tương đương với phép dịch bit, lợi ích của việc dùng số nguyên tố không quá rõ ràng, nhưng theo thông lệ người ta dùng số nguyên tố để tính hash result. 31 có một đặc tính tốt: có thể thay phép nhân bằng phép dịch và phép trừ để đạt hiệu năng tốt hơn: 31 \* i == (i << 5) - 1. JVM hiện đại có thể tự động thực hiện tối ưu hoá này.

Dùng cách trên, ta viết lại method hashCode:

```java

@Override
public int hashCode() {
    int res = 17;
    res = 31 * res + areaCode;
    res = 31 * res + prefix;
    res = 31 * res + lineNumber;
    return res;
}

```

Trên thực tế, với implementation hashCode của lớp PhoneNumber, method trên rất hợp lý, tương đương implementation trong JDK. Cách làm rất đơn giản và nhanh, phân tán các phone number không bằng nhau vào các hash bucket khác nhau một cách thích hợp.

Nếu một lớp immutable và chi phí tính hash code cũng khá lớn, nên cân nhắc cache hash code bên trong đối tượng thay vì tính lại mỗi lần được yêu cầu. Nếu cho rằng phần lớn đối tượng kiểu này sẽ được dùng làm hash key (hash keys), nên tính hash code khi tạo instance. Nếu không, có thể “lazy initialize (`lazily initialize`)” hash code, chỉ khởi tạo khi hashCode được gọi lần đầu (xem Mục 71). Nếu PhoneNumber thường được dùng làm hash key thì nên triển khai như sau:

```java

// Lazily initialized， cached hashCode
private volatile int hashCode;

@Override
public int hashCode() {
    int res = hashCode;
    if (res == 0) {
        int res = 17;
        res = 31 * res + areaCode;
        res = 31 * res + prefix;
        res = 31 * res + lineNumber;
    }

    return res;
}

```

**Đừng cố loại bỏ phần quan trọng của một đối tượng khỏi phép tính hash code để nâng cao hiệu năng.** Dù hash function thu được có thể chạy nhanh hơn, hiệu quả của nó chưa chắc tốt hơn và có thể khiến hash table chậm đến mức không thể sử dụng.

Nhiều lớp trong Java platform library, chẳng hạn String, Integer và Date, có thể quy định giá trị chính xác mà method hashCode trả về là một hàm của instance value. Nói chung đây không phải ý hay, vì việc đó hạn chế nghiêm ngặt khả năng cải thiện hash function trong các phiên bản tương lai. Nếu không quy định chi tiết của hash function, khi phát hiện khiếm khuyết bên trong, bạn có thể sửa nó trong bản phát hành sau mà vẫn chắc chắn không client nào phụ thuộc vào giá trị chính xác do hash function trả về.

### Mục 10: Luôn override toString

Dù java.lang.Object cung cấp một implementation cho method toString, string nó trả về thường không phải thứ người dùng của lớp muốn thấy. Nó chứa tên lớp, một ký hiệu “@”, rồi đến biểu diễn hexadecimal không dấu của hash code, chẳng hạn “PhoneNumber@193b2d”. Quy ước chung của toString chỉ ra rằng string được trả về phải là “một biểu diễn ngắn gọn nhưng giàu thông tin và dễ đọc” [JavaSE 6]. Dù có người cho rằng “PhoneNumber@193b2d” có thông tin, so với “（021）589-5588” thì nó vẫn chưa thể xem là giàu thông tin. Quy ước toString còn chỉ ra rằng “nên override method này ở mọi subclass”. Đây thực sự là một khuyến nghị rất tốt! Vì như vậy ta có thể in một đối tượng theo dạng mong muốn, chẳng hạn `System.out.println(phoneNumber)`, mặc định sẽ in phoneNumber.toString(). Đây cũng là lý do khuyến nghị mọi subclass override toString.

Dù tuân thủ quy ước toString không quan trọng bằng tuân thủ quy ước equals và hashCode (xem [Mục 8](/vi/effective-java.md) và [Mục 9](/vi/effective-java.md)), cung cấp toString tốt có thể khiến lớp dễ sử dụng hơn. Khi đối tượng được truyền cho println, printf, string concatenation operator (+), assert hoặc được debugger in ra, method toString sẽ tự động được gọi.

Nếu cung cấp toString tốt cho PhoneNumber, việc tạo diagnostic information hữu ích sẽ rất đơn giản:

```java

System.out.println("failed to connect: " + phoneNumber)

```

Bất kể có override toString hay không, lập trình viên vẫn tạo diagnostic information theo cách này, nhưng nếu không override toString thì message sinh ra sẽ khó hiểu. Cung cấp toString tốt không chỉ có lợi cho instance của lớp mà còn có lợi cho các đối tượng chứa reference đến những instance đó, đặc biệt là collection object. Khi in Map, hai thông tin sau đây: “Tommy = (021）589-5588” và “Tommy = PhoneNumber@193b2d”, bạn muốn xem thông tin nào hơn?

Trong ứng dụng thực tế, method toString nên trả về mọi thông tin đáng chú ý có trong đối tượng, như ví dụ phone number ở trên. Nếu đối tượng quá lớn hoặc state information của đối tượng khó biểu diễn bằng string thì làm như vậy không thực tế.

Khi triển khai toString, phải đưa ra một quyết định quan trọng: có chỉ định format của giá trị trả về trong tài liệu hay không. Với value class (value class), chẳng hạn phone number class và matrix class, cũng nên làm vậy. Ưu điểm của việc chỉ định format là nó có thể được dùng như một biểu diễn đối tượng tiêu chuẩn, rõ ràng và phù hợp cho con người đọc. Biểu diễn này có thể dùng cho input và output, cũng như cho các data object vĩnh viễn phù hợp để con người đọc, chẳng hạn XML document. Nếu chỉ định format, tốt nhất nên cung cấp static factory hoặc constructor tương ứng để lập trình viên dễ dàng chuyển đổi qua lại giữa đối tượng và string representation của nó. Nhiều value class trong JDK library làm như vậy, bao gồm BigInteger, BigDecimal và phần lớn boxed primitive class.

Chỉ định format của giá trị trả về từ toString cũng có nhược điểm: nếu lớp đã được sử dụng rộng rãi, một khi format được chỉ định thì phải luôn nhất quán với format đó. Lập trình viên sẽ viết code để parse string representation tương ứng, tạo string representation và nhúng string representation vào persistent data. Nếu thay đổi representation này trong một bản phát hành tương lai, code và data của họ sẽ bị phá vỡ, và dĩ nhiên họ sẽ phàn nàn. Nếu không chỉ định format, có thể giữ được tính linh hoạt để thêm thông tin hoặc cải thiện format trong các bản phát hành tương lai.

**Bất kể có quyết định chỉ định format hay không, phải nêu rõ ý định trong tài liệu.** Sau đây là method toString của PhoneNumber ở [Mục 9](/vi/effective-java.md):

```java

/**
 * return (XXX)-YYY-ZZZZ，where XXX is the area code, YYY is the prefix,
 * and ZZZZ is the line number.
 */
@Override
public String toString() {
    return String.format("(%03d)-%03d-%04d", this.areaCode, this.prefix, this.lineNumber);
}

```

Nếu quyết định không chỉ định format, phần doc comment cũng nên có chỉ dẫn như sau:

```java

/**
 * return a brief description of this potion.
 */
@Override
public String toString() {
    ...
}

```

Sau khi đọc comment này, những lập trình viên lập trình dựa trên chi tiết của format hoặc tạo persistent data phải tự chịu hậu quả nếu format bị thay đổi.

Bất kể có chỉ định format hay không, **hãy cung cấp một cách truy cập bằng chương trình tới mọi thông tin được chứa trong giá trị trả về của toString**.
