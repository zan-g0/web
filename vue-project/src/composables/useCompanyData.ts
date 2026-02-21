import { ref, onMounted } from 'vue';
import axios from 'axios';

interface CompanyData {
  profile: { id: number; txt: string }[];
  images: string[];
  culture: {
    id: number;
    title: string;
    content: string[];
    icon_img: string;
  }[];
  honors: {
    id: number;
    title: string;
    description: string;
    image: string;
  }[];
}

export function useCompanyData() {
  const data = ref<CompanyData>({
    profile: [],
    images: [],
    culture: [],
    honors: []
  });
  const loading = ref(true);
  const error = ref<string | null>(null);
  const retryCount = ref(0);
  const MAX_RETRIES = 2;

  const fetchData = async () => {
    try {
      loading.value = true;
      error.value = null;

      const [profileRes, imagesRes, cultureRes, honorsRes] = await Promise.all([
        axios.get('/api/companyProfile'),
        axios.get('/api/about-images'),
        axios.get('/api/company-info/culture'),
        axios.get('/api/company-info/honors')
      ]);

      data.value = {
        profile: profileRes.data,
        images: imagesRes.data,
        culture: cultureRes.data,
        honors: honorsRes.data
      };
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to load company data';

      if (retryCount.value < MAX_RETRIES) {
        retryCount.value++;
        console.warn(`Retrying... (${retryCount.value}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount.value));
        await fetchData();
      } else {
        error.value = errorMessage;
        console.error('Data loading failed after retries:', errorMessage);
      }
    } finally {
      loading.value = false;
    }
  };

  const retry = () => {
    retryCount.value = 0;
    fetchData();
  };

  onMounted(fetchData);

  return {
    data,
    loading,
    error,
    retry
  };
}