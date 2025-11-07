def sum_numbers(numbers):
    """
    累加函数：计算列表中所有数字的总和
    
    参数:
        numbers: 数字列表
    
    返回:
        所有数字的总和
    """
    total = 0
    for num in numbers:
        total += num
    return total


# 测试累加函数
# 测试用例 1: 基本累加
test_list1 = [1, 2, 3, 4, 5]
result1 = sum_numbers(test_list1)
print(f"测试 1: {test_list1} 的累加结果 = {result1}")

