<template>
  <div class="transfer-container">
    <van-nav-bar 
      title="Transfer" 
      fixed
    />
    
    <div class="content">
      <van-form @submit="onSubmit">
        <van-tabs v-model:active="activePaymentMethod" @change="onTabChange">
          <van-tab title="Gcash" name="GCASH">
            <div class="channel-info">
              <div class="channel-logo">G</div>
              <div class="channel-name">Gcash</div>
            </div>
          </van-tab>
          <van-tab title="Maya" name="MAYA">
            <div class="channel-info">
              <div class="channel-logo">M</div>
              <div class="channel-name">Maya</div>
            </div>
          </van-tab>
        </van-tabs>
        
        <div class="form-group">
          <van-field
            v-model="formData.accountNumber"
            name="accountNumber"
            label="account"
            placeholder="please input account"
            :rules="[{ required: true, message: 'please input account' }]"
          />
          
          <van-field
            v-model="formData.accountName"
            name="accountName"
            label="name"
            placeholder="please input name"
            :rules="[{ required: true, message: 'please input name' }]"
          />
          
          <van-field
            v-model="formData.amount"
            type="number"
            name="amount"
            label="amount"
            placeholder="please input amount"
            :rules="[
              { required: true, message: 'please input amount' },
              { validator: validateAmount, message: 'amount must be greater than 0' }
            ]"
          />
        </div>
        
        <div class="submit-btn">
          <van-button type="primary" block round native-type="submit" :loading="loading">
            submit
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { showToast } from 'vant';
import { createTransfer } from '@/api';

const activePaymentMethod = ref('GCASH');
const loading = ref(false);
// 支付渠道配置
const PAYMENT_CHANNELS = {
  GCASH: {
    name: 'Gcash',
    bank: 'gcash',
    merchantId: 'skc01',
    secretKey: '0097b781a439442e1b6424e3d740efb1'
  },
  MAYA: {
    name: 'Maya',
    bank: 'PMP',
    merchantId: 'skc01-paymaya',
    secretKey: '211a637b1359abf94d5a366804f204ae'
  }
};

const formData = reactive({
  accountNumber: '',
  accountName: '',
  amount: '',
});

const onTabChange = (value) => {
  Object.assign(formData, {
    accountNumber: '',
    accountName: '',
    amount: '',
  });
};

const validateAmount = (value) => {
  return parseFloat(value) > 0;
};

const generateOrderNo = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER${timestamp}${random}`;
};

const onSubmit = async () => {
  try {
    loading.value = true;
    
    const channel = PAYMENT_CHANNELS[activePaymentMethod.value];
    const secretKey = channel.secretKey;
    const requestData = {
      merchant: channel.merchantId,
      bank: channel.bank,
      bank_card_remark: 'no',
      callback_url: 'no',
      bank_card_account: formData.accountNumber,
      bank_card_name: formData.accountName,
      order_id: generateOrderNo(),
      total_amount: parseFloat(formData.amount),
    };
    
    // 调用API
    const result = await createTransfer(requestData, secretKey);
    
    showToast({
      message: 'transfer request submitted',
      type: 'success'
    });
  } catch (error) {
    console.error('transfer failed:', error);
    showToast({
      message: error.message || 'transfer failed, please try again',
      type: 'fail'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.transfer-container {
  height: 100%;
}

.content {
  padding: 56px 16px 20px;
}

.channel-info {
  display: flex;
  align-items: center;
  padding: 15px 0;
}

.channel-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-right: 10px;
}

.channel-name {
  font-size: 16px;
  font-weight: 500;
}

.form-group {
  margin-top: 20px;
}

.submit-btn {
  margin-top: 30px;
}
</style> 