const produkUmkm = [
  { nama: "Kopi Susu", kategori: "Kopi", harga: 20000, stok: 12, unggulan: true },
  { nama: "Kopi Americano", kategori: "Kopi", harga: 15000, stok: 4, unggulan: true },
  { nama: "Kopi Espresso", kategori: "Kopi", harga: 25000, stok: 8, unggulan: false },
  { nama: "Kopi Cold Brew", kategori: "Kopi", harga: 30000, stok: 2, unggulan: false }
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
    return { label: "Habis", className: "warning" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${produk.kategori}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi":
      return "Produk kopi pilihan";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}


function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");


  const jumlahBarisTabel = document.querySelectorAll("table tbody tr").length;
  const captionTabelText = document.querySelector("table caption") ? document.querySelector("table caption").textContent : "";

  console.log(`Jumlah produk pada tabel: ${jumlahBarisTabel}`);
  console.log(`Caption tabel: ${captionTabelText}`);

  // Debugging terarah menggunakan forEach
  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });

  // Menampilkan ke DOM
  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

  console.log(`Jumlah produk tersedia: ${produkTersedia.length}`);

  unggulan.textContent = produkUnggulan 
    ? `Produk unggulan: ${produkUnggulan.nama}` 
    : "Belum ada produk unggulan.";

  console.table(produkUmkm);
}

document.addEventListener("DOMContentLoaded", renderProduk);