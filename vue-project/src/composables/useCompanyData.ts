import { ref, onMounted } from 'vue';
import { axiosInstance } from '@/api/index'

interface CompanyData {
  profile: { id: number; txt: string }[];
  images: string[];
  culture: {
    id: number;
    title: string;
    content: string[];
    icon_img: string;
  }[];
  honor: {
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
    honor: []
  });
  const loading = ref(true);
  const error = ref<string | null>(null);
  const retryCount = ref(0);
  const MAX_RETRIES = 2;

  const fetchData = async () => {
    try {
      loading.value = true;
      error.value = null;

      const [profileRes, imagesRes, cultureRes, honorRes] = await Promise.all([
        axiosInstance.get('/companyProfile'),
        axiosInstance.get('/about-images'),
        axiosInstance.get('/culture'),
        axiosInstance.get('/honor')
      ]);

      data.value = {
        profile: profileRes.data,
        images: imagesRes.data,
        culture: cultureRes.data,
        honor: honorRes.data
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