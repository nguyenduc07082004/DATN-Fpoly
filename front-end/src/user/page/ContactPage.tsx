import React, { useState } from "react";
import { LocationOn, Phone, Email, Fax } from "@mui/icons-material";
import Logo from "../../assets/logoshop.jpg"; // Đảm bảo rằng đường dẫn logo chính xác
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Grid,
  Container,
} from "@mui/material";

interface Shop {
  Logo: string;
  Name: string;
  Address: string;
  Phone: string;
  Hotline: string;
  Fax: string;
  Email: string;
}

interface MapItem {
  Id: number;
  Name: string;
  Coordinates: [number, number];
}

const ContactPage: React.FC = () => {
  const [shop] = useState<Shop>({
    Logo: Logo, // Đảm bảo logo đã được import chính xác
    Name: "Smart Shop",
    Address:
      "Tòa nhà FPT Polytechnic., Cổng số 2, 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội", // Địa chỉ cụ thể
    Phone: "012345678",
    Hotline: "012345678",
    Fax: "0123456789",
    Email: "smartshop@gmail.com",
  });

  const [maps] = useState<MapItem[]>([
    { Id: 1, Name: "Location 1", Coordinates: [51.505, -0.09] },
    { Id: 2, Name: "Location 2", Coordinates: [51.515, -0.1] },
  ]);

  return (
    <Container
      maxWidth="lg"
      sx={{ padding: "40px 20px", backgroundColor: "#f9f9f9" }}
    >
      <Typography variant="h3" align="center" color="primary" gutterBottom>
        Thông tin liên hệ
      </Typography>

      {/* Contact Section */}
      <Grid container spacing={4}>
        {/* Shop Information Card */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={5}
            sx={{
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <img
                  src={shop.Logo}
                  alt="Shop Logo"
                  style={{
                    maxWidth: "150px", // Đảm bảo logo không bị phóng đại
                    height: "auto",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />
                <Typography variant="h5" color="primary" gutterBottom>
                  {shop.Name}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <LocationOn sx={{ marginRight: 1 }} /> {shop.Address}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Phone sx={{ marginRight: 1 }} /> {shop.Phone}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Phone sx={{ marginRight: 1 }} /> {shop.Hotline}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <Fax sx={{ marginRight: 1 }} /> {shop.Fax}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Email sx={{ marginRight: 1 }} />{" "}
                  <a href={`mailto:${shop.Email}`} style={{ color: "#1976d2" }}>
                    {shop.Email}
                  </a>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Map Section (formerly contact form) */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={5}
            sx={{
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Vị trí cửa hàng
              </Typography>

              <Box
                sx={{
                  marginTop: 3,
                  marginBottom: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7447.553202766915!2d105.74160529143377!3d21.04162292244345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1733497341143!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "10px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;
