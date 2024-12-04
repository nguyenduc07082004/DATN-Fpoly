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
                  Dola Phone là một cửa hàng độc lập chuyên cung cấp các sản
                  phẩm công nghệ của hãng Apple huyền thoại. Với niềm đam mê về
                  công nghệ và sự tận tụy trong dịch vụ khách hàng, chúng tôi tự
                  hào là người bạn đồng hành tin cậy cho những người yêu thích
                  các sản phẩm của Apple.
                </p>
                <p>
                  Đến với Dola Phone, bạn sẽ được trải nghiệm một không gian mua
                  sắm thân thiện và chuyên nghiệp. Chúng tôi tự hào về đội ngũ
                  nhân viên giàu kinh nghiệm và am hiểu sâu về các sản phẩm của
                  Apple, luôn sẵn sàng tư vấn và hỗ trợ bạn tìm hiểu về từng sản
                  phẩm một, từ điện thoại thông minh iPhone, máy tính bảng iPad
                  cho đến laptop Macbook, đảm bảo bạn sẽ tìm thấy được sự lựa
                  chọn hoàn hảo.
                </p>
                <p>
                  Với cam kết mang đến sự hài lòng tuyệt đối cho khách hàng,
                  Dola Phone chú trọng vào chất lượng sản phẩm và dịch vụ tốt
                  nhất. Chúng tôi cam kết chỉ cung cấp các sản phẩm chính hãng
                  từ Apple, đảm bảo chất lượng và hiệu suất tối ưu của từng
                  thiết bị.
                </p>
                <p>
                  Hơn nữa, Dola Phone cũng tự hào là một địa chỉ tin cậy để bạn
                  bảo dưỡng và sửa chữa các sản phẩm của Apple. Đội ngũ kỹ thuật
                  viên giàu kinh nghiệm của chúng tôi sẽ nhanh chóng và chính
                  xác khắc phục các vấn đề kỹ thuật của thiết bị của bạn, đảm
                  bảo rằng bạn luôn có được trải nghiệm tốt nhất từ các sản phẩm
                  Apple yêu thích của mình.
                </p>
                <p>
                  Với sứ mệnh là cung cấp sự xuất sắc và dịch vụ chất lượng,
                  Dola Phone mong muốn trở thành địa chỉ mua sắm lý tưởng cho
                  những người yêu công nghệ và đam mê các sản phẩm của Apple.
                  Hãy đến với chúng tôi để khám phá thế giới công nghệ đẳng cấp
                  và tận hưởng sự phục vụ tận tâm từ đội ngũ chuyên gia của
                  chúng tôi.
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
