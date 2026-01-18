<template>
  <div class="card fossil-card border-2 border-dark p-0 overflow-hidden mb-4 shadow-sm">
    <div
      class="card-header bg-dark text-warning fw-black text-uppercase border-bottom border-warning rounded-0 p-3"
    >
      <i class="bi bi-cpu-fill me-2"></i>Status do Terminal
    </div>
    <div
      class="card-body bg-light-industrial font-monospace small fw-bold"
    >
      <ul class="list-unstyled m-0 text-dark-jungle">
        
        <li class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle">
          <span>
            <i :class="batteryIcon" class="me-1"></i>Rede Elétrica
          </span>
          <span :class="batteryColor">
            {{ batteryLevel }}% [{{ batteryStatus }}]
          </span>
        </li>

        <li class="d-flex justify-content-between mb-2 pb-2 border-bottom border-secondary-subtle">
          <span>
            <i :class="networkIcon" class="me-1"></i>Link Satélite
          </span>
          <span :class="networkColor">
            {{ networkStatus }}
          </span>
        </li>

        <li class="d-flex justify-content-between">
          <span><i class="bi bi-clock-history me-1"></i>Sincronização</span>
          <span class="text-dark">{{ currentTime }}</span>
        </li>

      </ul>
    </div>
    
    <div class="card-footer bg-secondary-subtle p-1 text-center border-top border-dark-subtle">
      <small class="font-monospace x-small text-muted">{{ currentDate }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

// --- BATERIA ---
const batteryLevel = ref(100);
const isCharging = ref(false);
const isBatterySupported = ref(false);

const updateBattery = (battery: any) => {
  batteryLevel.value = Math.round(battery.level * 100);
  isCharging.value = battery.charging;
};

// Ícone dinâmico da bateria
const batteryIcon = computed(() => {
  if (isCharging.value) return 'bi bi-plug-fill';
  if (batteryLevel.value > 90) return 'bi bi-battery-full';
  if (batteryLevel.value > 50) return 'bi bi-battery-half';
  return 'bi bi-battery';
});

// Status de texto e cor
const batteryStatus = computed(() => isCharging.value ? 'FONTE EXT.' : 'BATERIA');
const batteryColor = computed(() => {
  if (batteryLevel.value < 20 && !isCharging.value) return 'text-danger animate-pulse'; // Alerta de bateria fraca
  if (batteryLevel.value < 50) return 'text-warning';
  return 'text-success';
});

// --- INTERNET ---
const isOnline = ref(navigator.onLine);
const connectionType = ref('');

const updateNetworkStatus = () => {
  isOnline.value = navigator.onLine;
  
  // Tenta pegar detalhes da conexão (Chrome/Edge/Android)
  const nav = navigator as any;
  if (nav.connection) {
    connectionType.value = nav.connection.effectiveType 
      ? `[${nav.connection.effectiveType.toUpperCase()}]` 
      : '';
  }
};

const networkStatus = computed(() => isOnline.value ? `ONLINE ${connectionType.value}` : 'FALHA DE SINAL');
const networkColor = computed(() => isOnline.value ? 'text-success' : 'text-danger animate-pulse');
const networkIcon = computed(() => isOnline.value ? 'bi bi-wifi' : 'bi bi-wifi-off');

// --- RELÓGIO ---
const currentTime = ref('');
const currentDate = ref('');
let timerInterval: number;

const updateTime = () => {
  const now = new Date();
  // Formato HH:mm:ss
  currentTime.value = now.toLocaleTimeString('pt-BR', { hour12: false });
  // Data por extenso
  currentDate.value = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase();
};

// --- LIFECYCLE ---
onMounted(async () => {
  // 1. Inicializar Relógio
  updateTime();
  timerInterval = setInterval(updateTime, 1000);

  // 2. Inicializar Rede
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

  // 3. Inicializar Bateria (API Moderna)
  const nav = navigator as any;
  if (nav.getBattery) {
    isBatterySupported.value = true;
    try {
      const battery = await nav.getBattery();
      updateBattery(battery);
      
      // Listeners para mudanças
      battery.addEventListener('levelchange', () => updateBattery(battery));
      battery.addEventListener('chargingchange', () => updateBattery(battery));
    } catch (e) {
      console.error("Erro ao acessar bateria", e);
    }
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
  window.removeEventListener('online', updateNetworkStatus);
  window.removeEventListener('offline', updateNetworkStatus);
});
</script>

<style scoped>
.fw-black {
  font-weight: 900;
}
.fossil-card {
  border-radius: 2px;
}
.bg-light-industrial {
  background-color: #f0f0f0;
}
.text-dark-jungle {
  color: #1a2f2b;
}
.x-small {
  font-size: 0.7rem;
  letter-spacing: 1px;
}

/* Animação de Pulso para Alertas (Bateria fraca ou Sem Net) */
.animate-pulse {
  animation: pulse 1.5s infinite;
  font-weight: bold;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>