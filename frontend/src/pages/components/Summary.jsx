import { Stat, StatLabel, StatNumber, Box } from '@chakra-ui/react';

function Summary({ transactions }) {
    // Tính toán các giá trị
    const totalRevenue = transactions.reduce((total, transaction) => {
        const amount = parseInt(transaction.total_amount, 10);
        return total + (isNaN(amount) ? 0 : amount);
    }, 0);
    const totalOrders = transactions.length;
    const commission = totalRevenue * 0.1;

    return (
        <Box display="flex" justifyContent="space-around" w="100%">
            <Stat>
                <StatLabel>Tổng doanh thu</StatLabel>
                <StatNumber>{totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Số lượng đơn hàng</StatLabel>
                <StatNumber>{totalOrders}</StatNumber>
            </Stat>
            <Stat>
                <StatLabel>Tiền hoa hồng</StatLabel>
                <StatNumber>{commission.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</StatNumber>
            </Stat>
        </Box>
    );
}

export default Summary;
