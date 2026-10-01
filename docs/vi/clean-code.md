# 《Clean Code》

## Code monkey và quy tắc Hướng đạo sinh

1. Chúng ta giống như một nhóm code monkey, nhảy nhót lên xuống, tự cho rằng mình đã nắm được chân lý của lập trình. Đáng tiếc là khi nắm vài quả đào chua rồi đắc ý ngồi trên cành cây, chúng ta lại nhắm mắt làm ngơ trước mớ hỗn độn do chính mình gây ra. Đống chương trình rối như tơ vò “có thể chạy được” ấy cứ từ từ mục ruỗng ngay trước mắt chúng ta.

## Chương 1. Code sạch

1. Định luật Leblanc: sau này đồng nghĩa với không bao giờ (Later equals never).
1. Gây ra sự hỗn loạn không giúp bạn kịp deadline. Sự hỗn loạn chỉ lập tức làm bạn chậm lại và khiến bạn lỡ deadline. Cách duy nhất để kịp deadline — cách duy nhất để làm nhanh — là luôn giữ code sạch nhất có thể.
1. Trường `@author` trong Javadoc cho chúng ta biết mình là ai. Chúng ta là tác giả, mà tác giả nào cũng có độc giả. Thực tế, tác giả có trách nhiệm giao tiếp tốt với độc giả. Lần tới khi viết code, hãy nhớ mình là tác giả và hãy viết code cho những độc giả sẽ đánh giá công việc của bạn.

## Chương 3. Hàm

1. Quy tắc đầu tiên của hàm là phải ngắn. Quy tắc thứ hai là phải ngắn hơn nữa... Sau một quá trình thử và sai kéo dài, kinh nghiệm cho tôi biết rằng hàm nên nhỏ.
1. Hàm nên làm một việc. Làm tốt việc đó. Chỉ làm việc đó. Có một cách để xác định hàm có làm nhiều hơn một việc hay không: xem liệu có thể tách ra một hàm khác mà hàm đó không chỉ đơn thuần diễn giải lại cách triển khai của nó hay không.
1. Hãy đảm bảo hàm chỉ làm một việc, các câu lệnh trong hàm phải ở cùng một level abstraction. Việc trộn lẫn các level abstraction khác nhau trong một hàm thường khiến người đọc bối rối. Người đọc có thể không biết một expression nào đó là khái niệm cơ bản hay chi tiết. Tệ hơn nữa, giống như những ô cửa sổ vỡ, một khi chi tiết và khái niệm cơ bản bị trộn lẫn, ngày càng nhiều chi tiết sẽ mắc kẹt trong hàm.
1. Viết một câu lệnh `switch` ngắn thường rất khó. Viết một câu lệnh `switch` chỉ làm một việc cũng khó. Chúng ta không thể luôn tránh câu lệnh `switch`, nhưng vẫn có thể đảm bảo các `switch` được giấu ở level abstraction thấp hơn và không bao giờ lặp lại.
1. Số lượng parameter lý tưởng là 0, tiếp theo là 1, rồi 2... Xét từ góc độ testing, parameter thậm chí còn gây khó khăn hơn. Hãy thử nghĩ xem, việc viết test case đảm bảo mọi tổ hợp parameter đều chạy đúng khó đến mức nào. Nếu không có parameter thì mọi việc đơn giản hơn nhiều.
1. Hàm cam kết chỉ làm một việc nhưng vẫn có thể làm những việc khác bị che giấu. Đôi khi, nó thay đổi ngoài dự kiến các biến trong class của chính nó, gây ra coupling theo thời gian và dependency về thứ tự rất kỳ quặc.

```java
public class UserValidator {
    private Cryptographer cryptographer;

    public boolean checkPassword(String userName, String password) {
        User user = UserGateway.findByName(userName);
        if (user != null) {
            String codePhrase = user.getPhraseEncodeByPassword();
            String phrase = cryptographer.decrypt(codePhrase, password);
            if ("Valid Password".equals(phrase)) {
                Session.initialize();
                return true;
            }
        }
        return false;
    }
}
```

Side effect nằm ở việc gọi `Session.initialize()`. Hàm `checkPassword` dùng để kiểm tra password. Tên hàm không cho thấy nó sẽ khởi tạo session đó. Khi một caller tin vào tên hàm và muốn kiểm tra tính hợp lệ của user, caller sẽ phải chấp nhận rủi ro xóa dữ liệu session hiện có. Side effect này tạo ra coupling theo thời gian. Nói cách khác, `checkPassword` chỉ có thể được gọi vào một thời điểm cụ thể.

## Chương 4. Comment

1. Cách dùng thích hợp của comment là bù đắp cho thất bại mà chúng ta gặp phải khi dùng code để diễn đạt ý định. Comment luôn là một thất bại. Chúng ta luôn không thể tìm ra cách diễn đạt bản thân mà không cần comment, nên vẫn phải có comment; điều này không đáng để ăn mừng.
2. Nếu nhận thấy mình cần viết comment, hãy nghĩ lại xem có cách nào lật ngược tình thế và dùng code để diễn đạt hay không.
3. Đôi khi có lý do chính đáng để đặt danh sách công việc cần làm dưới dạng `// TODO` trong source code. `TODO` là công việc mà programmer cho rằng nên làm nhưng hiện chưa làm vì một lý do nào đó.
4. Không có gì hữu ích và thỏa mãn hơn một public API được mô tả tốt. Nếu bạn viết public API, bạn nên viết Javadoc tốt cho nó.
5. Hãy xóa những Javadoc vô dụng và dư thừa; những comment này chỉ khiến code trở nên mơ hồ khó hiểu và hoàn toàn không có giá trị documentation.
6. Quy tắc cho rằng mọi hàm phải có Javadoc hoặc mọi biến phải có comment hoàn toàn ngu ngốc và nực cười. Những comment kiểu này chỉ khiến code trở nên lộn xộn, đầy những lời vô nghĩa và khó hiểu.
7. Vào những năm 1960, đã từng có một thời gian code bị comment-out có thể hữu ích. Nhưng chúng ta đã có những source code control system tốt suốt một thời gian dài; các system này có thể ghi nhớ phần code chúng ta không cần. Chúng ta không cần dùng comment để đánh dấu nữa, cứ xóa đi; chúng sẽ không biến mất, tôi đảm bảo.

## Chương 5. Format

1. Format code rất quan trọng và phải được xem xét nghiêm túc. Format code liên quan đến giao tiếp, mà giao tiếp là việc hàng đầu của một developer chuyên nghiệp.
1. Tính năng bạn viết hôm nay rất có thể sẽ được sửa đổi trong version tiếp theo, nhưng khả năng đọc của code sẽ ảnh hưởng sâu sắc đến những lần sửa đổi có thể xảy ra sau này. Rất lâu sau khi code ban đầu được sửa, style và khả năng đọc code vẫn ảnh hưởng đến khả năng bảo trì và mở rộng. Ngay cả khi code không còn tồn tại, style và quy tắc của bạn vẫn sẽ sống tiếp.
1. Nếu một hàm gọi một hàm khác, nên đặt chúng cạnh nhau, và caller nên được đặt phía trên callee nếu có thể.

## Chương 6. Object và data structure

1. Data structure cô đọng nhất là một class chỉ có public variable và không có function. Data structure này đôi khi được gọi là Data Transfer Object, hoặc `DTO` (Data Transfer Objects). DTO là một structure rất hữu ích, đặc biệt trong các tình huống giao tiếp với database hoặc phân tích message truyền qua socket.

## Chương 7. Dùng exception thay cho return code

1. Từ rất lâu trước đây, nhiều ngôn ngữ không hỗ trợ exception. Các ngôn ngữ này có cách xử lý và báo cáo lỗi hạn chế. Bạn đặt một error flag hoặc trả về error code để caller kiểm tra. Vấn đề của các cách này là chúng làm rối code của caller. Caller phải kiểm tra lỗi ngay sau khi gọi. Đáng tiếc là bước này rất dễ bị quên. Tốt hơn là throw một exception để logic không bị việc xử lý lỗi làm rối.
1. Dùng unchecked exception. Cái giá của `checked exception` là vi phạm Open-Closed Principle. Nếu bạn throw một checked exception trong method và câu lệnh catch nằm cách ba level, bạn phải khai báo exception đó trong mọi method signature giữa câu lệnh catch và nơi throw exception. Điều này có nghĩa là một thay đổi ở level thấp của software sẽ liên quan đến signature ở level cao hơn. Cuối cùng ta có một chuỗi thay đổi xuyên từ đáy lên đỉnh của software.
1. Đừng return null. Tôi không muốn đếm xem mình đã gặp bao nhiêu application mà mỗi dòng code đều kiểm tra null. Trong Java có method `Colletions.emptyList()`, method này trả về một immutable list được định nghĩa sẵn; viết code như vậy giúp hạn chế tối đa sự xuất hiện của `NullPointerException`, khiến code sạch hơn.
1. Đừng truyền null. Trong phần lớn ngôn ngữ lập trình, không có cách tốt để xử lý null được caller vô tình truyền vào. Đã như vậy, cách làm thích hợp là cấm truyền null.

## Chương 8. Boundary

1. Third-party code giúp chúng ta phát hành nhiều tính năng hơn trong thời gian ngắn hơn. Khi sử dụng third-party package, nên bắt đầu từ đâu? Chúng ta không có trách nhiệm testing third-party code, nhưng viết test cho third-party code mà ta muốn sử dụng có thể là lợi ích phù hợp nhất với chúng ta.
1. Học third-party code khó, tích hợp third-party code cũng khó, làm cả hai việc cùng lúc lại càng khó hơn. Đừng thử nghiệm điều mới trong production code; hãy viết test để khảo sát và hiểu third-party code, việc này được gọi là “learning test”.

## Chương 9. Unit test

1. Ba định luật TDD:
   - **Định luật một** Không được viết production code trước khi viết một unit test chưa thể pass.
   - **Định luật hai** Chỉ được viết unit test vừa đủ để không thể pass; không compile cũng được tính là không pass.
   - **Định luật ba** Chỉ được viết production code vừa đủ để test đang fail hiện tại pass.
1. Ba định luật TDD thực ra nói rằng trước tiên hãy viết một Case fail, sau khi viết xong mới bắt đầu viết tính năng Code; chỉ cần Code pass Case thì không được viết thêm functional code nữa. Nói cách khác, viết xong một test thì phải viết production code tương ứng.
1. Test code quan trọng như production code. Nó không phải công dân hạng hai. Nó cần được suy nghĩ, thiết kế và chăm sóc. Nó phải sạch như production code.
1. Nếu test không thể giữ sạch, bạn sẽ đánh mất chúng. Không có test, bạn sẽ mất tất cả yếu tố đảm bảo production code có thể mở rộng. Có test thì bạn không phải lo lắng về việc sửa code! Không có test, mỗi lần sửa đều có thể mang đến bug.
1. Một bộ unit test tự động bao phủ production code có thể giữ cho design và architecture sạch nhất có thể. Test mang lại mọi lợi ích vì test khiến việc thay đổi trở nên khả thi.
1. Test sạch có ba yếu tố: khả năng đọc, khả năng đọc, khả năng đọc. Test phải rõ ràng, ngắn gọn và có đủ sức biểu đạt. Trong test, cần diễn đạt thật nhiều nội dung bằng thật ít chữ.
1. Quy tắc F.I.R.S.T:
   - **Fast** (Nhanh) Test phải chạy nhanh. Nếu test chạy chậm, bạn sẽ không muốn chạy thường xuyên. Nếu không chạy test thường xuyên, bạn không thể sớm phát hiện vấn đề và cũng không thể dễ dàng sửa chúng.
   - **Independent** (Độc lập) Các test phải độc lập với nhau. Một test không được thiết lập điều kiện cho test tiếp theo. Bạn phải có thể chạy từng test riêng lẻ và chạy test theo bất kỳ thứ tự nào.
   - **Repeatable** (Có thể lặp lại) Test phải có thể pass lặp lại trong mọi môi trường.
   - **Self-Validating** (Tự xác thực) Test phải có output dạng boolean.
   - **Timely** (Đúng lúc) Test phải được viết kịp thời. Unit test phải được viết ngay trước production code làm cho nó pass.

## Chương 10. Class

1. Một trong những design principle của hướng đối tượng là “Open-Closed Principle”, nghĩa là class phải open cho extension và closed cho modification. Chúng ta muốn xây dựng system thành một framework ít gây phiền toái nhất có thể khi thêm hoặc sửa feature. Trong system lý tưởng, chúng ta thêm feature mới bằng cách mở rộng system thay vì sửa code hiện có.
1. Một design principle khác của class là “Dependency Inversion Principle” (Dependency Inversion Principle, DIP); DIP cho rằng class nên phụ thuộc vào abstraction thay vì phụ thuộc vào concrete detail.

## Chương 11. System

1. Có một cơ chế mạnh mẽ để tách construction và usage, đó là dependency injection (Dependency Injection, DI), một cách áp dụng Inversion of Control (IoC) trong quản lý dependency. Inversion of Control lấy trách nhiệm thứ hai ra khỏi object và chuyển nó cho một object khác chuyên trách việc này, từ đó tuân theo **Single Responsibility Principle**. Trong bối cảnh quản lý dependency, object không nên chịu trách nhiệm instantiate dependency của chính nó mà nên chuyển trách nhiệm này cho một cơ chế “có quyền lực” khác, qua đó thực hiện inversion of control.
1. “Làm đúng system ngay từ đầu” chỉ là một huyền thoại. Ngược lại, chúng ta chỉ nên triển khai user story của hôm nay, sau đó refactor, ngày mai mở rộng system và triển khai user story mới. Đây là tinh túy của Agile lặp và tăng dần.

## Chương 12. Iteration

1. Bốn quy tắc của simple design, xếp theo mức độ quan trọng:
   - Chạy toàn bộ test;
   - Không trùng lặp;
   - Thể hiện ý định của programmer;
   - Giảm số lượng class và method nhiều nhất có thể.
1. Một system được test toàn diện và liên tục pass mọi test là một system có thể test. Điều này có vẻ hiển nhiên nhưng rất quan trọng. System không thể test cũng không thể verify. Một system không thể verify tuyệt đối không nên deploy.
1. Duplication là kẻ thù lớn nhất của một system có design tốt; nó đại diện cho công việc thêm, rủi ro thêm và complexity thêm nhưng không cần thiết. Muốn tạo ra một system sạch, cần có ý chí loại bỏ duplication.
1. Chi phí chính của một software project nằm ở việc maintenance lâu dài. Code phải diễn đạt rõ ý định của tác giả. Tác giả viết code càng rõ thì người khác càng mất ít thời gian để hiểu code, từ đó giảm bug và giảm chi phí maintenance.
1. Để giữ class và function nhỏ, chúng ta có thể tạo ra quá nhiều class và method nhỏ. Vì vậy quy tắc này cũng cho rằng số lượng function và class phải ít. Mục tiêu của chúng ta là giữ toàn bộ system nhỏ gọn trong khi vẫn giữ function và class ngắn gọn. Tuy nhiên, test, loại bỏ duplication và khả năng biểu đạt mới quan trọng hơn.

## Chương 13. Lập trình concurrency

1. Concurrency là một strategy để decouple. Nó giúp chúng ta phân tách **làm gì** (mục đích) và **khi nào làm** (thời điểm). Decouple mục đích và thời điểm có thể cải thiện rõ rệt throughput và structure của application.
1. Concurrency đôi khi có thể cải thiện performance, nhưng chỉ hiệu quả khi có thể chia sẻ nhiều thời gian chờ giữa nhiều thread hoặc processor; mọi việc không đơn giản như vậy.
1. Design của concurrency algorithm có thể rất khác design của hệ thống single-thread. Việc decouple mục đích và thời điểm thường gây ảnh hưởng rất lớn đến structure của system.
1. Một số định nghĩa cơ bản trong lập trình concurrency:
   - **Resource bị giới hạn**: resource có kích thước hoặc số lượng cố định trong môi trường concurrency.
   - **Mutual exclusion**: tại mỗi thời điểm chỉ một thread có thể truy cập shared data hoặc shared resource.
   - **Thread starvation**: một thread hoặc một nhóm thread bị ngăn cản trong thời gian dài hoặc vĩnh viễn. Ví dụ, luôn cho thread chạy nhanh được chạy trước; nếu cứ cho thread chạy nhanh chạy mãi, thread có thời gian thực thi dài sẽ bị “đói”.
   - **Deadlock**: hai hoặc nhiều thread chờ lẫn nhau thực thi xong. Mỗi thread đều giữ resource mà thread khác cần, và không lấy được resource do thread khác giữ, nên không thể kết thúc.
   - **Livelock**: các thread có thứ tự thực thi nhất quán đều muốn bắt đầu nhưng phát hiện các thread khác đã “lên đường”. Do tranh đua, các thread liên tục cố bắt đầu nhưng trong thời gian dài vẫn không đạt được, thậm chí không bao giờ khởi động được.

## Chương 14. Cải tiến từng bước

1. Code chạy được vẫn chưa đủ, code chạy được thường xuyên có thể sụp đổ nghiêm trọng. Programmer chỉ hài lòng với việc làm cho code chạy được là người thiếu chuyên nghiệp. Họ sợ không có thời gian cải thiện structure và design của code; tôi không đồng ý. Không có gì gây thiệt hại sâu sắc và lâu dài hơn cho development project bằng code tệ.
1. Tiến độ có thể lên lịch lại, requirement có thể định nghĩa lại, động lực của team có thể điều chỉnh. Code tệ chỉ liên tục mục ruỗng và lên men, nhẫn tâm kéo team tụt lại.
1. Giữ code luôn sạch và đơn giản, không bao giờ để sự mục ruỗng có cơ hội bắt đầu.

## Chương 15. Framework JUnit

1. Có thể xóa prefix của member variable. Trong runtime hiện nay, kiểu coding theo phạm vi này hoàn toàn dư thừa.
1. Condition nên được đóng gói để diễn đạt intention của code rõ ràng hơn. Có thể tách thành một method để giải thích condition này.

```java
public String compact(String message) {
    if (expected == null || actual == null || areStringsEqual()) {
        return Assert.format(message, expected, actual);
    }
}

// 拆解后...
public String compact(String message) {
    if (shouldNotCompact()) {
        return Assert.format(message, expected, actual);
    }
}

private boolean shouldNotCompact() {
    return expected == null || actual == null || areStringsEqual();
}
```

## Chương 17. Code smell và cảm hứng

1. Để comment truyền đạt những thông tin vốn nên được lưu giữ tốt hơn trong source code control system, issue tracking system hoặc bất kỳ hệ thống ghi chép nào khác là không phù hợp.
1. Javadoc không nói gì ngoài function signature cũng là dư thừa.
1. Khi thấy code bị comment-out, hãy xóa nó! Đừng lo, source code control system vẫn sẽ nhớ nó.
1. Mỗi lần nhìn thấy duplicated code đều có nghĩa là đã bỏ sót abstraction. Đưa duplicated code vào abstraction tương tự sẽ làm tăng vốn từ trong ngôn ngữ design của bạn. Các programmer khác có thể sử dụng abstraction facility mà bạn tạo ra. Coding trở nên ngày càng nhanh hơn và ít lỗi hơn vì bạn đã nâng cao level abstraction.
1. Dead code là code không được thực thi; có thể tìm thấy nó trong câu lệnh if kiểm tra một condition không bao giờ xảy ra, trong block try/catch không bao giờ throw exception, trong utility method không bao giờ được gọi, hoặc trong condition switch/case không bao giờ xảy ra. Nếu tìm thấy dead code, hãy chôn cất nó một cách đàng hoàng và xóa nó khỏi system.
1. Feature envy là một trong những code smell do Martin Fowler đề xuất. Method của class chỉ nên quan tâm đến variable và function thuộc class đó, không nên ưu ái variable và function của class khác. Chúng ta cần loại bỏ feature envy.
1. Dùng polymorphism thay cho if/else hoặc switch/case. Với một loại lựa chọn nhất định, không nên có nhiều hơn một câu lệnh switch. Các case trong câu lệnh switch đó phải tạo ra polymorphic object để thay thế những câu lệnh switch tương tự khác trong system.
1. Dùng named constant thay cho magic number.
1. Giờ đây enum đã được thêm vào ngôn ngữ java, cứ yên tâm sử dụng! Đừng tiếp tục dùng chiêu cũ `public static final int`. Làm vậy sẽ làm mất ý nghĩa của int, trong khi enum thì không, vì chúng thuộc về các enumeration có tên.
