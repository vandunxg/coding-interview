# 《剑指 Offer》

## 3.1 Tìm số trùng lặp trong mảng

Nguồn: [AcWing](https://www.acwing.com/problem/content/14/)

### Mô tả bài toán

Cho một mảng số nguyên có độ dài `n`, được gọi là `nums`, mọi số trong mảng đều nằm trong phạm vi `0∼n−1`.

Một số số trong mảng bị lặp, nhưng không biết có bao nhiêu số bị lặp, cũng không biết mỗi số lặp bao nhiêu lần.

Hãy tìm một số bất kỳ bị lặp trong mảng.

**Lưu ý**: nếu một số nào đó không nằm trong phạm vi `0∼n−1`, hoặc mảng không chứa số trùng lặp, hãy trả về `-1`;

**Ví dụ**

```
给定 nums = [2, 3, 5, 4, 3, 2, 6, 7]。

返回 2 或 3。
```

### Cách giải

Từ đề bài, ta biết độ dài mảng là n và mọi số đều nằm trong phạm vi `0~n-1`. Nếu các phần tử không trùng nhau thì mảng phải là `[0, 1, 2, ...n-1]` (giả sử mảng đã được sắp xếp). Nói cách khác, sau khi sắp xếp tăng dần, giá trị phần tử trong mảng phải bằng chỉ số tương ứng, tức là giá trị của phần tử ở chỉ số 0 cũng là 0, và cứ tiếp tục như vậy.

Trước hết, ta có thể duyệt mảng; nếu tồn tại phần tử không nằm trong phạm vi `0~n-1` thì trả về -1 ngay.

Tiếp theo, duyệt lại mảng. Nếu chỉ số `i` khác phần tử `nums[i]` tương ứng, tức `nums[i] != i`, ta nên đổi phần tử `nums[i]` vào vị trí đúng là `nums[i]`. Trước khi đổi, hãy kiểm tra xem hai phần tử `nums[i]` và `nums[nums[i]]` có giống nhau không; nếu giống nhau thì có phần tử trùng lặp, trả về ngay, nếu không thì thực hiện swap. Sau khi đổi, ta cần kiểm tra lại phần tử ở vị trí i, vì vậy ta sử dụng vòng lặp while.

Có thể đối chiếu với phần code bên dưới để hiểu rõ hơn.

```java
class Solution {

    /**
     * 查找数组中的重复元素
     *
     * @param nums 数组
     * @return 其中一个重复的元素
     */
    public int duplicateInArray(int[] nums) {
        int n = nums.length;

        // 若存在数组元素不在[0, n-1] 的范围内，直接返回-1
        for (int num : nums) {
            if (num < 0 || num >= n) {
                return -1;
            }
        }

        for (int i = 0; i < n; ++i) {
            while (nums[i] != i) {
                if (nums[i] == nums[nums[i]]) {
                    // 说明位置i与位置nums[i]上的元素相同，直接返回该重复元素
                    return nums[i];
                }
                swap(nums, i, nums[i]);
            }
        }
        return -1;

    }

    private void swap(int[] nums, int i, int j) {
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
}
```

## 3.2 Tìm số trùng lặp mà không sửa mảng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Cho một mảng có độ dài `n+1`, được gọi là `nums`, mọi số trong mảng đều nằm trong phạm vi `1∼n`, trong đó `n≥1`.

Hãy tìm một số bất kỳ bị lặp trong mảng, nhưng không được sửa mảng đầu vào.

**Ví dụ**

```
给定 nums = [2, 3, 5, 4, 3, 2, 6, 7]。

返回 2 或 3。
```

**Câu hỏi suy nghĩ**: nếu chỉ được sử dụng không gian bổ sung `O(1)` thì phải làm thế nào?

### Cách giải

#### Cách giải một

Tạo một mảng phụ có độ dài `n+1`, sao chép các phần tử của mảng ban đầu vào mảng phụ. Nếu số được sao chép từ mảng ban đầu là `m` thì đặt nó vào vị trí thứ `m` của mảng phụ. Như vậy có thể dễ dàng tìm ra phần tử trùng lặp. Độ phức tạp không gian là `O(n)`.

#### Cách giải hai

Miền giá trị của các phần tử mảng là `[1, n]`; chia đôi miền này thành `[1, middle]`, `[middle+1, n]`. Đếm xem trong mảng có bao nhiêu (count) phần tử nằm trong đoạn `[1, middle]`. Nếu count lớn hơn middle-1+1 thì chứng tỏ trong phạm vi này có phần tử trùng lặp, nếu không thì phần tử trùng lặp nằm trong phạm vi còn lại. Tiếp tục chia đôi phạm vi này và tiếp tục đếm số phần tử trong đoạn.

Độ phức tạp thời gian là `O(n * log n)`, độ phức tạp không gian là `O(1)`.

Lưu ý, phương pháp này không thể tìm ra tất cả các phần tử trùng lặp.

```java
class Solution {

    /**
     * 不修改数组查找重复的元素，没有则返回0
     *
     * @param nums 数组
     * @return 重复的元素
     */
    public int duplicateInArray(int[] nums) {
        if (nums == null || nums.length < 2) {
            return 0;
        }
        int start = 1, end = nums.length - 1;
        while (start <= end) {
            int mid = start + ((end - start) >> 1);
            int cnt = getCountRange(nums, start, mid);
            if (start == end) {
                if (cnt > 1) {
                    // 找到重复的数字
                    return start;
                }
                break;
            }
            if (cnt > mid - start + 1) {
                end = mid;
            } else {
                start = mid + 1;
            }
        }
        return 0;
    }

    /**
     * 计算整个数组中有多少个数的取值在[from, to] 之间
     *
     * @param nums 数组
     * @param from 左边界
     * @param to 右边界
     * @return 数量
     */
    private int getCountRange(int[] nums, int from, int to) {
        int cnt = 0;
        for (int e : nums) {
            if (e >= from && e <= to) {
                ++cnt;
            }
        }
        return cnt;
    }
}
```

## 4 Tìm kiếm trong mảng hai chiều

Nguồn: [AcWing](https://www.acwing.com/problem/content/16/)

### Mô tả bài toán

Trong một mảng hai chiều, mỗi hàng được sắp xếp theo thứ tự tăng dần từ trái sang phải, mỗi cột được sắp xếp theo thứ tự tăng dần từ trên xuống dưới.

Hãy hoàn thành một hàm nhận vào một mảng hai chiều như vậy và một số nguyên, rồi phán đoán xem mảng có chứa số nguyên đó hay không.

**Ví dụ**

```
输入数组：

[
  [1,2,8,9]，
  [2,4,9,12]，
  [4,7,10,13]，
  [6,8,11,15]
]

如果输入查找数值为7，则返回true，

如果输入查找数值为5，则返回false。
```

### Cách giải

Bắt đầu tìm kiếm từ góc trên bên phải của mảng hai chiều:

- Nếu giá trị phần tử bằng `target`, trả về `true`;
- Nếu giá trị phần tử lớn hơn `target`, loại bỏ cột này, tức `--j`;
- Nếu giá trị phần tử nhỏ hơn `target`, loại bỏ hàng này, tức `++i`.

Cũng có thể bắt đầu tìm kiếm từ góc dưới bên trái của mảng hai chiều; đoạn code dưới đây sử dụng góc dưới bên trái làm điểm bắt đầu tìm kiếm.

Lưu ý, không thể chọn số ở góc trên bên trái hoặc góc dưới bên phải, vì như vậy không thể thu hẹp phạm vi tìm kiếm.

```java
class Solution {

    /**
     * 二维数组中的查找
     *
     * @param array 二维数组
     * @param target 要查找的值
     * @return 是否找到该值
     */
    public boolean searchArray(int[][] array, int target) {
        if (array == null || array.length < 1) {
            return false;
        }
        int m = array.length, n = array[0].length;
        int i = 0, j = n - 1;
        while (i < m && j >= 0) {
            if (array[i][j] == target) {
                return true;
            }
            if (array[i][j] < target) {
                ++i;
            } else {
                --j;
            }
        }
        return false;
    }
}
```

## 5 Thay thế khoảng trắng

Nguồn: [AcWing](https://www.acwing.com/problem/content/17/)

### Mô tả bài toán

Hãy thực hiện một hàm thay mỗi khoảng trắng trong chuỗi bằng `"%20"`.

Có thể giả định độ dài chuỗi đầu vào lớn nhất là `1000`.
Lưu ý độ dài chuỗi đầu ra có thể lớn hơn `1000`.

**Ví dụ**

```
输入："We are happy."

输出："We%20are%20happy."
```

### Cách giải

#### Cách giải một

Sử dụng regular expression để khớp và thay thế.

```java
class Solution {

    /**
     * 将字符串中的所有空格替换为%20
     *
     * @param str 字符串
     * @return 替换后的字符串
     */
    public String replaceSpaces(StringBuffer str) {
        return str == null ? null : str.toString().replaceAll(" ", "%20");
    }
}
```

#### Cách giải hai

Trước hết duyệt chuỗi ban đầu; khi gặp khoảng trắng, dùng `append` thêm tùy ý hai ký tự vào cuối chuỗi ban đầu, chẳng hạn hai khoảng trắng.

Dùng con trỏ `i` trỏ tới cuối chuỗi ban đầu và `j` trỏ tới cuối chuỗi hiện tại; `i`, `j` duyệt từ sau về trước. Khi `i` gặp khoảng trắng, các vị trí `j` lần lượt được gán `'0','2','%'`; nếu không phải khoảng trắng thì gán trực tiếp ký tự mà `i` đang trỏ tới.

**Mở rộng ý tưởng:**

Khi hợp nhất hai mảng (bao gồm cả chuỗi), nếu sao chép từng số (hoặc ký tự) từ trước ra sau khiến các số (hoặc ký tự) phải di chuyển lặp lại nhiều lần, ta có thể cân nhắc sao chép **từ sau ra trước**; như vậy sẽ giảm số lần di chuyển và nâng cao hiệu suất.

```java
class Solution {

    /**
     * 将字符串中的所有空格替换为%20
     *
     * @param str 字符串
     * @return 替换后的字符串
     */
    public String replaceSpaces(StringBuffer str) {
        if (str == null) {
            return null;
        }

        int len = str.length();
        for (int i = 0; i < len; ++i) {
            if (str.charAt(i) == ' ') {
                str.append("  ");
            }
        }

        int i = len - 1, j = str.length() - 1;
        for (; i >= 0; --i) {
            char ch = str.charAt(i);
            if (ch == ' ') {
                str.setCharAt(j--, '0');
                str.setCharAt(j--, '2');
                str.setCharAt(j--, '%');
            } else {
                str.setCharAt(j--, ch);
            }
        }
        return str.toString();
    }
}
```

## 6 In danh sách liên kết từ cuối về đầu

Nguồn: [AcWing](https://www.acwing.com/problem/content/18/)

### Mô tả bài toán

Nhập node đầu của một linked list, trả về giá trị các node theo thứ tự **từ cuối về đầu**.

Lưu kết quả trả về bằng một mảng.

**Ví dụ**

```
输入：[2, 3, 5]
返回：[5, 3, 2]
```

### Cách giải

Duyệt linked list, `push` giá trị của từng node vào stack, cuối cùng lần lượt `pop` các phần tử trong stack vào mảng.

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {

    /**
     * 从尾到头打印链表
     *
     * @param head 链表头结点
     * @return 结果数组
     */
    public int[] printListReversingly(ListNode head) {
        if (head == null) {
            return null;
        }
        Stack<Integer> stack = new Stack<>();
        ListNode cur = head;
        int cnt = 0;
        while (cur != null) {
            stack.push(cur.val);
            cur = cur.next;
            ++cnt;
        }

        int[] res = new int[cnt];
        int i = 0;
        while (!stack.isEmpty()) {
            res[i++] = stack.pop();
        }
        return res;
    }
}
```

## 7 Dựng lại cây nhị phân

Nguồn: [AcWing](https://www.acwing.com/problem/content/23/)

### Mô tả bài toán

Cho kết quả duyệt trước và duyệt giữa của một cây nhị phân, hãy dựng lại cây nhị phân đó.

**Ví dụ**

```
给定：
前序遍历是：[3, 9, 20, 15, 7]
中序遍历是：[9, 3, 15, 20, 7]

返回：[3, 9, 20, null, null, 15, 7, null, null, null, null]
返回的二叉树如下所示：
    3
   / \
  9  20
    /  \
   15   7
```

### Cách giải

Trong dãy duyệt trước của cây nhị phân, số đầu tiên luôn là giá trị của node gốc. Trong dãy duyệt giữa, giá trị node gốc nằm ở giữa dãy; các node của cây con trái nằm bên trái node gốc, còn các node của cây con phải nằm bên phải giá trị node gốc.

Duyệt dãy duyệt giữa để tìm node gốc, rồi đệ quy dựng cây con trái và cây con phải.

Lưu ý thêm các điều kiện `if` cho trường hợp đặc biệt.

```java
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {

    /**
     * 重建二叉树
     *
     * @param preorder 前序遍历序列
     * @param inorder 中序遍历序列
     * @return 二叉树根结点
     */
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder == null || inorder == null || preorder.length == 0 || preorder.length != inorder.length) {
            return null;
        }

        return build(preorder, inorder, 0, preorder.length - 1, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int[] inorder, int s1, int e1, int s2, int e2) {
        int rootVal = preorder[s1];
        TreeNode root = new TreeNode(rootVal);
        if (s1 == e1) {
            return root;
        }

        int i = s2, cnt = 0;
        for (; i <= e2; ++i) {
            if (inorder[i] == rootVal) {
                break;
            }
            ++cnt;
        }

        root.left = cnt > 0 ? build(preorder, inorder, s1 + 1, s1 + cnt, s2, i - 1) : null;
        root.right = i < e2 ? build(preorder, inorder, s1 + cnt + 1, e1, i + 1, e2) : null;
        return root;
    }
}
```

## 8 Node tiếp theo của cây nhị phân

Nguồn: [AcWing](https://www.acwing.com/problem/content/31/)

### Mô tả bài toán

Cho một node bất kỳ của cây nhị phân, hãy tìm node tiếp theo của nó trong dãy duyệt giữa.

**Lưu ý:**

- Nếu node được cho là node cuối cùng trong dãy duyệt giữa thì trả về node rỗng;
- Cây nhị phân chắc chắn không rỗng, và node được cho chắc chắn không phải node rỗng.

**Ví dụ**

```
假定二叉树是：[2, 1, 3, null, null, null, null]， 给出的是值等于 2 的节点。

则应返回值等于 3 的节点。

解释：该二叉树的结构如下，2 的后继节点是 3。
  2
 / \
1   3
```

### Cách giải

Với node `p`:

- Nếu nó có cây con phải thì **node ngoài cùng bên trái của cây con phải** là node tiếp theo của nó;
- Nếu nó không có cây con phải, hãy xét vị trí của nó so với node cha `p.father`:
  - Nếu nó là con trái của node cha thì node cha `p.father` là node tiếp theo của nó;
  - Nếu nó là con phải của node cha thì liên tục tìm lên trên cho đến khi tìm được một node là con trái của node cha của nó; khi đó node cha đó là node tiếp theo của `p`.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode father;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {

    /**
     * 获取二叉树中序遍历结点的下一个结点
     *
     * @param p 某结点
     * @return p的下一个结点
     */
    public TreeNode inorderSuccessor(TreeNode p) {
        if (p == null) {
            return null;
        }

        TreeNode cur = p.right;

        // 右子树不为空
        if (cur != null) {
            while (cur.left != null) {
                cur = cur.left;
            }
            return cur;
        }

        // 右子树为空
        TreeNode father = p.father;
        while (father != null && father.left != p) {
            p = father;
            father = p.father;
        }
        return father;
    }
}
```

## 9.1 Dùng hai stack để triển khai queue

Nguồn: [AcWing](https://www.acwing.com/problem/content/36/)

### Mô tả bài toán

Hãy dùng stack để triển khai một queue, hỗ trợ bốn thao tác sau:

- push(x) – chèn phần tử x vào cuối queue.
- pop(x) – lấy phần tử đầu queue ra và trả về phần tử đó.
- peek() – trả về phần tử đầu queue.
- empty() – trả về queue có rỗng hay không.

**Lưu ý:**

- Chỉ được sử dụng các thao tác chuẩn của stack: `push to top`, `peek/pop from top`, `size` và `is empty`;
- Nếu ngôn ngữ lập trình bạn chọn không có thư viện stack, có thể dùng list hoặc deque để mô phỏng các thao tác của stack;
- Dữ liệu đầu vào được đảm bảo hợp lệ, chẳng hạn khi queue rỗng sẽ không thực hiện các thao tác `pop` hoặc `peek`;

**Ví dụ**

```java
MyQueue queue = new MyQueue();

queue.push(1);
queue.push(2);
queue.peek();  // returns 1
queue.pop();   // returns 1
queue.empty(); // returns false
```

### Cách giải

Với thao tác `push`, mỗi lần lưu vào `s1`;
Với thao tác `pop`, mỗi lần lấy từ `s2`:

- Khi stack `s2` không rỗng thì không được đổ các phần tử của `s1` vào;
- Khi stack `s2` rỗng thì cần đổ toàn bộ các phần tử của `s1` vào một lần.

```java
class MyQueue {

    private Stack<Integer> s1;
    private Stack<Integer> s2;

    /** Initialize your data structure here. */
    public MyQueue() {
        s1 = new Stack<>();
        s2 = new Stack<>();
    }

    /** Push element x to the back of queue. */
    public void push(int x) {
        s1.push(x);
    }

    /** Removes the element from in front of queue and returns that element. */
    public int pop() {
        int t = peek();
        s2.pop();
        return t;
    }

    /** Get the front element. */
    public int peek() {
        if (s2.isEmpty()) {
            while (!s1.isEmpty()) {
                s2.push(s1.pop());
            }
        }
        return s2.peek();
    }

    /** Returns whether the queue is empty. */
    public boolean empty() {
        return s1.isEmpty() && s2.isEmpty();
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```

## 9.2 Dùng hai queue để triển khai stack

Nguồn: [LeetCode](https://leetcode.cn/problems/implement-stack-using-queues/)

### Mô tả bài toán

Dùng queue để triển khai các thao tác sau của stack:

- push(x) -- đưa phần tử x vào stack
- pop() -- xóa phần tử trên cùng của stack
- top() -- lấy phần tử trên cùng của stack
- empty() -- trả về stack có rỗng hay không

**Lưu ý:**

- Chỉ được sử dụng các thao tác cơ bản của queue -- tức là các thao tác `push to back`, `peek/pop from front`, `size` và `is empty` là hợp lệ.
- Ngôn ngữ bạn sử dụng có thể không hỗ trợ queue. Bạn có thể dùng list hoặc deque (hàng đợi hai đầu) để mô phỏng một queue, miễn là chỉ dùng các thao tác chuẩn của queue.
- Có thể giả định mọi thao tác đều hợp lệ (chẳng hạn không gọi thao tác pop hoặc top trên stack rỗng).

### Cách giải

- Khi pop, lần lượt chuyển các phần tử của queue sang queue còn lại cho đến khi queue chỉ còn một phần tử. Sau đó đưa phần tử này ra khỏi queue.
- Khi push, đưa phần tử vào queue không rỗng. Nếu cả hai queue đều rỗng thì đưa vào queue bất kỳ.

```java
class MyStack {

    private Queue<Integer> q1;
    private Queue<Integer> q2;

    /** Initialize your data structure here. */
    public MyStack() {
        q1 = new LinkedList<>();
        q2 = new LinkedList<>();
    }

    /** Push element x onto stack. */
    public void push(int x) {
        if (empty() || q2.isEmpty()) {
            q1.offer(x);
        } else {
            q2.offer(x);
        }
    }

    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        if (q1.isEmpty()) {
            while (q2.size() > 1) {
                q1.offer(q2.poll());
            }
            return q2.poll();
        }

        while (q1.size() > 1) {
            q2.offer(q1.poll());
        }
        return q1.poll();
    }

    /** Get the top element. */
    public int top() {
        int val = pop();
        push(val);
        return  val;
    }

    /** Returns whether the stack is empty. */
    public boolean empty() {
        return q1.isEmpty() && q2.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

## 10.1 Dãy Fibonacci

Nguồn: [AcWing](https://www.acwing.com/problem/content/19/)

### Mô tả bài toán

Nhập một số nguyên n, tìm số hạng thứ n của dãy Fibonacci.

Giả sử bắt đầu từ 0, số hạng thứ 0 là 0. `(n<=39)`

**Ví dụ**

```
输入整数 n=5

返回 5
```

### Cách giải

#### Cách giải một

Dùng đệ quy, ngắn gọn và dễ hiểu nhưng hiệu suất rất thấp vì có nhiều phép tính lặp lại.

```
                  f(10)
               /        \
            f(9)         f(8)
          /     \       /    \
       f(8)     f(7)  f(7)   f(6)
      /   \     /   \
   f(7)  f(6)  f(6) f(5)
```

```java
class Solution {

    /**
     * 求斐波那契数列的第n项，n从0开始
     *
     * @param n 第n项
     * @return 第n项的值
     */
    public int Fibonacci(int n) {
        if (n < 2) {
            return n;
        }
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
}
```

#### Cách giải hai

Tính từ dưới lên và dùng công thức truy hồi, độ phức tạp thời gian là `O(n)`. Có thể dùng mảng để lưu kết quả, độ phức tạp không gian là `O(n)`; cũng có thể dùng biến để lưu kết quả, độ phức tạp không gian là `O(1)`.

```java
class Solution {

    /**
     * 求斐波那契数列的第n项，n从0开始
     *
     * @param n 第n项
     * @return 第n项的值
     */
    public int Fibonacci(int n) {
        if (n < 2) {
            return n;
        }

        int a = 1, b = 1;
        for (int i = 2; i < n; ++i) {
            b = a + b;
            a = b - a;
        }
        return b;
    }
}
```

## 10.2 Nhảy bậc thang

Nguồn: [NowCoder](https://www.nowcoder.com/practice/8c82a5b80378478f9484d87d1c5f12a4?tpId=13&tqId=11161&tPage=1&rp=1&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)

### Mô tả bài toán

Một con ếch mỗi lần có thể nhảy lên `1` bậc hoặc `2` bậc. Hãy tính tổng số cách để con ếch nhảy lên bậc thứ `n` (thứ tự trước sau khác nhau được tính là các kết quả khác nhau).

### Cách giải

Để nhảy lên bậc `n`, có thể từ bậc `n-1` nhảy lên `1` bậc, cũng có thể từ bậc `n-2` nhảy lên `2` bậc. Vì vậy

```
f(n) = f(n-1) + f(n-2)
```

```java
class Solution {

    /**
     * 青蛙跳台阶
     *
     * @param target 跳上的那一级台阶
     * @return 多少种跳法
     */
    public int JumpFloor(int target) {
        if (target < 3) {
            return target;
        }
        int a = 1, b = 2;
        for (int i = 3; i <= target; ++i) {
            b = a + b;
            a = b - a;
        }
        return b;
    }
}
```

## 10.3 Nhảy bậc thang biến thể

Nguồn: [NowCoder](https://www.nowcoder.com/practice/22243d016f6b47f2a6928b4313c85387?tpId=13&tqId=11162&tPage=1&rp=1&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)

### Mô tả bài toán

Một con ếch mỗi lần có thể nhảy lên `1` bậc, cũng có thể nhảy lên `2` bậc… Nó cũng có thể nhảy lên `n` bậc. Hãy tính tổng số cách để con ếch nhảy lên bậc thứ `n`.

### Cách giải

#### Cách giải một: Suy luận toán học

Để nhảy lên bậc `n-1`, có thể từ bậc `n-2` nhảy lên `1` bậc, cũng có thể từ bậc `n-3` nhảy lên `2` bậc... do đó

```
f(n-1) = f(n-2) + f(n-3) + ... + f(0)
```

Để nhảy lên bậc `n`, có thể từ bậc `n-1` nhảy lên `1` bậc, cũng có thể từ bậc `n-2` nhảy lên `2` bậc... do đó

```
f(n) = f(n-1) + f(n-2) + ... + f(0)
```

Suy ra

```
f(n) - f(n-1) = f(n-1)
```

Tức là

```
f(n) = 2*f(n-1)
```

Vì vậy f(n) là một cấp số nhân

```java
class Solution {

    /**
     * 青蛙跳台阶II
     *
     * @param target 跳上的那一级台阶
     * @return 多少种跳法
     */
    public int JumpFloorII(int target) {
        return (int) Math.pow(2, target - 1);
    }
}
```

**Lưu ý**, cách giải này đã được đóng góp đồng bộ cho kho mã nguồn mở [CS-Notes](https://github.com/CyC2018/CS-Notes/pull/496).

#### Cách giải hai: Quy hoạch động

Mỗi khi tính res[i], cộng dồn toàn bộ các kết quả phía trước.

```java
class Solution {

    /**
     * 青蛙跳台阶II
     *
     * @param target 跳上的那一级台阶
     * @return 多少种跳法
     */
    public int JumpFloorII(int target) {
        if (target < 3) {
            return target;
        }
        int[] res = new int[target + 1];
        Arrays.fill(res, 1);
        for (int i = 2; i <= target; ++i) {
            for (int j = 1; j < i; ++j) {
                res[i] += res[j];
            }
        }
        return res[target];
    }
}
```

## 10.4 Phủ hình chữ nhật

Nguồn: [NowCoder](https://www.nowcoder.com/practice/72a5a919508a4251859fb2cfb987a0e6?tpId=13&tqId=11163&tPage=1&rp=1&ru=%2Fta%2Fcoding-interviews&qru=%2Fta%2Fcoding-interviews%2Fquestion-ranking)

### Mô tả bài toán

Có thể dùng các hình chữ nhật nhỏ `2*1` đặt ngang hoặc dọc để phủ một hình chữ nhật lớn hơn. Hỏi có bao nhiêu cách dùng `n` hình chữ nhật nhỏ `2*1` để phủ không chồng lấp một hình chữ nhật lớn `2*n`?

### Cách giải

Để phủ hình chữ nhật `2*n`:

- Có thể phủ hình chữ nhật `2*n-1` trước, rồi phủ thêm một hình chữ nhật `2*1`;
- Cũng có thể phủ hình chữ nhật `2*(n-2)` trước, rồi phủ thêm hai hình chữ nhật `1*2`.

#### Cách giải một: dùng mảng lưu kết quả

```java
class Solution {

    /**
     * 矩形覆盖
     *
     * @param target 2*target大小的矩形
     * @return 多少种覆盖方法
     */
    public int RectCover(int target) {
        if (target < 3) {
            return target;
        }
        int[] res = new int[target + 1];
        res[1] = 1;
        res[2] = 2;
        for (int i = 3; i <= target; ++i) {
            res[i] = res[i - 1] + res[i - 2];
        }
        return res[target];
    }
}
```

#### Cách giải hai: trực tiếp dùng biến lưu kết quả

```java
class Solution {

    /**
     * 矩形覆盖
     *
     * @param target 2*target大小的矩形
     * @return 多少种覆盖方法
     */
    public int RectCover(int target) {
        if (target < 3) {
            return target;
        }
        int a = 1, b = 2;
        for (int i = 3; i <= target; ++i) {
            b = a + b;
            a = b - a;
        }
        return b;
    }
}
```

## 11 Số nhỏ nhất trong mảng xoay

Nguồn: [AcWing](https://www.acwing.com/problem/content/20/)

### Mô tả bài toán

Di chuyển một số phần tử đầu tiên của mảng ra cuối mảng được gọi là phép xoay mảng.

Nhập một phép xoay của mảng tăng dần, xuất phần tử nhỏ nhất của mảng xoay.

Ví dụ, mảng {3,4,5,1,2} là một phép xoay của {1,2,3,4,5}, giá trị nhỏ nhất của mảng này là 1.

Mảng có thể chứa các phần tử trùng lặp.

**Lưu ý**: các phần tử trong mảng không âm; nếu kích thước mảng là 0 thì trả về -1.

**Ví dụ**

```
输入：nums=[2,2,2,0,1]

输出：0
```

### Cách giải

#### Cách giải một

Duyệt trực tiếp mảng để tìm giá trị nhỏ nhất, độ phức tạp thời gian `O(n)`, không khuyến nghị.

```java
class Solution {

    /**
     * 获取旋转数组的最小元素
     *
     * @param nums 旋转数组
     * @return 数组中的最小值
     */
    public int findMin(int[] nums) {
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int min = nums[0];
        int n = nums.length;
        if (min < nums[n - 1]) {
            return min;
        }
        for (int i = 1; i < n; ++i) {
            min = Math.min(min, nums[i]);
        }
        return min;
    }
}
```

#### Cách giải hai

Dùng hai con trỏ `start`, `end` trỏ vào đầu và cuối mảng. Nếu `nums[start] < nums[end]`, chứng tỏ mảng tăng dần, trả về trực tiếp `nums[start]`. Nếu không thì thảo luận như sau.

Tính con trỏ giữa `mid`:

- Nếu lúc này `nums[start]`, `nums[end]`, `nums[mid]` đôi một bằng nhau thì không thể dùng phương pháp chia đôi, chỉ có thể duyệt đoạn `[start,end)` để lấy giá trị nhỏ nhất;
- Nếu lúc này `start`, `end` liền kề thì chứng tỏ phần tử mà `end` trỏ tới là giá trị nhỏ nhất, trả về `nums[end]`;
- Nếu lúc này `nums[mid] >= nums[start]`, chứng tỏ `mid` nằm trong mảng tăng dần bên trái, giá trị nhỏ nhất nằm bên phải; do đó đưa `start` tới `mid`, đồng thời vẫn giữ `start` trỏ vào mảng con tăng dần bên trái;
- Nếu lúc này `nums[mid] <= nums[end]`, chứng tỏ `mid` nằm trong mảng tăng dần bên phải, giá trị nhỏ nhất nằm bên trái; do đó đưa `end` tới `mid`, đồng thời vẫn giữ `end` trỏ vào mảng con tăng dần bên phải.

```java
/**
 * @author bingo
 * @since 2018/12/17
 */

class Solution {

    /**
     * 获取旋转数组的最小元素
     *
     * @param nums 旋转数组
     * @return 数组中的最小值
     */
    public int findMin(int[] nums) {
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int start = 0, end = nums.length - 1;

        if (nums[start] < nums[end]) {
            // 说明这是一个单调递增数组
            return nums[start];
        }
        while (end - start > 1) {
            int mid = start + ((end - start) >> 1);
            if (nums[start] == nums[end] && nums[mid] == nums[start]) {
                // 三个数都相等，只能在[start, end)区间遍历，找出最小值
                return findMin(nums, start, end);
            }
            if (nums[mid] >= nums[start]) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return nums[end];
    }

    private int findMin(int[] nums, int start, int end) {
        int min = Integer.MAX_VALUE;
        for (int i = start; i < end; ++i) {
            min = Math.min(min, nums[i]);
        }
        return min;
    }
}
```

## 12 Đường đi trong ma trận

Nguồn: [AcWing](https://www.acwing.com/problem/content/21/)

### Mô tả bài toán

Hãy thiết kế một hàm để phán đoán xem trong một ma trận có tồn tại một đường đi chứa tất cả các ký tự của một chuỗi hay không.

Đường đi có thể bắt đầu từ bất kỳ ô nào trong ma trận; mỗi bước có thể di chuyển một ô trong ma trận sang trái, phải, lên hoặc xuống.

Nếu một đường đi đã đi qua một ô nào đó trong ma trận thì sau đó không được đi vào ô này lần nữa.

**Lưu ý**:

- Đường đi đầu vào không rỗng;
- Tất cả ký tự xuất hiện đều là chữ cái tiếng Anh in hoa.

**Ví dụ**

```
matrix=
[
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]

str="BCCE" , return "true"

str="ASAE" , return "false"
```

### Cách giải

Phương pháp quay lui. Trước hết, chọn tùy ý một ô làm điểm bắt đầu của đường đi. Giả sử ký tự tương ứng với ô là ch và là ký tự thứ i trên đường đi. Nếu bằng nhau thì tìm ký tự thứ i+1 trên đường đi ở các ô lân cận. Lặp lại quá trình này.

```java
class Solution {

    /**
     * 判断矩阵中是否包含某条路径
     *
     * @param matrix 矩阵
     * @param str 路径
     * @return 是否包含某条路径
     */
    public boolean hasPath(char[][] matrix, String str) {
        if (matrix ==  null || matrix.length == 0 || str == null) {
            return false;
        }

        int m = matrix.length, n = matrix[0].length;

        boolean[][] visited = new boolean[m][n];
        int pathLength = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (hasPath(matrix, str, i, j, visited, pathLength)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean hasPath(char[][] matrix, String str, int i, int j, boolean[][] visited, int pathLength) {
        if (pathLength == str.length()) {
            return true;
        }
        boolean hasPath = false;
        if (i >= 0 && i < matrix.length && j >= 0 && j < matrix[0].length
                && !visited[i][j] && matrix[i][j] == str.charAt(pathLength)) {
            ++pathLength;
            visited[i][j] = true;
            hasPath = hasPath(matrix, str, i + 1, j, visited, pathLength)
                    || hasPath(matrix, str, i - 1, j, visited, pathLength)
                    || hasPath(matrix, str, i, j + 1, visited, pathLength)
                    || hasPath(matrix, str, i, j - 1, visited, pathLength);
            if (!hasPath) {
                --pathLength;
                visited[i][j] = false;
            }
        }
        return hasPath;
    }
}
```

## 13 Phạm vi di chuyển của robot

Nguồn: [AcWing](https://www.acwing.com/problem/content/22/)

### Mô tả bài toán

Trên mặt đất có một lưới gồm m hàng và n cột.

Một robot bắt đầu di chuyển từ ô có tọa độ `0,0`; mỗi lần chỉ có thể di chuyển một ô theo một trong bốn hướng trái, phải, lên, xuống.

Tuy nhiên robot không thể đi vào ô có tổng các chữ số của tọa độ hàng và tọa độ cột lớn hơn k.

Hỏi robot có thể đi tới bao nhiêu ô?

**Ví dụ 1**

```
输入：k=7, m=4, n=5

输出：20
```

**Ví dụ 2**

```
输入：k=18, m=40, n=40

输出：1484

解释：当k为18时，机器人能够进入方格（35,37），因为3+5+3+7 = 18。
      但是，它不能进入方格（35,38），因为3+5+3+8 = 19。
```

**Lưu ý**:

1. 0<=m<=50
2. 0<=n<=50
3. 0<=k<=100

### Cách giải

Bắt đầu di chuyển từ tọa độ (0, 0). Khi chuẩn bị đi vào tọa độ (i, j), hãy kiểm tra xem có thể đi vào hay không; nếu có thì tiếp tục kiểm tra bốn ô lân cận (i-1, j), (i+1, j), (i, j-1), (i, j+1) có thể đi vào hay không.

```java
class Solution {

    /**
     * 计算能到达的格子数
     *
     * @param threshold 限定的数字
     * @param rows 行数
     * @param cols 列数
     * @return 能到达的格子数
     */
    public int movingCount(int threshold, int rows, int cols) {
        boolean[][] visited = new boolean[rows][cols];
        return getCount(threshold, rows, cols, 0, 0, visited);
    }

    private int getCount(int threshold, int rows, int cols, int i, int j, boolean[][] visited) {
        if (check(threshold, rows, cols, i, j, visited)) {
            visited[i][j] = true;
            return 1 + getCount(threshold, rows, cols, i + 1, j, visited)
                    + getCount(threshold, rows, cols, i - 1, j, visited)
                    + getCount(threshold, rows, cols, i, j + 1, visited)
                    + getCount(threshold, rows, cols, i, j - 1, visited);
        }
        return 0;
    }

    private boolean check(int threshold, int rows, int cols, int i, int j, boolean[][] visited) {
        return i >= 0 && i < rows && j >= 0 && j < cols
                && !visited[i][j] && (getDigitSum(i) + getDigitSum(j) <= threshold);
    }

    private int getDigitSum(int val) {
        int sum = 0;
        while (val > 0) {
            sum += (val % 10);
            val /= 10;
        }
        return sum;
    }
}
```

## 14 Cắt dây

Nguồn: [AcWing](https://www.acwing.com/problem/content/24/)

### Mô tả bài toán

Cho một sợi dây dài n, hãy cắt sợi dây thành m đoạn (m, n đều là số nguyên, n>1 và m≥1).

Độ dài mỗi đoạn dây lần lượt được ký hiệu là `k[0]、k[1]、……、k[m]`. Tích lớn nhất có thể có của `k[0]k[1] … k[m]` là bao nhiêu?

Ví dụ, khi độ dài sợi dây là 8, cắt thành ba đoạn có độ dài lần lượt là 2, 3, 3 thì nhận được tích lớn nhất là 18.

**Ví dụ**

```
输入：8

输出：18
```

### Cách giải

#### Cách giải một: Quy hoạch động

Độ phức tạp thời gian `O(n²)`, độ phức tạp không gian `O(n)`.

```
f(n) = max{f(n), f(i) * f(n - i)}, i = 1,2..n-1
```

- Với độ dài 2, chỉ có thể cắt thành hai đoạn độ dài 1, do đó f(2)=1
- Với độ dài 3, cắt thành hai đoạn có độ dài lần lượt là 1 và 2 sẽ cho tích lớn hơn, do đó f(3) = 2
- Với độ dài n, khi cắt nhát đầu tiên có n-1 lựa chọn; các đoạn dây cắt ra lại có thể tiếp tục được cắt. Có thể thấy bài toán ban đầu có thể chia thành các bài toán con, và các bài toán con lại có bài toán con trùng lặp.

```java
class Solution {

    /**
     * 剪绳子求最大乘积
     *
     * @param length 绳子长度
     * @return 乘积最大值
     */
    public int maxProductAfterCutting(int length) {
        if (length < 4) {
            return length - 1;
        }

        int[] res = new int[length + 1];
        res[1] = 1;
        res[2] = 2;
        res[3] = 3;
        for (int i = 4; i <= length; ++i) {
            for (int j = 1; j < i / 2 + 1; ++j) {
                res[i] = Math.max(res[i], res[j] * res[i - j]);
            }
        }
        return res[length];
    }
}
```

#### Thuật toán tham lam

Độ phức tạp thời gian `O(1)`, độ phức tạp không gian `O(1)`.

Chiến lược tham lam:

- Khi n>=5, cố gắng cắt được càng nhiều đoạn dây có độ dài 3 càng tốt
- Khi độ dài dây còn lại là 4, cắt dây thành hai đoạn có độ dài 2.

**Chứng minh:**

- Khi n>=5, có thể chứng minh 2(n-2)>n và 3(n-3)>n. Nói cách khác, khi độ dài dây còn lại lớn hơn hoặc bằng 5, có thể cắt thành các đoạn dây có độ dài 3 hoặc 2.
- Khi n>=5, 3(n-3)>=2(n-2), do đó nên cố gắng cắt được càng nhiều đoạn dây có độ dài 3 càng tốt.
- Khi n=4, cắt thành hai dây có độ dài 2 thực ra không cần thiết; chỉ là đề bài yêu cầu phải cắt ít nhất một nhát.

```java
class Solution {

    /**
     * 剪绳子求最大乘积
     *
     * @param length 绳子长度
     * @return 乘积最大值
     */
    public int maxProductAfterCutting(int length) {
        if (length < 4) {
            return length - 1;
        }

        int timesOf3 = length / 3;
        if (length % 3 == 1) {
            --timesOf3;
        }
        int timesOf2 = (length - timesOf3 * 3) >> 1;
        return (int) (Math.pow(2, timesOf2) * Math.pow(3, timesOf3));
    }
}
```

## 15 Số lượng 1 trong biểu diễn nhị phân

Nguồn: [AcWing](https://www.acwing.com/problem/content/25/)

### Mô tả bài toán

Nhập một số nguyên 32 bit, xuất số lượng chữ số 1 trong biểu diễn nhị phân của số đó.

**Lưu ý**:

- Số âm được biểu diễn trong máy tính bằng phần bù của giá trị tuyệt đối của nó.

**Ví dụ 1**

```
输入：9
输出：2
解释：9的二进制表示是1001，一共有2个1。
```

**Ví dụ 2**

```
输入：-2
输出：31
解释：-2在计算机里会被表示成11111111111111111111111111111110，
      一共有31个1。
```

### Cách giải

#### Cách giải một

Dùng số nguyên 1, lần lượt dịch trái rồi thực hiện phép AND với n; nếu kết quả khác 0 thì chứng tỏ bit này là 1, tăng cnt.

Trong cách giải này, i cần được dịch trái 32 lần.

Không được dịch phải n rồi thực hiện phép AND với 1, vì n có thể là số âm và sẽ rơi vào vòng lặp vô hạn khi dịch phải.

```java
class Solution {

    /**
     * 求二进制中1的个数
     *
     * @param n 整数
     * @return 该整数的二进制中1的个数
     */
    public int NumberOf1(int n) {
        int i = 1;
        int cnt = 0;
        while (i != 0) {
            if ((n & i) != 0) {
                ++cnt;
            }
            i <<= 1;
        }
        return cnt;
    }
}
```

#### Cách giải hai (khuyến nghị)

Thực hiện phép `(n - 1) & n` cho đến khi n bằng 0. Số lần thực hiện chính là số lượng 1 trong biểu diễn nhị phân của n.

Vì n-1 sẽ đổi bit 1 ngoài cùng bên phải của n thành 0; nếu bên phải còn 0 thì mọi số 0 đều biến thành 1. Thực hiện phép AND kết quả với n sẽ loại bỏ một bit 1 ngoài cùng bên phải.

Lấy một ví dụ:

```
若 n = 1100，
n - 1 = 1011
n & (n - 1) = 1000

即：把最右边的 1 变成了 0。
```

> Sau khi trừ một số nguyên đi 1 rồi thực hiện phép AND theo bit với số nguyên ban đầu, kết quả tương đương với việc biến bit 1 ngoài cùng bên phải trong biểu diễn nhị phân của số nguyên thành 0. Nhiều bài toán nhị phân có thể được giải bằng cách này.

```java
class Solution {

    /**
     * 求二进制中1的个数
     *
     * @param n 整数
     * @return 该整数的二进制中1的个数
     */
    public int NumberOf1(int n) {
        int cnt = 0;
        while (n != 0) {
            ++cnt;
            n &= (n - 1);
        }
        return cnt;
    }
}
```

#### Cách giải ba

Dùng Java API.

```java
class Solution {

    /**
     * 求二进制中1的个数
     *
     * @param n 整数
     * @return 该整数的二进制中1的个数
     */
    public int NumberOf1(int n) {
        return Integer.bitCount(n);
    }
}
```

## 16 Lũy thừa nguyên của một giá trị

Nguồn: [AcWing](https://www.acwing.com/problem/content/26/)

### Mô tả bài toán

Hãy triển khai hàm double Power(double base, int exponent) để tính lũy thừa bậc exponent của base.

Không được sử dụng hàm thư viện, đồng thời không cần xét vấn đề số lớn.

**Lưu ý**:

- Sẽ không xuất hiện trường hợp cơ số và số mũ cùng bằng 0.

**Ví dụ 1**

```
输入：10 ，2

输出：100
```

**Ví dụ 2**

```
输入：10 ，-2

输出：0.01
```

### Cách giải

Lưu ý kiểm tra xem số mũ có nhỏ hơn 0 hay không. Ngoài ra, lũy thừa 0 của 0 không có ý nghĩa, cũng cần xem xét điều này tùy theo yêu cầu cụ thể của đề bài.

#### Cách giải một

Độ phức tạp thời gian `O(N)`.

```java
class Solution {

    /**
     * 计算数值的整数次方
     *
     * @param base 底数
     * @param exponent 指数
     * @return 数值的整数次方
     */
    public double Power(double base, int exponent) {
        if (exponent == 0) {
            return 1;
        }
        if (exponent == 1) {
            return base;
        }

        double res = 1;
        for (int i = 0; i < Math.abs(exponent); ++i) {
            res *= base;
        }

        return exponent > 0 ? res : 1 / res;
    }
}
```

#### Cách giải hai

![odd-even](../images/odd-even.png)

Giải bằng đệ quy, mỗi lần số mũ giảm đi một nửa, độ phức tạp thời gian là `O(log N)`.

```java
class Solution {

    /**
     * 计算数值的整数次方
     *
     * @param base 底数
     * @param exponent 指数
     * @return 数值的整数次方
     */
    public double Power(double base, int exponent) {
        if (exponent == 0) {
            return 1;
        }
        if (exponent == 1) {
            return base;
        }

        double res = Power(base, Math.abs(exponent) >> 1);
        res *= res;
        if ((exponent & 1) == 1) {
            res *= base;
        }
        return exponent > 0 ? res : 1 / res;
    }
}
```

## 17 In từ 1 đến số lớn nhất có n chữ số

Nguồn: không có

### Mô tả bài toán

Nhập số `n`, lần lượt in các số thập phân từ `1` đến số lớn nhất có `n` chữ số. Ví dụ nhập `3` thì in `1、2、3` cho đến số lớn nhất có 3 chữ số là 999.

### Cách giải

Cần lưu ý số có n chữ số có thể vượt quá phạm vi biểu diễn của int hoặc long long lớn nhất. Vì vậy, dùng mảng ký tự để lưu số.

#### Cách giải một

- Thực hiện phép tăng đối với số được biểu diễn bằng mảng ký tự;
- In số (cần loại bỏ các số 0 đứng đầu).

```java
class Solution {

    /**
     * 打印从1到最大的n位数
     *
     * @param n n位数
     */
    public void print1ToMaxOfNDigits(int n) {
        if (n < 1) {
            return;
        }
        char[] chars = new char[n];
        Arrays.fill(chars, '0');
        while (increment(chars)) {
            printNumber(chars);
        }
    }


    /**
     * 打印字符数组表示的数字（需要省略前n个0）
     *
     * @param chars 字符数组
     */
    private void printNumber(char[] chars) {
        int i = 0, n = chars.length;
        for (; i < n; ++i) {
            if (chars[i] != '0') {
                break;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (; i < n; ++i) {
            sb.append(chars[i]);
        }
        System.out.println(sb.toString());
    }

    private boolean increment(char[] chars) {
        int n = chars.length;
        int carry = 1;
        for (int i = n - 1; i >= 0; --i) {
            int sum = chars[i] - '0' + carry;
            if (sum > 9) {
                if (i == 0) {
                    return false;
                }
                chars[i] = '0';
            } else {
                ++chars[i];
                break;
            }
        }
        return true;
    }
}
```

#### Cách giải hai

Dùng đệ quy để sinh tất cả hoán vị, thiết lập từng chữ số rồi in ra.

```java
class Solution {

    /**
     * 打印从1到最大的n位数
     *
     * @param n n位数
     */
    public void print1ToMaxOfNDigits(int n) {
        if (n < 1) {
            return;
        }
        char[] chars = new char[n];
        print1ToMaxOfNDigits(chars, n, 0);
    }

    private void print1ToMaxOfNDigits(char[] chars, int n, int i) {
        if (i == n) {
            printNumber(chars);
            return;
        }

        // 每一位分别设置从0到9
        for (int j = 0; j < 10; ++j) {
            chars[i] = (char) (j + '0');
            print1ToMaxOfNDigits(chars, n, i + 1);
        }
    }


    /**
     * 打印字符数组表示的数字（需要省略前n个0）
     *
     * @param chars 字符数组
     */
    private void printNumber(char[] chars) {
        int i = 0, n = chars.length;
        for (; i < n; ++i) {
            if (chars[i] != '0') {
                break;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (; i < n; ++i) {
            sb.append(chars[i]);
        }
        System.out.println(sb.toString());
    }
}
```

## 18.1 Xóa node linked list trong thời gian O(1)

Nguồn: [AcWing](https://www.acwing.com/problem/content/85/)

### Mô tả bài toán

Cho con trỏ tới một node của linked list đơn, hãy định nghĩa một hàm xóa node đó trong thời gian `O(1)`.

Giả sử linked list chắc chắn tồn tại và node đó chắc chắn không phải node cuối.

**Ví dụ**

```
输入：链表 1->4->6->8
      删掉节点：第2个节点即6（头节点为第0个节点）

输出：新链表 1->4->8
```

### Cách giải

Kiểm tra node cần xóa có phải node cuối hay không:

- Nếu phải, cần duyệt linked list để tìm node ngay trước node đó, rồi để node trước trỏ tới `null`, độ phức tạp thời gian là `O(n)`;
- Nếu không, gán giá trị của node tiếp theo cho node đó, rồi để node đó trỏ tới node sau node tiếp theo, độ phức tạp thời gian là `O(1)`.

Đề bài đã nêu node không phải node cuối, vì vậy thuộc trường hợp thứ hai.

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {

    /**
     * 删除链表的节点
     *
     * @param node 要删除的节点
     */
    public void deleteNode(ListNode node) {
        node.val = node.next.val;
        node.next = node.next.next;
    }
}
```

## 18.2 Xóa các node trùng lặp trong linked list

Nguồn: [AcWing](https://www.acwing.com/problem/content/27/)

### Mô tả bài toán

Trong một linked list đã sắp xếp có các node trùng lặp, hãy xóa các node trùng lặp trong linked list đó; không giữ lại các node trùng lặp.

**Ví dụ 1**

```
输入：1->2->3->3->4->4->5

输出：1->2->5
```

**Ví dụ 2**

```
输入：1->1->1->2->3

输出：2->3
```

### Cách giải

#### Cách giải một: Đệ quy

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {

    /**
     * 删除链表重复的节点
     *
     * @param head 链表头节点
     * @return 删除重复节点后的链表
     */
    public ListNode deleteDuplication(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        if (head.next.val == head.val) {
            if (head.next.next == null) {
                return null;
            }
            if (head.next.next.val == head.val) {
                return deleteDuplication(head.next);
            }
            return deleteDuplication(head.next.next);
        }
        head.next = deleteDuplication(head.next);
        return head;
    }
}
```

#### Cách giải hai: Không đệ quy

pre luôn trỏ tới node không trùng lặp tiếp theo.

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {

    /**
     * 删除链表重复的节点
     *
     * @param head 链表头节点
     * @return 删除重复节点后的链表
     */
    public ListNode deleteDuplication(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }

        ListNode pre = null, cur = head;
        while (cur != null) {
            if (cur.next != null && cur.next.val == cur.val) {
                int val = cur.val;
                while (cur.next != null && cur.next.val == val) {
                    cur = cur.next;
                }
                if (pre == null) {
                    head = cur.next;
                } else {
                    pre.next = cur.next;
                }
            } else {
                pre = cur;
            }
            cur = cur.next;
        }
        return head;
    }
}
```

## 19 Khớp regular expression

Nguồn: [AcWing](https://www.acwing.com/problem/content/28/)

### Mô tả bài toán

Hãy triển khai một hàm dùng để khớp regular expression có chứa `'.'` và `'*'`.

Ký tự `'.'` trong pattern biểu thị một ký tự bất kỳ, còn `'*'` biểu thị ký tự đứng trước nó có thể xuất hiện tùy ý số lần (kể cả 0 lần).

Trong bài này, khớp nghĩa là mọi ký tự của chuỗi khớp với toàn bộ pattern.

Ví dụ, chuỗi `"aaa"` khớp với pattern `"a.a"` và `"ab*ac*a"`, nhưng không khớp với `"aa.a"` và `"ab*a"`.

**Ví dụ**

```
输入：

s="aa"
p="a*"

输出:true
```

### Cách giải

Kiểm tra xem ký tự thứ hai trong pattern có phải `*` hay không:

- Nếu phải, kiểm tra ký tự đầu tiên của pattern có khớp với ký tự đầu tiên của chuỗi hay không:
  - Nếu không khớp, dịch pattern sang phải hai ký tự `j+2`, tương đương bỏ qua a\*.
  - Nếu khớp, dịch chuỗi sang phải `i+1`. Khi đó pattern có thể dịch hai ký tự `j+2`, hoặc cũng có thể không dịch `j`.
- Nếu không phải, kiểm tra ký tự hiện tại có khớp với ký tự hiện tại của pattern hay không, tức `str[i] == pattern[j] || pattern[j] == '.'`:
  - Nếu khớp, chuỗi và pattern cùng dịch sang phải một ký tự, `i+1`, `j+1`.
  - Nếu không khớp, trả về false.

```java
class Solution {

    /**
     * 判断字符串是否与模式串匹配
     *
     * @param s 字符串
     * @param p 模式串
     * @return 是否匹配
     */
    public boolean isMatch(String s, String p) {
        if (s == null || p == null) {
            return false;
        }
        char[] str = s.toCharArray();
        char[] pattern = p.toCharArray();
        return match(str, 0, str.length, pattern, 0, pattern.length);
    }

    private boolean match(char[] str, int i, int len1, char[] pattern, int j, int len2) {
        if (i == len1 && j == len2) {
            return true;
        }

        // pattern已经走到最后，而str还有未匹配的
        // str走到最后，而pattern还没走完，此时是允许的
        if (j == len2) {
            return false;
        }

        if (j + 1 < len2 && pattern[j + 1] == '*') {
            if (i < len1 && (str[i] == pattern[j] || pattern[j] == '.')) {
                return match(str, i, len1, pattern, j + 2, len2)
                        || match(str, i + 1, len1, pattern, j, len2)
                        || match(str, i + 1, len1, pattern, j + 2, len2);
            }
            return match(str, i, len1, pattern, j + 2, len2);
        }

        if (i < len1 && (str[i] == pattern[j] || pattern[j] == '.')) {
            return match(str, i + 1, len1, pattern, j + 1, len2);
        }
        return false;

    }
}
```

## 20 Chuỗi biểu diễn giá trị số

Nguồn: [AcWing](https://www.acwing.com/problem/content/29/)

### Mô tả bài toán

Hãy triển khai một hàm để phán đoán xem chuỗi có biểu diễn một số hay không (bao gồm số nguyên và số thập phân).

Ví dụ, các chuỗi `"+100"`, `"5e2"`, `"-123"`, `"3.1416"` và `"-1E-16"` đều biểu diễn số.

Nhưng `"12e"`, `"1a3.14"`, `"1.2.3"`, `"+-5"` và `"12e+4.3"` đều không phải.

**Lưu ý**:

- Số thập phân có thể không có phần nguyên, chẳng hạn .123 tương đương 0.123;
- Sau dấu thập phân có thể không có chữ số, chẳng hạn 233. tương đương 233.0;
- Trước và sau dấu thập phân đều có thể có chữ số, chẳng hạn 233.666;
- Khi trước e hoặc E không có chữ số thì toàn bộ chuỗi không thể biểu diễn số, chẳng hạn .e1, e1;
- Khi sau e hoặc E không có số nguyên thì toàn bộ chuỗi không thể biểu diễn số, chẳng hạn 12e, 12e+5.4;

**Ví dụ**:

```
输入: "0"

输出: true
```

### Cách giải

Chỉ cần dùng regular expression để khớp.

```
[]  ： 字符集合
()  ： 分组
?   ： 重复 0 ~ 1
+   ： 重复 1 ~ n
*   ： 重复 0 ~ n
.   ： 任意字符
\\. ： 转义后的 .
\\d ： 数字
```

```java
public class Solution {
    /**
     * 判断是否是数字
     * @param str
     * @return
     */
    public boolean isNumeric(char[] str) {
        return str != null
                && str.length != 0
                && new String(str).matches("[+-]?\\d*(\\.\\d+)?([eE][+-]?\\d+)?");
    }
}
```

## 21 Điều chỉnh thứ tự mảng để số lẻ đứng trước số chẵn

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một mảng số nguyên, triển khai một hàm điều chỉnh thứ tự các số trong mảng sao cho tất cả số lẻ nằm ở nửa đầu mảng, tất cả số chẵn nằm ở nửa sau mảng, đồng thời bảo đảm thứ tự tương đối giữa các số lẻ và giữa các số chẵn không đổi.

### Cách giải

#### Cách giải một

Tính số lượng số lẻ thì có thể dễ dàng viết ra.

```java
import java.util.Arrays;

public class Solution {
    /**
     * 调整数组元素顺序，使得奇数元素位于偶数元素前面，且保证奇数和奇数，偶数和偶数之间的相对位置不变。
     * @param array 数组
     */
    public void reOrderArray(int [] array) {
        if (array == null || array.length < 2) {
            return;
        }

        int numsOfOdd = 0;
        for (int val : array) {
            if (val % 2 == 1) {
                ++numsOfOdd;
            }
        }
        int[] bak = Arrays.copyOf(array, array.length);
        int i = 0, j = numsOfOdd;
        for (int val : bak) {
            if (val % 2 == 1) {
                array[i++] = val;
            } else {
                array[j++] = val;
            }
        }
    }

}
```

#### Cách giải hai

```java
import java.util.Arrays;

public class Solution {
    public void reOrderArray(int [] array) {
        if (array == null || array.length < 2) {
            return;
        }
        Integer[] bak = new Integer[array.length];
        Arrays.setAll(bak, i -> array[i]);
        Arrays.sort(bak, (x, y) -> (y & 1) - (x & 1));
        Arrays.setAll(array, i -> bak[i]);
    }

}
```

## 22 Node thứ k tính từ cuối trong linked list

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một linked list, xuất node thứ k tính từ cuối trong linked list đó.

### Cách giải

Cho con trỏ pre đi `k-1` bước. Sau đó cho con trỏ cur trỏ vào phead, rồi cho hai con trỏ cùng đi cho đến khi con trỏ pre tới node cuối.

> Khi không thể giải quyết bài toán bằng một con trỏ duyệt linked list, có thể thử dùng hai con trỏ để duyệt linked list. Có thể cho một con trỏ duyệt nhanh hơn.

Bài này cần xét một số trường hợp đặc biệt, chẳng hạn giá trị k nhỏ hơn 0 hoặc lớn hơn độ dài linked list.

```java
/*
public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}*/
public class Solution {
    /**
     * 找出链表倒数第k个节点，k从1开始
     * @param head 链表头部
     * @param k 第k个节点
     * @return 倒数第k个节点
     */
    public ListNode FindKthToTail(ListNode head,int k) {
        if (head == null || k < 1) {
            return null;
        }

        ListNode pre = head;
        for (int i = 0; i < k - 1; ++i) {
            if (pre.next != null) {
                pre = pre.next;
            } else {
                return null;
            }
        }

        ListNode cur = head;
        while (pre.next != null) {
            pre = pre.next;
            cur = cur.next;
        }
        return cur;
    }
}
```

## 23 Node đầu vào của vòng trong linked list

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Cho một linked list; nếu trong đó có vòng, hãy tìm node đầu vào của vòng trong linked list đó, nếu không thì xuất `null`.

### Cách giải

- Trước hết dùng con trỏ nhanh và chậm. Nếu chúng gặp nhau thì chứng tỏ có vòng và điểm gặp chắc chắn nằm trên vòng; nếu không gặp nhau thì chứng tỏ không có vòng, trả về `null`.
- Cố định điểm gặp hiện tại, cho một con trỏ tiếp tục đi đồng thời đếm số node. Tính số node `cnt` trong vòng.
- Cho con trỏ p1 đi trước `cnt` bước, p2 trỏ vào đầu linked list; sau đó cho `p1`, `p2` cùng đi, điểm gặp chắc chắn là node đầu vào của vòng. Vì `p1` đã đi nhiều hơn `p2` một vòng.

```java
/*
 public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}
*/
public class Solution {

    /**
     * 求链表环的入口，若没有环，返回null
     * @param pHead 链表头
     * @return 环的入口点
     */
    public ListNode EntryNodeOfLoop(ListNode pHead) {
        if (pHead == null || pHead.next == null) {
            return null;
        }
        ListNode fast = pHead;
        ListNode slow = pHead;
        boolean flag = false;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (fast == slow) {
                flag = true;
                break;
            }
        }

        // 快指针与慢指针没有相遇，说明无环，返回 null
        if (!flag) {
            return null;
        }

        ListNode cur = slow.next;
        // 求出环中结点个数
        int cnt = 1;
        while (cur != slow) {
            cur = cur.next;
            ++cnt;
        }

        // 指针p1先走cnt步
        ListNode p1 = pHead;
        for (int i = 0; i < cnt; ++i) {
            p1 = p1.next;
        }

        // p2指向链表头，然后p1/p2同时走，首次相遇的地方就是环的入口
        ListNode p2 = pHead;
        while (p1 != p2) {
            p1 = p1.next;
            p2 = p2.next;
        }
        return p1;
    }
}
```

## 24 Đảo ngược linked list

Nguồn: [AcWing](https://www.acwing.com/problem/content/33/)

### Mô tả bài toán

Nhập một linked list, sau khi đảo ngược linked list, xuất node đầu của linked list mới.

### Cách giải

#### Cách giải một

Giải bằng phương pháp chèn đầu.

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode dummy = new ListNode(-1);
        ListNode p = head;
        ListNode q = head.next;
        while (q != null) {
            p.next = dummy.next;
            dummy.next = p;
            p = q;
            q = p.next;
        }
        p.next = dummy.next;
        return p;
    }
}
```

#### Cách giải hai: Đệ quy

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode node = reverseList(head.next);
        ListNode cur = node;
        while (cur.next != null) {
            cur = cur.next;
        }
        cur.next = head;
        head.next = null;
        return node;
    }
}
```

## 25 Hợp nhất hai linked list đã sắp xếp

Nguồn: [AcWing](https://www.acwing.com/problem/content/34/)

### Mô tả bài toán

Nhập hai linked list được sắp xếp tăng dần, hợp nhất hai linked list này và bảo đảm các node trong linked list mới vẫn được sắp xếp tăng dần.

**Ví dụ**

```
输入：1->3->5 , 2->4->5

输出：1->2->3->4->5->5
```

### Cách giải

#### Cách giải một

Duyệt đồng thời hai linked list để `merge`.

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode merge(ListNode l1, ListNode l2) {
        if (l1 == null) {
            return l2;
        }
        if (l2 == null) {
            return l1;
        }
        ListNode p = l1;
        ListNode q = l2;
        ListNode dummy = new ListNode(-1);
        ListNode cur = dummy;
        while (p != null && q != null) {
            if (p.val < q.val) {
                ListNode t = p.next;
                cur.next = p;
                p.next = null;
                p = t;
            } else {
                ListNode t = q.next;
                cur.next = q;
                q.next = null;
                q = t;
            }
            cur = cur.next;
        }
        cur.next = p == null ? q : p;
        return dummy.next;
    }
}
```

#### Cách giải hai: Đệ quy

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode merge(ListNode l1, ListNode l2) {
        if (l1 == null) {
            return l2;
        }
        if (l2 == null) {
            return l1;
        }
        if (l1.val < l2.val) {
            l1.next = merge(l1.next, l2);
            return l1;
        }
        l2.next = merge(l1, l2.next);
        return l2;
    }
}
```

## 26 Cấu trúc con của cây

Nguồn: [AcWing](https://www.acwing.com/problem/content/35/)

### Mô tả bài toán

Nhập hai cây nhị phân A, B, phán đoán B có phải là cấu trúc con của A hay không.

Quy ước cây rỗng không phải là cấu trúc con của bất kỳ cây nào.

**Ví dụ**

Cây A:

```
     8
    / \
   8   7
  / \
 9   2
    / \
   4   7
```

Cây B:

```
   8
  / \
 9   2
```

Trả về true, vì B là cấu trúc con của A.

### Cách giải

Duyệt bằng đệ quy:

- Tìm trong cây A node R có giá trị node gốc giống với cây B;
- Phán đoán cây con lấy R làm node gốc trong cây A có chứa cấu trúc giống cây B hay không.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean hasSubtree(TreeNode pRoot1, TreeNode pRoot2) {
        boolean res = false;
        if (pRoot1 != null && pRoot2 != null) {
            if (pRoot1.val == pRoot2.val) {
                res = isSame(pRoot1, pRoot2);
            }
            if (!res) {
                res = hasSubtree(pRoot1.left, pRoot2);
            }
            if (!res) {
                res = hasSubtree(pRoot1.right, pRoot2);
            }
        }
        return res;

    }

    private boolean isSame(TreeNode root1, TreeNode root2) {
        if (root2 == null) {
            return true;
        }
        if (root1 == null || root1.val != root2.val) {
            return false;
        }
        return isSame(root1.left, root2.left) && isSame(root1.right, root2.right);
    }
}
```

## 27 Ảnh phản chiếu của cây nhị phân

Nguồn: [AcWing](https://www.acwing.com/problem/content/37/)

### Mô tả bài toán

Nhập một cây nhị phân, biến đổi nó thành ảnh phản chiếu của chính nó.

**Ví dụ**

```
输入树：
      8
     / \
    6  10
   / \ / \
  5  7 9 11

 [8,6,10,5,7,9,11,null,null,null,null,null,null,null,null]
输出树：
      8
     / \
    10  6
   / \ / \
  11 9 7  5

 [8,10,6,11,9,7,5,null,null,null,null,null,null,null,null]
```

### Cách giải

Hoán đổi con trái và con phải của node gốc, sau đó đệ quy với các con trái và phải.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public void mirror(TreeNode root) {
        if (root == null || (root.left == null && root.right == null)) {
            return;
        }
        TreeNode t = root.left;
        root.left = root.right;
        root.right = t;
        mirror(root.left);
        mirror(root.right);
    }
}
```

## 28 Cây nhị phân đối xứng

Nguồn: [AcWing](https://www.acwing.com/problem/content/38/)

### Mô tả bài toán

Hãy triển khai một hàm để phán đoán một cây nhị phân có đối xứng hay không.

Nếu một cây nhị phân giống với ảnh phản chiếu của nó thì nó đối xứng.

**Ví dụ**

```
如下图所示二叉树[1,2,2,3,4,4,3,null,null,null,null,null,null,null,null]为对称二叉树：
    1
   / \
  2   2
 / \ / \
3  4 4  3

如下图所示二叉树[1,2,2,null,4,4,3,null,null,null,null,null,null]不是对称二叉树：
    1
   / \
  2   2
   \ / \
   4 4  3
```

### Cách giải

So sánh dãy duyệt trước của cây nhị phân với dãy duyệt trước đối xứng; nếu giống nhau thì chứng tỏ cây đối xứng.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return isSymmetric(root, root);
    }

    private boolean isSymmetric(TreeNode root1, TreeNode root2) {
        if (root1 == null && root2 == null) {
            return true;
        }
        if (root1 == null || root2 == null || root1.val != root2.val) {
            return false;
        }
        return isSymmetric(root1.left, root2.right) && isSymmetric(root1.right, root2.left);
    }
}
```

## 29 In ma trận theo chiều kim đồng hồ

Nguồn: [AcWing](https://www.acwing.com/problem/content/39/)

### Mô tả bài toán

Nhập một ma trận, lần lượt in từng số theo thứ tự chiều kim đồng hồ từ ngoài vào trong.

**Ví dụ**

```
输入：
[
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9,10,11,12]
]

输出：[1,2,3,4,8,12,11,10,9,5,6,7]
```

### Cách giải

Chỉ cần in ma trận từng vòng từ ngoài vào trong.

```java
class Solution {
    public int[] printMatrix(int[][] matrix) {
        if (matrix == null || matrix.length < 1) {
            return new int[] {};
        }
        int m = matrix.length, n = matrix[0].length;
        int[] res = new int[m * n];
        int[] index = new int[1];
        index[0] = 0;
        int i = 0, j = 0, p = m - 1, q = n - 1;
        while (i <= p && j <= q) {
            add(matrix, res, index, i++, j++, p--, q--);
        }
        return res;
    }

    private void add(int[][] matrix, int[] res, int[] index, int i, int j, int p, int q) {
        if (i == p) {
            for (int m = j; m <= q; ++m) {
                res[index[0]++] = matrix[i][m];
            }
        } else if (j == q) {
            for (int m = i; m <= p; ++m) {
                res[index[0]++] = matrix[m][j];
            }
        } else {
            for (int m = j; m < q; ++m) {
                res[index[0]++] = matrix[i][m];
            }
            for (int m = i; m < p; ++m) {
                res[index[0]++] = matrix[m][q];
            }
            for (int m = q; m > j; --m) {
                res[index[0]++] = matrix[p][m];
            }
            for (int m = p; m > i; --m) {
                res[index[0]++] = matrix[m][j];
            }
        }

    }
}
```

## 30 Stack có hàm min

Nguồn: [AcWing](https://www.acwing.com/problem/content/90/)

### Mô tả bài toán

Thiết kế một stack hỗ trợ các thao tác push, pop, top và có thể lấy phần tử nhỏ nhất trong thời gian O(1).

- push(x)–chèn phần tử x vào stack
- pop()–xóa phần tử trên cùng của stack
- top()–lấy phần tử trên cùng của stack
- getMin()–lấy phần tử nhỏ nhất trong stack

**Ví dụ**

```
MinStack minStack = new MinStack();
minStack.push(-1);
minStack.push(3);
minStack.push(-4);
minStack.getMin();   --> Returns -4.
minStack.pop();
minStack.top();      --> Returns 3.
minStack.getMin();   --> Returns -1.
```

### Cách giải

Định nghĩa hai `stack`.

Khi push, trước hết đẩy phần tử `x` vào `stack1`. Sau đó xét trạng thái của `stack2`:

- Nếu stack `stack2` rỗng hoặc phần tử trên cùng lớn hơn `x`, đẩy `x` vào `stack2`.
- Nếu stack `stack2` không rỗng và phần tử trên cùng nhỏ hơn `x`, lặp lại việc đẩy phần tử trên cùng vào stack.

Khi lấy phần tử nhỏ nhất, chỉ cần lấy phần tử trên cùng từ `stack2`.

```java
class MinStack {

    private Stack<Integer> stack1;
    private Stack<Integer> stack2;

    /** initialize your data structure here. */
    public MinStack() {
        stack1 = new Stack<>();
        stack2 = new Stack<>();
    }

    public void push(int x) {
        stack1.push(x);
        if (stack2.isEmpty() || stack2.peek() > x) {
            stack2.push(x);
        } else {
            stack2.push(stack2.peek());
        }
    }

    public void pop() {
        stack1.pop();
        stack2.pop();
    }

    public int top() {
        return stack1.peek();
    }

    public int getMin() {
        return stack2.peek();
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(x);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```

## 31 Trình tự push, pop của stack

Nguồn: [AcWing](https://www.acwing.com/problem/content/40/)

### Mô tả bài toán

Nhập hai dãy số nguyên; dãy thứ nhất biểu thị thứ tự push vào stack, hãy phán đoán dãy thứ hai có thể là thứ tự pop của stack đó hay không.

Giả sử mọi số được push vào stack đều khác nhau.

Ví dụ dãy `1,2,3,4,5` là thứ tự push của một stack, dãy `4,5,3,2,1` là một thứ tự pop tương ứng với dãy push đó, nhưng `4,3,5,1,2` không thể là thứ tự pop của dãy push đó.

Lưu ý: nếu hai dãy đều rỗng hoặc có độ dài khác nhau thì xem như không phải một cặp dãy push, pop của stack.

**Ví dụ**

```
输入：[1,2,3,4,5]
      [4,5,3,2,1]

输出：true
```

### Cách giải

Phán đoán phần tử tiếp theo cần pop:

- Nếu vừa đúng là phần tử trên cùng của stack thì pop trực tiếp.
- Nếu không ở trên cùng, push các số trong dãy push chưa được đưa vào stack, cho đến khi số cần pop nằm trên cùng.
- Nếu đã push mọi số lên trên cùng mà vẫn không tìm được số pop tiếp theo thì không thể là dãy pop.

```java
import java.util.Stack;

public class Solution {
    /**
     * 判断是否是弹出序列
     * @param pushA 压栈序列
     * @param popA 弹栈序列
     * @return 是否是弹出序列
     */
    public boolean IsPopOrder(int[] pushA,int[] popA) {
        if (pushA == null || popA == null || pushA.length != popA.length) {
            return false;
        }

        Stack<Integer> stack = new Stack<>();
        int i = 0;
        int n = pushA.length;
        boolean flag = false;
        for (int val : popA) {
            while (stack.isEmpty() || stack.peek() != val) {
                if (i >= n) {
                    flag = true;
                    break;
                }
                stack.push(pushA[i++]);
            }
            if (flag) {
                break;
            }
            stack.pop();
        }

        return stack.isEmpty();
    }
}
```

## 32.1 In cây nhị phân từ trên xuống dưới, không chia dòng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

In từng node của cây nhị phân từ trên xuống dưới; các node cùng tầng được in từ trái sang phải.

### Cách giải

Đưa node gốc vào queue trước.

Lấy phần tử đầu queue ra, lưu giá trị vào list, kiểm tra phần tử đó có cây con trái/phải hay không; nếu có thì lần lượt đưa vào queue. Kết thúc khi queue rỗng.

```java
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;


/**
 public class TreeNode {
 int val = 0;
 TreeNode left = null;
 TreeNode right = null;

 public TreeNode(int val) {
 this.val = val;

 }

 }
 */
public class Solution {
    /**
     * 从上到下打印二叉树
     * @param root 二叉树根节点
     * @return 结果list
     */
    public ArrayList<Integer> PrintFromTopToBottom(TreeNode root) {
        ArrayList<Integer> list = new ArrayList<>();
        if (root == null) {
            return list;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
            list.add(node.val);
        }
        return list;
    }
}
```

## 32.2 In cây nhị phân từ trên xuống dưới, chia theo dòng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

In cây nhị phân theo từng tầng từ trên xuống dưới; các node cùng tầng được xuất từ trái sang phải. Mỗi tầng xuất trên một dòng.

### Cách giải

Tương tự bài trước, chỉ khác là cần dùng biến ghi lại số node cần in ở mỗi tầng.

```java
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;


/*
public class TreeNode {
    int val = 0;
    TreeNode left = null;
    TreeNode right = null;

    public TreeNode(int val) {
        this.val = val;

    }

}
*/
public class Solution {
    /**
     * 把二叉树打印成多行
     * @param pRoot 二叉树根节点
     * @return 结果list
     */
    ArrayList<ArrayList<Integer> > Print(TreeNode pRoot) {
        ArrayList<ArrayList<Integer>> list = new ArrayList<>();
        if (pRoot == null) {
            return list;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(pRoot);
        int cnt = 1;
        while (cnt > 0) {
            int num = cnt;
            cnt = 0;
            ArrayList<Integer> res = new ArrayList<>();
            for (int i = 0; i < num; ++i) {
                TreeNode node = queue.poll();
                if (node.left != null) {
                    queue.offer(node.left);
                    ++cnt;
                }
                if (node.right != null) {
                    queue.offer(node.right);
                    ++cnt;
                }
                res.add(node.val);
            }
            list.add(res);
        }
        return list;
    }

}
```

## 32.3 In cây nhị phân theo hình zic-zắc

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Hãy triển khai một hàm in cây nhị phân theo hình zic-zắc, tức là dòng đầu in từ trái sang phải, tầng thứ hai in từ phải sang trái, tầng thứ ba in từ trái sang phải, các dòng khác tương tự.

Ví dụ cây nhị phân:

```
            1
    	   /  \
    	  2    3
    	 / \  / \
    	4  5 6  7
```

Kết quả in là:

```
1
3 2
4 5 6 7
```

### Cách giải

Với cây nhị phân trên:

Trước hết thăm node gốc, sau đó lưu 2, 3 vào một cấu trúc. Khi in thì in 3, 2 trước. Đây chẳng phải là stack sao?

Lần lượt pop các phần tử stack, lần lượt là 3, 2. Khi pop cần lưu các node con của 3, 2 vào cấu trúc. Vì thứ tự thăm là `4 5 6 7`, nên cũng cần dùng stack để lưu. Hơn nữa lúc này cần lưu con phải trước, rồi lưu con trái. (Thứ tự lưu con trái/phải khác nhau ở tầng lẻ/chẵn.)

Ở đây cần dùng hai stack để triển khai. Nếu chỉ dùng một stack, khi pop 3, 2, trước hết push các node con của 3 vào stack. Khi đó lúc pop sẽ không pop 2 trước mà pop node con của 3, như vậy là sai.

```java
import java.util.ArrayList;
import java.util.Stack;


/*
public class TreeNode {
    int val = 0;
    TreeNode left = null;
    TreeNode right = null;

    public TreeNode(int val) {
        this.val = val;

    }

}
*/
public class Solution {
    /**
     * 按之字形打印二叉树
     * @param pRoot 二叉树的根节点
     * @return 结果list
     */
    public ArrayList<ArrayList<Integer>> Print(TreeNode pRoot) {
        ArrayList<ArrayList<Integer>> res = new ArrayList<>();
        if (pRoot == null) {
            return res;
        }
        Stack<TreeNode> stack1 = new Stack<>();
        Stack<TreeNode> stack2 = new Stack<>();
        stack1.push(pRoot);
        int i = 1;
        Stack<TreeNode> stack = stack1;
        while (!stack.isEmpty()) {
            ArrayList<Integer> list = new ArrayList<>();
            while (!stack.isEmpty()) {
                TreeNode node = stack.pop();
                list.add(node.val);
                if (i % 2 == 1) {
                    if (node.left != null) {
                        stack2.push(node.left);
                    }
                    if (node.right != null) {
                        stack2.push(node.right);
                    }
                } else {
                    if (node.right != null) {
                        stack1.push(node.right);
                    }
                    if (node.left != null) {
                        stack1.push(node.left);
                    }
                }
            }
            res.add(list);
            ++i;
            stack = stack1.isEmpty() ? stack2 : stack1;
        }

        return res;
    }

}
```

## 33 Dãy duyệt sau của cây tìm kiếm nhị phân

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một mảng số nguyên, phán đoán mảng đó có phải là kết quả duyệt sau của một cây tìm kiếm nhị phân hay không. Nếu phải thì xuất `Yes`, nếu không thì xuất `No`. Giả sử mọi hai số bất kỳ trong mảng đầu vào đều khác nhau.

### Cách giải

Phần tử cuối cùng của dãy là node gốc của cây tìm kiếm nhị phân.

Trong dãy, tìm từ trái sang phải cây con trái của node gốc (nhỏ hơn node gốc) và cây con phải (lớn hơn node gốc).

- Nếu cây con phải xuất hiện phần tử nhỏ hơn node gốc thì kết quả là false.
- Nếu không thì đệ quy với cây con trái và phải.

```java
public class Solution {
    /**
     * 判断数组是否是某个二叉搜索树的后序遍历序列
     *
     * @param sequence 数组
     * @return 是否属于某二叉搜索树的后序遍历序列
     */
    public boolean VerifySquenceOfBST(int[] sequence) {
        if (sequence == null || sequence.length < 1) {
            return false;
        }
        return verify(sequence, 0, sequence.length - 1);
    }

    private boolean verify(int[] sequence, int start, int end) {
        if (start >= end) {
            return true;
        }
        int val = sequence[end];
        int i = start;
        for (; i <= end; ++i) {
            if (sequence[i] >= val) {
                break;
            }
        }

        for (int j = i; j < end; ++j) {
            if (sequence[j] < val) {
                return false;
            }
        }

        return verify(sequence, start, i - 1) && verify(sequence, i, end - 1);

    }
}
```

## 34 Đường đi trong cây nhị phân có tổng bằng một giá trị

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập node gốc của một cây nhị phân và một số nguyên, in ra tất cả các đường đi trong cây nhị phân có tổng giá trị node bằng số nguyên đầu vào. Đường đi được định nghĩa là các node đi qua từ node gốc của cây xuống node lá tạo thành một đường đi. (Lưu ý: trong `list` trả về, mảng có độ dài lớn hơn được xếp trước.)

### Cách giải

```java
import java.util.ArrayList;


/**
 public class TreeNode {
 int val = 0;
 TreeNode left = null;
 TreeNode right = null;

 public TreeNode(int val) {
 this.val = val;

 }

 }
 */
public class Solution {

    private ArrayList<ArrayList<Integer>> res = new ArrayList<>();

    /**
     * 找出二叉树中和为某一值的路径（必须从根节点到叶节点）
     *
     * @param root  二叉树的根结点
     * @param target 目标值
     * @return 结果list
     */
    public ArrayList<ArrayList<Integer>> FindPath(TreeNode root, int target) {
        findPath(root, target, new ArrayList<>());
        return res;
    }

    private void findPath(TreeNode root, int target, ArrayList<Integer> list) {
        if (root == null) {
            return;
        }
        list.add(root.val);
        target -= root.val;
        if (target == 0 && root.left == null && root.right == null) {
            res.add(new ArrayList<>(list));
        } else {
            findPath(root.left, target, list);
            findPath(root.right, target, list);
        }
        list.remove(list.size() - 1);
    }
}
```

## 35 Sao chép linked list phức tạp

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một linked list phức tạp (mỗi node có giá trị node và hai con trỏ, một trỏ tới node tiếp theo, một con trỏ đặc biệt trỏ tới một node bất kỳ), kết quả trả về là `head` của linked list phức tạp sau khi sao chép. (Lưu ý, trong kết quả trả về không được trả về tham chiếu node trong tham số, nếu không chương trình chấm sẽ trực tiếp trả về rỗng.)

![random-list](../images/random-list.png)

### Cách giải

- Bước một, chèn node đã sao chép phía sau mỗi node;
  ![random-list-step1.png](../images/random-list-step1.png)

- Bước hai, gán liên kết random của các node đã sao chép;
  ![random-list-step2.png](../images/random-list-step2.png)

- Bước ba, tách hai linked list.
  ![random-list-step3.png](../images/random-list-step3.png)

```java
/*
public class RandomListNode {
    int label;
    RandomListNode next = null;
    RandomListNode random = null;

    RandomListNode(int label) {
        this.label = label;
    }
}
*/
public class Solution {
    /**
     * 复杂链表的复制
     * @param pHead 链表头结点
     * @return 复制的链表
     */
    public RandomListNode Clone(RandomListNode pHead) {
        if (pHead == null) {
            return null;
        }
        RandomListNode cur = pHead;
        while (cur != null) {
            RandomListNode node = new RandomListNode(cur.label);
            node.next = cur.next;
            cur.next = node;
            cur = node.next;
        }

        cur = pHead;
        while (cur != null) {
            RandomListNode clone = cur.next;
            if (cur.random != null) {
                clone.random = cur.random.next;
            }
            cur = clone.next;
        }

        cur = pHead;
        RandomListNode cloneHead = pHead.next;
        while (cur.next != null) {
            RandomListNode clone = cur.next;
            cur.next = clone.next;
            cur = clone;
        }
        return cloneHead;
    }
}
```

## 36 Cây tìm kiếm nhị phân và linked list hai chiều

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một cây tìm kiếm nhị phân, chuyển cây tìm kiếm nhị phân đó thành một linked list hai chiều đã sắp xếp. Yêu cầu không được tạo node mới, chỉ được điều chỉnh hướng trỏ của các node trong cây.

### Cách giải

Vì là cây tìm kiếm nhị phân nên kết quả duyệt giữa chính là dãy đã sắp xếp.

Dùng stack để thực hiện duyệt giữa. Khi duyệt, right của node trước trỏ tới node sau, left của node sau trỏ tới node trước.

```java
pre.right = cur
cur.left = pre
```

```java
import java.util.Stack;

/**
 public class TreeNode {
 int val = 0;
 TreeNode left = null;
 TreeNode right = null;

 public TreeNode(int val) {
 this.val = val;

 }

 }
 */
public class Solution {
    /**
     * 将二叉搜索树转换为双向链表
     *
     * @param pRootOfTree
     * @return
     */
    public TreeNode Convert(TreeNode pRootOfTree) {
        if (pRootOfTree == null) {
            return null;
        }
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = pRootOfTree;
        TreeNode res = null;
        TreeNode pre = null;
        while (cur != null || !stack.isEmpty()) {
            if (cur != null) {
                stack.push(cur);
                cur = cur.left;
            } else {
                cur = stack.pop();
                if (pre == null) {
                    pre = cur;
                    res = pre;
                } else {
                    pre.right = cur;
                    cur.left = pre;
                    pre = cur;
                }
                cur = cur.right;

            }
        }
        return res;
    }
}
```

## 39 Số xuất hiện quá nửa số lần trong mảng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Có một số xuất hiện nhiều hơn một nửa độ dài mảng, hãy tìm số đó. Ví dụ nhập mảng có độ dài 9 là `{1,2,3,2,2,2,5,4,2}`. Vì số 2 xuất hiện 5 lần trong mảng, nhiều hơn một nửa độ dài mảng, nên xuất 2. Nếu không tồn tại thì xuất 0.

### Cách giải

#### Cách giải một

Dùng ý tưởng partition trong quicksort.

Trong mảng có một số xuất hiện nhiều hơn một nửa độ dài mảng, vậy sau khi sắp xếp, số ở giữa mảng chắc chắn là số cần tìm. Chọn ngẫu nhiên một số, dùng hàm partition() để các số nhỏ hơn số được chọn nằm bên trái, các số lớn hơn số được chọn nằm bên phải.

Xét chỉ số `index` của số được chọn:

- Nếu `index = n/2`, số này là trung vị.
- Nếu `index > n/2`, tiếp tục partition ở bên trái index.
- Nếu `index < n/2`, tiếp tục partition ở bên phải index.

**Lưu ý:** phương pháp này sẽ sửa mảng đầu vào. Độ phức tạp thời gian là `O(n)`.

```java

public class Solution {
    /**
     * 查找数组中出现次数超过一次的数字
     *
     * @param array 数组
     * @return 返回该数，不存在则返回0
     */
    public int MoreThanHalfNum_Solution(int[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        int n = array.length;
        int start = 0, end = n - 1;
        int mid = n >> 1;
        int index = partition(array, start, end);
        while (index != mid) {
            if (index > mid) {
                end = index - 1;
            } else {
                start = index + 1;
            }
            index = partition(array, start, end);
        }

        return isMoreThanHalf(array, array[index]) ? array[index] : 0;
    }

    /**
     * 快排中的 partition 方法
     *
     * @param array 数组
     * @param start 开始位置
     * @param end 结束位置
     * @return
     */
    private int partition(int[] array, int start, int end) {
        int small = start - 1;
        for (int i =  start; i < end; ++i) {
            if (array[i] < array[end]) {
                swap(array, i, ++small);
            }
        }
        ++small;
        swap(array, small, end);
        return small;

    }

    private void swap(int[] array, int i, int j) {
        int t = array[i];
        array[i] = array[j];
        array[j] = t;
    }

    /**
     * 判断val元素是否真的超过数组元素个数的一半
     *
     * @param array 数组
     * @param val 某元素
     * @return boolean
     */
    private boolean isMoreThanHalf(int[] array, int val) {
        int cnt = 0;
        for (int e : array) {
            if (e == val) {
                ++cnt;
            }
        }

        return cnt * 2 > array.length;
    }
}
```

#### Cách giải hai

Dùng thuật toán bỏ phiếu đa số, duyệt mảng từ đầu đến cuối; khi gặp hai số khác nhau thì đồng thời loại bỏ hai số đó. Hai số bị loại có thể đều không phải majority, cũng có thể một số là majority còn số kia không phải, nhưng vì tổng số majority lớn hơn một nửa nên sau khi loại bỏ như vậy, số còn lại cuối cùng chắc chắn là majority.

Độ phức tạp thời gian của phương pháp này là `O(n)`, đồng thời không thay đổi mảng.

```java
public class Solution {
    /**
     * 查找数组中出现次数超过一次的数字
     *
     * @param array 数组
     * @return 返回该数，不存在则返回0
     */
    public int MoreThanHalfNum_Solution(int[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }

        int res = array[0];
        int times = 1;
        for (int i = 1; i < array.length; ++i) {
            if (times == 0) {
                res = array[i];
                times = 1;
            } else if (array[i] == res) {
                ++times;
            } else {
                --times;
            }
        }

        return isMoreThanHalf(array, res) ? res : 0;
    }


    /**
     * 判断val元素是否真的超过数组元素个数的一半
     *
     * @param array 数组
     * @param val 某元素
     * @return boolean
     */
    private boolean isMoreThanHalf(int[] array, int val) {
        int cnt = 0;
        for (int e : array) {
            if (e == val) {
                ++cnt;
            }
        }

        return cnt * 2 > array.length;
    }
}
```

## 40 K số nhỏ nhất

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập n số nguyên, tìm K số nhỏ nhất trong đó. Ví dụ nhập tám số `4,5,1,6,2,7,3,8`, thì 4 số nhỏ nhất là `1,2,3,4`.

### Cách giải

#### Cách giải một

Dùng ý tưởng partition trong quicksort.

Trong mảng có một số xuất hiện nhiều hơn một nửa độ dài mảng, vậy sau khi sắp xếp, số ở giữa mảng chắc chắn là số cần tìm. Chọn ngẫu nhiên một số, dùng hàm partition() để các số nhỏ hơn số được chọn nằm bên trái, các số lớn hơn số được chọn nằm bên phải.

Xét chỉ số `index` của số được chọn:

- Nếu `index = k-1`, kết thúc vòng lặp và trả về k số đầu.
- Nếu `index > k-1`, tiếp tục partition ở bên trái index.
- Nếu `index < k-1`, tiếp tục partition ở bên phải index.

**Lưu ý**, phương pháp này sẽ sửa mảng đầu vào. Độ phức tạp thời gian là `O(n)`.

```java
import java.util.ArrayList;

public class Solution {

    /**
     * 获取数组中最小的k个数
     *
     * @param input 输入的数组
     * @param k 元素个数
     * @return 最小的k的数列表
     */
    public ArrayList<Integer> GetLeastNumbers_Solution(int[] input, int k) {
        ArrayList<Integer> res = new ArrayList<>();
        if (input == null || input.length == 0 || input.length < k || k < 1) {
            return res;
        }
        int n = input.length;
        int start = 0, end = n - 1;
        int index = partition(input, start, end);
        while (index != k - 1) {
            if (index > k - 1) {
                end = index - 1;
            } else {
                start = index + 1;
            }
            index = partition(input, start, end);
        }
        for (int i = 0; i < k; ++i) {
            res.add(input[i]);
        }
        return res;
    }

    private int partition(int[] input, int start, int end) {
        int index = start - 1;
        for (int i = start; i < end; ++i) {
            if (input[i] < input[end]) {
                swap(input, i, ++index);
            }
        }
        ++index;
        swap(input, index, end);
        return index;
    }

    private void swap(int[] array, int i, int j) {
        int t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
}
```

#### Cách giải hai

Dùng max-heap để lưu k số nhỏ nhất, cuối cùng trả về kết quả.

Độ phức tạp thời gian của phương pháp này là `O(nlogk)`. Tuy chậm hơn một chút nhưng nó không thay đổi mảng đầu vào và **phù hợp với dữ liệu đầu vào rất lớn**.

Giả sử đề bài yêu cầu tìm k số nhỏ nhất từ lượng dữ liệu rất lớn. Vì bộ nhớ có giới hạn nên có thể không thể tải toàn bộ lượng dữ liệu khổng lồ này vào bộ nhớ trong một lần. Khi đó, phương pháp này là phù hợp nhất. Nói cách khác, nó phù hợp với bài toán n rất lớn và k tương đối nhỏ.

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.PriorityQueue;


public class Solution {

    /**
     * 获取数组中最小的k个数
     *
     * @param input 输入的数组
     * @param k 元素个数
     * @return 最小的k的数列表
     */
    public ArrayList<Integer> GetLeastNumbers_Solution(int[] input, int k) {
        ArrayList<Integer> res = new ArrayList<>();
        if (input == null || input.length == 0 || input.length < k || k < 1) {
            return res;
        }

        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(k, Comparator.reverseOrder());
        System.out.println(maxHeap.size());
        for (int e : input) {
            if (maxHeap.size() < k) {
                maxHeap.add(e);
            } else {
                if (maxHeap.peek() > e) {
                    maxHeap.poll();
                    maxHeap.add(e);
                }

            }
        }
        res.addAll(maxHeap);
        return res;
    }
}
```

## 41 Trung vị trong luồng dữ liệu

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Làm thế nào để lấy trung vị trong một luồng dữ liệu? Nếu đọc được một số lẻ giá trị từ luồng dữ liệu thì trung vị là giá trị nằm ở giữa sau khi sắp xếp tất cả các giá trị. Nếu đọc được một số chẵn giá trị từ luồng dữ liệu thì trung vị là giá trị trung bình của hai số ở giữa sau khi sắp xếp tất cả các giá trị. Dùng phương thức `Insert()` để đọc luồng dữ liệu, dùng phương thức `GetMedian()` để lấy trung vị của dữ liệu đã đọc hiện tại.

### Cách giải

Dùng max-heap để lưu một nửa phần tử nhỏ hơn, min-heap để lưu một nửa phần tử lớn hơn. Duy trì sao cho chênh lệch số phần tử của hai heap không vượt quá 1.

```java
import java.util.Comparator;
import java.util.PriorityQueue;

public class Solution {

    private PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    private PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

    /**
     * 插入一个数
     *
     * @param num 数
     */
    public void Insert(Integer num) {

        if (maxHeap.isEmpty() || num < maxHeap.peek()) {
            maxHeap.offer(num);
            if (maxHeap.size() - minHeap.size() > 1) {
                minHeap.offer(maxHeap.poll());
            }

        } else {
            minHeap.offer(num);
            if (minHeap.size() - maxHeap.size() > 1) {
                maxHeap.offer(minHeap.poll());
            }
        }
    }

    /**
     * 获取中位数
     *
     * @return 中位数
     */
    public Double GetMedian() {
        int size1 = maxHeap.size();
        int size2 = minHeap.size();
        if (size1 > size2) {
            return (double) maxHeap.peek();
        }
        if (size1 < size2) {
            return (double) minHeap.peek();
        }

        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}
```

## 42 Tổng lớn nhất của mảng con liên tiếp

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một mảng số nguyên **không rỗng**, các số trong mảng có thể dương hoặc âm.
Một hoặc nhiều số nguyên liên tiếp trong mảng tạo thành một mảng con. Hãy tìm giá trị lớn nhất trong tổng của mọi mảng con.

Yêu cầu độ phức tạp thời gian là `O(n)`.

### Cách giải

Phương pháp quy hoạch động.

res[i] biểu thị tổng lớn nhất của mảng con kết thúc tại số thứ i, vậy chỉ cần tìm `max(res[i])`.

- `res[i] = array[i]`, nếu `res[i - 1] < 0`
- `res[i] = res[i - 1] + array[i]`, nếu `res[i - 1] >= 0`

```java
public class Solution {
    /**
     * 求连续子数组的最大和
     *
     * @param array 数组
     * @return 最大和
     */
    public int FindGreatestSumOfSubArray(int[] array) {
        int n = array.length;
        int[] res = new int[n];
        res[0] = array[0];
        int max = res[0];
        for (int i = 1; i < n; ++i) {
            res[i] = res[i - 1] > 0 ? res[i - 1] + array[i] : array[i];
            max = Math.max(max, res[i]);
        }
        return max;
    }
}
```

## 44 Chữ số ở một vị trí trong dãy số

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Các số được tuần tự hóa vào một chuỗi ký tự theo định dạng `0123456789101112131415…`.

Trong dãy này, chữ số ở vị trí 5 (đếm từ 0) là 5, vị trí 13 là 1, vị trí 19 là 4, v.v.

Hãy viết một hàm tìm chữ số tương ứng với một vị trí bất kỳ.

### Cách giải

Lấy một ví dụ, tìm chữ số ở vị trí 1001 của dãy.

10 vị trí đầu của dãy là `0~9`, tức 10 số có một chữ số. Rõ ràng vị trí 1001 nằm sau 10 số này, vì vậy có thể bỏ qua trực tiếp 10 số đó. Tiếp tục tìm chữ số ở vị trí 991 (991=1001-10) trong phần dãy phía sau. Tiếp theo có 90 số gồm hai chữ số, tổng cộng 180 vị trí; vì 991>180 nên tiếp tục bỏ qua. Tìm từ vị trí 881... cuối cùng có thể tìm được số tương ứng và một chữ số của số đó.

```java
public class Solution {
    /**
     * 求数字序列中某一位的数字
     *
     * @param n 第n位
     * @return 第n位的数字
     */
    public int digitAtIndex(int n) {
        if (n < 0) {
            return -1;
        }
        int digits = 1;
        while (true) {
            long numbers = countOfIntegers(digits);
            if (n < digits * numbers) {
                break;
            }
            n -= numbers * digits;
            ++digits;
        }
        return digitAtIndex(digits, n);

    }

    private long countOfIntegers(int digits) {
        return digits == 1
                ? 10
                : (int) (9 * Math.pow(10, digits - 1));
    }

    private int digitAtIndex(int digits, int n) {
        int beginNumber = getBeginNumber(digits);
        int val =  beginNumber + n / digits;
        int indexFromRight = digits - n % digits;
        for (int i = 1; i < indexFromRight; ++i) {
            val /= 10;
        }
        return val % 10;
    }

    private int getBeginNumber(int digits) {
        return digits == 1
                ? 0
                : (int) Math.pow(10, digits - 1);
    }
}
```

## 45 Xếp mảng thành số nhỏ nhất

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một mảng số nguyên dương, ghép tất cả các số trong mảng thành một số, rồi in số nhỏ nhất trong tất cả các số có thể ghép được.

Ví dụ nhập mảng `[3, 32, 321]`, số nhỏ nhất có thể xếp từ 3 số này là `321323`.

### Cách giải

```java
import java.util.Arrays;

class Solution {

    /**
     * 打印数组元素组成的最小的数字
     *
     * @param nums 数组
     * @return 最小的数字
     */
    public String printMinNumber(int[] nums) {
        if (nums == null || nums.length == 0) {
            return "";
        }
        int n = nums.length;
        String[] strNums = new String[n];
        for (int i = 0; i < n; ++i) {
            strNums[i] = String.valueOf(nums[i]);
        }

        Arrays.sort(strNums, (o1, o2) -> (o1 + o2).compareTo(o2 + o1));

        StringBuilder sb = new StringBuilder();
        for (String str : strNums) {
            sb.append(str);
        }
        return sb.toString();
    }
}
```

## 46 Dịch số thành chuỗi

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Cho một số, dịch nó thành chuỗi theo quy tắc sau:

0 được dịch thành ”a”, 1 được dịch thành ”b”, …… , 11 được dịch thành ”l”, …… , 25 được dịch thành ”z”.

Một số có thể có nhiều cách dịch. Ví dụ 12258 có 5 cách dịch khác nhau, lần lượt là ”bccfi”, ”bwfi”, ”bczi”, ”mcfi” và ”mzi”.

Hãy lập trình một hàm để tính một số có bao nhiêu cách dịch khác nhau.

### Cách giải

Trước hết viết công thức truy hồi, trong đó res biểu thị tổng số cách dịch. Xét ký tự cuối cùng, phán đoán nó và ký tự trước đó có thể tạo thành một cách dịch hợp lệ hay không, rồi tính res[i]:

- Nếu có thể thì `res[i] = res[i - 1] + res[i - 2]`;
- Nếu không thể thì `res[i] = res[i - 1]`.

```java
class Solution {
    /**
     * 获取翻译字符串的方法个数
     *
     * @param s 字符串
     * @return 个数
     */
    public int getTranslationCount(String s) {
        if (s == null || s.length() < 2) {
            return 1;
        }
        char[] chars = s.toCharArray();
        int n = chars.length;
        int[] res = new int[n];
        res[0] = 1;
        res[1] = isInRange(chars[0], chars[1]) ? 2 : 1;
        for (int i = 2; i < n; ++i) {
            res[i] = res[i - 1] + (isInRange(chars[i - 1], chars[i]) ? res[i - 2] : 0);
        }
        return res[n - 1];
    }

    private boolean isInRange(char a, char b) {
        int s = (a - '0') * 10 + (b -'0');
        return s >= 10 && s <= 25;
    }
}
```

## 47 Giá trị quà tặng lớn nhất

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Mỗi ô trên bàn cờ `m×n` đều đặt một món quà, mỗi món quà có một giá trị nhất định (giá trị lớn hơn 0).

Bạn có thể bắt đầu lấy quà trong ô từ góc trên bên trái của bàn cờ, mỗi lần di chuyển sang trái hoặc xuống một ô cho đến khi tới góc dưới bên phải bàn cờ.

Cho một bàn cờ và các món quà trên đó, hãy tính giá trị quà tặng lớn nhất mà bạn có thể lấy được.

### Cách giải

Viết công thức truy hồi, trong đó res biểu thị giá trị quà tặng lớn nhất nhận được.

```java
res[i][j] = Math.max(res[i - 1][j], res[i][j - 1]) + grid[i][j];
```

```java
class Solution {
    /**
     * 获取礼物的最大价值
     *
     * @param grid 数组
     * @return 最大价值
     */
    public int getMaxValue(int[][] grid) {
        if (grid == null || grid.length == 0) {
            return 0;
        }
        int m = grid.length;
        int n = grid[0].length;
        int[][] res = new int[m][n];
        res[0][0] = grid[0][0];
        for (int j = 1; j < n; ++j) {
            res[0][j] = res[0][j - 1] + grid[0][j];
        }
        for (int i = 1; i < m; ++i) {
            res[i][0] = res[i - 1][0] + grid[i][0];
        }
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                res[i][j] = Math.max(res[i - 1][j], res[i][j - 1]) + grid[i][j];
            }
        }
        return res[m - 1][n - 1];
    }
}
```

## 48 Chuỗi con dài nhất không chứa ký tự trùng lặp

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Hãy tìm trong chuỗi một chuỗi con dài nhất không chứa ký tự trùng lặp và tính độ dài của chuỗi con dài nhất đó.

Giả sử chuỗi chỉ chứa các ký tự từ `a` đến `z`.

### Cách giải

Quy hoạch động.

`res[i]` biểu thị độ dài chuỗi không trùng lặp dài nhất kết thúc bằng ký tự `s[i]`. Xét `s[i]`:

- Nếu `s[i]` chưa từng xuất hiện ở phía trước thì `res[i] = res[i - 1] + 1`;
- Nếu `s[i]` đã xuất hiện ở phía trước, xét vị trí xuất hiện lần trước `index`, khoảng cách đến `i` là `d`, và quan hệ với `res[i - 1]`:
  - Nếu `d <= res[i - 1]`, chứng tỏ nó nằm trong chuỗi con tạo bởi `res[i - 1]`, khi đó `res[i] = d`;
  - Nếu `d > res[i - 1]`, chứng tỏ nó nằm bên trái chuỗi con tạo bởi `res[i - 1]`, khi đó `res[i] = res[i - 1] + 1`.

Cần dùng một mảng t để ghi lại vị trí xuất hiện của ký tự hiện tại.

```java
class Solution {
    /**
     * 最长不含重复字符的子字符串
     *
     * @param s 字符串
     * @return 最长不重复字符子串
     */
    public int longestSubstringWithoutDuplication(String s) {
        if (s == null || s.length() == 0) {
            return 0;
        }
        char[] chars = s.toCharArray();
        int[] t = new int[26];
        for (int i = 0; i < 26; ++i) {
            t[i] = -1;
        }
        t[chars[0] - 'a'] = 0;
        int n = chars.length;
        int[] res = new int[n];
        res[0] = 1;
        int max = res[0];
        for (int i = 1; i < n; ++i) {
            int index = t[chars[i] - 'a'];
            int d = i - index;
            res[i] = (index == -1 || d > res[i - 1])
                    ? res[i - 1] + 1
                    : d;

            t[chars[i] - 'a'] = i;
            max = Math.max(max, res[i]);
        }
        return max;
    }
}
```

## 52 Node chung đầu tiên của hai linked list

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập hai linked list, tìm node chung đầu tiên của chúng.

**Ví dụ**

```
给出两个链表如下所示：
A：        a1 → a2
                   ↘
                     c1 → c2 → c3
                   ↗
B:     b1 → b2 → b3

输出第一个公共节点c1
```

### Cách giải

Trước hết duyệt hai linked list, tính độ dài của hai linked list, sau đó tính chênh lệch độ dài `|n1 - n2|`.

Linked list dài hơn đi trước `|n1 - n2|` bước, sau đó hai linked list cùng đi; node tại lần gặp đầu tiên là node chung đầu tiên của hai linked list.

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
class Solution {

    /**
     * 求两链表第一个公共节点
     *
     * @param headA 链表A
     * @param headB 链表B
     * @return 第一个公共节点
     */
    public ListNode findFirstCommonNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }
        int n1 = len(headA), n2 = len(headB);
        ListNode p1 = headA, p2 = headB;
        if (n1 > n2) {
            for (int i = 0; i < n1 - n2; ++i) {
                p1 = p1.next;
            }
        } else if (n1 < n2) {
            for (int i = 0; i < n2 - n1; ++i) {
                p2 = p2.next;
            }
        }
        while (p1 != p2 && p1 != null && p2 != null) {
            p1 = p1.next;
            p2 = p2.next;
        }
        return (p1 == null || p2 == null) ? null : p1;
    }

    private int len(ListNode head) {
        int n = 0;
        ListNode cur = head;
        while (cur != null) {
            ++n;
            cur = cur.next;
        }
        return n;
    }
}
```

## 53.1 Số lần xuất hiện của một số trong mảng đã sắp xếp

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Đếm số lần một số xuất hiện trong mảng đã sắp xếp.

Ví dụ nhập mảng đã sắp xếp `[1, 2, 3, 3, 3, 3, 4, 5]` và số 3; vì 3 xuất hiện 4 lần trong mảng nên xuất 4.

**Ví dụ**

```
输入：[1, 2, 3, 3, 3, 3, 4, 5] ,  3

输出：4
```

### Cách giải

Tìm vị trí xuất hiện đầu tiên và cuối cùng của k.

Khi tìm k đầu tiên, dùng phương pháp chia đôi. Nếu `nums[m] == k`, kiểm tra vị trí ngay trước nó có cũng là k hay không; nếu không thì đây là k đầu tiên, trả về trực tiếp. Nếu có thì đệ quy tìm k đầu tiên ở bên trái.

Tìm k cuối cùng cũng tương tự.

```java
class Solution {
    /**
     * 求数字k在排序数组中出现的次数
     *
     * @param nums 数组
     * @param k 数字k
     * @return k在数组中出现的次数
     */
    public int getNumberOfK(int[] nums, int k) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int start = 0, end = nums.length - 1;
        int first = getFirstK(nums, start, end, k);
        int last = getLastK(nums, start, end, k);
        if (first > -1 && last > -1) {
            return last - first + 1;
        }
        return 0;
    }

    private int getFirstK(int[] nums, int start, int end, int k) {
        if (start > end) {
            return -1;
        }
        int m = start + ((end - start) >> 1);
        if (nums[m] == k) {
            if (m == 0 || (m > 0 && nums[m - 1] != k)) {
                return m;
            } else {
                end = m - 1;
            }
        } else {
            if (nums[m] > k) {
                end = m - 1;
            } else {
                start = m + 1;
            }
        }
        return getFirstK(nums, start, end, k);
    }

    private int getLastK(int[] nums, int start, int end, int k) {
        if (start > end) {
            return -1;
        }
        int m = start + ((end - start) >> 1);
        if (nums[m] == k) {
            if (m == nums.length - 1 || (m < nums.length - 1 && nums[m + 1] != k)) {
                return m;
            } else {
                start = m + 1;
            }
        } else {
            if (nums[m] > k) {
                end = m - 1;
            } else {
                start = m + 1;
            }
        }
        return getLastK(nums, start, end, k);

    }
}
```

## 53.2 Số bị thiếu trong 0 đến n-1

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Tất cả các số trong một mảng tăng dần có độ dài `n-1` đều là duy nhất, và mỗi số đều nằm trong phạm vi `0` đến `n-1`.

Trong phạm vi `0` đến `n-1` có `n` số, đúng một số không nằm trong mảng; hãy tìm số đó.

**Ví dụ**

```
输入：[0,1,2,4]

输出：3
```

### Cách giải

Tìm số đầu tiên không tương ứng với chỉ số.

Trường hợp đặc biệt:

- Nếu mọi chỉ số đều tương ứng thì cần trả về `最后一个数+1`;
- Nếu số bị thiếu là số đầu tiên thì trả về 0.

```java
class Solution {
    /**
     * 获取0~n-1缺失的数字
     *
     * @param nums 数组
     * @return 缺失的数字
     */
    public int getMissingNumber(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int n = nums.length;
        int start = 0, end = n - 1;
        while (start <= end) {
            int mid = start + ((end - start) >> 1);
            if (nums[mid] != mid) {
                if (mid == 0 || nums[mid - 1] == mid - 1) {
                    return mid;
                }
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }
        return start == n ? n : -1;

    }
}
```

## 53.3 Phần tử có giá trị bằng chỉ số trong mảng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Giả sử mỗi phần tử trong một mảng tăng dần đơn điệu đều là số nguyên và duy nhất.

Hãy triển khai một hàm để tìm một phần tử bất kỳ có giá trị bằng chỉ số của nó trong mảng.

Ví dụ, trong mảng `[-3, -1, 1, 3, 5]`, số 3 bằng với chỉ số của nó.

**Ví dụ**

```
输入：[-3, -1, 1, 3, 5]

输出：3
```

**Lưu ý**: nếu không tồn tại thì trả về -1.

### Cách giải

Tìm bằng phương pháp chia đôi.

- Nếu phần tử hiện tại bằng chỉ số tương ứng thì trả về trực tiếp chỉ số đó;
- Nếu phần tử hiện tại lớn hơn chỉ số đó thì tìm ở bên trái;
- Nếu phần tử hiện tại nhỏ hơn chỉ số đó thì tìm ở bên phải.

```java
class Solution {
    /**
     * 找出单调递增数组中数值和下标相等的元素
     *
     * @param nums 数组
     * @return 数值与下标相等的元素
     */
    public int getNumberSameAsIndex(int[] nums) {
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int start = 0, end = nums.length - 1;
        while (start <= end) {
            int mid = start + ((end - start) >> 1);
            if (nums[mid] == mid) {
                return mid;
            }
            if (nums[mid] < mid) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
        return -1;
    }
}
```

## 55.1 Độ sâu của cây nhị phân

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập node gốc của một cây nhị phân, tìm độ sâu của cây.

Các node lần lượt đi qua từ node gốc đến node lá (bao gồm node gốc và node lá) tạo thành một đường đi của cây; độ dài của đường đi dài nhất là độ sâu của cây.

**Ví dụ**

```
输入：二叉树[8, 12, 2, null, null, 6, 4, null, null, null, null]如下图所示：
    8
   / \
  12  2
     / \
    6   4

输出：3
```

### Cách giải

Chỉ cần dùng đệ quy.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    /**
     * 求二叉树的深度
     *
     * @param root 二叉树根结点
     * @return 深度
     */
    public int treeDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int lDepth = treeDepth(root.left);
        int rDepth = treeDepth(root.right);
        return 1 + Math.max(lDepth, rDepth);
    }
}
```

### Trường hợp kiểm thử

1. Kiểm thử chức năng (nhập cây nhị phân thông thường; mọi node trong cây nhị phân đều không có cây con trái/phải);
2. Kiểm thử đầu vào đặc biệt (cây nhị phân chỉ có một node; con trỏ node đầu của cây nhị phân là rỗng).

## 55.2 Cây nhị phân cân bằng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập node gốc của một cây nhị phân, phán đoán cây đó có phải cây nhị phân cân bằng hay không.

Nếu độ sâu cây con trái và cây con phải của mọi node bất kỳ trong cây nhị phân chênh lệch không quá 1 thì đó là cây nhị phân cân bằng.

**Lưu ý:**

- Quy ước cây rỗng cũng là một cây nhị phân cân bằng.

**Ví dụ**

```
输入：二叉树[5,7,11,null,null,12,9,null,null,null,null]如下所示，
    5
   / \
  7  11
    /  \
   12   9

输出：true
```

### Cách giải

#### Cách giải một

Tính độ sâu của con trái và con phải của từng node, rồi phán đoán node đó có cân bằng hay không.

Phương pháp này cần duyệt lặp lại các node nhiều lần, không khuyến nghị.

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    /**
     * 判断是否是平衡二叉树
     *
     * @param root 二叉树根结点
     * @return 是否是平衡二叉树
     */
    public boolean isBalanced(TreeNode root) {
        if (root == null) {
            return true;
        }
        if (Math.abs(treeDepth(root.left) - treeDepth(root.right)) > 1) {
            return false;
        }
        return isBalanced(root.left) && isBalanced(root.right);
    }

    private int treeDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int lDepth = treeDepth(root.left);
        int rDepth = treeDepth(root.right);
        return 1 + Math.max(lDepth, rDepth);
    }
}
```

#### Cách giải hai

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    private boolean isBalanced;

    /**
     * 判断是否是平衡二叉树
     *
     * @param root 二叉树根结点
     * @return 是否是平衡二叉树
     */
    public boolean isBalanced(TreeNode root) {
        if (root == null) {
            return true;
        }
        isBalanced = true;
        treeDepth(root);
        return isBalanced;
    }

    private int treeDepth(TreeNode root) {
        if (root == null || !isBalanced) {
            return 0;
        }
        int lDepth = treeDepth(root.left);
        int rDepth = treeDepth(root.right);
        if (Math.abs(lDepth - rDepth) > 1) {
            isBalanced = false;
        }
        return 1 + Math.max(lDepth, rDepth);

    }
}
```

## 56.1 Hai số chỉ xuất hiện một lần trong mảng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Trong một mảng số nguyên, ngoài hai số, các số khác đều xuất hiện hai lần.

Hãy viết chương trình tìm hai số chỉ xuất hiện một lần này.

Có thể giả định hai số này chắc chắn tồn tại.

**Ví dụ**

```
输入：[1,2,3,3,4,4]

输出：[1,2]
```

### Cách giải

Nếu trong mảng có một số xuất hiện một lần, các số khác đều xuất hiện hai lần thì có thể dễ dàng tìm ra bằng phép XOR `^`.

Nhưng hiện tại có hai số xuất hiện một lần, vậy hãy nghĩ cách tách hai số này ra; sau đó thực hiện XOR riêng trên hai mảng đã tách thì sẽ tìm được chúng.

Trước hết thực hiện XOR, kết quả là phép XOR của hai số khác nhau, chắc chắn khác 0. Vì vậy biểu diễn nhị phân của kết quả chắc chắn có một bit 1. Dựa vào vị trí xuất hiện của bit 1 này trong biểu diễn nhị phân để chia mảng. Như vậy hai số chỉ xuất hiện một lần sẽ bị tách ra, sau đó chỉ cần tìm XOR.

```java
class Solution {
    /**
     * 求数组中只出现一次的两个数字
     *
     * @param nums 数字
     * @return 两个数字组成的数组
     */
    public int[] findNumsAppearOnce(int[] nums) {
        if (nums == null || nums.length < 2) {
            return null;
        }
        int xorRes = 0;
        for (int e : nums) {
            xorRes ^= e;
        }
        int[] res = new int[2];
        int index = indexOf1(xorRes);
        for (int e : nums) {
            if (isBit1(e, index)) {
                res[0] ^= e;
            } else {
                res[1] ^= e;
            }
        }
        return res;


    }

    private int indexOf1(int val) {
        int index = 0;
        while ((val & 1) == 0) {
            val = val >> 1;
            ++index;
        }
        return index;
    }

    private boolean isBit1(int val, int index) {
        for (int i = 0; i < index; ++i) {
            val = val >> 1;
        }
        return (val & 1) == 1;
    }
}
```

## 56.2 Số duy nhất chỉ xuất hiện một lần trong mảng

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Trong một mảng, ngoài một số chỉ xuất hiện một lần, các số khác đều xuất hiện ba lần.

Hãy tìm số chỉ xuất hiện một lần đó.

Có thể giả định số thỏa mãn điều kiện chắc chắn tồn tại.

**Câu hỏi suy nghĩ:**

- Nếu yêu cầu chỉ dùng thời gian `O(n)` và không gian bổ sung `O(1)` thì phải làm thế nào?

### Cách giải

Cộng riêng các bit xuất hiện trong biểu diễn nhị phân của từng phần tử trong mảng. Với các số xuất hiện ba lần, tổng cuối cùng ở mỗi bit chắc chắn chia hết cho 3. Bit nào không chia hết cho 3 thì thuộc về số chỉ xuất hiện một lần.

```java
class Solution {
    /**
     * 找出数组中只出现一次的数字，其它数字都出现三次
     *
     * @param nums 数字
     * @return 只出现一次的数字
     */
    public int findNumberAppearingOnce(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int[] bits = new int[32];
        int n = nums.length;
        for (int i = 0; i < n; ++i) {
            int val = nums[i];
            for (int j = 0; j < 32; ++j) {
                bits[j] += (val & 1);
                val = val >> 1;
            }
        }
        int res = 0;
        for (int i = 0; i < 32; ++i) {
            if (bits[i] % 3 != 0) {
                res += Math.pow(2, i);
            }
        }
        return res;
    }
}
```

## 57.1 Hai số có tổng bằng S

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một mảng và một số s, tìm trong mảng hai số có tổng đúng bằng s.

Nếu có nhiều cặp số có tổng bằng s thì xuất bất kỳ cặp nào.

Có thể cho rằng mỗi bộ đầu vào đều chứa ít nhất một kết quả thỏa mãn điều kiện.

**Ví dụ**

```
输入：[1,2,3,4] , sum=7

输出：[3,4]
```

### Cách giải

Dùng set để ghi lại các phần tử.

```java
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * 在数组中找出和为target的两个数
     *
     * @param nums 数组
     * @param target 目标和
     * @return 满足条件的两个数构成的数组
     */
    public int[] findNumbersWithSum(int[] nums, int target) {
        if (nums == null || nums.length < 2) {
            return null;
        }
        int n = nums.length;
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < n; ++i) {
            if (set.contains(target - nums[i])) {
                return new int[] {target- nums[i], nums[i]};
            }
            set.add(nums[i]);
        }
        return null;
    }
}
```

## 57.2 Dãy số dương liên tiếp có tổng bằng S

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một số dương s, in ra tất cả các dãy số dương liên tiếp có tổng bằng s (chứa ít nhất hai số).

Ví dụ nhập 15, vì `1+2+3+4+5=4+5+6=7+8=15`, nên kết quả in ra 3 dãy liên tiếp 1 ～ 5, 4 ～ 6 và 7 ～ 8.

**Ví dụ**

```
输入：15

输出：[[1,2,3,4,5],[4,5,6],[7,8]]
```

### Cách giải

Dùng hai con trỏ `p, q` biểu thị giá trị nhỏ nhất và lớn nhất của dãy. Nếu tổng dãy lớn hơn s thì loại bỏ giá trị nhỏ hơn khỏi dãy, tức `++p`; nếu tổng dãy nhỏ hơn s thì mở rộng dãy sang phải để bao gồm thêm một số, tức `++q`.

Dừng khi p vượt quá một nửa s.

```java
import java.util.*;


class Solution {

    /**
     * 找出和为sum的连续正整数序列
     *
     * @param sum 和
     * @return 结果列表
     */
    public List<List<Integer>> findContinuousSequence(int sum) {
        List<List<Integer>> res = new ArrayList<>();
        if (sum < 3) {
            return res;
        }
        int p = 1, q = 2;
        int mid = (1 + sum) >> 1;
        int curSum = p + q;
        while (p < mid) {
            if (curSum == sum) {
                res.add(getList(p, q));
            }
            while (curSum > sum && p < mid) {
                curSum -= p;
                ++p;
                if (curSum == sum) {
                    res.add(getList(p, q));
                }
            }
            ++q;
            curSum += q;
        }
        return res;
    }

    private List<Integer> getList(int from, int to) {
        List<Integer> res = new ArrayList<>();
        for (int i = from; i <= to; ++i) {
            res.add(i);
        }
        return res;
    }
}
```

## 58.1 Đảo thứ tự các từ

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Nhập một câu tiếng Anh, đảo thứ tự các từ trong câu nhưng không thay đổi thứ tự các ký tự trong từ.

Để đơn giản, xử lý dấu câu giống như chữ cái thông thường.

Ví dụ nhập chuỗi `"I am a student."` thì xuất `"student. a am I"`.

**Ví dụ**

```
输入："I am a student."

输出："student. a am I"
```

### Cách giải

Trước hết tách chuỗi thành mảng theo khoảng trắng, sau đó đảo ngược mảng, cuối cùng ghép các phần tử và trả về.

```java
class Solution {
    /**
     * 翻转单词
     *
     * @param s 字符串
     * @return 翻转后的字符串
     */
    public String reverseWords(String s) {
        if (s == null || s.length() < 2) {
            return s;
        }

        String[] arr = s.split(" ");
        int p = 0, q = arr.length - 1;
        while (p < q) {
            swap(arr, p++, q--);
        }
        return String.join(" ", arr);
    }
    private void swap(String[] arr, int p, int q) {
        String t = arr[p];
        arr[p] = arr[q];
        arr[q] = t;
    }
}
```

## 58.2 Xoay trái chuỗi

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Phép xoay trái chuỗi là chuyển một số ký tự ở đầu chuỗi ra cuối chuỗi.

Hãy định nghĩa một hàm thực hiện phép xoay trái chuỗi.

Ví dụ nhập chuỗi `"abcdefg"` và số 2, hàm sẽ trả về kết quả sau khi xoay trái 2 vị trí là `"cdefgab"`.

**Lưu ý:**

- Dữ liệu bảo đảm n nhỏ hơn hoặc bằng độ dài chuỗi đầu vào.

**Ví dụ**

```
输入："abcdefg" , n=2

输出："cdefgab"
```

### Cách giải

Trước hết đảo ngược n ký tự đầu, sau đó đảo ngược các ký tự còn lại, cuối cùng đảo ngược toàn bộ chuỗi.

```java
class Solution {

    /**
     * 左旋转字符串
     *
     * @param str 字符串
     * @param n 左旋的位数
     * @return 旋转后的字符串
     */
    public String leftRotateString(String str, int n) {
        if (str == null || n < 1 || n > str.length()) {
            return str;
        }
        char[] chars = str.toCharArray();
        int len = chars.length;
        reverse(chars, 0, n - 1);
        reverse(chars, n, len - 1);
        reverse(chars, 0, len - 1);
        return new String(chars);
    }

    private void reverse(char[] chars, int p, int q) {
        while (p < q) {
            swap(chars, p++, q--);
        }
    }

    private void swap(char[] chars, int p, int q) {
        char t = chars[p];
        chars[p] = chars[q];
        chars[q] = t;
    }
}
```

## 59.1 Giá trị lớn nhất của cửa sổ trượt

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Cho một mảng và kích thước cửa sổ trượt, hãy tìm giá trị lớn nhất trong mọi cửa sổ trượt.

Ví dụ, nếu mảng đầu vào là `[2, 3, 4, 2, 6, 2, 5, 1]` và kích thước cửa sổ trượt là 3 thì có tổng cộng 6 cửa sổ trượt, giá trị lớn nhất của chúng lần lượt là `[4, 4, 6, 6, 6, 5]`.

**Lưu ý:**

- Dữ liệu bảo đảm k lớn hơn 0 và nhỏ hơn hoặc bằng độ dài mảng.

**Ví dụ**

```
输入：[2, 3, 4, 2, 6, 2, 5, 1] , k=3

输出: [4, 4, 6, 6, 6, 5]
```

### Cách giải

Dùng deque, bảo đảm phần đầu queue lưu chỉ số của giá trị lớn nhất; khi chỉ số ở đầu queue hết hạn thì lấy ra.

Chi tiết:

- Khi phần tử mảng nhỏ hơn phần tử tương ứng với chỉ số ở đầu queue, chèn chỉ số phần tử mảng vào cuối queue. (Nếu ở cuối queue có phần tử nhỏ hơn phần tử này thì lấy ra trước rồi mới chèn.)
- Khi phần tử mảng lớn hơn hoặc bằng phần tử tương ứng với chỉ số ở đầu queue, lấy các phần tử ra cho đến khi queue rỗng rồi chèn chỉ số phần tử mảng.

```java
import java.util.Deque;
import java.util.LinkedList;

class Solution {
    /**
     * 求滑动窗口的最大值
     *
     * @param nums 数组
     * @param k 滑动窗口的大小
     * @return 最大值构成的数组
     */
    public int[] maxInWindows(int[] nums, int k) {
        if (nums == null || k < 1 || k > nums.length) {
            return null;
        }
        Deque<Integer> queue = new LinkedList<>();
        int[] res = new int[nums.length - k + 1];
        for (int i = 0; i < k; ++i) {
            if (queue.isEmpty()) {
                queue.addLast(i);
            } else {
                if (nums[queue.getFirst()] < nums[i]) {
                    while (!queue.isEmpty()) {
                        queue.removeFirst();
                    }
                } else {
                    while (nums[queue.getLast()] < nums[i]) {
                        queue.removeLast();
                    }
                }
                queue.addLast(i);
            }
        }

        for (int i = k; i < nums.length; ++i) {
            res[i - k] = nums[queue.getFirst()];
            if (nums[i] < nums[queue.getFirst()]) {
                while (nums[queue.getLast()] < nums[i]) {
                    queue.removeLast();
                }
            } else {
                while (!queue.isEmpty()) {
                    queue.removeFirst();
                }
            }
            queue.addLast(i);
            if (i - queue.getFirst() == k) {
                queue.removeFirst();
            }
        }
        res[nums.length - k] = nums[queue.getFirst()];
        return res;
    }
}
```

## 61 Sảnh trong bộ bài

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Rút ngẫu nhiên `5` lá bài từ bộ bài, phán đoán có phải là một sảnh hay không, tức 5 lá bài này có liên tiếp hay không.

`2～10` là chính các số đó, `A` là `1`, `J` là `11`, `Q` là `12`, `K` là `13`, hai lá joker có thể được xem là bất kỳ số nào.

Để thuận tiện, hai lá joker đều được biểu thị bằng `0`, đồng thời giả sử bộ bài này có hai lá joker.

**Ví dụ 1**

```
输入：[8,9,10,11,12]

输出：true
```

**Ví dụ 2**

```
输入：[0,8,9,11,12]

输出：true
```

### Cách giải

- Sắp xếp mảng;
- Tính số lượng 0 `zeroCount`;
- Bắt đầu duyệt từ số đầu tiên khác 0, so sánh với số tiếp theo; nếu bằng nhau thì trả về `false` ngay, nếu không thì cộng dồn `gap`;
- Phán đoán `zeroCount` có lớn hơn hoặc bằng `gap` hay không.

```java
import java.util.Arrays;

class Solution {

    /**
     * 判断是否是连续的数字
     *
     * @param numbers 数组
     * @return 是否是顺子
     */
    public boolean isContinuous(int [] numbers) {
        if (numbers == null || numbers.length == 0) {
            return false;
        }
        int zeroCount = 0;
        Arrays.sort(numbers);
        for (int e : numbers) {
            if (e > 0) {
                break;
            }
            ++zeroCount;
        }

        int p = zeroCount, q = p + 1, n = numbers.length;
        int gap = 0;
        while (q < n) {
            if (numbers[p] == numbers[q]) {
                return false;
            }
            gap += (numbers[q] - numbers[p] - 1);
            p = q;
            ++q;
        }
        return gap <= zeroCount;

    }
}
```

## 62 Số cuối cùng còn lại trong vòng tròn

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

`0, 1, …, n-1` gồm `n ` số `(n>0)` được xếp thành một vòng tròn; bắt đầu từ số `0`, mỗi lần xóa số thứ `m` khỏi vòng tròn.

Hãy tìm số cuối cùng còn lại trong vòng tròn.

**Ví dụ**

```
输入：n=5 , m=3

输出：3
```

### Cách giải

#### Cách giải một

Dùng mảng vòng để lưu từng số; mỗi bước kiểm tra số ở vị trí tương ứng có phải `-1` hay không, nếu là `-1` thì không tính bước, cứ tiếp tục đi `m` bước. Đặt số ở vị trí đó thành `-1`.

Khi có `n-1` số bị đặt thành `-1`, xuất số duy nhất khác `-1`.

Giải thích:

- Cũng có thể dựng một linked list vòng; mỗi lần đi `m` bước thì xóa node hiện tại. Khi chỉ còn một node thì trả về node đó.
- Với cách giải này, mỗi lần xóa một số cần tính `m` bước, có tổng cộng `n` số, do đó độ phức tạp thời gian là `O(mn)`, độ phức tạp không gian là `O(n)`.

```java
class Solution {

    /**
     * 求圆圈最后一个数字
     *
     * @param n n个数 [0..n-1]
     * @param m 每次删除第 m 个数
     * @return 最后一个数字
     */
    public int lastRemaining(int n, int m) {
        int cnt = 0;
        int s = -1;
        int[] nums = new int[n];
        for (int i = 1; i < n; ++i) {
            nums[i] = i;
        }

        int e = -1;
        while (cnt < n - 1) {
            int i = 0;
            while (i < m) {
                e = (e + 1) % n;
                if (nums[e] != -1) {
                    ++i;
                }
            }

            ++cnt;
            nums[e] = -1;
            s = e;
        }
        for (int i = 0; i < n; ++i) {
            if (nums[i] != -1) {
                return nums[i];
            }
        }
        return 0;
    }
}
```

#### Cách giải hai

Phân tích như sau:

Số đầu tiên bị xóa trong vòng tròn là `m-1`. Khi đó các số còn lại lần lượt là:

```
0   1   2   3  ...  m-2   m  ...  n-1
```

Vì lần tiếp theo (còn `n-1` số) bắt đầu từ m, nên đổi số thứ tự của m thành 0, lần lượt đổi như sau:

```
old ->  new

m   ->  0
m+1 ->  1
m+2 ->  2
.
.
.
n-1 ->  n-1-m
0   ->  n-m
1   ->  n-m+1
.
.
.
m-2 ->  n-2
```

Giả sử bài toán con `x'` là nghiệm cuối cùng, vậy tương ứng với bài toán ban đầu `x` sẽ là gì?

```
new ->  old

0   ->  m
1   ->  m+1
2   ->  m+2
.
.
.
n-1-m   ->  n-1
n-m ->  0
n-m+1   ->  1
.
.
.
n-2 ->  m-2

x'  ->  x
```

```
x = (x' + m) % n
```

Vì vậy có công thức truy hồi:

```
f(i) = (f(i - 1) + m) % i;
```

Độ phức tạp thời gian của thuật toán là `O(n)`, độ phức tạp không gian là `O(1)`.

```java
class Solution {

    /**
     * 求圆圈最后一个数字
     *
     * @param n n个数 [0..n-1]
     * @param m 每次删除第 m 个数
     * @return 最后一个数字
     */
    public int lastRemaining(int n, int m) {
        if (n < 1 || m < 1) {
            return -1;
        }
        int res = 0;
        for (int i = 2; i <= n; ++i) {
            res = (res + m) % i;
        }
        return res;
    }
}
```

## 63 Lợi nhuận lớn nhất từ cổ phiếu

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Giả sử giá của một cổ phiếu được lưu trong mảng theo thứ tự thời gian, lợi nhuận có thể nhận được từ giao dịch mua bán cổ phiếu đó là bao nhiêu?

Ví dụ giá của một cổ phiếu tại một số thời điểm là `[9, 11, 8, 5, 7, 12, 16, 14]`.

Nếu có thể mua khi giá là 5 và bán khi giá là 16 thì có thể nhận lợi nhuận lớn nhất là 11.

**Ví dụ**

```
输入：[9, 11, 8, 5, 7, 12, 16, 14]

输出：11
```

### Cách giải

Khi duyệt đến nums[i], tính hiệu giữa nums[i] và giá trị nhỏ nhất `min` của i số trước đó, cuối cùng tìm hiệu lớn nhất.

```java
class Solution {
    /**
     * 股票的最大利润
     *
     * @param nums 数组
     * @return 最大利润
     */
    public int maxDiff(int[] nums) {
        if (nums == null || nums.length < 2) {
            return 0;
        }
        int min = nums[0];
        int maxGap = nums[1] - nums[0];
        for (int i = 2, n = nums.length; i < n; ++i) {
            min = Math.min(min, nums[i - 1]);
            maxGap = Math.max(maxGap, nums[i] - min);
        }
        return maxGap > 0 ? maxGap : 0;
    }
}
```

## 64 Tính 1+2+…+n

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Tính `1+2+…+n`, yêu cầu không được sử dụng các từ khóa `乘除法、for、while、if、else、switch、case` và câu lệnh điều kiện `A?B:C`.

**Ví dụ**

```
输入：10

输出：55
```

### Cách giải

Dùng Stream API.

```java
import java.util.stream.IntStream;

class Solution {

    /**
     * 求1+2+…+n（不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C））
     *
     * @param n 1~n
     * @return 1~n的和
     */
    public int getSum(int n) {
        return IntStream.rangeClosed(1, n).sum();
    }
}
```

## 65 Cộng không dùng cộng, trừ, nhân, chia

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Viết một hàm tính tổng của hai số nguyên, yêu cầu trong thân hàm không được sử dụng các phép toán ＋、－、×、÷.

**Ví dụ**

```
输入：num1 = 1 , num2 = 2

输出：3
```

### Cách giải

Trước hết thực hiện XOR hai số để tìm kết quả cộng không có phần nhớ. Sau đó lặp lại phép AND theo bit giữa hai số rồi dịch trái một bit, cho đến khi phần nhớ bằng 0.

```java
class Solution {

    /**
     * 不用加减乘除做加法
     *
     * @param num1 数1
     * @param num2 数2
     * @return 两数之和
     */
    public int add(int num1, int num2) {
        int sum, carry;
        while (true) {
            sum = num1 ^ num2;
            carry = (num1 & num2) << 1;
            num1 = sum;
            num2 = carry;
            if (num2 == 0) {
                break;
            }
        }
        return num1;
    }
}
```

## 66 Xây dựng mảng tích

Nguồn: [AcWing](https://www.acwing.com/problem/content/15/)

### Mô tả bài toán

Cho một mảng `A[0, 1, …, n-1]`, hãy xây dựng mảng `B[0, 1, …, n-1]`, trong đó `B` chứa các phần tử `B[i]=A[0]×A[1]×… ×A[i-1]×A[i+1]×…×A[n-1]`.

Không được sử dụng phép chia.

**Ví dụ**

```
输入：[1, 2, 3, 4, 5]

输出：[120, 60, 40, 30, 24]
```

**Câu hỏi suy nghĩ:**

- Có thể chỉ sử dụng không gian hằng số hay không? (Ngoài mảng đầu ra)

### Cách giải

Coi mỗi phần tử `B[i]` là tích của hai nửa, tức `A[0]xA[1]x...xA[i-1]` và `A[i+1]xA[i+2]xA[n-1]`.

- Với nửa bên trái: B[i] = B[i - 1] \* A[i - 1]

```java
class Solution {

    /**
     * 构建乘积数组
     *
     * @param A 数组A
     * @return 乘积数组B
     */
    public int[] multiply(int[] A) {
        if (A == null || A.length < 1) {
            return A;
        }
        int n = A.length;
        int[] B = new int[n];
        B[0] = 1;
        for (int i = 1; i < n; ++i) {
            B[i] = B[i - 1] * A[i - 1];
        }

        int t = 1;
        for (int i = n - 2; i >= 0; --i) {
            t *= A[i + 1];
            B[i] *= t;
        }

        return B;

    }
}
```
