const produkUmkm = [
  { nama: "Kopi Susu", kategori: "Kopi", harga: 20000, stok: 12, unggulan: true },
  { nama: "Kopi Americano", kategori: "Kopi", harga: 15000, stok: 4, unggulan: true },
  { nama: "Kopi Espresso", kategori: "Kopi", harga: 25000, stok: 8, unggulan: false },
  { nama: "Kopi Cold Brew", kategori: "Bundling", harga: 30000, stok: 2, unggulan: false }
];

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "empty" };
  }
  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }
  return { label: "Tersedia", className: "" };
}

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

function buatelemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stockSpan = document.createElement("span");
  const status = statusStok(produk.stok);
  stockSpan.classList.add("stock-badge");
  if (status.className) {
    stockSpan.classList.add(status.className);
  }
  stockSpan.textContent = status.label;

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("product-content");
  contentDiv.append(title, category, price, stockSpan);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

  contentDiv.append(removeButton);

  card.append(contentDiv);
  return card;
}

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  console.log(`Render kategori aktif: ${kategoriAktif}`);

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditampilkan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatelemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

if (tombolFilter.length > 0) {
  tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
      const tombolAktif = event.currentTarget;
      const kategori = tombolAktif.dataset.filter;

      tombolFilter.forEach((item) => item.classList.remove("is-active"));
      tombolAktif.classList.add("is-active");

      renderProduk(kategori);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProduk("Semua");
});