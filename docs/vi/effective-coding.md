# 《Effective Coding——Sổ tay phát triển Java của Alibaba》

## Chương 1 Quy ước lập trình

### Phong cách đặt tên

1. Tên package thống nhất dùng dạng **số ít**, nhưng nếu tên class có ý nghĩa số nhiều thì tên class có thể dùng dạng số nhiều. e.g. `com.alibaba.ai.util.MessageUtils`

### Định nghĩa hằng số

1. Nếu giá trị của một biến chỉ thay đổi trong một phạm vi, hãy dùng kiểu enum để định nghĩa.

### Định dạng code

1. Giữa các từ khóa `if/for/while/switch/do` và dấu ngoặc **phải có khoảng trắng**.
1. Thụt lề bằng 4 khoảng trắng, cấm sử dụng ký tự điều khiển Tab.
1. Giữa hai dấu gạch chéo của comment và nội dung comment **có đúng một khoảng trắng**. e.g. `// Đây là chú thích ví dụ`
1. Mỗi dòng không quá 120 ký tự; nếu vượt quá thì cần xuống dòng, việc xuống dòng tuân theo:
   - Dòng thứ hai **thụt vào 4 khoảng trắng** so với dòng thứ nhất; từ dòng thứ ba trở đi không thụt thêm.
   - Xuống dòng cùng với toán tử và phần bên dưới.
   - Xuống dòng cùng với dấu chấm của lời gọi phương thức và phần bên dưới.
   - Khi xuống dòng cùng với dấu chấm của lời gọi phương thức và phần bên dưới, thực hiện sau dấu phẩy.
   - Không xuống dòng trước dấu ngoặc.

```java
// Correct example
StringBuffer sb = new StringBuffer();
sb.append("zi").append("xin")...
    .append("huang")...
    .append("huang")...
    .append("huang");

// Incorrect example
StringBuffer sb = new StringBuffer();
sb.append("ge").append("cheng")...append
    ("no line break here");

// When method arguments exceed 120 characters, do not break before the comma
method(args1, args2, args3, ...
    , argsX);
```

5. Đặt mã hóa file văn bản của IDE là UTF-8; ký tự xuống dòng của file IDE dùng định dạng UNIX, không dùng định dạng Windows.
1. **Không cần thiết** thêm nhiều khoảng trắng để căn các ký tự trên một dòng với vị trí tương ứng trên dòng trước đó.

### Quy ước OOP

1. Với các interface đang được bên ngoài gọi, không được sửa method signature để tránh ảnh hưởng đến bên gọi interface. Nếu interface đã lỗi thời, **phải** thêm annotation `@Deprecated` và nêu rõ interface hoặc service mới được sử dụng.

### Xử lý collection

1. Với mọi phép so sánh giá trị giữa các object wrapper cùng kiểu, đều sử dụng phương thức equals.
1. **Cấm** thêm bất kỳ logic nghiệp vụ nào trong constructor; nếu có logic khởi tạo, hãy đặt trong phương thức init.
1. Thận trọng khi dùng phương thức clone của Object để sao chép object.<br>**Giải thích**: phương thức clone của object mặc định là shallow copy; nếu muốn thực hiện deep copy thì cần override phương thức clone.
1. Việc xử lý hashCode và equals tuân theo các quy tắc sau:
   - Chỉ cần override equals thì **bắt buộc** phải override hashCode;
   - Vì Set lưu trữ các object không trùng lặp và phán đoán dựa trên hashCode và equals, nên các object được lưu trong Set phải override hai phương thức này.
   - Nếu object tự định nghĩa được dùng làm key của Map thì **bắt buộc** phải override hai phương thức này.
   - **Giải thích**: String đã override các phương thức hashCode và equals, vì vậy chúng ta có thể sử dụng object String làm key một cách thuận tiện.
1. Không thể ép kiểu kết quả subList của ArrayList thành ArrayList, nếu không sẽ ném exception `ClassCastException`.<br>**Giải thích**: subList là một view của ArrayList; mọi thao tác trên subList đều cuối cùng phản ánh lên list gốc.
1. Trong ngữ cảnh subList, cần đặc biệt chú ý rằng việc sửa số lượng phần tử của collection gốc sẽ khiến thao tác duyệt, thêm và xóa trên sublist đều phát sinh `ConcurrentModificationException`.

```java
List<Integer> list = new ArrayList<>();
int count = 5;
for (int i = 0; i < count; ++i) {
    list.add(i + 1);
}

// Sublist
List<Integer> subList = list.subList(0, list.size() - 1);

// Modify the number of elements in the original collection
list.add(11);

// Cause the sublist to throw an exception
// Exception in thread "main" java.util.ConcurrentModificationException
System.out.println(subList);
```

7. Khi sử dụng công cụ Arrays.asList() để chuyển array thành collection, không được sử dụng các phương thức liên quan đến việc sửa collection của nó, nếu không sẽ ném exception `UnsupportedOperationException`.<br>**Giải thích**: object trả về của asList là một inner class của Arrays và không triển khai các phương thức sửa collection. Đây là adapter pattern, chỉ chuyển đổi interface; dữ liệu phía sau vẫn là array.

```java
String[] str = new String[] {"you", "wu"};
List list = Arrays.asList(str);

// list.add("bingo") throws a runtime exception

str[0] = "bingo";
// list.get(0) also changes accordingly.
```

8. Khi khởi tạo collection, hãy chỉ định kích thước ban đầu của collection. Nếu HashMap cần chứa 1024 phần tử mà không thiết lập kích thước ban đầu (mặc định là 16), khi số lượng phần tử liên tục tăng, dung lượng sẽ buộc phải mở rộng 7 lần; resize cần xây dựng lại hash table, điều này ảnh hưởng nghiêm trọng đến hiệu năng.
1. Dùng entrySet để duyệt collection kiểu Map với K/V thay vì duyệt theo cách keySet. Nếu là JDK8 thì sử dụng phương thức Map.foreach().
1. **Đặc biệt chú ý** đến việc collection kiểu Map K/V có thể lưu giá trị null hay không. Do ảnh hưởng của HashMap, nhiều người cho rằng ConcurrentHashMap có thể nhận giá trị null, nhưng trên thực tế việc lưu giá trị null sẽ ném exception NPE.

| Loại collection     | Key               | Value             | Supper      | Giải thích       |
| ------------------- | ----------------- | ----------------- | ----------- | ---------------- |
| Hashtable            | Không cho phép null | Không cho phép null | Dictionary  | An toàn luồng     |
| ConcurrentHashMap    | **Không cho phép** null | **Không cho phép** null | AbstractMap | Kỹ thuật phân đoạn lock |
| TreeMap              | Không cho phép null | Cho phép null       | AbstractMap | Không an toàn luồng |
| HashMap              | Cho phép null       | Cho phép null       | AbstractMap | Không an toàn luồng |

11. Tận dụng đặc tính duy nhất của phần tử Set để nhanh chóng loại bỏ phần tử trùng lặp khỏi collection, tránh dùng phương thức contains của List để duyệt, so sánh và loại bỏ phần tử trùng lặp.

### Xử lý đồng thời

1. Khi tạo thread hoặc thread pool, hãy chỉ định tên thread có ý nghĩa để thuận tiện truy vết khi xảy ra lỗi.

```java
public class TimeTaskThread extends Thread {
    public TimeTaskThread() {
        super.setName("TimeTaskThread");
        // ...
    }
}
```

2. Tài nguyên thread **phải** được cung cấp thông qua thread pool; không được tự tạo thread một cách tường minh trong ứng dụng. <br>**Giải thích**: lợi ích của việc sử dụng thread pool là giảm thời gian và tài nguyên hệ thống tiêu tốn cho việc tạo và hủy thread, giải quyết vấn đề thiếu tài nguyên. Nếu không sử dụng thread pool, có thể hệ thống sẽ tạo ra một lượng lớn thread cùng loại, dẫn đến cạn kiệt bộ nhớ hoặc “chuyển đổi quá mức”.
1. Khi đồng thời lock nhiều resource, database table hoặc object, cần giữ thứ tự lock nhất quán; nếu không **có thể gây deadlock**. <br>**Giải thích**: nếu thread một cần lần lượt lock table A/B/C rồi mới có thể thực hiện thao tác cập nhật, thì thứ tự lock của thread hai cũng phải là A/B/C; nếu không có thể xảy ra deadlock.
1. volatile giải quyết vấn đề không nhìn thấy trong bộ nhớ khi đa luồng. Với một ghi nhiều đọc, nó có thể giải quyết vấn đề đồng bộ biến, nhưng nếu có nhiều ghi thì vẫn không thể giải quyết vấn đề an toàn luồng.

### Câu lệnh điều khiển

1. Trong một khối switch, mỗi case hoặc kết thúc bằng break/return v.v., hoặc có comment giải thích chương trình sẽ tiếp tục thực thi đến case nào; trong một khối switch **đều phải** có câu lệnh default và đặt ở cuối, ngay cả khi nó không có code nào.
1. Trong bối cảnh đồng thời cao, **tránh sử dụng** phán đoán “bằng” làm điều kiện ngắt hoặc thoát. <br>**Giải thích**: nếu xử lý điều khiển đồng thời không tốt, việc phán đoán bằng rất dễ bị xuyên qua; nên dùng điều kiện phán đoán theo khoảng lớn hơn hoặc nhỏ hơn để thay thế.
1. Không thực hiện các câu lệnh phức tạp khác trong phán đoán điều kiện; có thể gán kết quả của logic phán đoán phức tạp cho **tên biến Boolean có ý nghĩa** để tăng khả năng đọc.

### Quy ước comment

1. Nhãn comment đặc biệt. TODO thực tế là một tag của Javadoc; dù Javadoc hiện chưa triển khai, nó đã được sử dụng rộng rãi và **chỉ có thể áp dụng cho class, interface và method**. Dùng nhãn FIXME trong comment để đánh dấu một đoạn code bị lỗi và không thể hoạt động; cần kịp thời sửa chữa.

### Khác

1. Chú ý rằng phương thức Math.random() trả về kiểu double, phạm vi giá trị x ∈ [0, 1); nếu muốn nhận số ngẫu nhiên kiểu integer, không được nhân x lên một số lần với 10 rồi lấy phần nguyên, mà hãy trực tiếp sử dụng phương thức nextInt hoặc nextLong của object Random.

## Chương 2 Exception và log

### Xử lý exception

1. Khi catch, hãy phân biệt code ổn định và code không ổn định. Code ổn định là code sẽ không xảy ra lỗi trong bất kỳ trường hợp nào. Với catch của code không ổn định, cần cố gắng phân biệt loại exception trước rồi mới thực hiện xử lý tương ứng.
1. Không sử dụng return trong khối finally.<br>**Giải thích**: sau khi return trong khối finally trả về, phương thức kết thúc thực thi và sẽ không thực hiện câu lệnh return trong khối try nữa.
1. Khi định nghĩa, hãy phân biệt exception unchecked/checked; tránh trực tiếp ném new RuntimeException(), càng không được phép ném Exception hoặc Throwable; nên sử dụng custom exception có ý nghĩa nghiệp vụ. Khuyến nghị các custom exception đã được định nghĩa trong ngành, như DAOException/ServiceException.

### Quy ước log

1. Trong ứng dụng không được trực tiếp sử dụng API trong hệ thống log (Log4j, Logback), mà nên phụ thuộc và sử dụng API trong framework log SLF4J. Việc sử dụng framework log theo facade có lợi cho việc bảo trì và thống nhất cách xử lý log của từng class.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger logger = LoggerFactory.getLogger(Abc.class);
```

2. Ghi log một cách thận trọng. Trong môi trường production cấm xuất log debug; chọn lọc khi xuất log info; nếu dùng warn để ghi lại thông tin hành vi nghiệp vụ khi vừa đưa lên production, nhất định phải chú ý đến lượng log xuất ra, tránh làm đầy ổ đĩa server và kịp thời xóa các log theo dõi này.

## Chương 3 Unit test

1. Unit test có thể thực thi lặp lại và không được chịu ảnh hưởng của môi trường bên ngoài.
1. Với unit test liên quan đến database, có thể thiết lập cơ chế tự động rollback để không tạo dữ liệu bẩn cho database.
1. Unit test là một phương thức bảo đảm chất lượng; không khuyến nghị bổ sung test case unit test sau khi project được phát hành, khuyến nghị hoàn thành unit test trước khi project được gửi test.

## Chương 4 Quy ước bảo mật

1. Với các bối cảnh có user-generated content như đăng bài, bình luận, gửi instant message, **phải** triển khai các policy kiểm soát rủi ro như chống spam và lọc từ ngữ bị cấm trong nội dung văn bản.

## Chương 5 Database MySQL

### Quy ước tạo table

1. Với field biểu đạt khái niệm có/không, **phải** đặt tên theo dạng is_xxx, kiểu dữ liệu là `unsigned tinyint`. <br> **Giải thích**: bất kỳ field nào có giá trị không âm thì **phải** là unsigned.
1. Field có thể dư thừa phù hợp để nâng cao hiệu năng truy vấn, nhưng **phải** cân nhắc tính nhất quán dữ liệu. e.g. tên danh mục sản phẩm có tần suất sử dụng cao, độ dài field ngắn, tên về cơ bản không thay đổi, có thể lưu dư thừa tên danh mục trong các table liên quan để **tránh truy vấn liên kết**. Field dư thừa tuân theo:
   - Không phải field thường xuyên sửa đổi;
   - Không phải field varchar quá dài, càng không được là field text.

### Quy ước index

1. Khi tạo index trên field varchar, **phải** chỉ định độ dài index; không cần tạo index trên toàn bộ field, chỉ cần quyết định độ dài index theo độ phân biệt của văn bản thực tế.
1. Tìm kiếm trên page nghiêm cấm fuzzy bên trái hoặc fuzzy toàn bộ; nếu cần thì hãy giải quyết thông qua search engine. <br> **Giải thích**: file index có **đặc tính khớp tiền tố ngoài cùng bên trái** của B-Tree; nếu giá trị bên trái chưa được xác định thì không thể sử dụng index này.
1. Nếu có trường hợp order by, hãy chú ý tận dụng tính có thứ tự của index. Field cuối cùng của order by là một phần của composite index và được đặt ở cuối thứ tự kết hợp index, tránh xuất hiện tình trạng file_sort làm ảnh hưởng hiệu năng truy vấn.
   - **Ví dụ đúng**: where a=? and b=? order by c; index: a_b_c.
   - **Ví dụ sai**: trong index có tìm kiếm theo range thì không thể tận dụng tính có thứ tự của index, như WHERE a>10 ORDER BY b; index a_b không thể sắp xếp.
1. Tận dụng delayed join hoặc subquery để tối ưu các trường hợp phân trang với lượng dữ liệu cực lớn. <br>**Giải thích**: MySQL không bỏ qua các dòng offset mà lấy offset+N dòng, sau đó bỏ các dòng trước offset và trả về N dòng; khi offset đặc biệt lớn, hiệu năng sẽ rất thấp. Cần kiểm soát tổng số page trả về hoặc viết lại SQL cho các page vượt ngưỡng.
1. Khi tạo composite index, phần có độ phân biệt cao nhất nằm ở ngoài cùng bên trái.
1. Mục tiêu tối ưu hiệu năng SQL ít nhất phải đạt cấp độ range, yêu cầu là cấp độ ref, tốt nhất là consts.

### Câu lệnh SQL

1. Không dùng count(tên_cột) hoặc count(hằng_số) để thay thế count(\*); count(\*) là câu lệnh đếm dòng tiêu chuẩn do SQL92 định nghĩa, không liên quan đến database, cũng không liên quan đến NULL và non-NULL. <br>**Giải thích**: count(\*) sẽ đếm các dòng có giá trị NULL, còn count(tên_cột) sẽ không đếm các dòng mà cột này có giá trị NULL.
1. `count(distinct column)` tính số dòng không trùng lặp của cột đó sau khi loại NULL. Chú ý rằng `count(distinct column1,column2)`, nếu một trong hai cột hoàn toàn là NULL thì dù cột còn lại có các giá trị khác nhau, kết quả vẫn là 0.
1. Khi giá trị của một cột hoàn toàn là NULL, kết quả trả về của `count(column)` là 0, nhưng kết quả trả về của `sum(column)` là NULL, vì vậy cần chú ý vấn đề NPE khi sử dụng sum().<br> Có thể dùng cách sau để tránh vấn đề NPE của sum().

```sql
SELECT IF(ISNULL(SUM(g), 0, SUM(g))) FROM table;
```

4. Dùng `ISNULL()` để phán đoán giá trị có phải NULL hay không.<br>**Giải thích**: phép so sánh trực tiếp giữa NULL và bất kỳ giá trị nào đều cho kết quả NULL.
1. Không được sử dụng foreign key và cascade; mọi khái niệm foreign key phải được giải quyết ở tầng ứng dụng. <br>**Giải thích**: lấy quan hệ giữa học sinh và thành tích làm ví dụ, student_id của table học sinh là primary key, còn student_id của table thành tích là foreign key. Nếu cập nhật student_id của table học sinh và đồng thời kích hoạt cập nhật student_id của table thành tích thì đó là **cascading update**. Foreign key và cascading update phù hợp với máy đơn có concurrency thấp, không phù hợp với cluster phân tán có concurrency cao; cascading update là blocking mạnh và có rủi ro tạo ra bão cập nhật database; foreign key ảnh hưởng đến tốc độ insert của database.
1. **Cấm sử dụng stored procedure**. Stored procedure khó debug và mở rộng, hơn nữa không có tính portable.
1. Nên tránh sử dụng thao tác `in` nếu có thể. Nếu thực sự không thể tránh, cần đánh giá cẩn thận số lượng phần tử trong collection phía sau in và kiểm soát ở mức không quá 1000.

### ORM mapping

1. Thuộc tính Boolean của class POJO không được thêm is, còn field database **phải** thêm is\_, yêu cầu thực hiện mapping giữa field và property trong resultMap.
1. Tham số cấu hình `sql.xml` sử dụng: `#{}, #param#`, không sử dụng \${}, cách này dễ phát sinh SQL injection.
1. Không lạm dụng transaction `@Transactional`. Transaction sẽ ảnh hưởng đến QPS của database. Ngoài ra, tại nơi sử dụng transaction cần cân nhắc các phương án rollback ở mọi khía cạnh, bao gồm rollback cache, rollback search engine, bù trừ message, hiệu chỉnh thống kê v.v.

## Chương 6 Cấu trúc dự án

### Phân tầng ứng dụng

1. Ở tầng DAO, có nhiều loại exception phát sinh và không thể catch bằng exception chi tiết, vì vậy sử dụng cách `catch(Exception e)` rồi throw new `DAOException(e)`; không cần in log vì log nằm ở tầng Manager/Service, nơi nhất định cần bắt và ghi vào file log. Nếu lại ghi log trên cùng server thì sẽ lãng phí hiệu năng và storage.

### Dependency thư viện bên thứ hai

1. Việc định nghĩa GAV tuân theo các quy tắc sau:
   - Định dạng GroupID: com.{công_ty/BU}.lĩnh_vực.\[lĩnh_vực_con\], nhiều nhất 4 cấp. e.g. `com.taobao.jstorm`
   - Định dạng ArtifactID: tên product line-tên module. Về ngữ nghĩa không trùng lặp, không bỏ sót. e.g. `dubbo-client、fastjson-api、jstorm-tool`
   - Định dạng Version: số phiên bản chính.số phiên bản phụ.số bản sửa đổi.
1. Ứng dụng trên production không được phụ thuộc vào version SNAPSHOT. <br>**Giải thích**: không phụ thuộc vào version SNAPSHOT là cách bảo đảm tính idempotent khi phát hành ứng dụng. Ngoài ra, điều này cũng có thể tăng tốc quá trình đóng gói build khi compile.

### Server

1. Với server có concurrency cao, khuyến nghị giảm thời gian timeout time_wait của giao thức TCP. <br>**Giải thích**: hệ điều hành mặc định chỉ đóng connection ở trạng thái time_wait sau 240s. Khi truy cập đồng thời cao, phía server có thể không tạo được connection mới vì có quá nhiều connection ở trạng thái time_wait, do đó cần giảm giá trị chờ này trên server.
1. Thiết lập tham số `-XX:+HeapDumpOnOutOfMemoryError` cho JVM để khi JVM gặp tình huống OOM thì xuất thông tin dump. <br>**Giải thích**: OOM có xác suất xảy ra, thậm chí có quy luật, vài tháng mới xuất hiện một lần; thông tin hiện trường khi xảy ra có giá trị rất lớn trong việc tìm lỗi.
1. Trong môi trường production trực tuyến, đặt dung lượng bộ nhớ Xms và Xms của JVM bằng nhau để tránh áp lực do điều chỉnh kích thước heap sau GC.

## Chương 7 Quy ước thiết kế

1. Thận trọng khi sử dụng inheritance để mở rộng, ưu tiên dùng **aggregation hoặc composition** để triển khai. <br>**Giải thích**: nếu nhất thiết phải dùng inheritance thì **phải** tuân thủ nguyên tắc thay thế Liskov. Nguyên tắc này yêu cầu tại nơi class cha có thể xuất hiện thì class con nhất định cũng có thể xuất hiện.
1. Khi thiết kế hệ thống, theo nguyên tắc đảo ngược dependency, hãy cố gắng phụ thuộc vào abstract class và interface để thuận lợi cho việc mở rộng và bảo trì.
1. Chú ý mở đối với extension, đóng đối với modification.
