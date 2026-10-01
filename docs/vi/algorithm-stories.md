# 《Sách thuật toán gối đầu》

> Ở đây chỉ ghi lại một số câu chuyện hoặc điểm kiến thức thú vị.

- [Câu đố về mắt đỏ và mắt nâu](#cau-đo-ve-mat-đo-va-mat-nau)
- [Tìm số còn lại](#tim-so-con-lai)
- [Nói xem ngày 2 tháng 7 năm 2199 là thứ mấy](#noi-xem-ngay-2-thang-7-nam-2199-la-thu-may)
- [Số nguyên tố Mersenne](#so-nguyen-to-mersenne)
- [Nước trong cốc có quá nửa không](#nuoc-trong-coc-co-qua-nua-khong)

## Câu đố về mắt đỏ và mắt nâu

Ngày xưa, trên một hòn đảo nhỏ chỉ có các nhà sư sinh sống. Một số nhà sư có mắt đỏ, còn một số khác có mắt nâu. Các nhà sư mắt đỏ bị nguyền rủa: nếu biết mắt mình màu đỏ thì đêm hôm đó, đúng 12 giờ, họ phải tự kết liễu, không có ngoại lệ.

Giữa các nhà sư có một quy tắc bất thành văn là không được nhắc đến màu mắt của nhau. Trên đảo không có gương, cũng không có bất kỳ vật nào có thể phản chiếu diện mạo của chính mình. Vì vậy, không một nhà sư nào biết được màu mắt của mình. Vì những lý do đó, mỗi nhà sư đều sống những ngày tháng hạnh phúc.

Một ngày nọ, một du khách bất ngờ đến đảo; cô hoàn toàn không biết tình hình ở đó. Vì vậy, cô nói với các nhà sư: “Trong số các bạn, có ít nhất một người có mắt đỏ”.

![island-eye-color](../images/island-eye-color.jpg)

Người du khách vô tình ấy rời đảo ngay trong ngày, còn các nhà sư thì bất an vì lần đầu tiên nghe thấy chủ đề về màu mắt. Đêm hôm đó, trên đảo bắt đầu xảy ra những chuyện đáng sợ...

Rốt cuộc đã xảy ra chuyện gì?

Bài toán này không đơn giản nhưng vô cùng thú vị; một khi biết đáp án, bạn lại thấy nó không quá khó. Đây không phải kiểu câu hỏi vô lý, muốn giải được cần một chút suy luận logic, vì vậy đừng cố giải ngay. Hãy dành 2 phút tự suy nghĩ trước.

```
if ((思考时间 > 2 分钟) || (已经知道答案了吗)) {
    跳转至下一段
} else {
    返回上一段，并至少思考 2 分钟
}
```

Bây giờ hãy xem đáp án đúng.

Du khách nói rằng “ít nhất một người” có mắt đỏ. Giả sử trên đảo **không có bất kỳ nhà sư nào có mắt đỏ**, điều này sẽ dẫn đến kết quả tồi tệ nhất. Hãy nghĩ xem, đối với các nhà sư, tất cả những nhà sư khác mà họ nhìn thấy đều có mắt nâu. Vì vậy, mỗi nhà sư sẽ cho rằng mắt mình màu đỏ; có thể hình dung rằng tất cả các nhà sư sẽ tự sát trong đêm đó.

Nếu **chỉ có một nhà sư có mắt đỏ**, chuyện gì sẽ xảy ra? Rất đơn giản, nhà sư này biết mắt của những người khác đều màu nâu, vậy nên sẽ suy ra màu mắt của mình và chọn cách tự sát. Lời nói vô tình của du khách đã cướp đi một mạng người như thế.

Hãy xét trường hợp phức tạp hơn một chút. Giả sử có **hai nhà sư mắt đỏ**, mỗi người đều biết có một nhà sư mắt đỏ và đều nghĩ người được nhắc đến là người kia. Hai nhà sư này nghĩ thầm: “Tên mắt đỏ kia tối nay sẽ tự sát”. Đêm đó, mỗi người đều yên tâm đi ngủ. Sáng hôm sau, khi hai nhà sư gặp nhau và thấy người kia không tự sát, họ bị đả kích nặng nề về tinh thần. Cả hai đều nhận ra rằng có hai nhà sư mắt đỏ chứ không phải một, và người còn lại chính là mình. Không có khả năng nào khác có thể khiến người kia không tự sát trong đêm đầu tiên mà vẫn yên tâm đi ngủ. Vì vậy, hai nhà sư mắt đỏ bị đả kích tột độ này **đều chết thảm vào đêm hôm sau**.

Hãy xét một trường hợp phức tạp hơn nữa. Nếu có 3 nhà sư mắt đỏ thì sao? Bình thường, 3 người này sẽ nhìn thấy hai nhà sư mắt đỏ, nên sau khi nghe lời du khách, họ sẽ không chọn tự sát. Sau đêm đầu tiên, họ lại nghĩ rằng hai nhà sư còn lại sẽ tự sát vào đêm thứ hai (chính là trường hợp “có hai nhà sư mắt đỏ” đã phân tích ở trên). Sáng ngày thứ ba, khi thấy hai nhà sư mà họ vốn nghĩ sẽ tự sát lại không tự sát, 3 người trước đó hoàn toàn không nghĩ mình cũng là nhà sư mắt đỏ sẽ đồng thời chịu một đả kích cực lớn. Bởi vì hai nhà sư mắt đỏ cũng không tự sát vào đêm thứ hai, điều này cho thấy còn có một nhà sư mắt đỏ nữa, và nhà sư mắt đỏ thứ ba đó chính là mình.

Logic này sẽ lặp lại. Vì vậy, đáp án của bài toán là: “Nếu trên đảo có tổng cộng n nhà sư mắt đỏ thì vào đêm thứ n, những nhà sư này sẽ đồng thời tự sát”. Ví dụ, nếu trên đảo có tổng cộng 5 nhà sư mắt đỏ thì vào đêm thứ 5, cả 5 nhà sư mắt đỏ sẽ đồng thời tự sát.

Bài toán này thực ra có thể giải bằng phương pháp đệ quy. Giả sử số nhà sư mắt đỏ N là 10, ta có thể áp dụng logic của N bằng 9. Tương tự, khi N bằng 8 hoặc 7, đều áp dụng logic của trường hợp `N-1`. Coi `N=1`, tức “chỉ có một nhà sư mắt đỏ”, là điều kiện kết thúc, ta có thể suy ra kết quả cuối cùng. Quá trình này hoàn toàn giống với quá trình gọi đệ quy một hàm trong thuật toán máy tính.

## Tìm số còn lại

Có một mảng có thể lưu 99 giá trị `item[0], item[1],...item[98]`. Từ tập hợp các phần tử `1~100` {1,2,3,...,100}, chọn ngẫu nhiên 99 phần tử và lưu vào mảng. Tập hợp có 100 phần tử, trong khi mảng chỉ lưu được 99 giá trị, nên tập hợp sẽ còn lại một phần tử. Hãy viết chương trình để tìm phần tử cuối cùng còn lại.

Trước hết hãy dành 2 phút suy nghĩ.

Được rồi, bài toán này thực ra rất đơn giản, nhưng những độc giả chưa hiểu đúng đề bài có thể cho rằng nó rất khó. Đáp án được thể hiện trong đoạn code dưới đây.

```java
int res = 5050;
for (int i = 0; i < 99; ++i) {
    res -= item[i];
}
System.out.println("最后剩下的数是：" + res);
```

Nếu cộng 100 giá trị trong tập hợp, ta được 5050. Lần lượt lấy 99 giá trị trong mảng trừ khỏi 5050, số cuối cùng chính là giá trị còn lại chưa được lưu vào mảng. Có lẽ nhiều độc giả đã nghĩ đến một thuật toán tương tự. Ngay cả khi chưa tìm ra đáp án đúng cũng đừng thất vọng, bởi những người thực sự nên thất vọng là những người sau khi không tìm được đáp án đã dễ dàng bỏ cuộc và muốn xem ngay đáp án đúng.

## Nói xem ngày 2 tháng 7 năm 2199 là thứ mấy

Hãy công bố đáp án trước: ngày 2 tháng 7 năm 2199 là thứ Ba. Thực ra bạn có thể đoán mò nhờ may mắn, xác suất đúng là 1/7. Muốn thực sự tìm ra đáp án chính xác thì quá trình không đơn giản. Có lẽ một số độc giả sẽ tự thiết kế một thuật toán tinh vi để tìm đáp án, nhưng tôi vẫn muốn dùng thuật toán “Doomsday” của giáo sư John Conway để giải thích.

Thuật toán Doomsday tuy không phải là “trò chơi”, nhưng có thể khơi dậy sự tò mò của người khác giới mới gặp trong các bữa tiệc. Vì vậy, nó đã góp phần rất lớn đưa không ít “tay chơi” bước vào điện toán. Ví dụ: “Người đẹp, hãy cho tôi biết ngày sinh của bạn, để tôi đoán xem đó là thứ mấy.” “Bạn cứ nói đại một năm, tôi sẽ đoán xem Valentine của năm đó là thứ mấy”. Nghe hơi sến, nhưng như vậy có thể ngay lập tức thu hút sự chú ý của đối phương.
 
Môi trường thực thi của thuật toán Doomsday của giáo sư Conway chính là môi trường **lịch Gregory** mà chúng ta sử dụng ngày nay.

Trước hết, hãy làm rõ **năm nhuận là gì**. Năm nhuận là năm chia hết cho 4 nhưng không chia hết cho 100, hoặc chia hết cho 400. Tháng 2 của năm nhuận có 29 ngày, còn tháng 2 của năm thường có 28 ngày.

```java
// Determine whether it is a leap year
boolean isLeapYear(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}
```

Nguyên lý hoạt động của thuật toán Doomsday rất đơn giản. Để xác định thứ của những ngày khác nhau, trước hết thuật toán **thiết lập một “mốc” cần thiết**. Sau đó, **dựa trên nguyên tắc các thứ lặp theo chu kỳ 7 ngày và xét đến năm nhuận**, tính ra thứ tương ứng với ngày.

Trong năm thường, đặt ngày 2.28 làm “Doomsday”; đến năm nhuận, đặt ngày 2.29 làm “Doomsday”. Chỉ cần biết thứ của “Doomsday” trong một năm đặc biệt (ví dụ năm 1900), ta có thể dùng thuật toán Conway để xác định thứ của những ngày khác.

Chúng ta đều biết các thứ lặp theo chu kỳ 7 ngày, vì vậy những ngày cách “Doomsday” một bội số của 7 sẽ có cùng thứ với “Doomsday”. Dựa trên nguyên lý này, chỉ cần ghi nhớ mỗi tháng có một ngày luôn trùng thứ với “Doomsday” là có thể nhanh chóng tính ra kết quả.

Những ngày trong mỗi tháng có cùng thứ với “Doomsday” là:

```
4.4、6.6、8.8、10.10、12.12、9.5、5.9、7.11、11.7、3.7
```

Chỉ cần ghi nhớ các tháng 4, 6, 8, 10, 12 có số tháng và số ngày giống nhau; sau đó là 9.5, 5.9, 7.11, 11.7, bốn số này đối xứng với nhau; và một số nữa là 3.7. Có dễ nhớ không?

Được rồi, **chỉ cần biết “Doomsday” của năm đó là thứ mấy, ta có thể suy ra thứ của bất kỳ ngày nào trong năm**.

Lấy một ví dụ. “Doomsday” của năm 2003 là thứ Sáu, hãy tính thứ của ngày Giáng sinh năm đó. Vì “Doomsday” năm 2003 là thứ Sáu nên ngày 12 tháng 12 cũng là thứ Sáu (như ngày trong mỗi tháng có cùng thứ với “Doomsday” mà ta đã ghi nhớ ở trên), khi đó `12+7*2=26`, ngày 26 tháng 12 cũng là thứ Sáu, nên ngày 25 tháng 12 là thứ Năm.

Vậy câu hỏi đặt ra là, **làm thế nào để biết “Doomsday” của một năm là thứ mấy**?

Trong trường hợp này, cần nhớ rằng thứ của “Doomsday” sẽ tăng 1 sau mỗi năm, và tăng 2 nếu gặp năm nhuận.

Ví dụ, “Doomsday” năm 1900 là thứ Tư, vậy “Doomsday” năm 1901 là thứ Năm (+1), năm 1902 là thứ Sáu (+1), năm 1903 là thứ Bảy (+1), còn năm 1904 (năm nhuận) là “thứ Hai” (+2).
 
Nói cách khác, khi nhớ “Doomsday” năm 1900 là thứ Tư, ta có thể suy ra “Doomsday” của những năm khác là thứ mấy.

Tính từng năm như vậy vẫn khá phiền, có thể chỉ sơ ý một chút là tính sai. Vì vậy, giáo sư Conway chu đáo cung cấp cho chúng ta danh sách dưới đây.

```
6, 11.5, 17, 23, 28, 34, 39.5, 45, 51, 56, 62, 67.5, 73, 79, 84, 90, 95.5
```

Điều đó có nghĩa là nếu “Doomsday” năm 1900 là thứ Tư thì “Doomsday” của các năm 1906, 1917, 1923... cũng là thứ Tư; 11.5 nghĩa là “Doomsday” năm 1911 là thứ Ba (-1), còn “Doomsday” năm 1912 là thứ Năm (+1). Ghi nhớ danh sách này, ta có thể tính được “mốc Doomsday” của mọi năm trong thế kỷ 20.

Nếu một cô gái xinh đẹp nói “sinh nhật của tôi là 1992.9.13”, ta có thể lập tức nói ra thứ của ngày đó. Vì danh sách Conway có số 90, nghĩa là “Doomsday” năm 1990 cũng là thứ Tư, nên “Doomsday” năm 1901 (năm thường) là thứ Năm (+1), “Doomsday” năm 1902 (năm nhuận) là thứ Bảy (+2), vậy 9.5/9.12 cũng là thứ Bảy, và 1992.9.13 là Chủ nhật.
 
Tuy nhiên, **khi năm vượt qua một thế kỷ, danh sách Conway sẽ mất tác dụng**.

Câu hỏi hỏi thứ của ngày 2199.7.2; nếu không biết “Doomsday” của năm 2199 là thứ mấy thì bài này rất khó giải. Với các năm thuộc những thế kỷ khác nhau, không có phương pháp đặc biệt nào để đoán “Doomsday” là thứ mấy. Chỉ có thể rút ra một số quy luật khi biểu diễn các năm chia hết cho 100 dưới dạng lịch.

| Ngày   | Hai   | Ba   | Tư   | Năm   | Sáu   | Bảy   |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 1599 |      | 1600 | 1601 | 1602 |      |      |
| 1700 | 1701 | 1702 | 1703 |      | 1704 | 1705 |
|      | 1796 | 1797 | 1798 | 1799 | 1800 | 1801 |
| 1897 | 1898 | 1899 | 1900 | 1901 | 1902 | 1903 |
| 1999 |      |      | 2000 | 2001 | 2002 | 2003 |
| 2100 | 2101 | 2102 | 2103 |      | 2104 | 2105 |
|      | 2196 | 2197 | 2198 | 2199 | 2200 | 2201 |

Bài toán này nhìn có vẻ đơn giản, nhưng thực ra không chỉ cần hiểu thuật toán Doomsday mà còn phải hiểu sâu mô hình ở trên. Trong lịch ở trên, “Doomsday” của năm 2199 là thứ Năm, nên 2199.7.11/2199.7.4 cũng là thứ Năm, vậy 2199.7.2 là thứ Ba.

Bạn đã cảm nhận được sự tinh tế của thuật toán Doomsday của giáo sư Conway rồi chứ?

## Số nguyên tố Mersenne

Marin Mersenne là một triết gia và tu sĩ người Pháp. Vào thế kỷ 16, trong lĩnh vực số học tồn tại một giả thuyết sai nhưng vẫn được coi là sự thật trong thời gian dài. Theo giả thuyết này, với mọi số nguyên tố p, 2<sup>p</sup>-1 cũng là số nguyên tố. Khi thay các số nguyên tố 2, 5, 7 vào, kết quả đều là số âm.

Nhìn trực quan, giả thuyết cho rằng với số nguyên tố p, 2<sup>p</sup>-1 luôn là số nguyên tố có vẻ đúng. Tuy nhiên, chỉ dựa vào vài kết quả mà phán đoán đúng sai của một mệnh đề là hành vi “vô tri” nhất trong toán học. Kiểu kiểm thử bằng cách thay vào vài biến này thường lấy “ngày nắng” khi chương trình chạy bình thường làm điều kiện tiên quyết; nếu gặp “ngày mưa”, một chương trình chỉ được kiểm thử lỏng lẻo như vậy sẽ phát sinh rất nhiều vấn đề ngoài dự đoán. Logic bên trong của thuật toán phải chặt chẽ, không để Bug có bất kỳ cơ hội nào.

Về sau, người ta chứng minh được rằng khi p là số nguyên tố, kết quả 2<sup>p</sup>-1 không nhất thiết là số nguyên tố. Dù vậy, một số người vẫn tò mò p phải là số nguyên tố như thế nào thì kết quả 2<sup>p</sup>-1 sẽ là số nguyên tố. Để giải đáp sự tò mò này, trong bài luận xuất bản năm 1644, Mersenne đưa ra khẳng định sau:

> “Nếu p là một trong các số 2, 3, 5, 7, 13, 17, 19, 31, 67, 127, 257 thì kết quả của 2<sup>p</sup>-1 là số nguyên tố.”

Mersenne luôn hy vọng biểu diễn được mọi số nguyên tố tồn tại dưới dạng công thức ngắn gọn và súc tích 2<sup>p</sup>-1. Nếu thực sự tìm được một công thức như vậy thì đó sẽ là một phát hiện toán học tuyệt đẹp đến nghẹt thở và vô cùng kỳ diệu. Nhưng giấc mơ của Mersenne đã không thành hiện thực.

Theo thời gian, các nhà toán học đời sau tính toán và đi đến kết luận rằng cần xóa 67 và 257 khỏi giả thuyết của Mersenne, đồng thời thêm 61, 89, 107. Cứ như vậy, mệnh đề từng đơn giản và “hợp lý” “Nếu p là số nguyên tố thì 2<sup>p</sup>-1 cũng là số nguyên tố” biến mất, thay vào đó là những câu lệnh if-else lộn xộn kiểu “khi p bằng giá trị nào đó thì kết quả là số nguyên tố, nếu không thì không phải”, khiến thuật toán ngày càng rối rắm.

Trong lập trình thực tế, nếu các câu lệnh `if-else` ngày càng phức tạp làm ảnh hưởng đến tính đơn giản của chương trình, đến một lúc nào đó programmer sẽ cân nhắc “refactor”; với thuật toán cũng vậy. Về sau, người ta dâng thuật toán tinh gọn mới cho tu sĩ Mersenne, người đã dành cả đời để cầu nguyện và học tập:

> “Nếu khi p là số nguyên tố thì 2<sup>p</sup>-1 cũng là số nguyên tố, thì số nguyên tố này được gọi là số nguyên tố Mersenne.”

## Nước trong cốc có quá nửa không

Trong một căn phòng trống có một chiếc cốc nước hình trụ, đường kính miệng cốc và đáy cốc bằng nhau, bên trong có khoảng nửa cốc nước. Hãy tìm cách xác định nước trong cốc nhiều hơn một nửa hay ít hơn một nửa. Trong căn phòng trống không có bất kỳ dụng cụ hay công cụ nào có thể sử dụng.

Bản thân đáp án rất đơn giản, nhưng số người thực sự giải được lại vô cùng ít. Khi suy nghĩ, đừng xét đến nhiệt độ của căn phòng hay nước, phản ứng hóa học và những cách “phi lý” khác. Ngoài ra, không được uống nước trong cốc.

![water-cup](../images/water-cup.jpg)

Ngay cả khi đọc xong đề mà chưa thể nghĩ ra đáp án ngay, nhưng nhìn hình minh họa là lập tức hiểu, cũng có thể nói là bạn có tư duy lập trình. Nghiêng chiếc cốc sao cho mặt nước vừa chạm miệng cốc, rồi quan sát nước ở đáy cốc là có thể đưa ra đáp án.

Việc viết thuật toán cũng tương tự như vậy. Khi bực bội vì không tìm được điểm đột phá, thậm chí bạn sẽ nghi ngờ liệu bài toán được đưa ra có lời giải hay không. Nhưng sau khi tìm được điểm đột phá, nhìn lại bạn sẽ nhận ra cách giải hóa ra đơn giản đến thế.
