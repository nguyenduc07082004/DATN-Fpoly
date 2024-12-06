import React from "react";
import { Container, Typography, Box } from "@mui/material";
import anh1 from "../../assets/bien-dien-thoai-di-dong-1.jpg";
import anh2 from "../../assets/Sliding-Preord.webp";
import anh3 from "../../assets/samsung-s24-ultra-home-20-11.webp";

const bannerImages = [anh1, anh2, anh3];

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
                  <p>
                    Chào mừng bạn đến với Smart Shop, nền tảng mua sắm trực
                    tuyến hàng đầu chuyên cung cấp các dòng sản phẩm điện thoại
                    thông minh từ các thương hiệu nổi tiếng.
                  </p>

                  {/* Image centered and enlarged */}
                  <Box
                    sx={{
                      display: "block",
                      marginY: "20px",
                      textAlign: "center", // Centers the image
                    }}
                  >
                    <img
                      src={anh1}
                      alt="FPT Shop"
                      style={{
                        width: "60%", // Increased image size
                        maxWidth: "350px", // Set max width
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>

                  <p>
                    Tại Smart Shop, bạn sẽ tìm thấy một giao diện mua sắm thân
                    thiện, hiện đại và dễ sử dụng. Trang web của chúng tôi cung
                    cấp thông tin chi tiết về từng sản phẩm, từ các dòng điện
                    thoại phổ biến như iPhone, Samsung, Xiaomi, đảm bảo bạn dễ
                    dàng tìm được sản phẩm phù hợp với nhu cầu.
                  </p>

                  {/* Image centered and enlarged */}
                  <Box
                    sx={{
                      display: "block",
                      marginY: "20px",
                      textAlign: "center", // Centers the image
                    }}
                  >
                    <img
                      src={anh2}
                      alt="Shop phụ kiện"
                      style={{
                        width: "60%", // Increased image size
                        maxWidth: "350px", // Set max width to match other images
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>

                  <p>
                    Chúng tôi cam kết: Sản phẩm chính hãng, giá cả cạnh tranh và
                    hỗ trợ tận tâm. Ngoài ra, Smart Shop còn cung cấp các dịch
                    vụ bảo hành và sửa chữa với đội ngũ kỹ thuật viên giàu kinh
                    nghiệm.
                  </p>

                  {/* Image centered and enlarged */}
                  <Box
                    sx={{
                      display: "block",
                      marginY: "20px",
                      textAlign: "center", // Centers the image
                    }}
                  >
                    <img
                      src={anh3}
                      alt="Dịch vụ quản lý bán hàng"
                      style={{
                        width: "60%", // Increased image size
                        maxWidth: "350px", // Set max width
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>

                  <p>
                    Với sứ mệnh mang đến sự hài lòng tối đa cho khách hàng,
                    Smart Shop không ngừng cải tiến chất lượng sản phẩm và dịch
                    vụ. Hãy truy cập trang web của chúng tôi ngay hôm nay để
                    khám phá thế giới công nghệ đẳng cấp và tận hưởng trải
                    nghiệm mua sắm trực tuyến tuyệt vời!
                  </p>
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
