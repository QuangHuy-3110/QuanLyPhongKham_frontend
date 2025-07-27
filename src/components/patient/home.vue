<template>
  <div class="home-page">
    <!-- Header Section -->
    <header class="header">
      <div class="container">
        <h1>Phòng Khám</h1>
        <p>Đồng hành cùng bạn vì một cuộc sống khỏe mạnh và hạnh phúc</p>
        <!-- <button class="cta-button">Khám Phá Dịch Vụ</button> -->
      </div>
    </header>

    <!-- About Section -->
    <section class="about">
      <div class="container">
        <h2>Giới Thiệu Phòng Khám</h2>
        <div class="about-content">
          <div class="about-text">
            <p>
              Phòng Khám của chúng tôi được thành lập với sứ mệnh mang lại dịch vụ y tế chất lượng cao, 
              tận tâm và chuyên nghiệp. Chúng tôi tự hào là đơn vị tiên phong trong việc ứng dụng công nghệ y khoa hiện đại, 
              kết hợp với đội ngũ bác sĩ giàu kinh nghiệm để cung cấp các giải pháp chăm sóc sức khỏe toàn diện. 
            </p>
            <p>
              Với triết lý "Sức khỏe là nền tảng của hạnh phúc", phòng khám không chỉ tập trung vào điều trị mà còn chú trọng 
              phòng ngừa và nâng cao chất lượng cuộc sống cho bệnh nhân. Cơ sở vật chất hiện đại, môi trường thân thiện và 
              quy trình khám chữa bệnh tối ưu là những điểm mạnh giúp chúng tôi nhận được sự tin tưởng từ hàng ngàn bệnh nhân.
            </p>
          </div>
          <div class="about-image">
            <img src="https://phongsachyte.vn/wp-content/uploads/2024/08/tieu-chuan-thiet-ke-phong-kham-da-khoa.png" style="height: 300px;" alt="Phòng khám" />
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services">
      <div class="container">
        <h2>Dịch Vụ Nổi Bật</h2>
        <div class="service-grid">
          <div class="service-card" v-for="service in services" :key="service.id">
            <img :src="service.image" :alt="service.title" />
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <span class="service-highlight">{{ service.highlight }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Doctors Section -->
    <section class="doctors">
      <div class="container">
        <h2>Đội Ngũ Bác Sĩ</h2>
        <div class="doctor-grid">
          <div class="doctor-card" v-for="doctor in doctors" :key="doctor.id">
            <img :src="doctor.image" :alt="doctor.name" style="height: 200px;"/>
            <h3>{{ doctor.name }}</h3>
            <p>{{ doctor.specialty }}</p>
            <p class="experience">{{ doctor.experience }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <h2>Ý Kiến Bệnh Nhân</h2>
        <div class="testimonial-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <p class="quote">"{{ testimonial.quote }}"</p>
            <p class="author">- {{ testimonial.author }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      services: [
        {
          id: 1,
          title: 'Khám Tổng Quát',
          description: 'Kiểm tra sức khỏe toàn diện để phát hiện sớm các vấn đề.',
          image: 'https://medlatec.vn/media/2403/content/20230222_kham-tong-quat-bao-nhieu-tien-1.jpg',
          highlight: 'Miễn phí tư vấn sau khám'
        },
        {
          id: 3,
          title: 'Tư Vấn Dinh Dưỡng',
          description: 'Lập kế hoạch ăn uống cá nhân hóa cho sức khỏe tối ưu.',
          image: 'https://yduocvietnam.edu.vn/wp-content/uploads/2024/10/khoa-hoc-tu-van-dinh-duong-1.jpg',
          highlight: 'Hỗ trợ theo dõi dài hạn'
        },
        {
          id: 4,
          title: 'Vật Lý Trị Liệu',
          description: 'Phục hồi chức năng với các phương pháp hiện đại.',
          image: 'https://haiminhtsc.vn/wp-content/uploads/2023/02/massage-vat-ly-tri-lieu-2.jpeg',
          highlight: 'Đội ngũ chuyên gia'
        }
      ],
      doctors: [
        {
          id: 1,
          name: 'BS. Nguyễn Văn A',
          specialty: 'Bác sĩ Nội khoa',
          experience: '15 năm kinh nghiệm',
          image: 'https://cdn-icons-png.flaticon.com/512/2991/2991292.png'
        },
        {
          id: 2,
          name: 'BS. Trần Thị B',
          specialty: 'Bác sĩ Nhi khoa',
          experience: '12 năm kinh nghiệm',
          image: 'https://cdn-icons-png.flaticon.com/512/9411/9411434.png'
        },
        {
          id: 3,
          name: 'BS. Lê Minh C',
          specialty: 'Bác sĩ Tim mạch',
          experience: '18 năm kinh nghiệm',
          image: 'https://cdn-icons-png.flaticon.com/512/2991/2991292.png'
        }
      ],
      testimonials: [
        {
          id: 1,
          quote: 'Dịch vụ rất chuyên nghiệp, bác sĩ tận tâm và cơ sở vật chất hiện đại. Tôi rất hài lòng!',
          author: 'Nguyễn Thị Mai, 34 tuổi'
        },
        {
          id: 2,
          quote: 'Khám tổng quát ở đây giúp tôi phát hiện sớm vấn đề sức khỏe. Cảm ơn đội ngũ bác sĩ!',
          author: 'Trần Văn Hùng, 45 tuổi'
        },
        {
          id: 3,
          quote: 'Tư vấn dinh dưỡng rất chi tiết, giúp tôi cải thiện sức khỏe rõ rệt.',
          author: 'Lê Thanh Hương, 28 tuổi'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home-page {
  font-family: Arial, sans-serif;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-image: url('https://phongsachyte.vn/wp-content/uploads/2024/08/tieu-chuan-chieu-cao-phong-kham-da-khoa.jpeg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 80px 20px;
  position: relative;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Lớp phủ tối để chữ dễ đọc */
  z-index: 1;
}

.header .container {
  position: relative;
  z-index: 2;
}

.header h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
}

.header p {
  font-size: 1.2rem;
}

.cta-button {
  background: #28a745;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
}

.cta-button:hover {
  background: #218838;
}

.about {
  padding: 60px 0;
  background: #f9f9f9;
}

.about h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2rem;
}

.about-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.about-text {
  flex: 1;
}

.about-text p {
  line-height: 1.7;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.about-image img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.services, .doctors, .testimonials {
  padding: 60px 0;
}

.services h2, .doctors h2, .testimonials h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
}

.service-grid, .doctor-grid, .testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.service-card, .doctor-card, .testimonial-card {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.service-card img, .doctor-card img {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
}

.service-card h3, .doctor-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.service-highlight {
  display: block;
  color: #28a745;
  font-weight: bold;
  margin-top: 10px;
}

.doctor-card .experience {
  color: #555;
  font-size: 0.9rem;
}

.testimonial-card .quote {
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 10px;
}

.testimonial-card .author {
  font-weight: bold;
  color: #007bff;
}
</style>