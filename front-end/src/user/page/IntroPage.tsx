import React from "react";
import { Container, Typography, Box } from "@mui/material";

const IntroPage: React.FC = () => {
  return (
    <section className="page">
      <Container
        maxWidth="lg"
        sx={{ paddingTop: "15px", marginBottom: "20px" }}
      >
        <Box className="pg_page padding-top-15 block-background">
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
                  Chào mừng bạn đến với Smart Shop, nền tảng mua sắm trực tuyến
                  hàng đầu chuyên cung cấp các dòng sản phẩm điện thoại thông
                  minh từ các thương hiệu nổi tiếng. Với niềm đam mê công nghệ
                  và cam kết mang lại trải nghiệm mua sắm tốt nhất, chúng tôi tự
                  hào là người bạn đồng hành đáng tin cậy cho mọi khách hàng yêu
                  thích công nghệ.
                </p>
                <p>
                  Tại Smart Shop, bạn sẽ tìm thấy một giao diện mua sắm thân
                  thiện, hiện đại và dễ sử dụng. Trang web của chúng tôi cung
                  cấp thông tin chi tiết về từng sản phẩm, từ các dòng điện
                  thoại phổ biến như iPhone, Samsung, Xiaomi đảm bảo bạn dễ dàng
                  tìm được sản phẩm phù hợp với nhu cầu.
                </p>
                <p>
                  Chúng tôi cam kết: Sản phẩm chính hãng: Tất cả các sản phẩm
                  tại Smart Shop đều được nhập khẩu từ các nhà phân phối uy tín,
                  đảm bảo chất lượng và hiệu suất tối ưu. Giá cả cạnh tranh: Đưa
                  đến khách hàng mức giá hợp lý nhất cùng nhiều chương trình
                  khuyến mãi hấp dẫn. Hỗ trợ tận tâm: Đội ngũ nhân viên tư vấn
                  chuyên nghiệp sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn lựa
                  chọn sản phẩm phù hợp. Giao hàng nhanh chóng: Dịch vụ vận
                  chuyển toàn quốc, đảm bảo sản phẩm đến tay bạn trong thời gian
                  sớm nhất.
                </p>
                <p>
                  Ngoài ra, Smart Shop còn cung cấp các dịch vụ bảo hành và sửa
                  chữa với đội ngũ kỹ thuật viên giàu kinh nghiệm, giúp bạn an
                  tâm trong suốt quá trình sử dụng sản phẩm.
                </p>
                <p>
                  Với sứ mệnh mang đến sự hài lòng tối đa cho khách hàng, Smart
                  Shop không ngừng cải tiến chất lượng sản phẩm và dịch vụ. Hãy
                  truy cập trang web của chúng tôi ngay hôm nay để khám phá thế
                  giới công nghệ đẳng cấp và tận hưởng trải nghiệm mua sắm trực
                  tuyến tuyệt vời!
                </p>
              </div>
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default IntroPage;
