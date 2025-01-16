import React from "react";
import { Container, Typography, Box } from "@mui/material";
import anh1 from "../../assets/bien-dien-thoai-di-dong-1.jpg";
import anh2 from "../../assets/Sliding-Preord.webp";
import anh3 from "../../assets/samsung-s24-ultra-home-20-11.webp";

const IntroPage: React.FC = () => {
  return (
    <div className="container-xl bg-white rounded shadow-sm p-4">
      <section className="page">
        <Container
          maxWidth="lg"
          sx={{ paddingTop: "15px", marginBottom: "20px" }}
        >
          <Box className="pg_page block-background padding-top-15">
            <Box className="row">
              <Box className="col-12">
                <Box className="page-title category-title">
                  <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    color="primary"
                    sx={{ marginBottom: "20px" }}
                  >
                    Giới thiệu
                  </Typography>
                </Box>

                <div className="content-page rte">
                  {/* Section 1 - Ảnh bên phải, chữ bên trái */}
                  <Box
                    className="row"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Text */}
                    <Box className="col-6" sx={{ flex: "1 1 50%" }}>
                      <p>
                        Chào mừng bạn đến với Smart Shop, nền tảng mua sắm trực
                        tuyến hàng đầu chuyên cung cấp các dòng sản phẩm điện
                        thoại thông minh từ các thương hiệu nổi tiếng.
                      </p>
                    </Box>
                    {/* Image */}
                    <Box
                      className="col-6"
                      sx={{
                        flex: "1 1 50%",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={anh1}
                        alt="FPT Shop"
                        style={{
                          width: "300px", // Kích thước ảnh lớn hơn
                          height: "300px", // Đảm bảo ảnh là hình vuông
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Section 2 - Ảnh bên trái, chữ bên phải */}
                  <Box
                    className="row"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                      flexDirection: "row-reverse", // Đảo thứ tự
                    }}
                  >
                    {/* Text */}
                    <Box className="col-6" sx={{ flex: "1 1 50%" }}>
                      <p>
                        Tại Smart Shop, bạn sẽ tìm thấy một giao diện mua sắm
                        thân thiện, hiện đại và dễ sử dụng. Trang web của chúng
                        tôi cung cấp thông tin chi tiết về từng sản phẩm, từ các
                        dòng điện thoại phổ biến như iPhone, Samsung, Xiaomi,
                        đảm bảo bạn dễ dàng tìm được sản phẩm phù hợp với nhu
                        cầu.
                      </p>
                    </Box>
                    {/* Image */}
                    <Box
                      className="col-6"
                      sx={{
                        flex: "1 1 50%",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={anh2}
                        alt="Shop phụ kiện"
                        style={{
                          width: "300px", // Kích thước ảnh lớn hơn
                          height: "300px", // Đảm bảo ảnh là hình vuông
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Section 3 - Ảnh bên phải, chữ bên trái */}
                  <Box
                    className="row"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Text */}
                    <Box className="col-6" sx={{ flex: "1 1 50%" }}>
                      <p>
                        Chúng tôi cam kết: Sản phẩm chính hãng, giá cả cạnh tranh
                        và hỗ trợ tận tâm. Ngoài ra, Smart Shop còn cung cấp các
                        dịch vụ bảo hành và sửa chữa với đội ngũ kỹ thuật viên
                        giàu kinh nghiệm.
                      </p>
                    </Box>
                    {/* Image */}
                    <Box
                      className="col-6"
                      sx={{
                        flex: "1 1 50%",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={anh3}
                        alt="Dịch vụ quản lý bán hàng"
                        style={{
                          width: "300px", // Kích thước ảnh lớn hơn
                          height: "300px", // Đảm bảo ảnh là hình vuông
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>
                </div>
              </Box>
            </Box>
          </Box>
        </Container>
      </section>
    </div>
  );
};

export default IntroPage;
