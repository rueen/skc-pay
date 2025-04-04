<template>
  <div class="batch-transfer-container">
    <van-nav-bar 
      title="Batch Transfer" 
      fixed
    />
    
    <div class="content">
      <div class="upload-section">
        <van-uploader
          v-model="fileList"
          :max-count="1"
          :after-read="afterRead"
          accept=".txt"
          :before-read="beforeRead"
        >
          <div class="upload-button">
            <van-button icon="plus" type="primary">Upload File</van-button>
            <div class="upload-tip">Support .txt format, one line per record</div>
          </div>
        </van-uploader>
        
        <div v-if="fileInfo.name" class="file-info">
          <div class="file-name">{{ fileInfo.name }}</div>
          <div class="file-records">Total {{ records.length }} records</div>
        </div>
      </div>
      
      <div v-if="records.length > 0" class="records-preview">
        <div class="preview-header">
          <div class="preview-title">Records Preview</div>
          <div class="preview-count">Total {{ records.length }} records</div>
        </div>
        
        <div class="records-container">
          <van-cell-group inset>
            <van-cell 
              v-for="(record, index) in records"
              :key="index"
              :title="`${record.name} - ${record.accountNumber}`"
              :value="`${record.amount}`"
              :label="record.type === 'gcash' ? 'GCash' : 'Maya'"
            />
          </van-cell-group>
        </div>
      </div>
      
      <div class="action-section">
        <van-button 
          type="primary" 
          block 
          round 
          :disabled="!records.length || processing"
          :loading="processing"
          @click="startProcessing"
        >
          Start Processing ({{ Math.min(50, records.length) }} records)
        </van-button>
      </div>
      
      <div v-if="processedRecords.length > 0" class="process-result">
        <div class="result-header">
          <div class="result-title">Processing Result</div>
          <div class="result-count">Total {{ processedRecords.length }} records</div>
        </div>
        
        <van-cell-group inset>
          <van-cell 
            v-for="(record, index) in processedRecords"
            :key="index"
            :title="`${record.name} - ${record.accountNumber}`"
            :value="`${record.amount}`"
            :label="record.status ? 'Success' : 'Failed'"
            :icon="record.status ? 'success' : 'cross'"
          />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { showToast, showDialog } from 'vant';
import { useRouter } from 'vue-router';
import { createTransfer } from '@/api';

const router = useRouter();
const fileList = ref([]);
const fileInfo = ref({ name: '', size: 0 });
const records = ref([]);
const processing = ref(false);
const processedRecords = ref([]);

// 支付渠道配置
const PAYMENT_CHANNELS = {
  gcash: {
    name: 'Gcash',
    bank: 'gcash',
    merchantId: 'skc01',
    secretKey: '0097b781a439442e1b6424e3d740efb1'
  },
  pmp: {
    name: 'Maya',
    bank: 'PMP',
    merchantId: 'skc01-paymaya',
    secretKey: '211a637b1359abf94d5a366804f204ae'
  }
};

// 文件上传前检查
const beforeRead = (file) => {
  if (file.type !== 'text/plain') {
    showToast('Please upload a txt text file');
    return false;
  }
  return true;
};

// 文件上传后处理
const afterRead = async (file) => {
  fileInfo.value = {
    name: file.file.name,
    size: file.file.size
  };
  
  try {
    const content = await readFileContent(file.file);
    parseFileContent(content);
  } catch (error) {
    showToast('File reading failed');
    console.error('File reading failed:', error);
  }
};

// 读取文件内容
const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file);
  });
};

// 解析文件内容
const parseFileContent = (content) => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const parsedRecords = [];
  
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 4) {
      const [type, amount, name, accountNumber, remark = 'no'] = parts.map(part => part.trim());
      if (type && amount && name && accountNumber) {
        // 验证类型是否支持
        if (type.toLowerCase() !== 'gcash' && type.toLowerCase() !== 'pmp') {
          showToast(`Unsupported channel type: ${type}`);
          continue;
        }
        
        parsedRecords.push({
          type: type.toLowerCase(),
          amount: parseFloat(amount),
          name,
          accountNumber,
          remark
        });
      }
    }
  }
  if (parsedRecords.length === 0) {
    showToast('No valid records found');
  } else if (parsedRecords.length > 50) {
    showDialog({
      message:'Records number exceeds 50, only the first 50 will be processed'
    });
  }
  records.value = parsedRecords.slice(0, 50);
};

// 生成订单号
const generateOrderNo = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER${timestamp}${random}`;
};

// 开始处理批量交易
const startProcessing = async () => {
  if (records.value.length === 0) {
    showToast('No records to process');
    return;
  }
  
  const recordsToProcess = records.value.slice(0, 50);
  
  try {
    processing.value = true;
    processedRecords.value = [];
    for (const record of recordsToProcess) {
      try {
        const channel = PAYMENT_CHANNELS[record.type];
        const requestData = {
          merchant: channel.merchantId,
          bank: channel.bank,
          bank_card_remark: record.remark,
          callback_url: 'no',
          bank_card_account: record.accountNumber,
          bank_card_name: record.name,
          order_id: generateOrderNo(),
          total_amount: record.amount,
        };
        
        // 调用API
        // const result = await createTransfer(requestData, channel.secretKey);
        
        // 记录处理结果
        processedRecords.value.push({
          ...record,
          status: true,
          message: 'Success'
        });
        
      } catch (error) {
        console.error('Processing record failed:', error);
        
        // 记录处理失败结果
        processedRecords.value.push({
          ...record,
          status: false,
          message: error.message || 'Processing failed'
        });
      }
      
      // 添加延迟，避免API请求过快
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    const successCount = processedRecords.value.filter(r => r.status).length;
    showToast(`Processing completed, Success: ${successCount}, Failed: ${processedRecords.value.length - successCount}`);
    
  } catch (error) {
    showToast('Batch processing failed');
    console.error('Batch processing failed:', error);
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
.batch-transfer-container {
  min-height: 100vh;
}

.content {
  padding: 56px 16px 20px;
}

.upload-section {
  margin: 20px 0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f8f8;
  text-align: center;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.file-info {
  margin-top: 16px;
  padding: 8px;
  background-color: #edf5ff;
  border-radius: 4px;
}

.file-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.records-preview {
  margin: 20px 0;
}

.records-container {
  max-height: 300px; /* 约等于5条记录的高度 */
  overflow-y: auto;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-header, .result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 0 8px;
}

.preview-title, .result-title {
  font-weight: bold;
  font-size: 16px;
}

.preview-count, .result-count {
  font-size: 14px;
  color: #666;
}

.action-section {
  margin: 24px 0;
}

.process-result {
  margin: 20px 0;
}
</style> 