<template>
    <Banner />
    <!-- 公司简介 -->
    <div class="fengcai_1">
        <div class="container clearfix">
            <div class="fengcai_1_title">
                <img src="@/assets/images/about/gs1.png" />
            </div>
            <div class="row clearfix">
                <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <div v-for="paragraph in companyProfile" :key="paragraph.id" class="paragraph">
                        <p>{{ paragraph.txt }}</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 img-row" style="margin-top: 22px;">
                    <img 
            v-for="(img, index) in profileImages" 
            :key="index"
            :src="`/src/assets/images/about/${img}`"
            :alt="`公司形象图${index + 1}`"          />
                </div>
            </div>
        </div>
    </div>


   <!-- 企业文化 -->
  <h2>企业文化<br><span class="line_span"></span></h2>
  <div class="row justify-content-center text-center">
    <div 
      v-for="item in companyCulture" 
      :key="item.id" 
      class="col-sm-4 col-xs-12 part2"
    >
      <dl>
        <dt>
          <p>
            <img :src="`/src/assets/images/about/${item.icon_img}`" />
          </p>
          <h3>{{ item.title }}</h3>
        </dt>
        <dd v-for="(text, index) in item.content" :key="index">
          <span v-if="index % 2 === 1">{{ text }}</span>
          <template v-else>{{ text }}</template>
        </dd>
      </dl>
    </div>
  </div>

  <!-- 荣誉资质 -->
  <section class="p-5">
    <div class="container">
      <h2 class="text-center">荣誉资质</h2>
      <p class="lead text-center mb-5">我们获得的各项专业认证与荣誉</p>
      <div class="row">
        <div 
          v-for="honor in companyHonors" 
          :key="honor.id"
          class="col-md-6 col-lg-3"
        >
          <div class="card bg-light">
            <div class="card-body text-center">
              <img 
                :src="`/src/assets/images/about/${honor.image}`" 
                class="mb-3"
              />
              <h3 class="card-title">{{ honor.title }}</h3>
              <p class="card-text">{{ honor.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 所有数据状态
const companyProfile = ref<{id: number, txt: string}[]>([]);
const profileImages = ref<string[]>([]);
const companyCulture = ref<CultureItem[]>([]);
const companyHonors = ref<HonorItem[]>([]);

// 类型定义
interface CultureItem {
  id: number;
  title: string;
  content: string[];
  icon_img: string;
}

interface HonorItem {
  id: number;
  title: string;
  description: string;
  image: string;
}
// 数据获取方法
const fetchData = async () => {
  try {
    const [profileRes, imagesRes, cultureRes, honorsRes] = await Promise.all([
      axios.get('/api/company-profile'),
      axios.get('/api/about-images'),
      axios.get('/api/company-info/culture'),
      axios.get('/api/company-info/honors')
    ]);
    
    companyProfile.value = profileRes.data;
    profileImages.value = imagesRes.data;
    companyCulture.value = cultureRes.data;
    companyHonors.value = honorsRes.data;
    
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};

onMounted(fetchData);


</script>

<style scoped>
.fengcai_1 {
    width: 100%;
    background: url(@/assets/images/about/fcbg.jpg;) no-repeat bottom center #32a463;
    padding: 50px 0px;
}

.fengcai_1_title {
    max-width: 348px;
    width: 60%;
    margin-top: 20px;
    margin-bottom: 40px;
}

.container {
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
}

.fengcai_1 .col-lg-8 p {
    font-size: 16px;
    line-height: 36px;
    margin-bottom: 10px;
    color: #fff;
    text-indent: 32px;
    text-align: justify;
}

h2 {
    font-family: "Microsoft YaHei", "Source Sans Pro", Calibri, Candara, Arial, sans-serif;
    font-weight: 300;
    line-height: 1.1;
    color: inherit;
    text-align: center;
    font-size: 40px;
    margin-top: 50px;
}
</style>