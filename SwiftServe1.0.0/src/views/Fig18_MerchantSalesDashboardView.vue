<template>
  <HeaderScreen />
  <div class="sales-dashboard">
    <DashboardHeader @period-selected="updatePeriod" />
    <div class="sales-section">
      <SalesOverview :selectedPeriod="selectedPeriod" />
    </div>
    <div class="popular-items-section">
      <PopularItems :selectedPeriod="selectedPeriod" />
    </div>
  </div>
</template>
<script>
import DashboardHeader from '@/components/Fig18_MerchantSalesDashboardPage/DashboardHeader.vue';
import SalesOverview from '@/components/Fig18_MerchantSalesDashboardPage/SalesOverview.vue';
import PopularItems from '@/components/Fig18_MerchantSalesDashboardPage/PopularItems.vue';
import HeaderScreen from '@/components/FigX_UniversalHeader/MerchantUniversalHeader.vue';

export default {
  name: "SalesDashboard",
  components: {
    DashboardHeader,
    HeaderScreen,
    SalesOverview,
    PopularItems
  },
  data() {
    return {
      selectedPeriod: 'day', // Default to 'day'
    };
  },
  methods: {
    updatePeriod(period) {
      this.selectedPeriod = period;
    }
  }
}
</script>

<style scoped>
.sales-dashboard {
  width: 80vw;
  margin-left: 10vw;
  overflow: auto;
  height: 40vw;
}
</style>