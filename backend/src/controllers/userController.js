// Thêm hàm để test xem cổng POST hoạt động chưa
export const registerUser = async (req, res) => {
    try {
        // Lấy dữ liệu gửi lên từ req.body
        const { name, email, password } = req.body;

        // Trả về kết quả test cho Postman hoặc Frontend nhìn thấy
        res.status(200).json({
            message: "Cổng POST ok rồi bạn ơi!",
            dataReceived: { name, email, password }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Chuẩn bị sẵn hàm login cho bước tiếp theo trong video luôn
export const loginUser = async (req, res) => {
    res.json({ message: "Cổng Login cũng sẵn sàng luôn!" });
};