<template>
  <div
    class="modal fade"
    id="relicsVaultModal"
    tabindex="-1"
    aria-hidden="true"
    ref="modalRef"
  >
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content bg-dark border-2 border-warning shadow-lg">
        <div class="modal-header bg-black border-bottom border-warning py-3">
          <div class="d-flex align-items-center gap-3">
            <div
              class="bg-warning text-dark p-2 rounded-1 d-flex align-items-center justify-content-center"
              style="width: 45px; height: 45px"
            >
              <i class="bi bi-safe2-fill fs-3"></i>
            </div>
            <div>
              <h5
                class="modal-title fw-black text-uppercase text-light tracking-wide m-0 lh-1"
              >
                Cofre de Espécimes
              </h5>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span
                  class="badge bg-secondary font-monospace x-small rounded-0"
                >
                  <i class="bi bi-database-fill me-1"></i> INGEN_DB_V4
                </span>
                <span class="text-secondary font-monospace x-small">
                  TOTAL:
                  <span class="text-warning fw-bold">{{ totalItems }}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="bg-dark border-bottom border-secondary p-3">
          <div class="row g-2">
            <div class="col-md-6">
              <div class="input-group input-group-sm">
                <span
                  class="input-group-text bg-black text-secondary border-secondary"
                >
                  <i class="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control bg-black text-white border-secondary font-monospace"
                  placeholder="Buscar por nome de identificação..."
                  v-model="searchQuery"
                  @input="handleSearch"
                />
              </div>
            </div>

            <div class="col-md-6">
              <select
                class="form-select form-select-sm bg-black text-white border-secondary font-monospace text-uppercase"
                v-model="selectedRarity"
                @change="handleFilter"
              >
                <option value="">Todas as Classificações</option>
                <option value="fragment">Fragmento</option>
                <option value="partial_fossil">Fóssil Parcial</option>
                <option value="rare">Raro</option>
                <option value="exceptional_specimen">
                  Espécime Excepcional
                </option>
                <option value="unique_specimen">Espécime Único</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-body bg-concrete p-4">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-warning mb-3" role="status"></div>
            <p class="text-muted font-monospace small blink-text">
              ACESSANDO ARQUIVOS CRIPTOGRAFADOS...
            </p>
          </div>

          <div
            v-else-if="artifacts.length === 0"
            class="text-center py-5 opacity-50"
          >
            <i class="bi bi-box-seam display-1 text-secondary"></i>
            <h5 class="mt-3 text-uppercase fw-bold text-secondary">
              Nenhum item encontrado
            </h5>
            <p class="small text-muted">
              Ajuste os filtros ou explore o mundo para coletar novos itens.
            </p>
          </div>

          <div v-else class="row g-3">
            <div
              v-for="(item, index) in artifacts"
              :key="index"
              class="col-md-6 col-lg-4 col-xl-3"
            >
              <div
                class="card h-100 bg-dark border-secondary position-relative relic-card"
              >
                <div
                  class="rarity-indicator"
                  :class="getRarityClass(item.artifact.rarity)"
                ></div>

                <div class="card-body p-3 ps-4 d-flex flex-column">
                  <div class="d-flex justify-content-between mb-2">
                    <span
                      class="badge bg-black border border-secondary text-white font-monospace x-small"
                    >
                      QTD: {{ item.quantity }}
                    </span>
                    <i class="bi bi-nut-fill text-secondary opacity-25"></i>
                  </div>

                  <div
                    class="relic-image-box mb-3 rounded-1 border border-secondary bg-black position-relative overflow-hidden"
                  >
                    <div class="grid-overlay"></div>
                    <img
                      v-if="
                        item.artifact.image &&
                        !item.artifact.image.includes('placeholder')
                      "
                      :src="`http://localhost:3000/images/${item.artifact.image}`"
                      class="w-100 h-100 object-fit-cover"
                      alt="Artifact"
                    />
                    <div
                      v-else
                      class="d-flex align-items-center justify-content-center h-100 text-secondary"
                    >
                      <i
                        class="bi bi-gem fs-1 opacity-50"
                        :class="getRarityTextClass(item.artifact.rarity)"
                      ></i>
                    </div>
                  </div>

                  <h6
                    class="text-white fw-bold text-uppercase mb-1 text-truncate"
                    :title="item.artifact.name"
                  >
                    {{ item.artifact.name }}
                  </h6>

                  <div class="mb-2">
                    <span
                      class="x-small fw-bold text-uppercase"
                      :class="getRarityTextClass(item.artifact.rarity)"
                    >
                      <i class="bi bi-tag-fill me-1"></i
                      >{{ formatRarity(item.artifact.rarity) }}
                    </span>
                  </div>

                  <p
                    class="text-secondary x-small mb-0 fst-italic line-clamp-3 flex-grow-1 border-top border-secondary pt-2 mt-2"
                  >
                    {{ item.artifact.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal-footer bg-black border-top border-secondary py-1 px-3"
        >
          <div class="d-flex w-100 justify-content-between align-items-center">
            <small class="text-muted font-monospace x-small text-uppercase">
              <i class="bi bi-shield-lock me-1"></i> Acesso Seguro: Nível 1
            </small>
            <button
              type="button"
              class="btn btn-sm btn-outline-warning rounded-0 text-uppercase fw-bold px-4"
              data-bs-dismiss="modal"
            >
              Fechar Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as bootstrap from "bootstrap";
import type { ArtifactCollectionItem } from "../../types/artifact";
import artifactCollectionService from "../../services/artifactCollectionService";

const artifacts = ref<ArtifactCollectionItem[]>([]);
const totalItems = ref(0);
const loading = ref(false);
const searchQuery = ref("");
const selectedRarity = ref("");
let debounceTimer: any = null;

const open = async () => {
  const modalEl = document.getElementById("relicsVaultModal");
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    searchQuery.value = "";
    selectedRarity.value = "";
    await loadData();
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    let response;

    if (searchQuery.value.trim()) {
      response = await artifactCollectionService.searchArtifacts(
        searchQuery.value
      );
    } else if (selectedRarity.value) {
      response = await artifactCollectionService.filterByRarity(
        selectedRarity.value
      );
    } else {
      response = await artifactCollectionService.getMyCollection();
    }

    artifacts.value = response.data;
    totalItems.value = response.totalItems;
  } catch (error) {
    console.error("Erro ao carregar cofre:", error);
    artifacts.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    selectedRarity.value = "";
    loadData();
  }, 500);
};

const handleFilter = () => {
  searchQuery.value = "";
  loadData();
};

const getRarityClass = (rarity: string) => {
  const map: Record<string, string> = {
    fragment: "bg-secondary",
    partial_fossil: "bg-info",
    rare: "bg-primary",
    exceptional_specimen: "bg-warning",
    unique_specimen: "bg-danger",
  };
  return map[rarity] || "bg-secondary";
};

const getRarityTextClass = (rarity: string) => {
  const map: Record<string, string> = {
    fragment: "text-secondary",
    partial_fossil: "text-info",
    rare: "text-primary",
    exceptional_specimen: "text-warning",
    unique_specimen: "text-danger",
  };
  return map[rarity] || "text-secondary";
};

const formatRarity = (rarity: string) => {
  return rarity ? rarity.replace(/_/g, " ") : "DESCONHECIDO";
};

defineExpose({ open });
</script>

<style scoped>
.bg-concrete {
  background-color: #1a1a1a;
  background-image: radial-gradient(#333 1px, transparent 1px);
  background-size: 10px 10px;
}

.fw-black {
  font-weight: 900;
}
.x-small {
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.relic-card {
  border-left: 0;
  transition: all 0.2s ease;
  background-color: #212529;
}

.relic-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-color: #fff !important;
}

.rarity-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
}

.relic-image-box {
  height: 140px;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 10;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blink-text {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.form-control::placeholder {
  color: #6c757d;
}
.form-control:focus,
.form-select:focus {
  box-shadow: none;
  border-color: #ffc107;
}
.object-fit-cover {
  object-fit: cover;
}
</style>
