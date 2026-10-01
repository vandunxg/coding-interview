# 《Vẻ đẹp của lập trình》

## 1.2 Bài toán tướng và soái trong cờ tướng Trung Quốc

### Mô tả bài toán

Trong cờ tướng Trung Quốc, “tướng” và “soái” không được đối mặt nhau. Giả sử trên bàn cờ chỉ có hai quân “tướng” `A` và “soái” `B`.

Hai quân A, B bị giới hạn di chuyển trong các ô `3*3` thuộc phía mình. Hãy viết một chương trình, xuất ra tất cả vị trí hợp lệ của A, B. Yêu cầu trong code **chỉ được sử dụng một biến**.

### Cách giải

Khung tổng quát của chương trình như sau:

```
遍历 A 的位置
    遍历 B 的 位置
        判断 A、B 的位置组合是否满足要求，若满足，则输出。
```

Điểm khó của bài toán là làm thế nào chỉ dùng một biến để triển khai.

Với bài toán này, mỗi quân chỉ cần 9 chữ số là có thể biểu diễn toàn bộ vị trí của nó.

```
1   -   2   -   3
|       |       |
4   -   5   -   6
|       |       |
7   -   8   -   9
```

#### Cách giải một

Một kiểu byte 8 bit có thể biểu diễn `2^8=256` giá trị, vì vậy có thể dùng 4 bit đầu để biểu diễn vị trí của A và 4 bit sau để biểu diễn vị trí của B.

```java
public class Solution {

    private final int GRIDW = 3;

    public void printAll() {
        byte b = 1;
        for (b = lSet(b, 1); lGet(b) <= GRIDW * GRIDW; b = lSet(b, lGet(b) + 1)) {
            for (b = rSet(b, 1); rGet(b) <= GRIDW * GRIDW; b = rSet(b, rGet(b) + 1)) {
                if (lGet(b) % GRIDW != rGet(b) % GRIDW) {
                    System.out.println("A=" + lGet(b) + ", B=" + rGet(b));
                }
            }
        }
    }

    public byte lSet(byte b, int x) {
        return (byte) ((b & 0xf) | (x << 4));
    }

    public byte lGet(byte b) {
        return (byte) ((b >>> 4) & 0xf);
    }

    public byte rSet(byte b, int x) {
        return (byte) ((b & 0xf0) | x);
    }

    public byte rGet(byte b) {
        return (byte) (b & 0xf);
    }
}
```

#### Cách giải hai

```java
public class Solution {
     public void printAll() {
        byte b = 81;
        while (b > 0) {
            if (b % 9 % 3 != b / 9 % 3) {
                System.out.println("A=" + (b % 9 + 1) + ", B=" + (b / 9 + 1));
            }
            --b;
        }
    }
}

```

#### Cách giải ba

Đây là một cách giải khác bằng ngôn ngữ C.

```c
#include <stdio.h>

struct {
	unsigned char a;
	unsigned char b;
} i;

int main() {
	for (i.a = 1; i.a <= 9; i.a++) {
		for (i.b = 1; i.b <= 9; i.b++) {
			if (i.a % 3 != i.b % 3) {
				printf("A = %d, B = %d\n", i.a, i.b);
			}
		}
	}
}
```
